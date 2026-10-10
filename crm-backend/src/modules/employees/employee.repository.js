import { pool } from "../../config/database.js";

export async function findEmployeeByEmail(email) {
    const [rows] = await pool.execute(
        `SELECT id, name, email, password_hash
         FROM employees
         WHERE email = ?
         LIMIT 1`,
        [email]
    );

    return rows[0] ?? null;
}

export async function createEmployee({ name, email, passwordHash }) {
    const [result] = await pool.execute(
        `INSERT INTO employees (name, email, password_hash)
         VALUES (?, ?, ?)`,
        [name, email, passwordHash]
    );

    return {
        id: result.insertId,
        name,
        email,
    };
}