const playbooks = require("../../data/playbooks.json");

/**
 * Knowledge Agent
 *
 * Purpose:
 * Retrieve customer-success
 * playbooks.
 */
function knowledgeAgent(problemType) {

    const playbook = playbooks.find(
        p => p.type === problemType
    );

    if (!playbook) {

        return {
            playbook:
                "No playbook found."
        };
    }

    return {

        title: playbook.title,

        actions: playbook.actions
    };
}

module.exports = knowledgeAgent;