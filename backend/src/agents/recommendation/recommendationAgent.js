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
                        "Collect Product Usage Analytics"
                });

                break;


            case "NPS score":

                recommendations.push({

                    priority: "MEDIUM",

                    action:
                        "Conduct Customer Satisfaction Survey"
                });

                break;


            case "renewal date":

                recommendations.push({

                    priority: "HIGH",

                    action:
                        "Request Contract Information"
                });

                break;


            case "contract value":

                recommendations.push({

                    priority: "LOW",

                    action:
                        "Verify Contract Value Information"
                });

                break;


            case "executive sponsor":

                recommendations.push({

                    priority: "MEDIUM",

                    action:
                        "Identify Executive Sponsor"
                });

                break;


            case "renewal meeting confirmation":

                recommendations.push({

                    priority: "LOW",

                    action:
                        "Schedule Renewal Planning Meeting"
                });

                break;
        }
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


module.exports =
    recommendationAgent;