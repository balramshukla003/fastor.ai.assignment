import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors/AppError.js";

import {
    findEmployeeByEmail,
    createEmployee,
} from "../employees/employee.repository.js";

export async function registerEmployee({ name, email, password }) {
    const normalizedEmail = email.toLowerCase();

    const existingEmployee = await findEmployeeByEmail(normalizedEmail);

    if (existingEmployee) {
        throw new AppError(
            "An account with this email already exists.",
            409,
            "EMAIL_ALREADY_EXISTS"
        );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    try {
        return await createEmployee({
            name,
            email: normalizedEmail,
            passwordHash,
        });
    } catch (error) {
        // The database unique constraint protects against concurrent registrations.
        if (error.code === "ER_DUP_ENTRY") {
            throw new AppError(
                "An account with this email already exists.",
                409,
                "EMAIL_ALREADY_EXISTS"
            );
        }

        throw error;
    }
}

export async function loginEmployee({ email, password }) {
    const employee = await findEmployeeByEmail(email.toLowerCase());

    if (
        !employee ||
        !(await bcrypt.compare(password, employee.password_hash))
    ) {
        throw new AppError(
            "Invalid email or password.",
            401,
            "INVALID_CREDENTIALS"
        );
    }

    const token = jwt.sign(
        {
            email: employee.email,
        },
        env.JWT_SECRET,
        {
            algorithm: "HS256",
            subject: String(employee.id),
            expiresIn: env.JWT_EXPIRES_IN,
        }
    );

    return {
        token,
        employee: {
            id: employee.id,
            name: employee.name,
            email: employee.email,
        },
    };
}