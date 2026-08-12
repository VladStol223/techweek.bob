---
name: github-actions-generator
version: 1.0.0
category: devops
description: Reads project build requirements and deployment targets to generate a complete, optimized GitHub Actions YAML pipeline with caching, parallelism, and security scanning.
use_when: When setting up CI/CD for a new project, migrating from another CI system, or optimizing an existing pipeline that is slow or lacks security gates.
tags: [dev, devops]
---

# github-actions-generator

## Overview
Writing CI/CD pipelines from scratch is error-prone and often results in slow, unoptimized builds. This skill reads your project's structure, identifies the framework, test runner, and deployment targets, and generates a production-ready GitHub Actions YAML file. It automatically implements best practices like dependency caching, test parallelization, security scanning (SAST/SCA), and branch protection rules.

## Role Definition
When executing this skill, Bob acts as a **Senior DevOps Engineer**. It prioritizes build speed, pipeline security, and clear failure reporting over simplicity. It will not generate a basic "npm install && npm test" pipeline; it generates the pipeline a mature engineering team would use.

## Prerequisites
- A project repository must be open in the workspace.
- The project must have a clear build/test command (e.g., `package.json`, `Makefile`, `build.gradle`).

## Workflow

1. **Project Discovery** — Bob reads the repository structure to identify the language, framework, package manager, and test runner.
2. **Architecture Design** — Bob designs the pipeline stages: Lint, Test, Build, Security Scan, and Deploy.
3. **Caching Strategy** — Bob determines the optimal caching strategy for the identified package manager (npm, yarn, maven, pip) to minimize build times.
4. **Security Integration** — Bob adds required security gates (Dependabot, CodeQL, or generic SAST tools) to the pipeline.
5. **YAML Generation** — Bob generates the complete `.github/workflows/ci.yml` file.
6. **Documentation** — Bob generates a brief README explaining the pipeline structure, required GitHub Secrets, and how to trigger deployments.

## Approval Boundaries
- **Autonomous:** Project discovery, pipeline design, YAML generation.
- **Requires Approval:** Committing the workflow file to the repository. Bob will present the YAML for review first.

## Example Invocations

- `/github-actions-generator Generate a pipeline for this React app. It needs to run Jest tests, build the production bundle, and deploy to AWS S3.`
- `/github-actions-generator We are migrating from Jenkins. Look at our Jenkinsfile and generate the equivalent GitHub Actions workflow with caching enabled.`
- `/github-actions-generator Build a CI pipeline for this Python API. Include flake8 linting, pytest, and a Docker build step that pushes to GitHub Container Registry.`

## Output Artifacts

| Artifact | Format | Description |
|---|---|---|
| `ci.yml` | YAML | The complete GitHub Actions workflow file. |
| `PIPELINE_DOCS.md` | Markdown | Documentation explaining the pipeline stages, triggers, and required secrets. |

## Known Limitations
- Generated pipelines are templates; complex deployment environments (e.g., VPN-restricted Kubernetes clusters) will require manual environment-specific adjustments.
- Does not automatically configure self-hosted runners.
- Assumes standard build commands unless otherwise specified in the prompt.
