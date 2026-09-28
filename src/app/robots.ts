import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://peelui.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/private/",
          "/_next/",
          "/test/",
          "/admin/",
        ],
      },
      // Search Engines
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "Applebot",
          "DuckDuckBot",
          "YandexBot",
        ],
        allow: "/",
      },
      // AI Search, Research & Agent Crawlers
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "PerplexityBot",
          "Applebot-Extended",
          "Amazonbot",
          "cohere-ai",
          "Diffbot",
          "OAI-SearchBot",
        ],
        allow: [
          "/",
          "/r/",
          "/llms.txt",
          "/llms-full.txt",
        ],
        disallow: ["/api/private/"],
      },
      // Unwanted Scrapers & Aggressive Harvesters
      {
        userAgent: ["CCBot", "Bytespider"],
        allow: ["/llms.txt"],
        disallow: ["/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
