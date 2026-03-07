import { EXAM_DOMAINS, TOPICS } from "../data/exam";
import type { Recommendation, SessionResult } from "../types";

interface ResultsPanelProps {
  result: SessionResult;
  recommendations: Recommendation[];
  onBackToSetup: () => void;
}

export function ResultsPanel({
  result,
  recommendations,
  onBackToSetup,
}: ResultsPanelProps) {
  return (
    <section className="panel results-panel" data-testid="results-panel">
      <h2>Session Results</h2>
      <p className="stat-text">
        Score: {Math.round(result.score * 100)}% ({result.correctCount}/
        {result.total})
      </p>

      <h3>Domain Breakdown</h3>
      <ul className="compact-list">
        {EXAM_DOMAINS.map((domain) => (
          <li key={domain.id}>
            <strong>{domain.name}:</strong>{" "}
            {Math.round((result.domainAccuracy[domain.id] ?? 0) * 100)}%
          </li>
        ))}
      </ul>

      <h3>Topic Breakdown</h3>
      <ul className="compact-list">
        {Object.entries(result.topicAccuracy).map(([topicId, value]) => {
          const topicName =
            TOPICS.find((topic) => topic.id === topicId)?.name ?? topicId;
          return (
            <li key={topicId}>
              <strong>{topicName}:</strong> {Math.round(value * 100)}%
            </li>
          );
        })}
      </ul>

      <h3>Review Incorrect Answers</h3>
      {result.incorrectAnswers.length === 0 ? (
        <p>
          Great work — you answered every question correctly in this session.
        </p>
      ) : (
        <ul className="incorrect-list">
          {result.incorrectAnswers.map((incorrect) => (
            <li key={incorrect.questionId} className="incorrect-item">
              <p>
                <strong>Question:</strong> {incorrect.prompt}
              </p>
              <p>
                <strong>You selected:</strong> {incorrect.selectedChoice}
              </p>
              <p>
                <strong>Correct answer:</strong> {incorrect.correctChoice}
              </p>
              <p className="answer-explanation">{incorrect.explanation}</p>
            </li>
          ))}
        </ul>
      )}

      <h3>What To Study Next</h3>
      {recommendations.length === 0 ? (
        <p>
          No weak topics detected yet. Keep practicing to maintain retention.
        </p>
      ) : (
        <ul className="recommendation-list">
          {recommendations.map((recommendation) => (
            <li key={recommendation.topicId}>
              <p>
                <strong>{recommendation.topicName}</strong> (
                {recommendation.reason})
              </p>
              <div className="resource-links result-resource-links">
                {recommendation.resources.map((resource) => (
                  <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {resource.title}
                  </a>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        className="results-back-button"
        onClick={onBackToSetup}
      >
        Back to Quiz Setup
      </button>
    </section>
  );
}
