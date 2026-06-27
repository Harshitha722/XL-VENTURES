/**
 * PLANNER AGENT
 *
 * Purpose:
 * Analyze incoming customer interaction
 * and determine which agents should run.
 *
 * This is the heart of our agentic system.
 */


function plannerAgent(uploadedText) {

    /**
     * The planner analyzes all uploaded content together.
     * For now this is keyword-based so it is easy to understand and extend.
     */
    const text =
        [
            uploadedText.contractText,
            uploadedText.meetingText,
            uploadedText.emailText
        ]
            .join("\n")
            .toLowerCase();

    const executionPlan = [];

    /**
     * Detect adoption concerns.
     */
    if (
        text.includes("adoption") ||
        text.includes("usage") ||
        text.includes("login") ||
        text.includes("frustrated")
    ) {

        executionPlan.push(
            "CustomerHealthAgent"
        );
    }

    /**
     * Detect renewal discussions.
     */
    if (
        text.includes("renew") ||
        text.includes("contract") ||
        text.includes("sla") ||
        text.includes("discount")
    ) {

        executionPlan.push(
            "ContractAgent"
        );
    }

    /**
     * Detect dissatisfaction.
     */
    if (
        text.includes("unhappy") ||
        text.includes("issue") ||
        text.includes("support") ||
        text.includes("escalate")
    ) {

        executionPlan.push(
            "KnowledgeAgent"
        );
    }

    if (
        text.includes("enterprise") ||
        text.includes("stakeholder") ||
        text.includes("budget") ||
        text.includes("expansion") ||
        text.includes("analytics")
    ) {

        executionPlan.push(
            "CRMContextAgent"
        );
    }

    if (!executionPlan.length) {
        executionPlan.push(
            "CustomerHealthAgent",
            "ContractAgent",
            "KnowledgeAgent",
            "CRMContextAgent"
        );
    }

    /**
     * Remove duplicates.
     */
    return [...new Set(executionPlan)];
}


module.exports = plannerAgent;
