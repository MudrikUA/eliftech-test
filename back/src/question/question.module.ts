import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Question } from './question.model';

@Module({
  providers: [QuestionService],
  controllers: [QuestionController],
  imports: [
    SequelizeModule.forFeature([Question]),
  ],
})
export class QuestionModule { }
