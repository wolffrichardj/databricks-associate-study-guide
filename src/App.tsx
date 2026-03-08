import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { QUIZ_QUESTIONS } from "./data/questions";
import { EXAM_DOMAINS, TOPICS } from "./data/exam";
import {
  createSession,
  mergeTopicPerformance,
  calculateSessionResult,
  getAvailableQuestionCount,
} from "./lib/quiz";
import {
  completeSession,
  loadState,
  markWeeklyTask,
  resetState,
  saveState,
  setActiveSession,
} from "./lib/storage";
import { buildRecommendations } from "./lib/recommendations";
import type {
  PersistedAppState,
  QuizSessionConfig,
  SessionResult,
  TopicPerformance,
} from "./types";
import { NavTabs, type AppView } from "./components/NavTabs";
import { WeeklyPlanView } from "./components/WeeklyPlanView";
import { QuizSetup } from "./components/QuizSetup";
import { QuizPlayer } from "./components/QuizPlayer";
import { ResultsPanel } from "./components/ResultsPanel";
import { ProgressView } from "./components/ProgressView";

const FULL_EXAM_DEFAULT_COUNT = 45;
const FOCUSED_DEFAULT_COUNT = 10;

const DEFAULT_QUIZ_CONFIG: QuizSessionConfig = {
  mode: "focused_topic",
  questionCount: FOCUSED_DEFAULT_COUNT,
};

const DOMAIN_HERO_LABELS: Record<string, string> = {
  platform: "Platform",
  ingestion: "Dev + Ingestion",
  processing: "Processing",
  production: "Production",
  governance: "Governance",
};

const VIEW_QUERY_KEY = "view";
const DEFAULT_VIEW: AppView = "weekly";
const ALLOWED_VIEWS: AppView[] = ["weekly", "quiz"];

const getInitialView = (): AppView => {
  const params = new URLSearchParams(window.location.search);
  const urlView = params.get(VIEW_QUERY_KEY);
  return ALLOWED_VIEWS.includes(urlView as AppView)
    ? (urlView as AppView)
    : DEFAULT_VIEW;
};

function App() {
  const [state, setState] = useState<PersistedAppState>(() => loadState());
  const [view, setView] = useState<AppView>(getInitialView);
  const [quizConfig, setQuizConfig] =
    useState<QuizSessionConfig>(DEFAULT_QUIZ_CONFIG);
  const [lastResult, setLastResult] = useState<SessionResult>();
  const [warningToast, setWarningToast] = useState<string>();

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set(VIEW_QUERY_KEY, view);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`,
    );
  }, [view]);

  useEffect(() => {
    if (!warningToast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setWarningToast(undefined);
    }, 3500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [warningToast]);

  const questionMap = useMemo(
    () => new Map(QUIZ_QUESTIONS.map((question) => [question.id, question])),
    [],
  );
  const fullExamMaxCount = QUIZ_QUESTIONS.length;
  const fullExamDefaultCount = Math.min(
    FULL_EXAM_DEFAULT_COUNT,
    fullExamMaxCount,
  );
  const focusedQuestionPoolCount = useMemo(() => {
    if (quizConfig.topicId) {
      return QUIZ_QUESTIONS.filter(
        (question) => question.topicId === quizConfig.topicId,
      ).length;
    }

    if (quizConfig.domainId) {
      return QUIZ_QUESTIONS.filter(
        (question) => question.domainId === quizConfig.domainId,
      ).length;
    }

    return QUIZ_QUESTIONS.length;
  }, [quizConfig.domainId, quizConfig.topicId]);
  const focusedMaxCount = Math.max(focusedQuestionPoolCount, 1);
  const focusedDefaultCount = Math.min(FOCUSED_DEFAULT_COUNT, focusedMaxCount);
  const recommendations = useMemo(
    () => buildRecommendations(state.topicPerformance),
    [state.topicPerformance],
  );

  const completedWeeklyTasks = state.weeklyPlan.tasksProgress.filter(
    (task) => task.checked,
  ).length;
  const totalWeeklyTasks = state.weeklyPlan.tasksProgress.length;
  const weeklyCompletion = Math.round(
    (completedWeeklyTasks / Math.max(totalWeeklyTasks, 1)) * 100,
  );

  const domainSignals = useMemo(
    () =>
      EXAM_DOMAINS.map((domain) => {
        const topicIds = TOPICS.filter(
          (topic) => topic.domainId === domain.id,
        ).map((topic) => topic.id);
        const entries = topicIds
          .map((topicId) => state.topicPerformance[topicId])
          .filter((entry): entry is TopicPerformance => Boolean(entry));

        if (entries.length === 0) {
          return {
            domainId: domain.id,
            name: domain.name,
            accuracy: 0,
          };
        }

        const avg =
          entries.reduce((sum, entry) => sum + entry.accuracy, 0) /
          entries.length;
        return {
          domainId: domain.id,
          name: domain.name,
          accuracy: Math.round(avg * 100),
        };
      }),
    [state.topicPerformance],
  );

  const handleStartQuiz = () => {
    const availableQuestionCount = getAvailableQuestionCount(
      quizConfig,
      QUIZ_QUESTIONS,
    );

    if (
      availableQuestionCount > 0 &&
      quizConfig.questionCount > availableQuestionCount
    ) {
      setWarningToast(
        `There are only ${availableQuestionCount} questions in this section. We will use all available questions.`,
      );
    }

    const session = createSession(quizConfig, QUIZ_QUESTIONS, state.exposure);
    setState((currentState) => setActiveSession(currentState, session));
    setLastResult(undefined);
    setView("quiz");
  };

  const handleAnswer = (questionId: string, choiceId: string) => {
    if (!state.activeSession) {
      return;
    }

    setState((currentState) => {
      if (!currentState.activeSession) {
        return currentState;
      }

      return setActiveSession(currentState, {
        ...currentState.activeSession,
        answers: {
          ...currentState.activeSession.answers,
          [questionId]: choiceId,
        },
      });
    });
  };

  const handleNext = () => {
    setState((currentState) => {
      if (!currentState.activeSession) {
        return currentState;
      }

      return setActiveSession(currentState, {
        ...currentState.activeSession,
        currentIndex: Math.min(
          currentState.activeSession.currentIndex + 1,
          currentState.activeSession.questionIds.length - 1,
        ),
      });
    });
  };

  const handleFinish = () => {
    setState((currentState) => {
      if (!currentState.activeSession) {
        return currentState;
      }

      const result = calculateSessionResult(
        currentState.activeSession,
        QUIZ_QUESTIONS,
      );
      setLastResult(result);

      const domainAccuracy = result.domainAccuracy;
      const topicAccuracy = result.topicAccuracy;
      const summary = {
        id: `${Date.now()}`,
        completedAt: new Date().toISOString(),
        mode: currentState.activeSession.config.mode,
        questionCount: result.total,
        correctCount: result.correctCount,
        domainAccuracy,
        topicAccuracy,
      };

      const mergedTopicPerformance = mergeTopicPerformance(
        currentState.topicPerformance,
        currentState.activeSession,
        QUIZ_QUESTIONS,
      );

      return completeSession(
        currentState,
        summary,
        mergedTopicPerformance,
        currentState.activeSession.questionIds,
      );
    });
  };

  const handleCancelQuiz = () => {
    setState((currentState) => setActiveSession(currentState, undefined));
    setLastResult(undefined);
    setView("quiz");
  };

  const handleStartOver = () => {
    setState(resetState());
    setQuizConfig(DEFAULT_QUIZ_CONFIG);
    setLastResult(undefined);
    setView("weekly");
  };

  const handlePracticeRecommendation = (topicId: string) => {
    const topicQuestionCount = QUIZ_QUESTIONS.filter((question) => question.topicId === topicId).length
    const topicDefaultCount = Math.min(FOCUSED_DEFAULT_COUNT, Math.max(topicQuestionCount, 1))

    setQuizConfig({
      mode: "focused_topic",
      questionCount: topicDefaultCount,
      topicId,
    });
    setLastResult(undefined);
    setView("quiz");
  };

  const activeSessionQuestions = state.activeSession
    ? state.activeSession.questionIds
      .map((questionId) => questionMap.get(questionId))
      .filter((question): question is NonNullable<typeof question> =>
        Boolean(question),
      )
    : [];

  return (
    <main className="app-shell">
      {warningToast ? (
        <div className="toast toast-warning" role="status" aria-live="polite">
          {warningToast}
        </div>
      ) : null}

      <header className="app-header">
        <div>
          <h1>Databricks Associate Study App</h1>
          <p>
            Use focused-topic practice and exam-style sessions to close weak
            domains quickly.
          </p>
        </div>
        <button
          type="button"
          onClick={handleStartOver}
          className="danger"
          data-testid="reset-program"
          title="Start Study Over clears your weekly checklist, quiz history, and evaluation scores on this device."
        >
          Start Study Over
        </button>
      </header>

      {view !== "quiz" ? (
        <section className="hero-summary panel" data-testid="progress-hero">
          <h2>Study Plan Completion</h2>
          <div
            className="progress-track"
            role="img"
            aria-label={`Weekly completion ${weeklyCompletion}%`}
          >
            <div
              className="progress-fill"
              style={{ width: `${weeklyCompletion}%` }}
            />
          </div>
          <p className="stat-text">
            {completedWeeklyTasks} of {totalWeeklyTasks} checklist items
            complete ({weeklyCompletion}%).
          </p>

          <h3>Knowledge Area Confidence</h3>
          <ul className="domain-bars hero-domain-bars">
            {domainSignals.map((domain) => (
              <li key={domain.domainId}>
                <div className="domain-row compact">
                  <span>
                    {DOMAIN_HERO_LABELS[domain.domainId] ?? domain.name}
                  </span>
                  <span>{domain.accuracy}%</span>
                </div>
                <div className="progress-track slim" aria-hidden="true">
                  <div
                    className="progress-fill"
                    style={{ width: `${domain.accuracy}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <NavTabs view={view} onChange={setView} />

      {view === "weekly" ? (
        <WeeklyPlanView
          weeklyPlan={state.weeklyPlan}
          onToggleTask={(taskId, checked) =>
            setState((currentState) =>
              markWeeklyTask(currentState, taskId, checked),
            )
          }
        />
      ) : null}

      {view === "quiz" ? (
        <section className="quiz-stack">
          {state.activeSession ? (
            <QuizPlayer
              session={state.activeSession}
              questions={activeSessionQuestions}
              onAnswer={handleAnswer}
              onNext={handleNext}
              onFinish={handleFinish}
              onCancelQuiz={handleCancelQuiz}
            />
          ) : (
            <QuizSetup
              config={quizConfig}
              onConfigChange={setQuizConfig}
              onStart={handleStartQuiz}
              fullExamDefaultCount={fullExamDefaultCount}
              focusedDefaultCount={focusedDefaultCount}
              fullExamMaxCount={fullExamMaxCount}
              focusedMaxCount={focusedMaxCount}
            />
          )}
          {lastResult ? (
            <ResultsPanel
              result={lastResult}
              recommendations={recommendations}
              onBackToSetup={() => {
                setLastResult(undefined);
                setView("quiz");
              }}
            />
          ) : null}
        </section>
      ) : null}

      {view === "progress" ? (
        <ProgressView
          sessionHistory={state.sessionHistory}
          topicPerformance={state.topicPerformance}
          weeklyPlan={state.weeklyPlan}
          onOpenWeeklyPlan={() => setView("weekly")}
          onPracticeTopic={handlePracticeRecommendation}
        />
      ) : null}
    </main>
  );
}

export default App;
