import { describe, expect, it } from 'vitest'
import { QUIZ_QUESTIONS } from '../data/questions'
import { createSession } from '../lib/quiz'

describe('createSession', () => {
  it('creates focused topic sessions with only matching questions', () => {
    const session = createSession(
      {
        mode: 'focused_topic',
        topicId: 'auto-loader',
        questionCount: 6,
      },
      QUIZ_QUESTIONS,
      { recentQuestionIds: [] },
      15,
    )

    expect(session.questionIds).toHaveLength(3)
    const pickedTopics = session.questionIds.map(
      (id) => QUIZ_QUESTIONS.find((question) => question.id === id)?.topicId,
    )
    expect(new Set(pickedTopics)).toEqual(new Set(['auto-loader']))
  })

  it('avoids immediately repeating recent questions when possible', () => {
    const recent = QUIZ_QUESTIONS.slice(0, 10).map((question) => question.id)
    const session = createSession(
      {
        mode: 'overall_skills',
        questionCount: 12,
      },
      QUIZ_QUESTIONS,
      { recentQuestionIds: recent },
      42,
    )

    const repeated = session.questionIds.filter((id) => recent.includes(id))
    expect(repeated.length).toBeLessThan(session.questionIds.length)
  })
})
