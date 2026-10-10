import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),

    PORT: z.coerce.number().int().positive().default(5000),

    DB_HOST: z.string().min(1),
    DB_PORT: z.coerce.number().int().positive().default(3306),
    DB_USER: z.string().min(1),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string().min(1),
    DB_CONNECTION_LIMIT: z.coerce.number().int().positive().default(10),

    JWT_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z.string().default("1h"),

    CORS_ORIGIN: z.string().min(1),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
    console.error(
        "Invalid environment configuration:",
        result.error.flatten().fieldErrors
    );

    process.exit(1);
}

export const env = Object.freeze(result.data);