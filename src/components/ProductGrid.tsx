import { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import styles from "./ProductGrid.module.css";

interface ProductGridProps {
    products: Product[];
    isPreOrder?: boolean;
}

export default function ProductGrid({ products, isPreOrder }: ProductGridProps) {
    return (
        <div className={styles.grid}>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} isPreOrder={isPreOrder} />
            ))}
        </div>
    );
}
