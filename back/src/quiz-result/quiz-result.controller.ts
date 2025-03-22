import { Body, Controller, Post } from '@nestjs/common';
import { QuizResultCreateDto } from './dto/QuizResultCreateDto';
import { QuizResultService } from './quiz-result.service';

@Controller('quiz-result')
export class QuizResultController {
    constructor(private quizResultService: QuizResultService) {}

    @Post()
    async createQuestion(@Body() dto: QuizResultCreateDto) {
        return this.quizResultService.create(dto);
    }
}
