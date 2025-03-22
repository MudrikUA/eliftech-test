import { AnswerCreateDto } from "src/answer/dto/AnswerCreateDto";

export class QuestionCreateDto {
    readonly question: string;
    readonly type: string;
    readonly answers: AnswerCreateDto[];
}