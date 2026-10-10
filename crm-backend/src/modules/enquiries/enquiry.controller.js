
import {
    submitEnquiry as submitEnquiryService,
    getUnclaimedEnquiries as getUnclaimedEnquiriesService,
    getMyEnquiries as getMyEnquiriesService,
    claimEnquiry as claimEnquiryService,
} from "./enquiry.service.js";

export async function createEnquiry(req, res, next) {
    try {
        const enquiry = await submitEnquiryService(
            req.validated.body
        );

        res.status(201).json({
            success: true,
            message: "Enquiry submitted successfully.",
            data: { enquiry },
        });
    } catch (error) {
        next(error);
    }
}

export async function getUnclaimedEnquiries(req, res, next) {
    try {
        const result = await getUnclaimedEnquiriesService(
            req.validated.query
        );

        res.status(200).json({
            success: true,
            message: "Unclaimed enquiries retrieved successfully.",
            ...result,
        });
    } catch (error) {
        next(error);
    }
}

export async function getMyEnquiries(req, res, next) {
    try {
        const result = await getMyEnquiriesService({
            employeeId: req.user.id,
            ...req.validated.query,
        });

        res.status(200).json({
            success: true,
            message: "Your enquiries retrieved successfully.",
            ...result,
        });
    } catch (error) {
        next(error);
    }
}

export async function claimEnquiry(req, res, next) {
    try {
        const enquiry = await claimEnquiryService({
            enquiryId: Number(req.validated.params.id),
            employeeId: req.user.id,
        });

        res.status(200).json({
            success: true,
            message: "Enquiry claimed successfully.",
            data: { enquiry },
        });
    } catch (error) {
        next(error);
    }
}
