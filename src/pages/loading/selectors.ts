import { RootState } from "@/store/store";

export const selectIsShowLoading = (state: RootState) => state.ui.isShowLoading

export const selectLoadingStyle = (state: RootState) => state.ui.loadingStyle