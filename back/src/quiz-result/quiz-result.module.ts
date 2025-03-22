import { Module } from '@nestjs/common';
import { QuizResultService } from './quiz-result.service';
import { QuizResultController } from './quiz-result.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { QuizResult } from './quiz-result.model';

@Module({
  providers: [QuizResultService],
  controllers: [QuizResultController],
  imports: [
    SequelizeModule.forFeature([QuizResult]),
  ],
  exports: [QuizResultService]
})
export class QuizResultModule { }
