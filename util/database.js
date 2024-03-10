const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let db;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb://127.0.0.1:27017/quiz').then(client => {
    console.log("MongoDb connected");
    db = client.db();
    callback();
    }).catch(error => {
        console.log(error);
        throw error;
    })
}

const getDb = () => {
    if(db){
        return db;
    }
    throw "No database found";
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

