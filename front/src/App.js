import './App.css';
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import NewQuizPage from "./pages/NewQuizPage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} exact />
        <Route path="/quiz/" element={<QuizPage />} />
        <Route path="/editQuiz/" element={<NewQuizPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
