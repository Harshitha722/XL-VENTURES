from fastapi.testclient import TestClient

from app.main import create_app


def test_health_endpoint():
    client = TestClient(create_app())
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_analyze_endpoint():
    client = TestClient(create_app())
    response = client.post(
        "/analyze",
        json={
            "task": "Evaluate healthcare patient risk and insurance escalation",
            "documents": [
                {
                    "title": "case note",
                    "source_type": "transcript",
                    "text": "Patient safety risk, missing diagnostics, payer authorization, and treatment pathway were discussed.",
                }
            ],
        },
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["domain"]["domain"] in ("healthcare", "general")
    assert len(payload["agents"]) > 0
    assert "risks" in payload["reasoning"]


def test_review_metrics_audit_and_memory_flow():
    client = TestClient(create_app())
    
    # 1. Analysis
    analyze_res = client.post(
        "/analyze",
        json={
            "task": "Review Q4 retail supply chain constraints",
            "documents": [{"title": "Logistics report", "source_type": "other", "text": "inventory delays"}]
        }
    )
    assert analyze_res.status_code == 200
    report = analyze_res.json()
    report_id = report["id"]
    assert report["domain"]["domain"] in ("retail", "general")
    
    # 2. Review
    review_res = client.post(
        "/review",
        json={
            "report_id": report_id,
            "decision": "approve",
            "comments": "Looks good",
            "reviewer": "test-admin"
        }
    )
    assert review_res.status_code == 200
    
    # 3. Metrics
    metrics_res = client.get("/metrics")
    assert metrics_res.status_code == 200
    metrics = metrics_res.json()
    assert metrics["reports"] > 0
    
    # 4. Audit
    audit_res = client.get("/audit")
    assert audit_res.status_code == 200
    events = audit_res.json()
    assert any(e["report_id"] == report_id for e in events)

    # 5. Memory
    memory_res = client.get("/memory")
    assert memory_res.status_code == 200
    memories = memory_res.json()
    assert any(m["source_report_id"] == report_id for m in memories)


def test_domain_catalog_endpoint():
    client = TestClient(create_app())
    response = client.get("/domains")
    assert response.status_code == 200
    domains = {item["domain"] for item in response.json()}
    assert isinstance(domains, set)


def test_customer_outcome_endpoint_records_no_buy_feedback():
    client = TestClient(create_app())
    report_response = client.post(
        "/analyze",
        json={
            "task": "Find next best action to convert customer into completed deal",
            "documents": [
                {
                    "title": "customer call",
                    "source_type": "transcript",
                    "text": (
                        "Customer asked for ROI proof, pricing support, follow-up date, "
                        "and economic buyer approval before buying."
                    ),
                }
            ],
        },
    )
    assert report_response.status_code == 200
    report = report_response.json()
    recommendation = report["recommendations"][0]
    assert recommendation["next_best_action"]
    assert recommendation["conversion_goal"]

    outcome_response = client.post(
        "/outcomes",
        json={
            "report_id": report["id"],
            "recommendation_title": recommendation["title"],
            "customer_name": "Acme Finance",
            "outcome": "no_decision",
            "reason": "Customer delayed because ROI proof was weak",
            "feedback": "Improve value proof and executive follow-up.",
            "blockers": ["ROI proof", "timing"],
        },
    )
    assert outcome_response.status_code == 200
    outcome = outcome_response.json()
    assert outcome["outcome"] == "no_decision"
    assert outcome["improvement_insights"]

    outcomes = client.get("/outcomes")
    assert outcomes.status_code == 200
    assert outcomes.json()

    metrics = client.get("/metrics")
    assert metrics.status_code == 200
    assert metrics.json()["customer_outcomes"] >= 1
    assert metrics.json()["no_decision_deals"] >= 1
