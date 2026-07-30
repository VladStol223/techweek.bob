# ATL Tech Week Bob — GitHub Pages Merge Plan

## Top-Level Overview

**Goal:** Merge the `atl-tech-week-bob-choose-your-ai-adventure.html` content into `index.html` (the authoritative file) so that `index.html` becomes the final Atlanta Tech Week GitHub Pages demo. The ATL file remains untouched.

**Scope:**
- Replace hero section + branding with ATL Tech Week version (badge, persona strip, CTA copy)
- Re-order and replace the four track cards in `index.html` to match the new assignment:
  - **Track A** → Engineering Audit Skill (from ATL Track B)
  - **Track B** → LeanTime placeholder (new card, TBD content)
  - **Track C** → Guided Learning Modes (from ATL Track A)
  - **Track D** → Bring Your Own — keep structure but replace quiz questions + prompts for ATL Tech Week audience
- Update the Google Analytics `trackNames` map to reflect new track titles
- Add the persona pill strip CSS + HTML from the ATL file
- Replace Track D quiz with ATL version (role-based questions + 13-prompt template library tailored to ATL Tech Week attendees)
- Keep all existing JS infrastructure in `index.html` intact (GA `G-GSNL2N0DW9`, copy buttons, step unlock system, modal)
- The ATL file is read-only; all edits go to `index.html` only

**Non-goals:**
- Porting the Asset Library drawer (only in ATL file; not in scope)
- Rebuilding from scratch — reuse index.html's animation/JS/CSS foundation
- Any changes to the ATL file

---

## Sub-Tasks

---

### Sub-Task 1 — Replace Hero Section & Branding

**Intent:** Swap the "Winn Dixie Bobathon 2026" hero for the ATL Tech Week hero so the page is correctly branded for the GitHub Pages audience.

**Expected Outcomes:**
- Hero badge reads "Atlanta Tech Week · IBM Bob Demo"
- Hero h1 reads "What Could AI Do For You?" (same wording, different brand)
- Hero subtitle is the ATL version: "Four tracks for every background — developers, founders, learners, executives..."
- CTA button reads "Pick Your Track" (not "Explore the Tracks")
- "New to Bob?" secondary CTA is removed from the hero (it's a Winn-Dixie onboarding artifact)

**Todo List:**
1. Read the hero HTML block in `index.html` (lines ~70–205) to locate exact bounds
2. Read the hero HTML block in `atl-tech-week-bob-choose-your-ai-adventure.html` (lines 442–460)
3. Replace the `<section class="hero">` block in `index.html` with the ATL version
4. Verify the `hero-cta-btn` click handler in JS still works (scrolls to `#tracks-section`)

**Relevant Context:**
- ATL hero HTML: `atl-tech-week-bob-choose-your-ai-adventure.html` lines 442–460
- index.html hero: search for `<section class="hero">`
- GA event `hero_cta_click` fires on `#hero-cta-btn` click — must keep that ID

**Status:** [x] done

---

### Sub-Task 2 — Add Persona Pill Strip CSS + HTML

**Intent:** Add the persona strip (10 audience pills) that appears below the hero in the ATL file. It is absent from index.html and signals the broad audience for the ATL Tech Week event.

**Expected Outcomes:**
- After the `</section>` closing tag for the hero, the persona strip `<div class="persona-strip">` appears with all 10 pills
- `.persona-strip` and `.persona-pill` CSS rules exist in the `<style>` block

**Todo List:**
1. Copy `.persona-strip` and `.persona-pill` CSS from ATL file (lines 125–139) into index.html's `<style>` block
2. Insert the persona strip HTML from ATL file (lines 462–474) into index.html after the hero section

**Relevant Context:**
- ATL CSS: `atl-tech-week-bob-choose-your-ai-adventure.html` lines 125–139
- ATL HTML: `atl-tech-week-bob-choose-your-ai-adventure.html` lines 462–474

**Status:** [x] done

---

### Sub-Task 3 — Replace Track A Card (Engineering Audit Skill)

**Intent:** Track A must become the Instant Engineering Audit Skill, currently Track B in the ATL file. The existing Track A in index.html (Supply Chain Dashboard) is replaced.

**Expected Outcomes:**
- `#card-a` in index.html contains the Engineering Audit Skill content (card summary + full detail from ATL Track B)
- Card class remains `bubble-card track-a` (purple color coding)
- Card label still reads "Track A"
- The JS `trackNames` map updated: `'card-a': 'EngineeringAudit'`

**Todo List:**
1. Read ATL Track B card (lines 664–908 in ATL file) — full HTML block
2. Read Track A card in index.html to find exact bounds
3. Replace `#card-a` inner content (card-summary + card-detail) with ATL Track B content
4. Update card-label text to "Track A" and verify track-a CSS class is preserved
5. Update the GA `trackNames` entry for `card-a` in the JS

**Relevant Context:**
- ATL Track B: `atl-tech-week-bob-choose-your-ai-adventure.html` lines 664–908
- index.html Track A: `#card-a`, search `id="card-a"`
- GA map is at `index.html` line 1924

**Status:** [x] done

---

### Sub-Task 4 — Replace Track B Card (LeanTime Placeholder)

**Intent:** Track B is TBD — replace the existing Track B (Diagnose & Debug) card with a placeholder card referencing LeanTime (https://github.com/leantime).

**Expected Outcomes:**
- `#card-b` contains a placeholder card with:
  - Title: "LeanTime — Coming Soon"
  - Description explaining this track uses the LeanTime open-source project management repo
  - Link to https://github.com/leantime
  - A clear "Content Coming Soon" notice inside the detail panel
- Card class remains `bubble-card track-b`
- Card label reads "Track B"
- GA `trackNames` updated: `'card-b': 'LeanTime'`

**Todo List:**
1. Read Track B card in index.html to find exact bounds
2. Replace `#card-b` inner content with a new placeholder card
3. Update the GA `trackNames` entry for `card-b` in the JS

**Relevant Context:**
- index.html Track B: `#card-b`, search `id="card-b"`
- Keep the `bubble-card track-b` class intact so blue color-coding applies

**Status:** [x] done

---

### Sub-Task 5 — Replace Track C Card (Guided Learning Modes)

**Intent:** Track C must become Guided Learning Modes, currently Track A in the ATL file. The existing Track C in index.html (Entrepreneur Research) is replaced.

**Expected Outcomes:**
- `#card-c` in index.html contains the Guided Learning Modes content (QisBob, PyBob, SqlBob, Jenny) from ATL Track A
- Card class remains `bubble-card track-c` (green color coding)
- Card label reads "Track C"
- GA `trackNames` updated: `'card-c': 'GuidedLearning'`

**Todo List:**
1. Read ATL Track A card (lines 491–657 in ATL file) — full HTML block
2. Read Track C card in index.html to find exact bounds
3. Replace `#card-c` inner content with ATL Track A content
4. Update card-label text to "Track C" and verify track-c CSS class is preserved
5. Update the GA `trackNames` entry for `card-c` in the JS

**Relevant Context:**
- ATL Track A: `atl-tech-week-bob-choose-your-ai-adventure.html` lines 491–657
- index.html Track C: `#card-c`, search `id="card-c"`

**Status:** [x] done

---

### Sub-Task 6 — Update Track D: Quiz, Prompts & Footer

**Intent:** Replace the Winn-Dixie–themed quiz questions and prompt templates in Track D with ATL Tech Week versions. The new Q1 reflects the actual ATL audience breakdown (Software Engineers 41%, PMs 11%, Data Scientists 8%, Designers 7%, Security 7%, Dev Advocates 6%, QA 5%, Recruiters 4%, Students 4%, Executives 3%, Support 3%, HR 1%). The prompt library is the role-based 13-template set from the ATL file. Also update the footer and GA tracking map.

**Expected Outcomes:**
- Q1 options map 12 attendee types into 4 ATL `data-v` groups:
  - `professional` → "Software Engineer / Developer" (41%), "Product or Project Manager" (11%), "Data Scientist / AI Specialist" (8%), "DevOps, Security, QA or Support" (15%)
  - `exec` → "Executive or Strategic Leader" (3%)
  - `builder` → "Designer, Developer Advocate, or creative builder" (13%)
  - `explorer` → "Student, Recruiter, HR, or just curious" (8%)
- Q2 options (unchanged from ATL): Automate / Analyze / Create / Understand
- Q3 options (unchanged from ATL): Something working / A reusable prompt / A clear mental model / One specific idea
- The 13-prompt `prompts{}` library from ATL is used verbatim (no Winn-Dixie references)
- `getPromptKey()` fallback logic preserved
- "Generate My Bob Prompt" reveal handler uses ATL structure
- `detail-intro` references ATL Tech Week, not Winn Dixie
- `card-starting-prompt` uses the ATL "No Quiz? Start Here" fallback prompt
- Footer: "Made with IBM Bob · Atlanta Tech Week 2025 · IBM"
- GA `trackNames` map: `{ 'card-a': 'EngineeringAudit', 'card-b': 'LeanTime', 'card-c': 'GuidedLearning', 'card-d': 'BringYourOwn' }`
- `copyTotals` updated for new Track A and C copy button counts

**Todo List:**
1. Read Track D HTML block in index.html (lines 1739–1806) for exact bounds
2. Replace Q1 options with 4 ATL-audience-mapped options (data-v: professional, exec, builder, explorer)
3. Replace Q2 and Q3 options with ATL versions
4. Update `detail-intro` and `card-starting-prompt` text
5. Replace the entire quiz JS block (lines ~2174–2257) with ATL's `prompts{}` + `getPromptKey()` + reveal handler (adding `gtag` quiz_answer + quiz_complete events back in)
6. Update footer text
7. Update GA `trackNames` at line ~1924
8. Update `copyTotals` at lines ~2075–2077 to match actual copy button counts in new Track A + C

**Relevant Context:**
- index.html Track D: lines 1739–1806
- index.html quiz JS: lines 2174–2257
- index.html `trackNames`: line 1924, `copyTotals`: lines 2075–2077
- ATL `prompts{}` + `getPromptKey()`: `atl-tech-week-bob-choose-your-ai-adventure.html` lines 1339–1407

**Status:** [x] done

---

### Sub-Task 7 — Final Verification

**Intent:** Confirm the page is complete, well-formed HTML, Google Analytics is in place, and the GitHub Pages structure is correct.

**Expected Outcomes:**
- HTML is valid (no unclosed tags from transplanted content)
- GA tag `G-GSNL2N0DW9` is present in `<head>`
- All 4 track cards render with correct class + id
- The `atl-tech-week-bob-choose-your-ai-adventure.html` file is untouched (diff = no changes)
- A `README.md` noting the GitHub repo (https://github.com/VladStol223/techweek.bob.git) and the live URL pattern is present (optional but useful)

**Todo List:**
1. Read `index.html` `<head>` section to confirm GA tag is still present
2. Grep for all 4 card IDs (`card-a`, `card-b`, `card-c`, `card-d`) and confirm each appears exactly once
3. Grep for unclosed `<div` imbalances as a quick sanity check
4. Confirm `atl-tech-week-bob-choose-your-ai-adventure.html` has not been modified

**Status:** [x] done
