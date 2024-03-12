const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class Quiz {
    constructor(title){
        this.title = title;
    }

    save() {
        const db = getDb();
        return db.collection('quizzes').insertOne(this);
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('quizzes').find().toArray().then(quizzes => {
            return quizzes;
        }).catch(error => {
            console.log(error);
        })
    }

    static getById(quizId){
        const db = getDb();
        return db.collection('quizzes').find({_id: new mongodb.ObjectId(quizId) }).next().then(quiz => {
            return quiz;
        }).catch(error => {
            console.log(error);
        });
    }

}

module.exports = Quiz;