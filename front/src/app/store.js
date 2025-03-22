import { configureStore } from '@reduxjs/toolkit'
import quizReducer from './../features/quiz/quizSlicer.js'

export default configureStore({
  reducer: {
    quiz: quizReducer
  }
})