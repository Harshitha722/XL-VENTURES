/**
 * CUSTOMER ROUTES
 */

const express = require("express");

const customers =
    require("../data/customers.json");

const router = express.Router();


/**
 * GET all customers.
 */
router.get("/", (req, res) => {

    res.json(customers);
});


/**
 * GET single customer.
 */
router.get("/:customerId", (req, res) => {

    const customer = customers.find(

        c =>
        c.id ===
        Number(req.params.customerId)
    );

    if (!customer) {

        return res.status(404).json({

            error:
                "Customer not found"
        });
    }

    res.json(customer);
});


module.exports = router;