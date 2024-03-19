const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class Question {

    options = [];

    constructor(title, quizId){
        this.title = title;
        this.quizId = new mongodb.ObjectId(quizId);
        this.options = new Array();
    }

    save(){
        const db = getDb();
        return db.collection('questions').insertOne(this);
    }

    static fetchAll(quizId){
        const db = getDb();
        return db.collection('questions').find({quizId: new mongodb.ObjectId(quizId)}).toArray().then(questions => {
            return questions;
        }).catch(error => {
            console.log(error);
        })
    }

    static getById(qId){
        const db = getDb();
        return db.collection('questions').find({_id: new mongodb.ObjectId(qId)}).next().then(question => {
            return question;
        }).catch(error => {
            console.log(error);
        })
    }

    static updateQuestion(qId, updatedTitle){
        const db = getDb();
        return db.collection('questions').updateOne({_id: new mongodb.ObjectId(qId)}, {$set: {title: updatedTitle}})
    }

    static deleteQuestion(qId){
        const db = getDb();
        return db.collection('questions').deleteOne({_id: new mongodb.ObjectId(qId)});
    }

    static addOption(qId, option, iscorrect){
        const db = getDb();

        const newOption = {_id: new mongodb.ObjectId(), questionId: qId, option: option, iscorrect }

        // Retreive the existing question document from the database
        return db.collection('questions').findOne({_id: new mongodb.ObjectId(qId)}).then(question => {
            if(!question){
                throw new Error("Question not found");
            }

            // Get the existing options array or initialize it if it doesn't exist
            let options = question.options || [];

            // Push the new option to the existing options array
            options.push(newOption);

            return db.collection('questions').updateOne({_id: new mongodb.ObjectId(qId)}, { $set: {options: options}});

        }).catch(error => {
            console.log(error);
        })
    }

    static deleteOption(qId, optionId){
        const db = getDb();

        return db.collection('questions').findOne({_id: new mongodb.ObjectId(qId)}).then(question => {
            const options = question.options;
            const updatedOption = question.options.filter(option => {
                return option._id.toString() !== optionId.toString()
            })
            return db.collection('questions').updateOne({_id: new  mongodb.ObjectId(qId)}, {$set: { options: updatedOption}});
        }).catch(error => {
            console.log(error);
        })
    }
}

module.exports = Question;