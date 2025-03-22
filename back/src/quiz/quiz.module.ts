import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Quiz } from './quiz.model';
import { QuizResultModule } from 'src/quiz-result/quiz-result.module';

@Module({
  providers: [QuizService],
  controllers: [QuizController],
  imports: [
    SequelizeModule.forFeature([Quiz]),
    QuizResultModule
  ],
})
export class QuizModule { }
