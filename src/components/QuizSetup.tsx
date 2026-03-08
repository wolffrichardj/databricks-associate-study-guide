import { EXAM_DOMAINS, TOPICS } from '../data/exam'
import type { DomainId, QuizSessionConfig } from '../types'

interface QuizSetupProps {
  config: QuizSessionConfig
  onConfigChange: (config: QuizSessionConfig) => void
  onStart: () => void
  fullExamDefaultCount: number
  focusedDefaultCount: number
  fullExamMaxCount: number
  focusedMaxCount: number
}

export function QuizSetup({
  config,
  onConfigChange,
  onStart,
  fullExamDefaultCount,
  focusedDefaultCount,
  fullExamMaxCount,
  focusedMaxCount,
}: QuizSetupProps) {
  const maxQuestionCount = config.mode === 'overall_skills' ? fullExamMaxCount : focusedMaxCount
  const minQuestionCount = Math.min(5, maxQuestionCount)
  const questionCountHint =
    config.mode === 'overall_skills'
      ? `Number of questions for this session. Default: ${fullExamDefaultCount}, max available: ${fullExamMaxCount}.`
      : `Number of questions for this session. Default: ${focusedDefaultCount}, max available for your current focus: ${focusedMaxCount}.`

  return (
    <section className="panel" data-testid="quiz-setup">
      <h2>Practice Wizard</h2>
      <p>Choose targeted review by topic/domain or run a full-length exam simulation.</p>

      <div className="mode-row" role="radiogroup" aria-label="Session mode">
        <label className="toggle-chip">
          <input
            type="radio"
            data-testid="mode-focused"
            checked={config.mode === 'focused_topic'}
            onChange={() =>
              onConfigChange({
                ...config,
                mode: 'focused_topic',
                questionCount: focusedDefaultCount,
              })
            }
          />
          Focused Topic
        </label>
        <label className="toggle-chip">
          <input
            type="radio"
            data-testid="mode-overall"
            checked={config.mode === 'overall_skills'}
            onChange={() =>
              onConfigChange({
                ...config,
                mode: 'overall_skills',
                questionCount: fullExamDefaultCount,
                topicId: undefined,
                domainId: undefined,
              })
            }
          />
          Full Test
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

      <label className="question-count-field">
        <span className="field-title-row">
          <span>Questions</span>
          <span
            className="hint-icon"
            role="img"
            aria-label="Number of questions guidance"
            title={questionCountHint}
          >
            ⓘ
          </span>
        </span>
        <input
          data-testid="question-count"
          className="question-count-input"
          type="number"
          min={minQuestionCount}
          max={maxQuestionCount}
          value={config.questionCount}
          onChange={(event) => {
            const requestedCount = Number(event.target.value)
            if (!Number.isFinite(requestedCount)) {
              return
            }

            onConfigChange({
              ...config,
              questionCount: Math.min(maxQuestionCount, requestedCount),
            })
          }}
          onBlur={() =>
            onConfigChange({
              ...config,
              questionCount: Math.max(minQuestionCount, Math.min(maxQuestionCount, config.questionCount)),
            })
          }
        />
      </label>

      <button type="button" className="quiz-start-button" onClick={onStart} data-testid="start-quiz">
        Start Session
      </button>
    </section>
  )
}
