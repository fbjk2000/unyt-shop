import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const routes = [
  "",
  "/transfer",
  "/unytbot",
  "/unyt-exchange",
  "/ecosystem",
  "/how-it-works",
  "/security",
  "/faq",
  "/app/wallet",
  "/app/swap",
  "/app/activity",
  "/app/settings",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    ...routes.map((route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified,
    })),
    {
      url: "https://transfer.unyt.shop",
      lastModified,
    },
  ];
}
