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

async function recommendationAgent(reasoning) {
    const fallback = ruleBasedRecommendations(reasoning);
    const memoryContext = getRecommendationMemoryContext();

    const prompt = `
You are a Senior Customer Success Strategist.

Business Analysis:

${JSON.stringify(reasoning, null, 2)}

Previously approved recommendation patterns:

${memoryContext}

Generate 3 to ${BUSINESS_RULES.recommendations.maxRecommendations} prioritized recommendations. Prefer actions similar to approved history when they fit the current facts.

Return ONLY valid JSON:

[
  {
    "priority": "HIGH",
    "action": "Schedule Executive Review",
    "timeline": "7 days",
    "impact": "Reduce churn probability"
  }
]
`;

    try {
        const response = await askGemini(prompt);
        const parsed = parseJsonSafely(response, fallback);

        return normalizeRecommendations(parsed, fallback)
            .slice(0, BUSINESS_RULES.recommendations.maxRecommendations);
    }
    catch (error) {
        return fallback.slice(0, BUSINESS_RULES.recommendations.maxRecommendations);
    }
}

recommendationAgent.ruleBasedRecommendations = ruleBasedRecommendations;


module.exports =
    recommendationAgent;

