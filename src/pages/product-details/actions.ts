import { Media } from "@/types";
import { MEDIA_VIEWER_CLOSED, MEDIA_VIEWER_NAVIGATED, MEDIA_VIEWER_OPENED } from "./actionTypes";

export const mediaViewerOpened = (media: Media[], currentMedia: number) => ({
    type: MEDIA_VIEWER_OPENED,
    payload: {
        media,
        currentMedia
    }
});

export const mediaViewerClosed = () => ({
    type: MEDIA_VIEWER_CLOSED
});

export const mediaViewerNavigated = (currentMedia: number) => ({
    type: MEDIA_VIEWER_NAVIGATED,
    payload: {
        currentMedia
    }
})
