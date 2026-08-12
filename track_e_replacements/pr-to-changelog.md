---
name: pr-to-changelog
version: 1.0.0
category: docs
description: Reads a batch of merged pull requests and generates polished, customer-facing release notes and a developer-facing changelog in Keep a Changelog format.
use_when: When preparing a software release, when release notes need to be written from PR history, or when maintaining a public changelog.
tags: [dev, pm]
---

# pr-to-changelog

## Overview
Writing release notes manually from a list of Git commits or PR titles is tedious and often results in notes that are either too technical for users or too vague for developers. This skill automates the process by reading the actual content of merged Pull Requests, categorizing the changes, and generating both a polished, customer-facing release announcement and a strict, developer-facing `CHANGELOG.md` update.

## Role Definition
When executing this skill, Bob acts as a **Release Manager / Product Marketer**. It knows how to translate technical implementation details ("Refactored auth middleware") into user value ("Improved login reliability").

## Prerequisites
- A list of merged Pull Requests (either provided as text, or accessible via MCP connection to GitHub/GitLab).
- The repository should ideally use semantic PR titles or labels (e.g., `feat:`, `fix:`, `chore:`), though Bob can infer categories from the descriptions.

## Workflow

1. **PR Ingestion** — Bob reads the titles, descriptions, and labels of the provided Pull Requests.
2. **Change Classification** — Bob categorizes each PR into standard buckets: Added, Changed, Deprecated, Removed, Fixed, Security.
3. **Developer Changelog Generation** — Bob generates the markdown for the `CHANGELOG.md` file, strictly adhering to the "Keep a Changelog" format.
4. **Customer Release Notes Drafting** — Bob synthesizes the changes into a narrative release announcement, highlighting the most significant user-facing features and burying internal chores.
5. **Breaking Change Highlighting** — Bob explicitly flags any breaking changes and generates migration instructions if applicable.

## Approval Boundaries
- **Autonomous:** PR reading, classification, changelog generation, release note drafting.
- **Requires Approval:** Bob will not automatically commit the `CHANGELOG.md` update or publish the release notes without user review.

## Example Invocations

- `/pr-to-changelog Generate release notes for v2.4.0 from these 23 merged PRs [paste PR list]. Write customer-facing release notes and update CHANGELOG.md in Keep a Changelog format.`
- `/pr-to-changelog Read the merged PRs since the last release tag. Draft a Slack announcement for the #engineering channel and a separate email for our beta customers.`
- `/pr-to-changelog Summarize these 5 PRs into a single bullet point for the executive update.`

## Output Artifacts

| Artifact | Format | Description |
|---|---|---|
| `CHANGELOG_UPDATE.md` | Markdown | The exact text to prepend to the project's `CHANGELOG.md`. |
| `RELEASE_NOTES.md` | Markdown | Polished, narrative release notes suitable for a blog post, email, or Slack announcement. |

## Known Limitations
- Quality of the output is heavily dependent on the quality of the PR descriptions. If a PR simply says "Fixed it", Bob will struggle to explain *what* was fixed.
- Does not automatically determine semantic version bumps (Major/Minor/Patch) unless explicitly asked to analyze the breaking changes.
