const {MongoClient} = require('mongodb');
const Firestore = require('@google-cloud/firestore');

const google_application_credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const mongodb_uri = process.env.MONGODB_URI;
let monogdbClient;
let mongoDb;

const project = "rxdata-test";

const fireDb = new Firestore({
    projectId: project,
    keyFilename: google_application_credentials
});

async function updateFirestore(userId) {
    let monogdbClient;
    let mongoDb;
    try{
        console.log(`updateFirestore ${userId}`);

        monogdbClient = await MongoClient.connect(mongodb_uri, { useNewUrlParser: true });
        mongoDb = monogdbClient.db("rxdata-test");

        let user = await mongoDb.collection("user").findOne({_id:userId})
        var docRef = fireDb.collection('user').doc(user._id);
        await docRef.set({
            _id: user._id,
            name: user.name,
            total: user.total,
            correct: user.correct
        }, {merge: true});

    }finally{
        if(monogdbClient){
            monogdbClient.close();
        }
    }
}

module.exports = {
    updateFirestore : updateFirestore
};
