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
      "The `_delta_log` transaction log",
      "Notebook widgets",
      "Job clusters",
    ],
    correctIndex: 1,
    explanation:
      "Delta tables use a transaction log (the `_delta_log` directory) to coordinate atomic, consistent updates and guarantee ACID compliance.",
    resourceIds: ["docs-delta", "exam-guide"],
    difficulty: "easy",
  },
  {
    key: "time-travel",
    topicId: "delta-basics",
    domainId: "platform",
    prompt:
      "A data engineer wants to read an older version of a Delta table to recover accidentally deleted data. Which feature should they use?",
    choices: [
      "Spark Structured Streaming checkpointing",
      "Delta Lake time travel (`VERSION AS OF` or `TIMESTAMP AS OF`)",
      "Unity Catalog data lineage",
      "Delta Live Tables expectations",
    ],
    correctIndex: 1,
    explanation: "Delta Lake supports time travel by version or timestamp. For example: `SELECT * FROM my_table VERSION AS OF 5`.",
    resourceIds: ["docs-delta", "exam-guide"],
    difficulty: "medium",
  },
  {
    key: "schema-enforcement",
    topicId: "delta-basics",
    domainId: "platform",
    prompt:
      "What happens by default when you try to append data to a Delta table, but the incoming DataFrame has an extra column that is not present in the target table?",
    choices: [
      "The write succeeds and the new column is automatically added to the schema.",
      "The write fails due to Delta Lake's schema enforcement.",
      "The extra column is silently dropped and the rest of the data is appended.",
      "The target table is overwritten completely.",
    ],
    correctIndex: 1,
    explanation:
      "Delta enforces strict schema compatibility by default and rejects incompatible writes. To allow the new column, you must explicitly enable schema evolution (e.g., `.option(\"mergeSchema\", \"true\")`).",
    resourceIds: ["docs-delta", "exam-guide"],
    difficulty: "medium",
  },
  {
    key: "optimize-zorder",
    topicId: "delta-basics",
    domainId: "platform",
    prompt:
      "A Delta table is queried frequently using filters on a high-cardinality column like `customer_id`. Which command will optimally layout the data files to improve read performance for these queries?",
    choices: [
      "`VACUUM RETAIN 0 HOURS`",
      "`OPTIMIZE table_name ZORDER BY (customer_id)`",
      "`ANALYZE TABLE table_name COMPUTE STATISTICS`",
      "`ALTER TABLE table_name CLUSTER BY (customer_id)`",
    ],
    correctIndex: 1,
    explanation:
      "Compaction with `OPTIMIZE` and `ZORDER BY` colocates related information in the same set of files, significantly improving data skipping for queries that filter on the Z-ordered columns.",
    resourceIds: ["docs-delta", "exam-guide"],
    difficulty: "hard",
  },

  // Platform — Workspace
  {
    key: "free-edition-purpose",
    topicId: "workspace-basics",
    domainId: "platform",
    prompt:
      "Which statement best describes Databricks Community Edition?",
    choices: [
      "It is a no-cost workspace suitable for guided hands-on practice.",
      "It requires an enterprise contract to run notebooks.",
      "It relies on the customer's cloud account to provision infrastructure.",
      "It restricts usage strictly to Databricks SQL clusters.",
    ],
    correctIndex: 0,
    explanation:
      "Community Edition is designed as a no-cost hands-on workspace for learning, prototyping, and collaborative exploration.",
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
      "Repos (Git Folders) backed by Git",
      "Cluster event logs",
      "SQL warehouse history",
    ],
    correctIndex: 1,
    explanation:
      "Databricks Repos (now called Git Folders) integrate notebooks directly with Git workflows for collaboration.",
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
    prompt: "When writing a PySpark Structured Streaming script to incrementally ingest JSON files from S3, which format must be specified to use Auto Loader?",
    choices: [
      "`spark.readStream.format(\"json\")`",
      "`spark.readStream.format(\"delta\")`",
      "`spark.readStream.format(\"cloudFiles\")`",
      "`spark.readStream.format(\"autoLoader\")`"
    ],
    correctIndex: 2,
    explanation: "Auto Loader incrementally and efficiently processes new data files as they arrive in cloud storage. It is enabled by specifying the `cloudFiles` format in the `readStream` command.",
    resourceIds: ["docs-autoloader", "academy-ingestion"],
    difficulty: "easy",
  },
  {
    key: "schema-evolution-mode",
    topicId: "auto-loader",
    domainId: "ingestion",
    prompt:
      "A data engineer wants Auto Loader to automatically evolve the schema when new columns are discovered in the source files. Which `cloudFiles.schemaEvolutionMode` setting should they use?",
    choices: [
      "`addNewColumns`",
      "`rescue`",
      "`failOnNewColumns`",
      "`none`"
    ],
    correctIndex: 0,
    explanation:
      "The `addNewColumns` mode is the default when a schema is inferred. It evolves the schema by adding newly discovered columns. The `rescue` mode puts new columns in a rescued data column rather than evolving the schema, and `failOnNewColumns` fails the stream without evolving the schema.",
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
    prompt: "A JSON file ingested by Auto Loader contains the field `{\"customer_id\": \"ABC\"}`, but the inferred schema expects an integer. If the rescued data column is configured, what happens to this record?",
    choices: [
      "The stream fails and the file is moved to a dead-letter queue.",
      "The record is written with a `NULL` for `customer_id` and the original field is preserved in the `_rescued_data` column.",
      "The `customer_id` is cast to a string and added as a new column.",
      "The entire JSON record is skipped."
    ],
    correctIndex: 1,
    explanation:
      "Auto Loader's rescued data column (`_rescued_data` by default) captures data that doesn't match the schema, such as type mismatches or unexpected columns, while parsing the rest of the record normally.",
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
      "Low-cardinality partitions avoid over-fragmentation while aiding data skipping. Note: For tables under 1TB, Databricks recommends Liquid Clustering or native data skipping instead of explicit partitioning.",
    resourceIds: ["docs-autoloader", "academy-ingestion"],
    difficulty: "medium",
  },

  // Processing — Spark SQL
  {
    key: "exam-sql-preference",
    topicId: "spark-sql",
    domainId: "processing",
    prompt:
      "A developer is writing a PySpark script and needs to convert a string column `date_str` to a DateType column `order_date`. Which function from `pyspark.sql.functions` should they use?",
    choices: [
      "`to_date(col(\"date_str\"), \"yyyy-MM-dd\")`",
      "`date_format(col(\"date_str\"), \"yyyy-MM-dd\")`",
      "`cast(col(\"date_str\"), \"date\")`",
      "`from_unixtime(col(\"date_str\"))`"
    ],
    correctIndex: 0,
    explanation:
      "The `to_date` function converts a string to a DateType according to a specified format. The `date_format` function does the opposite: it formats a date or timestamp into a string.",
    resourceIds: ["exam-guide", "academy-pipelines"],
    difficulty: "medium",
  },
  {
    key: "left-join",
    topicId: "spark-sql",
    domainId: "processing",
    prompt: "Given two DataFrames, `df_customers` and `df_orders`, which PySpark command correctly performs a left join to find customers without orders?",
    choices: [
      "`df_customers.join(df_orders, \"customer_id\", \"outer\").filter(col(\"order_id\").isNull())`",
      "`df_customers.join(df_orders, \"customer_id\", \"left\").filter(col(\"order_id\").isNull())`",
      "`df_customers.join(df_orders, \"customer_id\", \"inner\").filter(col(\"order_id\").isNull())`",
      "`df_customers.join(df_orders, \"customer_id\", \"right\").filter(col(\"order_id\").isNull())`"
    ],
    correctIndex: 1,
    explanation: "A `left` join preserves all rows from the left DataFrame (`df_customers`). Filtering where `order_id` is null identifies customers who have no corresponding records in the right DataFrame.",
    resourceIds: ["exam-guide", "academy-pipelines"],
    difficulty: "medium",
  },
  {
    key: "window-ranking",
    topicId: "spark-sql",
    domainId: "processing",
    prompt:
      "A developer needs to find the single most recent order for each customer. Which SQL window function and clause should they use?",
    choices: [
      "`ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC)`",
      "`RANK() OVER (PARTITION BY customer_id ORDER BY order_date DESC)`",
      "`MAX(order_date) OVER (PARTITION BY customer_id)`",
      "`FIRST_VALUE(order_id) OVER (ORDER BY customer_id, order_date DESC)`",
    ],
    correctIndex: 0,
    explanation:
      "`ROW_NUMBER()` assigns a unique ordering within each customer partition. Filtering to row number 1 returns one most-recent row per customer, breaking ties unlike `RANK()`.",
    resourceIds: ["exam-guide", "academy-pipelines"],
    difficulty: "hard",
  },
  {
    key: "group-by",
    topicId: "spark-sql",
    domainId: "processing",
    prompt: "In Spark SQL, what is the effect of using the `GROUP BY` clause with the `CUBE` operator instead of the `ROLLUP` operator on two columns, `region` and `store`?",
    choices: [
      "`CUBE` only computes subtotals for `region`, while `ROLLUP` computes subtotals for both.",
      "`CUBE` computes aggregations for all possible combinations of `region` and `store`, while `ROLLUP` computes aggregations hierarchically (`(region, store)`, `(region)`, `()`).",
      "`CUBE` requires a window function, but `ROLLUP` does not.",
      "There is no difference; they produce identical output."
    ],
    correctIndex: 1,
    explanation: "`CUBE` generates subtotals for all permutations of the specified columns. `ROLLUP` only generates subtotals hierarchically from left to right.",
    resourceIds: ["exam-guide", "academy-pipelines"],
    difficulty: "hard",
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
      "Which output mode is required to emit the full aggregate result table each trigger?",
    choices: ["Append", "Complete", "Ignore", "Static"],
    correctIndex: 1,
    explanation: "Complete mode emits the full aggregate result each trigger. Append is the default, and Update mode only emits updated rows.",
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
      "`Trigger.AvailableNow`",
      "No trigger option needed",
      "Only manual reruns",
    ],
    correctIndex: 1,
    explanation: "`Trigger.AvailableNow` processes all currently available data and then stops. `Trigger.Once` is deprecated in newer Databricks Runtime versions.",
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

  // Databricks SQL (DBSQL)
  {
    key: "dbsql-endpoints",
    topicId: "dbsql",
    domainId: "platform",
    prompt:
      "What is the primary purpose of Serverless SQL Warehouses in Databricks SQL?",
    choices: [
      "To run continuously executing Structured Streaming pipelines",
      "To provide instant compute for BI and SQL workloads without managing infrastructure",
      "To store machine learning models in MLflow",
      "To execute distributed training of PyTorch models",
    ],
    correctIndex: 1,
    explanation:
      "Serverless SQL Warehouses are optimized for high-concurrency, low-latency SQL workloads like BI dashboards, abstracting away cluster management.",
    resourceIds: ["docs-dbsql", "academy-platform"],
    difficulty: "medium",
  },
  {
    key: "dbsql-dashboards",
    topicId: "dbsql",
    domainId: "platform",
    prompt:
      "Which feature in Databricks SQL allows users to create parameterized visualizations that automatically update based on user input?",
    choices: [
      "Lakeflow Jobs",
      "Delta Live Tables",
      "Dashboard Widgets with Parameters",
      "Unity Catalog Volumes",
    ],
    correctIndex: 2,
    explanation:
      "Query parameters in Databricks SQL allow dashboard widgets to become interactive, updating visualizations based on selections.",
    resourceIds: ["docs-dbsql", "academy-platform"],
    difficulty: "easy",
  },

  // Delta Live Tables (DLT)
  {
    key: "dlt-expectations",
    topicId: "dlt",
    domainId: "processing",
    prompt:
      "In Delta Live Tables (DLT), what is the function of the `CONSTRAINT` (or `@dlt.expect`) clause?",
    choices: [
      "To define foreign key relationships between tables",
      "To enforce data quality rules and specify handling of invalid records",
      "To restrict user access to specific rows",
      "To optimize the layout of data files on disk",
    ],
    correctIndex: 1,
    explanation:
      "DLT expectations define data quality rules. You can configure them to retain, drop, or fail the pipeline when data violates the constraints (`expect`, `expect or drop`, `expect or fail`).",
    resourceIds: ["docs-dlt", "academy-pipelines"],
    difficulty: "medium",
  },
  {
    key: "dlt-streaming-tables",
    topicId: "dlt",
    domainId: "processing",
    prompt:
      "What is a key characteristic of a Streaming Table in a Delta Live Tables pipeline?",
    choices: [
      "It completely overwrites its destination table on every update",
      "It only processes new data that has arrived since the last pipeline update",
      "It is identical to a materialized view but requires manual refreshes",
      "It cannot be used as a source for other tables in the pipeline",
    ],
    correctIndex: 1,
    explanation:
      "Streaming tables are designed for incremental, stateful processing, only reading new data from the source exactly once.",
    resourceIds: ["docs-dlt", "academy-pipelines"],
    difficulty: "hard",
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
  const prompt = `${template.prompt}\n\n*(${topicName} scenario ${variantLabel}) ${VARIANT_SUFFIXES[variantIndex]}*`;

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
