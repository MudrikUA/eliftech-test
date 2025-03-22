import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Answer } from 'src/answer/answer.model';
import { Quiz } from 'src/quiz/quiz.model';

interface QuestionCreationAttrs {
    question: string;
    type: string;
    quizId: number;
}

@Table({ tableName: 'questions', timestamps: true })
export class Question extends Model<Question, QuestionCreationAttrs> {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true, })
    id: number;

    @Column({ type: DataType.TEXT, allowNull: false })
    question: string;

    @Column({ type: DataType.STRING, allowNull: false })
    type: string;

    @ForeignKey(() => Quiz)
    @Column
    quizId: number;

    @BelongsTo(() => Quiz, { as: "quiz" })
    quiz: Quiz;

    @HasMany(() => Answer, { as: "answers" })
    answers: Answer[];
}