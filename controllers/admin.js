const User = require("../models/User");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const Option = require("../models/Option");

exports.addUserPage = (req, res, next) => {
    res.render('./admin/add-user.ejs', {pageTitle: 'Add User', path: req.path });
}

exports.saveUser = (req, res, next) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const age = req.body.age;
    const qualification = req.body.qualification;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    const score = 0;
    const user = new User(firstname, lastname, age, qualification, email, phone, password, score);
    user.save().then(result => {
        res.redirect("/admin/users");
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

exports.updateUser = (req, res, next) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const age = req.body.age;
    const qualification = req.body.qualification;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    const score = req.body.score;
    const userId = req.body.userid;
    const user = new User(firstname, lastname, age, qualification, email, phone, password, score);
    return user.update(userId).then(result => {
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
   
    Quiz.fetchAll().then(quizzes => {
        res.render("./admin/quizzes.ejs", { pageTitle: "Quizzes", path: req.path,  quizzes });
    }).catch(error => {
        console.log(error);
    })    
}

exports.addQuiz = (req, res, next) => {
    const title = req.body.title;
    const quiz = new Quiz(title);
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
    const quiz = new Quiz(title);
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

    /*
    const optionObj = new Option(option, questionId, iscorrect);



    optionObj.save().then(result => {
        res.redirect("/admin/quiz/" + quizId);
    }).catch(error => {
        console.log(error);
    })
    */

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