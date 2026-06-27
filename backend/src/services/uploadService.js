const fs = require("fs");
const { PDFParse } = require("pdf-parse");

/**
 * Read a PDF from disk and extract plain text from it.
 * The upload route stores files in backend/uploads first, then this service
 * reads those files so the pipeline stays simple and easy to debug.
 */
async function extractPdfText(filePath) {
    const buffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();

    await parser.destroy();

    return result.text || "";
}

/**
 * Read a text-like file from disk.
 * This is used for meeting.txt and email.txt in the hackathon MVP.
 */
function extractTxtText(filePath) {
    return fs.readFileSync(filePath, "utf8");
}

/**
 * Convert optional uploaded files into the three text buckets expected by
 * orchestrationService: contractText, meetingText, and emailText.
 */
async function extractUploadedText(files = {}) {
    const contractFile = files.contractFile?.[0];
    const meetingFile = files.meetingFile?.[0];
    const emailFile = files.emailFile?.[0];

    const contractText = contractFile
        ? await extractPdfText(contractFile.path)
        : "";

    const meetingText = meetingFile
        ? extractTxtText(meetingFile.path)
        : "";

    const emailText = emailFile
        ? extractTxtText(emailFile.path)
        : "";

    return {
        contractText,
        meetingText,
        emailText
    };
}

module.exports = {
    extractUploadedText
};
