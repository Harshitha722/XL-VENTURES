const PLAYBOOKS = {
    lowAdoption: {
        trigger: "Low adoption",
        action: "Conduct Adoption Workshop"
    },
    escalation: {
        trigger: "Escalation",
        action: "Executive Business Review"
    },
    renewalRisk: {
        trigger: "Renewal risk",
        action: "Initiate Renewal Process"
    }
};

/**
 * KNOWLEDGE AGENT
 *
 * Uses internal static mappings derived from uploaded documents.
 * The shape stays modular so a vector database can replace this later.
 */
function knowledgeAgent(uploadedText) {
    const text = [
        uploadedText.contractText,
        uploadedText.meetingText,
        uploadedText.emailText
    ]
        .join("\n")
        .toLowerCase();

    const playbooks = [];

    if (text.includes("low adoption") || text.includes("adoption")) {
        playbooks.push(PLAYBOOKS.lowAdoption);
    }

    if (
        text.includes("escalation") ||
        text.includes("escalate") ||
        text.includes("executive review")
    ) {
        playbooks.push(PLAYBOOKS.escalation);
    }

    if (
        text.includes("may not renew") ||
        text.includes("renewal risk") ||
        text.includes("auto renewal: no")
    ) {
        playbooks.push(PLAYBOOKS.renewalRisk);
    }

    return {
        playbooks,
        evidence: playbooks.map(
            (playbook) => `${playbook.trigger} playbook selected.`
        )
    };
}

module.exports = knowledgeAgent;

