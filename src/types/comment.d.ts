import { PageInfo } from ".";

export type Media = { publicId: string; url: string, mediaType: string }

export type Comment = {
    id: string,
    user: { id: string, name: string, avatar?: string },
    text?: string,
    media?: Media[],
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
    media?: Media[],
    parentId?: string,
    depth: number
}

export type CommentPayloadAction = PayloadAction<
    { comment: Comment, tempId: string } |
    { comment: Comment } |
    { message: string } |
    { comments: Comment[] }
>
