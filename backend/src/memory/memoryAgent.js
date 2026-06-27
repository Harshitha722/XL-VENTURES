/**
 * MEMORY AGENT
 *
 * Purpose:
 * Store previous interactions,
 * recommendations,
 * explanations,
 * and human feedback.
 */

const fs = require("fs");
const path = require("path");

const MEMORY_PATH = path.join(
    __dirname,
    "memoryStore.json"
);


/**
 * Load memory entries.
 */
function getMemory() {

    const data =
        fs.readFileSync(
            MEMORY_PATH,
            "utf-8"
        );

    return JSON.parse(data);
}


/**
 * Add a new memory entry.
 */
function saveMemory(entry) {

    const memory = getMemory();

    memory.push({

        ...entry,

        timestamp:
            new Date().toISOString()
    });

    fs.writeFileSync(

        MEMORY_PATH,

        JSON.stringify(
            memory,
            null,
            4
        )
    );
}


/**
 * Human feedback.
 */
function addHumanFeedback(
    index,
    feedback,
    comment
) {

    const memory = getMemory();

    if (!memory[index]) {

        return false;
    }

    memory[index].humanFeedback = feedback;

    memory[index].comment = comment;

    memory[index].reviewedAt =
        new Date().toISOString();

    fs.writeFileSync(

        MEMORY_PATH,

        JSON.stringify(
            memory,
            null,
            4
        )
    );

    return true;
}


module.exports = {

    getMemory,

    saveMemory,

    addHumanFeedback
};