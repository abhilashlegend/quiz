
exports.home = (req, res, next) => {
    res.render("index.ejs", {pageTitle: "Home" });
}

exports.loginPage = (req, res, next) => {
    res.render("login.ejs", {pageTitle: "Login"})
}

exports.signupPage = (req, res, next) => {
    res.render("signup.ejs", { pageTitle: "Signup" })
}