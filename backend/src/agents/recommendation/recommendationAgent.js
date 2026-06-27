/**
 * RECOMMENDATION AGENT
 *
 * Purpose:
 * Convert business insights
 * into actionable recommendations.
 */

function recommendationAgent(reasoning) {

    const recommendations = [];

    /**
     * Handle risks
     */
    reasoning.risks.forEach((risk) => {

        switch (risk) {

            case "churn risk":

                recommendations.push({

                    priority: "HIGH",

                    action:
                        "Schedule Executive Business Review"
                });

                break;


            case "low product adoption":

                recommendations.push({

                    priority: "HIGH",

                    action:
                        "Conduct Adoption Workshop"
                });

                break;


            case "renewal risk":

                recommendations.push({

                    priority: "MEDIUM",

                    action:
                        "Initiate Renewal Discussion"
                });

                break;


            case "customer dissatisfaction":

                recommendations.push({

                    priority: "HIGH",

                    action:
                        "Escalate to Senior Customer Success Manager"
                });

                break;


            case "frequent escalations":

                recommendations.push({

                    priority: "MEDIUM",

                    action:
                        "Review Historical Support Issues"
                });

                break;
        }
    });


    /**
     * Handle opportunities
     */
    reasoning.opportunities.forEach((opportunity) => {

        switch (opportunity) {

            case "upsell opportunity":

                recommendations.push({

                    priority: "MEDIUM",

                    action:
                        "Explore Upsell Opportunities"
                });

                break;


            case "retention discount strategy":

                recommendations.push({

                    priority: "MEDIUM",

                    action:
                        "Offer Renewal Incentive"
                });

                break;
        }
    });


    return recommendations;
}


module.exports =
    recommendationAgent;