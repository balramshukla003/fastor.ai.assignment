
import { AppError } from "../../shared/errors/AppError.js";

import {
    createEnquiry as insertEnquiry,
    findEnquiryById,
    findUnclaimedEnquiries,
    countUnclaimedEnquiries,
    findEmployeeEnquiries,
    countEmployeeEnquiries,
    claimEnquiry as claimEnquiryRecord,
} from "./enquiry.repository.js";

function normalizeEmail(email) {
    return email.trim().toLowerCase();
}

function createPagination({ page, limit, total }) {
    return {
        page,
        limit,
        totalRecords: total,
        totalPages: Math.ceil(total / limit),
    };
}

export async function submitEnquiry(input) {
    return insertEnquiry({
        name: input.name.trim(),
        email: normalizeEmail(input.email),
        courseInterest: input.courseInterest.trim(),
    });
}

export async function getUnclaimedEnquiries({ page, limit }) {
    const offset = (page - 1) * limit;

    const [data, total] = await Promise.all([
        findUnclaimedEnquiries({ limit, offset }),
        countUnclaimedEnquiries(),
    ]);

    return {
        data,
        pagination: createPagination({ page, limit, total }),
    };
}

export async function getMyEnquiries({
    employeeId,
    page,
    limit,
}) {
    const offset = (page - 1) * limit;

    const [data, total] = await Promise.all([
        findEmployeeEnquiries({ employeeId, limit, offset }),
        countEmployeeEnquiries(employeeId),
    ]);

    return {
        data,
        pagination: createPagination({ page, limit, total }),
    };
}

export async function claimEnquiry({ enquiryId, employeeId }) {
    const claimed = await claimEnquiryRecord({
        enquiryId,
        employeeId,
    });

    if (claimed) { return findEnquiryById(enquiryId); }
    const existingEnquiry = await findEnquiryById(enquiryId);

    if (!existingEnquiry) {
        throw new AppError(
            "Enquiry not found.",
            404,
            "ENQUIRY_NOT_FOUND"
        );
    }

    throw new AppError(
        "This enquiry has already been claimed.",
        409,
        "ENQUIRY_ALREADY_CLAIMED"
    );
}
