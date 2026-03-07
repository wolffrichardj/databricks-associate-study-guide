export type DomainId =
  | 'platform'
  | 'ingestion'
  | 'processing'
  | 'production'
  | 'governance'

export interface ExamDomain {
  id: DomainId
  name: string
  weight: number
  description: string
}

export interface Topic {
  id: string
  domainId: DomainId
  name: string
}

export interface StudyResource {
  id: string
  title: string
  url: string
  type: 'academy' | 'docs' | 'exam'
  topicIds: string[]
}

export interface WeeklyTask {
  id: string
  day: number
  title: string
  description: string
  resourceIds: string[]
}

export interface WeeklyTaskProgress {
  taskId: string
  checked: boolean
  completedAt?: string
}

export interface WeeklyPlanState {
  weekStart?: string
  tasksProgress: WeeklyTaskProgress[]
}

export interface QuizQuestion {
  id: string
  domainId: DomainId
  topicId: string
  prompt: string
  choices: Array<{ id: string; text: string }>
  correctChoiceId: string
  explanation: string
  resourceIds: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  scenarioVariant: string
}

export type QuizMode = 'focused_topic' | 'overall_skills'

export interface QuizSessionConfig {
  mode: QuizMode
  questionCount: number
  domainId?: DomainId
  topicId?: string
}

export interface SessionState {
  config: QuizSessionConfig
  questionIds: string[]
  answers: Record<string, string>
  currentIndex: number
  startedAt: string
  seed: number
}

export interface SessionSummary {
  id: string
  completedAt: string
  mode: QuizMode
  questionCount: number
  correctCount: number
  domainAccuracy: Record<DomainId, number>
  topicAccuracy: Record<string, number>
}

export interface TopicPerformance {
  topicId: string
  attempts: number
  correct: number
  accuracy: number
  weak: boolean
}

export interface Recommendation {
  topicId: string
  topicName: string
  domainId: DomainId
  priority: number
  reason: string
  resources: StudyResource[]
}

export interface ExposureState {
  recentQuestionIds: string[]
}

export interface PersistedAppState {
  version: number
  weeklyPlan: WeeklyPlanState
  activeSession?: SessionState
  sessionHistory: SessionSummary[]
  topicPerformance: Record<string, TopicPerformance>
  exposure: ExposureState
}

export interface SessionResult {
  score: number
  correctCount: number
  total: number
  domainAccuracy: Record<DomainId, number>
  topicAccuracy: Record<string, number>
}
