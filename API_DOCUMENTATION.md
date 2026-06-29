# DecisionMesh AI API Documentation

Base URL: `http://localhost:5000/api`

Request context headers:
- `x-tenant-id`: tenant scope, defaults to `default-tenant`
- `x-workspace-id`: workspace scope, defaults to `default-workspace`
- `x-user-id`: actor id for audit and review history, defaults to `system`
- `x-user-role`: one of `admin`, `manager`, `reviewer`, `operator`, `viewer`

## Core Analysis

### `POST /upload/analyze`
Multipart upload fields: `contractFile`, `meetingFile`, `emailFile`.

Runs planner-based orchestration, domain agents, scenario simulation, critique, recommendations, confidence scoring, explanations, memory persistence, and audit logging.

### `POST /orchestrate`
JSON compatibility endpoint.

Body:
```json
{
  "contractText": "...",
  "meetingText": "...",
  "emailText": "..."
}
```

### `GET /latest-analysis`
Returns the most recent generated analysis.

## Human Governance

### `GET /memory`
Searches shared memory.

Query params: `tenantId`, `workspaceId`, `customerId`, `query`, `type`.

### `POST /memory/review-action`
Records immutable reviewer history and writes an audit event.

Body:
```json
{
  "index": 0,
  "recommendation": "Schedule Executive Business Review",
  "action": "approve",
  "comment": "Approved for enterprise account",
  "delegateTo": "",
  "overrideRecommendation": ""
}
```

Supported actions: `approve`, `reject`, `escalate`, `delegate`, `request_information`, `override`, `archive`.

### `POST /memory/approve-recommendation`
Compatibility approval endpoint used by the recommendations page.

## Audit And Analytics

### `GET /audit`
Returns audit events scoped by tenant/workspace.

Optional query params: `tenantId`, `workspaceId`, `entityType`, `action`.

### `GET /analytics`
Returns enterprise analytics with approval rate, rejection rate, average confidence, reviewer performance, memory growth, and discovered patterns.

### `GET /metrics`
Compatibility metrics endpoint with the same expanded analytics payload.

## CRM Provider Adapter API

Provider is selected with `CRM_PROVIDER=mock|salesforce|hubspot|zoho`. The mock provider is the default.

### `GET /crm/customer/:id`
Returns CRM customer details.

### `GET /crm/opportunities/:id`
Returns CRM opportunities for a customer.

### `GET /crm/activities/:id`
Returns CRM activities for a customer.

## Existing Decision Intelligence APIs

- `GET /dashboard`
- `GET /architecture`
- `GET /risk-score`
- `GET /timeline`
- `GET /knowledge`
- `GET /scenario-analysis`
- `GET /devils-advocate`
- `GET /business-rules`
