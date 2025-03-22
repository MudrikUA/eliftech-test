import { Module } from '@nestjs/common';
import { UserAnswerService } from './user-answer.service';
import { UserAnswerController } from './user-answer.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserAnswer } from './user-answer.model';

@Module({
  providers: [UserAnswerService],
  controllers: [UserAnswerController],
    imports: [
      SequelizeModule.forFeature([UserAnswer]),
    ],
})
export class UserAnswerModule {}
