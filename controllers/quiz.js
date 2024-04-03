const { error } = require('jquery');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

exports.home = (req, res, next) => {
    res.render("index.ejs", {pageTitle: "Home", isAuthenticated: req.session.isLogin });
}

exports.loginPage = (req, res, next) => {
    res.render("login.ejs", {pageTitle: "Login" , isAuthenticated: req.session.isLogin })
}

exports.signupPage = (req, res, next) => {
    res.render("signup.ejs", { pageTitle: "Signup", isAuthenticated: req.session.isLogin })
}

exports.signup = (req, res, next) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const age = req.body.age;
    const qualification = req.body.qualification;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    const score = 0;

    User.findByEmail(email).then(user => {
        if(user){
            res.redirect("/signup");
        } 
        return bcrypt.hash(password, 12).then(encrptedPassword => {
            const newUser = new User(firstname, lastname, age, qualification, email, phone, encrptedPassword, score);
            newUser.save().then(result => {
                res.redirect("/login");
            }).catch(error => {
                console.error(error);
            });
        })      
    }).catch(error => {
        console.log(error);
    })   
}

exports.signin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findByEmail(email).then(user => {
        if(!user){
            return res.redirect("/login");
        }
        bcrypt.compare(password, user.password).then(isMatch => {
            if(isMatch){
                req.session.isLogin = true;
                req.session.user = user;
                return req.session.save(err => {
                    console.log(err);
                    res.redirect("/");
                })
            }
            return res.redirect("/login");
        }).catch(error => {
            console.log(error);
            res.redirect("/login");
        })
    }).catch(error => {
        console.log(error);
        res.redirect("/login");
    })
}

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect("/");
    })
}

exports.quizzesPage = (req, res, next) => {
    Quiz.fetchAll().then(quizzes => {
        res.render("quizzes.ejs", {pageTitle: "Quizzes", quizzes: quizzes, isAuthenticated: req.session.isLogin })
    }).catch(error => {
        console.log(error);
    })
}

exports.quizPage = (req, res, next) => {
    const quizid = req.params.quizid;
    let questionno = +req.query.qno;
    let questionsList = [];
    let currentQno=questionno + 1;
    Question.fetchAll(quizid).then(questions => {
        questionsList = [...questions];
        if(questionno < questionsList.length - 1){
            currentQno = currentQno++;
            nextQno = questionno + 1;          
        } else {
            nextQno = questionsList.length - 1;
        }

        if(questionno == 0){
            prevQno = 0
        } else {
            prevQno = questionno - 1;
            currentQno = currentQno--;
        }
        
        res.render("quiz", {pageTitle: "Quiz", question: questionsList[questionno], currentQno: currentQno, nextQIndex: nextQno, prevQIndex: prevQno, quizid: quizid, isAuthenticated: req.session.isLogin});
    }).catch(error => {
        console.log(error);
    });
}

exports.saveAnswer = (req, res, next) => {
    quizId = req.params.quizid;
    questionId = req.body.questionId;
    optionId = req.body.optionId;
    //userId = req.session.user._id;

}