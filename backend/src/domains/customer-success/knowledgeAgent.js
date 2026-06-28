const { retrievePlaybooks, keywordRetrieve } = require("../../knowledge/vectorStore");

function buildKnowledgeQuery(uploadedText) {
    return [
        uploadedText.contractText,
        uploadedText.meetingText,
        uploadedText.emailText,
        uploadedText.evidence?.join("\n")
    ].filter(Boolean).join("\n\n");
}

async function knowledgeAgent(uploadedText) {
    const query = buildKnowledgeQuery(uploadedText);
    const fallback = keywordRetrieve(query, 3);

    try {
        const retrievedKnowledge = await retrievePlaybooks(query, 3);

        return {
            retrievedKnowledge,
            playbooks: retrievedKnowledge.map((item) => ({
                trigger: item.title,
                action: item.content
            })),
            evidence: retrievedKnowledge.map((item) => `${item.title} retrieved via ${item.retrievalMethod}.`)
        };
    } catch (error) {
        return {
            retrievedKnowledge: fallback,
            playbooks: fallback.map((item) => ({
                trigger: item.title,
                action: item.content
            })),
            evidence: fallback.map((item) => `${item.title} retrieved via keyword fallback.`)
        };
    }
}

module.exports = knowledgeAgent;
