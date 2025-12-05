// MediaViewer.tsx
// React + TypeScript + TailwindCSS implementation
// Self-contained component (no props). Replace sample URLs with your own data as needed.

import { useLockModal } from "@/hooks/useLockModal";
import React, { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentMedia, selectMediaList, selectMediaViewerOpen } from "../selectors";
import { mediaViewerClosed, mediaViewerNavigated } from "../actions";

export default function MediaViewer() {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null)

    const open = useSelector(selectMediaViewerOpen)

    const dispatch = useDispatch()

    const mediaList = useSelector(selectMediaList)
    const currentMediaIndex = useSelector(selectCurrentMedia)

    const onClickClose = useCallback(() => {
        dispatch(mediaViewerClosed())
    }, [dispatch])

    const current = mediaList[currentMediaIndex];

    const goto = useCallback((i: number) => {
        if (i < 0) i = 0;
        if (i >= mediaList!.length) i = mediaList!.length - 1;
        dispatch(mediaViewerNavigated(i))
    }, [dispatch])

    // function downloadCurrent() {
    //     if (!current) return;
    //     const a = document.createElement("a");
    //     a.href = current.url;
    //     a.download = current.publicId;
    //     document.body.appendChild(a);
    //     a.click();
    //     a.remove();
    // }

    useLockModal(open, modalRef, onClickClose)

    console.log(current)

    return (
        <div className={`h-screen w-screen bg-black/70 absolute z-30 top-0 left-0 space-y-4 ${open ? "row-center" : "hidden"}`} ref={modalRef} onClick={() => {
            dispatch(mediaViewerClosed())
        }}>
            <div className="w-[80%] h-[90%]" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between gap-2 h-[10vh] w-full">
                    <div className="flex gap-4">
                        <button
                            onClick={() => goto(currentMediaIndex - 1)}
                            disabled={mediaList.length === 0 || currentMediaIndex === 0}
                            className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                        >
                            ◀
                        </button>
                        <button
                            onClick={() => goto(currentMediaIndex + 1)}
                            disabled={mediaList.length === 0 || currentMediaIndex === mediaList.length - 1}
                            className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                        >
                            ▶
                        </button>
                        <button
                            // onClick={downloadCurrent}
                            className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                            disabled={!current}
                        >
                            ⤓ Download
                        </button>
                        <button
                            onClick={() => setIsFullscreen((v) => !v)}
                            disabled={!current}
                            className="px-3 py-1 rounded border bg-white"
                        >
                            ⤢ Fullscreen
                        </button>
                    </div>

                    <div className="text-sm text-white font-bold">
                        {mediaList.length ? `${currentMediaIndex + 1} / ${mediaList.length}` : ""}
                    </div>
                </div>

                <div
                    className={`bg-slate-900 rounded-lg p-4 flex items-center justify-center h-[75vh] overflow-hidden ${isFullscreen ? "fixed inset-0 z-50 p-8" : ""
                        }`}
                >
                    {!current ? (
                        <div className="text-slate-400">No media</div>
                    ) : current.mediaType.startsWith("image") ? (
                        <img
                            src={current.url}
                            alt={current.publicId}
                            className="h-full object-contain cursor-zoom-in"
                        />
                    ) : (
                        <video
                            ref={videoRef}
                            src={current.url}
                            controls
                            className="h-full w-full object-contain bg-black"
                        />
                    )}
                </div>

                {/* thumbnails */}
                <div className="overflow-x-auto h-[10vh]">
                    <div className="flex gap-3 items-start h-full">
                        {mediaList.map((it, i) => (
                            <div key={it.publicId} className="w-28 h-full flex flex-col items-center gap-1">
                                <div
                                    onClick={() => goto(i)}
                                    className={`w-28 rounded-md overflow-hidden border cursor-pointer flex items-center justify-center ${i === currentMediaIndex ? "ring-2 ring-blue-500" : "border-slate-200"
                                        }`}
                                >
                                    {it.mediaType.startsWith("image") ? (
                                        <img src={it.url} alt={it.publicId} className="w-full h-full object-cover" draggable={false} />
                                    ) : (
                                        <div className="relative w-full h-full bg-black">
                                            <video src={it.url} className="w-full h-full object-cover" muted />
                                            <div className="absolute inset-0 flex items-center justify-center text-white text-xl">▶</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
