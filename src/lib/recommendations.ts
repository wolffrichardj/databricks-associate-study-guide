import { EXAM_DOMAINS, TOPICS } from '../data/exam'
import { RESOURCES } from '../data/resources'
import type { Recommendation, TopicPerformance } from '../types'

export function buildRecommendations(topicPerformance: Record<string, TopicPerformance>): Recommendation[] {
  return Object.values(topicPerformance)
    .filter((topic) => topic.weak)
    .map((topic) => {
      const topicMeta = TOPICS.find((candidate) => candidate.id === topic.topicId)
      const domainWeight = EXAM_DOMAINS.find((domain) => domain.id === topicMeta?.domainId)?.weight ?? 0
      const resources = RESOURCES.filter((resource) => resource.topicIds.includes(topic.topicId)).slice(0, 3)

      return {
        topicId: topic.topicId,
        topicName: topicMeta?.name ?? topic.topicId,
        domainId: topicMeta?.domainId ?? 'platform',
        priority: Number(((1 - topic.accuracy) * domainWeight).toFixed(4)),
        reason: `${Math.round(topic.accuracy * 100)}% accuracy across ${topic.attempts} attempts`,
        resources,
      }
    })
    .sort((a, b) => b.priority - a.priority)
}
