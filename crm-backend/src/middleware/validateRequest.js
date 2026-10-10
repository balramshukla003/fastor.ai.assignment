import { AppError } from "../shared/errors/AppError.js";

export function validateRequest(schema) {
    return (req, res, next) => {
        const result = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query,
        });

        if (!result.success) {
            return next(
                new AppError(
                    "Request validation failed.",
                    400,
                    "VALIDATION_ERROR"
                )
            );
        }

        req.validated = result.data;
        next();
    };
}