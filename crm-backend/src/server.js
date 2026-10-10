import app from "./app.js";
import { env } from "./config/env.js";
import { pool, checkDatabaseConnection } from "./config/database.js";

let server;

async function startServer() {
    try {
        await checkDatabaseConnection();

        server = app.listen(env.PORT, () => {
            console.log(`CRM API running on port ${env.PORT}`);
        });
    } catch (error) {
        console.error("Failed to start CRM API:", error.message);
        await pool.end();
        process.exit(1);
    }
}

async function shutdown(signal) {
    console.log(`${signal} received. Shutting down...`);

    if (server) {
        server.close(async () => {
            await pool.end();
            process.exit(0);
        });
    } else {
        await pool.end();
        process.exit(0);
    }
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

startServer(); 