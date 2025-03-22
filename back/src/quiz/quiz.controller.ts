import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizCreateDto } from './dto/QuizCreateDto';
import { QuizUpdateDto } from './dto/QuizUpdateDto';

@Controller('quiz')
export class QuizController {
    constructor(private quizService: QuizService) {}

    @Get()
    async getAllQuizzes(@Query('sort') sort: string, @Query('order') order: 'asc' | 'desc' = 'asc') {
        return await this.quizService.getAll(sort, order);
    }

    @Get(':id')
    async getQuizById(@Param('id') id: string) {
        return this.quizService.getById(id);
    }

    @Post()
    async createQuiz(@Body() dto: QuizCreateDto) {
        return this.quizService.create(dto);
    }

    @Put(':id')
    async updateQuiz(@Param('id') id: number, @Body() dto: QuizUpdateDto) {
        return this.quizService.update(id, dto);
    }

    @Delete(':id')
    async deleteQuiz(@Param('id') id: number) {
        return this.quizService.delete(id);
    }

}
