import { TOPICS } from '../data/exam'
import { buildRecommendations } from '../lib/recommendations'
import type { SessionSummary, TopicPerformance } from '../types'

interface ProgressViewProps {
  sessionHistory: SessionSummary[]
  topicPerformance: Record<string, TopicPerformance>
}

export function ProgressView({ sessionHistory, topicPerformance }: ProgressViewProps) {
  const recommendations = buildRecommendations(topicPerformance)

  return (
    <section className="panel" data-testid="progress-view">
      <h2>Progress Dashboard</h2>
      <p>Total completed sessions: {sessionHistory.length}</p>

      <h3>Topic Accuracy</h3>
      <ul className="compact-list">
        {Object.values(topicPerformance)
          .sort((a, b) => a.accuracy - b.accuracy)
          .map((performance) => {
            const topicName = TOPICS.find((topic) => topic.id === performance.topicId)?.name ?? performance.topicId
            return (
              <li key={performance.topicId}>
                <strong>{topicName}:</strong> {Math.round(performance.accuracy * 100)}% ({performance.attempts}{' '}
                attempts)
              </li>
            )
          })}
      </ul>

      <h3>Prioritized Remediation</h3>
      {recommendations.length === 0 ? (
        <p>Keep running focused or overall sessions to build recommendation signal.</p>
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
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
