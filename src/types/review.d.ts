import { postReviewSchema } from "@/schemas";

export type PostReviewFormType = z.infer<typeof postReviewSchema>;

export type ReviewState = {
  ids: string[];
  entities: Record<string, Review>;
  pageInfo?: PageInfo;
  status: string;
  error: string | null;
  postReviewModalOpen: boolean;
};

export type Review = {
  id: string;
};

export type ReviewPayloadAction = PayloadAction<
  { message: string } | { reivews: Review[]; pageInfo: PageInfo }
>;
