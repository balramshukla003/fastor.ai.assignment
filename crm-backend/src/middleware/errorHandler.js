import { env } from "../config/env.js";

export function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    const statusCode =
        Number.isInteger(err.statusCode) &&
            err.statusCode >= 400 &&
            err.statusCode <= 599
            ? err.statusCode
            : 500;

    if (statusCode >= 500) {
        console.error(err);
    }

    res.status(statusCode).json({
        success: false,
        error: {
            code: err.code || "INTERNAL_ERROR",
            message:
                statusCode >= 500 && env.NODE_ENV === "production"
                    ? "An unexpected error occurred."
                    : err.message || "An unexpected error occurred.",
        },
        ...(env.NODE_ENV !== "production" &&
            statusCode >= 500 && {
            stack: err.stack,
        }),
    });
}