import { Request, Response } from 'express';
import { answerController } from '../../controllers/answerQuestionController';
import { answerService } from '../../services/answerService'
import { mocked } from 'jest-mock';

jest.mock('@services/AnswerService', () => ({
    answerService: {
        addAnswer: jest.fn()
    }
}));

const mockRequest = (sessionData: any) => {
    return {
        ...sessionData
    } as Request;
};

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

});
