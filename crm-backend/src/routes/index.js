
import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import enquiryRoutes from "../modules/enquiries/enquiry.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/enquiries", enquiryRoutes);

export default router;
