import "./globals.css";
import "@coinbase/onchainkit/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { Providers } from "./components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://neo-wallet-roast.vercel.app"),
  title: "NEO Wallet Roast | How bad is your crypto portfolio?",
  description:
    "Get a brutal AI roast of your on-chain activity. From PEPE moonshots to 'utility' NFTs, Claude sees it all.",
  openGraph: {
    title: "NEO Wallet Roast",
    description:
      "Connect or paste your address for a brutal AI roast. Ready for the burn?",
    url: "https://neo-wallet-roast.vercel.app",
    siteName: "NEO Wallet Roast",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEO Wallet Roast",
    description:
      "Get a brutal AI roast of your on-chain activity. Ready for the burn?",
    images: ["/twitter-image"],
    creator: "@neomello",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-black text-white min-h-screen antialiased selection:bg-fire-500 selection:text-white`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
