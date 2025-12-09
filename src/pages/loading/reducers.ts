import { UIPayloadAction, UIState } from "@/types";
import { SHOW_LOADING, HIDE_LOADING } from "./actionTypes";
import { LOADING_STYLE } from "@/constants";

const initialState: UIState = {
    isShowLoading: false,
    loadingStyle: LOADING_STYLE.OVERLAY,
}

const loadingReducer = (state = initialState, action: UIPayloadAction): UIState => {

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

export default loadingReducer