import { PageInfo, Review } from "@/types";
import { POST_REVIEW_MODAL_TOGGLED, REVIEWS_FETCH_FAILED, REVIEWS_FETCH_REQUESTED, REVIEWS_FETCH_SUCCEEDED } from "./actionTypes";

export const fetchReviewsRequested = (productId: string) => ({
    type: REVIEWS_FETCH_REQUESTED,
    payload: {
        productId
    }
});

export const fetchReviewsSucceeded = (reviews: Review[], pageInfo: PageInfo) => ({
    type: REVIEWS_FETCH_SUCCEEDED,
    payload: {
        reviews,
        pageInfo
    }
});

export const fetchReviewsFailed = (message: string) => ({
    type: REVIEWS_FETCH_FAILED,
    payload: {
        message
    }
});

export const postReivewModalToggled = () => ({
    type: POST_REVIEW_MODAL_TOGGLED
})