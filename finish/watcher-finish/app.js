const {MongoClient} = require('mongodb');
const {PubSub} = require('@google-cloud/pubsub');

const mongodb_uri = process.env.MONGODB_URI;

const pubsub = new PubSub();

function publish(message){
    pubsub.topic("pub-finish").publish(Buffer.from(message), (err, messageId) => {
        if(err){
            console.log(err);
            setTimeout(publish, 5000, message);
        }else{
            console.log(`Message ${messageId} published.`);
        }
    });
}

async function connectMongodb(){
    let client;
    try{
        client = await MongoClient.connect(mongodb_uri, { useNewUrlParser: true });
        
        let watchCursor = client.db("rxdata-test").collection("exam").watch([
            {$match:{operationType:"insert", "fullDocument.status.finish":{$exists:true}}}
        ]);

        watchCursor.on("change", function(change) {
            publish(change.documentKey._id);
        });
    }catch(err){
        console.log(err);
        if(client){
            client.close();
        }
        setTimeout(connectMongodb, 5000);
    }
}

connectMongodb();