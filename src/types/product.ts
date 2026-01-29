export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    short_description: string;
    price: string;
    regular_price: string;
    sale_price: string;
    price_html: string;
    stock_status: string;
    images: Array<{
        id: number;
        src: string;
        alt: string;
    }>;
    categories: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
}
