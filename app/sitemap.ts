import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const routes = [
  "",
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
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
  }));
}

