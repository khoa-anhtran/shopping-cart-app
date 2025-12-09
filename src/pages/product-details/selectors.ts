import { RootState } from "@/store";

export const selectMediaViewerOpen = (state: RootState) => state.productDetails.isMediaViewerOpen

export const selectMediaList = (state: RootState) => state.productDetails.mediaList

export const selectCurrentMedia = (state: RootState) => state.productDetails.currentMedia