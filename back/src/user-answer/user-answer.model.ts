import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { QuizResult } from 'src/quiz-result/quiz-result.model';

interface UserAnswerCreationAttrs {
    questionId: number;
}

@Table({ tableName: 'user-answer', createdAt: true, updatedAt: false })
export class UserAnswer extends Model<UserAnswer, UserAnswerCreationAttrs> {
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @Column({ type: DataType.ARRAY(DataType.STRING) })
    answers: string[];

    @Column({ type: DataType.INTEGER, allowNull: false })
    questionId: number;

    @ForeignKey(() => QuizResult)
    @Column
    quizResultId: number;

    @BelongsTo(() => QuizResult, { as: "quizResult" })
    quizResult: QuizResult;
} 