# API Reference

FastAPI exposes full OpenAPI docs at `/docs`.

## Workflow Endpoints

- `POST /upload`: Upload one or more evidence files and receive normalized `IngestedDocument` records.
- `POST /analyze`: Produce a full explainable `DecisionReport` from documents and a task.
- `POST /recommend`: Produce only recommendations for a request.
- `POST /review`: Record a human review decision and update report review status.
- `GET /report/{id}`: Fetch one decision report.
- `GET /reports`: List reports currently held by the backend runtime.

## Governance And Learning

- `POST /memory/approve`: Store approval feedback.
- `POST /memory/reject`: Store rejection feedback.
- `POST /memory/override`: Store override feedback.
- `GET /memory`: List memory records.
- `GET /audit`: List hash-linked audit events.
- `GET /metrics`: Return platform runtime metrics.
- `GET /domains`: Return the loaded ontology catalog.

## Review Decisions

Supported review decisions are `approve`, `reject`, `override`, `delegate`, `escalate`, and `request_information`.
