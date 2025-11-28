import { PayloadAction } from "@/types";
import { SHOW_LOADING, HIDE_LOADING, SHOW_PDS_MODAL, HIDE_PDS_MODAL } from "./uiActionTypes";
import { LOADING_STYLE } from "@/constants/ui";

type UIState = {
    isShowLoading: boolean;
    loadingStyle: string;
    productDetailsModalOpen: boolean;
    productIdOpen?: string;
}

const initialState: UIState = {
    isShowLoading: false,
    loadingStyle: LOADING_STYLE.OVERLAY,
    productDetailsModalOpen: false,
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

        case SHOW_PDS_MODAL: {
            const { productId} = action.payload as { productId: string }
            return { ...state, productDetailsModalOpen: true, productIdOpen: productId }
        }

        case HIDE_PDS_MODAL: {
            return { ...state, productDetailsModalOpen: false, productIdOpen: undefined }
        }

        default:
            return state;
    }
}

export default uiReducer