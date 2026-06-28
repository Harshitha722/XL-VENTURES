const { askGemini } = require("../../services/geminiService");
const { parseJsonSafely } = require("../../utils/jsonUtils");

function ruleBasedCRM(combinedText) {
    const text = combinedText.toLowerCase();
    const opportunities = [];
    const stakeholders = [];
    let escalations = 0;
    let tier = null;

    if (text.includes("enterprise")) tier = "Enterprise";
    else if (text.includes("mid market") || text.includes("mid-market")) tier = "Mid Market";

    if (text.includes("analytics module")) opportunities.push("Analytics Module");
    if (text.includes("ai assistant")) opportunities.push("AI Assistant");
    if (text.includes("expansion") || text.includes("upsell")) opportunities.push("Expansion Discussion");
    if (text.includes("executive sponsor")) stakeholders.push("Executive Sponsor");
    if (text.includes("finance stakeholder")) stakeholders.push("Finance Stakeholder");
    if (text.includes("escalate") || text.includes("escalation")) escalations += 1;
    if (text.includes("executive review")) escalations += 1;

    return {
        tier,
        opportunities: [...new Set(opportunities)],
        stakeholders: [...new Set(stakeholders)],
        escalations,
        executiveSponsor: null,
        openSupportTickets: null,
        lastEngagementSentiment: "neutral",
        expansionPotential: opportunities.length ? "medium" : "low",
        evidence: []
    };
}

async function crmContextAgent(uploadedText) {
    const combinedText = [
        uploadedText.contractText,
        uploadedText.meetingText,
        uploadedText.emailText
    ].filter(Boolean).join("\n\n");

    const fallback = ruleBasedCRM(combinedText);

    const prompt = `
You are a CRM analyst. Extract CRM context from the following customer documents for a SaaS Customer Success platform.

Return ONLY valid JSON:
{
  "tier": "<Enterprise | Mid Market | SMB | null>",
  "stakeholders": [<list of named people and their roles found in documents>],
  "executiveSponsor": "<name and role or null>",
  "opportunities": [<list of upsell or expansion opportunities mentioned>],
  "escalations": <number of escalations or urgent issues mentioned>,
  "openSupportTickets": <number or null>,
  "lastEngagementSentiment": "<positive | neutral | negative>",
  "expansionPotential": "<high | medium | low>",
  "evidence": [<direct quotes or paraphrased facts from documents>]
}

Documents:
${combinedText}
`;

    try {
        const response = await askGemini(prompt);
        const parsed = parseJsonSafely(response, fallback);

        return {
            tier: parsed.tier || fallback.tier,
            stakeholders: Array.isArray(parsed.stakeholders) ? parsed.stakeholders : fallback.stakeholders,
            executiveSponsor: parsed.executiveSponsor || null,
            opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities : fallback.opportunities,
            escalations: typeof parsed.escalations === "number" ? parsed.escalations : fallback.escalations,
            openSupportTickets: typeof parsed.openSupportTickets === "number" ? parsed.openSupportTickets : null,
            lastEngagementSentiment: ["positive", "neutral", "negative"].includes(parsed.lastEngagementSentiment)
                ? parsed.lastEngagementSentiment : fallback.lastEngagementSentiment,
            expansionPotential: ["high", "medium", "low"].includes(parsed.expansionPotential)
                ? parsed.expansionPotential : fallback.expansionPotential,
            evidence: Array.isArray(parsed.evidence) ? parsed.evidence.slice(0, 5) : fallback.evidence
        };
    } catch (error) {
        return fallback;
    }
}

crmContextAgent.ruleBasedCRM = ruleBasedCRM;

module.exports = crmContextAgent;
