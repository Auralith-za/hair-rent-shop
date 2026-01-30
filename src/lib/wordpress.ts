import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { Product } from "@/types/product";

// Initialize WooCommerce API
const api = new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://hair-rent.co.za",
    consumerKey: process.env.WC_CONSUMER_KEY || "",
    consumerSecret: process.env.WC_CONSUMER_SECRET || "",
    version: "wc/v3",
});

export async function getProducts(): Promise<Product[]> {
    try {
        const response = await api.get("products", {
            per_page: 20,
            status: "publish",
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        // Fallback or empty array if keys are missing/invalid
        return [];
    }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    try {
        // WC API doesn't support 'slug' filter directly in standard 'get products' efficiently 
        // without iterating or using specific params if supported differently.
        // However, exact match by slug is standard in WC v3 via 'slug' param.
        const response = await api.get("products", {
            slug: slug,
        });

        if (response.data && response.data.length > 0) {
            return response.data[0];
        }
        return null;
    } catch (error) {
        console.error(`Error fetching product with slug ${slug}:`, error);
        return null;
    }
}

// Category ID mapping to avoid extra API call
const CATEGORY_IDS: Record<string, number> = {
    // 'in-stock': 15,  // Disabled to force slug lookup on production
    // 'pre-order': 16, // Disabled to force slug lookup on production
};

export async function getProductsByCategory(slug: string): Promise<Product[]> {
    try {
        const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://hair-rent.co.za";
        const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY || "";
        const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || "";

        // Use hardcoded category ID if available, otherwise fetch it
        let categoryId = CATEGORY_IDS[slug];

        if (!categoryId) {
            // Fallback: fetch category ID if not in our mapping
            const categoriesResponse = await fetch(
                `${WORDPRESS_URL}/wp-json/wc/v3/products/categories?slug=${slug}`,
                {
                    headers: {
                        'Authorization': `Basic ${Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64')}`
                    },
                    next: { revalidate: 3600 } // Cache for 1 hour
                }
            );

            if (!categoriesResponse.ok) {
                console.error('Failed to fetch category:', categoriesResponse.status);
                return [];
            }

            const categories = await categoriesResponse.json();
            if (!categories || categories.length === 0) {
                console.error('Category not found:', slug);
                return [];
            }

            categoryId = categories[0].id;
        }

        // Fetch products in that category with caching
        const productsResponse = await fetch(
            `${WORDPRESS_URL}/wp-json/wc/v3/products?category=${categoryId}&per_page=100`,
            {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64')}`
                },
                next: { revalidate: 300 } // Cache for 5 minutes
            }
        );

        if (!productsResponse.ok) {
            console.error('Failed to fetch products:', productsResponse.status);
            return [];
        }

        const products = await productsResponse.json();
        return products;
    } catch (error) {
        console.error('Error fetching products by category:', error);
        return [];
    }
}

export async function getProductsByIds(ids: number[]): Promise<Product[]> {
    try {
        const response = await api.get("products", {
            include: ids,
            status: "publish",
            per_page: 100
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching products by IDs:`, error);
        return [];
    }
}
