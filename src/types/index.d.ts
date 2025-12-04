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

export type IModelConnection<M> = {
  edges: Edge<M>[];
  pageInfo: PageInfo;
}

export type PageInfo = {
  startCursor: string | null;
  endCursor: string | null;
  hasNextPage: Boolean;
};

export type Edge<M> = {
  node: M;
  cursor: string;
};