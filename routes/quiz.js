const express = require('express');

const router = express.Router();

const quizController = require('../controllers/quiz');

const isAuth = require('../middleware/is-auth');

const { body } = require('express-validator');

router.get('/', quizController.home);

router.get("/login" , quizController.loginPage);

router.get("/logout", quizController.logout);

router.get("/signup", quizController.signupPage);

router.post("/register", quizController.signup);

router.post("/login", body('email').isEmail().withMessage("Entered email is not valid"), quizController.signin);

router.get("/quizzes", isAuth, quizController.quizzesPage);

router.get("/quiz/:quizid", isAuth, quizController.quizPage);

router.post("/quiz/:quizid", isAuth, quizController.saveAnswer);

router.get("/forgot-password", quizController.forgotPasswordPage);

router.post("/reset", quizController.reset);

router.get("/reset/:token", quizController.newPasswordPage);

router.post("/new-password/:token", quizController.updateNewPassword);



module.exports = router;