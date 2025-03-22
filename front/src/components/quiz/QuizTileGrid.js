import React, { useEffect, useState } from "react";
import QuizTile from "./QuizTile";
import styles from "./QuizTileGrid.module.css";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableQuizTile = ({ quiz, id }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        position: "relative"
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <div {...listeners} className={styles.dndField} />
            <QuizTile quiz={quiz} />
        </div>
    );
};

const QuizTileGrid = ({ quizzes: initialQuizzes }) => {
    console.log("initialQuizzes:", initialQuizzes);
    const [quizzes, setQuizzes] = useState(initialQuizzes);
    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setQuizzes((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    useEffect(() => {
        setQuizzes(initialQuizzes);
    }, [initialQuizzes])

    return (
        <div className="quiz-grid-container">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={quizzes.map(quiz => quiz.id)} strategy={rectSortingStrategy}>
                    <div className={styles.quizTileGrid || "fallback-grid-style"}>
                        {quizzes.map((quiz) => (
                            <SortableQuizTile key={quiz.id} id={quiz.id} quiz={quiz} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default QuizTileGrid;


// import QuizTile from "./QuizTile";
// import styles from "./QuizTileGrid.module.css"

// const QuizTileGrid = ({ quizzes }) => {

//     return <div className={styles.quizTileGrid}>
//         {quizzes.map(quiz => (
//             <QuizTile quiz={quiz} key={quiz.id} />
//         ))}
//     </div>
// }

// export default QuizTileGrid;