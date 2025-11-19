import { RootState } from "@/store/store";

export const selectIsShowLoading = (state: RootState) => state.ui.isShowLoading

export const selectLoadingStyle = (state: RootState) => state.ui.loadingStyle

export const selectPDsModalOpen = (state: RootState) => state.ui.productDetailsModalOpen

export const selectProductIdOpen = (state: RootState) => state.ui.productIdOpen