export type PayloadAction<T> = {
    type: string,
    payload?: T
}

export type SignatureResponse = {
  timestamp: number;
  folder: string;
  signature: string;
  cloudName: string;
  apiKey: string;
};