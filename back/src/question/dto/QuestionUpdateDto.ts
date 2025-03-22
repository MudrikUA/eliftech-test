import { AnswerUpdateDto } from "src/answer/dto/AnswerUpdateDto";

export class QuestionUpdateDto {
    readonly id: number;
    readonly question: string;
    readonly type: string;
    readonly answers: AnswerUpdateDto[];
}