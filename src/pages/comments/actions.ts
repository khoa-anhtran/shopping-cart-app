import { Comment, CommentPostPayload } from "@/types/comment";
import { COMMENT_POST_FAILED, COMMENT_POST_SUCCEEDED, COMMENT_POSTED, COMMENTS_FETCH_FAILED, COMMENTS_FETCH_REQUESTED, COMMENTS_FETCH_SUCCEEDED } from "./actionTypes";

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

export const commentPosted = (productId: string, comment: Comment, files: File[]) => ({
    type: COMMENT_POSTED,
    payload: {
        productId,
        comment,
        files
    }
});

export const commentPostSucceeded = (comment: Comment, tempId: string) => ({
    type: COMMENT_POST_SUCCEEDED,
    payload: {
        comment,
        tempId
    }
});

export const commentPostFailed = (message: string) => ({
    type: COMMENT_POST_FAILED,
    payload: {
        message
    }
});