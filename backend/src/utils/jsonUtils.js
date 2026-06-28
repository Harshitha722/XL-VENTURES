function extractJson(text) {
    if (!text || typeof text !== "string") {
        return "";
    }

    const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);

    if (fencedMatch) {
        return fencedMatch[1].trim();
    }

    const firstObject = text.indexOf("{");
    const firstArray = text.indexOf("[");

    let start = -1;
    let end = -1;

    if (firstArray !== -1 && (firstObject === -1 || firstArray < firstObject)) {
        start = firstArray;
        end = text.lastIndexOf("]");
    }
    else if (firstObject !== -1) {
        start = firstObject;
        end = text.lastIndexOf("}");
    }

    if (start === -1 || end === -1 || end <= start) {
        return text.trim();
    }

    return text.slice(start, end + 1).trim();
}

function parseJsonSafely(text, fallback) {
    try {
        return JSON.parse(extractJson(text));
    }
    catch (error) {
        return fallback;
    }
}

module.exports = {
    parseJsonSafely
};
