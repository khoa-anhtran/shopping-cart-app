import { PageInfo } from ".";

export type Comment = {
    id: string,
    user: { id: string, name: string, avatar?: string },
    text?: string,
    media?: { publicId: string; url: string, mediaType: string }[],
    depth: number,
    replies: string[],
    parentId?: string,
    createdAt?: Date;
    updatedAt?: Date;
    isPending?: boolean
}

export type CommentState = {
    ids: string[],
    entities: Record<string, Comment>,
    pageInfo?: PageInfo,
    status: string,
    uploadStatus: string,
    error: string | null
}

export type CommentPostPayload = {
    text?: string,
    media?: { publicId: string; url: string, mediaType: string }[],
    parentId?: string,
    depth: number
}

export type CommentPayloadAction = PayloadAction<
    { comment: Comment, tempId: string } |
    { comment: Comment } |
    { message: string } |
    { comments: Comment[] }
>
