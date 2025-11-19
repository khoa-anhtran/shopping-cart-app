import { call, put, takeLatest } from 'redux-saga/effects'

import { SagaIterator } from 'redux-saga';
import { notify } from '@/utils/helpers';
import { STATUS } from '@/constants/api';
import { PayloadAction } from '@/types';
import { COMMENTS_FETCH_FAILED, COMMENTS_FETCH_REQUESTED, COMMENTS_FETCH_SUCCEEDED } from './actionTypes';
import { Comment } from '@/types/comment';
import { fetchComments } from '@/services/commentService';
import { fetchCommentsFailed, fetchCommentsSucceeded } from './actions';


function* fetchCommentsSaga(action: PayloadAction<{ productId: string }>): SagaIterator {
    try {
        const comments: Comment[] = yield call(fetchComments, action.payload?.productId ?? "");
        yield put(fetchCommentsSucceeded(comments));
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        yield put(fetchCommentsFailed(`Fetch comments failed: ${message}`));
    }
}

function* commentsSaga() {
    yield takeLatest(COMMENTS_FETCH_REQUESTED, fetchCommentsSaga)
    yield takeLatest(COMMENTS_FETCH_SUCCEEDED, () => notify({ message: "Fetch comments successfully", status: STATUS.SUCCESS }))
    yield takeLatest(COMMENTS_FETCH_FAILED,
        (action: PayloadAction<{ message: string }>) => notify({ message: action.payload?.message, status: STATUS.FAIL, duration: 3 })
    )
}

export default commentsSaga
