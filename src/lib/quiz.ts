import { EXAM_DOMAINS, TOPICS } from '../data/exam'
import type {
  DomainId,
  ExposureState,
  QuizQuestion,
  QuizSessionConfig,
  SessionResult,
  SessionState,
  TopicPerformance,
} from '../types'

const MIN_QUESTIONS = 5
const DEFAULT_QUESTION_COUNT = 10

export function clampQuestionCount(value: number): number {
  return Math.max(MIN_QUESTIONS, Math.min(60, value || DEFAULT_QUESTION_COUNT))
}

function shuffle<T>(items: T[], seed: number): T[] {
  const output = [...items]
  let cursor = seed
  for (let index = output.length - 1; index > 0; index -= 1) {
    cursor = (cursor * 9301 + 49297) % 233280
    const swapIndex = Math.floor((cursor / 233280) * (index + 1))
    ;[output[index], output[swapIndex]] = [output[swapIndex], output[index]]
  }
  return output
}

function selectWithoutRecent(questions: QuizQuestion[], recentIds: string[], count: number, seed: number): QuizQuestion[] {
  const recentSet = new Set(recentIds)
  const preferred = questions.filter((question) => !recentSet.has(question.id))
  const fallback = questions.filter((question) => recentSet.has(question.id))

  const selected = [...shuffle(preferred, seed), ...shuffle(fallback, seed + 9)]
  return selected.slice(0, count)
}

function weightedDomainPick(
  questions: QuizQuestion[],
  questionCount: number,
  recentIds: string[],
  seed: number,
): QuizQuestion[] {
  const byDomain: Record<DomainId, QuizQuestion[]> = {
    platform: [],
    ingestion: [],
    processing: [],
    production: [],
    governance: [],
  }

  questions.forEach((question) => {
    byDomain[question.domainId].push(question)
  })

  const counts = EXAM_DOMAINS.map((domain) => ({
    domainId: domain.id,
    quota: Math.max(1, Math.round((domain.weight / 100) * questionCount)),
  }))

  const selected: QuizQuestion[] = []

  counts.forEach(({ domainId, quota }, domainIndex) => {
    const domainQuestions = byDomain[domainId]
    const picks = selectWithoutRecent(domainQuestions, recentIds, quota, seed + domainIndex)
    selected.push(...picks)
  })

  const uniqueSelected = Array.from(new Map(selected.map((question) => [question.id, question])).values())

  if (uniqueSelected.length >= questionCount) {
    return shuffle(uniqueSelected, seed + 77).slice(0, questionCount)
  }

  const selectedSet = new Set(uniqueSelected.map((question) => question.id))
  const remainder = selectWithoutRecent(
    questions.filter((question) => !selectedSet.has(question.id)),
    recentIds,
    questionCount - uniqueSelected.length,
    seed + 101,
  )

  return [...uniqueSelected, ...remainder]
}

export function createSession(
  config: QuizSessionConfig,
  questions: QuizQuestion[],
  exposure: ExposureState,
  seed = Date.now(),
): SessionState {
  const questionCount = clampQuestionCount(config.questionCount)

  const filteredQuestions = questions.filter((question) => {
    if (config.mode === 'focused_topic') {
      if (config.topicId) {
        return question.topicId === config.topicId
      }
      if (config.domainId) {
        return question.domainId === config.domainId
      }
    }
    return true
  })

  const selectedQuestions =
    config.mode === 'overall_skills'
      ? weightedDomainPick(filteredQuestions, questionCount, exposure.recentQuestionIds, seed)
      : selectWithoutRecent(filteredQuestions, exposure.recentQuestionIds, questionCount, seed)

  return {
    config: {
      ...config,
      questionCount,
    },
    questionIds: selectedQuestions.map((question) => question.id),
    answers: {},
    currentIndex: 0,
    startedAt: new Date().toISOString(),
    seed,
  }
}

export function calculateSessionResult(session: SessionState, questions: QuizQuestion[]): SessionResult {
  const questionMap = new Map(questions.map((question) => [question.id, question]))

  const bucketByDomain: Record<DomainId, { correct: number; total: number }> = {
    platform: { correct: 0, total: 0 },
    ingestion: { correct: 0, total: 0 },
    processing: { correct: 0, total: 0 },
    production: { correct: 0, total: 0 },
    governance: { correct: 0, total: 0 },
  }
  const bucketByTopic: Record<string, { correct: number; total: number }> = {}

  let correctCount = 0

  session.questionIds.forEach((questionId) => {
    const question = questionMap.get(questionId)
    if (!question) {
      return
    }

    const selectedChoiceId = session.answers[questionId]
    const isCorrect = selectedChoiceId === question.correctChoiceId
    const domainBucket = bucketByDomain[question.domainId]
    domainBucket.total += 1

    if (!bucketByTopic[question.topicId]) {
      bucketByTopic[question.topicId] = { correct: 0, total: 0 }
    }

    bucketByTopic[question.topicId].total += 1

    if (isCorrect) {
      correctCount += 1
      domainBucket.correct += 1
      bucketByTopic[question.topicId].correct += 1
    }
  })

  const domainAccuracy = Object.fromEntries(
    Object.entries(bucketByDomain).map(([domainId, values]) => [
      domainId,
      values.total === 0 ? 0 : values.correct / values.total,
    ]),
  ) as Record<DomainId, number>

  const topicAccuracy = Object.fromEntries(
    Object.entries(bucketByTopic).map(([topicId, values]) => [topicId, values.total === 0 ? 0 : values.correct / values.total]),
  )

  return {
    score: session.questionIds.length === 0 ? 0 : correctCount / session.questionIds.length,
    correctCount,
    total: session.questionIds.length,
    domainAccuracy,
    topicAccuracy,
  }
}

export function mergeTopicPerformance(
  previous: Record<string, TopicPerformance>,
  session: SessionState,
  questions: QuizQuestion[],
): Record<string, TopicPerformance> {
  const result: Record<string, TopicPerformance> = { ...previous }
  const questionMap = new Map(questions.map((question) => [question.id, question]))

  session.questionIds.forEach((questionId) => {
    const question = questionMap.get(questionId)
    if (!question) {
      return
    }

    const existing = result[question.topicId] ?? {
      topicId: question.topicId,
      attempts: 0,
      correct: 0,
      accuracy: 0,
      weak: false,
    }

    const isCorrect = session.answers[questionId] === question.correctChoiceId
    const attempts = existing.attempts + 1
    const correct = existing.correct + (isCorrect ? 1 : 0)
    const accuracy = correct / attempts

    result[question.topicId] = {
      topicId: question.topicId,
      attempts,
      correct,
      accuracy,
      weak: attempts >= 3 && accuracy < 0.7,
    }
  })

  return result
}

export function getTopicName(topicId: string): string {
  return TOPICS.find((topic) => topic.id === topicId)?.name ?? topicId
}
