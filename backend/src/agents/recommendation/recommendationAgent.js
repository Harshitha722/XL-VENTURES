const { askGemini } = require("../../services/geminiService");
const { parseJsonSafely } = require("../../utils/jsonUtils");
const { getRecommendationMemoryContext } = require("../../memory/memoryRetriever");
const BUSINESS_RULES = require("../../config/businessRules");

function ruleBasedRecommendations(reasoning) {

    const recommendations = [];

    /**
     * =========================
     * Handle Risks
     * =========================
     */
    reasoning.risks.forEach((risk) => {

        switch (risk) {

            case "churn risk":

                recommendations.push({

                    priority: "HIGH",

                    action:
                        "Schedule Executive Business Review",

                    timeline:
                        "7 days",

                    impact:
                        "Reduce churn probability"
                });

                break;


            case "low product adoption":

                recommendations.push({

                    priority: "HIGH",

                    action:
                        "Conduct Adoption Workshop",

                    timeline:
                        "14 days",

                    impact:
                        "Increase product adoption"
                });

                break;


            case "renewal risk":

                recommendations.push({

                    priority: "MEDIUM",

                    action:
                        "Initiate Renewal Discussion",

                    timeline:
                        "7 days",

                    impact:
                        "Protect renewal revenue"
                });

                break;


            case "customer dissatisfaction":

                recommendations.push({

                    priority: "HIGH",

                    action:
                        "Escalate to Senior Customer Success Manager",

                    timeline:
                        "3 days",

                    impact:
                        "Improve customer sentiment"
                });

                break;


            case "frequent escalations":

                recommendations.push({

                    priority: "MEDIUM",

                    action:
                        "Review Historical Support Issues",

                    timeline:
                        "10 days",

                    impact:
                        "Reduce recurring escalations"
                });

                break;
        }
    });


    /**
     * =========================
     * Handle Opportunities
     * =========================
     */
    reasoning.opportunities.forEach((opportunity) => {

        switch (opportunity) {

            case "upsell opportunity":

                recommendations.push({

                    priority: "MEDIUM",

                    action:
                        "Explore Upsell Opportunities",

                    timeline:
                        "30 days",

                    impact:
                        "Identify expansion revenue"
                });

                break;


            case "retention discount strategy":

                recommendations.push({

                    priority: "MEDIUM",

                    action:
                        "Offer Renewal Incentive",

                    timeline:
                        "14 days",

                    impact:
                        "Improve retention likelihood"
                });

                break;
        }
    });


    /**
     * =========================
     * Handle Missing Information
     * =========================
     */
    reasoning.missingInformation.forEach((item) => {

        switch (item) {

            case "adoption metrics":

                recommendations.push({

                    priority: "HIGH",

                    action:
                        "Collect Product Usage Analytics",

                    timeline:
                        "5 days",

                    impact:
                        "Improve analysis confidence"
                });

                break;


            case "NPS score":

                recommendations.push({

                    priority: "MEDIUM",

                    action:
                        "Conduct Customer Satisfaction Survey",

                    timeline:
                        "7 days",

                    impact:
                        "Measure customer sentiment"
                });

                break;


            case "renewal date":

                recommendations.push({

                    priority: "HIGH",

                    action:
                        "Request Contract Information",

                    timeline:
                        "3 days",

                    impact:
                        "Clarify renewal exposure"
                });

                break;


            case "contract value":

                recommendations.push({

                    priority: "LOW",

                    action:
                        "Verify Contract Value Information",

                    timeline:
                        "5 days",

                    impact:
                        "Improve revenue forecasting"
                });

                break;


            case "executive sponsor":

                recommendations.push({

                    priority: "MEDIUM",

                    action:
                        "Identify Executive Sponsor",

                    timeline:
                        "10 days",

                    impact:
                        "Strengthen executive alignment"
                });

                break;


            case "renewal meeting confirmation":

                recommendations.push({

                    priority: "LOW",

                    action:
                        "Schedule Renewal Planning Meeting",

                    timeline:
                        "14 days",

                    impact:
                        "Create renewal action plan"
                });

                break;
        }
    });



    /**
     * =========================
     * Handle Retrieved Knowledge
     * =========================
     */
    (reasoning.knowledgeGuidance || [])
        .filter((item) =>
            item &&
            item.action &&
            item.action !== "Review knowledge guidance"
        )
        .slice(0, 5)
        .forEach((item) => {

            recommendations.push({

                priority:
                    item.category === "playbooks" || item.category === "policies"
                        ? "HIGH"
                        : "MEDIUM",

                action:
                    item.action,

                timeline:
                    item.category === "policies"
                        ? "3 days"
                        : "7 days",

                impact:
                    `Apply internal guidance from ${item.title}`
            });
        });

    /**
     * Remove duplicate actions.
     */
    return recommendations.filter(

        (item, index, self) =>

            index === self.findIndex(

                (x) =>
                    x.action === item.action
            )
    );
}

function normalizeRecommendations(items, fallback) {
    if (!Array.isArray(items)) {
        return fallback;
    }

    const normalized = items
        .filter((item) =>
            item &&
            typeof item.action === "string" &&
            item.action.trim()
        )
        .map((item) => ({
            priority:
                ["HIGH", "MEDIUM", "LOW"].includes(item.priority)
                    ? item.priority
                    : "MEDIUM",

            action:
                item.action.trim(),

            timeline:
                typeof item.timeline === "string" && item.timeline.trim()
                    ? item.timeline.trim()
                    : "14 days",

            impact:
                typeof item.impact === "string" && item.impact.trim()
                    ? item.impact.trim()
                    : "Improve customer outcome"
        }))
        .filter(
            (item, index, self) =>
                index === self.findIndex((x) => x.action === item.action)
        );

    return normalized.length ? normalized : fallback;
}

async function recommendationAgent(reasoning, scenarioAnalysis = {}, devilsAdvocateReview = {}) {
    const fallback = ruleBasedRecommendations(reasoning);
    const memoryContext = getRecommendationMemoryContext();

    const prompt = `
You are a Senior Customer Success Strategist.
You receive business reasoning, multiple simulated scenarios, and a Devil's Advocate critique.

Business Analysis:
${JSON.stringify(reasoning, null, 2)}

Simulated Scenarios:
${JSON.stringify(scenarioAnalysis.scenarios || [], null, 2)}

Best Scenario:
${JSON.stringify(scenarioAnalysis.bestScenario || {}, null, 2)}

Devil's Advocate Feedback:
${JSON.stringify(devilsAdvocateReview, null, 2)}

Previously approved recommendation patterns:
${memoryContext}

Generate the Final Next Best Action, evidence, and confidence. If the Devil's Advocate review identifies a better alternative, incorporate that into your final decision.

Return ONLY valid JSON:
{
  "finalRecommendation": {
    "priority": "HIGH",
    "action": "Quarterly Payment Plan",
    "timeline": "7 days",
    "impact": "Highest long-term business value"
  },
  "reason": "Highest long-term business value.",
  "evidence": [
    "91% renewal probability",
    "Revenue preserved",
    "Lower churn risk",
    "Devil's Advocate found discount unnecessary"
  ],
  "confidence": 93
}
`;

    try {
        const response = await askGemini(prompt);
        const parsed = parseJsonSafely(response, {
            finalRecommendation: null,
            reason: "",
            evidence: [],
            confidence: 0
        });

        const recommendations = normalizeRecommendations(
            parsed.finalRecommendation ? [parsed.finalRecommendation] : fallback,
            fallback
        ).slice(0, BUSINESS_RULES.recommendations.maxRecommendations);

        return {
            recommendations,
            finalRecommendation: parsed.finalRecommendation || recommendations[0] || null,
            reason: parsed.reason || "Based on the highest scoring scenario and business context.",
            evidence: Array.isArray(parsed.evidence) ? parsed.evidence : [],
            confidence: Number(parsed.confidence) || 0
        };
    }
    catch (error) {
        return {
            recommendations: fallback.slice(0, BUSINESS_RULES.recommendations.maxRecommendations),
            finalRecommendation: fallback[0] || null,
            reason: "Based on deterministic recommendation rules.",
            evidence: [],
            confidence: 0
        };
    }
}

recommendationAgent.ruleBasedRecommendations = ruleBasedRecommendations;


module.exports =
    recommendationAgent;

