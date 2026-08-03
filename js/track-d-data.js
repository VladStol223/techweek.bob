// ── Track D Quiz Data ──────────────────────────────────
// Separated from app.js so the prompt templates are easy to edit
// without touching interaction logic.

window.TRACK_D = {

  // Q1 openers (keyed by bucket)
  openers: {
    technical:    function(label) { return "I'm a" + (/^[aeiou]/i.test(label) ? 'n' : '') + ' ' + label + " and I build/maintain things directly."; },
    lead:         function(label) { return "I'm a" + (/^[aeiou]/i.test(label) ? 'n' : '') + ' ' + label + ", responsible for [your team / domain]."; },
    communicator: function(label) { return "In my role as a" + (/^[aeiou]/i.test(label) ? 'n' : '') + ' ' + label + ", I create and communicate [content / campaigns / materials]."; },
    builder:      function(label) { return "I'm working on [my project / product / side business]."; },
    new:          function(label) { return "I'm exploring how AI can help with [my work / studies] — keep it simple and check in with me as we go."; }
  },

  // Q2 × Q3 task bodies (12 combinations)
  taskBodies: {
    automate_done_for_you:
      "There is a manual process I need to automate:\n" +
      "[Describe the workflow in 2–3 sentences: what triggers it, what inputs it takes, what steps it involves, and what the output should be. How often does it run?]\n\n" +
      "Give me the complete output directly — don't ask clarifying questions, just produce it. Build a working automation using Python unless you have a strong reason not to. Include:\n" +
      "• A complete, runnable script with inline comments explaining each section\n" +
      "• Exact install instructions for any dependencies\n" +
      "• A plain-English explanation of how it works so I can maintain and modify it myself\n" +
      "• The two most likely failure points and how to handle them\n\n" +
      "Don't simplify the output. I want something I can actually run today.",

    automate_reusable:
      "I need a reusable prompt I can bring back to my team for the following recurring task:\n" +
      "[Describe the task — what triggers it, what inputs it takes, what the output should be, how often it runs]\n\n" +
      "Write this as a reusable prompt template with placeholders, plus one worked example. The template should:\n" +
      "• Accept [describe what gets pasted in each time]\n" +
      "• Produce [describe the exact output format]\n" +
      "• Be self-contained enough that a teammate can use it without explanation",

    automate_guided:
      "There is a manual process I want to automate:\n" +
      "[Describe the task as plainly as possible — what you do, how often, what takes the most time]\n\n" +
      "Walk me through this one step at a time, explain your reasoning, and check in before moving on. I want to understand what we're building — not just copy-paste it. You pick the right approach for my situation.",

    analyze_done_for_you:
      "I have the following to analyze:\n" +
      "[Paste the content here, or describe it — e.g., 'a 12-month revenue breakdown by region', 'a 30-row CSV of support tickets', 'a PR with 400 lines changed']\n\n" +
      "Give me the complete output directly — don't ask clarifying questions, just produce it. Analyze this and give me:\n" +
      "1. The 5 most actionable findings specific to my role — not a generic summary\n" +
      "2. Anything that looks like a risk, a bug, or a blocker\n" +
      "3. The one thing I should fix or act on first, and why\n" +
      "4. Two follow-up questions worth digging into\n\n" +
      "Be direct. Skip the caveats. I need something I can use or share today.",

    analyze_reusable:
      "I need a reusable prompt for analyzing [describe the type of content — e.g., 'meeting transcripts', 'sales pipeline data', 'pull request diffs'].\n\n" +
      "Write this as a reusable prompt template with placeholders, plus one worked example. The template should produce:\n" +
      "• The most actionable findings specific to my role\n" +
      "• Risks, bugs, or blockers\n" +
      "• A clear recommended next action\n\n" +
      "Make it generic enough that a teammate can drop in different content each time without editing the structure.",

    analyze_guided:
      "I have the following to analyze:\n" +
      "[Paste the document, data, or problem — or describe it in plain English]\n\n" +
      "Walk me through this one step at a time, explain your reasoning, and check in before moving on. Don't assume I have deep technical background in this area. Tell me what the most important thing in here is, what I should do with it, and what questions I should be asking that I'm probably not.",

    create_done_for_you:
      "I need to create: [describe the deliverable — e.g., 'a board memo', 'a technical spec', 'a pitch deck narrative', 'a landing page copy']\n\n" +
      "Context:\n" +
      "• Audience: [describe who will read this]\n" +
      "• Objective: [what decision or action should this drive?]\n" +
      "• Raw material: [paste your notes, bullet points, or previous draft here]\n\n" +
      "Give me the complete output directly — don't ask clarifying questions, just produce it. Write a polished first draft — not an outline. Match the tone and detail level for the audience. Be concise. No filler sentences.",

    create_reusable:
      "I need a reusable prompt for creating [describe the type of document — e.g., 'status update emails', 'incident reports', 'investor update memos'].\n\n" +
      "Write this as a reusable prompt template with placeholders, plus one worked example. The template should be self-contained — a teammate should be able to paste it fresh each time with minimal setup and get a polished first draft back.",

    create_guided:
      "I need to write [describe what you need — an email, a proposal, a report, a strategy doc, a cover letter].\n\n" +
      "Here's the context:\n" +
      "• Who it's for: [describe the reader]\n" +
      "• What I want them to do or think after reading it: [describe the outcome]\n" +
      "• What I have so far: [paste your notes, bullet points, or a rough draft]\n\n" +
      "Walk me through this one step at a time, explain your reasoning, and check in before moving on. Then explain the two most important choices you made so I can learn from them.",

    understand_done_for_you:
      "I want a clear, honest picture of where AI creates real leverage for someone in my role — not hype, not theory.\n\n" +
      "Give me the complete output directly — don't ask clarifying questions, just produce it. Give me:\n" +
      "1. The 3 highest-ROI AI use cases for someone in my position — with a realistic time-to-value estimate for each\n" +
      "2. For each: what the before/after looks like in practice, what the implementation path is, and the biggest risk\n" +
      "3. The one use case I should start with this week given limited time — and the exact first prompt I should send Bob to kick it off\n\n" +
      "Be specific to my role. Don't give me a generic AI overview.",

    understand_reusable:
      "I want a reusable prompt template I can bring back to my team for getting AI recommendations specific to a given role.\n\n" +
      "Write this as a reusable prompt template with placeholders, plus one worked example — use my role as the example. The template should surface the top AI use cases for any role, with before/after comparisons and a recommended first step.",

    understand_guided:
      "I want to understand what's possible with AI — specifically Bob — for someone in my position.\n\n" +
      "Walk me through this one step at a time, explain your reasoning, and check in before moving on. Start by asking me three questions to understand how I work and what I actually need. Then give me a custom picture of where AI creates leverage in my day-to-day — with specific examples I can try today."
  }
};
