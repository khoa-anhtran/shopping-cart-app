import { useState } from "react";
import Loading from "../pages/layout/Loading";
import LoadingSpinner from "./LoadingSpinner";

type ImageWithPreviewProps = {
    src: string;          // heavy image
    alt?: string;
    className?: string;
    previewSrc?: string;  // small/placeholder image (optional)
    size?: "sm" | "md" | "lg";
    isMobile?: boolean
};

export function ImageWithPreview({
    src,
    alt = "",
    previewSrc,
    className = "",
    size = "sm",
    isMobile
}: ImageWithPreviewProps) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <div
            style={{
                position: "relative",
                overflow: isMobile ? "unset" : "hidden",
            }}
            className={className}
        >
            {/* Preview / skeleton */}
            {!loaded && !error && (
                previewSrc ? (
                    <img
                        src={previewSrc}
                        alt={alt}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            filter: "blur(4px)",
                        }}
                    />
                ) : (
                    <div style={{
                        width: "100%",
                        height: "100%",
                    }} className="row-center">
                        <LoadingSpinner size={size}></LoadingSpinner>
                    </div>

                )
            )}

            {/* Real image */}
            {!error && (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"            // browser-level lazy loading
                    onLoad={() => setLoaded(true)}
                    onError={() => setError(true)}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        position: isMobile ? "unset" : "absolute",
                        top: 0,
                        left: 0,
                        opacity: loaded ? 1 : 0,
                        transition: "opacity 0.3s ease",
                    }}
                />
            )}

            {/* Error state */}
            {error && (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        background: "#fecaca",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                    }}
                >
                    Failed to load image
                </div>
            )}
        </div>
    );
}
