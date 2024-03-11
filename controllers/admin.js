const User = require("../models/User");

exports.addUserPage = (req, res, next) => {
    res.render('./admin/add-user.ejs', {pageTitle: 'Add User'});
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
        res.render("./admin/users.ejs", {pageTitle: "Users", users: allUsers });
    }).catch(error => {
        console.log(error);
    })    
}

exports.editUserPage = (req, res, next) => {
    User.findById(req.params.userId).then(user => {
        res.render("./admin/edit-user.ejs", { pageTitle: "Edit User", user: user });
    }).catch(error => {
        console.log(error);
    })
}

