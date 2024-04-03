const express = require('express');

const router = express.Router();

const quizController = require('../controllers/quiz');

router.get('/', quizController.home);

router.get("/login", quizController.loginPage);

router.get("/logout", quizController.logout);

router.get("/signup", quizController.signupPage);

router.post("/register", quizController.signup);

router.post("/login", quizController.signin);

router.get("/quizzes", quizController.quizzesPage);

router.get("/quiz/:quizid", quizController.quizPage);

router.post("/quiz/:quizid", quizController.saveAnswer);

module.exports = router;