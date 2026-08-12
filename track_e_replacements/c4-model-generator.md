---
name: c4-model-generator
version: 1.0.0
category: docs
description: Analyzes codebase dependencies, service interactions, and infrastructure configurations to generate all four levels of the C4 architecture model as Mermaid diagrams.
use_when: When documenting system architecture, preparing for an architecture review, or onboarding engineers to a complex, undocumented system.
tags: [dev, devops, exec]
---

# c4-model-generator

## Overview
Understanding a complex system from source code alone is difficult. This skill reads a repository and automatically generates a complete C4 Architecture Model (Context, Container, Component, and Code levels). It outputs the diagrams in Mermaid format, allowing them to be rendered natively in GitHub, GitLab, or any Markdown viewer, providing immediate visual clarity to developers and stakeholders.

## Role Definition
When executing this skill, Bob acts as an **Enterprise Software Architect**. It focuses on identifying boundaries, data flows, and structural dependencies, ignoring implementation details in favor of high-level system understanding.

## Prerequisites
- A project repository must be open in the workspace.
- The repository should contain configuration files (e.g., `docker-compose.yml`, `package.json`, `pom.xml`) that indicate external dependencies.

## Workflow

1. **System Boundary Analysis** — Bob scans the repository to identify the core system, its users, and any external systems it interacts with (APIs, databases, third-party services).
2. **Context Diagram (Level 1)** — Bob generates the System Context diagram showing the big picture.
3. **Container Diagram (Level 2)** — Bob identifies the deployable units (web apps, APIs, databases) and generates the Container diagram showing their interactions.
4. **Component Diagram (Level 3)** — Bob analyzes the internal structure of the primary application and generates the Component diagram showing major modules/controllers.
5. **Code Diagram (Level 4)** — (Optional/Targeted) Bob generates a class or entity diagram for the most complex domain model in the codebase.
6. **Markdown Assembly** — Bob compiles all diagrams into a single `ARCHITECTURE.md` file with explanatory text.

## Approval Boundaries
- **Autonomous:** Repository scanning, dependency identification, Mermaid code generation, Markdown assembly.
- **Requires Approval:** Bob will ask for clarification if external systems are referenced in code but their purpose is ambiguous.

## Example Invocations

- `/c4-model-generator Generate a complete C4 model for this repository. Save the output to docs/ARCHITECTURE.md.`
- `/c4-model-generator We are preparing for an architecture review. Analyze this microservice and generate the Context and Container diagrams showing how it fits into the broader system.`
- `/c4-model-generator Map out the internal components of the /src/billing directory and generate a Level 3 Component diagram.`

## Output Artifacts

| Artifact | Format | Description |
|---|---|---|
| `ARCHITECTURE.md` | Markdown | A comprehensive document containing all generated C4 Mermaid diagrams and explanatory text. |

## Known Limitations
- Diagrams are inferred from static analysis; runtime dependencies or dynamically loaded modules may not be captured.
- External system details (e.g., the specific name of a third-party API) may require manual refinement if not clearly defined in the code.
- Level 4 (Code) diagrams can become overly complex in large codebases and are best targeted at specific modules.
