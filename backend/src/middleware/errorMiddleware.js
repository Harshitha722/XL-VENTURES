function notFoundHandler(req, res) {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
}

function errorHandler(error, req, res, next) {
    if (res.headersSent) {
        return next(error);
    }

    console.error(error);

    return res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Internal Server Error"
    });
}

function asyncHandler(handler) {
    return (req, res, next) =>
        Promise.resolve(handler(req, res, next)).catch(next);
}

module.exports = {
    asyncHandler,
    errorHandler,
    notFoundHandler
};
