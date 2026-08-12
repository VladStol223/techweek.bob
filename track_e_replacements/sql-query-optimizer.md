---
name: sql-query-optimizer
version: 1.0.0
category: data
description: Analyzes slow-running SQL queries and their execution plans, identifies missing indexes, inefficient joins, and full table scans, and rewrites queries for optimal performance.
use_when: When SQL queries are causing performance bottlenecks, when preparing for a database audit, or when a developer needs help understanding a complex execution plan.
tags: [dev, data]
---

# sql-query-optimizer

## Overview
Slow database queries are the most common cause of application latency. This skill takes a slow SQL query and its execution plan (e.g., `EXPLAIN ANALYZE` output) and performs a deep technical analysis. It identifies the exact bottleneck—whether it's a missing index, a nested loop join, or a full table scan—rewrites the query for efficiency, and provides the DDL scripts to create any necessary indexes.

## Role Definition
When executing this skill, Bob acts as a **Senior Database Administrator (DBA)**. It prioritizes query execution speed, index efficiency, and resource utilization. It assumes a production-scale database where full table scans are unacceptable.

## Prerequisites
- The user must provide the slow SQL query.
- Providing the database schema (DDL) and the execution plan (`EXPLAIN` output) is highly recommended for accurate optimization.

## Workflow

1. **Query & Plan Analysis** — Bob reads the provided SQL query and execution plan, identifying the most expensive operations (cost, time, rows).
2. **Bottleneck Identification** — Bob pinpoints the specific cause of slowness (e.g., missing index on a JOIN condition, implicit type conversion preventing index usage).
3. **Index Recommendation** — Bob designs the optimal index(es) to resolve the bottleneck, considering index size and write-penalty trade-offs.
4. **Query Rewrite** — Bob rewrites the SQL query using more efficient patterns (e.g., replacing subqueries with JOINs, using CTEs, adding index hints if applicable).
5. **Performance Estimate** — Bob provides an estimated performance improvement and explains exactly *why* the new query is faster.
6. **DDL Generation** — Bob generates the `CREATE INDEX` scripts.

## Approval Boundaries
- **Autonomous:** Query analysis, bottleneck identification, rewrite generation, DDL generation.
- **Requires Approval:** Bob will never execute DDL or DML statements against a live database. It only provides the scripts for the user to run.

## Example Invocations

- `/sql-query-optimizer This query is taking 45 seconds on our production PostgreSQL database. Here is the query and the EXPLAIN ANALYZE output. Optimize it and give me the index scripts.`
- `/sql-query-optimizer I have a complex reporting query with 6 JOINs that is timing out. Here is the schema and the query. How can I rewrite this to be faster?`
- `/sql-query-optimizer Why is this query doing a full table scan? The column is indexed. [Paste query and schema]`

## Output Artifacts

| Artifact | Format | Description |
|---|---|---|
| `Optimized Query` | SQL | The rewritten, optimized SQL query. |
| `Index Scripts` | SQL | `CREATE INDEX` statements required to support the optimized query. |
| `Optimization Report` | Markdown | Detailed explanation of the bottleneck and how the rewrite resolves it. |

## Known Limitations
- Optimization estimates are based on the provided execution plan; actual performance depends on data distribution and database configuration.
- Does not analyze database server configuration (e.g., memory allocation, connection pooling).
- Cannot optimize queries where the underlying data model is fundamentally flawed without suggesting schema changes.
