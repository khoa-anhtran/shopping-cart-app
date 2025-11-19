export type Comment = {
    id: string,
    user: { id: string, name: string },
    text: string,
    depth: number,
    replies: string[],
    createdAt?: Date;
    updatedAt?: Date;
}

export type CommentState = {
    ids: string[],
    entities: Record<string, Comment>,
    status: string,
    error: string | null
}

export type CommentPayloadAction = PayloadAction<>
