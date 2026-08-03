# Track D — Quiz Fixes (Code + Content)

> Companion to the original Quiz Logic Reference. This doc covers (1) bugs/gaps in the current implementation and (2) a content redesign for the questions, answers, and prompt-assembly logic.

---

## Part 1 — Code Fixes

### 1. "a/an" article bug (fix first — it's already visible in the reference doc's own examples)

Current substitution just drops the label into `I'm a [your title]`, which breaks on vowel-starting labels:

> "I'm a Executive or Strategic Leader" ❌

**Fix:** small helper before substitution.

```js
function withArticle(label) {
  const article = /^[aeiou]/i.test(label) ? "an" : "a";
  return `${article} ${label}`;
}
```

Then templates should use a placeholder like `[a/an your title]` that the render step replaces with `withArticle(quizLabels.dq1)` rather than hardcoding "a" in the template text.

### 2. `[your field or role]` not substituted

The regex only matches `[your role]` / `[your title]` exactly. Either:
- Widen the regex: `\[your (?:role|title|field or role)\]`, or
- Just rewrite `explorer_understand_idea`'s template to say `[your role]` instead of `[your field or role]`.

### 3. Naming mismatch: `professional_analyze_idea`

The `professional_understand_*` fallback resolves to a template named `professional_analyze_idea`, which reads like it belongs to the `analyze` branch. Rename to `professional_understand_idea` to match the pattern used everywhere else. Purely cosmetic, but worth doing before this doc/codebase gets handed to anyone else.

### 4. Structural fix — stop hand-writing full templates per branch

This is the fix that actually resolves the content issues in Part 2. Instead of ~20 near-duplicate full-text templates, split rendering into two composable pieces:

```
prompt = opener(Q1) + " " + taskBody(Q2, Q3)
```

- `opener(Q1)` — one sentence, keyed off the new Q1 buckets (see Part 2)
- `taskBody(Q2, Q3)` — the actual instructions, keyed off goal × mode (4 × 3 = 12 bodies)

This removes the current fallback-chain complexity (exact key → role_goal prefix → role prefix → global fallback) entirely — every `(Q1, Q2, Q3)` combination is just a direct assembly, no chain needed, and no combination silently collapses into another.

---

## Part 2 — Content Redesign

### Why: the current Q3 mostly doesn't do anything

Tracing the fallback chain, Q3 only changes the rendered prompt in two cases (`exec`/`professional` × `automate`, and `explorer` × `understand`). Everywhere else, all four Q3 answers fall back to the same template. A user answers a full question and ~80% of the time it has no effect on their output — risky at a live demo if two different picks visibly produce the identical prompt.

### New Q1 — "Which best describes what you do?"

Fixes: the `builder` bucket wrongly assumed every builder/designer/dev-advocate has "my own product/side business," and the `explorer` bucket presumed HR/recruiters are "new to tech."

| Option | Bucket | Opener |
|---|---|---|
| Software Engineer / Developer | `technical` | "I'm a [a/an your title] and I build/maintain things directly." |
| Data Scientist / AI Specialist | `technical` | same |
| DevOps, Security, QA, or Technical Support | `technical` | same |
| Product or Project Manager | `lead` | "I'm a [a/an your title], responsible for [your team / domain]." |
| Executive or Strategic Leader | `lead` | same |
| Designer, Marketer, or Communicator | `communicator` | "In my role as a [your title], I create and communicate [content / campaigns / materials]." |
| Independent builder / side-project creator | `builder` | "I'm working on [my project / product / side business]." |
| Student, Recruiter, HR, or just curious | `new` | "I'm exploring how AI can help with [my work / studies] — keep it simple and check in with me as we go." |

Note: "Designer, Developer Advocate, or creative builder" is split into two real options (`communicator` vs. `builder`) so a Developer Advocate isn't handed a "describe your side business" opener.

### Q2 — unchanged

`automate` / `analyze` / `create` / `understand`. This question already does real differentiating work — no changes needed.

### New Q3 — "How do you want to work with Bob on this?"

Replaces the old "what do you want to walk out with" question, which mostly re-asked Q2 in disguise. This version is orthogonal to Q2, so it matters regardless of which goal was picked.

| Option | Value | Effect on task body |
|---|---|---|
| A finished result I can use right away | `done_for_you` | "Give me the complete output directly — don't ask clarifying questions, just produce it." |
| A reusable prompt I can bring back to my team | `reusable` | "Write this as a reusable prompt template with placeholders, plus one worked example." |
| A step-by-step walkthrough so I really get it | `guided` | "Walk me through this one step at a time, explain your reasoning, and check in before moving on." |

### Coverage: 4 (Q2) × 3 (Q3) = 12 task bodies, every combination genuinely distinct

Role (Q1) only ever swaps the opener sentence — it never determines which task body is used, so nothing silently collapses.

### Worked examples

**Q1 = `technical` (Software Engineer), Q2 = `analyze`, Q3 = `guided`:**
> "I'm a Software Engineer / Developer and I build/maintain things directly. I have the following to analyze: [...]. Walk me through this one step at a time, explain your reasoning, and check in before moving on. Give me the most actionable findings specific to my role — not a generic summary."

**Same Q1/Q2, Q3 = `reusable`:**
> "I'm a Software Engineer / Developer and I build/maintain things directly. I need a reusable prompt for analyzing [...]. Write this as a reusable prompt template with placeholders, plus one worked example."

Two different Q3 picks now visibly produce different prompts every time — closing the gap that made the old Q3 feel decorative.

---

## Still open / not yet drafted

- Full text for all 12 `taskBody(Q2, Q3)` combinations (only 2 sketched above)
- Full opener text for `lead`, `communicator`, `builder`, `new` buckets beyond the one-liners shown
- Whether `communicator` and `lead` need their own task-body variants, or share the `technical` ones with just a different opener