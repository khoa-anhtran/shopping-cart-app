import { RootState } from "@/store";

export const selectIsShowLoading = (state: RootState) => state.loading.isShowLoading

export const selectLoadingStyle = (state: RootState) => state.loading.loadingStyle