import { UserAnswer } from "src/user-answer/user-answer.model";

export class UserAnswerCreateDto {
    readonly questionId: number;
    readonly answers: string[];
}