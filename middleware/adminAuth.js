const adminAuth = (req, res, next) => {
    
    if(!req.session.isLogin){
        
        req.flash('error', 'You are not authorized to access that!');
        res.redirect('/login');
    }
    else if(req.session.user.role != 'admin'){
        req.flash('error', 'You are not authorized to access that!');
        res.redirect("/admin/quizzes");
    }
    next();
}

module.exports = adminAuth;