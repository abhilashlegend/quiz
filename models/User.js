const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class User {
    constructor(firstname, lastname, age, qualification, email, phone, password, score){
        this.firstname = firstname;
        this.lastname = lastname;
        this.age = age;
        this.qualification = qualification;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.score = score;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this).then(result => {
            console.log(result);
        }).catch(error => {
            console.log(error);
        })
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('users').find().toArray().then(users => {
            return users;
        }).catch(error => {
            console.log(error);
        })
    }

    update(userId) {
        const db = getDb();
        return db.collection('users').updateOne({_id: new mongodb.ObjectId(userId)}, { $set: this });
    }

    static findById(userId){
        const db = getDb();
        return db.collection('users').find({_id: new mongodb.ObjectId(userId)}).next().then(user => {
            return user;
        }).catch(error => {
            console.log(error);
        })
    }

    static delete(userId){
        const db = getDb();
        return db.collection('users').deleteOne({_id: new mongodb.ObjectId(userId)});
    }
}

module.exports = User;