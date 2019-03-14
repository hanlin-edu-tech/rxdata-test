const {MongoClient} = require('mongodb');
const PubSub = require('@google-cloud/pubsub');
const Firestore = require('@google-cloud/firestore');

const google_application_credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const mongodb_uri = process.env.MONGODB_URI;
let monogdbClient;
let mongoDb;

const client = new PubSub.v1.SubscriberClient();

const project = "rxdata-test";
const subscription = "pub-score-sub-firestore";
const formattedSubscription = client.subscriptionPath(project, subscription);

const maxMessages = 1;
const request = {
    subscription: formattedSubscription,
    maxMessages: maxMessages,
};


const fireDb = new Firestore({
    projectId: project,
    keyFilename: google_application_credentials
});

async function updateFirestore(examId) {
    let exam = await mongoDb.collection("exam").findOne({_id:examId})
    var docRef = fireDb.collection('exam').doc(exam._id);
    await docRef.set({
        correct: exam.correct,
        score: exam.score
    }, {merge: true});
}

async function ack(ackId) {
    let ackRequest = {
        subscription: formattedSubscription,
        ackIds: [ackId]};
    await client.acknowledge(ackRequest, {}, (err) => {
        if(err){
            setTimeout(ack, 1000, ackId);
        }else{
            console.log(`Acknowledge ${message.message.data}`);
        }
    });
}

async function pull() {
    try{
        let [response] = await client.pull(request);
        let message = response.receivedMessages[0]
        console.log(`Message ${message.message.data}`);

        await updateFirestore(message.message.data);

        ack(message.ackId);
    }catch(err){
        console.log(err);
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