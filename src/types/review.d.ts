import { postReviewSchema } from "@/schemas";

export type PostReviewFormType = z.infer<typeof postReviewSchema>;
