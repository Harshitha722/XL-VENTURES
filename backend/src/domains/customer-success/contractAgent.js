const { askGemini } = require("../../services/geminiService");
const { parseJsonSafely } = require("../../utils/jsonUtils");

function ruleBasedContractExtraction(contractText) {
    const renewalDate = contractText.match(/Renewal Date:\s*([^\n]+)/i)?.[1]?.trim()
        || contractText.match(/renews?\s+(?:on|by)\s+([^\n.]+)/i)?.[1]?.trim() || null;

    const contractValueText = contractText.match(/Contract Value:\s*\$?\s*([0-9,]+)/i)?.[1]
        || contractText.match(/ARR:\s*\$?\s*([0-9,]+)/i)?.[1];
    const contractValue = contractValueText ? Number(contractValueText.replace(/,/g, "")) : null;

    const autoRenewText = contractText.match(/Auto Renewal:\s*([^\n]+)/i)?.[1]?.toLowerCase() || "";
    const autoRenew = autoRenewText
        ? (autoRenewText.includes("yes") || autoRenewText.includes("true") || autoRenewText.includes("enabled"))
        : null;

    const discountText = contractText.match(/Maximum Discount Allowed:\s*([^\n]+)/i)?.[1]
        || contractText.match(/discount(?:s)?(?:\s+allowed)?\s*(?:up to)?\s*(\d+%?)/i)?.[1] || "";
    const discountAllowed = Boolean(discountText) && !discountText.toLowerCase().includes("not allowed");
    const maximumDiscountPercent = Number(discountText.match(/(\d+)/)?.[1] || 0);

    const slaTerms = contractText.match(/SLA Terms:\s*([^\n]+)/i)?.[1]?.trim()
        || contractText.match(/SLA:\s*([^\n]+)/i)?.[1]?.trim() || null;

    return {
        renewalDate, contractValue, autoRenew, discountAllowed,
        maximumDiscountPercent, maxDiscountPercent: maximumDiscountPercent,
        slaTerms, sla: slaTerms,
        tier: null, contractDuration: null, paymentTerms: null, renewalRisk: "medium",
        evidence: [
            ...(renewalDate ? [`Renewal Date: ${renewalDate}`] : []),
            ...(contractValue ? [`Contract Value: $${contractValue}`] : []),
            ...(autoRenew === false ? ["Auto renewal is disabled - manual renewal required."] : [])
        ]
    };
}

async function contractAgent(uploadedText) {
    const contractText = uploadedText.contractText || "";
    const fallback = ruleBasedContractExtraction(contractText);

    if (!contractText.trim()) return fallback;

    const prompt = `
You are a legal and contract analyst. Extract structured contract data from this SaaS contract document.

Return ONLY valid JSON:
{
  "renewalDate": "<date string or null>",
  "contractValue": <number in USD or null>,
  "autoRenew": <true | false | null>,
  "discountAllowed": <true | false>,
  "maximumDiscountPercent": <number 0-100>,
  "slaTerms": "<SLA description string or null>",
  "tier": "<Enterprise | Mid Market | SMB | null>",
  "contractDuration": "<e.g. 12 months or null>",
  "paymentTerms": "<e.g. Annual upfront or null>",
  "renewalRisk": "<high | medium | low>",
  "evidence": [<key contract facts as strings>]
}

Set renewalRisk to:
- "high" if autoRenew is false and renewal date is within 90 days.
- "medium" if autoRenew is false OR renewal date is within 180 days.
- "low" otherwise.

Contract document:
${contractText}
`;

    try {
        const response = await askGemini(prompt);
        const parsed = parseJsonSafely(response, fallback);

        return {
            renewalDate: parsed.renewalDate || fallback.renewalDate,
            contractValue: typeof parsed.contractValue === "number" ? parsed.contractValue : fallback.contractValue,
            autoRenew: typeof parsed.autoRenew === "boolean" ? parsed.autoRenew : fallback.autoRenew,
            discountAllowed: typeof parsed.discountAllowed === "boolean" ? parsed.discountAllowed : fallback.discountAllowed,
            maximumDiscountPercent: typeof parsed.maximumDiscountPercent === "number" ? parsed.maximumDiscountPercent : fallback.maximumDiscountPercent,
            maxDiscountPercent: typeof parsed.maximumDiscountPercent === "number" ? parsed.maximumDiscountPercent : fallback.maximumDiscountPercent,
            slaTerms: parsed.slaTerms || fallback.slaTerms,
            sla: parsed.slaTerms || fallback.slaTerms,
            tier: parsed.tier || null,
            contractDuration: parsed.contractDuration || null,
            paymentTerms: parsed.paymentTerms || null,
            renewalRisk: ["high", "medium", "low"].includes(parsed.renewalRisk) ? parsed.renewalRisk : fallback.renewalRisk,
            evidence: Array.isArray(parsed.evidence) ? parsed.evidence.slice(0, 5) : fallback.evidence
        };
    } catch (error) {
        return fallback;
    }
}

contractAgent.ruleBasedContractExtraction = ruleBasedContractExtraction;

module.exports = contractAgent;
