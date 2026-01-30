import Link from "next/link";
import styles from "./home.module.css";

// Cache homepage for 10 minutes
export const revalidate = 600;

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Pre-loved hair extensions</h1>
      </div>

      {/* Content Section */}
      <div className={styles.contentSection}>
        <div className={styles.description}>
          <p>
            Experience premium-quality Remy Indian hair at a fraction of the price. Our Pre-Loved Collection features gently used clip-in extensions from our Hair Rentals range. Carefully cleaned, sanitized, and still in a perfect condition to use. After each rental, our extensions are carefully deep-cleaned and restored. To maintain our high standards, we’re now replacing some sets with new ones, which means you can purchase these pre-loved extensions while they still have plenty of life left in them. Each set still offers beautiful thickness, seamless blending, and the same luxurious feel you know and love, just with a little history.
          </p>
        </div>

        <div className={styles.benefitsSection}>
          <h3 className={styles.benefitsTitle}>Why You’ll Love Our Pre-Loved Sets:</h3>
          <ul className={styles.benefitsList}>
            <li>Each set is carefully cleaned, sanitized, and refreshed with a deep treatment mask.</li>
            <li>Crafted from the same high-quality Remy Indian hair we’re known for</li>
            <li>A more affordable way to enjoy premium extensions</li>
            <li>Ideal for first-time clip-in users or special occasions</li>
            <li>If you’ve rented from us before, you already know, the quality speaks for itself</li>
          </ul>
        </div>
      </div>

      {/* Split Section */}
      <div className={styles.splitSection}>
        {/* In-stock Split */}
        <div className={`${styles.split} ${styles.inStock}`}>
          <div className={styles.splitContent}>
            <h2 className={styles.splitTitle}>In-Stock</h2>
            <Link href="/product-category/in-stock" className={styles.button}>
              View Collection
            </Link>
          </div>
        </div>

        {/* Pre-orders Split */}
        <div className={`${styles.split} ${styles.preOrder}`}>
          <div className={styles.splitContent}>
            <h2 className={styles.splitTitle}>Pre-Orders</h2>
            <Link href="/product-category/pre-order" className={styles.button}>
              View Collection
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
