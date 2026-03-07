import { EXAM_DOMAINS, TOPICS } from '../data/exam'
import type { DomainId, QuizSessionConfig } from '../types'

interface QuizSetupProps {
  config: QuizSessionConfig
  onConfigChange: (config: QuizSessionConfig) => void
  onStart: () => void
}

export function QuizSetup({ config, onConfigChange, onStart }: QuizSetupProps) {
  return (
    <section className="panel">
      <h2>Quiz Setup</h2>
      <p>Choose focused practice by topic or run an exam-style mixed session.</p>

      <div className="mode-row">
        <label>
          <input
            type="radio"
            data-testid="mode-focused"
            checked={config.mode === 'focused_topic'}
            onChange={() =>
              onConfigChange({
                ...config,
                mode: 'focused_topic',
              })
            }
          />
          Focused Topic Mode
        </label>
        <label>
          <input
            type="radio"
            data-testid="mode-overall"
            checked={config.mode === 'overall_skills'}
            onChange={() =>
              onConfigChange({
                ...config,
                mode: 'overall_skills',
                topicId: undefined,
                domainId: undefined,
              })
            }
          />
          Dive Into the Test (Overall Skills)
        </label>
      </div>

      {config.mode === 'focused_topic' ? (
        <div className="grid-2">
          <label>
            Topic
            <select
              data-testid="topic-select"
              aria-label="Topic Filter"
              value={config.topicId ?? ''}
              onChange={(event) => {
                onConfigChange({
                  ...config,
                  topicId: event.target.value || undefined,
                  domainId: undefined,
                })
              }}
            >
              <option value="">Choose a topic</option>
              {TOPICS.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Or choose a domain
            <select
              data-testid="domain-select"
              aria-label="Domain Filter"
              value={config.domainId ?? ''}
              onChange={(event) => {
                onConfigChange({
                  ...config,
                  domainId: (event.target.value as DomainId) || undefined,
                  topicId: undefined,
                })
              }}
            >
              <option value="">All topics in a domain</option>
              {EXAM_DOMAINS.map((domain) => (
                <option key={domain.id} value={domain.id}>
                  {domain.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}

      <label>
        Number of questions
        <input
          data-testid="question-count"
          type="number"
          min={5}
          max={30}
          value={config.questionCount}
          onChange={(event) =>
            onConfigChange({
              ...config,
              questionCount: Number(event.target.value),
            })
          }
        />
      </label>

      <button type="button" onClick={onStart} data-testid="start-quiz">
        Start Quiz
      </button>
    </section>
  )
}
