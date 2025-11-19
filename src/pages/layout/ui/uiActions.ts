import { HIDE_LOADING, HIDE_PDS_MODAL, SHOW_LOADING, SHOW_PDS_MODAL } from "./uiActionTypes";

export const showLoading = (loadingStyle?: string) => ({ type: SHOW_LOADING, payload: { loadingStyle } })

export const hideLoading = (loadingStyle?: string) => ({ type: HIDE_LOADING, payload: { loadingStyle } })

export const showPDsModal = (productId: string) => ({ type: SHOW_PDS_MODAL, payload: { productId } })

export const hidePDsModal = () => ({ type: HIDE_PDS_MODAL })