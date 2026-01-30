import { getProductsByCategory, getProductsByIds } from "@/lib/wordpress";
import ProductGrid from "@/components/ProductGrid";

// Enable Next.js caching - revalidate every 5 minutes
export const revalidate = 300;

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    let products = [];

    if (slug === 'pre-order') {
        products = await getProductsByIds([903, 896, 883]);
    } else {
        products = await getProductsByCategory(slug);
    }

    const title = slug === 'in-stock' ? 'In Stock Collection' :
        slug === 'pre-order' ? 'Pre-Order Collection' :
            'Collection';

    return (
        <main style={{ padding: "40px 0", minHeight: "80vh" }}>
            <div className="container">
                <h1 style={{
                    textAlign: "center",
                    marginBottom: "40px",
                    fontSize: "2rem",
                    fontWeight: "300",
                    letterSpacing: "2px",
                    textTransform: "uppercase"
                }}>
                    {title}
                </h1>
                {products.length > 0 ? (
                    <ProductGrid products={products} isPreOrder={slug === 'pre-order'} />
                ) : (
                    <p style={{ textAlign: "center", marginTop: "40px", color: "#666" }}>No products found in this category.</p>
                )}
            </div>
        </main>
    );
}
