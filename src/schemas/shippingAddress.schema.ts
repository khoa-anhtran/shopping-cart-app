import z from "zod";

export const shippingAddressSchema = z.object({
    firstName: z.string("First name should be string").min(1, "First name should not empty").regex(/^[\p{L}\s]+$/u, "Only letters and spaces are allowed"),
    lastName: z.string("Last name should be string").min(1, "Last name should not empty").regex(/^[\p{L}\s]+$/u, "Only letters and spaces are allowed"),
    addressLine: z.string("Address line should be string").min(1, "Address line should not empty"),
    subAddressLine: z.string().optional(),
    province: z.string().min(1, "Required"),
    commune: z.string().min(1, "Required"),
    isSaved: z.boolean(),
});