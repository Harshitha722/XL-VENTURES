export type Priority = "HIGH" | "MEDIUM" | "LOW";
export type ReviewDecision = "approve" | "reject" | "override" | "delegate" | "escalate" | "request_information";
export type ReviewStatus = "pending" | "approved" | "rejected" | "overridden" | "delegated" | "escalated" | "information_requested";
export type CustomerOutcomeStatus = "won" | "lost" | "no_decision" | "in_progress";

export interface Evidence {
  source_id: string;
  source_type: string;
  excerpt: string;
  relevance: number;
  metadata: Record<string, unknown>;
}

export interface IngestedDocument {
  id: string;
  source_type: string;
  title: string;
  text: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface AgentSpec {
  name: string;
  domain: string;
  capability: string;
  objective: string;
  tools: string[];
  priority: number;
  evidence_requirements: string[];
  guardrails: string[];
}

export interface AgentFinding {
  agent_name: string;
  capability: string;
  findings: string[];
  risks: string[];
  opportunities: string[];
  missing_information: string[];
  evidence: Evidence[];
  confidence: number;
}

export interface Scenario {
  title: string;
  assumptions: string[];
  actions: string[];
  expected_outcomes: string[];
  risks: string[];
  success_metrics: string[];
  confidence: number;
  rank: number;
}

export interface Recommendation {
  title: string;
  action: string;
  next_best_action: string;
  conversion_goal: string;
  deal_stage: string;
  objection_response: string;
  success_signal: string;
  rationale: string;
  evidence: Evidence[];
  confidence: number;
  impact: string;
  priority: Priority;
  owner: string;
  timeline: string;
  why: string;
  scenarios_considered: string[];
  critiques: string[];
  human_modifications: string[];
}

export interface CustomerOutcomeRecord {
  id: string;
  report_id: string | null;
  recommendation_title: string | null;
  recommended_action: string | null;
  customer_id: string | null;
  customer_name: string;
  domain: string;
  outcome: CustomerOutcomeStatus;
  reason: string;
  feedback: string;
  blockers: string[];
  deal_value: number | null;
  next_follow_up: string | null;
  learning_summary: string;
  improvement_insights: string[];
  source: string;
  created_at: string;
}

export interface DecisionReport {
  id: string;
  domain: {
    domain: string;
    confidence: number;
    description: string;
    business_goals: string[];
    recommended_capabilities: string[];
    matched_ontology: string;
    signals: Record<string, number>;
  };
  agents: AgentSpec[];
  findings: AgentFinding[];
  reasoning: {
    risks: string[];
    opportunities: string[];
    missing_information: string[];
    assumptions: string[];
    dependencies: string[];
    business_goals: string[];
  };
  scenarios: Scenario[];
  critique: {
    criticisms: string[];
    missing_evidence: string[];
    alternative_actions: string[];
    uncertainty: number;
  };
  confidence: {
    overall: number;
    evidence_quality: number;
    reasoning_quality: number;
    agent_agreement: number;
    memory_matches: number;
    retrieval_quality: number;
  };
  mandatory_review: boolean;
  review_status: ReviewStatus;
  review_history: Record<string, unknown>[];
  recommendations: Recommendation[];
  created_at: string;
}

export interface DomainCatalogItem {
  domain: string;
  description: string;
  business_goals: string[];
  kpis: string[];
  risks: string[];
  opportunities: string[];
  success_metrics: string[];
  agent_capabilities: string[];
  tools: string[];
  scenario_count: number;
}

export interface AuditEvent {
  id: string;
  report_id: string | null;
  event_type: string;
  ai_decision: Record<string, unknown>;
  human_decision: Record<string, unknown>;
  changes: Record<string, unknown>;
  comments: string | null;
  evidence: Evidence[];
  previous_hash: string | null;
  event_hash: string | null;
  timestamp: string;
}

export interface MemoryRecord {
  id: string;
  memory_type: string;
  domain: string;
  task: string;
  summary: string;
  payload: Record<string, unknown>;
  source_report_id: string | null;
  created_at: string;
}

export interface PlatformMetrics {
  reports: number;
  audit_events: number;
  memory_records: number;
  domains_available: number;
  mandatory_reviews: number;
  customer_outcomes: number;
  won_deals: number;
  lost_deals: number;
  no_decision_deals: number;
  deal_conversion_rate: number;
}
