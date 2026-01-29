"use client";

import { useState, useRef, MouseEvent } from "react";
import Image from "next/image";
import styles from "./ProductDetail.module.css";

interface ProductImageGalleryProps {
    images: string[];
    productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: "none" });
    const mainImageRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!mainImageRef.current) return;

        const { left, top, width, height } = mainImageRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        // Check if mouse is within the image bounds
        if (x < 0 || y < 0 || x > width || y > height) {
            setZoomStyle({ display: "none" });
            return;
        }

        const xPercent = (x / width) * 100;
        const yPercent = (y / height) * 100;

        setZoomStyle({
            display: "block",
            backgroundImage: `url(${images[selectedIndex]})`,
            backgroundPosition: `${xPercent}% ${yPercent}%`,
            backgroundSize: "200%", // 2x zoom
        });
    };

    const handleMouseLeave = () => {
        setZoomStyle({ display: "none" });
    };

    return (
        <div className={styles.galleryContainer}>
            {/* Main Image with Zoom */}
            <div
                className={styles.mainImageWrapper}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                ref={mainImageRef}
            >
                <div className={styles.mainImageInner}>
                    <Image
                        src={images[selectedIndex]}
                        alt={`${productName} Main`}
                        width={650}
                        height={866} // Aspect ratio hook
                        className={styles.mainImage}
                        priority
                        unoptimized
                    />
                </div>
                {/* Zoom Overlay */}
                <div className={styles.zoomLens} style={zoomStyle} />
            </div>

            {/* Horizontal Thumbnail Strip */}
            <div className={styles.thumbnailStrip}>
                {images.map((img, index) => (
                    <button
                        key={index}
                        className={`${styles.thumbnailBtn} ${index === selectedIndex ? styles.activeThumbnail : ""}`}
                        onClick={() => setSelectedIndex(index)}
                        aria-label={`View image ${index + 1}`}
                    >
                        <Image
                            src={img}
                            alt={`${productName} thumbnail ${index + 1}`}
                            width={90}
                            height={110}
                            className={styles.thumbnailImg}
                            unoptimized
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
