import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Answer } from './answer.model';

@Module({
  providers: [AnswerService],
  controllers: [AnswerController],
  imports: [
    SequelizeModule.forFeature([Answer]),
  ],

})
export class AnswerModule { }
