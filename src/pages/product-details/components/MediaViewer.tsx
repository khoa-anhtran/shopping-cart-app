import { useLockModal } from "@/hooks";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentMedia, selectMediaList, selectMediaViewerOpen } from "../selectors";
import { mediaViewerClosed, mediaViewerNavigated } from "../actions";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import { Image } from "antd";

export default function MediaViewer() {
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
    }, [dispatch, mediaList])

    const onNavigateByKeyboard = useCallback((e: globalThis.KeyboardEvent) => {
        if (mediaList.length !== 0) {
            if (e.key === "ArrowRight" && currentMediaIndex !== mediaList.length - 1)
                goto(currentMediaIndex + 1)

            if (e.key === "ArrowLeft" && currentMediaIndex !== 0)
                goto(currentMediaIndex - 1)
        }
    }, [currentMediaIndex, mediaList, goto])

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

    useEffect(() => {
        window.addEventListener("keydown", onNavigateByKeyboard)

        return () => {
            window.removeEventListener("keydown", onNavigateByKeyboard)
        }
    }, [onNavigateByKeyboard])

    return (
        <div className={`h-screen w-screen bg-black/70 fixed z-30 top-0 left-0 space-y-4 ${open ? "row-center" : "hidden"}`} ref={modalRef}
            onClick={onClickClose}>
            <button
                className="absolute bg-black/50 left-[2%] w-12 h-12 rounded-full row-center hover:opacity-70 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={currentMediaIndex === 0}
                onClick={(e) => {
                    e.stopPropagation()
                    goto(currentMediaIndex - 1)
                }}
            >
                <CaretLeftOutlined className="text-2xl text-white!" />
            </button>

            <div className="max-w-[80%] h-[90%] space-y-4 flex flex-col items-center justify-around">
                <div
                    className={`row-center max-h-[90%] overflow-hidden ${current?.mediaType.startsWith("video") ? "w-full" : "w-fit"}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {!current ? (
                        <div className="text-slate-400">No media</div>
                    ) : current.mediaType.startsWith("image") ? (
                        <Image
                            src={current.url}
                            alt={current.publicId}
                            className="h-full! object-contain!"
                            preview={false}
                            width={480}
                            fallback="/error_image.png"
                        ></Image>
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
                <div className="overflow-x-auto h-[10%] w-fit max-w-full">
                    <div className="flex gap-3 items-start h-full" onClick={(e) => e.stopPropagation()}>
                        {mediaList.map((it, i) => (
                            <div
                                key={it.publicId}
                                onClick={() => goto(i)}
                                className={`w-20 md:w-20 h-full rounded-md overflow-hidden cursor-pointer flex items-center justify-center bg-black/10 
                                        ${i === currentMediaIndex ? "border border-blue-600" : "shadow-xl"}`}
                            >
                                {it.mediaType.startsWith("image") ? (
                                    <Image
                                        src={it.url}
                                        alt={it.publicId}
                                        className="w-[70%]! h-[70%]! md:w-full! md:h-full! object-cover!"
                                        draggable={false}
                                        preview={false}
                                        width={50}
                                        fallback="/error_image.png"
                                    ></Image>
                                ) : (
                                    <div className="relative w-full h-full bg-black">
                                        <video src={it.url} className="w-full h-full object-cover" muted disablePictureInPicture />
                                        <div className="absolute inset-0 flex items-center justify-center text-white text-xl">
                                            <CaretRightOutlined />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <button
                className="absolute bg-black/50 right-[2%] w-12 h-12 rounded-full row-center hover:opacity-70 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={currentMediaIndex === mediaList.length - 1}
                onClick={(e) => {
                    e.stopPropagation()
                    goto(currentMediaIndex + 1)
                }}
            >
                <CaretRightOutlined className="text-2xl text-white!" />
            </button>
        </div>
    );
}
