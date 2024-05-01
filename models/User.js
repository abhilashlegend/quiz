const getDb = require('../util/database').getDb;
const { error } = require('jquery');
const mongodb = require('mongodb');

class User {
    constructor(firstname, lastname, age, qualification, email, phone, password, score, resetToken, resetTokenExpiration){
        this.firstname = firstname;
        this.lastname = lastname;
        this.age = age;
        this.qualification = qualification;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.score = score;
        this.resetToken = resetToken;
        this.resetTokenExpiration = resetTokenExpiration;
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

    static updateToken(email, token, tokenexpiry) {
        const db = getDb();
        return db.collection('users').updateOne({email: email}, {$set: { resetToken: token, resetTokenExpiration: tokenexpiry }});
    }

    static findById(userId){
        const db = getDb();
        return db.collection('users').find({_id: new mongodb.ObjectId(userId)}).next().then(user => {
            return user;
        }).catch(error => {
            console.log(error);
        })
    }

    static findByEmail(email){
        const db = getDb();
        return db.collection('users').findOne({email: email}).then(user => {
            return user;
        }).catch(error => {
            console.log(error);
        });
    }

    static updatePasswordByUserId(userId, newPassword){
        const db = getDb();
        return db.collection('users').updateOne({_id: new mongodb.ObjectId(userId) }, {$set: { password: newPassword, resetToken: undefined, resetTokenExpiration: undefined }});
    }

    static findUserByToken(token) {
        const db = getDb();
        return db.collection('users').findOne({ resetToken: token, resetTokenExpiration:  { $gt: Date.now() }}).then(user => {
            return user;
        }).catch(error => {
            console.log(error);
        });
    }

    static findUserByIdAndToken(userId, token) {
        const db = getDb();
        return db.collection('users').findOne({ _id: new mongodb.ObjectId(userId), resetToken: token, resetTokenExpiration: { $gt: Date.now() }}).then(user => {
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