export type PayloadAction<T> = {
    type: string,
    payload: T
}

export type FetchStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export type SyncStatus = 'waiting' | 'succeeded' | 'failed';