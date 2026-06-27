/**
 * CRM CONTEXT AGENT
 *
 * Infers CRM-style context from uploaded documents.
 * It does not use customers.json.
 */
function crmContextAgent(uploadedText) {
    const combinedText = [
        uploadedText.contractText,
        uploadedText.meetingText,
        uploadedText.emailText
    ].join("\n");

    const text = combinedText.toLowerCase();

    const opportunities = [];
    const stakeholders = [];
    let escalations = 0;
    let tier = null;

    if (text.includes("enterprise")) {
        tier = "Enterprise";
    }
    else if (text.includes("mid market") || text.includes("mid-market")) {
        tier = "Mid Market";
    }

    if (text.includes("analytics module")) {
        opportunities.push("Analytics Module");
    }

    if (text.includes("ai assistant")) {
        opportunities.push("AI Assistant");
    }

    if (text.includes("expansion") || text.includes("upsell")) {
        opportunities.push("Expansion Discussion");
    }

    if (text.includes("executive sponsor")) {
        stakeholders.push("Executive Sponsor");
    }

    if (text.includes("finance stakeholder")) {
        stakeholders.push("Finance Stakeholder");
    }

    if (text.includes("executive review")) {
        escalations += 1;
    }

    if (text.includes("escalate") || text.includes("escalation")) {
        escalations += 1;
    }

    return {
        tier,
        opportunities: [...new Set(opportunities)],
        stakeholders: [...new Set(stakeholders)],
        escalations,
        evidence: [
            ...(tier ? [`${tier} tier inferred from uploaded documents.`] : []),
            ...(opportunities.length
                ? ["Expansion or product opportunity detected."]
                : []),
            ...(escalations
                ? ["Escalation language detected in uploaded documents."]
                : [])
        ]
    };
}

module.exports = crmContextAgent;
