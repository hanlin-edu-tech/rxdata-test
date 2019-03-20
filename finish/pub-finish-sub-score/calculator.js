const {MongoClient} = require('mongodb');

const mongodb_uri = process.env.MONGODB_URI;

async function calculate(examId){
    let monogdbClient;
    let mongoDb;
    try{
        monogdbClient = await MongoClient.connect(mongodb_uri, { useNewUrlParser: true });
        mongoDb = monogdbClient.db("rxdata-test");

        let userAnswers = await mongoDb.collection("exam").aggregate([
            {$match : {_id : examId}},
            {$project : {
                questionAndAnswer : {$zip : {inputs : ["$question", "$answer"], useLongestLength : true}}}},
            {$unwind : {path : "$questionAndAnswer", includeArrayIndex : "order"}},
            {$project : {
                question : {$arrayElemAt: [ "$questionAndAnswer", 0 ]},
                answer : {$arrayElemAt: [ "$questionAndAnswer", 1 ]},
                order : 1}},
            {$lookup : {
                from : "question",
                localField : "question",
                foreignField : "_id",
                as : "question"}},
            {$unwind : "$question"},
            {$sort : {order : 1}}
        ]).toArray();

        let correct = [];
        let correctNum = 0;
        for(var i=0 ; i<userAnswers.length ; i++){
            let userAnswer = userAnswers[i];
            if(userAnswer.answer == userAnswer.question.answer){
                correct.push(true);
                correctNum += 1;
            }else{
                correct.push(false);
            }
        }

        await mongoDb.collection("exam").updateOne(
            {_id : examId}, 
            {
                $set : {
                    correct : correct, 
                    score : Math.floor(correctNum / correct.length * 100)},
                $currentDate : {"status.score" : true}});

    }finally{
        if(monogdbClient){
            monogdbClient.close();
        }
    }
}

module.exports = {
    calculate : calculate
};
