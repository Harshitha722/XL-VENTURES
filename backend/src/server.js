/**
 * RENEWAI SERVER
 */

const express = require("express");
const cors = require("cors");

const orchestrationRoutes =
    require("./routes/orchestrationRoutes");


const app = express();

const PORT = 5000;


/**
 * Middlewares
 */
app.use(cors());

app.use(express.json());


/**
 * Health Check
 */
app.get("/", (req, res) => {

    res.json({

        message:
            "RenewAI Backend Running 🚀"
    });
});


/**
 * Agentic Orchestration API
 */
app.use(

    "/api/orchestrate",

    orchestrationRoutes
);


/**
 * Start Server
 */
app.listen(PORT, () => {

    console.log(

        `🚀 Server running on port ${PORT}`
    );
});