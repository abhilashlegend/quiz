const express = require('express');

const router = express.Router();

const quizController = require('../controllers/quiz');

const isAuth = require('../middleware/is-auth');

router.get('/', quizController.home);

router.get("/login", quizController.loginPage);

router.get("/logout", quizController.logout);

router.get("/signup", quizController.signupPage);

router.post("/register", quizController.signup);

router.post("/login", quizController.signin);

router.get("/quizzes", isAuth, quizController.quizzesPage);

router.get("/quiz/:quizid", isAuth, quizController.quizPage);

router.post("/quiz/:quizid", isAuth, quizController.saveAnswer);

module.exports = router;