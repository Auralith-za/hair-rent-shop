import Link from "next/link";
import Image from "next/image";
import { getProductBySlug } from "@/lib/wordpress";
import styles from "@/components/ProductDetail.module.css";
import ProductActions from "@/components/ProductActions";
import ProductImageGallery from "@/components/ProductImageGallery";

// Cache product pages for 10 minutes
export const revalidate = 600;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>Product not found</div>;
    }

    const galleryImages = product.images.map(img => img.src);
    if (galleryImages.length === 0) galleryImages.push("/images/placeholder.jpg");

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                {/* Left: Vertical Gallery */}
                <div className={styles.gallery}>
                    <ProductImageGallery images={galleryImages} productName={product.name} />
                </div>

                {/* Right: Sticky Details */}
                <div className={styles.details}>
                    <h1 className={styles.title}>{product.name}</h1>

                    <div className={styles.price} dangerouslySetInnerHTML={{ __html: product.price_html || "Request Price" }} />

                    <div className={styles.actions}>
                        <ul className={styles.featuresList}>
                            <li className={styles.featureItem}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l5 5L20 7" /></svg>
                                100% Remy Indian Human Hair
                            </li>
                            <li className={styles.featureItem}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l5 5L20 7" /></svg>
                                Double Drawn & Silicone Sealed
                            </li>
                            <li className={styles.featureItem}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l5 5L20 7" /></svg>
                                Instant Length & Volume
                            </li>
                        </ul>
                        <ProductActions product={product} />
                    </div>

                    <div
                        className={styles.description}
                        dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                </div>
            </div>
        </main>
    );
}
