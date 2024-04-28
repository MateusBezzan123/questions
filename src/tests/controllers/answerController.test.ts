import { Request, Response } from 'express';
import { answerController } from '../../controllers/answerQuestionController';
import { answerService } from '../../services/answerService'
import { mocked } from 'jest-mock';

jest.mock('@services/AnswerService', () => ({
    answerService: {
        addAnswer: jest.fn()
    }
}));

const mockRequest = (sessionData) => ({
    ...sessionData
}) as Request;

const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('AnswerController', () => {
    it('should return 201 if answer added successfully', async () => {
        const req = mockRequest({ user: { userId: 'cc6f7098-f88d-4054-9bbb-55014c0350ab' }, body: { questionId: '560d1a6c-bad4-4466-9b50-22d9656272db', content: 'teste' } });
        const res = mockResponse();

        mocked(answerService.addAnswer).mockResolvedValue({
            id: '2d508585-185f-448c-a518-c7a20b2c2b29',
            content: 'teste',
            questionId: '560d1a6c-bad4-4466-9b50-22d9656272db',
            userId: 'cc6f7098-f88d-4054-9bbb-55014c0350ab',
            createdAt: new Date()
        });

        await answerController.answerQuestion(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should handle errors when adding an answer fails', async () => {
        const req = mockRequest({ user: { userId: 'cc6f7098-f88d-4054-9bbb-55014c0350ab' }, body: { questionId: '560d1a6c-bad4-4466-9b50-22d9656272db', content: 'oiaksljsdl content' } });
        const res = mockResponse();

        mocked(answerService.addAnswer).mockRejectedValue(new Error('Failed to add answer'));

        await answerController.answerQuestion(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Failed to add answer' });
    });

    it('should validate request data and return 400 if data is missing', async () => {
        const req = mockRequest({ user: { userId: 'cc6f7098-f88d-4054-9bbb-55014c0350ab' }, body: {} }); 
        const res = mockResponse();

        await answerController.answerQuestion(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Missing questionId or content' });
    });

    it('should return 409 if trying to add a duplicate answer', async () => {
        const req = mockRequest({
            user: { userId: 'cc6f7098-f88d-4054-9bbb-55014c0350ab' },
            body: { questionId: '560d1a6c-bad4-4466-9b50-22d9656272db', content: 'Teste' }
        });
        const res = mockResponse();

        mocked(answerService.addAnswer).mockRejectedValue(new Error('Duplicate answer'));

        await answerController.answerQuestion(req, res);
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ message: 'Duplicate answer not allowed' });
    });

    it('should return 400 for Duplicate answer not allowed', async () => {
        const req = mockRequest({
            user: { userId: 'invalid-uuid' },
            body: { questionId: '560d1a6c-bad4-4466-9b50-22d9656272db', content: 'Teste' }
        });
        const res = mockResponse();

        await answerController.answerQuestion(req, res);
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ message: 'Duplicate answer not allowed' });
    });

    it('should return 403 if answering a closed question', async () => {
        const req = mockRequest({
            user: { userId: 'cc6f7098-f88d-4054-9bbb-55014c0350ab' },
            body: { questionId: 'closed-question', content: 'Teste' }
        });
        const res = mockResponse();

        mocked(answerService.addAnswer).mockRejectedValue(new Error('Question is closed'));

        await answerController.answerQuestion(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Cannot answer a closed question' });
    });
    
    it('should deny access to non-organizer users when fetching answers', async () => {
        const req = mockRequest({
            user: { userId: 'a14cf40e-1fa6-49ef-9c9d-65b64dc9c3e8', type: 'PARTICIPANTE' }, 
            params: { questionId: '560d1a6c-bad4-4466-9b50-22d9656272db' },
            query: { page: '1', limit: '10' }
        });
        const res = mockResponse();

        await answerController.getAnswersForQuestion(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: "Access denied. Only organizers can view answers." });
    });

    it('should return 400 if required parameters are missing when fetching answers', async () => {
        const req = mockRequest({ user: { userId: '141521ef-0669-41eb-a717-a673a8dc2500', type: 'ORGANIZADOR' }, params: {}, query: {} });
        const res = mockResponse();

        await answerController.getAnswersForQuestion(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'answerService_1.answerService.getAnswers is not a function' });
    });
});
