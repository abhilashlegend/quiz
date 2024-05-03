const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const creatorAuth = require('../middleware/creatorAuth');
const router = express.Router();

const adminController = require('../controllers/admin');

router.get('/dashboard', adminAuth, adminController.dashboardPage);

router.get('/add-user', adminAuth, adminController.addUserPage);

router.post('/add-user', adminAuth, adminController.saveUser);

router.get('/edit-user/:userId', adminAuth, adminController.editUserPage);

router.post('/edit-user', adminAuth, adminController.updateUser);

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
