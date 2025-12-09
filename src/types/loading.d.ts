import { PayloadAction } from "@/types";

export type UIPayloadAction = PayloadAction<{
    loadingStyle?: string
}>

export type UIState = {
    isShowLoading: boolean;
    loadingStyle: string;
}