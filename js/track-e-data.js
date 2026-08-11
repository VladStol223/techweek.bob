// ── Track E Marketplace Data (UPDATED — RenderATL Optimized) ─────────────────
// For each of the 5 problem buckets, 3 recommended modes/skills
// with a "why" blurb and a ready-to-paste starter prompt.
// Changes from original:
//   build[2]:   n8n Workflow Architect → github-actions-generator
//   analyze[1]: imagegen               → sql-query-optimizer
//   analyze[2]: bob-lead-intelligence  → c4-model-generator
//   create[0]:  master-storytelling    → technical-writer-mode
//   create[1]:  bob-exec-summary       → pr-to-changelog
//   create[2]:  linkedin-storyteller   → linkedin-storyteller (prompt reframed)
//   learn[2]:   QisBob                 → inception-mode
//   NEW bucket: fix (Fix or improve something that's already broken)

window.TRACK_E = {
  categories: [
    { value: 'build',   label: 'Build or code something'                    },
    { value: 'analyze', label: 'Analyze data, a document, or a codebase'    },
    { value: 'create',  label: 'Write, pitch, or create content'            },
    { value: 'learn',   label: 'Learn a skill or understand a new technology'},
    { value: 'fix',     label: 'Fix or improve something that\'s already broken' }
  ],
  recommendations: {

    // ── BUILD ──────────────────────────────────────────────────────────────────
    build: [
      {
        type: 'mode',
        name: 'Master Developer',
        install: 'Master Developer',
        why: 'Zero-defect, blueprint-first engineering. Follows a strict pipeline — blueprint → TDD → QA → deploy — so nothing ships broken.',
        prompt: `I need to build [describe what you're building — e.g. "a REST API that tracks inventory" or "a React dashboard that reads from a CSV"]. Before writing a single line of code, create a full technical blueprint: system design, data model, API contracts, and the exact test cases I'll need to verify it works. Then implement it end to end.`
      },
      {
        type: 'mode',
        name: 'UI/UX Pro Max',
        install: 'UI/UX Pro Max',
        why: 'Production-ready UI with 50+ styles, 161 palettes, and multi-stack support. Turn a rough idea into a working, beautiful interface.',
        prompt: `I need a UI for [describe the product — e.g. "a supply chain dashboard", "a mobile onboarding screen", "an admin panel"]. My stack is [React / Next.js / Vue / SwiftUI / other]. Design and build the full component with a style that fits [enterprise / consumer / startup / dark mode] and make sure it looks like a human designed it — no AI-slop gradients or glass.`
      },
      {
        // REPLACED: n8n Workflow Architect → github-actions-generator
        type: 'skill',
        name: 'github-actions-generator',
        install: 'github-actions-generator',
        why: 'Every developer in the room has a GitHub repo. This skill reads your project and generates a complete, production-ready CI/CD pipeline in one prompt — caching, parallelism, security scanning, and deployment included. Drop the output file into your repo and it works.',
        prompt: `Read this repository and generate a complete GitHub Actions CI/CD pipeline. I need:
1. A lint and test stage with dependency caching enabled
2. A production build stage
3. A security scan stage (use CodeQL or Semgrep)
4. A deployment stage to [AWS S3 / AWS ECS / Heroku / GitHub Pages — pick the right one based on the project]

Generate the complete .github/workflows/ci.yml file and a PIPELINE_DOCS.md explaining the required GitHub Secrets and how to trigger a deployment.`
      }
    ],

    // ── ANALYZE ────────────────────────────────────────────────────────────────
    analyze: [
      {
        type: 'skill',
        name: 'engineering-audit',
        install: 'engineering-audit',
        why: 'If what you\'re analyzing is a codebase, this skill runs a full 9-stage audit — security, architecture, release readiness — autonomously.',
        prompt: `Run a full engineering audit on this codebase. Start with repository discovery: map the structure, identify the stack, and list every dependency. Then move through: security findings, architectural concerns, test coverage gaps, and a release readiness verdict. Give me the top 5 actionable findings I should fix before shipping.`
      },
      {
        // REPLACED: imagegen → sql-query-optimizer
        type: 'skill',
        name: 'sql-query-optimizer',
        install: 'sql-query-optimizer',
        why: 'A developer who says "I want to analyze data" almost always means they have a slow query or a database they don\'t fully understand. This skill takes your query and execution plan, pinpoints the exact bottleneck, rewrites the query, and gives you the index scripts to prove it\'s faster.',
        prompt: `I have a slow SQL query I need you to analyze and optimize. Here is the query:

[PASTE YOUR SQL QUERY HERE]

Here is the EXPLAIN ANALYZE output (if available):

[PASTE EXPLAIN OUTPUT HERE]

Here is the relevant table schema (if available):

[PASTE DDL HERE]

Identify the exact cause of the slowness. Rewrite the query for optimal performance. Generate the CREATE INDEX scripts I need to run. Estimate the performance improvement and explain exactly why the new query is faster.`
      },
      {
        // REPLACED: bob-lead-intelligence → c4-model-generator
        type: 'skill',
        name: 'c4-model-generator',
        install: 'c4-model-generator',
        why: 'If you want to understand a codebase beyond a security audit, you need to see its architecture. This skill reads the repo and generates all four levels of the C4 Architecture Model as Mermaid diagrams — Context, Container, Component, and Code — saved to a single ARCHITECTURE.md file you can share immediately.',
        prompt: `Read this repository and generate a complete C4 Architecture Model. I need all four levels:

Level 1 — Context: Show the system, its users, and every external system it interacts with.
Level 2 — Container: Show all deployable units (web apps, APIs, databases, queues) and how they communicate.
Level 3 — Component: Show the internal structure of the primary application (controllers, services, repositories).
Level 4 — Code: Generate an entity/class diagram for the most complex domain model in the codebase.

Output everything as Mermaid diagrams inside a single ARCHITECTURE.md file. Add a one-paragraph description below each diagram explaining what it shows and why the architecture is designed this way.`
      }
    ],

    // ── CREATE ─────────────────────────────────────────────────────────────────
    create: [
      {
        // REPLACED: master-storytelling → technical-writer-mode
        type: 'mode',
        name: 'Technical Writer Mode',
        install: 'Technical Writer Mode',
        why: 'A developer who clicks "Write content" is almost always thinking about a README, an API spec, a runbook, or release notes — not a narrative arc. This mode reads your codebase and generates accurate, complete documentation automatically. No more "I\'ll write the docs later."',
        prompt: `Enter Technical Writer Mode. I need documentation for [describe what needs documenting — e.g. "this Express.js API", "the authentication service", "the entire /src/utils directory"].

Generate the following:
1. A comprehensive README.md with: project overview, prerequisites, installation steps, usage examples, and a configuration reference.
2. An OpenAPI 3.0 specification for all API endpoints (if applicable).
3. Inline JSDoc/docstring comments for all public functions that are currently undocumented.

Audience: internal developers who are new to this codebase. Tone: clear, direct, no filler.`
      },
      {
        // REPLACED: bob-exec-summary → pr-to-changelog
        type: 'skill',
        name: 'pr-to-changelog',
        install: 'pr-to-changelog',
        why: 'Every developer in the room has merged PRs this week. This skill turns a list of PR titles and descriptions into polished release notes and a CHANGELOG.md update in under 2 minutes. It\'s a writing task you actually do and currently hate doing.',
        prompt: `Generate release notes from the following list of merged Pull Requests for version [X.X.X]:

[PASTE YOUR PR LIST HERE — titles, descriptions, or just a numbered list]

I need two outputs:
1. CHANGELOG.md update in strict "Keep a Changelog" format (Added / Changed / Deprecated / Removed / Fixed / Security sections).
2. Customer-facing release notes in a narrative format suitable for a blog post or email announcement. Translate technical changes into user value. Highlight the top 3 most impactful changes. Flag any breaking changes prominently with migration instructions.`
      },
      {
        // KEPT: linkedin-storyteller — prompt reframed for developer audience
        type: 'skill',
        name: 'linkedin-storyteller',
        install: 'linkedin-storyteller',
        why: 'Writes viral LinkedIn personal stories in a highly specific style — emotionally resonant, easy to read, engineered for engagement. Reframed here for developers: share a technical win, a hard lesson, or a project launch.',
        prompt: `Write a LinkedIn post about a technical problem I recently solved or a project I just shipped.

Here is the context: [describe the problem, what you tried, what finally worked, and what you learned — e.g. "I spent 3 days debugging a race condition in our payment service and finally found it was a missing database index"]

Style requirements:
- Personal story with a technical lesson embedded in it
- First line must stop the scroll — no "I'm excited to share..."
- Use short paragraphs (1-2 sentences max)
- End with a question that invites comments from other developers
- No emojis in the first line
- Under 250 words
- Sound like a real developer, not a LinkedIn influencer`
      }
    ],

    // ── LEARN ──────────────────────────────────────────────────────────────────
    learn: [
      {
        type: 'mode',
        name: 'PyBob — Python Mentor',
        install: 'PyBob Python Mentor',
        why: 'A patient, Socratic Python tutor that starts at your level — whether you\'ve never coded or just want to level up. Builds toward real, runnable scripts.',
        prompt: `Start my Python learning session. I'm a [complete beginner / have some basics / intermediate developer] and my goal is to [automate something / understand data science / build web apps / get a job as a developer]. Run your diagnostic, pick my track, and start the first lesson. Never lecture — always ask first.`
      },
      {
        type: 'mode',
        name: 'SqlBob — Database Mentor',
        install: 'SqlBob Database Mentor',
        why: 'Teaches SQL from SELECT to advanced analytics using real-world scenarios. Explains the WHY behind every clause and runs interactive challenges.',
        prompt: `Start my SQL learning session. I'm a [complete beginner / know basic SELECT / want advanced analytics] and I work in [describe your industry or data context — e.g. "retail sales data", "healthcare records", "financial reporting"]. Run your diagnostic and start with the concept that's most foundational for what I'm trying to do.`
      },
      {
        // REPLACED: QisBob → inception-mode
        type: 'mode',
        name: 'Inception Mode',
        install: 'Inception Mode',
        why: 'The most powerful "learn" offering at this event. You just used Bob. Now build your own skill. Inception Mode is Bob helping you design a new Bob mode or skill from scratch — turning you from a consumer of Bob into a contributor to the marketplace.',
        prompt: `Enter Inception Mode. I want to build a new IBM Bob skill or custom mode. Here is what I want it to do:

[Describe the workflow you want to automate — e.g. "I want a skill that reviews pull requests for security vulnerabilities and posts a structured comment to GitHub" or "I want a mode that makes Bob act as a patient SQL tutor for my junior developers"]

Walk me through the design process:
1. Ask me the clarifying questions I need to answer before we can write the skill.
2. Design the role definition, workflow steps, and approval boundaries together with me.
3. Generate the final SKILL.md or custom_modes.yaml entry.
4. Tell me exactly where to put the file and how to invoke it.`
      }
    ],

    // ── FIX (NEW BUCKET) ───────────────────────────────────────────────────────
    fix: [
      {
        type: 'skill',
        name: 'owasp-top-10-audit',
        install: 'owasp-top-10-audit',
        why: 'If something is broken in production and you suspect a security issue, this skill performs a systematic static analysis against all 10 OWASP categories, returning code-level findings with CVSS scores and exact remediation examples.',
        prompt: `Run a full OWASP Top 10 security audit on this codebase. For each of the 10 categories, tell me:
1. Whether the codebase is vulnerable (Yes / No / Partial)
2. The specific file and line number of each finding
3. The CVSS severity score
4. The exact code change required to fix it

Prioritize Critical and High severity findings. Generate a remediation report I can share with my team.`
      },
      {
        type: 'skill',
        name: 'flaky-test-debugger',
        install: 'flaky-test-debugger',
        why: 'If your CI pipeline is unreliable and tests pass locally but fail in CI, this skill analyzes the failure patterns, diagnoses the root cause (race condition, state leakage, timing dependency), and rewrites the tests to be deterministic.',
        prompt: `My CI pipeline has flaky tests that fail inconsistently. Here are the test failure logs from the last 5 CI runs:

[PASTE CI LOGS HERE]

Analyze the failure patterns and:
1. Identify which tests are flaky (failing in <100% of runs)
2. Diagnose the root cause for each flaky test (race condition / state leakage / timing / network dependency)
3. Rewrite each flaky test to be deterministic
4. Suggest any CI configuration changes that would reduce flakiness across the board`
      },
      {
        type: 'skill',
        name: 'cyclomatic-complexity-reducer',
        install: 'cyclomatic-complexity-reducer',
        why: 'If your codebase has functions that are too complex to test or understand, this skill measures cyclomatic complexity across the entire project, identifies the worst offenders, and refactors them into clean, independently testable units.',
        prompt: `Analyze this codebase and identify all functions with a cyclomatic complexity score above 10.

For the top 5 most complex functions:
1. Show me the current complexity score and explain why it is high
2. Refactor the function into smaller, single-purpose functions
3. Generate unit tests for each extracted function
4. Show me the before/after complexity score

After refactoring, run the test suite to confirm no behavior has changed.`
      }
    ]

  }
};
