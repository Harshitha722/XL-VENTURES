const MockCRMAdapter = require("./MockCRMAdapter");
const SalesforceAdapter = require("./SalesforceAdapter");
const HubSpotAdapter = require("./HubSpotAdapter");
const ZohoAdapter = require("./ZohoAdapter");

function getCRMProvider() {
    const provider = String(process.env.CRM_PROVIDER || "mock").toLowerCase();

    if (provider === "salesforce") return new SalesforceAdapter();
    if (provider === "hubspot") return new HubSpotAdapter();
    if (provider === "zoho") return new ZohoAdapter();

    return new MockCRMAdapter();
}

module.exports = {
    getCRMProvider
};
