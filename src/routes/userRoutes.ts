const express = require('express');
import { createUser, loginUser } from '../controllers/userController';
import { createQuestion } from '../controllers/questionController'
import { answerQuestion } from '../controllers/answerQuestionController'
import authenticate from '../middleware/authenticate';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/question', authenticate, createQuestion);
router.post('/answer', authenticate, answerQuestion);

export default router;
