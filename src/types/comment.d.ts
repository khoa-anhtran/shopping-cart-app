export type Comment = {
    id: string,
    user: { id: string, name: string },
    text: string,
    images?: { publicId: string; url: string }[],
    depth: number,
    replies: string[],
    parentId?: string,
    createdAt?: Date;
    updatedAt?: Date;
}

export type CommentState = {
    ids: string[],
    entities: Record<string, Comment>,
    status: string,
    uploadStatus: string,
    error: string | null
}

export type CommentPostPayload = {
    text?: string,
    images?: { publicId: string; url: string }[],
    parentId?: string,
    depth: number
}

export type CommentPayloadAction = PayloadAction<>
