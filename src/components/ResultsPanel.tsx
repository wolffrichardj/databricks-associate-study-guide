import { EXAM_DOMAINS, TOPICS } from "../data/exam";
import { MarkdownText } from "./MarkdownText";
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
  const scorePercent = Math.round(result.score * 100);
  const scoreTone =
    scorePercent >= 80 ? "good" : scorePercent >= 60 ? "amber" : "alert";

  const domainRows = EXAM_DOMAINS.map((domain) => ({
    id: domain.id,
    name: domain.name,
    accuracy: Math.round((result.domainAccuracy[domain.id] ?? 0) * 100),
  }));

  const topicRows = Object.entries(result.topicAccuracy)
    .map(([topicId, value]) => ({
      id: topicId,
      name: TOPICS.find((topic) => topic.id === topicId)?.name ?? topicId,
      accuracy: Math.round(value * 100),
    }))
    .sort((a, b) => a.accuracy - b.accuracy);

  return (
    <section className="panel results-panel" data-testid="results-panel">
      <header className="results-summary-card">
        <h2>Session Results</h2>
        <p className={`stat-text score-chip ${scoreTone}`}>
          Score: {scorePercent}% ({result.correctCount}/{result.total})
        </p>
      </header>

      <div className="results-breakdown-grid">
        <section className="chart-panel">
          <h3>Domain Breakdown</h3>
          <ul className="domain-bars">
            {domainRows.map((domain) => (
              <li key={domain.id}>
                <div className="domain-row">
                  <span>{domain.name}</span>
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

        <section className="chart-panel">
          <h3>Topic Breakdown</h3>
          <ul className="compact-list">
            {topicRows.map((topic) => (
              <li key={topic.id}>
                <strong>{topic.name}:</strong> {topic.accuracy}%
              </li>
            ))}
          </ul>
        </section>
      </div>

      <h3>Incorrect Answers</h3>
      {result.incorrectAnswers.length === 0 ? (
        <p>
          Great work — you answered every question correctly in this session.
        </p>
      ) : (
        <ul className="incorrect-list">
          {result.incorrectAnswers.map((incorrect) => (
            <li key={incorrect.questionId} className="incorrect-item">
              <div>
                <strong>Question:</strong>{" "}
                <MarkdownText text={incorrect.prompt} inline />
              </div>
              <div>
                <strong>You selected:</strong>{" "}
                <MarkdownText text={incorrect.selectedChoice} inline />
              </div>
              <div>
                <strong>Correct answer:</strong>{" "}
                <MarkdownText text={incorrect.correctChoice} inline />
              </div>
              <div className="answer-explanation">
                <MarkdownText text={incorrect.explanation} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <h3 className="study-next-heading">What To Study Next</h3>
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
