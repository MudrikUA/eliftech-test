import { Injectable } from '@nestjs/common';
import { QuizResult } from './quiz-result.model';
import { InjectModel } from '@nestjs/sequelize';
import { QuizResultCreateDto } from './dto/QuizResultCreateDto';
import { UserAnswer } from 'src/user-answer/user-answer.model';

@Injectable()
export class QuizResultService {
    constructor(@InjectModel(QuizResult) private repo: typeof QuizResult) { }

    async create(dto: QuizResultCreateDto) {
        const formattedData = {
            quizId: dto.quizId,
            spendedTimeInSeconds: dto.spendedTimeInSeconds,
            userAnswers: dto.answers.map(answer => ({
                questionId: answer.questionId,
                answers: answer.answers
            }))
        };

        return this.repo.create(formattedData, {
            include: [
                {
                    model: UserAnswer,
                    as: "userAnswers"
                }
            ]
        });
    }

    getCountOfResults(quizId){
        return this.repo.findAll({
            where: {
            quizId: quizId
            }
        }).then(results => results.length);
    }
}
