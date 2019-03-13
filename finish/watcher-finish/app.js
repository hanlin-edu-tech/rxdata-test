const Mongodb = require('mongodb');
const {PubSub} = require('@google-cloud/pubsub');

const mongodb_uri = process.env.MONGODB_URI;

const pubsub = new PubSub();

async function publish(message){
    const messageId = await pubsub.topic("pub-finish").publish(Buffer.from(message));
    console.log(`Message ${messageId} published.`);
}


publish("A");
publish("B");
publish("C");
publish("D");