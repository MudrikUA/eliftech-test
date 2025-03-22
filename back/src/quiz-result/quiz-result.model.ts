import { Table, Column, Model, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Quiz } from 'src/quiz/quiz.model';
import { UserAnswer } from 'src/user-answer/user-answer.model';

interface QuizResultCreationAttrs {
  quizId: number;
  spendedTimeInSeconds: number;
}

@Table({ tableName: 'quiz-result', createdAt: true, updatedAt: false })
export class QuizResult extends Model<QuizResult, QuizResultCreationAttrs> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({})
  spendedTimeInSeconds: number;

  @ForeignKey(() => Quiz)
  @Column
  quizId: number;

  @BelongsTo(() => Quiz, { as: "quiz" })
  quiz: Quiz;

  @HasMany(() => UserAnswer, { as: "userAnswers" })
  userAnswers: UserAnswer[];

}