import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
    product: Product;
    isPreOrder?: boolean;
}

export default function ProductCard({ product, isPreOrder }: ProductCardProps) {
    const featuredImage = product.images && product.images.length > 0 ? product.images[0].src : "/images/placeholder.jpg";
    // For hover, use the second image if available, else use the first
    const hoverImage = product.images && product.images.length > 1 ? product.images[1].src : featuredImage;

    const getPreOrderPrice = () => {
        if (!product.description) return "";
        // Strip HTML
        const text = product.description.replace(/<[^>]*>/g, '').trim();
        // Get first line
        const lines = text.split('\n');
        return lines.length > 0 ? lines[0] : "";
    };

    return (
        <Link href={`/product/${product.slug}`} className={styles.card}>
            <div className={styles.imageContainer}>
                <Image
                    src={featuredImage}
                    alt={product.name}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
                {/* Hover Image Layer */}
                <Image
                    src={hoverImage}
                    alt={product.name}
                    fill
                    className={`${styles.image} ${styles.imageHover}`}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
            </div>
            <div className={styles.details}>
                <h3 className={styles.title}>{product.name}</h3>
                {isPreOrder ? (
                    <div className={styles.price} style={{ fontSize: "0.9rem", color: "#666" }}>
                        {getPreOrderPrice()}
                    </div>
                ) : (
                    product.price && (
                        <div className={styles.price}>R {parseFloat(product.price).toFixed(2)}</div>
                    )
                )}
                <div className={styles.meta}>
                    <button className={styles.viewBtn}>View Product</button>
                </div>
            </div>
        </Link>
    );
}
