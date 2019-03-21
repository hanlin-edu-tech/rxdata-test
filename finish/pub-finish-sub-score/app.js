const PubSub = require('@google-cloud/pubsub');
const Calculator = require('./calculator.js');

const client = new PubSub.v1.SubscriberClient();

const project = "rxdata-test";
const subscription = "pub-finish-sub-score";
const formattedSubscription = client.subscriptionPath(project, subscription);

const maxMessages = 1;
const request = {
  subscription: formattedSubscription,
  maxMessages: maxMessages,
};

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
    let message;
    let examId;
    try{
        let [response] = await client.pull(request);
        message = response.receivedMessages[0];
        examId = message.message.data.toString();
    }catch(err){

    }
    
    if(examId){
        await Calculator.calculate(examId);
        ack(message.ackId);
    }
}

async function run() {
    while(true){
        try{
            await pull();    
        }catch(err){
            console.log(err);
        }
    }
}

run();