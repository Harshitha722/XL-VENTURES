const { askGemini } = require("../../services/geminiService");
const { parseJsonSafely } = require("../../utils/jsonUtils");

const DEVILS_ADVOCATE_PROMPT = `
You are a Devil's Advocate business strategist.
The highest ranked scenario is provided below. Your goal is to challenge the selected option, expose hidden risks, and propose a better alternative where appropriate.

Return ONLY valid JSON:
{
  "scenarioId": "<scenario id>",
  "scenarioName": "<name>",
  "potentialWeaknesses": ["<point>", "<point>"],
  "longTermDisadvantages": ["<point>", "<point>"],
  "revenueTradeOffs": ["<point>", "<point>"],
  "customerRelationshipRisks": ["<point>", "<point>"],
  "alternative": {
    "name": "<name>",
    "summary": "<why it may be better>",
    "renewalProbability": 0,
    "churnProbability": 0,
    "revenueImpact": "<High|Medium|Low>",
    "customerSatisfaction": "<High|Medium|Low>",
    "confidence": 0
  },
  "finalVerdict": "<summary conclusion>"
}
`;

function normalizeCritique(input, bestScenario) {
    const result = typeof input === "object" && input !== null ? input : {};

    return {
        scenarioId: result.scenarioId || bestScenario?.id || "unknown",
        scenarioName: result.scenarioName || bestScenario?.name || "Unknown Scenario",
        potentialWeaknesses: Array.isArray(result.potentialWeaknesses) ? result.potentialWeaknesses : [String(result.potentialWeaknesses || "No weaknesses identified.")],
        longTermDisadvantages: Array.isArray(result.longTermDisadvantages) ? result.longTermDisadvantages : [String(result.longTermDisadvantages || "No disadvantages identified.")],
        revenueTradeOffs: Array.isArray(result.revenueTradeOffs) ? result.revenueTradeOffs : [String(result.revenueTradeOffs || "No revenue trade-offs identified.")],
        customerRelationshipRisks: Array.isArray(result.customerRelationshipRisks) ? result.customerRelationshipRisks : [String(result.customerRelationshipRisks || "No customer relationship risks identified.")],
        alternative: {
            name: result.alternative?.name || "No alternative recommended.",
            summary: result.alternative?.summary || "No alternative summary.",
            renewalProbability: Number(result.alternative?.renewalProbability) || 0,
            churnProbability: Number(result.alternative?.churnProbability) || 0,
            revenueImpact: result.alternative?.revenueImpact || "Unknown",
            customerSatisfaction: result.alternative?.customerSatisfaction || "Unknown",
            confidence: Number(result.alternative?.confidence) || 0
        },
        finalVerdict: String(result.finalVerdict || "No final verdict provided.")
    };
}

async function devilsAdvocateAgent({ bestScenario, reasoning = {}, agentOutputs = {} }) {
    const fallback = {
        scenarioId: bestScenario?.id || "none",
        scenarioName: bestScenario?.name || "No best scenario",
        potentialWeaknesses: ["Potential revenue impact from the selected option.", "The selected scenario may create customer expectations that are hard to sustain."],
        longTermDisadvantages: ["Margin pressure could harm future renewal negotiations.", "It may reduce ability to pursue higher-value upsell opportunities."],
        revenueTradeOffs: ["Short-term renewal may come at the cost of long-term revenue growth."],
        customerRelationshipRisks: ["Customers may expect similar concessions in the next cycle."],
        alternative: {
            name: "Quarterly Payment Plan",
            summary: "A balanced approach that preserves revenue while improving renewal probability.",
            renewalProbability: 91,
            churnProbability: 9,
            revenueImpact: "Medium",
            customerSatisfaction: "High",
            confidence: 88
        },
        finalVerdict: "The selected scenario should be reviewed for risk; a more balanced alternative may be preferable."
    };

    const prompt = `
${DEVILS_ADVOCATE_PROMPT}

Best Scenario:
${JSON.stringify(bestScenario || {}, null, 2)}

Business Reasoning:
${JSON.stringify(reasoning, null, 2)}

Agent Outputs:
${JSON.stringify({
        health: agentOutputs.CustomerHealthAgent,
        crm: agentOutputs.CRMContextAgent,
        contract: agentOutputs.ContractAgent
    }, null, 2)}
`;

    try {
        const response = await askGemini(prompt);
        const parsed = parseJsonSafely(response, fallback);
        return normalizeCritique(parsed, bestScenario);
    }
    catch (error) {
        return fallback;
    }
}

module.exports = devilsAdvocateAgent;
