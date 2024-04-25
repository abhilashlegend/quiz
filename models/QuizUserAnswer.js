const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class QuizUserAnswer {
    constructor(quiz_id, question_id, option_id, user_id){
        this.quiz_id = quiz_id;
        this.question_id = question_id;
        this.option_id = option_id;
        this.user_id = user_id;
    }

    save() {
        const db = getDb();
        return db.collection('quizuseranswer').insertOne(this).then(result => {
            console.log(result);
            return result;
        }).catch(error => {
            console.log(error);
        })
    }

    fetchByUser(userId) {
        const db = getDb();
        return db.collection('quizuseranswer').find({user_id: new mongodb.ObjectId(userId)}).toArray().then(userQuizAnswers => {
            return userQuizAnswers;
        }).catch(err => {
            console.log(err);
        })
    }

}

module.exports = QuizUserAnswer;