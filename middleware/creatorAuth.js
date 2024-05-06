const creatorAuth = (req, res, next) => {

    if(!req.session.isLogin){
        req.flash('error','You are not authorized to access that!');
        res.redirect('/login');
    } else if(req.session.user.role == 'subscriber'){
        req.flash('error','You are not authorized to access that!');
        res.redirect('/quizzes')
    }
    next();
}

module.exports = creatorAuth;