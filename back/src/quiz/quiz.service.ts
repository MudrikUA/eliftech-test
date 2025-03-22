import { Injectable, NotFoundException } from '@nestjs/common';
import { Quiz } from './quiz.model';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { QuizCreateDto } from './dto/QuizCreateDto';
import { Sequelize } from 'sequelize-typescript';
import { QuizUpdateDto } from './dto/QuizUpdateDto';
import { Question } from 'src/question/question.model';
import { Answer } from 'src/answer/answer.model';
import { QuizResultService } from 'src/quiz-result/quiz-result.service';

@Injectable()
export class QuizService {

    constructor(
        @InjectModel(Quiz) private repo: typeof Quiz,
        @InjectConnection() private sequelize: Sequelize,
        private quizResultService: QuizResultService,
    ) { }

    async getAll(sort?: string, order: 'asc' | 'desc' = 'asc') {
        const quizzes = await this.repo.findAll({
            where: {
                isArchived: false
            },
            include: [
                {
                    model: Question,
                    include: [Answer]
                }
            ]
        });

        const quizzesWithCompletition = await Promise.all(
            quizzes.map(async (quiz) => {
                const quizData = JSON.parse(JSON.stringify(quiz));
                quizData.completition = await this.quizResultService.getCountOfResults(quiz.id);
                return quizData;
            })
        );

        if (sort) {
            switch (sort) {
                case 'name':
                    quizzesWithCompletition.sort((a, b) => {
                        return order === 'asc'
                            ? a.name.localeCompare(b.name)
                            : b.name.localeCompare(a.name);
                    });
                    break;

                case 'questions':
                    quizzesWithCompletition.sort((a, b) => {
                        const countA = a.questions ? a.questions.length : 0;
                        const countB = b.questions ? b.questions.length : 0;
                        return order === 'asc' ? countA - countB : countB - countA;
                    });
                    break;

                case 'completition':
                    quizzesWithCompletition.sort((a, b) => {
                        return order === 'asc'
                            ? a.completition - b.completition
                            : b.completition - a.completition;
                    });
                    break;
            }
        }

        return quizzesWithCompletition;
    }

    async getById(id) {
        const quiz = await this.repo.findByPk(id, {
            include: [
                {
                    model: Question,
                    include: [Answer]
                }
            ]
        });
        if (quiz && quiz.isArchived) {
            return null;
        }
        return quiz;
    }

    async create(dto: QuizCreateDto) {
        const deepInclude = {
            include: [
                {
                    model: Question,
                    include: [Answer]
                }
            ]
        }
        return this.repo.create(dto, deepInclude);
    }

    async update(id: number, dto: QuizUpdateDto) {
        console.log(JSON.stringify(dto))
        const transaction = await this.sequelize.transaction();

        try {
            const quiz = await this.repo.findByPk(id, { transaction });
            if (!quiz) {
                throw new NotFoundException(`Quiz with ID ${id} not found`);
            }
            await quiz.update({
                name: dto.name,
                description: dto.description
            }, { transaction });

            const existingQuestions = await quiz.$get('questions', {
                include: [Answer],
                transaction
            });
            const existingQuestionIds = existingQuestions.map(q => q.id);

            for (const questionData of dto.questions) {
                if (questionData.id) {
                    const question = existingQuestions.find(q => q.id === questionData.id);

                    if (question) {
                        await question.update({
                            question: questionData.question,
                            type: questionData.type
                        }, { transaction });

                        const existingAnswers = await question.$get('answers', { transaction });
                        const existingAnswerIds = existingAnswers.map(a => a.id);

                        for (const answerData of questionData.answers) {
                            if (answerData.id) {
                                const answer = existingAnswers.find(a => a.id === answerData.id);
                                if (answer) {
                                    await answer.update({
                                        answer: answerData.answer,
                                        isCorrect: answerData.isCorrect
                                    }, { transaction });
                                }
                            } else {
                                await Answer.create({
                                    ...answerData,
                                    questionId: question.id
                                }, { transaction });
                            }
                        }

                        const updatedAnswerIds = questionData.answers
                            .filter(a => a.id)
                            .map(a => a.id);
                        const answersToDelete = existingAnswerIds
                            .filter(id => !updatedAnswerIds.includes(id));

                        if (answersToDelete.length > 0) {
                            await Answer.destroy({
                                where: { id: answersToDelete },
                                transaction
                            });
                        }
                    }
                } else {
                    const newQuestion = await Question.create({
                        question: questionData.question,
                        type: questionData.type,
                        quizId: quiz.id
                    }, { transaction });

                    for (const answerData of questionData.answers) {
                        await Answer.create({
                            ...answerData,
                            questionId: newQuestion.id
                        }, { transaction });
                    }
                }
            }

            const updatedQuestionIds = dto.questions
                .filter(q => q.id)
                .map(q => q.id);
            const questionsToDelete = existingQuestionIds
                .filter(id => !updatedQuestionIds.includes(id));

            if (questionsToDelete.length > 0) {
                await Question.destroy({
                    where: { id: questionsToDelete },
                    transaction
                });
            }

            await transaction.commit();

            return this.repo.findByPk(id, {
                include: [
                    {
                        model: Question,
                        include: [Answer]
                    }
                ]
            });

        } catch (error) {
            await transaction.rollback();
            throw error;
        }

    }

    async delete(id) {
        //return this.repo.destroy({ where: { id } });
        const quiz = await this.repo.findByPk(id);
        if (!quiz) {
            throw new NotFoundException(`Quiz with ID ${id} not found`);
        }
        quiz.isArchived = true;
        return quiz.save();
    }
}
