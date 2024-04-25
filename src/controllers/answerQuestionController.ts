import { answerService } from '../services/answerService';

class AnswerController {
    async answerQuestion(req: any, res: any) {
        if (!req.user) {
            return res.status(401).json({ message: "You must be logged in to answer a question." });
        }

        const { questionId, content } = req.body;

        try {
            const answer = await answerService.addAnswer(questionId, req.user.userId, content);
            res.status(201).json(answer);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getAnswersForQuestion(req: any, res: any) {
        const { questionId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        if (req.user?.type !== 'ORGANIZADOR') {
            return res.status(403).json({ message: "Access denied. Only organizers can view answers." });
        }

        try {
            const answers = await answerService.getAnswers(questionId, page, limit);
            res.status(200).json({
                data: answers,
                currentPage: page,
                perPage: limit
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export const answerController = new AnswerController();
