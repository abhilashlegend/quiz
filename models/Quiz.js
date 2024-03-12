const getDb = require('../util/database').getDb;

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

}

module.exports = Quiz;