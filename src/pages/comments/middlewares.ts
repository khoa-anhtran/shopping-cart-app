import { all, call, debounce, delay, put, takeLatest } from 'redux-saga/effects'

import { SagaIterator } from 'redux-saga';
import { notify } from '@/utils/helpers';
import { STATUS } from '@/constants/api';
import { PayloadAction, SignatureResponse } from '@/types';
import { COMMENT_POST_FAILED, COMMENT_POST_SUCCEEDED, COMMENT_POSTED, COMMENTS_FETCH_FAILED, COMMENTS_FETCH_REQUESTED, COMMENTS_FETCH_SUCCEEDED } from './actionTypes';
import { Comment, CommentPayloadAction, CommentPostPayload } from '@/types/comment';
import { fetchComments, postComment } from '@/services/commentService';
import { commentPostFailed, commentPostSucceeded, fetchCommentsFailed, fetchCommentsSucceeded } from './actions';
import { ProductPayloadAction } from '@/types/product';
import { postGetImageSignature, postUploadImage } from '@/services/uploadService';

function* fetchCommentsSaga(action: PayloadAction<{ productId: string }>): SagaIterator {
    try {
        const comments: Comment[] = yield call(fetchComments, action.payload?.productId ?? "");
        yield put(fetchCommentsSucceeded(comments));
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        yield put(fetchCommentsFailed(`Fetch comments failed: ${message}`));
    }
}

function* postCommentSaga(action: PayloadAction<{ productId: string, files: File[], comment: Comment }>): SagaIterator {
    try {
        if (!action.payload)
            throw new Error("Missing payload")

        delay(10000)

        const { files, comment, productId } = action.payload

        const { depth, text, parentId, id: tempId } = comment

        const payload = {
            depth,
            text,
            parentId
        } as CommentPostPayload

        if (files && files.length !== 0) {
            const sigRes: SignatureResponse = yield call(postGetImageSignature, productId)

            const results: { url: string; publicId: string }[] = yield all(
                files.map((file) => call(uploadImageSaga, sigRes, file))
            )

            payload.images = results
        }

        const newComment: Comment = yield call(postComment, productId, payload);
        yield put(commentPostSucceeded(newComment, tempId));
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        yield put(commentPostFailed(`Post comments failed: ${message}`));
    }
}

function* uploadImageSaga(sigRes: SignatureResponse, file: File): SagaIterator {
    try {
        const { apiKey, folder, signature, timestamp, cloudName } = sigRes
        const fd = new FormData();
        fd.append("file", file);
        fd.append("api_key", apiKey);
        fd.append("timestamp", String(timestamp));
        fd.append("folder", folder);
        fd.append("signature", signature);

        const data: { url: string; publicId: string } = yield call(postUploadImage, cloudName, fd)

        return data
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
    // yield debounce(10000, COMMENT_POSTED, postCommentSaga)

    yield takeLatest(COMMENT_POST_SUCCEEDED, () => notify({ message: "Post comment successfully", status: STATUS.SUCCESS }))
    yield takeLatest(COMMENT_POST_FAILED,
        (action: PayloadAction<{ message: string }>) => notify({ message: action.payload?.message, status: STATUS.FAIL, duration: 3 })
    )
}

export default commentsSaga
