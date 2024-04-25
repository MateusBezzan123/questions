import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function answerQuestion(req: any, res: any) {
    const { questionId, content } = req.body as { questionId: string, content: string };
    const userId = req.user!.userId;

    try {
        const question = await prisma.question.findUnique({
            where: { id: questionId },
            include: { answers: true }
        });

        if (!question) {
            return res.status(404).json({ message: "Question not found." });
        }

        if (question.creatorId === userId) {
            return res.status(403).json({ message: "You cannot answer your own question." });
        }

        const alreadyAnswered = question.answers.some(answer => answer.userId === userId);
        if (alreadyAnswered) {
            return res.status(409).json({ message: "You have already answered this question." });
        }

        const answer = await prisma.answer.create({
            data: {
                content,
                questionId,
                userId
            }
        });

        res.status(201).json(answer);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
}
