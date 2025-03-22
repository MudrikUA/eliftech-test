import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Question } from 'src/question/question.model';

interface AnswerCreationAttrs {
    answer: string;
    isCorrect: boolean;
    questionId: number;
}

@Table({ tableName: 'answers', timestamps: true })
export class Answer extends Model<Answer, AnswerCreationAttrs> {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true, })
    id: number;

    @Column({ type: DataType.TEXT, allowNull: false })
    answer: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    isCorrect: boolean;

    @ForeignKey(() => Question)
    @Column
    questionId: number;

    @BelongsTo(() => Question, { as: "question" })
    question: Question;
}