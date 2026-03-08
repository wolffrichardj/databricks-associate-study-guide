import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { ProgressView } from '../components/ProgressView'
import { QuizSetup } from '../components/QuizSetup'
import type { QuizSessionConfig, SessionSummary, WeeklyPlanState } from '../types'

describe('QuizSetup', () => {
  it('switches modes and applies default question counts', async () => {
    const user = userEvent.setup()
    const onConfigChange = vi.fn()

    const focusedConfig: QuizSessionConfig = {
      mode: 'focused_topic',
      questionCount: 10,
      topicId: 'auto-loader',
    }

    render(
      <QuizSetup
        config={focusedConfig}
        onConfigChange={onConfigChange}
        onStart={() => undefined}
        fullExamDefaultCount={45}
        focusedDefaultCount={10}
        fullExamMaxCount={44}
        focusedMaxCount={20}
      />, 
    )

    await user.click(screen.getByTestId('mode-overall'))

    expect(onConfigChange).toHaveBeenCalledWith({
      mode: 'overall_skills',
      questionCount: 45,
      topicId: undefined,
      domainId: undefined,
    })
  })

  it('allows typing multi-digit counts below min prefix and clamps on blur', async () => {
    const user = userEvent.setup()

    function StatefulQuizSetup() {
      const [config, setConfig] = useState<QuizSessionConfig>({
        mode: 'focused_topic',
        questionCount: 10,
        topicId: 'auto-loader',
      })

      return (
        <QuizSetup
          config={config}
          onConfigChange={setConfig}
          onStart={() => undefined}
          fullExamDefaultCount={45}
          focusedDefaultCount={10}
          fullExamMaxCount={44}
          focusedMaxCount={20}
        />
      )
    }

    render(<StatefulQuizSetup />)

    const input = screen.getByTestId('question-count') as HTMLInputElement
    await user.clear(input)
    await user.type(input, '10')

    expect(input).toHaveValue(10)

    await user.clear(input)
    await user.type(input, '1')
    expect(input).toHaveValue(1)

    await user.tab()
    expect(input).toHaveValue(5)
  })
})

describe('ProgressView', () => {
  it('shows next action and allows navigation to weekly plan and topic practice', async () => {
    const user = userEvent.setup()
    const onOpenWeeklyPlan = vi.fn()
    const onPracticeTopic = vi.fn()

    const weeklyPlan: WeeklyPlanState = {
      tasksProgress: [
        { taskId: 'day0-academy', checked: true },
        { taskId: 'day1-platform', checked: false },
        { taskId: 'day2-ingestion', checked: false },
        { taskId: 'day3-transformations', checked: false },
        { taskId: 'day4-production', checked: false },
        { taskId: 'day5-governance', checked: false },
        { taskId: 'day6-hands-on', checked: false },
        { taskId: 'day7-readiness', checked: false },
      ],
    }

    const sessionHistory: SessionSummary[] = []

    render(
      <ProgressView
        sessionHistory={sessionHistory}
        topicPerformance={{
          'auto-loader': {
            topicId: 'auto-loader',
            attempts: 3,
            correct: 1,
            accuracy: 1 / 3,
            weak: true,
          },
        }}
        weeklyPlan={weeklyPlan}
        onOpenWeeklyPlan={onOpenWeeklyPlan}
        onPracticeTopic={onPracticeTopic}
      />,
    )

    await user.click(screen.getByRole('button', { name: /open weekly plan/i }))
    expect(onOpenWeeklyPlan).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: /practice this topic/i }))
    expect(onPracticeTopic).toHaveBeenCalledWith('auto-loader')
  })
})
