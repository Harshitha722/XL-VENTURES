const MockCRMAdapter = require("./MockCRMAdapter");

class ZohoAdapter extends MockCRMAdapter {
    constructor() {
        super();
        this.provider = "zoho";
    }
}

module.exports = ZohoAdapter;
