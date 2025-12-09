import z from "zod";

export const postReviewSchema = z.object({
    rating: z.float32().min(0.5, "Please select a rating"),
    comment: z.string().optional(),
    recommend: z.boolean().optional(),
    name: z.string().min(1, "Name is required"),
    phone: z
        .string()
        .min(1, "Phone number is required")
        .regex(/^[0-9]{8,15}$/, "Invalid phone number"),
    images: z
        .any()
        .refine((files) => files.length <= 3, "Maximum 3 images allowed"),
});