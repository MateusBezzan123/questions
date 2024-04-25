import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class AnswerService {
    async addAnswer(questionId: string, userId: string, content: string) {
        const question = await prisma.question.findUnique({
            where: { id: questionId },
            include: { answers: true }
        });

        if (!question) {
            throw new Error("Question not found.");
        }

        if (question.creatorId === userId) {
            throw new Error("You cannot answer your own question.");
        }

        const alreadyAnswered = question.answers.some(answer => answer.userId === userId);
        if (alreadyAnswered) {
            throw new Error("You have already answered this question.");
        }

        const answer = await prisma.answer.create({
            data: {
                content,
                questionId,
                userId
            }
        });
        return answer;
    }

    async getAnswers(questionId: string, page: number, limit: number) {
        const skip = (page - 1) * limit;
        const answers = await prisma.answer.findMany({
            where: { questionId },
            skip,
            take: limit
        });
        return answers;
    }
}

export const answerService = new AnswerService();
