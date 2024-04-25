import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class QuestionService {
  async createQuestion(content: string, userId: string) {
    try {
      const question = await prisma.question.create({
        data: {
          content,
          creatorId: userId
        }
      });
      return question;
    } catch (error: any) {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }

  async getQuestions(page: number, limit: number, userId?: string) {
    const skip = (page - 1) * limit;
    try {
      const questions = await prisma.question.findMany({
        skip,
        take: limit,
        include: {
          answers: {
            where: {
              userId: userId,
            },
            select: {
              id: true,
            },
          },
        },
      });
      return questions.map(question => ({
        ...question,
        answered: question.answers.length > 0,
      }));
    } catch (error: any) {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
}

export const questionService = new QuestionService();
