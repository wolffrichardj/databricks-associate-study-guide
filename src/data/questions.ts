import { TOPICS } from "../data/exam";
import type { DomainId, QuizQuestion } from "../types";

interface QuestionTemplate {
  key: string;
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
  // Platform — Delta
  {
    key: "acid-log",
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
    key: "time-travel",
    topicId: "delta-basics",
    domainId: "platform",
    prompt:
      "Which Delta Lake feature lets you read historical versions of a table?",
    choices: [
      "Checkpointing",
      "Time travel",
      "Unity Catalog lineage",
      "Job retries",
    ],
    correctIndex: 1,
    explanation: "Delta Lake supports time travel by version or timestamp.",
    resourceIds: ["docs-delta", "exam-guide"],
    difficulty: "medium",
  },
  {
    key: "schema-enforcement",
    topicId: "delta-basics",
    domainId: "platform",
    prompt:
      "What happens by default when incoming data has incompatible schema for a Delta table write?",
    choices: [
      "Write succeeds silently",
      "Write fails due to schema enforcement",
      "Rows are dropped automatically",
      "Table is re-created",
    ],
    correctIndex: 1,
    explanation:
      "Delta enforces schema compatibility and rejects incompatible writes by default.",
    resourceIds: ["docs-delta", "exam-guide"],
    difficulty: "medium",
  },
  {
    key: "optimize-zorder",
    topicId: "delta-basics",
    domainId: "platform",
    prompt:
      "For large Delta tables with selective filters, which maintenance pattern can improve read performance?",
    choices: [
      "Disable checkpointing",
      "OPTIMIZE with ZORDER",
      "Use a larger SQL warehouse only",
      "Convert table to CSV",
    ],
    correctIndex: 1,
    explanation:
      "Compaction with OPTIMIZE and ZORDER can improve data skipping for selective queries.",
    resourceIds: ["docs-delta", "exam-guide"],
    difficulty: "hard",
  },

  // Platform — Workspace
  {
    key: "free-edition-purpose",
    topicId: "workspace-basics",
    domainId: "platform",
    prompt:
      "Which statement best describes Databricks Free Edition for exam prep?",
    choices: [
      "It is a no-cost workspace suitable for guided hands-on practice.",
      "It requires an enterprise contract to run notebooks.",
      "It only supports SQL and blocks Python notebooks.",
      "It cannot run workflows.",
    ],
    correctIndex: 0,
    explanation:
      "Free Edition is designed as a no-cost hands-on learning environment.",
    resourceIds: ["free-edition", "exam-guide"],
    difficulty: "easy",
  },
  {
    key: "repos-collab",
    topicId: "workspace-basics",
    domainId: "platform",
    prompt: "Where should a team keep notebooks for versioned collaboration?",
    choices: [
      "Personal user folder only",
      "Repos backed by Git",
      "Cluster event logs",
      "SQL warehouse history",
    ],
    correctIndex: 1,
    explanation:
      "Databricks Repos integrate notebooks with Git workflows for collaboration.",
    resourceIds: ["free-edition", "exam-guide"],
    difficulty: "medium",
  },
  {
    key: "all-purpose-vs-job",
    topicId: "workspace-basics",
    domainId: "platform",
    prompt:
      "Which compute option is generally preferred for scheduled production workflows?",
    choices: [
      "All-purpose interactive cluster",
      "Job compute configured in workflows",
      "SQL editor local mode",
      "Notebook widgets",
    ],
    correctIndex: 1,
    explanation:
      "Job compute is purpose-built for automated workflow execution.",
    resourceIds: ["free-edition", "exam-guide"],
    difficulty: "medium",
  },
  {
    key: "dbutils-secrets",
    topicId: "workspace-basics",
    domainId: "platform",
    prompt:
      "How should credentials be referenced in notebooks instead of hardcoding plaintext?",
    choices: [
      "Notebook markdown cells",
      "dbutils.secrets access pattern",
      "Cluster names",
      "Delta table comments",
    ],
    correctIndex: 1,
    explanation:
      "Secrets management avoids embedding sensitive values directly in code.",
    resourceIds: ["free-edition", "exam-guide"],
    difficulty: "medium",
  },

  // Ingestion — Auto Loader
  {
    key: "cloudfiles-source",
    topicId: "auto-loader",
    domainId: "ingestion",
    prompt: "In Databricks, Auto Loader is configured using which source key?",
    choices: ["deltaFiles", "lakeflowFiles", "cloudFiles", "streamFiles"],
    correctIndex: 2,
    explanation: "Auto Loader uses the cloudFiles source.",
    resourceIds: ["docs-autoloader", "academy-ingestion"],
    difficulty: "easy",
  },
  {
    key: "schema-evolution-mode",
    topicId: "auto-loader",
    domainId: "ingestion",
    prompt:
      "Which option controls how Auto Loader handles newly detected columns?",
    choices: [
      "autoLoader.mode",
      "cloudFiles.schemaEvolutionMode",
      "delta.autoMerge",
      "spark.sql.adaptive.enabled",
    ],
    correctIndex: 1,
    explanation:
      "schemaEvolutionMode controls behavior for evolving source schemas.",
    resourceIds: ["docs-autoloader", "academy-ingestion"],
    difficulty: "medium",
  },
  {
    key: "checkpointing",
    topicId: "auto-loader",
    domainId: "ingestion",
    prompt:
      "Why is a checkpoint location important for Auto Loader streaming ingestion?",
    choices: [
      "It stores cluster logs",
      "It tracks ingestion progress to avoid reprocessing",
      "It encrypts all files",
      "It replaces schema inference",
    ],
    correctIndex: 1,
    explanation:
      "Checkpoint state helps exactly-once-style incremental processing behavior.",
    resourceIds: ["docs-autoloader", "academy-ingestion"],
    difficulty: "medium",
  },
  {
    key: "rescued-data",
    topicId: "auto-loader",
    domainId: "ingestion",
    prompt: "What is the purpose of the rescued data column in Auto Loader?",
    choices: [
      "Store malformed/unparsed fields for review",
      "Persist SQL warehouse metrics",
      "Track Unity grants",
      "Replace Delta logs",
    ],
    correctIndex: 0,
    explanation:
      "Rescued data captures unexpected fields/records for troubleshooting.",
    resourceIds: ["docs-autoloader", "academy-ingestion"],
    difficulty: "hard",
  },

  // Ingestion — Patterns
  {
    key: "incremental-benefit",
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
    explanation: "Incremental ingestion limits work to newly changed records.",
    resourceIds: ["docs-autoloader", "academy-ingestion"],
    difficulty: "medium",
  },
  {
    key: "bronze-raw",
    topicId: "ingestion-patterns",
    domainId: "ingestion",
    prompt:
      "Which bronze-layer approach is most resilient for uncertain source quality?",
    choices: [
      "Drop malformed records immediately",
      "Store raw records with metadata for replay",
      "Transform directly to gold only",
      "Keep only latest files",
    ],
    correctIndex: 1,
    explanation: "Bronze tables preserve raw history for replay/debugging.",
    resourceIds: ["docs-autoloader", "academy-ingestion"],
    difficulty: "medium",
  },
  {
    key: "cdc-upserts",
    topicId: "ingestion-patterns",
    domainId: "ingestion",
    prompt:
      "For change data capture feeds, which operation pattern is commonly used on Delta targets?",
    choices: [
      "DROP TABLE and recreate",
      "MERGE for matched/unmatched records",
      "VACUUM every batch",
      "TRUNCATE before insert",
    ],
    correctIndex: 1,
    explanation:
      "MERGE handles insert/update/delete-like change application patterns.",
    resourceIds: ["docs-autoloader", "academy-ingestion"],
    difficulty: "hard",
  },
  {
    key: "partition-choice",
    topicId: "ingestion-patterns",
    domainId: "ingestion",
    prompt:
      "When designing ingestion tables, what is a good partitioning guideline?",
    choices: [
      "Partition by high-cardinality unique IDs",
      "Use low-cardinality columns frequently used in filtering",
      "Never partition Delta tables",
      "Partition by every column",
    ],
    correctIndex: 1,
    explanation:
      "Low-cardinality, query-aligned partitions reduce unnecessary scanning.",
    resourceIds: ["docs-autoloader", "academy-ingestion"],
    difficulty: "medium",
  },

  // Processing — Spark SQL
  {
    key: "exam-sql-preference",
    topicId: "spark-sql",
    domainId: "processing",
    prompt:
      "For Associate exam questions, which language does Databricks state is used where possible?",
    choices: ["Scala", "R", "SQL", "Java"],
    correctIndex: 2,
    explanation:
      "Exam guidance indicates SQL when possible, then Python otherwise.",
    resourceIds: ["exam-guide", "academy-pipelines"],
    difficulty: "easy",
  },
  {
    key: "left-join",
    topicId: "spark-sql",
    domainId: "processing",
    prompt: "What does a LEFT JOIN return in Spark SQL?",
    choices: [
      "Only matching rows from both tables",
      "All rows from left table plus matching right rows",
      "All rows from both tables always",
      "Only non-matching right rows",
    ],
    correctIndex: 1,
    explanation: "LEFT JOIN preserves all rows from the left side.",
    resourceIds: ["exam-guide", "academy-pipelines"],
    difficulty: "easy",
  },
  {
    key: "window-ranking",
    topicId: "spark-sql",
    domainId: "processing",
    prompt:
      "Which SQL construct is most appropriate to rank records within each customer group?",
    choices: [
      "CROSS JOIN",
      "Window function with PARTITION BY",
      "UNION ALL",
      "CREATE VIEW",
    ],
    correctIndex: 1,
    explanation:
      "Window functions support per-group ranking and analytic calculations.",
    resourceIds: ["exam-guide", "academy-pipelines"],
    difficulty: "medium",
  },
  {
    key: "group-by",
    topicId: "spark-sql",
    domainId: "processing",
    prompt: "To aggregate revenue by day, which clause is essential?",
    choices: [
      "ORDER BY only",
      "GROUP BY transaction_date",
      "LIMIT 1",
      "WINDOW current_row",
    ],
    correctIndex: 1,
    explanation: "GROUP BY defines the granularity of aggregation output.",
    resourceIds: ["exam-guide", "academy-pipelines"],
    difficulty: "easy",
  },

  // Processing — Streaming
  {
    key: "checkpoint-purpose",
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
      "Checkpointing allows recovery of progress and state after failures.",
    resourceIds: ["docs-streaming", "academy-pipelines"],
    difficulty: "medium",
  },
  {
    key: "output-mode-complete",
    topicId: "streaming",
    domainId: "processing",
    prompt:
      "Which output mode is suitable for continuously updated aggregate results?",
    choices: ["Append", "Complete", "Ignore", "Static"],
    correctIndex: 1,
    explanation: "Complete mode emits the full aggregate result each trigger.",
    resourceIds: ["docs-streaming", "academy-pipelines"],
    difficulty: "medium",
  },
  {
    key: "watermark-late-data",
    topicId: "streaming",
    domainId: "processing",
    prompt:
      "Why do you define a watermark in event-time streaming aggregations?",
    choices: [
      "To speed cluster startup",
      "To manage late-arriving data/state retention",
      "To enforce Unity permissions",
      "To avoid writing checkpoints",
    ],
    correctIndex: 1,
    explanation:
      "Watermarks bound how long late data is considered and help control state size.",
    resourceIds: ["docs-streaming", "academy-pipelines"],
    difficulty: "hard",
  },
  {
    key: "trigger-available-now",
    topicId: "streaming",
    domainId: "processing",
    prompt:
      "Which trigger style is used to process currently available data and then stop?",
    choices: [
      "Continuous forever",
      "availableNow / once-style trigger",
      "No trigger option needed",
      "Only manual reruns",
    ],
    correctIndex: 1,
    explanation: "Available-now/once triggers process backlog and terminate.",
    resourceIds: ["docs-streaming", "academy-pipelines"],
    difficulty: "medium",
  },

  // Production — Jobs
  {
    key: "task-dependencies",
    topicId: "jobs",
    domainId: "production",
    prompt: "What is the purpose of task dependencies in Lakeflow Jobs?",
    choices: [
      "Set SQL warehouse size only",
      "Enforce execution order between tasks",
      "Assign Unity grants",
      "Disable retries globally",
    ],
    correctIndex: 1,
    explanation: "Dependencies express DAG order and orchestration flow.",
    resourceIds: ["docs-jobs", "academy-jobs"],
    difficulty: "easy",
  },
  {
    key: "failure-notification",
    topicId: "jobs",
    domainId: "production",
    prompt:
      "Which setting helps teams react quickly when a production job fails?",
    choices: [
      "Notebook widgets",
      "Task/job notifications",
      "Cluster tags only",
      "Delta vacuum",
    ],
    correctIndex: 1,
    explanation: "Notifications surface failures to operators promptly.",
    resourceIds: ["docs-jobs", "academy-jobs"],
    difficulty: "easy",
  },
  {
    key: "retry-policy",
    topicId: "jobs",
    domainId: "production",
    prompt: "What is the main reason to configure retries on workflow tasks?",
    choices: [
      "Increase notebook formatting quality",
      "Handle transient failures automatically",
      "Replace all monitoring needs",
      "Avoid checkpoints",
    ],
    correctIndex: 1,
    explanation:
      "Retries improve resilience to intermittent infrastructure/runtime issues.",
    resourceIds: ["docs-jobs", "academy-jobs"],
    difficulty: "medium",
  },
  {
    key: "job-cluster-benefit",
    topicId: "jobs",
    domainId: "production",
    prompt:
      "Why might a team prefer ephemeral job compute for scheduled pipelines?",
    choices: [
      "No cost controls needed",
      "Clean environment per run and reduced idle costs",
      "Required for notebooks only",
      "Disables dependency graphs",
    ],
    correctIndex: 1,
    explanation:
      "Ephemeral job compute can reduce idle spend and run-to-run drift.",
    resourceIds: ["docs-jobs", "academy-jobs"],
    difficulty: "medium",
  },

  // Production — Ops
  {
    key: "monitor-retries",
    topicId: "pipeline-ops",
    domainId: "production",
    prompt:
      "Which action is most aligned with production pipeline reliability?",
    choices: [
      "Manual reruns only",
      "Skip alerting for failed jobs",
      "Use retries and monitor run status",
      "Run all tasks with no dependencies",
    ],
    correctIndex: 2,
    explanation:
      "Monitoring plus retry policies is foundational reliability practice.",
    resourceIds: ["docs-jobs", "academy-jobs"],
    difficulty: "medium",
  },
  {
    key: "env-separation",
    topicId: "pipeline-ops",
    domainId: "production",
    prompt: "Why separate development and production workflow configurations?",
    choices: [
      "To disable schedules in prod",
      "To reduce risk while validating changes",
      "To avoid all schema evolution",
      "To prevent SQL usage",
    ],
    correctIndex: 1,
    explanation:
      "Environment separation enables controlled promotion of tested changes.",
    resourceIds: ["docs-jobs", "academy-jobs"],
    difficulty: "medium",
  },
  {
    key: "idempotent-design",
    topicId: "pipeline-ops",
    domainId: "production",
    prompt: "What does idempotent pipeline design help prevent?",
    choices: [
      "Duplicate side effects on retries/reruns",
      "Any data skew",
      "All schema changes",
      "Job scheduling",
    ],
    correctIndex: 0,
    explanation:
      "Idempotent logic makes reruns safe by avoiding duplicate outcomes.",
    resourceIds: ["docs-jobs", "academy-jobs"],
    difficulty: "hard",
  },
  {
    key: "sla-tracking",
    topicId: "pipeline-ops",
    domainId: "production",
    prompt:
      "Which metric is most important for validating whether a daily pipeline meets expectations?",
    choices: [
      "Notebook font size",
      "Runtime/SLA adherence and failure rate",
      "Count of cluster labels",
      "Number of markdown cells",
    ],
    correctIndex: 1,
    explanation:
      "Operational SLAs rely on completion timeliness and reliability metrics.",
    resourceIds: ["docs-jobs", "academy-jobs"],
    difficulty: "easy",
  },

  // Governance — Unity Catalog
  {
    key: "namespace",
    topicId: "unity-catalog",
    domainId: "governance",
    prompt: "Which namespace format is used by Unity Catalog for tables?",
    choices: [
      "workspace.schema.table",
      "catalog.database.volume",
      "catalog.schema.table",
      "tenant.project.dataset",
    ],
    correctIndex: 2,
    explanation: "Unity Catalog uses catalog.schema.table.",
    resourceIds: ["docs-unity", "academy-governance"],
    difficulty: "easy",
  },
  {
    key: "volumes",
    topicId: "unity-catalog",
    domainId: "governance",
    prompt: "Which Unity Catalog object is used for governed file storage?",
    choices: ["Volume", "View", "Secret scope", "Cluster policy"],
    correctIndex: 0,
    explanation: "Volumes provide governed access to non-tabular files.",
    resourceIds: ["docs-unity", "academy-governance"],
    difficulty: "medium",
  },
  {
    key: "least-privilege",
    topicId: "unity-catalog",
    domainId: "governance",
    prompt:
      "What access model is recommended when granting Unity Catalog permissions?",
    choices: [
      "Grant ALL PRIVILEGES to everyone",
      "Apply least privilege and role-based grants",
      "Use workspace-local ACLs only",
      "Disable inheritance",
    ],
    correctIndex: 1,
    explanation: "Least privilege is a core governance best practice.",
    resourceIds: ["docs-unity", "academy-governance"],
    difficulty: "easy",
  },
  {
    key: "storage-credentials",
    topicId: "unity-catalog",
    domainId: "governance",
    prompt:
      "Which Unity Catalog construct is used with external locations to access cloud object storage?",
    choices: [
      "SQL warehouse",
      "Storage credential",
      "Notebook widget",
      "Job repair run",
    ],
    correctIndex: 1,
    explanation:
      "Storage credentials and external locations govern cloud storage access.",
    resourceIds: ["docs-unity", "academy-governance"],
    difficulty: "hard",
  },

  // Governance — Quality
  {
    key: "least-priv-governance",
    topicId: "quality",
    domainId: "governance",
    prompt:
      "Which governance practice best supports controlled access to data assets?",
    choices: [
      "Grant broad access to all users",
      "Use least privilege grants with inheritance",
      "Disable catalog permissions",
      "Store all data in personal folders",
    ],
    correctIndex: 1,
    explanation:
      "Least privilege and inheritance help enforce controlled access.",
    resourceIds: ["docs-unity", "academy-governance"],
    difficulty: "medium",
  },
  {
    key: "expectations-purpose",
    topicId: "quality",
    domainId: "governance",
    prompt:
      "What is the purpose of data quality expectations in managed pipelines?",
    choices: [
      "Encrypt all incoming data",
      "Enforce and monitor rule-based validity checks",
      "Replace lineage tracking",
      "Eliminate schema changes",
    ],
    correctIndex: 1,
    explanation: "Expectations codify quality rules and handling behavior.",
    resourceIds: ["docs-unity", "academy-governance"],
    difficulty: "medium",
  },
  {
    key: "lineage-value",
    topicId: "quality",
    domainId: "governance",
    prompt: "Why is data lineage useful in governance workflows?",
    choices: [
      "It replaces all permissions models",
      "It helps trace upstream/downstream impact of changes",
      "It speeds cluster startup",
      "It removes need for testing",
    ],
    correctIndex: 1,
    explanation:
      "Lineage helps impact analysis and troubleshooting across data assets.",
    resourceIds: ["docs-unity", "academy-governance"],
    difficulty: "easy",
  },
  {
    key: "quality-quarantine",
    topicId: "quality",
    domainId: "governance",
    prompt:
      "If records fail validation rules, what is a common robust pattern?",
    choices: [
      "Delete them permanently with no trace",
      "Route to quarantine/reject table for review",
      "Grant broader table access",
      "Disable all quality checks",
    ],
    correctIndex: 1,
    explanation:
      "Quarantine patterns preserve bad records for diagnosis and remediation.",
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
    id: `${template.topicId}-${template.key}-${variantLabel.toLowerCase()}`,
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
