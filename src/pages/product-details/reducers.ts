import { STATUS } from "@/constants/api"
import { PageInfo } from "@/types"
import { Product, ProductCategory, ProductPayloadAction, ProductState } from "@/types/product"
import { ProductDetailsPayloadAction, ProductDetailsState } from "@/types/product-details"
import { MEDIA_VIEWER_CLOSED, MEDIA_VIEWER_NAVIGATED, MEDIA_VIEWER_OPENED } from "./actionTypes"
import { Media } from "@/types/comment"

const initialState: ProductDetailsState = {
    isMediaViewerOpen: false,
    currentMedia: -1,
    mediaList: []
}

const productDetailsReducer = (state = initialState, action: ProductDetailsPayloadAction): ProductDetailsState => {
    switch (action.type) {

        case MEDIA_VIEWER_OPENED: {
            const { currentMedia, media } = action.payload as { media: Media[], currentMedia: number }

            return { mediaList: media, isMediaViewerOpen: true, currentMedia }
        }

        case MEDIA_VIEWER_CLOSED: {
            return initialState
        }

        case MEDIA_VIEWER_NAVIGATED: {
            const { currentMedia } = action.payload as { currentMedia: number }

            return { ...state, currentMedia }
        }

        default:
            return state;
    }
}

export default productDetailsReducer