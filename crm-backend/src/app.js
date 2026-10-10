import express from "express";
import helmet from "helmet";
import cors from "cors";

import { env } from "./config/env.js";
import { AppError } from "./shared/errors/AppError.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import apiRoutes from "./routes/index.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());

app.use(
    cors({
        origin: env.CORS_ORIGIN,
        methods: ["GET", "POST", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json({ limit: "100kb" }));

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CRM API is running.",
    });
});

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CRM API is running.",
    });
});

app.use("/api/v1", apiRoutes);
app.use(notFound);
app.use(errorHandler);

export default app; 