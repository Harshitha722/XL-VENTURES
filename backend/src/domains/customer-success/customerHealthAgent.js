const { askGemini } = require("../../services/geminiService");
const { parseJsonSafely } = require("../../utils/jsonUtils");
const BUSINESS_RULES = require("../../config/businessRules");

function ruleBasedHealthExtraction(combinedText) {
    const text = combinedText.toLowerCase();
    const rules = BUSINESS_RULES.customerHealth;

    const adoptionMatch = combinedText.match(/adoption\s*(?:is|:|-|rate)?\s*(\d+)%?/i);
    let adoption = adoptionMatch ? Number(adoptionMatch[1]) : null;
    if (adoption === null && text.includes("low adoption")) adoption = 35;
    if (adoption === null && text.includes("strong adoption")) adoption = 80;

    const npsMatch = combinedText.match(/nps\s*(?:is|:|-|score)?\s*(-?\d+)/i);
    let nps = npsMatch ? Number(npsMatch[1]) : null;
    if (nps === null && text.includes("frustrated")) nps = 3;
    if (nps === null && text.includes("happy customers")) nps = 8;

    const csatMatch = combinedText.match(/csat\s*(?:is|:|-|score)?\s*(\d+(?:\.\d+)?)/i);
    const csat = csatMatch ? Number(csatMatch[1]) : null;

    let risk = "low";
    if (
        text.includes("frustrated") ||
        text.includes("may not renew") ||
        text.includes("churn") ||
        (adoption !== null && adoption < rules.highRiskAdoptionThreshold) ||
        (nps !== null && nps < rules.lowNpsThreshold)
    ) {
        risk = "high";
    } else if (
        text.includes("concern") ||
        text.includes("slow usage") ||
        (adoption !== null && adoption < rules.mediumRiskAdoptionThreshold)
    ) {
        risk = "medium";
    }

    const evidence = [];
    if (text.includes("low adoption")) evidence.push("Low adoption mentioned in documents.");
    if (text.includes("frustrated")) evidence.push("Customer frustration detected.");
    if (text.includes("may not renew")) evidence.push("Customer stated they may not renew.");

    return { adoption, nps, csat, risk, churnSignals: [], sentimentSummary: "", evidence };
}

async function customerHealthAgent(uploadedText) {
    const combinedText = [
        uploadedText.meetingText,
        uploadedText.emailText,
        uploadedText.contractText
    ].filter(Boolean).join("\n\n");

    const fallback = ruleBasedHealthExtraction(combinedText);

    const prompt = `
You are a Customer Success analyst. Extract health metrics from the following customer documents.

Return ONLY valid JSON with this exact structure:
{
  "adoption": <number 0-100 or null if not mentioned>,
  "nps": <integer or null if not mentioned>,
  "csat": <number or null if not mentioned>,
  "risk": <"high" | "medium" | "low">,
  "churnSignals": [<list of phrases from the text that indicate churn risk>],
  "sentimentSummary": "<one sentence summary of overall customer sentiment>",
  "evidence": [<list of direct quotes or paraphrased evidence from the text>]
}

Rules:
- Set risk to "high" if: NPS < 5, adoption < 45%, churn language present, strong frustration.
- Set risk to "medium" if: adoption 45-65%, mild concerns.
- Set risk to "low" otherwise.
- Extract actual numbers from text when possible. Do not invent numbers.
- evidence array must contain real text snippets from the documents below.

Documents:
${combinedText}
`;

    try {
        const response = await askGemini(prompt);
        const parsed = parseJsonSafely(response, fallback);

        return {
            adoption: typeof parsed.adoption === "number" ? parsed.adoption : fallback.adoption,
            nps: typeof parsed.nps === "number" ? parsed.nps : fallback.nps,
            csat: typeof parsed.csat === "number" ? parsed.csat : fallback.csat,
            risk: ["high", "medium", "low"].includes(parsed.risk) ? parsed.risk : fallback.risk,
            churnSignals: Array.isArray(parsed.churnSignals) ? parsed.churnSignals : fallback.churnSignals,
            sentimentSummary: typeof parsed.sentimentSummary === "string" ? parsed.sentimentSummary : fallback.sentimentSummary,
            evidence: Array.isArray(parsed.evidence) ? parsed.evidence.slice(0, 5) : fallback.evidence
        };
    } catch (error) {
        return fallback;
    }
}

customerHealthAgent.ruleBasedHealthExtraction = ruleBasedHealthExtraction;

module.exports = customerHealthAgent;
