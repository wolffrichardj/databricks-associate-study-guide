import { WEEKLY_TASKS } from '../data/weeklyPlan'
import type {
  PersistedAppState,
  SessionState,
  SessionSummary,
  TopicPerformance,
  WeeklyPlanState,
  WeeklyTaskProgress,
} from '../types'

const STORAGE_KEY = 'databricks-study-app/v1'
const CURRENT_VERSION = 1
const MAX_HISTORY = 30
const MAX_RECENT_EXPOSURE = 25

function defaultWeeklyState(): WeeklyPlanState {
  const tasksProgress: WeeklyTaskProgress[] = WEEKLY_TASKS.map((task) => ({
    taskId: task.id,
    checked: false,
  }))

  return { tasksProgress }
}

export function createDefaultState(): PersistedAppState {
  return {
    version: CURRENT_VERSION,
    weeklyPlan: defaultWeeklyState(),
    sessionHistory: [],
    topicPerformance: {},
    exposure: {
      recentQuestionIds: [],
    },
  }
}

export function loadState(): PersistedAppState {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return createDefaultState()
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PersistedAppState>
    if (parsed.version !== CURRENT_VERSION) {
      return createDefaultState()
    }

    const baseline = createDefaultState()
    return {
      ...baseline,
      ...parsed,
      weeklyPlan: {
        tasksProgress: baseline.weeklyPlan.tasksProgress.map((task) => {
          const storedTask = parsed.weeklyPlan?.tasksProgress.find((candidate) => candidate.taskId === task.taskId)
          return storedTask ?? task
        }),
      },
      exposure: {
        recentQuestionIds: parsed.exposure?.recentQuestionIds.slice(-MAX_RECENT_EXPOSURE) ?? [],
      },
    }
  } catch {
    return createDefaultState()
  }
}

export function saveState(state: PersistedAppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function resetState(): PersistedAppState {
  const freshState = createDefaultState()
  saveState(freshState)
  return freshState
}

export function markWeeklyTask(
  state: PersistedAppState,
  taskId: string,
  checked: boolean,
): PersistedAppState {
  const tasksProgress = state.weeklyPlan.tasksProgress.map((task) =>
    task.taskId === taskId
      ? {
          ...task,
          checked,
          completedAt: checked ? new Date().toISOString() : undefined,
        }
      : task,
  )

  return {
    ...state,
    weeklyPlan: {
      ...state.weeklyPlan,
      tasksProgress,
    },
  }
}

export function setActiveSession(state: PersistedAppState, session?: SessionState): PersistedAppState {
  return {
    ...state,
    activeSession: session,
  }
}

export function completeSession(
  state: PersistedAppState,
  summary: SessionSummary,
  topicPerformance: Record<string, TopicPerformance>,
  answeredQuestionIds: string[],
): PersistedAppState {
  const history = [summary, ...state.sessionHistory].slice(0, MAX_HISTORY)
  const recentQuestionIds = [...state.exposure.recentQuestionIds, ...answeredQuestionIds].slice(-MAX_RECENT_EXPOSURE)

  return {
    ...state,
    activeSession: undefined,
    sessionHistory: history,
    topicPerformance,
    exposure: { recentQuestionIds },
  }
}
