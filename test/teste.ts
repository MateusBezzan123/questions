const chai = require('chai');
const expect = chai.expect;

const { answerService } = require('../../services/AnswerService');

describe('AnswerService', () => {
    describe('addAnswer', () => {
        it('should throw an error if the question does not exist', async () => {
            try {
                await answerService.addAnswer('invalid_question_id', 'user_id', 'Sample content');
            } catch (error) {
                expect(error.message).to.equal('Question not found.');
            }
        });
    });
});