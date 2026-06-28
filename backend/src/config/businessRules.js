const BUSINESS_RULES = {
    customerHealth: {
        highRiskAdoptionThreshold: 45,
        mediumRiskAdoptionThreshold: 65,
        lowAdoptionThreshold: 50,
        lowNpsThreshold: 5,
        frequentEscalationThreshold: 1
    },
    contract: {
        renewalHighRiskDays: 90,
        renewalMediumRiskDays: 180,
        defaultRenewalRisk: "medium"
    },
    recommendations: {
        maxRecommendations: 6,
        minRecommendations: 3
    },
    successMetrics: {
        targetChurnReduction: 40,
        targetAdoptionIncrease: 20,
        renewalConfirmationDays: 30,
        npsImprovementTarget: 3
    }
};

module.exports = BUSINESS_RULES;
