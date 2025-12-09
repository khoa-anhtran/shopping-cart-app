import { all, call, put, takeLatest } from 'redux-saga/effects'

import { SagaIterator } from 'redux-saga';
import { notify } from '@/utils';
import { STATUS } from '@/constants/api';
import { IModelConnection, PayloadAction, SignatureResponse } from '@/types';
import { COMMENT_POST_FAILED, COMMENT_POST_SUCCEEDED, COMMENT_POSTED, COMMENTS_FETCH_FAILED, COMMENTS_FETCH_MORE_REQUESTED, COMMENTS_FETCH_REQUESTED } from './actionTypes';
import { Comment, CommentPostPayload } from '@/types/comment';
import { fetchComments, postComment } from '@/services/commentService';
import { commentPostFailed, commentPostSucceeded, fetchCommentsFailed, fetchCommentsSucceeded, fetchMoreCommentsSucceeded } from './actions';
import { postGetImageSignature, postUploadImage } from '@/services/uploadService';

function* fetchCommentsSaga(action: PayloadAction<{ productId: string, after?: string }>): SagaIterator {
    try {
        if (!action.payload)
            throw new Error("Missing payload")

        const { productId, after } = action.payload
        const commentConnection: IModelConnection<Comment> = yield call(fetchComments, productId, after);

        const comments = commentConnection.edges.map(edge => edge.node)
        const pageInfo = commentConnection.pageInfo

        if (after)
            yield put(fetchMoreCommentsSucceeded(comments, pageInfo));
        else
            yield put(fetchCommentsSucceeded(comments, pageInfo));
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        yield put(fetchCommentsFailed(`Fetch comments failed: ${message}`));
    }
}

function* postCommentSaga(action: PayloadAction<{ productId: string, files: File[], comment: Comment }>): SagaIterator {
    try {
        if (!action.payload)
            throw new Error("Missing payload")

        const { files, comment, productId } = action.payload

        const { depth, text, parentId, id: tempId } = comment

        const payload = {
            depth,
            text,
            parentId
        } as CommentPostPayload

        if (files && files.length !== 0) {
            const sigRes: SignatureResponse = yield call(postGetImageSignature, productId)

            const results: { url: string; publicId: string, mediaType: string }[] = yield all(
                files.map((file) => call(uploadImageSaga, sigRes, file))
            )

            payload.media = results
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

        return { ...data, mediaType: file.type }
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        yield put(commentPostFailed(`Post comments failed: ${message}`));
    }
}

function* commentsSaga() {
    yield takeLatest([COMMENTS_FETCH_REQUESTED, COMMENTS_FETCH_MORE_REQUESTED], fetchCommentsSaga)
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
