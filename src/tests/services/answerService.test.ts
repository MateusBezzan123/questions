import { answerService } from '../../services/answerService'
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
    const mPrisma = {
        question: {
            findUnique: jest.fn(),
        },
        answer: {
            create: jest.fn()
        }
    };
    return { PrismaClient: jest.fn(() => mPrisma) };
});

describe('AnswerService', () => {
    describe('addAnswer', () => {
        it('should throw an error if the question does not exist', async () => {
            await expect(answerService.addAnswer('28882893-49ff-4765-a686-d39dc88832c7', 'cc6f7098-f88d-4054-9bbb-55014c0350ab', 'Questão de Teste ?t'))
                .rejects.toThrow('Question not found.');
        });
    });
});
