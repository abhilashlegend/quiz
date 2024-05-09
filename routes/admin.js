const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const creatorAuth = require('../middleware/creatorAuth');
const router = express.Router();

const adminController = require('../controllers/admin');
const { body } = require('express-validator');
const User = require('../models/User');

router.get('/dashboard', adminAuth, adminController.dashboardPage);

router.get('/add-user', adminAuth, adminController.addUserPage);

router.post('/add-user', [
    body('firstname').notEmpty().withMessage("First Name is required").isLength({min: 3}).withMessage("First Name should be minimum 3 characters"),
    body('lastname').notEmpty().withMessage("Last Name is required").isLength({min: 3}).withMessage("Last Name should be atleast 3 characters"),
    body('age').notEmpty().withMessage("Age is required").isNumeric().withMessage("Age must be numerical").isInt({min: 3, max: 100}).withMessage("Age must be greater than 3 or less than 100"),
    body('qualification').notEmpty().withMessage("Qualification is required"),
    body('email').isEmail().withMessage("Please enter valid email address").custom((value, {req}) => {
        return User.findByEmail(value).then(user => {
            if(user){
                return Promise.reject("User with that email already exists!")
            }
            return true;
    })
}).normalizeEmail(),
    body('phone').isMobilePhone('en-IN').withMessage("Please enter valid Mobile Number"),
    body('password').notEmpty().withMessage("Password is required").trim()
] ,adminAuth, adminController.saveUser);

router.get('/edit-user/:userId', adminAuth, adminController.editUserPage);

router.post('/edit-user', [
    body('firstname').notEmpty().withMessage("First Name is required").isLength({min: 3}).withMessage("First Name should be minimum 3 characters"),
    body('lastname').notEmpty().withMessage("Last Name is required").isLength({min: 3}).withMessage("Last Name should be atleast 3 characters"),
    body('age').notEmpty().withMessage("Age is required").isNumeric().withMessage("Age must be numerical").isInt({min: 3, max: 100}).withMessage("Age must be greater than 3 or less than 100"),
    body('qualification').notEmpty().withMessage("Qualification is required"),
    body('email').isEmail().withMessage("Please enter valid email address").normalizeEmail(),
    body('phone').isMobilePhone('en-IN').withMessage("Please enter valid Mobile Number"),
    body('password').notEmpty().withMessage("Password is required").trim()
], adminAuth, adminController.updateUser);

router.get("/users", adminAuth, adminController.usersPage);

router.get('/delete-user/:userId', adminAuth, adminController.deleteUser);

router.get("/quizzes", creatorAuth, adminController.quizPage);

router.get("/add-quiz", creatorAuth, adminController.addQuizPage);

router.post("/add-quiz", creatorAuth, adminController.addQuiz);

router.get("/edit-quiz/:quizId", creatorAuth, adminController.editQuizPage);

router.post("/edit-quiz", creatorAuth, adminController.updateQuiz);

router.get("/delete-quiz/:quizId", creatorAuth, adminController.deleteQuiz);

router.get("/quiz/:quizId", creatorAuth, adminController.questionsPage);

router.get("/quiz/add-question/:quizId", creatorAuth, adminController.addQuestionPage);

router.post("/quiz/add-question", creatorAuth, adminController.saveQuestion);

router.post("/quiz/edit-question", creatorAuth, adminController.updateQuestion);

router.get("/quiz/edit-question/:qId", creatorAuth, adminController.editQuestionPage);

router.get("/quiz/delete-question/:questionId", creatorAuth, adminController.deleteQuestion);

router.post("/quiz/add-option", creatorAuth, adminController.saveOption);

router.get("/quiz/delete-option/:optionId", creatorAuth, adminController.deleteOption);

router.get("/logout", creatorAuth, adminController.logout);

module.exports = router;
