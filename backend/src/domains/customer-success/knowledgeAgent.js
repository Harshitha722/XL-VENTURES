const {
    loadKnowledgeBase,
    retrieveKnowledge
} = require("../../services/knowledgeRetriever");

function buildQuery(uploadedText) {
    return [
        uploadedText.contractText,
        uploadedText.meetingText,
        uploadedText.emailText,
        ...(uploadedText.evidence || [])
    ]
        .filter(Boolean)
        .join("\n");
}

/**
 * KNOWLEDGE AGENT
 *
 * Retrieves the most relevant internal knowledge chunks for the uploaded
 * customer context. This is local lexical RAG; the retriever can be swapped
 * with embeddings/vector search later without changing this output contract.
 */
function knowledgeAgent(uploadedText) {
    const query = buildQuery(uploadedText || {});
    const matches = retrieveKnowledge(query, {
        limit: 5
    });

    const playbooks = matches.map((match) => ({
        trigger: match.title,
        action: match.action,
        category: match.category,
        source: match.source,
        score: match.score,
        snippets: match.snippets
    }));

    return {
        playbooks,
        evidence: matches.flatMap((match) =>
            match.snippets.map((snippet) =>
                `${match.title} / ${snippet.heading}: ${snippet.text} (${match.source})`
            )
        ).slice(0, 8)
    };
}

knowledgeAgent.loadKnowledgeBase =
    loadKnowledgeBase;

knowledgeAgent.retrieveKnowledge =
    retrieveKnowledge;

module.exports = knowledgeAgent;
