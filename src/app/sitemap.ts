import { MetadataRoute } from "next";

const PRIMITIVES = [
  { slug: "slide-to-confirm", priority: 0.9, changeFreq: "weekly" as const },
  { slug: "magnetic-split-button", priority: 0.9, changeFreq: "weekly" as const },
  { slug: "tactile-pin-field", priority: 0.9, changeFreq: "weekly" as const },
  { slug: "privacy-shutter", priority: 0.9, changeFreq: "weekly" as const },
  { slug: "voice-pill", priority: 0.95, changeFreq: "weekly" as const },
  { slug: "peel-card", priority: 0.95, changeFreq: "weekly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://peelui.com";
  const now = new Date();

  // Root & Landmark Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/components`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/registry`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/llms.txt`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Primitive Component Detail Pages
  const componentRoutes: MetadataRoute.Sitemap = PRIMITIVES.map((item) => ({
    url: `${baseUrl}/components/${item.slug}`,
    lastModified: now,
    changeFrequency: item.changeFreq,
    priority: item.priority,
  }));

  // Direct shadcn JSON registry endpoints
  const registryEndpoints: MetadataRoute.Sitemap = PRIMITIVES.map((item) => ({
    url: `${baseUrl}/r/${item.slug}.json`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...componentRoutes, ...registryEndpoints];
}
