const { askGemini } = require("../../services/geminiService");
const { parseJsonSafely } = require("../../utils/jsonUtils");

const AVAILABLE_AGENTS = [
    "CustomerHealthAgent",
    "ContractAgent",
    "KnowledgeAgent",
    "CRMContextAgent"
];

function ruleBasedPlanner(uploadedText) {

    const text = [

        uploadedText.contractText,
        uploadedText.meetingText,
        uploadedText.emailText

    ]
        .join("\n")
        .toLowerCase();


    const executionPlan = [];


    /**
     * Customer Health Signals
     */
    if (

        text.includes("adoption") ||
        text.includes("usage") ||
        text.includes("login") ||
        text.includes("frustrated") ||
        text.includes("nps") ||
        text.includes("csat")

    ) {

        executionPlan.push(
            "CustomerHealthAgent"
        );
    }


    /**
     * Contract Signals
     */
    if (

        text.includes("renew") ||
        text.includes("contract") ||
        text.includes("sla") ||
        text.includes("discount") ||
        text.includes("auto renewal") ||
        text.includes("arr")

    ) {

        executionPlan.push(
            "ContractAgent"
        );
    }


    /**
     * Knowledge Signals
     */
    if (

        text.includes("unhappy") ||
        text.includes("issue") ||
        text.includes("support") ||
        text.includes("escalate") ||
        text.includes("playbook") ||
        text.includes("renew") ||
        text.includes("adoption") ||
        text.includes("discount") ||
        text.includes("competitor") ||
        text.includes("sla")

    ) {

        executionPlan.push(
            "KnowledgeAgent"
        );
    }


    /**
     * CRM Signals
     */
    if (

        text.includes("enterprise") ||
        text.includes("stakeholder") ||
        text.includes("budget") ||
        text.includes("expansion") ||
        text.includes("analytics") ||
        text.includes("executive sponsor")

    ) {

        executionPlan.push(
            "CRMContextAgent"
        );
    }


    /**
     * IMPORTANT:
     * If fewer than 2 agents were selected,
     * run all agents.
     *
     * This helps with incomplete
     * real-world documents.
     */
    if (executionPlan.length < 2) {

        return [

            ...AVAILABLE_AGENTS
        ];
    }


    /**
     * Remove duplicates.
     */
    return [...new Set(executionPlan)];
}

function buildDocumentText(uploadedText) {
    return [
        uploadedText.contractText,
        uploadedText.meetingText,
        uploadedText.emailText
    ]
        .filter(Boolean)
        .join("\n\n");
}

function normalizePlan(parsed, fallbackAgents) {
    const agents = Array.isArray(parsed?.agents)
        ? parsed.agents.filter((agent) => AVAILABLE_AGENTS.includes(agent))
        : [];

    return {
        agents: agents.length
            ? [...new Set(agents)]
            : fallbackAgents,

        reasoning: typeof parsed?.reasoning === "string" && parsed.reasoning.trim()
            ? parsed.reasoning.trim()
            : "Fallback planner selected agents using deterministic rules."
    };
}

async function plannerAgent(uploadedText) {
    const fallbackAgents = ruleBasedPlanner(uploadedText);
    const documentText = buildDocumentText(uploadedText);

    const prompt = `
You are the orchestration planner for RenewAI.

Available agents:

CustomerHealthAgent:
- Adoption
- Usage
- NPS
- Churn

ContractAgent:
- Contracts
- Renewals
- Discounts
- SLAs

CRMContextAgent:
- Stakeholders
- Executive sponsors
- Expansion opportunities

KnowledgeAgent:
- Support tickets
- Customer complaints
- Technical issues

Return ONLY valid JSON:

{
  "agents": [
    "CustomerHealthAgent",
    "ContractAgent"
  ],
  "reasoning": "The documents discuss adoption issues and contract renewals."
}

Documents:

${documentText}
`;

    try {
        const response = await askGemini(prompt);
        const parsed = parseJsonSafely(response, {
            agents: fallbackAgents,
            reasoning: "Fallback planner selected agents using deterministic rules."
        });

        return normalizePlan(parsed, fallbackAgents);
    }
    catch (error) {
        return {
            agents: fallbackAgents,
            reasoning: "Fallback planner selected agents using deterministic rules."
        };
    }
}

plannerAgent.ruleBasedPlanner = ruleBasedPlanner;

module.exports =
    plannerAgent;

