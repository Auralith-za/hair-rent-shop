import { getProductsByCategory } from "@/lib/wordpress";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

// Initialize WooCommerce API (Same as in lib/wordpress.ts)
const api = new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://hair-rent.co.za",
    consumerKey: process.env.WC_CONSUMER_KEY || "",
    consumerSecret: process.env.WC_CONSUMER_SECRET || "",
    version: "wc/v3",
});

export const dynamic = 'force-dynamic';

export default async function DebugPage() {
    const slug = 'in-stock';
    let categoryData = null;
    let productsData = null;
    let error = null;
    let dbStatus = null;
    let dbError = null;
    let envCheck = {
        url: process.env.NEXT_PUBLIC_WORDPRESS_URL,
        hasKey: !!process.env.WC_CONSUMER_KEY,
        hasSecret: !!process.env.WC_CONSUMER_SECRET
    };

    try {
        // 1. Try to fetch category by slug
        const response = await api.get("products/categories", { slug });
        categoryData = response.data;

        // 2. Try to fetch products if category found
        if (categoryData && categoryData.length > 0) {
            const catId = categoryData[0].id;
            const prodResponse = await api.get("products", { category: catId });
            productsData = prodResponse.data;
        }

        // 3. Test Database Connection
        try {
            const { prisma } = await import("@/lib/prisma");
            // @ts-ignore
            dbStatus = await prisma.order.count();
            dbStatus = `Connected. Order count: ${dbStatus}`;
        } catch (dbErr: any) {
            dbError = dbErr.message;
        }

    } catch (e: any) {
        error = e.message;
    }

    return (
        <div style={{ padding: 40, fontFamily: 'monospace' }}>
            <h1>Debug Collections</h1>

            <div style={{ marginBottom: 20, padding: 10, background: '#eee' }}>
                <h3>Environment</h3>
                <pre>{JSON.stringify(envCheck, null, 2)}</pre>
            </div>

            <div style={{ marginBottom: 20 }}>
                <h3>Category Fetch ('{slug}')</h3>
                {error ? (
                    <div style={{ color: 'red' }}>Error: {error}</div>
                ) : (
                    <pre style={{ background: '#f0f0f0', padding: 10, overflow: 'auto' }}>
                        {JSON.stringify(categoryData, null, 2)}
                    </pre>
                )}
            </div>

            {productsData && (
                <div style={{ marginBottom: 20 }}>
                    <h3>Products Fetch (Category ID: {categoryData?.[0]?.id})</h3>
                    <pre style={{ background: '#e0e0e0', padding: 10, overflow: 'auto' }}>
                        {JSON.stringify(productsData, null, 2)}
                    </pre>
                </div>
            )}

            <div style={{ marginBottom: 20 }}>
                <h3>Database Connection</h3>
                {dbError ? (
                    <div style={{ color: 'red' }}>Error: {dbError}</div>
                ) : (
                    <div style={{ color: 'green' }}>{dbStatus}</div>
                )}
            </div>

            <div>
                <h3>Existing Helper Function Test</h3>
                <p>Calling <code>getProductsByCategory('in-stock')</code>...</p>
                {/* calling this might be slow, so maybe just stick to raw API above */}
            </div>
        </div>
    );
}
```
