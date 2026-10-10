
import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { validateRequest } from "../../middleware/validateRequest.js";

import {
    createEnquiry,
    getUnclaimedEnquiries,
    getMyEnquiries,
    claimEnquiry,
} from "./enquiry.controller.js";

import {
    createEnquirySchema,
    listUnclaimedSchema,
    listMyEnquiriesSchema,
    claimEnquirySchema,
} from "./enquiry.validation.js";

const router = Router();
const protectedRouter = Router();

// Public endpoint: no JWT required.
router.post(
    "/",
    validateRequest(createEnquirySchema),
    createEnquiry
);

// Every route mounted on protectedRouter requires JWT.
protectedRouter.use(authenticate);

protectedRouter.get(
    "/unclaimed",
    validateRequest(listUnclaimedSchema),
    getUnclaimedEnquiries
);

protectedRouter.get(
    "/my-leads",
    validateRequest(listMyEnquiriesSchema),
    getMyEnquiries
);

protectedRouter.patch(
    "/:id/claim",
    validateRequest(claimEnquirySchema),
    claimEnquiry
);

router.use(protectedRouter);

export default router;
