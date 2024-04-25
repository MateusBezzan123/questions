import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function answerQuestion(req: any, res: any) {
    const { questionId, content } = req.body as { questionId: string, content: string };

    if (!req.user) {
        return res.status(401).json({ message: "You must be logged in to answer a question." });
    }

    const userId = req.user.userId;

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

export async function getAnswersForQuestion(req: any, res: any) {
    const { questionId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
  
    if (req.user?.type !== 'ORGANIZADOR') {
      return res.status(403).json({ message: "Access denied. Only organizers can view answers." });
    }
  
    try {
      const answers = await prisma.answer.findMany({
        where: {
          questionId: questionId,
        },
        skip,
        take: limit,
      });
  
      res.status(200).json({
        data: answers,
        currentPage: page,
        perPage: limit,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }
  