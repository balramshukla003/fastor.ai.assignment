
import { z } from "zod";

const paginationSchema = {
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
};

export const createEnquirySchema = z.object({
    body: z.object({
        name: z.string().trim().min(2).max(100),
        email: z.string().trim().email().max(254),
        courseInterest: z.string().trim().min(1).max(150),
    }),
});

export const listUnclaimedSchema = z.object({
    query: z.object(paginationSchema),
});

export const listMyEnquiriesSchema = z.object({
    query: z.object(paginationSchema),
});

export const claimEnquirySchema = z.object({
    params: z.object({
        id: z
            .string()
            .regex(/^[1-9]\d*$/, "Enquiry ID must be a positive integer.")
            .refine(
                (value) => Number.isSafeInteger(Number(value)),
                "Enquiry ID is outside the supported range."
            ),
    }),
});
