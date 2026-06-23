import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Chatbot from "@/components/Chatbot";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bagdi Atta | 100% Chakki Fresh Whole Wheat Atta",
  description: "Experience the rustic goodness of stone-ground, 100% organic, chakki-fresh Whole Wheat Atta. Zero preservatives, high fiber, and rich in nutrients. Order online or via WhatsApp.",
  keywords: ["Atta", "Whole Wheat Atta", "Chakki Fresh Atta", "Organic Atta", "Flour", "D2C Flour Brand", "Bagdi Atta", "Bagri Atta"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-cream text-stone-900">
        <CartProvider>
          {children}
          <CartDrawer />
          <Chatbot />
        </CartProvider>
      </body>
    </html>
  );
}

