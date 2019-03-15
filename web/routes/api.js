const express = require('express');
const router = express.Router();
const {MongoClient, ObjectID} = require('mongodb');

const mongodb_uri = process.env.MONGODB_URI;
let monogdbClient;

async function connectMongodb() {
    if(!monogdbClient){
        monogdbClient = await MongoClient.connect(mongodb_uri, { useNewUrlParser: true });
    }
}


router.post('/finish', async function(req, res, next) {

    await connectMongodb();

    let {user, question, answer} = JSON.parse(req.body.exam);
    let id = new ObjectID().toString();
    await monogdbClient.db("rxdata-test").collection("exam").updateOne(
        {_id : id},
        {
            $set : {
                user : user,
                question : question,
                answer : answer},
            $currentDate : {"status.finish" : true}},
        {upsert : true}
    );
    res.send(id);
});

module.exports = router;