import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../shared/errors/AppError.js";

export function authenticate(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        return next(
            new AppError(
                "Authentication token is required.",
                401,
                "AUTH_TOKEN_REQUIRED"
            )
        );
    }

    const token = authorization.slice(7).trim();

    if (!token) {
        return next(
            new AppError(
                "Authentication token is required.",
                401,
                "AUTH_TOKEN_REQUIRED"
            )
        );
    }

    try {
        const payload = jwt.verify(token, env.JWT_SECRET, {
            algorithms: ["HS256"],
        });

        const employeeId = Number(payload.sub);

        if (
            typeof payload.sub !== "string" ||
            !/^[1-9]\d*$/.test(payload.sub) ||
            !Number.isSafeInteger(employeeId)
        ) {
            throw new Error("Invalid token payload");
        }

        req.user = {
            id: employeeId,
            email: payload.email,
        };

        next();
    } catch {
        next(
            new AppError(
                "Invalid or expired authentication token.",
                401,
                "AUTH_TOKEN_INVALID"
            )
        );
    }
}