import { answerService } from '../services/answerService';

class AnswerController {
    async answerQuestion(req: any, res: any) {
        const { user, body: { questionId, content } } = req;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User must be logged in." });
        }
        if (!questionId || !content) {
            return res.status(400).json({ message: "Missing questionId or content" });
        }

        try {
            const answer = await answerService.addAnswer(questionId, user.userId, content);
            return res.status(201).json(answer);
        } catch (error) {
            if (error.message.includes('Duplicate answer')) {
                return res.status(409).json({ message: "Duplicate answer not allowed" });
            } else if (error.message.includes('Invalid userId')) {
                return res.status(400).json({ message: "Invalid userId format" });
            } else if (error.message.includes('Question is closed')) {
                return res.status(403).json({ message: "Cannot answer a closed question" });
            } else {
                return res.status(500).json({ message: error.message || "Internal server error" });
            }
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
