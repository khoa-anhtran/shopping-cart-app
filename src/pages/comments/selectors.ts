import { RootState } from "@/store/store";

export const selectCommentsStatus = (state: RootState) => state.comments.status;

export const selectCommentsError = (state: RootState) => state.comments.error;

export const selectComments = (state: RootState) => state.comments.entities;

export const selectCommentIds = (state: RootState) => state.comments.ids;

export const selectCommentPageInfo = (state: RootState) => state.comments.pageInfo;


