import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { QUIZ_QUESTIONS } from './data/questions'
import { createSession, mergeTopicPerformance, calculateSessionResult } from './lib/quiz'
import {
  completeSession,
  loadState,
  markWeeklyTask,
  resetState,
  saveState,
  setActiveSession,
} from './lib/storage'
import { buildRecommendations } from './lib/recommendations'
import type { PersistedAppState, QuizSessionConfig, SessionResult } from './types'
import { NavTabs, type AppView } from './components/NavTabs'
import { WeeklyPlanView } from './components/WeeklyPlanView'
import { QuizSetup } from './components/QuizSetup'
import { QuizPlayer } from './components/QuizPlayer'
import { ResultsPanel } from './components/ResultsPanel'
import { ProgressView } from './components/ProgressView'

const DEFAULT_QUIZ_CONFIG: QuizSessionConfig = {
  mode: 'focused_topic',
  questionCount: 12,
}

function App() {
  const [state, setState] = useState<PersistedAppState>(() => loadState())
  const [view, setView] = useState<AppView>('weekly')
  const [quizConfig, setQuizConfig] = useState<QuizSessionConfig>(DEFAULT_QUIZ_CONFIG)
  const [lastResult, setLastResult] = useState<SessionResult>()

  useEffect(() => {
    saveState(state)
  }, [state])

  const questionMap = useMemo(() => new Map(QUIZ_QUESTIONS.map((question) => [question.id, question])), [])
  const recommendations = useMemo(
    () => buildRecommendations(state.topicPerformance),
    [state.topicPerformance],
  )

  const handleStartQuiz = () => {
    const session = createSession(quizConfig, QUIZ_QUESTIONS, state.exposure)
    setState((currentState) => setActiveSession(currentState, session))
    setLastResult(undefined)
    setView('quiz')
  }

  const handleAnswer = (questionId: string, choiceId: string) => {
    if (!state.activeSession) {
      return
    }

    setState((currentState) => {
      if (!currentState.activeSession) {
        return currentState
      }

      return setActiveSession(currentState, {
        ...currentState.activeSession,
        answers: {
          ...currentState.activeSession.answers,
          [questionId]: choiceId,
        },
      })
    })
  }

  const handleNext = () => {
    setState((currentState) => {
      if (!currentState.activeSession) {
        return currentState
      }

      return setActiveSession(currentState, {
        ...currentState.activeSession,
        currentIndex: Math.min(
          currentState.activeSession.currentIndex + 1,
          currentState.activeSession.questionIds.length - 1,
        ),
      })
    })
  }

  const handleFinish = () => {
    setState((currentState) => {
      if (!currentState.activeSession) {
        return currentState
      }

      const result = calculateSessionResult(currentState.activeSession, QUIZ_QUESTIONS)
      setLastResult(result)

      const domainAccuracy = result.domainAccuracy
      const topicAccuracy = result.topicAccuracy
      const summary = {
        id: `${Date.now()}`,
        completedAt: new Date().toISOString(),
        mode: currentState.activeSession.config.mode,
        questionCount: result.total,
        correctCount: result.correctCount,
        domainAccuracy,
        topicAccuracy,
      }

      const mergedTopicPerformance = mergeTopicPerformance(
        currentState.topicPerformance,
        currentState.activeSession,
        QUIZ_QUESTIONS,
      )

      return completeSession(
        currentState,
        summary,
        mergedTopicPerformance,
        currentState.activeSession.questionIds,
      )
    })
  }

  const handleResetProgram = () => {
    setState(resetState())
    setQuizConfig(DEFAULT_QUIZ_CONFIG)
    setLastResult(undefined)
    setView('weekly')
  }

  const handleResetWeekly = () => {
    const freshState = resetState()
    setState((currentState) => ({
      ...currentState,
      weeklyPlan: freshState.weeklyPlan,
    }))
  }

  const activeSessionQuestions = state.activeSession
    ? state.activeSession.questionIds
        .map((questionId) => questionMap.get(questionId))
        .filter((question): question is NonNullable<typeof question> => Boolean(question))
    : []

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <h1>Databricks Associate Study App</h1>
          <p>Use focused-topic practice and exam-style sessions to close weak domains quickly.</p>
        </div>
        <button type="button" onClick={handleResetProgram} className="danger" data-testid="reset-program">
          Reset Program
        </button>
      </header>

      <NavTabs view={view} onChange={setView} />

      {view === 'weekly' ? (
        <WeeklyPlanView
          weeklyPlan={state.weeklyPlan}
          onToggleTask={(taskId, checked) => setState((currentState) => markWeeklyTask(currentState, taskId, checked))}
          onResetWeekly={handleResetWeekly}
        />
      ) : null}

      {view === 'quiz' ? (
        <section className="quiz-stack">
          {state.activeSession ? (
            <QuizPlayer
              session={state.activeSession}
              questions={activeSessionQuestions}
              onAnswer={handleAnswer}
              onNext={handleNext}
              onFinish={handleFinish}
            />
          ) : (
            <QuizSetup config={quizConfig} onConfigChange={setQuizConfig} onStart={handleStartQuiz} />
          )}
          {lastResult ? (
            <ResultsPanel
              result={lastResult}
              recommendations={recommendations}
              onBackToSetup={() => {
                setLastResult(undefined)
                setView('quiz')
              }}
            />
          ) : null}
        </section>
      ) : null}

      {view === 'progress' ? (
        <ProgressView sessionHistory={state.sessionHistory} topicPerformance={state.topicPerformance} />
      ) : null}
    </main>
  )
}

export default App
