import { QuestionUpdateDto } from "src/question/dto/QuestionUpdateDto";

export class QuizUpdateDto {
    readonly id: number;
    readonly name: string;
    readonly description: string;
    readonly questions: QuestionUpdateDto[];
}