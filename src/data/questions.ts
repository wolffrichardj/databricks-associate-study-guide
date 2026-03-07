import { TOPICS } from "./exam";
import type { DomainId, QuizQuestion } from "../types";

interface QuestionTemplate {
  topicId: string;
  domainId: DomainId;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  resourceIds: string[];
  difficulty: "easy" | "medium" | "hard";
}

const QUESTION_TEMPLATES: QuestionTemplate[] = [
  {
    topicId: "delta-basics",
    domainId: "platform",
    prompt:
      "Which Delta Lake capability most directly supports ACID reliability over plain Parquet files?",
    choices: [
      "Object tagging",
      "Transaction log",
      "Notebook widgets",
      "Job clusters",
    ],
    correctIndex: 1,
    explanation:
      "Delta tables use a transaction log to coordinate atomic, consistent updates.",
    resourceIds: ["docs-delta", "exam-guide"],
    difficulty: "easy",
  },
  {
    topicId: "delta-basics",
    domainId: "platform",
    prompt:
      "Which Delta Lake feature allows you to query a table at a previous point in time?",
    choices: [
      "Auto Loader",
      "MLflow tracking",
      "Time travel",
      "Cluster policies",
    ],
    correctIndex: 2,
    explanation:
      "Time travel enables point-in-time reads using table version or timestamp.",
    resourceIds: ["docs-delta", "exam-guide"],
    difficulty: "medium",
  },
  {
    topicId: "workspace-basics",
    domainId: "platform",
    prompt:
      "Which statement best describes Databricks Free Edition for exam prep?",
    choices: [
      "It is a no-cost workspace suitable for guided hands-on practice.",
      "It requires a paid enterprise contract to run notebooks.",
      "It only supports SQL and blocks Python notebooks.",
      "It cannot run workflow jobs.",
    ],
    correctIndex: 0,
    explanation:
      "Free Edition is intended as a no-cost learning environment for hands-on reps.",
    resourceIds: ["free-edition", "exam-guide"],
    difficulty: "easy",
  },
  {
    topicId: "workspace-basics",
    domainId: "platform",
    prompt:
      "Which workspace object is best for sharing reusable code across notebooks?",
    choices: [
      "Dashboard",
      "Notebook widget",
      "Notebook in Repos folder",
      "SQL alert",
    ],
    correctIndex: 2,
    explanation:
      "Storing notebooks in Repos supports versioned collaboration and code reuse workflows.",
    resourceIds: ["free-edition", "exam-guide"],
    difficulty: "medium",
  },
  {
    topicId: "auto-loader",
    domainId: "ingestion",
    prompt:
      "In Databricks, Auto Loader is typically configured using which source format key?",
    choices: ["deltaFiles", "lakeflowFiles", "cloudFiles", "streamFiles"],
    correctIndex: 2,
    explanation:
      "Auto Loader uses the cloudFiles source for incremental file ingestion.",
    resourceIds: ["docs-autoloader", "academy-ingestion"],
    difficulty: "easy",
  },
  {
    topicId: "auto-loader",
    domainId: "ingestion",
    prompt:
      "When using Auto Loader for evolving JSON input, which option helps infer new columns over time?",
    choices: [
      "inferColumns",
      "cloudFiles.schemaEvolutionMode",
      "autoOptimize",
      "delta.minReaderVersion",
    ],
    correctIndex: 1,
    explanation:
      "The schema evolution mode option controls how newly detected fields are handled.",
    resourceIds: ["docs-autoloader", "academy-ingestion"],
    difficulty: "medium",
  },
  {
    topicId: "ingestion-patterns",
    domainId: "ingestion",
    prompt:
      "What is the main advantage of incremental ingestion over repeated full reloads?",
    choices: [
      "It always eliminates schema changes.",
      "It reduces compute by processing only new or changed data.",
      "It guarantees no data quality issues.",
      "It prevents all duplicates automatically.",
    ],
    correctIndex: 1,
    explanation:
      "Incremental ingestion limits processing to newly arrived or updated records.",
    resourceIds: ["docs-autoloader", "academy-ingestion"],
    difficulty: "medium",
  },
  {
    topicId: "ingestion-patterns",
    domainId: "ingestion",
    prompt:
      "Which bronze-table design is most resilient when source quality is inconsistent?",
    choices: [
      "Drop malformed rows before landing",
      "Store raw ingested data with metadata for later refinement",
      "Transform directly into gold tables only",
      "Keep only the latest file from each source system",
    ],
    correctIndex: 1,
    explanation:
      "Bronze tables should preserve raw history to support replay, debugging, and reprocessing.",
    resourceIds: ["docs-autoloader", "academy-ingestion"],
    difficulty: "medium",
  },
  {
    topicId: "spark-sql",
    domainId: "processing",
    prompt:
      "For Associate exam questions, which language does Databricks state is used where possible?",
    choices: ["Scala", "R", "SQL", "Java"],
    correctIndex: 2,
    explanation:
      "Databricks notes SQL is used where possible, with Python used otherwise.",
    resourceIds: ["exam-guide", "academy-pipelines"],
    difficulty: "easy",
  },
  {
    topicId: "spark-sql",
    domainId: "processing",
    prompt: "What does a LEFT JOIN return in Spark SQL?",
    choices: [
      "Only rows with matches in both tables",
      "All rows from left table plus matching rows from right table",
      "All rows from both tables regardless of key matches",
      "Only unmatched rows from the right table",
    ],
    correctIndex: 1,
    explanation:
      "A LEFT JOIN preserves all rows from the left side and fills unmatched right columns with nulls.",
    resourceIds: ["exam-guide", "academy-pipelines"],
    difficulty: "easy",
  },
  {
    topicId: "streaming",
    domainId: "processing",
    prompt:
      "Structured Streaming checkpoints are primarily used to persist what information?",
    choices: [
      "Cluster size history",
      "Notebook revision history",
      "Query progress and state for fault tolerance",
      "Unity Catalog grants",
    ],
    correctIndex: 2,
    explanation:
      "Checkpointing allows streaming queries to recover state and progress after failures.",
    resourceIds: ["docs-streaming", "academy-pipelines"],
    difficulty: "medium",
  },
  {
    topicId: "streaming",
    domainId: "processing",
    prompt:
      "Which output mode is used when your stream emits updated aggregate counts over time?",
    choices: ["Append", "Complete", "Ignore", "Static"],
    correctIndex: 1,
    explanation:
      "Complete mode rewrites the full aggregate result table each micro-batch.",
    resourceIds: ["docs-streaming", "academy-pipelines"],
    difficulty: "medium",
  },
  {
    topicId: "jobs",
    domainId: "production",
    prompt: "What is the purpose of task dependencies in Lakeflow Jobs?",
    choices: [
      "To set SQL warehouse size only",
      "To enforce execution order between tasks",
      "To assign Unity Catalog grants",
      "To disable retries globally",
    ],
    correctIndex: 1,
    explanation:
      "Dependencies define execution order and allow DAG-based orchestration.",
    resourceIds: ["docs-jobs", "academy-jobs"],
    difficulty: "easy",
  },
  {
    topicId: "jobs",
    domainId: "production",
    prompt:
      "Which job setting best helps alert a team when production pipelines fail?",
    choices: [
      "Notebook widgets",
      "Run as owner",
      "Task notifications",
      "Photon acceleration",
    ],
    correctIndex: 2,
    explanation:
      "Task/job notifications provide immediate visibility to run failures.",
    resourceIds: ["docs-jobs", "academy-jobs"],
    difficulty: "easy",
  },
  {
    topicId: "pipeline-ops",
    domainId: "production",
    prompt:
      "Which action is most aligned with production pipeline reliability?",
    choices: [
      "Rely on manual notebook reruns only",
      "Skip alerting for failed jobs",
      "Use retry policies and monitor run status",
      "Run all tasks with no dependencies",
    ],
    correctIndex: 2,
    explanation:
      "Retry policies and monitoring are core for resilient production operations.",
    resourceIds: ["docs-jobs", "academy-jobs"],
    difficulty: "medium",
  },
  {
    topicId: "pipeline-ops",
    domainId: "production",
    prompt:
      "What is a practical reason to separate dev and prod job configurations?",
    choices: [
      "To avoid using clusters in development",
      "To isolate testing changes and reduce production risk",
      "To prevent all schema evolution",
      "To disable scheduling in production",
    ],
    correctIndex: 1,
    explanation:
      "Environment separation supports safe testing and controlled promotion into production.",
    resourceIds: ["docs-jobs", "academy-jobs"],
    difficulty: "medium",
  },
  {
    topicId: "unity-catalog",
    domainId: "governance",
    prompt: "Which namespace structure is used by Unity Catalog?",
    choices: [
      "workspace.schema.table",
      "catalog.database.volume",
      "catalog.schema.table",
      "tenant.project.dataset",
    ],
    correctIndex: 2,
    explanation:
      "Unity Catalog uses a three-level namespace: catalog.schema.table.",
    resourceIds: ["docs-unity", "academy-governance"],
    difficulty: "easy",
  },
  {
    topicId: "unity-catalog",
    domainId: "governance",
    prompt:
      "Which object stores files directly in Unity Catalog for managed access to non-tabular data?",
    choices: ["Volume", "View", "Cluster policy", "Secret scope"],
    correctIndex: 0,
    explanation: "Volumes provide governed file storage inside Unity Catalog.",
    resourceIds: ["docs-unity", "academy-governance"],
    difficulty: "medium",
  },
  {
    topicId: "quality",
    domainId: "governance",
    prompt:
      "Which governance practice best supports controlled access to data assets?",
    choices: [
      "Grant broad access to all users by default",
      "Use privilege inheritance and least privilege grants",
      "Disable catalog-level permissions",
      "Store all assets in personal workspaces only",
    ],
    correctIndex: 1,
    explanation:
      "Least privilege and hierarchical grants are core governance principles in Unity Catalog.",
    resourceIds: ["docs-unity", "academy-governance"],
    difficulty: "medium",
  },
  {
    topicId: "quality",
    domainId: "governance",
    prompt:
      "What is the key purpose of data quality expectations in managed pipelines?",
    choices: [
      "To encrypt all source data automatically",
      "To enforce and monitor rule-based data validity",
      "To reduce all data latency to zero",
      "To replace lineage documentation",
    ],
    correctIndex: 1,
    explanation:
      "Expectations codify quality rules and enable monitoring or handling of invalid records.",
    resourceIds: ["docs-unity", "academy-governance"],
    difficulty: "medium",
  },
];

const VARIANT_SUFFIXES = [
  "You are preparing for a production team handoff.",
  "A teammate asks you to choose the most exam-accurate statement.",
  "Select the best option for an Associate-level implementation question.",
  "You are reviewing a failed pipeline and need the most accurate fix.",
  "Choose the option that best matches Databricks best practices.",
];

function buildVariant(
  template: QuestionTemplate,
  variantIndex: number,
): QuizQuestion {
  const variantLabel = String.fromCharCode(65 + variantIndex);
  const topicName =
    TOPICS.find((topic) => topic.id === template.topicId)?.name ??
    template.topicId;
  const prompt = `${template.prompt} (${topicName} scenario ${variantLabel}) ${VARIANT_SUFFIXES[variantIndex]}`;

  return {
    id: `${template.topicId}-${template.prompt
      .slice(0, 18)
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase()}-${variantLabel.toLowerCase()}`,
    domainId: template.domainId,
    topicId: template.topicId,
    prompt,
    choices: template.choices.map((choice, index) => ({
      id: `c${index + 1}`,
      text: choice,
    })),
    correctChoiceId: `c${template.correctIndex + 1}`,
    explanation: template.explanation,
    resourceIds: template.resourceIds,
    difficulty: template.difficulty,
    scenarioVariant: variantLabel,
  };
}

export const QUIZ_QUESTIONS: QuizQuestion[] = QUESTION_TEMPLATES.flatMap(
  (template) =>
    [0, 1, 2, 3, 4].map((variantIndex) => buildVariant(template, variantIndex)),
);
