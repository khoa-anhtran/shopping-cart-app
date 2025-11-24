import { call, put, takeLatest } from 'redux-saga/effects'

import { SagaIterator } from 'redux-saga';
import { notify } from '@/utils/helpers';
import { STATUS } from '@/constants/api';
import { PayloadAction } from '@/types';
import { COMMENT_POST_FAILED, COMMENT_POST_SUCCEEDED, COMMENT_POSTED, COMMENTS_FETCH_FAILED, COMMENTS_FETCH_REQUESTED, COMMENTS_FETCH_SUCCEEDED } from './actionTypes';
import { Comment } from '@/types/comment';
import { fetchComments, postComment } from '@/services/commentService';
import { commentPostFailed, commentPostSucceeded, fetchCommentsFailed, fetchCommentsSucceeded } from './actions';
import { ProductPayloadAction } from '@/types/product';


function* fetchCommentsSaga(action: PayloadAction<{ productId: string }>): SagaIterator {
    try {
        const comments: Comment[] = yield call(fetchComments, action.payload?.productId ?? "");
        yield put(fetchCommentsSucceeded(comments));
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        yield put(fetchCommentsFailed(`Fetch comments failed: ${message}`));
    }
}

function* postCommentSaga(action: PayloadAction<{ productId: string, payload: ProductPayloadAction }>): SagaIterator {
    try {
        if (!action.payload)
            throw new Error("Missing payload")

        const comment: Comment = yield call(postComment, action.payload.productId, action.payload.payload);
        yield put(commentPostSucceeded(comment));
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        yield put(commentPostFailed(`Post comments failed: ${message}`));
    }
}

function* commentsSaga() {
    yield takeLatest(COMMENTS_FETCH_REQUESTED, fetchCommentsSaga)
    yield takeLatest(COMMENTS_FETCH_SUCCEEDED, () => notify({ message: "Fetch comments successfully", status: STATUS.SUCCESS }))
    yield takeLatest(COMMENTS_FETCH_FAILED,
        (action: PayloadAction<{ message: string }>) => notify({ message: action.payload?.message, status: STATUS.FAIL, duration: 3 })
    )

    yield takeLatest(COMMENT_POSTED, postCommentSaga)
    yield takeLatest(COMMENT_POST_SUCCEEDED, () => notify({ message: "Post comment successfully", status: STATUS.SUCCESS }))
    yield takeLatest(COMMENT_POST_FAILED,
        (action: PayloadAction<{ message: string }>) => notify({ message: action.payload?.message, status: STATUS.FAIL, duration: 3 })
    )
}

export default commentsSaga
