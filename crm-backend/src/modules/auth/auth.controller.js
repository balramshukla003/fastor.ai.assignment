import {
    registerEmployee,
    loginEmployee,
} from "./auth.service.js";

export async function register(req, res, next) {
    try {
        const employee = await registerEmployee(req.body);

        res.status(201).json({
            success: true,
            message: "Employee registered successfully.",
            data: { employee },
        });
    } catch (error) {
        next(error);
    }
}

export async function login(req, res, next) {
    try {
        const result = await loginEmployee(req.body);

        res.status(200).json({
            success: true,
            message: "Login successful.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}