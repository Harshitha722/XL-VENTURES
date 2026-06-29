const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

const AUDIT_PATH = path.join(__dirname, "../data/auditLog.json");

function ensureAuditFile() {
    if (!fs.existsSync(AUDIT_PATH)) {
        fs.writeFileSync(AUDIT_PATH, "[]");
    }
}

async function readAuditLog(filters = {}) {
    ensureAuditFile();

    const raw = await fsp.readFile(AUDIT_PATH, "utf-8");
    const entries = JSON.parse(raw.replace(/^\uFEFF/, ""));

    return entries.filter((entry) =>
        (!filters.tenantId || entry.tenantId === filters.tenantId) &&
        (!filters.workspaceId || entry.workspaceId === filters.workspaceId) &&
        (!filters.entityType || entry.entityType === filters.entityType) &&
        (!filters.action || entry.action === filters.action)
    );
}

async function appendAuditEvent(event) {
    ensureAuditFile();

    const entries = await readAuditLog();
    const auditEvent = {
        id: `audit_${Date.now()}_${entries.length + 1}`,
        tenantId: event.tenantId || "default-tenant",
        workspaceId: event.workspaceId || "default-workspace",
        actorId: event.actorId || "system",
        action: event.action,
        entityType: event.entityType,
        entityId: event.entityId || null,
        details: event.details || {},
        createdAt: new Date().toISOString()
    };

    entries.push(auditEvent);
    await fsp.writeFile(AUDIT_PATH, JSON.stringify(entries, null, 4));

    return auditEvent;
}

module.exports = {
    appendAuditEvent,
    readAuditLog
};
