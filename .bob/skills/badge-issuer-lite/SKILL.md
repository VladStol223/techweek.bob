---
name: badge-issuer-lite
description: Use when the user asks to earn a badge, issue a badge, get a certificate, check badge eligibility, or complete a bobathon. Fetches the badge catalogue from the issuer service, evaluates the conversation natively, submits to the issuer service, and generates a certificate — no Node.js or external Python packages required (uses curl via bob_badge.py).
---

# IBM Bob Badge Issuer Lite

Use this skill to issue IBM Bob event badges at the end of a bobathon or learning session.
The flow is **privacy-first, then criteria-first**: Bob presents the IBM Privacy Statement and
obtains explicit acknowledgement before proceeding, then fetches the live badge catalogue from
the issuer service, evaluates the conversation thread against each criterion using its own
reasoning, and only then submits to the issuer service.

All network calls are made through the bundled `bob_badge.py` script, which uses `curl` —
available by default on macOS, Linux, and Windows 10+ (1803+). No Node.js, no pip packages,
no venv required.

## Python interpreter

`bob_badge.py` requires only the Python standard library. Before invoking it, determine the
correct Python executable for the user's machine:

- **macOS / Linux:** use `python3`
- **Windows:** try `python3` first; if that fails with "not found", use `python` instead

You can test with:
```
python3 .bob/skills/badge-issuer-lite/bob_badge.py --version
```
If that fails on Windows, retry with `python` in place of `python3`. Use whichever succeeds
for all subsequent commands in this session.

## Supporting files

| File | Purpose |
|---|---|
| [`.bob/skills/badge-issuer-lite/bob_badge.py`](.bob/skills/badge-issuer-lite/bob_badge.py) | curl-based HTTP calls + HTML certificate generation |
| [`badge-issuer/.env.badge-issuer`](badge-issuer/.env.badge-issuer) | Issuer service URL and API key |
| [`badge-issuer-output/`](badge-issuer-output/) | Generated HTML certificate files |

### Issuer service credentials

`bob_badge.py` loads credentials from `badge-issuer/.env.badge-issuer` automatically:

```ini
ISSUER_SERVICE_URL=https://badge-issuer.ce.techzone.ibm.com/
ISSUER_SERVICE_API_KEY=<your-api-key>
```

The Credly token never reaches the participant — the issuer service holds it server-side.

---

## Protocol

Follow these steps in order. Present results to the user before proceeding.

---

### Step 1 — Present the IBM Privacy Statement

**This step is mandatory and must not be skipped under any circumstances.**

Before doing anything else — before asking for an event slug, before loading the catalogue,
before any evaluation — present the following notice to the user verbatim:

---

> **Privacy Notice**
>
> NOTICE: IBM leverages the services of Credly, a 3rd party data processor authorized by IBM
> and located in the United States, to assist in the administration of the IBM Digital Badge
> program. In order to issue you an IBM Digital Badge, your personal information (name, email
> address, and badge earned) will be shared with Credly. You will receive an email notification
> from Credly with instructions for claiming the badge. Your personal information is used to
> issue your badge and for program reporting and operational purposes. IBM may share the personal
> information collected with IBM subsidiaries and third parties globally. It will be handled in a
> manner consistent with IBM privacy practices. The IBM Privacy Statement can be viewed here:
> https://www.ibm.com/privacy/us/en/. IBM employees can view the IBM Internal Privacy Statement
> here: https://w3.ibm.com/w3publisher/w3-privacy-notice.
>
> **Do you acknowledge and agree to the above? (yes / no)**

Wait for an explicit acknowledgement. If the user responds with anything other than a clear
affirmative ("yes", "I agree", "I acknowledge", "ok", "sure", etc.), **do not proceed**. Politely
explain that acknowledgement is required to issue an IBM Digital Badge and offer to stop or try
again later.

Only after explicit acknowledgement, continue to Step 2.

---

### Step 2 — Identify intent

Determine what the user wants:

- **A) Earn a badge** — evaluate and issue
- **B) Check eligibility only** — evaluate but don't issue
- **C) Certificate only** — they already have a badge, need a certificate file
- **D) Check what badges are available** — list active badges and their criteria

For intent **C**, ask for: name, email, badge name, issued date, verification code, Credly URL. Skip to **Step 10**.
For intent **D**, run Step 3 then present the active badges and stop.
For **A** or **B**, continue to Step 3.

---

### Step 3 — Ask for event slug

Ask the user:

> "What is the event slug for this session? (e.g. `ibm_bob_bobathon`)"

Store it — you will use it in every subsequent step.

---

### Step 4 — Fetch the live badge catalogue

Run:

```
python3 .bob/skills/badge-issuer-lite/bob_badge.py get-catalogue \
  --event-slug "<event_slug>" \
  --json
```

Parse the JSON response. Show the active badges returned:

> "The following badge(s) are available for this event:
> - **{badge_name}** (`{badge_id}`) — {description}"

If the command fails, tell the user and stop. Do **not** fall back to any local file — the live
service is the only authoritative source of badge criteria.

If only one badge is active, proceed with it automatically.
If more than one is active, ask the user which one they are seeking.

---

### Step 5 — Show the criteria

Before evaluating, tell the user exactly what you'll be checking. Read `required_criteria` from
the catalogue entry for the chosen badge and present them:

> "To earn the **{badge_name}** badge, I'll check that you can demonstrate:
> 1. ✦ **{criterion label}** — {criterion description}
> ...
>
> I'll now review our conversation."

---

### Step 6 — Extract work evidence from the conversation

Review the **entire conversation thread** above this point. Produce a structured summary:

| Field | What to extract |
|---|---|
| Tasks completed | Specific activities that map to the badge criteria |
| Artifacts produced | Code, notebooks, scripts, apps, workflows |
| IBM Bob's role | How Bob was specifically used |
| Problem / use case | What problem was solved, for whom |
| Estimated hours | Based on depth and breadth of work |
| Number of distinct tasks | Count of meaningfully different activities |

Show the summary and invite corrections:

> "Here's what I gathered from our conversation:
> [structured summary]
>
> Does this accurately reflect your work? Add anything I missed, then say 'looks good' to continue."

---

### Step 7 — Evaluate against criteria

Using your LLM reasoning, evaluate each `required_criterion` from the catalogue against the
confirmed summary. For each criterion read its full `description` field — that is the evaluation
guide.

Apply this decision logic:

| Result | Action |
|---|---|
| All criteria met | Proceed to Step 8 |
| One or more unmet, strong overall evidence | Show specifically what's missing; ask user to add detail; re-evaluate once |
| Multiple unmet, weak evidence | Explain clearly which criteria are not met and why; do not proceed |
| Disqualifier triggered | Explain the specific disqualifier |

Present results in natural language — never show raw YAML. Example:

> "Based on our session, you meet the criteria for the **{badge_name}** badge! ✅
>
> - ✓ {criterion label} — {evidence found}
> ..."

If intent is **B**, stop here with the eligibility result.

---

### Step 8 — Confirm recipient details

Before issuing, confirm:
1. **Full name** — check conversation first, then run `git config user.name`
2. **Credly email** — check conversation first, then run `git config user.email`

Always ask explicitly:

> "I'll issue your badge through Credly. The badge is delivered to the email address on your Credly account.
>
> - **Name:** {name}
> - **Email:** {email} *(from git config)*
>
> **Is this your Credly email?** Say 'yes' to confirm or provide the correct one."

Do **not** proceed until both are explicitly confirmed.

---

### Step 9 — Submit to the IBM badge issuer service

Run:

```
python3 .bob/skills/badge-issuer-lite/bob_badge.py submit-for-issuance \
  --badge-id "<badge_id>" \
  --badge-name "<badge_name>" \
  --event-slug "<event_slug>" \
  --name "<recipient_name>" \
  --email "<recipient_email>" \
  --criteria-met "<criterion_id_1>,<criterion_id_2>" \
  --summary "<one sentence evidence summary>" \
  --json
```

Parse the JSON response. On success capture `request_id` and `status`.

On failure, show the `error` field from the JSON response to the user.

---

### Step 10 — Generate certificate and show final summary

Run:

```
python3 .bob/skills/badge-issuer-lite/bob_badge.py generate-certificate \
  --name "<recipient_name>" \
  --email "<recipient_email>" \
  --badge-name "<badge_name>" \
  --issued-at "<YYYY-MM-DD>" \
  --verification-code "<request_id>" \
  --credly-url "<credly_url_if_available>"
```

The command prints the path to the generated HTML certificate file.

Then present the final summary:

> ## ✅ Badge Request Submitted — {badge_name}
>
> **Submitted for:** {name} ({email})
> **Request ID:** `{request_id}`
>
> **Why you qualified:**
> {2–3 sentences of strongest evidence}
>
> Your badge request has been submitted for admin review. Once approved, Credly will send a
> notification to **{email}** to claim your badge.
>
> A certificate has been saved to `badge-issuer-output/`.

---

## Constraints

- **Never** skip the Privacy Statement (Step 1) — it is mandatory before any other action.
- **Never** proceed without explicit user acknowledgement of the Privacy Statement.
- **Never** call the issuer service directly — always use `bob_badge.py`.
- **Never** call Credly directly — the issuer service handles that.
- **Never** issue a badge without explicit confirmation of name and Credly email.
- **Never** skip evaluation — always check every criterion before submitting.
- The live service catalogue is the only authoritative source of badge criteria — **never** read local files for badge or criteria data.
- Do not soften or override criteria.
