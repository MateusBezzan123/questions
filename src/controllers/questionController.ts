import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createQuestion(req: any, res: any) {
    if (!req.user || req.user.type !== 'ORGANIZADOR') {
        return res.status(403).json({ message: "Access denied. Only organizers can create questions." });
    }
    
    const { content } = req.body;

    try {
        const question = await prisma.question.create({
            data: {
                content,
                creatorId: req.user.userId
            }
        });

        res.status(201).json(question);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
}


export async function getQuestions(req: any, res: any) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
  
    try {
      const userId = req.user?.userId;
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
  
      const questionsWithAnsweredStatus = questions.map(question => ({
        ...question,
        answered: question.answers.length > 0,
      }));
  
      res.status(200).json({
        data: questionsWithAnsweredStatus,
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
