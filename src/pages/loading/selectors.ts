import { RootState } from "@/store/store";

export const selectIsShowLoading = (state: RootState) => state.loading.isShowLoading

export const selectLoadingStyle = (state: RootState) => state.loading.loadingStyle