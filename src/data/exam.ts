import type { ExamDomain, Topic } from '../types'

export const EXAM_DOMAINS: ExamDomain[] = [
  {
    id: 'platform',
    name: 'Platform',
    weight: 10,
    description: 'Workspace concepts and core platform vocabulary.',
  },
  {
    id: 'ingestion',
    name: 'Development and Ingestion',
    weight: 30,
    description: 'Data ingestion patterns including Auto Loader and incremental loads.',
  },
  {
    id: 'processing',
    name: 'Data Processing and Transformations',
    weight: 31,
    description: 'Spark SQL and PySpark transformations, joins, and streaming concepts.',
  },
  {
    id: 'production',
    name: 'Productionizing Pipelines',
    weight: 18,
    description: 'Lakeflow Jobs orchestration, scheduling, and monitoring patterns.',
  },
  {
    id: 'governance',
    name: 'Governance and Quality',
    weight: 11,
    description: 'Unity Catalog namespace, privileges, and data governance basics.',
  },
]

export const TOPICS: Topic[] = [
  { id: 'delta-basics', domainId: 'platform', name: 'Delta Lake Foundations' },
  { id: 'workspace-basics', domainId: 'platform', name: 'Workspace Fundamentals' },
  { id: 'auto-loader', domainId: 'ingestion', name: 'Auto Loader and cloudFiles' },
  { id: 'ingestion-patterns', domainId: 'ingestion', name: 'Batch vs Incremental Ingestion' },
  { id: 'spark-sql', domainId: 'processing', name: 'Spark SQL Transformations' },
  { id: 'streaming', domainId: 'processing', name: 'Structured Streaming Concepts' },
  { id: 'jobs', domainId: 'production', name: 'Lakeflow Jobs and Scheduling' },
  { id: 'pipeline-ops', domainId: 'production', name: 'Pipeline Monitoring and Repair' },
  { id: 'unity-catalog', domainId: 'governance', name: 'Unity Catalog Namespace and Privileges' },
  { id: 'quality', domainId: 'governance', name: 'Data Quality and Governance Controls' },
]
