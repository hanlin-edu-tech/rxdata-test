const admin = require("firebase-admin");
const {MongoClient, Long, Int32} = require('mongodb');
const mongodb_uri = process.env.MONGODB_URI;

admin.initializeApp();
const db = admin.firestore();

async function create() {
    let monogdbClient = await MongoClient.connect(mongodb_uri, { useNewUrlParser: true });
    let mongodb = monogdbClient.db("rxdata-test");

    try{
        for(var i=0 ; i<5 ; i++){
            let id = `u_${i}`;
            let name = `學生${i}`;
            
            await mongodb.collection("user").insertOne({
                _id : id, 
                name : name, 
                total : Long(0), 
                correct : Long(0)});

            db.collection("user").doc(id).set({
                _id : id, 
                name : name, 
                total : 0, 
                correct : 0});
        }

        for(var i=0 ; i<5 ; i++){
            let id = `k_${i}`;
            let name = `知識點${i}`;

            await mongodb.collection("knowledge").insertOne({
                _id : id, 
                name : name, 
                total : Long(0), 
                correct : Long(0)});

            db.collection("knowledge").doc(id).set({
                _id : id, 
                name : name, 
                total : 0, 
                correct : 0});
        }

        for(var i=0 ; i<5 ; i++){
            let id = `q_${i}`;
            let question = `題目${i}`;

            await mongodb.collection("question").insertOne({
                _id : id, 
                question : question, 
                answer : Int32(i), 
                knowledge : [`k_${i%5}`,`k_${(i+1)%5}`], 
                total : Long(0), 
                correct : Long(0)});

            db.collection("question").doc(id).set({
                _id : id, 
                question : question, 
                answer : i, 
                knowledge : [`k_${i%5}`,`k_${(i+1)%5}`], 
                total : 0, 
                correct : 0});
        }        
    }catch(err){
        console.log(err);
    }

    monogdbClient.close();
}

create();