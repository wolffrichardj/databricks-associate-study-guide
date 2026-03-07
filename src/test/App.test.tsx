import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, beforeEach } from 'vitest'
import App from '../App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('persists weekly task selections after remount', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)

    const firstTaskCheckbox = screen.getAllByRole('checkbox')[0]
    await user.click(firstTaskCheckbox)

    expect(screen.getByTestId('weekly-progress')).toHaveTextContent('Completed 1 of 8 tasks')

    unmount()
    render(<App />)

    expect(screen.getByTestId('weekly-progress')).toHaveTextContent('Completed 1 of 8 tasks')
  })

  it('starts and completes a focused topic quiz', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Quiz' }))
    await user.selectOptions(screen.getByTestId('topic-select'), 'auto-loader')
    await user.click(screen.getByTestId('start-quiz'))

    expect(screen.getByTestId('quiz-player')).toBeInTheDocument()

    await user.click(screen.getAllByRole('radio')[0])
    await user.click(screen.getByRole('button', { name: /next question/i }))

    await user.click(screen.getAllByRole('radio')[0])
    await user.click(screen.getByRole('button', { name: /next question/i }))

    await user.click(screen.getAllByRole('radio')[0])
    await user.click(screen.getByRole('button', { name: /finish quiz/i }))

    expect(screen.getByTestId('results-panel')).toBeInTheDocument()
  })

  it('resets all progress', async () => {
    const user = userEvent.setup()
    render(<App />)

    const firstTaskCheckbox = screen.getAllByRole('checkbox')[0]
    await user.click(firstTaskCheckbox)
    await user.click(screen.getByTestId('reset-program'))

    expect(screen.getByTestId('weekly-progress')).toHaveTextContent('Completed 0 of 8 tasks')
  })
})
