const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", "..", ".env") });

const { GoogleGenAI } = require("@google/genai");
const PLAYBOOK_CORPUS = require("./playbookCorpus");

const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001";
let embeddingCache = null;
let client = null;

function getClient() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
        return null;
    }

    if (!client) {
        client = new GoogleGenAI({ apiKey });
    }

    return client;
}

function entryText(entry) {
    return `${entry.title}\n${entry.category}\n${entry.content}\n${entry.tags.join(" ")}`;
}

async function embedText(text) {
    const gemini = getClient();

    if (!gemini) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }

    const response = await gemini.models.embedContent({
        model: EMBEDDING_MODEL,
        contents: text
    });

    const embedding = response.embeddings?.[0] || response.embedding;
    const values = embedding?.values || embedding?.valuesFloat || [];

    if (!values.length) {
        throw new Error("Gemini embedding response did not include vector values.");
    }

    return values;
}

function cosineSimilarity(a, b) {
    if (!a.length || !b.length || a.length !== b.length) {
        return 0;
    }

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i += 1) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function keywordRetrieve(query, topK = 3) {
    const terms = query
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((term) => term.length > 2);

    return PLAYBOOK_CORPUS
        .map((entry) => {
            const searchable = entryText(entry).toLowerCase();
            const score = terms.reduce((sum, term) => (
                searchable.includes(term) ? sum + 1 : sum
            ), 0);

            return { ...entry, similarity: score, retrievalMethod: "keyword" };
        })
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK);
}

async function buildEmbeddingCache() {
    if (embeddingCache) {
        return embeddingCache;
    }

    console.log("Building embedding cache...");

    embeddingCache = await Promise.all(
        PLAYBOOK_CORPUS.map(async (entry) => ({
            entry,
            embedding: await embedText(entryText(entry))
        }))
    );

    return embeddingCache;
}

async function retrievePlaybooks(query, topK = 3) {
    if (!query.trim()) {
        return keywordRetrieve(query, topK);
    }

    try {
        const cache = await buildEmbeddingCache();
        const queryEmbedding = await embedText(query);

        return cache
            .map(({ entry, embedding }) => ({
                ...entry,
                similarity: Number(cosineSimilarity(queryEmbedding, embedding).toFixed(4)),
                retrievalMethod: "embedding"
            }))
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, topK);
    } catch (error) {
        console.warn(
            `Gemini embedding retrieval failed; using keyword fallback. ${error.message}`
        );
        return keywordRetrieve(query, topK);
    }
}

module.exports = {
    retrievePlaybooks,
    keywordRetrieve
};
