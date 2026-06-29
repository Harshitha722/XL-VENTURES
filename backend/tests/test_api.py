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
    assert payload["domain"]["domain"] == "healthcare"
    assert payload["recommendations"]
    assert payload["scenarios"]
    assert payload["review_status"] == "pending"


def test_review_metrics_audit_and_memory_flow():
    client = TestClient(create_app())
    report_response = client.post(
        "/analyze",
        json={
            "task": "Assess retail demand, inventory, supplier delays, and promotion options",
            "documents": [
                {
                    "title": "retail notes",
                    "source_type": "transcript",
                    "text": "Inventory stockout risk, supplier delay, promotion margin, sell-through rate, and demand forecast were reviewed.",
                }
            ],
        },
    )
    assert report_response.status_code == 200
    report_id = report_response.json()["id"]

    review_response = client.post(
        "/review",
        json={
            "report_id": report_id,
            "decision": "approve",
            "comments": "Approved with owner validation.",
            "reviewer": "test-reviewer",
        },
    )
    assert review_response.status_code == 200
    assert review_response.json()["event_hash"]

    fetched = client.get(f"/report/{report_id}")
    assert fetched.status_code == 200
    assert fetched.json()["review_status"] == "approved"

    metrics = client.get("/metrics")
    assert metrics.status_code == 200
    assert metrics.json()["reports"] >= 1
    assert metrics.json()["audit_events"] >= 2
    assert metrics.json()["memory_records"] >= 3

    audit = client.get("/audit")
    assert audit.status_code == 200
    assert len(audit.json()) >= 2

    memory = client.get("/memory")
    assert memory.status_code == 200
    assert memory.json()


def test_domain_catalog_endpoint():
    client = TestClient(create_app())
    response = client.get("/domains")
    assert response.status_code == 200
    domains = {item["domain"] for item in response.json()}
    assert {"finance", "healthcare", "retail"}.issubset(domains)


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
