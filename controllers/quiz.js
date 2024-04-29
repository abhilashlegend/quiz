const { error } = require('jquery');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const QuizUserAnswer = require('../models/QuizUserAnswer');
const brevo = require('sib-api-v3-sdk');
const brevoAPIKey = require('../secret');
let defaultClient = brevo.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = brevoAPIKey

let apiInstance = new brevo.TransactionalEmailsApi();
let sendSmtpEmail = new brevo.SendSmtpEmail();

exports.home = (req, res, next) => {
    res.render("index.ejs", {pageTitle: "Home" });
}

exports.loginPage = (req, res, next) => {
    res.render("login.ejs", {pageTitle: "Login", errorMsg: req.flash('error'), successMsg: req.flash('success') })
}

exports.signupPage = (req, res, next) => {
    res.render("signup.ejs", { pageTitle: "Signup", errorMsg: req.flash('error')  })
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
            req.flash('error', 'User with the email already exists!');
            res.redirect("/signup");
        } 
        return bcrypt.hash(password, 12).then(encrptedPassword => {
            const newUser = new User(firstname, lastname, age, qualification, email, phone, encrptedPassword, score);
            newUser.save().then(result => {

                // Send email
                sendSmtpEmail.subject = "Signup Successfull!";
                sendSmtpEmail.htmlContent = "<html><body><h1>You have successfully signed up!</h1></body></html>";
                sendSmtpEmail.sender = { "name": "Quiz", "email": "abhilashn2008@gmail.com" };
                sendSmtpEmail.to = [
                { "email": email, "name": firstname + ' ' + lastname }
                ];
                sendSmtpEmail.replyTo = { "email": "abhilashn2008@gmail.com", "name": "abhilash" };
               /* sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
                sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" }; */


                apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
                console.log('API called successfully. Returned data: ' + JSON.stringify(data));
                }, function (error) {
                console.error(error);
                });

                req.flash('success','Registration successfull, please login.');
                res.redirect("/login");
            }).catch(error => {
                console.error("Signup Error: " + error);
            });
        })      
    }).catch(error => {
        console.log("Signup Error: " + error);
    })   
}

exports.signin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findByEmail(email).then(user => {
        if(!user){
            req.flash('error','Invalid email, please check!')
            return res.redirect("/login");
        }
        bcrypt.compare(password, user.password).then(isMatch => {
            if(isMatch){
                req.session.isLogin = true;
                req.session.user = user;
                return req.session.save(err => {
                    if(err){
                        console.log(err);
                    } else {
                        req.flash('success', "Login success!");
                        console.log("Login success!");
                    }
                    
                    res.redirect("/quizzes");
                })
            } else {
                req.flash('error',"Invalid Password!")
                return res.redirect("/login");
            }
            
        }).catch(error => {
            console.log(error);
            res.flash('error', error);
            res.redirect("/login");
        })
    }).catch(error => {
        res.flash('error', error);
        console.log(error);
        res.redirect("/login");
    })
}

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if(err){
            console.log("Logout Error:" + err)
        } else {
            console.log("Logout successful");
        }
        
        res.redirect("/");
    })
}

exports.quizzesPage = (req, res, next) => {
    Quiz.fetchAll().then(quizzes => {
        res.render("quizzes.ejs", {pageTitle: "Quizzes", quizzes: quizzes, successMsg: req.flash('success')  })
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
        let checkLogin = req.session.isLogin || false;
        res.render("quiz", {pageTitle: "Quiz", question: questionsList[questionno], currentQno: currentQno, nextQIndex: nextQno, prevQIndex: prevQno, quizid: quizid});
    }).catch(error => {
        console.log(error);
    });
}

exports.saveAnswer = (req, res, next) => { 

    const quizId = req.params.quizid;
    const questionId = req.body.questionId;
    const optionId = req.body.optionId;
    const userId = req.session.user._id;
    const qno = req.query.qno;

    const questions = Question.fetchAll(quizId).then(result => {
        console.log(result.length);

        if(qno < result.length){
            let nextqno = parseInt(qno) + 1;   
            nextUrl = "/quiz/" + quizId + "?qno=" + nextqno; 
        } else {
            let nextqno = parseInt(qno);   
            nextUrl = "/quiz/" + quizId + "?qno=" + nextqno;
        }
        const userQuizAnswer = new QuizUserAnswer(quizId, questionId, optionId, userId);
        userQuizAnswer.save();
        res.redirect(nextUrl);
    }).catch(err => {
        console.log(err);
    })
}