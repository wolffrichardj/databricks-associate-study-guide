import { TOPICS } from './exam'
import type { DomainId, QuizQuestion } from '../types'

interface QuestionTemplate {
  topicId: string
  domainId: DomainId
  prompt: string
  choices: string[]
  correctIndex: number
  explanation: string
  resourceIds: string[]
  difficulty: 'easy' | 'medium' | 'hard'
}

const QUESTION_TEMPLATES: QuestionTemplate[] = [
  {
    topicId: 'delta-basics',
    domainId: 'platform',
    prompt: 'Which Delta Lake capability most directly supports ACID reliability over plain Parquet files?',
    choices: ['Object tagging', 'Transaction log', 'Notebook widgets', 'Job clusters'],
    correctIndex: 1,
    explanation: 'Delta tables use a transaction log to coordinate atomic, consistent updates.',
    resourceIds: ['docs-delta', 'exam-guide'],
    difficulty: 'easy',
  },
  {
    topicId: 'workspace-basics',
    domainId: 'platform',
    prompt: 'Which statement best describes Databricks Free Edition for exam prep?',
    choices: [
      'It is a no-cost workspace suitable for guided hands-on practice.',
      'It requires a paid enterprise contract to run notebooks.',
      'It only supports SQL and blocks Python notebooks.',
      'It cannot run workflow jobs.',
    ],
    correctIndex: 0,
    explanation: 'Free Edition is intended as a no-cost learning environment for hands-on reps.',
    resourceIds: ['free-edition', 'exam-guide'],
    difficulty: 'easy',
  },
  {
    topicId: 'auto-loader',
    domainId: 'ingestion',
    prompt: 'In Databricks, Auto Loader is typically configured using which source format key?',
    choices: ['deltaFiles', 'lakeflowFiles', 'cloudFiles', 'streamFiles'],
    correctIndex: 2,
    explanation: 'Auto Loader uses the cloudFiles source for incremental file ingestion.',
    resourceIds: ['docs-autoloader', 'academy-ingestion'],
    difficulty: 'easy',
  },
  {
    topicId: 'ingestion-patterns',
    domainId: 'ingestion',
    prompt: 'What is the main advantage of incremental ingestion over repeated full reloads?',
    choices: [
      'It always eliminates schema changes.',
      'It reduces compute by processing only new or changed data.',
      'It guarantees no data quality issues.',
      'It prevents all duplicates automatically.',
    ],
    correctIndex: 1,
    explanation: 'Incremental ingestion limits processing to newly arrived or updated records.',
    resourceIds: ['docs-autoloader', 'academy-ingestion'],
    difficulty: 'medium',
  },
  {
    topicId: 'spark-sql',
    domainId: 'processing',
    prompt: 'For Associate exam questions, which language does Databricks state is used where possible?',
    choices: ['Scala', 'R', 'SQL', 'Java'],
    correctIndex: 2,
    explanation: 'Databricks notes SQL is used where possible, with Python used otherwise.',
    resourceIds: ['exam-guide', 'academy-pipelines'],
    difficulty: 'easy',
  },
  {
    topicId: 'streaming',
    domainId: 'processing',
    prompt: 'Structured Streaming checkpoints are primarily used to persist what information?',
    choices: [
      'Cluster size history',
      'Notebook revision history',
      'Query progress and state for fault tolerance',
      'Unity Catalog grants',
    ],
    correctIndex: 2,
    explanation: 'Checkpointing allows streaming queries to recover state and progress after failures.',
    resourceIds: ['docs-streaming', 'academy-pipelines'],
    difficulty: 'medium',
  },
  {
    topicId: 'jobs',
    domainId: 'production',
    prompt: 'What is the purpose of task dependencies in Lakeflow Jobs?',
    choices: [
      'To set SQL warehouse size only',
      'To enforce execution order between tasks',
      'To assign Unity Catalog grants',
      'To disable retries globally',
    ],
    correctIndex: 1,
    explanation: 'Dependencies define execution order and allow DAG-based orchestration.',
    resourceIds: ['docs-jobs', 'academy-jobs'],
    difficulty: 'easy',
  },
  {
    topicId: 'pipeline-ops',
    domainId: 'production',
    prompt: 'Which action is most aligned with production pipeline reliability?',
    choices: [
      'Rely on manual notebook reruns only',
      'Skip alerting for failed jobs',
      'Use retry policies and monitor run status',
      'Run all tasks with no dependencies',
    ],
    correctIndex: 2,
    explanation: 'Retry policies and monitoring are core for resilient production operations.',
    resourceIds: ['docs-jobs', 'academy-jobs'],
    difficulty: 'medium',
  },
  {
    topicId: 'unity-catalog',
    domainId: 'governance',
    prompt: 'Which namespace structure is used by Unity Catalog?',
    choices: ['workspace.schema.table', 'catalog.database.volume', 'catalog.schema.table', 'tenant.project.dataset'],
    correctIndex: 2,
    explanation: 'Unity Catalog uses a three-level namespace: catalog.schema.table.',
    resourceIds: ['docs-unity', 'academy-governance'],
    difficulty: 'easy',
  },
  {
    topicId: 'quality',
    domainId: 'governance',
    prompt: 'Which governance practice best supports controlled access to data assets?',
    choices: [
      'Grant broad access to all users by default',
      'Use privilege inheritance and least privilege grants',
      'Disable catalog-level permissions',
      'Store all assets in personal workspaces only',
    ],
    correctIndex: 1,
    explanation: 'Least privilege and hierarchical grants are core governance principles in Unity Catalog.',
    resourceIds: ['docs-unity', 'academy-governance'],
    difficulty: 'medium',
  },
]

const VARIANT_SUFFIXES = [
  'You are preparing for a production team handoff.',
  'A teammate asks you to choose the most exam-accurate statement.',
  'Select the best option for an Associate-level implementation question.',
]

function buildVariant(template: QuestionTemplate, variantIndex: number): QuizQuestion {
  const variantLabel = String.fromCharCode(65 + variantIndex)
  const topicName = TOPICS.find((topic) => topic.id === template.topicId)?.name ?? template.topicId
  const prompt = `${template.prompt} (${topicName} scenario ${variantLabel}) ${VARIANT_SUFFIXES[variantIndex]}`

  return {
    id: `${template.topicId}-${variantLabel.toLowerCase()}`,
    domainId: template.domainId,
    topicId: template.topicId,
    prompt,
    choices: template.choices.map((choice, index) => ({ id: `c${index + 1}`, text: choice })),
    correctChoiceId: `c${template.correctIndex + 1}`,
    explanation: template.explanation,
    resourceIds: template.resourceIds,
    difficulty: template.difficulty,
    scenarioVariant: variantLabel,
  }
}

export const QUIZ_QUESTIONS: QuizQuestion[] = QUESTION_TEMPLATES.flatMap((template) =>
  [0, 1, 2].map((variantIndex) => buildVariant(template, variantIndex)),
)
