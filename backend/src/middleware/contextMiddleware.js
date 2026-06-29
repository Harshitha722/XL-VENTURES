const ROLE_PERMISSIONS = {
    admin: ["*"],
    manager: ["recommendation:review", "analytics:read", "audit:read", "crm:read", "memory:read"],
    reviewer: ["recommendation:review", "memory:read", "crm:read"],
    operator: ["recommendation:submit", "memory:read", "crm:read"],
    viewer: ["analytics:read", "memory:read", "crm:read"]
};

function attachRequestContext(req, res, next) {
    req.context = {
        tenantId: req.header("x-tenant-id") || req.body?.tenantId || "default-tenant",
        workspaceId: req.header("x-workspace-id") || req.body?.workspaceId || "default-workspace",
        userId: req.header("x-user-id") || "system",
        role: req.header("x-user-role") || "admin"
    };

    next();
}

function requirePermission(permission) {
    return (req, res, next) => {
        const role = req.context?.role || "viewer";
        const permissions = ROLE_PERMISSIONS[role] || [];

        if (permissions.includes("*") || permissions.includes(permission)) {
            return next();
        }

        return res.status(403).json({
            success: false,
            error: "Forbidden",
            requiredPermission: permission,
            role
        });
    };
}

module.exports = {
    ROLE_PERMISSIONS,
    attachRequestContext,
    requirePermission
};
