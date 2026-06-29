import type {
  AuditEvent,
  CustomerOutcomeRecord,
  CustomerOutcomeStatus,
  DecisionReport,
  DomainCatalogItem,
  IngestedDocument,
  MemoryRecord,
  PlatformMetrics,
  ReviewDecision
} from "@/lib/types";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: init?.body instanceof FormData ? init.headers : { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store"
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function sampleDocuments(): IngestedDocument[] {
  return [
    {
      id: "00000000-0000-4000-8000-000000000001",
      title: "Enterprise decision context",
      source_type: "transcript",
      text:
        "A qualified customer wants ROI proof, pricing support, executive approval, a clear follow-up date, and help resolving buying blockers before signing.",
      metadata: { sample: true },
      created_at: new Date().toISOString()
    }
  ];
}

export async function uploadDocuments(files: File[]): Promise<IngestedDocument[]> {
  const form = new FormData();
  for (const file of files) {
    form.append("files", file);
  }
  return fetchJson<IngestedDocument[]>("/upload", { method: "POST", body: form });
}

export async function analyzeDecision(task: string, documents: IngestedDocument[]): Promise<DecisionReport> {
  return fetchJson<DecisionReport>("/analyze", {
    method: "POST",
    body: JSON.stringify({ task, documents })
  });
}

export async function analyzeDemo(): Promise<DecisionReport> {
  return analyzeDecision(
    "Find the next best action to convert a qualified customer into a completed deal, and capture why they may not buy.",
    sampleDocuments()
  );
}

export async function reviewDecision(input: {
  reportId: string;
  decision: ReviewDecision;
  comments?: string;
  modifications?: Record<string, unknown>;
}): Promise<AuditEvent> {
  return fetchJson<AuditEvent>("/review", {
    method: "POST",
    body: JSON.stringify({
      report_id: input.reportId,
      decision: input.decision,
      comments: input.comments,
      modifications: input.modifications ?? {},
      reviewer: "workspace-user"
    })
  });
}

export async function recordCustomerOutcome(input: {
  reportId?: string;
  recommendationTitle?: string;
  customerId?: string;
  customerName: string;
  domain?: string;
  outcome: CustomerOutcomeStatus;
  reason?: string;
  feedback?: string;
  blockers?: string[];
  dealValue?: number;
  nextFollowUp?: string;
}): Promise<CustomerOutcomeRecord> {
  return fetchJson<CustomerOutcomeRecord>("/outcomes", {
    method: "POST",
    body: JSON.stringify({
      report_id: input.reportId,
      recommendation_title: input.recommendationTitle,
      customer_id: input.customerId,
      customer_name: input.customerName,
      domain: input.domain,
      outcome: input.outcome,
      reason: input.reason ?? "",
      feedback: input.feedback ?? "",
      blockers: input.blockers ?? [],
      deal_value: input.dealValue,
      next_follow_up: input.nextFollowUp,
      source: "recommendations_dashboard"
    })
  });
}

export const getMetrics = () => fetchJson<PlatformMetrics>("/metrics");
export const getDomains = () => fetchJson<DomainCatalogItem[]>("/domains");
export const getAudit = () => fetchJson<AuditEvent[]>("/audit");
export const getReports = () => fetchJson<DecisionReport[]>("/reports");
export const getMemory = () => fetchJson<MemoryRecord[]>("/memory");
export const getOutcomes = () => fetchJson<CustomerOutcomeRecord[]>("/outcomes");
