const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');

router.get('/add-user', adminController.addUserPage);

router.post('/add-user', adminController.saveUser);

router.get('/edit-user/:userId', adminController.editUserPage);

router.post('/edit-user', adminController.updateUser);

router.get("/users", adminController.usersPage);

router.get('/delete-user/:userId', adminController.deleteUser);

router.get("/quizzes", adminController.quizPage);

router.get("/add-quiz", adminController.addQuizPage);

router.post("/add-quiz", adminController.addQuiz);

router.get("/edit-quiz/:quizId", adminController.editQuizPage);

router.post("/edit-quiz", adminController.updateQuiz);

router.get("/delete-quiz/:quizId", adminController.deleteQuiz);

router.get("/quiz/:quizId", adminController.questionsPage);

router.get("/quiz/add-question/:quizId", adminController.addQuestionPage);

router.post("/quiz/add-question", adminController.saveQuestion);

router.post("/quiz/edit-question", adminController.updateQuestion);

router.get("/quiz/edit-question/:qId", adminController.editQuestionPage);

router.get("/quiz/delete-question/:questionId", adminController.deleteQuestion);

router.post("/quiz/add-option", adminController.saveOption);

module.exports = router;
