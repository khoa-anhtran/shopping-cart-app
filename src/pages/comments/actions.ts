import { Comment } from "@/types/comment";
import { COMMENTS_FETCH_FAILED, COMMENTS_FETCH_REQUESTED, COMMENTS_FETCH_SUCCEEDED } from "./actionTypes";

export const fetchCommentsRequested = (productId: string) => ({
    type: COMMENTS_FETCH_REQUESTED,
    payload: {
        productId
    }
});

export const fetchCommentsSucceeded = (comments: Comment[]) => ({
    type: COMMENTS_FETCH_SUCCEEDED,
    payload: {
        comments
    }
});

export const fetchCommentsFailed = (message: string) => ({
    type: COMMENTS_FETCH_FAILED,
    payload: {
        message
    }
});