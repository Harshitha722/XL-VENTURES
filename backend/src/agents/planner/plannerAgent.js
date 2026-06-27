/**
 * PLANNER AGENT
 *
 * Purpose:
 * Analyze incoming customer interaction
 * and determine which agents should run.
 *
 * This is the heart of our agentic system.
 */


function plannerAgent(interactionText) {

    // Convert to lowercase
    const text =
        interactionText.toLowerCase();

    const executionPlan = [];

    /**
     * Detect adoption concerns.
     */
    if (
        text.includes("adoption") ||
        text.includes("usage") ||
        text.includes("login")
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
        text.includes("support")
    ) {

        executionPlan.push(
            "KnowledgeAgent"
        );
    }

    /**
     * CRM context is useful
     * for almost every case.
     */
    executionPlan.push(
        "CRMContextAgent"
    );

    /**
     * Remove duplicates.
     */
    return [...new Set(executionPlan)];
}


module.exports = plannerAgent;