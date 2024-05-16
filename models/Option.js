const getDb = require('../util/database').getDb;
const mongodbz = require('mongodb');

class Option {
    constructor(option, questionId, iscorrect) {
        this.option = option;
        this.questionId = new mongodb.ObjectId(questionId);
        this.iscorrect = iscorrect;
    }

    save() {
        const db = getDb();
        return db.collection('options').insertOne(this);
    }
}

module.exports = Option;