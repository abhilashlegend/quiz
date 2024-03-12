const User = require("../models/User");
const Quiz = require("../models/Quiz");

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