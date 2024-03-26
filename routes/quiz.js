const express = require('express');

const router = express.Router();

const quizController = require('../controllers/quiz');

router.get('/', quizController.home);

router.get("/login", quizController.loginPage);

router.get("/signup", quizController.signupPage);

router.post("/register", quizController.signup);

module.exports = router;