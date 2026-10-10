
import { pool } from "../../config/database.js";

export async function createEnquiry({
    name,
    email,
    courseInterest,
}) {
    const [result] = await pool.execute(
        `INSERT INTO enquiries
            (name, email, course_interest, status, claimed_by)
         VALUES (?, ?, ?, 'unclaimed', NULL)`,
        [name, email, courseInterest]
    );

    return findEnquiryById(result.insertId);
}

export async function findEnquiryById(id) {
    const [rows] = await pool.execute(
        `SELECT
            id,
            name,
            email,
            course_interest AS courseInterest,
            status,
            claimed_by AS claimedBy,
            created_at AS createdAt,
            updated_at AS updatedAt
         FROM enquiries
         WHERE id = ?
         LIMIT 1`,
        [id]
    );

    return rows[0] ?? null;
}

export async function findUnclaimedEnquiries({ limit, offset }) {
    const [rows] = await pool.execute(
        `SELECT
            id,
            name,
            email,
            course_interest AS courseInterest,
            status,
            created_at AS createdAt
         FROM enquiries
         WHERE status = 'unclaimed'
           AND claimed_by IS NULL
         ORDER BY created_at DESC, id DESC
         LIMIT ? OFFSET ?`,
        [limit, offset]
    );

    return rows;
}

export async function countUnclaimedEnquiries() {
    const [rows] = await pool.execute(
        `SELECT COUNT(*) AS total
         FROM enquiries
         WHERE status = 'unclaimed'
           AND claimed_by IS NULL`
    );

    return Number(rows[0].total);
}

export async function findEmployeeEnquiries({
    employeeId,
    limit,
    offset,
}) {
    const [rows] = await pool.execute(
        `SELECT
            id,
            name,
            email,
            course_interest AS courseInterest,
            status,
            claimed_by AS claimedBy,
            created_at AS createdAt,
            updated_at AS updatedAt
         FROM enquiries
         WHERE claimed_by = ?
           AND status = 'claimed'
         ORDER BY created_at DESC, id DESC
         LIMIT ? OFFSET ?`,
        [employeeId, limit, offset]
    );

    return rows;
}

export async function countEmployeeEnquiries(employeeId) {
    const [rows] = await pool.execute(
        `SELECT COUNT(*) AS total
         FROM enquiries
         WHERE claimed_by = ?
           AND status = 'claimed'`,
        [employeeId]
    );

    return Number(rows[0].total);
}

export async function claimEnquiry({ enquiryId, employeeId }) {
    const [result] = await pool.execute(
        `UPDATE enquiries
         SET status = 'claimed',
             claimed_by = ?
         WHERE id = ?
           AND status = 'unclaimed'
           AND claimed_by IS NULL`,
        [employeeId, enquiryId]
    );

    return result.affectedRows === 1;
}
