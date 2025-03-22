import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';

import { QuizModule } from './quiz/quiz.module';
import { QuestionModule } from './question/question.module';
import { Quiz } from './quiz/quiz.model';
import { AnswerModule } from './answer/answer.module';
import { QuizResultModule } from './quiz-result/quiz-result.module';
import { UserAnswerModule } from './user-answer/user-answer.module';
import { Question } from './question/question.model';
import { Answer } from './answer/answer.model';
import { QuizResult } from './quiz-result/quiz-result.model';
import { ConfigModule } from '@nestjs/config';
import { UserAnswer } from './user-answer/user-answer.model';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    SequelizeModule.forRoot({
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRESS_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRESS_PASSWORD,
    database: process.env.POSTGRES_DB,
    models: [
      Quiz,
      Question,
      Answer,
      QuizResult,
      UserAnswer
    ],
    autoLoadModels: true,
  }),
    QuizModule,
    QuestionModule,
    AnswerModule,
    QuizResultModule,
    QuizResultModule,
    UserAnswerModule,
  ]
})
export class AppModule { }
