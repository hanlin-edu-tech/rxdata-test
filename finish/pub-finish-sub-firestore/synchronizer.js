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

async function updateFirestore(examId) {
    let monogdbClient;
    let mongoDb;
    try{
        console.log(`updateFirestore ${examId}`);

        monogdbClient = await MongoClient.connect(mongodb_uri, { useNewUrlParser: true });
        mongoDb = monogdbClient.db("rxdata-test");

        let exam = await mongoDb.collection("exam").findOne({_id:examId})
        var docRef = fireDb.collection('exam').doc(exam._id);
        await docRef.set({
            _id: exam._id,
            user: exam.user,
            finish: exam.status.finish
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
