class CRMProvider {
    async getCustomer() {
        throw new Error("getCustomer must be implemented by a CRM adapter.");
    }

    async getOpportunities() {
        throw new Error("getOpportunities must be implemented by a CRM adapter.");
    }

    async getActivities() {
        throw new Error("getActivities must be implemented by a CRM adapter.");
    }
}

module.exports = CRMProvider;
