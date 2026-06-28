/**
 * PLANNER AGENT
 *
 * Purpose:
 * Analyze uploaded documents
 * and determine which agents
 * should execute.
 */

function plannerAgent(uploadedText) {

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
        text.includes("playbook")

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

            "CustomerHealthAgent",
            "ContractAgent",
            "KnowledgeAgent",
            "CRMContextAgent"
        ];
    }


    /**
     * Remove duplicates.
     */
    return [...new Set(executionPlan)];
}


module.exports =
    plannerAgent;