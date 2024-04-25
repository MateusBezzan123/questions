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
