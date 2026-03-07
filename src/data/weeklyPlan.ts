import type { WeeklyTask } from '../types'

export const WEEKLY_TASKS: WeeklyTask[] = [
  {
    id: 'day0-academy',
    day: 0,
    title: 'Set up Databricks Academy and Free Edition',
    description: 'Confirm account access, create workspace, and open exam guide.',
    resourceIds: ['exam-guide', 'free-edition'],
  },
  {
    id: 'day1-platform',
    day: 1,
    title: 'Platform and Delta fundamentals',
    description: 'Review terminology, domain weights, and Delta Lake basics.',
    resourceIds: ['exam-guide', 'docs-delta'],
  },
  {
    id: 'day2-ingestion',
    day: 2,
    title: 'Ingestion patterns and Auto Loader',
    description: 'Study ingestion patterns, schema evolution, and cloudFiles use.',
    resourceIds: ['academy-ingestion', 'docs-autoloader'],
  },
  {
    id: 'day3-transformations',
    day: 3,
    title: 'Transformations and streaming',
    description: 'Practice SQL/PySpark transformations and streaming concepts.',
    resourceIds: ['academy-pipelines', 'docs-streaming'],
  },
  {
    id: 'day4-production',
    day: 4,
    title: 'Productionizing with Lakeflow Jobs',
    description: 'Focus on orchestration, scheduling, retries, and monitoring.',
    resourceIds: ['academy-jobs', 'docs-jobs'],
  },
  {
    id: 'day5-governance',
    day: 5,
    title: 'Governance and quality with Unity Catalog',
    description: 'Review namespace model, privileges, and governance controls.',
    resourceIds: ['academy-governance', 'docs-unity'],
  },
  {
    id: 'day6-hands-on',
    day: 6,
    title: 'Hands-on compression in Free Edition',
    description: 'Run notebook and jobs reps to convert study to product memory.',
    resourceIds: ['free-edition', 'docs-jobs'],
  },
  {
    id: 'day7-readiness',
    day: 7,
    title: 'Exam readiness pass',
    description: 'Use the exam guide as a final checklist and close weak areas.',
    resourceIds: ['exam-guide'],
  },
]
