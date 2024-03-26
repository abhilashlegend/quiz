const { error } = require('jquery');
const User = require('../models/User');

exports.home = (req, res, next) => {
    res.render("index.ejs", {pageTitle: "Home" });
}

exports.loginPage = (req, res, next) => {
    res.render("login.ejs", {pageTitle: "Login"})
}

exports.signupPage = (req, res, next) => {
    res.render("signup.ejs", { pageTitle: "Signup" })
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

    const user = new User(firstname, lastname, age, qualification, email, phone, password, score);
    user.save().then(result => {
        res.redirect("/login");
    }).catch(error => {
        console.error(error);
    });
}