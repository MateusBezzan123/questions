import { questionService } from '../services/questionService';

class QuestionController {
  async createQuestion(req: any, res: any) {
    if (!req.user || req.user.type !== 'ORGANIZADOR') {
      return res.status(403).json({ message: "Access denied. Only organizers can create questions." });
    }
    const { content } = req.body;
    try {
      const question = await questionService.createQuestion(content, req.user.userId);
      res.status(201).json(question);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getQuestions(req: any, res: any) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    try {
      const userId = req.user?.userId;
      const questions = await questionService.getQuestions(page, limit, userId);
      res.status(200).json({
        data: questions,
        currentPage: page,
        perPage: limit,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export const questionController = new QuestionController();
