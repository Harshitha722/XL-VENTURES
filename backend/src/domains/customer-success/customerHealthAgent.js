/**
 * CUSTOMER HEALTH AGENT
 *
 * Reads uploaded meeting and email text.
 * It does not use customers.json.
 */
function customerHealthAgent(uploadedText) {
    const combinedText = [
        uploadedText.meetingText,
        uploadedText.emailText,
        uploadedText.contractText
    ].join("\n");

    const text = combinedText.toLowerCase();

    /**
     * Keep extraction beginner-friendly:
     * 1. Prefer explicit numbers like "adoption: 42%".
     * 2. Fall back to simple phrase heuristics.
     */
    const adoptionMatch =
        combinedText.match(/adoption\s*(?:is|:|-)?\s*(\d+)%?/i);

    let adoption = adoptionMatch
        ? Number(adoptionMatch[1])
        : null;

    if (adoption === null && text.includes("low adoption")) {
        adoption = 35;
    }

    if (adoption === null && text.includes("strong adoption")) {
        adoption = 80;
    }

    const npsMatch =
        combinedText.match(/nps\s*(?:is|:|-)?\s*(-?\d+)/i);

    let nps = npsMatch
        ? Number(npsMatch[1])
        : null;

    if (nps === null && text.includes("happy customers")) {
        nps = 8;
    }

    if (nps === null && text.includes("frustrated")) {
        nps = 3;
    }

    const csatMatch =
        combinedText.match(/csat\s*(?:is|:|-)?\s*(\d+(?:\.\d+)?)/i);

    const csat = csatMatch
        ? Number(csatMatch[1])
        : null;

    let risk = "low";

    if (
        text.includes("frustrated") ||
        text.includes("may not renew") ||
        text.includes("churn") ||
        (adoption !== null && adoption < 45) ||
        (nps !== null && nps < 5)
    ) {
        risk = "high";
    }
    else if (
        text.includes("concern") ||
        text.includes("slow usage") ||
        (adoption !== null && adoption < 65)
    ) {
        risk = "medium";
    }

    return {
        adoption,
        nps,
        csat,
        risk,
        evidence: [
            ...(text.includes("low adoption")
                ? ["Low adoption mentioned in uploaded documents."]
                : []),
            ...(text.includes("frustrated")
                ? ["Customer frustration detected in uploaded documents."]
                : []),
            ...(text.includes("may not renew")
                ? ["Customer stated they may not renew."]
                : [])
        ]
    };
}

module.exports = customerHealthAgent;
