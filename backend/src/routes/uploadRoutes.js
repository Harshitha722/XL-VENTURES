const path = require("path");
const express = require("express");
const multer = require("multer");

const orchestrate =
    require("../services/orchestrationService");

const {
    extractUploadedText
} = require("../services/uploadService");

const router = express.Router();

const uploadDirectory = path.join(
    __dirname,
    "../../uploads"
);

const storage = multer.diskStorage({
    destination: uploadDirectory,
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        cb(null, `${Date.now()}-${safeName}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 15 * 1024 * 1024
    }
});

/**
 * POST /api/upload/analyze
 *
 * Accepts optional multipart fields:
 * contractFile, meetingFile, emailFile.
 */
router.post(
    "/analyze",
    upload.fields([
        { name: "contractFile", maxCount: 1 },
        { name: "meetingFile", maxCount: 1 },
        { name: "emailFile", maxCount: 1 }
    ]),
    async (req, res) => {
        try {
            const uploadedText =
                await extractUploadedText(req.files);

            if (
                !uploadedText.contractText &&
                !uploadedText.meetingText &&
                !uploadedText.emailText
            ) {
                return res.status(400).json({
                    error:
                        "Upload at least one contract, meeting, or email file."
                });
            }

            const result =
                await orchestrate(uploadedText);

            res.json(result);
        }
        catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Unable to analyze uploaded documents."
            });
        }
    }
);

module.exports = router;
