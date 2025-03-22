import { QuestionCreateDto } from "src/question/dto/QuestionCreateDto";

export class QuizCreateDto {
    readonly name: string;
    readonly description: string;
    readonly questions: QuestionCreateDto[];
}