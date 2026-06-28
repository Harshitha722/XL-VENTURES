const { askGemini } = require("../../services/geminiService");
const { parseJsonSafely } = require("../../utils/jsonUtils");
const BUSINESS_RULES = require("../../config/businessRules");

function deterministicReasoning(agentOutputs) {
    const rules = BUSINESS_RULES.customerHealth;
    const risks = [];
    const opportunities = [];
    const missingInformation = [];

    const health = agentOutputs.CustomerHealthAgent;
    const contract = agentOutputs.ContractAgent;
    const crm = agentOutputs.CRMContextAgent;
    const completeness = agentOutputs.DataCompletenessAgent;

    if (health) {
        if (health.risk === "high") risks.push("churn risk");
        if (health.nps !== null && health.nps !== undefined && health.nps < rules.lowNpsThreshold) {
            risks.push("customer dissatisfaction");
        }
        if (health.adoption !== null && health.adoption !== undefined && health.adoption < rules.lowAdoptionThreshold) {
            risks.push("low product adoption");
        }
    }

    if (contract) {
        if (contract.autoRenew === false || contract.renewalRisk === "high") {
            risks.push("renewal risk");
        }
        if (contract.discountAllowed) {
            opportunities.push("retention discount strategy");
        }
    }

    if (crm) {
        if (crm.opportunities?.length) {
            opportunities.push("upsell opportunity");
        }
        if (crm.escalations > rules.frequentEscalationThreshold) {
            risks.push("frequent escalations");
        }
    }

    if (completeness) {
        missingInformation.push(...completeness.missing);
    }

    missingInformation.push("renewal meeting confirmation");

    return {
        risks: [...new Set(risks)],
        opportunities: [...new Set(opportunities)],
        missingInformation: [...new Set(missingInformation)],
        dataCompleteness: completeness,
        riskSummary: "",
        opportunitySummary: "",
        urgency: "soon",
        businessContext: "",
        priorityFocus: ""
    };
}

async function businessReasoningAgent(agentOutputs) {
    const deterministicResult = deterministicReasoning(agentOutputs);

    const summaryForLLM = JSON.stringify({
        health: agentOutputs.CustomerHealthAgent,
        contract: agentOutputs.ContractAgent,
        crm: agentOutputs.CRMContextAgent,
        knowledge: agentOutputs.KnowledgeAgent,
        completeness: agentOutputs.DataCompletenessAgent
    }, null, 2);

    const prompt = `
You are a Senior Customer Success business analyst. Synthesize the following agent outputs into a business assessment.

Agent Outputs:
${summaryForLLM}

Return ONLY valid JSON:
{
  "riskSummary": "<2 sentence executive summary of the key risks>",
  "opportunitySummary": "<1 sentence on expansion opportunities>",
  "urgency": "<immediate | soon | planned>",
  "businessContext": "<1 sentence describing the overall customer situation>",
  "priorityFocus": "<the single most important thing the CSM should do first>"
}
`;

    try {
        const response = await askGemini(prompt);
        const llmInsight = parseJsonSafely(response, {});

        return {
            ...deterministicResult,
            riskSummary: llmInsight.riskSummary || "",
            opportunitySummary: llmInsight.opportunitySummary || "",
            urgency: ["immediate", "soon", "planned"].includes(llmInsight.urgency)
                ? llmInsight.urgency : "soon",
            businessContext: llmInsight.businessContext || "",
            priorityFocus: llmInsight.priorityFocus || ""
        };
    } catch (error) {
        return deterministicResult;
    }
}

businessReasoningAgent.deterministicReasoning = deterministicReasoning;

module.exports = businessReasoningAgent;
