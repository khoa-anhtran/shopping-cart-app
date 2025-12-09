import { PayloadAction } from "@/types";
import { SHOW_LOADING, HIDE_LOADING } from "./actionTypes";
import { LOADING_STYLE } from "@/constants";

type UIState = {
    isShowLoading: boolean;
    loadingStyle: string;
}

const initialState: UIState = {
    isShowLoading: false,
    loadingStyle: LOADING_STYLE.OVERLAY,
}

type UIPayloadAction = PayloadAction<{
    loadingStyle?: string
}>

const uiReducer = (state = initialState, action: UIPayloadAction): UIState => {

    const loadingStyle = action.payload?.loadingStyle ? action.payload.loadingStyle : LOADING_STYLE.OVERLAY

    switch (action.type) {
        case SHOW_LOADING: {
            return { ...state, isShowLoading: true, loadingStyle }
        }

        case HIDE_LOADING: {
            return { ...state, isShowLoading: false, loadingStyle }
        }

        default:
            return state;
    }
}

export default uiReducer