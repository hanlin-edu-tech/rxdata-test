const {MongoClient} = require('mongodb');
const PubSub = require('@google-cloud/pubsub');

const mongodb_uri = process.env.MONGODB_URI;
let monogdbClient;
let mongoDb;

const client = new PubSub.v1.SubscriberClient();

const project = "rxdata-test";
const subscription = "pub-finish-sub-score";
const formattedSubscription = client.subscriptionPath(project, subscription);

const maxMessages = 1;
const request = {
  subscription: formattedSubscription,
  maxMessages: maxMessages,
};

async function calculated(examId){
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
}

async function ack(ackId) {
    let ackRequest = {
        subscription: formattedSubscription,
        ackIds: [ackId]};
    await client.acknowledge(ackRequest, {}, (err) => {
        if(err){
            setTimeout(ack, 1000, ackId);
        }else{
            console.log(`Acknowledge ${ackId}`);
        }
    });
}

async function pull() {
    try{
        let [response] = await client.pull(request);
        let message = response.receivedMessages[0]
        console.log(`Message ${message.message.data}`);

        await calculated(message.message.data.toString());

        ack(message.ackId);
    }catch(err){
        //console.log(err);
    }
}

async function connectMongodb() {
    monogdbClient = await MongoClient.connect(mongodb_uri, { useNewUrlParser: true });
    mongoDb = monogdbClient.db("rxdata-test");
}

async function run() {
    try{
        await connectMongodb();
        while(true){
            await pull();
        }        
    }catch(err){
        if(monogdbClient){
            monogdbClient.close();
        }
        console.log(err);
    }
}

run();