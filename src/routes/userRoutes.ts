const express = require('express');
import { createUser, loginUser } from '../controllers/userController';
import { createQuestion, getQuestions } from '../controllers/questionController'
import { answerQuestion, getAnswersForQuestion } from '../controllers/answerQuestionController'
import authenticate from '../middleware/authenticate';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/question', authenticate, createQuestion);
router.post('/answer', authenticate, answerQuestion);

router.get('/question', authenticate, getQuestions);
router.get('/answer', authenticate, getAnswersForQuestion);

export default router;
