import ReactMarkdown from "react-markdown";
import type { QuizQuestion, SessionState } from "../types";

interface QuizPlayerProps {
  session: SessionState;
  questions: QuizQuestion[];
  onAnswer: (questionId: string, choiceId: string) => void;
  onNext: () => void;
  onFinish: () => void;
}

export function QuizPlayer({
  session,
  questions,
  onAnswer,
  onNext,
  onFinish,
}: QuizPlayerProps) {
  const activeQuestionId = session.questionIds[session.currentIndex];
  const activeQuestion = questions.find(
    (question) => question.id === activeQuestionId,
  );

  if (!activeQuestion) {
    return (
      <section className="panel">
        <h2>Quiz Session Error</h2>
        <p>Question not found in current bank.</p>
      </section>
    );
  }

  const selectedChoiceId = session.answers[activeQuestion.id];
  const isLastQuestion = session.currentIndex >= session.questionIds.length - 1;

  return (
    <section className="panel" data-testid="quiz-player">
      <h2>
        Question {session.currentIndex + 1} of {session.questionIds.length}
      </h2>
      <div className="quiz-question-text">
        <ReactMarkdown>{activeQuestion.prompt}</ReactMarkdown>
      </div>

      <div className="choice-list">
        {activeQuestion.choices.map((choice) => (
          <label key={choice.id} className="choice-item">
            <input
              type="radio"
              name={activeQuestion.id}
              checked={selectedChoiceId === choice.id}
              onChange={() => onAnswer(activeQuestion.id, choice.id)}
            />
            <div className="choice-text">
              <ReactMarkdown>{choice.text}</ReactMarkdown>
            </div>
          </label>
        ))}
      </div>

      <div className="actions-row">
        {isLastQuestion ? (
          <button type="button" onClick={onFinish} disabled={!selectedChoiceId}>
            Finish Quiz
          </button>
        ) : (
          <button type="button" onClick={onNext} disabled={!selectedChoiceId}>
            Next Question
          </button>
        )}
      </div>
    </section>
  );
}
