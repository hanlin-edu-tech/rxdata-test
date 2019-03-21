const {MongoClient, Long} = require('mongodb');

const mongodb_uri = process.env.MONGODB_URI;

const maximumExecutionDuration = 30000;

async function calculate(examId){
    let monogdbClient;
    let mongoDb;
    try{
        monogdbClient = await MongoClient.connect(mongodb_uri, { useNewUrlParser: true });
        mongoDb = monogdbClient.db("rxdata-test");

        let expireDate = new Date(new Date().getTime() - maximumExecutionDuration);
        
        let examResult = await mongoDb.collection("exam").findOneAndUpdate(
            {
                _id : examId,
                "status.countUsered" : {$exists : false},
                $or : [
                    {"status.countUser" : {$exists : false}},
                    {"status.countUser" : {$lte : expireDate}}]},
            {
                $currentDate : {"status.countUser" : true}});

        let exam = examResult.value;
        if(exam != null){
            let correctNum = 0;
            for(var i=0 ; i<exam.correct.length ; i++){
                if(exam.correct[i]){
                    correctNum += 1;
                }
            }

            let session = monogdbClient.startSession();
            session.startTransaction();

            await mongoDb.collection("exam").updateOne(
                {_id : examId},
                {$currentDate : {"status.countUsered":true}});

            await mongoDb.collection("user").updateOne(
                {_id : exam.user},
                {$inc : {
                    total : Long(exam.correct.length),
                    correct : Long(correctNum)}});

            await session.commitTransaction();
            session.endSession();
        }
    }finally{
        if(monogdbClient){
            monogdbClient.close();
        }
    }
}

module.exports = {
    calculate : calculate
};
