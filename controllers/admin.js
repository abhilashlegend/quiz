const User = require("../models/User");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const Option = require("../models/Option");
const bcrypt = require('bcryptjs');
const { error } = require("jquery");

exports.dashboardPage = (req, res, next) => {
    res.render('./admin/dashboard.ejs', { pageTitle: 'Admin Dashboard', path: req.path });
}

exports.addUserPage = (req, res, next) => {
    res.render('./admin/add-user.ejs', {pageTitle: 'Add User', path: req.path });
}

exports.saveUser = (req, res, next) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const age = req.body.age;
    const role = req.body.role;
    const qualification = req.body.qualification;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    const score = 0;
    const resetToken = undefined;
    const tokenExpiration = undefined;

    User.findByEmail(email).then(user => {
        if(user){
            redirect("/admin/add-user")
        }
        return bcrypt.hash(password, 12).then(encrptedPassword => {
            const newUser = new User(firstname, lastname, age, role, qualification, email, phone, encrptedPassword, score, resetToken, tokenExpiration);
            newUser.save().then(result => {
                res.redirect("/admin/users");
            }).catch(error => {
                console.log(error);
            })
        });
    }).catch(error => {
        console.log(error);
    })
    
}

exports.usersPage = (req, res, next) => {

    let allUsers = null;
    User.fetchAll().then(users => {
        allUsers = users;
        res.render("./admin/users.ejs", {pageTitle: "Users", users: allUsers, path: req.path });
    }).catch(error => {
        console.log(error);
    })    
}

exports.editUserPage = (req, res, next) => {
    User.findById(req.params.userId).then(user => {
        res.render("./admin/edit-user.ejs", { pageTitle: "Edit User", user: user, path: req.path });
    }).catch(error => {
        console.log(error);
    })
}

exports.updateUser = async (req, res, next) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const age = req.body.age;
    const role = req.body.role;
    const qualification = req.body.qualification;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    const score = req.body.score;
    const resetToken = undefined;
    const tokenExpiration = undefined;
    const userId = req.body.userid;

    const existingUser = await User.findById(userId).then(user => {
        return user;
    }).catch(err => {
        console.log(err);
        return null;
    });

    let newPasswordHash = existingUser.password;

    

    if(existingUser.password !== password){
        newPasswordHash = await bcrypt.hash(password, 12);
    }

    const user = new User(firstname, lastname, age, role, qualification, email, phone, newPasswordHash, score, resetToken, tokenExpiration);
        return await user.update(userId).then(result => {
            res.redirect("/admin/users");
        }).catch(error => {
            console.log(error);
        })
    
}

exports.deleteUser = (req, res, next) => {
    User.delete(req.params.userId).then(result => {
        console.log("User deleted");
        res.redirect("/admin/users");
    }).catch(error => {
        console.log(error);
    })
}

exports.addQuizPage = (req, res, next) => {
    res.render("./admin/add-quiz.ejs", {pageTitle: "Add Quiz", path: req.path })
}

exports.quizPage = (req, res, next) => {

    if(req.session.user.role == 'admin'){
        Quiz.fetchAll().then(quizzes => {
            res.render("./admin/quizzes.ejs", { pageTitle: "Quizzes", path: req.path,  quizzes });
        }).catch(error => {
            console.log(error);
        });
    } else if(req.session.user.role == 'creator'){
        Quiz.fetchByUser(req.session.user._id).then(quizzes => {
            res.render("./admin/quizzes.ejs", { pageTitle: "Quizzes", path: req.path,  quizzes });
        }).catch(error => {
            console.log(error);
        })
    }
        
}

exports.addQuiz = (req, res, next) => {
    const title = req.body.title;
    const userId = req.session.user._id;
    const quiz = new Quiz(title, userId);
    quiz.save().then(result => {
        res.redirect("/admin/quizzes");
    }).catch(error => {
        console.log(error);
    })
}

exports.editQuizPage = (req, res, next) => {
    Quiz.getById(req.params.quizId).then(quiz => {
        res.render("./admin/edit-quiz.ejs", {pageTitle: "Edit Quiz", path: req.path, quiz })
    }).catch(error => {
        console.log(error);
    })
}

exports.updateQuiz = (req, res, next) => {
    const title = req.body.title;
    const quizId = req.body.quizid;
    const userId = req.session.user._id;
    const quiz = new Quiz(title, userId);
    quiz.update(quizId).then(result => {
        res.redirect("/admin/quizzes");
    }).catch(error => {
        console.log(error);
    });
}

exports.deleteQuiz = (req, res, next) => {
    Quiz.delete(req.params.quizId).then(result => {
        res.redirect("/admin/quizzes");
    }).catch(error => {
        console.log(error);
    })
}

exports.questionsPage = (req, res, next) => {
    let quizQuestions = [];
    const quizId = req.params.quizId;
    Question.fetchAll(quizId).then(questions => {
        quizQuestions = questions;
        res.render("./admin/questions.ejs", { pageTitle: "Quiz Questions", path: req.path, questions: quizQuestions, quizId: req.params.quizId });
    }).catch(error => {
        console.log(error);
    })
}

exports.addQuestionPage = (req, res, next) => {
    res.render("./admin/add-question.ejs", { pageTitle: "Add Question", path: req.path, quizId: req.params.quizId })
}

exports.saveQuestion = (req, res, next) => {
    const title = req.body.title;
    const quizId = req.body.quizId;
    
    const question = new Question(title, quizId);
    question.save().then(result => {
        res.redirect("/admin/quiz/" + quizId);
    }).catch(error => {
        console.log(error);
    })
}

exports.editQuestionPage = (req, res, next) => {
    Question.getById(req.params.qId).then(question => {
        res.render("./admin/edit-question.ejs", { pageTitle: "Edit Question",  path: req.path, question })
    })   
}

exports.updateQuestion = (req, res, next) => {
    
    Question.updateQuestion(req.body.qId, req.body.title).then(result => {
        res.redirect("/admin/quiz/" + req.body.quizId);
    }).catch(error => {
        console.log(error);
    })
}

exports.deleteQuestion = (req, res, next) => {
    Question.deleteQuestion(req.params.questionId).then(result => {
        res.redirect("/admin/quiz/" + req.query.quizid);
    }).catch(error => {
        console.log(error);
    })
}

exports.saveOption = (req, res, next) => {
    const option = req.body.option;
    const questionId = req.body.questionId;
    const iscorrect = req.body.iscorrect;
    const quizId = req.body.quizId;

    Question.addOption(questionId, option, iscorrect).then(result => {
        res.redirect("/admin/quiz/" + quizId);
    }).catch(error => {
        console.log(error);
    })
}

exports.deleteOption = (req, res, next) => {
    Question.deleteOption(req.query.questionid, req.params.optionId).then(result => {
        res.redirect("/admin/quiz/" + req.query.quizid);
    }).catch(error => {
        console.log(error);
    })
}