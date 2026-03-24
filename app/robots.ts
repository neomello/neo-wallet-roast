import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "weipay-webhooks",
        disallow: "/",
      },
    ],
    sitemap: "https://neo-wallet-roast.vercel.app/sitemap.xml",
  };
}
