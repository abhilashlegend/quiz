const isAuth = (req, res, next) => {
    if(!req.session.isLogin){
        res.redirect("/login");
    }
    next();
}

module.exports = isAuth;