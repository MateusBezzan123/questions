import express from 'express';
import { createUser, loginUser } from '../controllers/userController';
import { questionController } from '../controllers/questionController';
import { answerQuestion, getAnswersForQuestion } from '../controllers/answerQuestionController';
import authenticate from '../middleware/authenticate';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/question', authenticate, questionController.createQuestion);
router.post('/answer', authenticate, answerQuestion);

router.get('/question', authenticate, questionController.getQuestions);
router.get('/answer', authenticate, getAnswersForQuestion);

export default router;
