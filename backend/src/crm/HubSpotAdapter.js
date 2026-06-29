const MockCRMAdapter = require("./MockCRMAdapter");

class HubSpotAdapter extends MockCRMAdapter {
    constructor() {
        super();
        this.provider = "hubspot";
    }
}

module.exports = HubSpotAdapter;
