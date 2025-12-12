import { POST_REVIEW_MODAL_TOGGLED, REVIEWS_FETCH_FAILED, REVIEWS_FETCH_REQUESTED, REVIEWS_FETCH_SUCCEEDED } from "./actionTypes"
import { STATUS } from "@/constants"
import { PageInfo, Review, ReviewPayloadAction, ReviewState, } from "@/types"

const initialState: ReviewState = {
    ids: [],
    entities: {},
    status: STATUS.IDLE,
    error: null,
    postReviewModalOpen: false
}

const reviewReducer = (state = initialState, action: ReviewPayloadAction): ReviewState => {
    switch (action.type) {
        case REVIEWS_FETCH_REQUESTED: {
            return {
                ...state,
                status: STATUS.LOADING
            };
        }

        case REVIEWS_FETCH_SUCCEEDED: {
            const { reivews, pageInfo } = action.payload as { reivews: Review[], pageInfo: PageInfo };

            const entities = Object.fromEntries(reivews.map((review: Review) => [review.id, review]))

            return {
                ...state,
                entities,
                pageInfo,
                ids: reivews.map(review => review.id),
                status: STATUS.SUCCESS
            };
        }

        case REVIEWS_FETCH_FAILED: {
            const { message } = action.payload as { message: string };

            return {
                ...state,
                error: message,
                status: STATUS.FAIL
            };
        }

        case POST_REVIEW_MODAL_TOGGLED: {
            return {
                ...state,
                postReviewModalOpen: !state.postReviewModalOpen
            };
        }

        default:
            return state;
    }
}

export default reviewReducer