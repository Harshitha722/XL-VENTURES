const CRMProvider = require("./CRMProvider");

class MockCRMAdapter extends CRMProvider {
    async getCustomer(id) {
        return {
            id,
            name: id === "northstar" ? "Northstar Health" : "Acme Enterprise",
            tier: "Enterprise",
            arr: 420000,
            healthScore: 68,
            owner: "CSM Team",
            tenantId: "default-tenant"
        };
    }

    async getOpportunities(id) {
        return [
            {
                id: `opp_${id}_expansion`,
                customerId: id,
                name: "AI workflow expansion",
                stage: "Discovery",
                amount: 125000,
                probability: 62
            }
        ];
    }

    async getActivities(id) {
        return [
            {
                id: `act_${id}_ebr`,
                customerId: id,
                type: "meeting",
                subject: "Executive success review requested",
                occurredAt: new Date().toISOString()
            }
        ];
    }
}

module.exports = MockCRMAdapter;
