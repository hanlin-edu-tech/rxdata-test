const Mongodb = require('mongodb');
const PubSub = require('@google-cloud/pubsub');

const mongodb_uri = process.env.MONGODB_URI;

const client = new PubSub.v1.SubscriberClient();

const project = "rxdata-test";
const subscription = "pub-finish-sub-score";
const formattedSubscription = client.subscriptionPath(project, subscription);

const maxMessages = 1;
const request = {
  subscription: formattedSubscription,
  maxMessages: maxMessages,
};

async function pull() {
    try{
        let [response] = await client.pull(request);
        let message = response.receivedMessages[0]
        console.log(`Message ${message.message.data}`);

        let ackRequest = {
            subscription: formattedSubscription,
            ackIds: [message.ackId],
        };
        await client.acknowledge(ackRequest);
        console.log(`Acknowledge ${message.message.data}`);        
    }catch(err){
        console.log(err);
    }
}

async function run() {
    while(true){
        await pull();
    }
}

run();
