import { Media } from "@/types/comment";
import { MEDIA_VIEWER_OPENED } from "./actionTypes";

export const mediaViewerOpened = (media: Media[], currentMedia: number) => ({
    type: MEDIA_VIEWER_OPENED,
    payload: {
        media,
        currentMedia
    }
});

export const mediaViewerClosed = () => ({
    type: MEDIA_VIEWER_OPENED
});
