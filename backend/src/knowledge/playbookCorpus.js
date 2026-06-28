const PLAYBOOK_CORPUS = [
    {
        id: "pb-001",
        category: "churn_prevention",
        title: "Executive Business Review (EBR) Playbook",
        content: "When a customer exhibits high churn risk signals (NPS < 5, adoption < 40%, or explicit renewal concerns), initiate an Executive Business Review within 7 days. The EBR should include the customer's executive sponsor and your internal VP of Customer Success. Agenda: review ROI achieved, address top concerns, present renewal roadmap. Prepare a slide deck with usage metrics, outcomes delivered, and a 12-month value roadmap.",
        tags: ["churn", "EBR", "executive", "renewal", "high-risk"]
    },
    {
        id: "pb-002",
        category: "adoption",
        title: "Low Adoption Intervention Playbook",
        content: "If product adoption falls below 50%, schedule an Adoption Workshop within 14 days. Identify the top 3 unused features relevant to the customer's use case. Assign a Solutions Engineer to run a hands-on training session. Follow up with a 30-day adoption improvement plan and weekly check-ins. Measure adoption weekly post-workshop.",
        tags: ["adoption", "training", "workshop", "onboarding", "usage"]
    },
    {
        id: "pb-003",
        category: "renewal",
        title: "Proactive Renewal Management Playbook",
        content: "Initiate renewal conversations 90 days before the renewal date. If auto-renewal is disabled, treat this as a high-priority renewal risk. Steps: (1) Review contract value and discount eligibility, (2) Schedule renewal discovery call with economic buyer, (3) Prepare a Business Value Assessment showing ROI over the contract period, (4) Present renewal proposal with multi-year incentive if applicable.",
        tags: ["renewal", "contract", "auto-renew", "ARR", "retention"]
    },
    {
        id: "pb-004",
        category: "escalation",
        title: "Customer Escalation Management Playbook",
        content: "When a customer escalates or expresses severe dissatisfaction: (1) Acknowledge within 2 hours, (2) Assign a Senior CSM as dedicated point of contact, (3) Create an internal war room with product and support, (4) Schedule daily check-in calls until resolved, (5) Deliver a Root Cause Analysis document within 5 business days. Never let an escalation go unacknowledged for more than 4 hours.",
        tags: ["escalation", "support", "dissatisfaction", "frustrated", "urgent"]
    },
    {
        id: "pb-005",
        category: "upsell",
        title: "Expansion and Upsell Opportunity Playbook",
        content: "Identify expansion opportunities when: (1) customer adoption is above 70%, (2) they have expressed interest in additional modules, (3) their team has grown. Steps: (1) Prepare a usage report showing value delivered, (2) Present product roadmap with upcoming features, (3) Propose expansion SKUs aligned with their pain points, (4) Involve your AE for commercial negotiation. Target: expand ARR by 20%+ on renewal.",
        tags: ["upsell", "expansion", "ARR", "growth", "modules"]
    },
    {
        id: "pb-006",
        category: "stakeholder",
        title: "Executive Sponsor Engagement Playbook",
        content: "If no executive sponsor is identified, work with your champion to map the org chart and identify the economic buyer. Schedule a sponsor introduction call within 30 days. Send monthly executive summary emails with business outcomes, key metrics, and upcoming milestones. The executive sponsor should attend every QBR/EBR.",
        tags: ["stakeholder", "executive-sponsor", "QBR", "engagement"]
    },
    {
        id: "pb-007",
        category: "data_collection",
        title: "Customer Health Data Collection Playbook",
        content: "If adoption or NPS data is unavailable, immediately request access to product analytics dashboards. Schedule a data-sharing onboarding session. Send a CSAT survey via email within 3 days. Set up automated health score tracking in your CRM. Without health data, you are flying blind - this is a P1 task.",
        tags: ["NPS", "CSAT", "adoption", "metrics", "analytics", "data"]
    },
    {
        id: "pb-008",
        category: "renewal",
        title: "Discount and Retention Incentive Playbook",
        content: "If a customer is at renewal risk and discount is permitted by contract, offer a tiered retention incentive: (1) 5% for 1-year renewal, (2) 10% for 2-year renewal, (3) 15% for 3-year renewal plus white-glove onboarding. Never lead with discounts - first establish value, then use discount as a closing lever. Get VP approval before offering >10%.",
        tags: ["discount", "retention", "renewal", "incentive", "ARR"]
    }
];

module.exports = PLAYBOOK_CORPUS;
