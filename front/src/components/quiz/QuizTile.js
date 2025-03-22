import { useNavigate } from "react-router-dom";
import styles from "./QuizTile.module.css"
import axios from 'axios';

const QuizTile = ({ quiz }) => {
    const navigate = useNavigate();
    const apiUrl = window.env ? window.env.REACT_APP_API_URL : "http://localhost:5000";

    const editAction = (e) => {
        navigate(`/editQuiz?id=${quiz.id}`);
    };

    const runAction = (e) => {
        navigate(`/quiz?id=${quiz.id}`);
    };

    const deleteAction = (e) => {
        console.log('delete');
        axios
            .delete(`${apiUrl}/quiz/${quiz.id}`)
            .then((response) => {
                if (response.data) {
                    window.location.reload(); 
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };



    return <div className={styles.quizTile} key={quiz.id}>
        <div className={styles.quizTileTitleInfo}>
            <h3 className={styles.quizTileTitle}>{quiz.name}</h3>
            <p className={styles.quizTileDesc}>{quiz.description}</p>
            <p className={styles.quizTileQuestions}>Questions: {quiz.questions?.length}</p>
            <p className={styles.quizTileCompletition}>Completition: {quiz.completition}</p>
        </div>
        <div className={styles.quizTileMenuBtn}><span >X</span>
            <ul className={styles.quizTileMenu}>
                <li><div onClick={editAction}>edit</div></li>
                <li><div onClick={runAction}>run</div></li>
                <li><div onClick={deleteAction}>delete</div></li>
            </ul>
        </div>
    </div>
}

export default QuizTile;