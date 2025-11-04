export type PayloadAction<T> = {
    type: string,
    payload: T
}

export type FetchStatus = 'idle' | 'loading' | 'succeeded' | 'failed';