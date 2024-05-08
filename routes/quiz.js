const express = require('express');

const router = express.Router();

const quizController = require('../controllers/quiz');

const isAuth = require('../middleware/is-auth');

const { body } = require('express-validator');

const User = require('../models/User');

router.get('/', quizController.home);

router.get("/login" , quizController.loginPage);

router.get("/logout", quizController.logout);

router.get("/signup", quizController.signupPage);

router.post("/register", 
    [ 
        body('firstname').trim().notEmpty().withMessage("First Name is required"),
        body('lastname').trim().notEmpty().withMessage("Last Name is required"),
        body('age').trim().isNumeric().withMessage("Age must be a number"),
        body('qualification').trim().notEmpty().withMessage("Qualification is required"),
        body('email').isEmail().withMessage("Please enter valid email").custom((value, {req}) => {
            return User.findByEmail(value).then(user => {
                if(user){
                    return Promise.reject("User with that email already exists!")    
                }
                return true;
            }) 
        }).normalizeEmail(),
        body('phone').trim().notEmpty().withMessage("Phone number is required").isNumeric().withMessage("Please enter correct phone number").isLength({min: 10}).withMessage("Please enter valid phone number"),
        body('password').trim().notEmpty().withMessage("Password is required").isLength({min: 5}).withMessage("Password must be minimum of 5 characters"),
        body('cpassword').custom((value, {req}) => {
            if(value !== req.body.password){
                throw new Error("Confirm Password does not match Password");
            }
            return true;
        }).trim()        

    ], quizController.signup);

router.post("/login", [
    body('email').isEmail().withMessage("Entered email is not valid").custom((value, {req}) => {
        return User.findByEmail(value).then(user => {
            if(!user){
                return Promise.reject("User with that email does not exists!")
            }
        })
    }).normalizeEmail(),
    body('password').trim()
], quizController.signin);

router.get("/quizzes", isAuth, quizController.quizzesPage);

router.get("/quiz/:quizid", isAuth, quizController.quizPage);

router.post("/quiz/:quizid", isAuth, quizController.saveAnswer);

router.get("/forgot-password", quizController.forgotPasswordPage);

router.post("/reset", quizController.reset);

router.get("/reset/:token", quizController.newPasswordPage);

router.post("/new-password/:token", quizController.updateNewPassword);



module.exports = router;