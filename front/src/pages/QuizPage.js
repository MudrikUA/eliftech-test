import React, { use, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

import styles from "./QuizPage.module.css"

export default function QuizPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const quizId = searchParams.get('id');

    if (!quizId) {
        navigate('/');
    }
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [currentAnswers, setCurrentAnswers] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [isDataUpdated, setIsDataUpdated] = useState(false);
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [timeTrack, setTimeTrack] = useState(new Date().getTime());
    const [spendedTime, setSpendedTime] = useState('');
    const [spendedTimeInSeconds, setSpendedTimeInSeconds] = useState(0);

    useEffect(() => {
        loadStateFromSession();
    }, []);

    useEffect(() => {
        axios
            .get(`http://localhost:5000/quiz/${quizId}`)
            .then((response) => {
                if (response.data && response.data.id) {
                    console.log(response.data);
                    setQuiz(response.data);
                    if (response.data.questions && response.data.questions.length > 0) {
                        setCurrentQuestion(response.data.questions[0]);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [quizId]);

    useEffect(() => {
        if (quiz && quiz.questions && quiz.questions.length > currentQuestionIndex) {
            setCurrentQuestion(quiz.questions[currentQuestionIndex]);
        }
    }, [quiz, currentQuestionIndex]);

    useEffect(() => {
        const delayInputTimeoutId = setTimeout(() => {
            if (isDataUpdated) {
                saveCurrentStateInSession();
                setIsDataUpdated(false);
                console.log('Data saved');
            }
        }, 1000);
        return () => clearTimeout(delayInputTimeoutId);
    }, [isDataUpdated]);

    const saveCurrentStateInSession = () => {
        const state = {
            quizId: quiz.id,
            currentQuestionIndex,
            selectedAnswers,
            timeTrack,
        };
        sessionStorage.setItem('quizState', JSON.stringify(state));
    }

    const loadStateFromSession = () => {
        const state = JSON.parse(sessionStorage.getItem('quizState'));
        if (!state || state.quizId !== quiz.id) {
            sessionStorage.removeItem('quizState')
            return;
        }

        setCurrentQuestionIndex(state.currentQuestionIndex);
        setSelectedAnswers(state.selectedAnswers);
        setTimeTrack(state.timeTrack);
        const question = quiz.questions[state.currentQuestionIndex];
        if (!question) {
            navigate('/');
        }
        setCurrentAnswers(state.selectedAnswers.find(item => item.questionId === question.id)?.answers);
        setCurrentQuestion(question);
    }


    const handleNext = () => {
        if (!currentAnswers || currentAnswers.length === 0) {
            alert("Please select an answer");
            return;
        }

        const nextQuestionIndex = currentQuestionIndex + 1;

        if (currentQuestionIndex < quiz.questions.length) {
            setCurrentQuestionIndex(nextQuestionIndex);
            const question = quiz.questions[nextQuestionIndex];

            if (!question) {
                navigate('/');
            }

            setCurrentQuestion(question);
            setCurrentAnswers(selectedAnswers.find(item => item.questionId === question.id)?.answers);
            setIsDataUpdated(true);
        } else {
            navigate('/');
        }
    }

    const handleBack = () => {
        const prevQuestionIndex = currentQuestionIndex - 1;
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prevQuestionIndex);
            const question = quiz.questions[prevQuestionIndex];
            if (!question) {
                navigate('/');
            }
            setCurrentQuestion(question);
            setCurrentAnswers(selectedAnswers.find(item => item.questionId === question.id)?.answers);
            setIsDataUpdated(true);
        } else {
            navigate('/');
        }
    }

    const handleAnswerSelection = (e, sellectionType) => {
        const selectedAnswersCopy = [...selectedAnswers];
        const existingAnswer = selectedAnswersCopy.find(a => a.questionId === currentQuestion.id);
        if (existingAnswer) {
            const answerIndex = existingAnswer.answers.indexOf(e.target.value);
            if (sellectionType === "singleChoice") {
                if (answerIndex === -1) {
                    existingAnswer.answers = [e.target.value];
                }
            } else if (sellectionType === "multipleChoices") {
                if (answerIndex > -1) {
                    existingAnswer.answers.splice(answerIndex, 1);
                } else {
                    existingAnswer.answers.push(e.target.value);
                }
            } else {
                existingAnswer.answers = [e.target.value];
            }
            setCurrentAnswers(existingAnswer.answers);
        } else {
            selectedAnswersCopy.push({
                questionId: currentQuestion.id,
                answers: [e.target.value]
            });
            setCurrentAnswers([e.target.value]);
        }

        setSelectedAnswers(selectedAnswersCopy);
        setIsDataUpdated(true);
    }

    const handleTextAnswerSelection = (e) => {
        const selectedAnswersCopy = [...selectedAnswers];
        const existingAnswer = selectedAnswersCopy.find(a => a.questionId === currentQuestion.id);
        if (existingAnswer) {
            existingAnswer.answers = [e.target.value];
            setCurrentAnswers(existingAnswer.answers);
        } else {
            selectedAnswersCopy.push({
                questionId: currentQuestion.id,
                answers: [e.target.value]
            });
            setCurrentAnswers([e.target.value]);
        }

        setSelectedAnswers(selectedAnswersCopy);
        setIsDataUpdated(true);
    }

    const handleComplete = () => {
        setIsQuizCompleted(true);

        axios
            .post(`http://localhost:5000/quiz-result/`, {
                "quizId": quiz.id,
                spendedTimeInSeconds,
                "answers": selectedAnswers
            })
            .then((response) => {
                console.log('ok');
                
            })
            .catch((error) => {
                console.log(error);
            });

    }

    const handleCompleteRedirect = () => {
        navigate('/');
    }

    useEffect(() => {
        if (isQuizCompleted) return;

        const timeInterval = setInterval(() => {
            let currentTime = new Date().getTime();
            let elapsedTime = Math.floor((currentTime - timeTrack) / 1000);

            let hours = Math.floor(elapsedTime / 3600);
            let minutes = Math.floor((elapsedTime % 3600) / 60);
            let seconds = elapsedTime % 60;

            let timeString = "Spended time: ";
            if (hours > 0) timeString += `${hours} h ${minutes} m ${seconds} s`;
            else if (minutes > 0) timeString += `${minutes} m ${seconds} s`;
            else timeString += `${seconds} s`;

            setSpendedTimeInSeconds(elapsedTime);
            setSpendedTime(timeString);
        }, 1000);

        return () => clearInterval(timeInterval);
    }, [isQuizCompleted, timeTrack]);

    return <>{quiz ? <div>
        <h1> Quiz "{quiz.name}"</h1>
        {isQuizCompleted ? <div className={styles.container} >
            <div>Thank you for completing the quiz</div>
            <div>Answers:</div>
            <div>{selectedAnswers.map(item => {
                const question = quiz.questions.find(q => q.id === item.questionId);
                return <div key={item.questionId}>
                    <p><strong>{question.question}</strong></p>
                    <p>Your answer: {
                        question.type === 'text' ?
                            item.answers[0] :
                            item.answers.map(answerId =>
                                question.answers.find(a => a.id === Number(answerId))?.answer
                            ).join(', ')
                    }</p>
                    <p> {
                        question.type === 'text' ?
                            '' :
                            'Correct answer:' + question.answers.filter(a => a.isCorrect).map(a => a.answer).join(', ')
                    }</p>
                </div>;
            })}
            </div>
            <div>{spendedTime}</div>
            <div className={styles.btn} onClick={handleCompleteRedirect}>Back to home</div></div > :
            <div>
                <div className={styles.quizInform}>
                    <span>{"Question: " + (currentQuestionIndex + 1) + '/' + quiz?.questions.length}</span>
                    <span>{spendedTime}</span>
                </div>
                <div className={styles.container}>
                    <div className={styles.question}>
                        <span>{currentQuestion?.question}</span>
                    </div>
                    <div >
                        {currentQuestion?.type === "text" ?
                            <fieldset>
                                <legend>Enter answer as a text:</legend>
                                <textarea className={styles.answerTextArea} name="textAnswer" rows="5" cols="33" onChange={(e) => { handleTextAnswerSelection(e) }} value={selectedAnswers.find(item => item.questionId === currentQuestion.id)?.answers[0]}>
                                </textarea>
                            </fieldset>
                            : <fieldset>
                                <legend>{currentQuestion?.type === "singleChoice" ? "Choose one:" : "Choose all that apply:"}</legend>
                                {currentQuestion?.answers.map((answer, index) => {
                                    return <div key={index} >
                                        {currentQuestion?.type === "singleChoice" ? <div className={styles.btnElement} onChange={(e) => { handleAnswerSelection(e, "singleChoice") }}>
                                            <input type="radio" id={index} name="singleChoiceAnswer" value={answer.id} checked={currentAnswers?.filter(item => Number(item) === answer.id).length > 0} />
                                            <label for={index}>{answer.answer}</label>
                                        </div> : ''}

                                        {currentQuestion.type === "multipleChoices" ? <div className={styles.btnElement} onChange={(e) => { handleAnswerSelection(e, "multipleChoices") }}>
                                            <input type="checkbox" id={index} value={answer.id} name="multipleChoicesAnswer" checked={currentAnswers?.filter(item => Number(item) === answer.id).length > 0} />
                                            <label for={index}>{answer.answer}</label>
                                        </div> : ''}
                                    </div>
                                })}
                            </fieldset>}
                    </div>
                    <div className={styles.btnContainer}>
                        {currentQuestionIndex > 0 ? <div className={styles.btn} onClick={handleBack}>Back</div> :
                            <div className={styles.btn} onClick={handleBack}>Cancel</div>}
                        {currentQuestionIndex < quiz.questions.length - 1 ?
                            <div className={styles.btn} onClick={handleNext}>Next</div> :
                            <div className={styles.btn} onClick={handleComplete}>Complete</div>}
                    </div>
                </div>
            </div>
        }
    </div > : <></>}</>
}