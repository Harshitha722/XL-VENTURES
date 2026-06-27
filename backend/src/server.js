/**
 * RENEWAI SERVER
 */

const express = require("express");
const cors = require("cors");

const orchestrationRoutes =
    require("./routes/orchestrationRoutes");

const memoryRoutes =
    require("./routes/memoryRoutes");


const app = express();

const PORT = 5000;


/**
 * Global middlewares
 */
app.use(cors());

app.use(express.json());


/**
 * Health check endpoint
 */
app.get("/", (req, res) => {

    res.json({

        message:
            "RenewAI Backend Running 🚀"
    });
});


/**
 * Main orchestration APIs
 */
app.use(

    "/api/orchestrate",

    orchestrationRoutes
);


/**
 * Shared memory APIs
 */
app.use(

    "/api/memory",

    memoryRoutes
);


/**
 * Start Express server
 */
app.listen(PORT, () => {

    console.log(

        `🚀 Server running on port ${PORT}`
    );
});