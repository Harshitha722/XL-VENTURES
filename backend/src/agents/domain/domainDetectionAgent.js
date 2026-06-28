const { askGemini } = require("../../services/geminiService");
const { parseJsonSafely } = require("../../utils/jsonUtils");

const DEFAULT_DOMAIN_DETECTION = {
    domain: "Customer Success",
    confidence: 50,
    reasoning: "Fallback domain used because domain detection was unavailable."
};

const VALID_DOMAINS = new Set([
    "Customer Success",
    "Finance",
    "Healthcare",
    "Insurance",
    "Legal",
    "HR",
    "General Business"
]);

function buildDocumentText(uploadedText) {
    return [
        uploadedText.contractText,
        uploadedText.meetingText,
        uploadedText.emailText
    ]
        .filter(Boolean)
        .join("\n\n");
}

function normalizeDomainDetection(value) {
    if (!value || typeof value !== "object") {
        return DEFAULT_DOMAIN_DETECTION;
    }

    const domain = VALID_DOMAINS.has(value.domain)
        ? value.domain
        : DEFAULT_DOMAIN_DETECTION.domain;

    const confidence = Number.isFinite(Number(value.confidence))
        ? Math.max(0, Math.min(100, Math.round(Number(value.confidence))))
        : DEFAULT_DOMAIN_DETECTION.confidence;

    const reasoning = typeof value.reasoning === "string" && value.reasoning.trim()
        ? value.reasoning.trim()
        : DEFAULT_DOMAIN_DETECTION.reasoning;

    return {
        domain,
        confidence,
        reasoning
    };
}

function heuristicDomainFallback(uploadedText) {
    const text = buildDocumentText(uploadedText).toLowerCase();
    const successKeywords = [
        "renew",
        "adopt",
        "nps",
        "churn",
        "escalation",
        "customer success",
        "satisfaction",
        "support",
        "executive sponsor",
        "contract renewal",
        "upsell",
        "renewal risk"
    ];

    const matchCount = successKeywords.reduce((count, keyword) => {
        return count + (text.includes(keyword) ? 1 : 0);
    }, 0);

    if (matchCount >= 2) {
        return {
            domain: "Customer Success",
            confidence: 98,
            reasoning: "Heuristic fallback detected multiple Customer Success signals when Gemini was unavailable."
        };
    }

    return DEFAULT_DOMAIN_DETECTION;
}

async function domainDetectionAgent(uploadedText) {
    const documentText = buildDocumentText(uploadedText);

    const prompt = `
You are an enterprise document classifier.

Return ONLY valid JSON:

{
  "domain": "Customer Success",
  "confidence": 95,
  "reasoning": "The documents discuss renewals, adoption metrics, customer escalations, and executive stakeholders."
}

Possible domains:
- Customer Success
- Finance
- Healthcare
- Insurance
- Legal
- HR
- General Business

Documents:

${documentText}
`;

    try {
        const response = await askGemini(prompt);
        const parsed = parseJsonSafely(response, DEFAULT_DOMAIN_DETECTION);

        return normalizeDomainDetection(parsed);
    }
    catch (error) {
        return heuristicDomainFallback(uploadedText);
    }
}

module.exports = domainDetectionAgent;
