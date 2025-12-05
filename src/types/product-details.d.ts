import { Media } from "./comment"

export type ProductDetailsState = {
    isMediaViewerOpen: boolean,
    mediaList?: { url: string, publicId: string, mediaType: string }[],
    currentMedia?: number
}

export type ProductDetailsPayloadAction = PayloadAction<{ media: Media[], currentMedia: number } | { message: string }>