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

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
    try {
        // First we likely need to get the category ID from the slug if the API requires ID for filtering
        // Or check if 'category' param accepts slug. 
        // WC API v3 'products' endpoint has a 'category' param which takes ID.
        // We might need to fetch category first.

        // Let's try to get category by slug first
        const categoryRes = await api.get("products/categories", {
            slug: categorySlug
        });

        if (categoryRes.data && categoryRes.data.length > 0) {
            const categoryId = categoryRes.data[0].id;
            const response = await api.get("products", {
                category: categoryId,
                status: "publish",
                per_page: 20
            });
            return response.data;
        }

        return [];
    } catch (error) {
        console.error(`Error fetching products for category ${categorySlug}:`, error);
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
