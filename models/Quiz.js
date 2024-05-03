const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class Quiz {
    constructor(title, userId){
        this.title = title;
        this.userId = userId;
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

    static fetchByUser(userId) {
        const db = getDb();
        return db.collection('quizzes').find({userId: userId}).toArray().then(quizzes => {
            return quizzes;
        }).catch(error => {
            console.log(error);
        });
    }

    static getById(quizId){
        const db = getDb();
        return db.collection('quizzes').find({_id: new mongodb.ObjectId(quizId) }).next().then(quiz => {
            return quiz;
        }).catch(error => {
            console.log(error);
        });
    }

    update(quizId) {
        const db = getDb();
        return db.collection('quizzes').updateOne({_id: new mongodb.ObjectId(quizId)}, {$set: this });
    }

    static delete(quizId) {
        const db = getDb();
        return db.collection('quizzes').deleteOne({_id: new mongodb.ObjectId(quizId)});
    }

}

module.exports = Quiz;