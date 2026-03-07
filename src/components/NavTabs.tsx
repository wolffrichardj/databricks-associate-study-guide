import type { Dispatch, SetStateAction } from 'react'

export type AppView = 'weekly' | 'quiz' | 'progress'

interface NavTabsProps {
  view: AppView
  onChange: Dispatch<SetStateAction<AppView>>
}

const TABS: Array<{ id: AppView; label: string }> = [
  { id: 'weekly', label: 'Weekly Plan' },
  { id: 'quiz', label: 'Quiz' },
]

export function NavTabs({ view, onChange }: NavTabsProps) {
  return (
    <nav className="tab-nav" aria-label="Primary">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={tab.id === view ? 'tab active' : 'tab'}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
