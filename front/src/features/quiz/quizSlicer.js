import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    quizId: null,
    questions: [],
    questionIndex: 0,
    answers: [], // { questionId: 1, answersIds: [1, 4]}
};

const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        setQuiz: (state, action) => {
            state.quizId = action.payload;
        },
        setQuestions: (state, action) => {
            state.questions = action.payload;
        },
        setAnswer: (state, action) => {
            state.questions = action.payload;
        },
        setQuestionIndex: (state, action) => {
            state.questions = action.payload;
        },
        // nextQuestion: (state) => {
        //     if (state.questionIndex < state.questions.length - 1) {
        //         state.questionIndex += 1;
        //     }
        // }
    },
});

export const {
    setQuiz,
    setQuestions,
    setAnswer,
    setQuestionIndex
} = quizSlice.actions;

export const selectQuestionIndex = (state) => state.quiz.questionIndex;
export const selectQuizId = (state) => state.quiz.quizId;
export const selectAnswers = (state) => state.quiz.answers;


export default quizSlice.reducer;