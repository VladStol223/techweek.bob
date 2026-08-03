# Track D — Quiz Logic Reference

> How the "Bring Your Own Problem" quiz works: questions, answer values, prompt key lookup, substitution rules, and one worked example per prompt template.

---

## Questions & Answer Options

### Q1 — "Which best describes you today?"

| Displayed option | `data-v` value stored |
|---|---|
| Software Engineer / Developer | `professional` |
| Product or Project Manager | `professional` |
| Data Scientist / AI Specialist | `professional` |
| Designer, Developer Advocate, or creative builder | `builder` |
| DevOps, Security, QA, or Technical Support | `professional` |
| Executive or Strategic Leader | `exec` |
| Student, Recruiter, HR, or just curious | `explorer` |

> Note: five distinct roles all map to `professional`. The display text (e.g. "Software Engineer / Developer") is stored separately in `quizLabels.dq1` and substituted into the prompt at render time.

---

### Q2 — "What would be most valuable to you right now?"

| Displayed option | `data-v` value stored |
|---|---|
| Automate something I do manually and repeatedly | `automate` |
| Analyze data, research, or documents I already have | `analyze` |
| Create something — a proposal, pitch, report, or strategy | `create` |
| Understand what's possible before I commit to anything | `understand` |

---

### Q3 — "What do you want to walk out of Atlanta Tech Week with?"

| Displayed option | `data-v` value stored |
|---|---|
| Something working — code, output, or a draft I can use | `working` |
| A prompt I can paste into Bob tomorrow and save real time | `prompt` |
| A clear mental model of how to use Bob in my daily work | `understanding` |
| One specific idea for an AI use case I should pursue | `idea` |

---

## Prompt Key Lookup

The key is built as `dq1_dq2_dq3` — e.g. `professional_analyze_working`.

**Fallback chain** (first match wins):

1. Exact 3-part key → use it
2. Matching `role_goal` prefix → use first match
3. Matching `role_` prefix → use first match
4. Final fallback → `explorer_understand_idea`

---

## Prompt Templates

Each template below shows:
- The raw prompt string (with placeholders)
- Which placeholders are auto-filled vs. left for the user
- A worked example showing what the user would actually see

**Auto-filled at render time:**
- `[your title]` → replaced with `quizLabels.dq1` (the exact text the user clicked, e.g. "Software Engineer / Developer")
- `[your role]` → same
- `[describe yourself — ...]` → replaced with `quizLabels.dq1`

**Left as-is** (the user fills these in before sending to Bob):
- Everything else in `[square brackets]`

---

### `exec_automate_working`
**Triggers when:** Q1 = exec, Q2 = automate, Q3 = working

**Raw template:**
```
I'm a [your title] and I'm responsible for [your team / department / domain].

There is a manual process I need to automate:
[Describe the workflow in 2–3 sentences: what triggers it, what inputs it takes, what steps it involves, and what the output should be. How often does it run?]

Build a working automation for this. Use Python unless you have a strong reason not to. Include:
• A complete, runnable script with inline comments explaining each section
• Exact install instructions for any dependencies
• A plain-English explanation of how it works so I can maintain and modify it myself
• The two most likely failure points and how to handle them

Don't simplify the output. I want something I can actually run today.
```

**Rendered example** (user clicked "Executive or Strategic Leader"):
```
I'm a Executive or Strategic Leader and I'm responsible for [your team / department / domain].

There is a manual process I need to automate:
[Describe the workflow in 2–3 sentences: what triggers it, what inputs it takes, what steps it involves, and what the output should be. How often does it run?]
...
```

---

### `exec_automate_prompt`
**Triggers when:** Q1 = exec, Q2 = automate, Q3 = prompt

**Raw template:**
```
I'm a [your title] and I need a reusable prompt I can paste into Bob every [weekly / daily / monthly] to automate [describe the task].

The prompt should:
• Accept [describe what I paste in — e.g., 'a raw status-update email', 'a CSV of sales numbers', 'a list of action items']
• Produce [describe the exact output — e.g., 'a formatted executive summary', 'a ranked priority list', 'a slide outline']
• Take under 2 minutes of my time each time I use it

Write the prompt itself, then show me a worked example using realistic placeholder data so I can see exactly what the output will look like.
```

---

### `exec_analyze_working`
**Triggers when:** Q1 = exec, Q2 = analyze, Q3 = working *(or fallback for exec_analyze_\*)*

**Raw template:**
```
I'm a [your title]. I have the following data / document:
[Paste the content here, or describe it: e.g., 'a 12-month revenue breakdown by region', 'a 20-page vendor contract', 'customer satisfaction scores from Q1–Q3']

Analyze this for me. Give me:
1. The 5 most important insights, ranked by strategic impact — be specific, not generic
2. Anything I should act on in the next 7 days
3. The single biggest risk buried in this data that most people would miss
4. Two questions this data cannot answer that I should be asking

Be direct. Skip the caveats. I need something I can bring into a meeting.
```

---

### `exec_create_working`
**Triggers when:** Q1 = exec, Q2 = create, Q3 = working *(or fallback for exec_create_\*)*

**Raw template:**
```
I'm a [your title] and I need to write [describe the deliverable — e.g., 'a board memo', 'an executive update email', 'a strategic narrative for an all-hands'].

Context:
• Audience: [describe who will read this]
• Objective: [what decision or action should this drive?]
• Key facts / background: [paste or describe the raw material]

Produce a polished first draft — not an outline, not a template. A real draft, ready for my edits. Write at the level of the audience. Be concise. No filler sentences.
```

---

### `exec_understand_idea`
**Triggers when:** Q1 = exec, Q2 = understand, Q3 = any *(fallback for exec_understand_\*)*

**Raw template:**
```
I'm a [your title] in [your industry / function] and I want a clear, honest picture of where AI creates real leverage for someone in my role — not hype, not theory.

Give me:
1. The 3 highest-ROI AI use cases for an executive in my position — with a realistic time-to-value estimate for each
2. For each use case: what the before/after looks like in practice, what the implementation path is, and the biggest risk
3. The one use case I should start with this week given limited time — and the exact first prompt I should send Bob to kick it off

Be specific to my role. Don't give me a generic AI overview.
```

---

### `builder_automate_working`
**Triggers when:** Q1 = builder, Q2 = automate, Q3 = working *(or fallback for builder_automate_\*)*

**Raw template:**
```
I'm working on [describe your project / product / side business].

Here's a manual process in my workflow that's slowing me down:
[Describe it: what triggers it, what inputs, what steps, what output, how often]

Build the full automation. Use Python unless there's a better fit. I want:
• A complete, runnable script with comments
• Install instructions for any dependencies
• An explanation of what each section does so I can extend it later
• How to schedule or trigger it automatically

Don't give me a sketch — give me the real thing.
```

> Note: `builder` prompts don't use `[your title]` — they open with `"I'm working on..."` so the role substitution doesn't apply here.

---

### `builder_analyze_working`
**Triggers when:** Q1 = builder, Q2 = analyze, Q3 = working *(or fallback for builder_analyze_\*)*

**Raw template:**
```
I'm working on [describe your project / product / idea].

I need to analyze [describe what you have — a market, a competitor, a dataset, user research, a codebase]:
[Paste the content or describe it in detail]

Give me a structured analysis:
• What does this tell me about what to build or prioritize?
• What should I avoid based on this?
• Where is my unfair advantage or opening?
• What's the most important thing I'm probably underweighting?

Be opinionated. I want your take, not a balanced summary.
```

---

### `builder_create_working`
**Triggers when:** Q1 = builder, Q2 = create, Q3 = working *(or fallback for builder_create_\*)*

**Raw template:**
```
I'm building [describe your product / project].

I need to create: [describe the deliverable — pitch deck narrative, investor email, product spec, PRD, landing page copy, README]

Here's my current thinking:
[Describe what you have — a rough outline, bullet points, previous draft, key facts]

Produce a complete first draft. Assume a sophisticated reader who will call out vague claims. Be specific, punchy, and concrete. Flag the two spots in the draft where my argument is weakest.
```

---

### `builder_understand_idea`
**Triggers when:** Q1 = builder, Q2 = understand, Q3 = any *(fallback for builder_understand_\*)*

**Raw template:**
```
I'm building [describe your idea in 2–3 sentences].

I want you to pressure-test this with me. Be a demanding investor or skeptical first customer — not a cheerleader.

Tell me:
1. What problem this actually solves and whether the pain is real
2. Who pays for it and what the realistic business model is
3. The top 3 failure modes — be specific, not generic
4. What a 10x better version of this looks like
5. The one question I'm avoiding that I most need to answer

Then ask me the hardest follow-up question you have.
```

---

### `professional_automate_working`
**Triggers when:** Q1 = professional, Q2 = automate, Q3 = working

**Raw template:**
```
I'm a [your role] and I do the following task manually [every day / every week / ad hoc]:

[Describe the task: what triggers it, what inputs you start with, what steps you follow, what the output looks like]

Build me a complete automation for this. I want:
• A working Python script (or the right tool if Python isn't the best fit), with comments
• Step-by-step install instructions — assume I haven't set up a Python environment before
• A plain-English explanation of how it works so I can maintain it
• What to do if it breaks

I want to run this by end of today.
```

**Rendered example** (user clicked "Software Engineer / Developer"):
```
I'm a Software Engineer / Developer and I do the following task manually [every day / every week / ad hoc]:

[Describe the task: what triggers it, what inputs you start with, what steps you follow, what the output looks like]
...
```

---

### `professional_automate_prompt`
**Triggers when:** Q1 = professional, Q2 = automate, Q3 = prompt

**Raw template:**
```
I'm a [your role] and I need a reusable Bob prompt I can use every [daily / weekly / per project] for the following task:
[Describe the task — e.g., 'summarize a meeting transcript into action items', 'turn raw notes into a status report', 'review code for security issues']

The prompt should:
• Be self-contained — I should be able to paste it fresh each time with minimal setup
• Produce [describe the exact output format you want]
• Handle variations in the input without breaking

Write the prompt, then run it on a realistic example so I can see exactly what I'll get.
```

---

### `professional_analyze_working`
**Triggers when:** Q1 = professional, Q2 = analyze, Q3 = working

**Raw template:**
```
I'm a [your role] and I have the following to analyze:
[Paste or describe the data, document, or codebase — be specific: 'a 30-row CSV of support tickets', 'a contract with unclear SLA terms', 'a PR with 400 lines changed']

Analyze this and give me:
1. The 5 most actionable findings specific to my role — not a generic summary
2. Anything that looks like a risk, a bug, or a blocker
3. The one thing I should fix or act on first, and why
4. Two follow-up questions worth digging into

Assume I'll share this with my team, so make it clear and structured.
```

**Rendered example** (user clicked "Data Scientist / AI Specialist"):
```
I'm a Data Scientist / AI Specialist and I have the following to analyze:
[Paste or describe the data, document, or codebase — be specific: 'a 30-row CSV of support tickets', 'a contract with unclear SLA terms', 'a PR with 400 lines changed']
...
```

---

### `professional_create_working`
**Triggers when:** Q1 = professional, Q2 = create, Q3 = working *(or fallback for professional_create_\*)*

**Raw template:**
```
I'm a [your role] and I need to write [describe the document — a technical spec, incident report, proposal, email, presentation, runbook].

Audience: [who will read this — your team, your manager, a customer, a cross-functional group]
Goal: [what decision or action should this produce?]
Raw material: [paste your notes, bullet points, or previous draft here]

Write a complete, polished first draft — not an outline. Match the tone and level of detail appropriate for the audience. Flag the two weakest parts of the argument so I can strengthen them.
```

---

### `professional_analyze_idea`
**Triggers when:** Q1 = professional, Q2 = understand, Q3 = any *(fallback for professional_understand_\*)*

**Raw template:**
```
I'm a [your role] and I want to understand where AI — specifically Bob — can save me the most time in my day-to-day work.

Don't give me a generic AI overview. Be specific to my role.

Walk me through:
1. The 5 tasks in a typical [your role]'s week where AI creates the most leverage
2. For each: what the before/after looks like, the exact type of prompt that works, and realistic time savings
3. The one I should try first today — and the exact first prompt to send

Then ask me what my single biggest time drain is and help me attack it right now.
```

> Note: `[your role]` appears twice in this template — both instances are substituted with `quizLabels.dq1`.

---

### `explorer_understand_idea`
**Triggers when:** Q1 = explorer, Q2 = understand, Q3 = idea — also the **global fallback** when no key matches

**Raw template:**
```
I'm fairly new to AI and I want to understand what Bob can actually do — not in theory, but for someone like me.

I work in / am studying [your field or role].

Give me:
1. Five specific, concrete examples of how someone in my position uses AI right now to save time or do better work — no fluff, real use cases
2. For each: a one-sentence description of what you'd type into Bob and what you'd get back
3. The easiest one to try in the next 10 minutes — walk me through it step by step

After you show me the first one, ask me what I actually want to accomplish today and let's work on that together.
```

> Note: `[your field or role]` is NOT currently substituted — this is a known gap. The `[your role]` regex only matches exact text `[your role]`, not `[your field or role]`.

---

### `explorer_automate_working`
**Triggers when:** Q1 = explorer, Q2 = automate, Q3 = working *(or fallback for explorer_automate_\*)*

**Raw template:**
```
I'm [describe yourself — a student, someone new to tech, someone who doesn't code] and I want to automate something I do repeatedly:

[Describe the task as plainly as possible — what you do, how often, what takes the most time]

Help me figure out the best way to automate this — you pick the right approach for my skill level. Walk me through it step by step, explain every decision, and check in before moving to the next step. I want to understand what we're building, not just copy-paste it.
```

**Rendered example** (user clicked "Student, Recruiter, HR, or just curious"):
```
I'm Student, Recruiter, HR, or just curious and I want to automate something I do repeatedly:

[Describe the task as plainly as possible — what you do, how often, what takes the most time]
...
```

> The `[describe yourself — ...]` pattern is substituted with `quizLabels.dq1` via the regex `\[describe yourself.*?\]`.

---

### `explorer_analyze_working`
**Triggers when:** Q1 = explorer, Q2 = analyze, Q3 = working *(or fallback for explorer_analyze_\*)*

**Raw template:**
```
I'm [describe yourself] and I have something I need help understanding:

[Paste the document, data, or problem — or describe it in plain English]

Explain what's going on in plain language. Tell me:
• What the most important thing in here is
• What I should do with this information
• What questions I should be asking that I'm probably not

Don't assume I have a technical background. Check in with me as you go.
```

---

### `explorer_create_working`
**Triggers when:** Q1 = explorer, Q2 = create, Q3 = working *(or fallback for explorer_create_\*)*

**Raw template:**
```
I'm [describe yourself] and I need to write [describe what you need — an email, a cover letter, a short report, a social post, a summary].

Here's the context:
• Who it's for: [describe the reader]
• What I want them to do or think after reading it: [describe the outcome]
• What I have so far: [paste your notes, bullet points, or a rough draft]

Write a complete first draft for me. Then explain the two most important choices you made so I can learn from them.
```

---

### `explorer_understand_prompt`
**Triggers when:** Q1 = explorer, Q2 = understand, Q3 = prompt *(or fallback for explorer_understand_\*)*

**Raw template:**
```
I'm [describe yourself — your role, how long you've been using AI, what you've tried] and I want to get much better at using Bob.

My goal is to [describe what you want to accomplish — 'save time on X', 'write better', 'learn how to code', 'analyze my data'].

Start by asking me three questions to understand how I work and what I actually need. Then give me a custom game plan — the specific types of prompts I should be using, how to structure them, and the one habit that will make the biggest difference in how I use Bob from today forward.
```

---

## Coverage Matrix

| Q1 value | Q2 value | Q3 value | Key used |
|---|---|---|---|
| `exec` | `automate` | `working` | `exec_automate_working` |
| `exec` | `automate` | `prompt` | `exec_automate_prompt` |
| `exec` | `automate` | `understanding` / `idea` | `exec_automate_working` *(fallback)* |
| `exec` | `analyze` | any | `exec_analyze_working` *(fallback)* |
| `exec` | `create` | any | `exec_create_working` *(fallback)* |
| `exec` | `understand` | any | `exec_understand_idea` *(fallback)* |
| `builder` | `automate` | any | `builder_automate_working` *(fallback)* |
| `builder` | `analyze` | any | `builder_analyze_working` *(fallback)* |
| `builder` | `create` | any | `builder_create_working` *(fallback)* |
| `builder` | `understand` | any | `builder_understand_idea` *(fallback)* |
| `professional` | `automate` | `working` | `professional_automate_working` |
| `professional` | `automate` | `prompt` | `professional_automate_prompt` |
| `professional` | `automate` | `understanding` / `idea` | `professional_automate_working` *(fallback)* |
| `professional` | `analyze` | any | `professional_analyze_working` *(fallback)* |
| `professional` | `create` | any | `professional_create_working` *(fallback)* |
| `professional` | `understand` | any | `professional_analyze_idea` *(fallback)* |
| `explorer` | `automate` | any | `explorer_automate_working` *(fallback)* |
| `explorer` | `analyze` | any | `explorer_analyze_working` *(fallback)* |
| `explorer` | `create` | any | `explorer_create_working` *(fallback)* |
| `explorer` | `understand` | `idea` | `explorer_understand_idea` |
| `explorer` | `understand` | `prompt` | `explorer_understand_prompt` |
| `explorer` | `understand` | `working` / `understanding` | `explorer_understand_idea` *(fallback)* |
| *(no match)* | — | — | `explorer_understand_idea` *(global fallback)* |

---

## Known Gaps

1. **`[your field or role]`** in `explorer_understand_idea` is not substituted — the regex only matches `[your role]` and `[your title]` exactly.
2. **Multiple Q1 options → same `data-v`** — e.g. "Product Manager" and "Software Engineer" both produce `professional`, so the prompt can't distinguish between them beyond the display label substitution.
3. **No `professional_analyze_idea` key exists** — the `professional + understand` branch falls through to `professional_analyze_idea` (which covers the understand goal), but the key name is slightly misleading.
