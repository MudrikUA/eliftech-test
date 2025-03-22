import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import styles from "./NewQuizPage.module.css"

export default function NewQuizPage() {
    console.log('run');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [quizId, setQuizId] = useState(searchParams.get('id'));
    const [quiz, setQuiz] = useState({
        name: "",
        description: "",
        completition: 0,
        questions: []
    });
    const [isSubmit, setIsSubmit] = useState(false);

    const handleQuestionChange = (questionIndex, e) => {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[questionIndex].question = e.target.value;

        setQuiz({
            ...quiz,
            questions: updatedQuestions
        });
    };

    const handleQuestionTypeChange = (questionIndex, e) => {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[questionIndex].type = e.target.value;

        setQuiz({
            ...quiz,
            questions: updatedQuestions
        });
    };

    const handleAddQuestion = () => {
        const newQuestion = {
            question: "",
            type: "singleChoice",
            answers: []
        };

        setQuiz({
            ...quiz,
            questions: [...quiz.questions, newQuestion]
        });
    };

    const handleRemoveQuestion = (questionIndex) => {
        const updatedQuestions = quiz.questions.filter((_, index) => index !== questionIndex);

        setQuiz({
            ...quiz,
            questions: updatedQuestions
        });
    };

    const handleAnswerChange = (questionIndex, answerIndex, e) => {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[questionIndex].answers[answerIndex].answer = e.target.value;

        setQuiz({
            ...quiz,
            questions: updatedQuestions
        });
    };

    const handleIsCorrectChange = (questionIndex, answerIndex, e) => {
        const updatedQuestions = [...quiz.questions];

        if (updatedQuestions[questionIndex].type === "single") {
            updatedQuestions[questionIndex].answers.forEach(answer => {
                answer.isCorrect = false;
            });
        }

        updatedQuestions[questionIndex].answers[answerIndex].isCorrect = e.target.checked;

        setQuiz({
            ...quiz,
            questions: updatedQuestions
        });
    };

    const handleAddAnswer = (questionIndex) => {
        const newAnswer = {
            answer: "",
            isCorrect: false
        };

        const updatedQuestions = [...quiz.questions];
        updatedQuestions[questionIndex].answers.push(newAnswer);

        setQuiz({
            ...quiz,
            questions: updatedQuestions
        });
    };

    const handleRemoveAnswer = (questionIndex, answerIndex) => {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[questionIndex].answers = updatedQuestions[questionIndex].answers.filter(
            (_, index) => index !== answerIndex
        );

        setQuiz({
            ...quiz,
            questions: updatedQuestions
        });
    };

    const handleQuizChange = (e) => {
        setQuiz({
            ...quiz,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmit(true);
    };

    const saveQuiz = (updatedQuiz) => {
        if (!quiz.id) {
            axios
                .post(`${process.env.REACT_APP_API_URL}/quiz/`, updatedQuiz)
                .then((response) => {
                    console.log('Post- ' + response.data)
                    navigate('/');
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            axios
                .put(`${process.env.REACT_APP_API_URL}/quiz/${quiz.id}`, updatedQuiz)
                .then((response) => {
                    console.log('Put- ' + response.data)
                    navigate('/');
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/quiz/${quizId}`)
            .then((response) => {
                if (response.data && response.data.id) {
                    console.log(response.data);
                    setQuiz(response.data);
                } else {
                    setQuiz({
                        name: "",
                        description: "",
                        completition: 0,
                        questions: []
                    });
                }
            })
            .catch((error) => {
                setQuiz({
                    name: "",
                    description: "",
                    completition: 0,
                    questions: []
                });
                console.log(error);
            });
    }, [quizId]);

    useEffect(() => {
        if (isSubmit) {
            setIsSubmit(false);
            if (!quiz.name.trim() || !quiz.description.trim()) {
                alert('Quiz must have a name and description');
                return;
            }

            const emptyQuestionWithAnswers = quiz.questions.find(q =>
                q.question.trim() === '' && q.answers && q.answers.some(a => a.answer.trim() !== '')
            );

            if (emptyQuestionWithAnswers) {
                alert('All questions must have text');
                return;
            }

            const cleanedQuestions = quiz.questions
                .filter(q => q.question.trim() !== '')
                .map(q => ({
                    ...q,
                    answers: q.answers ? q.answers.filter(a => a.answer.trim() !== '') : []
                }));

            if (cleanedQuestions.length === 0) {
                alert('Quiz must have at least one question');
                return;
            }

            for (let q of cleanedQuestions) {
                if (q.type === 'text') continue;

                if (q.type === 'singleChoice' && q.answers.length < 2) {
                    alert('Single choice questions must have at least 2 answers');
                    return;
                }
                if (q.type === 'multipleChoices' && q.answers.length < 3) {
                    alert('Multiple choice questions must have at least 3 answers');
                    return;
                }

                const correctAnswers = q.answers.filter(a => a.isCorrect).length;
                if (q.type === 'singleChoice' && correctAnswers !== 1) {
                    alert('Single choice questions must have exactly one correct answer');
                    return;
                }
                if (q.type === 'multipleChoices' && correctAnswers < 2) {
                    alert('Multiple choice questions must have at least two correct answers');
                    return;
                }
            }

            const updatedQuiz = {
                ...quiz,
                questions: cleanedQuestions
            };

            saveQuiz(updatedQuiz);
            //navigate('/');
        }
    }, [isSubmit]);

    return <>
        {!quizId ? <h1>Create Quiz</h1> : <h1>Edit Quiz</h1>}
        <div className={styles.quizEditingBlock}>
            <div className={styles.quizDetails}>
                <label for='name'>Quiz Name</label>
                <input name='name' type="text" placeholder="Quiz Name" value={quiz.name} onChange={handleQuizChange} />
                <label for='description'>Quiz Description</label>
                <input name='description' type="text" placeholder="Quiz Description" value={quiz.description} onChange={handleQuizChange} />
            </div>
            <div className={`${styles.quizEditing} `}>
                <div className={styles.inlineStretch}>
                    <div onClick={handleAddQuestion}>Questions ({quiz?.questions?.length})</div>
                    <div className={styles.btn} onClick={handleAddQuestion}>Add question</div>
                </div>

                {quiz.questions?.map((question, questionIndex) => (
                    <div key={question.id ? question.id : questionIndex} className={styles.quizQuestion}>
                        <div className={styles.inlineStretch}>
                            <label>Question #{questionIndex + 1}</label>
                            <input type="text" placeholder="Question" value={question.question} onChange={(e) => handleQuestionChange(questionIndex, e)} />
                            <select name="cars" id="cars" onChange={(e) => handleQuestionTypeChange(questionIndex, e)}>
                                <option value="singleChoice" selected={question.type === 'singleChoice'}>single choice</option>
                                <option value="multipleChoices" selected={question.type === 'multipleChoices'}>multiple choices</option>
                                <option value="text" selected={question.type === 'text'}>text</option>
                            </select>
                            <div className={styles.btn} onClick={() => handleRemoveQuestion(questionIndex)}>Remove</div>
                        </div>
                        <div className={`${styles.inlineStretch} ${question.type === "text" ? styles.hide : ''}`} >
                            <div>Answers ({question.answers?.length})</div>
                            <div className={styles.btn} onClick={() => handleAddAnswer(questionIndex)}>Add answer</div>
                        </div>
                        {question?.answers?.map((answer, answerIndex) => (
                            <div key={answer.id ? answer.id : answerIndex} className={`${question.type === "text" ? styles.hide : ''}`} >
                                <div className={styles.inlineStretch}>
                                    <label>Answer #{answerIndex + 1}</label>
                                    <input type="text" placeholder="Answer" value={answer.answer} onChange={(e) => handleAnswerChange(questionIndex, answerIndex, e)} />
                                    <label >Correct answer</label>
                                    <input type="checkbox" checked={answer.isCorrect} onChange={(e) => handleIsCorrectChange(questionIndex, answerIndex, e)} />
                                    <div className={styles.btn} onClick={() => handleRemoveAnswer(questionIndex, answerIndex)}>Remove</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className={styles.quizEditingBtnBlock}>
                <div className={styles.btn} onClick={handleSubmit}>Save quiz</div>
                <div className={styles.btn} onClick={() => navigate(`/`)}>Close</div>
            </div>
        </div>
    </>
}
