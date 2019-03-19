const {MongoClient, Long} = require('mongodb');
const PubSub = require('@google-cloud/pubsub');

const mongodb_uri = process.env.MONGODB_URI;
let monogdbClient;
let mongoDb;

const client = new PubSub.v1.SubscriberClient();

const project = "rxdata-test";
const subscription = "pub-score-sub-count_user";
const formattedSubscription = client.subscriptionPath(project, subscription);

const maxMessages = 1;
const request = {
  subscription: formattedSubscription,
  maxMessages: maxMessages,
};

const maximumExecutionDuration = 30000;

async function calculated(examId){
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