// ── Track E Marketplace Data ───────────────────────────
// For each of the 4 problem buckets, 3 recommended modes/skills
// with a "why" blurb and a ready-to-paste starter prompt.

window.TRACK_E = {

  categories: [
    { value: 'build',   label: 'Build or code something'                         },
    { value: 'analyze', label: 'Analyze data, a document, or a codebase'         },
    { value: 'create',  label: 'Write, pitch, or create content'                 },
    { value: 'learn',   label: 'Learn a skill or understand a new technology'     }
  ],

  recommendations: {

    build: [
      {
        type:    'mode',
        name:    'Master Developer',
        install: 'Master Developer',
        why:     'Zero-defect, blueprint-first engineering. Follows a strict pipeline — blueprint → TDD → QA → deploy — so nothing ships broken.',
        prompt:  'I need to build [describe what you\'re building — e.g. "a REST API that tracks inventory" or "a React dashboard that reads from a CSV"]. Before writing a single line of code, create a full technical blueprint: system design, data model, API contracts, and the exact test cases I\'ll need to verify it works. Then implement it end to end.'
      },
      {
        type:    'mode',
        name:    'UI/UX Pro Max',
        install: 'UI/UX Pro Max',
        why:     'Production-ready UI with 50+ styles, 161 palettes, and multi-stack support. Turn a rough idea into a working, beautiful interface.',
        prompt:  'I need a UI for [describe the product — e.g. "a supply chain dashboard", "a mobile onboarding screen", "an admin panel"]. My stack is [React / Next.js / Vue / SwiftUI / other]. Design and build the full component with a style that fits [enterprise / consumer / startup / dark mode] and make sure it looks like a human designed it — no AI-slop gradients or glass.'
      },
      {
        type:    'mode',
        name:    'n8n Workflow Architect',
        install: 'n8n Workflow Architect',
        why:     'If what you want to build is an automation — connecting tools, scheduling tasks, routing data — n8n is the fastest path and Bob outputs valid importable JSON.',
        prompt:  'I want to automate the following workflow: [describe the trigger, the steps, and the final output — e.g. "When a new row appears in a Google Sheet, send a Slack message and log it to Airtable"]. Output a valid n8n workflow JSON I can import directly, with proper error handling and retry logic on each node.'
      }
    ],

    analyze: [
      {
        type:    'skill',
        name:    'engineering-audit',
        install: 'engineering-audit',
        why:     'If what you\'re analyzing is a codebase, this skill runs a full 9-stage audit — security, architecture, release readiness — autonomously.',
        prompt:  'Run a full engineering audit on this codebase. Start with repository discovery: map the structure, identify the stack, and list every dependency. Then move through: security findings, architectural concerns, test coverage gaps, and a release readiness verdict. Give me the top 5 actionable findings I should fix before shipping.'
      },
      {
        type:    'skill',
        name:    'imagegen',
        install: 'imagegen',
        why:     'Turn any dataset, report, or analysis into the right visual — Mermaid diagrams, Python charts, or AI-generated images — automatically routed to the best tool.',
        prompt:  'I have the following data or document to visualize: [paste your data, describe your CSV columns, or describe what the chart should show]. Pick the best visualization type for this — chart, diagram, or image — build it, and explain in one sentence why you chose that form over the alternatives.'
      },
      {
        type:    'skill',
        name:    'bob-lead-intelligence',
        install: 'bob-lead-intelligence',
        why:     'If you\'re analyzing a market, a prospect list, or a competitive landscape, this skill generates deep B2B intelligence with decision makers and IBM solution mapping.',
        prompt:  'Analyze the following company / industry / prospect list for IBM automation opportunity: [paste company names, industry, or describe the segment]. For each target, identify the most likely decision makers, the top 2 pain points IBM can solve, the best-fit IBM product, and an estimated deal size range.'
      }
    ],

    create: [
      {
        type:    'skill',
        name:    'master-storytelling',
        install: 'master-storytelling',
        why:     'Blends three storytelling frameworks to turn raw information into narratives people understand, feel, and remember — for pitches, videos, posts, and presentations.',
        prompt:  'I need to create [a pitch / a LinkedIn post / a presentation / a video script / a proposal] for [describe the audience and the goal — e.g. "a CFO audience to approve a $500k software budget"]. Here is my raw material: [paste notes, bullet points, or a rough draft]. Build a complete, polished first draft — not an outline. Use a narrative arc that earns trust before asking for action.'
      },
      {
        type:    'skill',
        name:    'bob-exec-summary',
        install: 'bob-exec-summary',
        why:     'One-page executive summaries in a problem/solution/value/ask structure — tuned for C-level readers who have 90 seconds.',
        prompt:  'Write an executive summary for [describe the initiative, proposal, or decision — e.g. "adopting IBM Bob across our 300-person engineering org"]. Audience: [name the exec role — e.g. CTO, CFO, CEO]. Keep it to one page. Structure: problem we\'re solving → our proposed solution → financial and strategic value → what we need approved. No filler, no jargon.'
      },
      {
        type:    'skill',
        name:    'linkedin-storyteller',
        install: 'linkedin-storyteller',
        why:     'Writes viral LinkedIn personal stories in a highly specific style — emotionally resonant, easy to read, engineered for engagement.',
        prompt:  'Write a LinkedIn post about [describe the experience, lesson, or announcement — e.g. "a mistake I made as a first-time engineering manager and what I learned"]. Style: personal story with a business lesson. Start with a line that stops the scroll. End with a question that invites comments. No emojis in the first line. Under 250 words.'
      }
    ],

    learn: [
      {
        type:    'mode',
        name:    'PyBob — Python Mentor',
        install: 'PyBob Python Mentor',
        why:     'A patient, Socratic Python tutor that starts at your level — whether you\'ve never coded or just want to level up. Builds toward real, runnable scripts.',
        prompt:  'Start my Python learning session. I\'m a [complete beginner / have some basics / intermediate developer] and my goal is to [automate something / understand data science / build web apps / get a job as a developer]. Run your diagnostic, pick my track, and start the first lesson. Never lecture — always ask first.'
      },
      {
        type:    'mode',
        name:    'SqlBob — Database Mentor',
        install: 'SqlBob Database Mentor',
        why:     'Teaches SQL from SELECT to advanced analytics using real-world scenarios. Explains the WHY behind every clause and runs interactive challenges.',
        prompt:  'Start my SQL learning session. I\'m a [complete beginner / know basic SELECT / want advanced analytics] and I work in [describe your industry or data context — e.g. "retail sales data", "healthcare records", "financial reporting"]. Run your diagnostic and start with the concept that\'s most foundational for what I\'m trying to do.'
      },
      {
        type:    'mode',
        name:    'QisBob — Quantum Mentor',
        install: 'QisBob Quantum Mentor',
        why:     'Socratic quantum computing tutor on real IBM hardware. Picks your track — Executive, Developer, or Hardware — and walks you gate by gate through Qiskit circuits.',
        prompt:  'Start my quantum computing session. I\'m a [executive curious about quantum strategy / developer who knows Python / hardware researcher] and my goal is to [understand the business case / write my first circuit / explore real IBM hardware]. Run your diagnostic and start the track that fits. Never lecture — quiz me at every step.'
      }
    ]

  }

};
