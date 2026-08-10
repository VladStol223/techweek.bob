# IBM Bob Badge Issuer Extension

A VS Code extension that installs the **IBM Bob Badge Issuer** mode into a workspace, enabling participants to earn IBM Bob event badges at the end of a bobathon or learning session.

## What it does

- Adds the **Badge Issuer Lite** mode to `.bob/` — participants switch to this mode at the end of a session to evaluate their work and request a badge
- Adds the **Badge Issuer Test** mode — for pipeline testing without full evaluation
- Installs the `bob-badge` MCP server — handles badge submission to the IBM badge issuer service without exposing credentials to the participant
- Copies `BADGE_GUIDE.md` to the workspace root — participant-facing instructions

## Usage

### For lab instructors

1. Open your lab repo in VS Code with IBM Bob
2. Open the **IBM Bob Badge Issuer** sidebar (badge icon in the activity bar)
3. Click **Install** — this adds the mode, skill, MCP server, and guide to `.bob/`
4. Commit and push the `.bob/` folder so participants get it when they clone

### For participants

1. Clone the lab repo
2. Switch to **🏅 Badge Issuer Lite** mode in IBM Bob
3. At the end of your session, ask Bob to evaluate your work for a badge
4. Bob will ask for your event slug, evaluate your work against the badge criteria, and submit a request to the admin review queue
5. Once approved, Credly will send a notification to your registered email to claim your badge

## Modes installed

| Mode | Purpose |
|---|---|
| 🏅 Badge Issuer Lite | Full evaluation flow — criteria check, evidence review, badge submission |
| 🧪 Badge Issuer Test | Pipeline testing — skips evaluation, submits directly to the review queue |

## Requirements

- [IBM Bob](https://marketplace.visualstudio.com/items?itemName=ibm.bob) VS Code extension
- Python 3 (for the badge submission script)
- Node.js (for the MCP server)
- A workspace folder open in VS Code
