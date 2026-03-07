import { RESOURCES } from '../data/resources'
import { WEEKLY_TASKS } from '../data/weeklyPlan'
import type { WeeklyPlanState } from '../types'

interface WeeklyPlanViewProps {
  weeklyPlan: WeeklyPlanState
  onToggleTask: (taskId: string, checked: boolean) => void
  onResetWeekly: () => void
}

export function WeeklyPlanView({ weeklyPlan, onToggleTask, onResetWeekly }: WeeklyPlanViewProps) {
  const progressMap = new Map(weeklyPlan.tasksProgress.map((task) => [task.taskId, task]))
  const checkedCount = weeklyPlan.tasksProgress.filter((task) => task.checked).length

  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <h2>7-Day Accelerated Plan Tracker</h2>
          <p>
            Track your day-by-day execution. Progress is stored on this device so you can resume anytime.
          </p>
        </div>
        <button type="button" onClick={onResetWeekly} className="secondary">
          Reset Weekly Tracker
        </button>
      </header>

      <p className="stat-text" data-testid="weekly-progress">
        Completed {checkedCount} of {WEEKLY_TASKS.length} tasks
      </p>

      <ul className="task-list">
        {WEEKLY_TASKS.map((task) => {
          const progress = progressMap.get(task.id)
          return (
            <li key={task.id} className="task-item">
              <label>
                <input
                  type="checkbox"
                  checked={Boolean(progress?.checked)}
                  onChange={(event) => onToggleTask(task.id, event.target.checked)}
                />
                <span>
                  <strong>Day {task.day}:</strong> {task.title}
                </span>
              </label>
              <p>{task.description}</p>
              {progress?.completedAt ? (
                <p className="timestamp">Completed: {new Date(progress.completedAt).toLocaleString()}</p>
              ) : null}
              <div className="resource-links">
                {task.resourceIds.map((resourceId) => {
                  const resource = RESOURCES.find((candidate) => candidate.id === resourceId)
                  if (!resource) {
                    return null
                  }
                  return (
                    <a key={resource.id} href={resource.url} target="_blank" rel="noreferrer">
                      {resource.title}
                    </a>
                  )
                })}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
