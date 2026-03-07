import { EXAM_DOMAINS, TOPICS } from '../data/exam'
import { WEEKLY_TASKS } from '../data/weeklyPlan'
import { buildRecommendations } from '../lib/recommendations'
import type { SessionSummary, TopicPerformance, WeeklyPlanState } from '../types'

interface ProgressViewProps {
  sessionHistory: SessionSummary[]
  topicPerformance: Record<string, TopicPerformance>
  weeklyPlan: WeeklyPlanState
  onOpenWeeklyPlan: () => void
  onPracticeTopic: (topicId: string) => void
}

export function ProgressView({
  sessionHistory,
  topicPerformance,
  weeklyPlan,
  onOpenWeeklyPlan,
  onPracticeTopic,
}: ProgressViewProps) {
  const recommendations = buildRecommendations(topicPerformance)
  const completedWeeklyTasks = weeklyPlan.tasksProgress.filter((task) => task.checked).length
  const weeklyCompletion = Math.round((completedWeeklyTasks / WEEKLY_TASKS.length) * 100)
  const topicEntries = Object.values(topicPerformance).sort((a, b) => a.accuracy - b.accuracy)

  const nextWeekTask = WEEKLY_TASKS.find(
    (task) => !weeklyPlan.tasksProgress.find((progress) => progress.taskId === task.id)?.checked,
  )

  const domainSignals = EXAM_DOMAINS.map((domain) => {
    const topicIds = TOPICS.filter((topic) => topic.domainId === domain.id).map((topic) => topic.id)
    const entries = topicIds
      .map((topicId) => topicPerformance[topicId])
      .filter((entry): entry is TopicPerformance => Boolean(entry))

    if (entries.length === 0) {
      return {
        domainId: domain.id,
        name: domain.name,
        accuracy: 0,
        coverage: 0,
      }
    }

    const avg = entries.reduce((sum, entry) => sum + entry.accuracy, 0) / entries.length
    return {
      domainId: domain.id,
      name: domain.name,
      accuracy: Math.round(avg * 100),
      coverage: entries.length,
    }
  })

  return (
    <section className="panel" data-testid="progress-view">
      <h2>Readiness Dashboard</h2>
      <p>Total completed sessions: {sessionHistory.length}</p>

      <section className="chart-panel">
        <h3>Study Plan Completion</h3>
        <div className="progress-track" role="img" aria-label={`Weekly completion ${weeklyCompletion}%`}>
          <div className="progress-fill" style={{ width: `${weeklyCompletion}%` }} />
        </div>
        <p>
          {completedWeeklyTasks} of {WEEKLY_TASKS.length} checklist items complete ({weeklyCompletion}%).
        </p>
        {nextWeekTask ? (
          <p>
            Next best action: <strong>Day {nextWeekTask.day}</strong> — {nextWeekTask.title}.{' '}
            <button type="button" className="inline-link" onClick={onOpenWeeklyPlan}>
              Open Weekly Plan
            </button>
          </p>
        ) : (
          <p>Weekly plan complete. Keep sharpening with simulation mode and weak-topic practice.</p>
        )}
      </section>

      <h3>Knowledge Area Confidence</h3>
      <ul className="domain-bars">
        {domainSignals.map((domain) => (
          <li key={domain.domainId}>
            <div className="domain-row">
              <span>{domain.name}</span>
              <span>{domain.accuracy}%</span>
            </div>
            <div className="progress-track slim" aria-hidden="true">
              <div className="progress-fill" style={{ width: `${domain.accuracy}%` }} />
            </div>
          </li>
        ))}
      </ul>

      <h3>Topic Accuracy</h3>
      <ul className="compact-list">
        {topicEntries.map((performance) => {
          const topicName = TOPICS.find((topic) => topic.id === performance.topicId)?.name ?? performance.topicId
          return (
            <li key={performance.topicId}>
              <strong>{topicName}:</strong> {Math.round(performance.accuracy * 100)}% ({performance.attempts} attempts)
            </li>
          )
        })}
      </ul>

      <h3>Recommended Next Topics</h3>
      {recommendations.length === 0 ? (
        <p>Take more focused or full-test sessions to unlock recommendations.</p>
      ) : (
        <ul className="recommendation-list">
          {recommendations.map((recommendation) => (
            <li key={recommendation.topicId}>
              <p>
                <strong>{recommendation.topicName}</strong>: {recommendation.reason}
              </p>
              <div className="resource-links">
                {recommendation.resources.map((resource) => (
                  <a key={resource.id} href={resource.url} target="_blank" rel="noreferrer">
                    {resource.title}
                  </a>
                ))}
                <button
                  type="button"
                  className="secondary"
                  onClick={() => onPracticeTopic(recommendation.topicId)}
                >
                  Practice this topic
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
