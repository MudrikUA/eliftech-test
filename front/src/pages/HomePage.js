import React, { use, useEffect } from 'react';
import QuizTileGrid from '../components/quiz/QuizTileGrid';
import { useNavigate } from "react-router-dom";
import styles from "./NewQuizPage.module.css"
import axios from 'axios';
import { useState } from 'react';
import { getApiUrl } from '../utils/getApiUrl';

export default function HomePage() {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [sort, setSort] = useState('name');
    const [order, setOrder] = useState('asc');
    const apiUrl = getApiUrl();

    const handleSortTypeChange = (sortType) => {
        switch (sortType) {
            case 'nameAsc':
                setSort('name');
                setOrder('asc');
                break;
            case 'nameDesc':
                setSort('name');
                setOrder('desc');
                break;
            case 'questionCountAsc':
                setSort('questions');
                setOrder('asc');
                break;
            case 'questionCountDesc':
                setSort('questions');
                setOrder('desc');
                break;
            case 'completitionAsc':
                setSort('completition');
                setOrder('asc');
                break;
            case 'completitionDesc':
                setSort('completition');
                setOrder('desc');
                break;
        }
    };

    useEffect(() => {
        const quizState = sessionStorage.getItem('quizState');
        if (quizState) {
            sessionStorage.removeItem('quizState');
        }

        axios
            .get(`${apiUrl}/quiz/`, {
                params: {
                    sort: sort,
                    order: order
                }
            })
            .then((response) => {
                if (response.data) {
                    setQuizzes(response.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [sort, order]);

    return <> <h1>Quiz Catalog</h1>
        <div className={styles.menuGroup}>
            <div className={`${styles.btn}`} onClick={() => navigate('/editQuiz/')}>Create quiz</div>
            <select name="sort" id="sort" onChange={(e) => handleSortTypeChange(e.target.value)}>
                <option value="nameAsc" selected>Name asc</option>
                <option value="nameDesc">Name desc</option>
                <option value="questionCountAsc">Questions asc</option>
                <option value="questionCountDesc">Questions desc</option>
                <option value="completitionAsc">Completition asc</option>
                <option value="completitionDesc">Completition desc</option>
            </select>
        </div>
        <QuizTileGrid quizzes={quizzes} />
    </>
}
