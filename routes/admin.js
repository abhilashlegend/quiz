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

module.exports = router;
