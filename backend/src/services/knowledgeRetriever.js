const fs = require("fs");
const path = require("path");

const KNOWLEDGE_ROOT = path.join(__dirname, "../knowledge");
const SUPPORTED_EXTENSIONS = new Set([".md", ".txt"]);

const CATEGORY_WEIGHTS = {
    playbooks: 4,
    best_practices: 3,
    policies: 3,
    faq: 2,
    product_docs: 2
};

const STOP_WORDS = new Set([
    "about",
    "after",
    "also",
    "been",
    "being",
    "contract",
    "customer",
    "customers",
    "from",
    "have",
    "into",
    "more",
    "multiple",
    "priority",
    "review",
    "that",
    "their",
    "there",
    "this",
    "ticket",
    "tickets",
    "with",
    "within"
]);

const SIGNALS = [
    {
        name: "renewal risk",
        terms: ["renewal", "renew", "expiration", "auto renewal", "timeline"],
        titles: ["Customer Renewal Playbook", "Churn Prevention Guide"]
    },
    {
        name: "low adoption",
        terms: ["adoption", "usage", "login", "onboarding", "inactive", "feature"],
        titles: ["Product Adoption Playbook", "Product Feature Documentation"]
    },
    {
        name: "support escalation",
        terms: ["support", "sla", "priority 1", "p1", "escalation", "escalate", "unresolved", "production issue"],
        titles: ["Customer Support Escalation Playbook", "Service Level Agreement"]
    },
    {
        name: "executive engagement",
        terms: ["executive", "stakeholder", "sponsor", "ebr", "business review"],
        titles: ["Executive Business Review Guide", "Customer Renewal Playbook"]
    },
    {
        name: "pricing discount",
        terms: ["discount", "pricing", "license", "licenses", "enterprise", "negotiated"],
        titles: ["Pricing Documentation", "Customer Success FAQ"]
    },
    {
        name: "churn signal",
        terms: ["competitor", "churn", "nps", "complaint", "complaints", "dissatisfaction"],
        titles: ["Churn Prevention Guide", "Customer Success Best Practices"]
    }
];

function normalizeText(value) {
    return String(value || "")
        .replace(/^\uFEFF/, "")
        .replace(/\r\n/g, "\n");
}

function walkKnowledgeFiles(directory) {
    if (!fs.existsSync(directory)) {
        return [];
    }

    return fs.readdirSync(directory, { withFileTypes: true })
        .flatMap((entry) => {
            const fullPath = path.join(directory, entry.name);

            if (entry.isDirectory()) {
                return walkKnowledgeFiles(fullPath);
            }

            return entry.isFile() && SUPPORTED_EXTENSIONS.has(path.extname(entry.name).toLowerCase())
                ? [fullPath]
                : [];
        });
}

function titleFromFile(filePath) {
    return path.basename(filePath, path.extname(filePath))
        .split(/[-_]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

function extractTitle(content, filePath) {
    const match = content.match(/^TITLE:\s*(.+)$/im);
    return match ? match[1].trim() : titleFromFile(filePath);
}

function isSectionHeading(line) {
    const trimmed = line.trim();

    return trimmed.length > 2 &&
        trimmed.length < 80 &&
        /^[A-Z][A-Z0-9\s_-]+$/.test(trimmed) &&
        !/^TITLE:/.test(trimmed);
}

function splitIntoChunks(document) {
    const chunks = [];
    let currentHeading = "Overview";
    let currentLines = [];

    function pushCurrent() {
        const text = currentLines.join("\n").trim();

        if (!text) {
            return;
        }

        chunks.push({
            title: document.title,
            category: document.category,
            source: document.source,
            action: document.action,
            heading: currentHeading,
            text
        });
    }

    document.content
        .split("\n")
        .forEach((line) => {
            if (isSectionHeading(line)) {
                pushCurrent();
                currentHeading = line.trim();
                currentLines = [];
                return;
            }

            if (!/^TITLE:/i.test(line)) {
                currentLines.push(line);
            }
        });

    pushCurrent();

    if (!chunks.length) {
        chunks.push({
            title: document.title,
            category: document.category,
            source: document.source,
            action: document.action,
            heading: "Document",
            text: document.content.replace(/^TITLE:\s*.+$/im, "").trim()
        });
    }

    return chunks;
}

function extractRecommendedAction(content) {
    const section = content.match(
        /RECOMMENDED ACTIONS\s+([\s\S]*?)(?:\n[A-Z][A-Z0-9\s_-]+(?:\n|$)|$)/
    );

    if (section) {
        const firstAction = section[1]
            .split("\n")
            .map((line) => line.trim())
            .find((line) => /^\d+\.\s+/.test(line));

        if (firstAction) {
            return firstAction.replace(/^\d+\.\s+/, "").replace(/\.$/, "");
        }
    }

    const answer = content.match(/Answer\s+([\s\S]*?)(?:\nQuestion\s+|$)/i);

    if (answer) {
        return answer[1].trim().split("\n").filter(Boolean)[0]?.replace(/\.$/, "") || "Review knowledge guidance";
    }

    return "Review knowledge guidance";
}

function loadKnowledgeBase() {
    return walkKnowledgeFiles(KNOWLEDGE_ROOT)
        .map((filePath) => {
            const content = normalizeText(fs.readFileSync(filePath, "utf8"));
            const category = path.basename(path.dirname(filePath));

            return {
                title: extractTitle(content, filePath),
                category,
                content,
                action: extractRecommendedAction(content),
                source: path.relative(KNOWLEDGE_ROOT, filePath).replace(/\\/g, "/")
            };
        });
}

function tokenize(text) {
    return [...new Set(String(text || "").toLowerCase().split(/[^a-z0-9]+/))]
        .filter((term) => term.length > 2 && !STOP_WORDS.has(term));
}

function scoreChunk(chunk, query) {
    const queryText = String(query || "").toLowerCase();
    const chunkText = `${chunk.title}\n${chunk.heading}\n${chunk.text}`.toLowerCase();
    const queryTerms = tokenize(queryText);

    const termScore = queryTerms.reduce((score, term) => {
        if (chunkText.includes(term)) {
            return score + (term.length > 5 ? 2 : 1);
        }

        return score;
    }, 0);

    const signalScore = SIGNALS.reduce((score, signal) => {
        const hasQuerySignal = signal.terms.some((term) => queryText.includes(term));

        if (!hasQuerySignal) {
            return score;
        }

        const titleMatch = signal.titles.includes(chunk.title);
        const textMatch = signal.terms.some((term) => chunkText.includes(term));

        return score + (titleMatch ? 10 : 0) + (textMatch ? 4 : 0);
    }, 0);

    const categoryScore = CATEGORY_WEIGHTS[chunk.category] || 1;

    return termScore + signalScore + categoryScore;
}

function compactSnippet(text, maxLength = 260) {
    const normalized = text
        .replace(/\s+/g, " ")
        .trim();

    if (normalized.length <= maxLength) {
        return normalized;
    }

    const boundary = normalized.lastIndexOf(" ", maxLength - 3);
    const end = boundary > 120 ? boundary : maxLength - 3;

    return `${normalized.slice(0, end).trim()}...`;
}

function retrieveKnowledge(query, options = {}) {
    const limit = options.limit || 5;
    const documents = loadKnowledgeBase();
    const rankedChunks = documents
        .flatMap(splitIntoChunks)
        .map((chunk) => ({
            ...chunk,
            score: scoreChunk(chunk, query)
        }))
        .filter((chunk) => chunk.score > 3)
        .sort((a, b) => b.score - a.score);

    const grouped = new Map();

    rankedChunks.forEach((chunk) => {
        if (!grouped.has(chunk.source)) {
            grouped.set(chunk.source, {
                title: chunk.title,
                category: chunk.category,
                source: chunk.source,
                action: chunk.action,
                score: 0,
                snippets: []
            });
        }

        const document = grouped.get(chunk.source);
        document.score += chunk.score;

        if (document.snippets.length < 2) {
            document.snippets.push({
                heading: chunk.heading,
                text: compactSnippet(chunk.text),
                score: chunk.score
            });
        }
    });

    return [...grouped.values()]
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}

module.exports = {
    loadKnowledgeBase,
    retrieveKnowledge,
    splitIntoChunks
};

