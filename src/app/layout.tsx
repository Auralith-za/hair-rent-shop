import type { Metadata } from "next";
import { Roboto, Montserrat, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "Shop - Hair Rent",
  description: "Rent or Buy Premium Hair Extensions",
};

import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SideCart from "@/components/SideCart";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} ${montserrat.variable} ${cormorant.variable}`}>
        <CartProvider>
          <Header />
          {children}
          <Footer />
          <SideCart />
        </CartProvider>
      </body>
    </html>
  );
}
