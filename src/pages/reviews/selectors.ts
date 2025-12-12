import { RootState } from "@/store";

export const selectReviewsStatus = (state: RootState) => state.reviews.status;

export const selectReviewsError = (state: RootState) => state.reviews.error;

export const selectReviews = (state: RootState) => state.reviews.entities;

export const selectReviewIds = (state: RootState) => state.reviews.ids;

export const selectReviewPageInfo = (state: RootState) => state.reviews.pageInfo;

export const selectPostReviewModalOpen = (state: RootState) => state.reviews.postReviewModalOpen;



