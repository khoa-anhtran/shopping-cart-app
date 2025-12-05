import { STATUS } from "@/constants/api"
import { PageInfo } from "@/types"
import { Product, ProductCategory, ProductPayloadAction, ProductState } from "@/types/product"
import { ProductDetailsPayloadAction, ProductDetailsState } from "@/types/product-details"
import { MEDIA_VIEWER_OPENED } from "./actionTypes"
import { Media } from "@/types/comment"

const initialState: ProductDetailsState = {
    currentMedia: 0,
    isMediaViewerOpen: false,
    mediaList: []
}

const productDetailsReducer = (state = initialState, action: ProductDetailsPayloadAction): ProductDetailsState => {
    switch (action.type) {

        case MEDIA_VIEWER_OPENED: {
            const { currentMedia, media } = action.payload as { media: Media[], currentMedia: number }

            return { mediaList: media, isMediaViewerOpen: true, currentMedia }
        }

        case MEDIA_VIEWER_OPENED: {
            return {
                isMediaViewerOpen: false
            }
        }

        default:
            return state;
    }
}

export default productDetailsReducer