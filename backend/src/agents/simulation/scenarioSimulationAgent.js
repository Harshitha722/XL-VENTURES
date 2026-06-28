const { askGemini } = require("../../services/geminiService");
const { parseJsonSafely } = require("../../utils/jsonUtils");

const SCENARIO_SIMULATION_PROMPT = `
You are a Decision Intelligence Simulation Agent.
You receive customer interaction, customer health, CRM context, contract details, business reasoning, and historical memory.
Your goal is to generate multiple plausible business response scenarios with outcome estimates.

Return ONLY valid JSON as an array of scenarios. Each scenario must include:
- id
- name
- summary
- renewalProbability
- churnProbability
- revenueImpact
- customerSatisfaction
- confidence

Example:
[
  {
    "id": "scenario-a",
    "name": "Executive Business Review",
    "summary": "High-touch executive review to protect renewal and reduce churn.",
    "renewalProbability": 82,
    "churnProbability": 18,
    "revenueImpact": "High",
    "customerSatisfaction": "Medium",
    "confidence": 78
  }
]
`;

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function buildFallbackScenarios(agentOutputs, reasoning) {
    const adoption = agentOutputs.CustomerHealthAgent?.adoption ?? 60;
    const nps = agentOutputs.CustomerHealthAgent?.nps ?? 50;
    const discountAllowed = agentOutputs.ContractAgent?.discountAllowed === true;
    const renewalRisk = reasoning.risks.includes("renewal risk");
    const churnRisk = reasoning.risks.includes("churn risk") || reasoning.risks.includes("customer dissatisfaction");
    const upsell = reasoning.opportunities.includes("upsell opportunity");
    const discountOpportunity = reasoning.opportunities.includes("retention discount strategy");

    const baseRenewal = clamp(55 + (adoption - 50) * 0.5 - (renewalRisk ? 15 : 0) - (churnRisk ? 10 : 0), 35, 95);

    const scenarios = [
        {
            id: "scenario-a",
            name: "Executive Business Review",
            summary: "Bring executives together to validate the renewal plan and address churn risk.",
            renewalProbability: clamp(Math.round(baseRenewal + 10 - (discountOpportunity ? 5 : 0)), 55, 95),
            churnProbability: clamp(Math.round(22 - (nps / 10) - (renewalRisk ? 6 : 0)), 6, 35),
            revenueImpact: "High",
            customerSatisfaction: churnRisk ? "Medium" : "High",
            confidence: clamp(Math.round(72 + (adoption - 50) * 0.3 + (discountAllowed ? 4 : 0)), 60, 92)
        },
        {
            id: "scenario-b",
            name: "Quarterly Payment Plan",
            summary: "Offer a flexible payment schedule to balance cash flow and retention.",
            renewalProbability: clamp(Math.round(baseRenewal + 12), 62, 94),
            churnProbability: clamp(Math.round(14 - (nps / 12)), 5, 24),
            revenueImpact: "Medium",
            customerSatisfaction: "High",
            confidence: clamp(Math.round(70 + (adoption - 50) * 0.2 + (upsell ? 3 : 0)), 60, 93)
        },
        {
            id: "scenario-c",
            name: "20% Discount",
            summary: "Use a price incentive to improve renewal likelihood while accepting margin pressure.",
            renewalProbability: clamp(Math.round(baseRenewal + 18), 65, 97),
            churnProbability: clamp(Math.round(11 - (nps / 15)), 4, 18),
            revenueImpact: "Low",
            customerSatisfaction: "Very High",
            confidence: discountAllowed ? clamp(Math.round(68 + (discountOpportunity ? 8 : 0)), 60, 95) : 58
        },
        {
            id: "scenario-d",
            name: "Additional Product Training",
            summary: "Improve adoption through targeted training to increase engagement and retention.",
            renewalProbability: clamp(Math.round(baseRenewal + 8), 57, 91),
            churnProbability: clamp(Math.round(16 - (adoption / 15)), 6, 28),
            revenueImpact: "High",
            customerSatisfaction: "High",
            confidence: clamp(Math.round(66 + (adoption < 60 ? 10 : 0)), 60, 92)
        },
        {
            id: "scenario-e",
            name: "No Action",
            summary: "Maintain the status quo and do not intervene aggressively.",
            renewalProbability: clamp(Math.round(baseRenewal - 20), 35, 70),
            churnProbability: clamp(Math.round(30 + (renewalRisk ? 10 : 0)), 20, 72),
            revenueImpact: "None",
            customerSatisfaction: "Low",
            confidence: clamp(Math.round(54 - (adoption - 50) * 0.2), 45, 75)
        }
    ];

    return scenarios;
}

function normalizeScenarios(items) {
    if (!Array.isArray(items)) {
        return [];
    }

    return items
        .filter((item) => item && item.name)
        .map((item, index) => ({
            id: item.id || `scenario-${index + 1}`,
            name: String(item.name).trim(),
            summary: String(item.summary || "").trim(),
            renewalProbability: Number(item.renewalProbability) || 0,
            churnProbability: Number(item.churnProbability) || 0,
            revenueImpact: String(item.revenueImpact || "Unknown").trim(),
            customerSatisfaction: String(item.customerSatisfaction || "Unknown").trim(),
            confidence: Number(item.confidence) || 0
        }))
        .slice(0, 6);
}

function pickBestScenario(scenarios) {
    if (!Array.isArray(scenarios) || scenarios.length === 0) {
        return null;
    }

    const scored = scenarios.map((scenario) => {
        const score = (scenario.renewalProbability * 1.4)
            - (scenario.churnProbability * 1.1)
            + (scenario.confidence * 0.8)
            + (scenario.revenueImpact === "High" ? 10 : scenario.revenueImpact === "Medium" ? 5 : 0);
        return {
            scenario,
            score
        };
    });

    const best = scored.reduce((winner, current) =>
        current.score > winner.score ? current : winner,
        scored[0]
    );

    return best.scenario;
}

async function scenarioSimulationAgent({ agentOutputs = {}, reasoning = {}, orchestrationInput = {} }) {
    const fallback = buildFallbackScenarios(agentOutputs, reasoning);

    const prompt = `
${SCENARIO_SIMULATION_PROMPT}

Customer Interaction:
${orchestrationInput.meetingText || orchestrationInput.emailText || orchestrationInput.contractText || "No raw interaction text provided."}

Customer Health:
${JSON.stringify(agentOutputs.CustomerHealthAgent || {}, null, 2)}

CRM Context:
${JSON.stringify(agentOutputs.CRMContextAgent || {}, null, 2)}

Contract Information:
${JSON.stringify(agentOutputs.ContractAgent || {}, null, 2)}

Business Reasoning:
${JSON.stringify(reasoning, null, 2)}
`;

    try {
        const response = await askGemini(prompt);
        const parsed = parseJsonSafely(response, fallback);
        const scenarios = normalizeScenarios(parsed);

        if (!scenarios.length) {
            return {
                scenarios: fallback,
                selectedScenarioId: pickBestScenario(fallback)?.id,
                bestScenario: pickBestScenario(fallback)
            };
        }

        const bestScenario = pickBestScenario(scenarios);

        return {
            scenarios,
            selectedScenarioId: bestScenario?.id,
            bestScenario
        };
    }
    catch (error) {
        const bestScenario = pickBestScenario(fallback);

        return {
            scenarios: fallback,
            selectedScenarioId: bestScenario?.id,
            bestScenario
        };
    }
}

module.exports = scenarioSimulationAgent;
