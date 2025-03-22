import { UserAnswerCreateDto } from "src/user-answer/dto/UserAnswerCreateDto";

export class QuizResultCreateDto {
    readonly quizId: number;
    readonly spendedTimeInSeconds: number;
    readonly answers: UserAnswerCreateDto[];
}