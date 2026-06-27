/**
 * CONTRACT AGENT
 *
 * Parses contractText directly with regex.
 * It does not use contracts.json.
 */
function contractAgent(uploadedText) {
    const contractText = uploadedText.contractText || "";

    const renewalDate =
        contractText.match(/Renewal Date:\s*([^\n]+)/i)?.[1]?.trim() ||
        contractText.match(/renews?\s+(?:on|by)\s+([^\n.]+)/i)?.[1]?.trim() ||
        null;

    const contractValueText =
        contractText.match(/Contract Value:\s*\$?\s*([0-9,]+)/i)?.[1] ||
        contractText.match(/ARR:\s*\$?\s*([0-9,]+)/i)?.[1];

    const contractValue = contractValueText
        ? Number(contractValueText.replace(/,/g, ""))
        : null;

    const autoRenewText =
        contractText.match(/Auto Renewal:\s*([^\n]+)/i)?.[1]?.toLowerCase() ||
        "";

    const autoRenew = autoRenewText
        ? (
            autoRenewText.includes("yes") ||
            autoRenewText.includes("true") ||
            autoRenewText.includes("enabled")
        )
        : null;

    const discountText =
        contractText.match(/Maximum Discount Allowed:\s*([^\n]+)/i)?.[1] ||
        contractText.match(/discount(?:s)?(?:\s+allowed)?\s*(?:up to)?\s*(\d+%?)/i)?.[1] ||
        "";

    const discountAllowed =
        Boolean(discountText) &&
        !discountText.toLowerCase().includes("not allowed");

    const maximumDiscountPercent =
        Number(discountText.match(/(\d+)/)?.[1] || 0);

    const slaTerms =
        contractText.match(/SLA Terms:\s*([^\n]+)/i)?.[1]?.trim() ||
        contractText.match(/SLA:\s*([^\n]+)/i)?.[1]?.trim() ||
        null;

    return {
        renewalDate,
        contractValue,
        autoRenew,
        discountAllowed,
        maximumDiscountPercent,
        maxDiscountPercent: maximumDiscountPercent,
        slaTerms,
        sla: slaTerms,
        evidence: [
            ...(renewalDate ? [`Renewal Date: ${renewalDate}`] : []),
            ...(contractValue ? [`Contract Value: ${contractValue}`] : []),
            ...(autoRenew === true ? ["Auto renewal enabled."] : []),
            ...(autoRenew === false ? ["Auto renewal disabled."] : []),
            ...(discountAllowed
                ? [`Maximum discount allowed: ${maximumDiscountPercent}%`]
                : [])
        ]
    };
}

module.exports = contractAgent;
