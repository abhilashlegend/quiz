const isAuth = (req, res, next) => {
    if(!req.session.isLogin){
        req.flash('error', 'You are not authorized to access that!');
        res.redirect("/login");
    }
    next();
}

module.exports = isAuth;