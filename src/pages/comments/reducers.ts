import { PayloadAction } from "@/types"
import { COMMENTS_FETCH_FAILED, COMMENTS_FETCH_REQUESTED, COMMENTS_FETCH_SUCCEEDED } from "./actionTypes"
import { STATUS } from "@/constants/api"
import { Comment, CommentPayloadAction, CommentState } from "@/types/comment"

const initialState: CommentState = {
    ids: [],
    entities: {},
    status: STATUS.IDLE,
    error: null
}

const commentReducer = (state = initialState, action: CommentPayloadAction): CommentState => {
    switch (action.type) {
        case COMMENTS_FETCH_REQUESTED: {
            return {
                ...state,
                status: STATUS.LOADING
            };
        }

        case COMMENTS_FETCH_SUCCEEDED: {
            const { comments } = action.payload as { comments: Comment[] };

            const entities = Object.fromEntries(comments.map((comment: Comment) => [comment.id, comment]))

            return {
                ...state,
                entities,
                ids: comments.map(comment => comment.id),
                status: STATUS.SUCCESS
            };
        }

        case COMMENTS_FETCH_FAILED: {
            const { message } = action.payload as { message: string };

            return {
                ...state,
                error: message,
                status: STATUS.FAIL
            };
        }

        default:
            return state;
    }
}

export default commentReducer