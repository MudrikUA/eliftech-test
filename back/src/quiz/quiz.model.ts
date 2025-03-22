import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Question } from 'src/question/question.model';

interface QuizCreationAttrs {
    name: string;
    description: string;
}

@Table({ tableName: 'quizzes', createdAt: false, updatedAt: false })
export class Quiz extends Model<Quiz, QuizCreationAttrs> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false})
  name: string;

  @Column({ type: DataType.TEXT})
  description: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isArchived: boolean;

  @HasMany(() => Question, { as: "questions" })
  questions: Question[];
}