import type { MetadataRoute } from "next";
import { ALL_COMPONENTS } from "@/config/components-data";

const BASE_URL = "https://peel-ui.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/components`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const componentRoutes: MetadataRoute.Sitemap = ALL_COMPONENTS.map(
    (component) => ({
      url: `${BASE_URL}/components/${component.slug}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  return [...staticRoutes, ...componentRoutes];
}
