import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export interface PageMetaOptions {
  title: string;
  description?: string;
  canonicalPath?: string;
  image?: string;
}

export function usePageMeta({
  title,
  description,
  canonicalPath,
  image,
}: PageMetaOptions) {
  const location = useLocation();

  useEffect(() => {
    // 1. Document title & title meta tags
    document.title = title;

    let metaTitle = document.querySelector('meta[name="title"]');
    if (!metaTitle) {
      metaTitle = document.createElement("meta");
      metaTitle.setAttribute("name", "title");
      document.head.appendChild(metaTitle);
    }
    metaTitle.setAttribute("content", title);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", title);

    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement("meta");
      twitterTitle.setAttribute("name", "twitter:title");
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.setAttribute("content", title);

    // 2. Descriptions
    if (description && description.trim().length > 0) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", description);

      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) {
        ogDesc = document.createElement("meta");
        ogDesc.setAttribute("property", "og:description");
        document.head.appendChild(ogDesc);
      }
      ogDesc.setAttribute("content", description);

      let twitterDesc = document.querySelector('meta[name="twitter:description"]');
      if (!twitterDesc) {
        twitterDesc = document.createElement("meta");
        twitterDesc.setAttribute("name", "twitter:description");
        document.head.appendChild(twitterDesc);
      }
      twitterDesc.setAttribute("content", description);
    } else {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.remove();

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.remove();

      const twitterDesc = document.querySelector('meta[name="twitter:description"]');
      if (twitterDesc) twitterDesc.remove();
    }

    // 3. Dynamic canonical URL & Open Graph URL sync
    const rawPath =
      canonicalPath ??
      (typeof window !== "undefined" ? window.location.pathname : location.pathname);
    const normalizedPath = rawPath === "/" ? "/" : rawPath.replace(/\/$/, "");
    const canonicalUrl = `https://peel-ui.vercel.app${normalizedPath}`;

    let canonicalLink = document.getElementById("canonical-link") as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.querySelector('link[rel="canonical"]');
    }
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      canonicalLink.setAttribute("id", "canonical-link");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement("meta");
      ogUrl.setAttribute("property", "og:url");
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute("content", canonicalUrl);

    // 4. Dedicated Image Handling (Strict: Omit/Remove if no explicit real image provided)
    const ogImage = document.querySelector('meta[property="og:image"]');
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    let twitterCard = document.querySelector('meta[name="twitter:card"]');

    if (image && typeof image === "string" && image.trim().length > 0) {
      const fullImageUrl = image.startsWith("http")
        ? image
        : `https://peel-ui.vercel.app${image.startsWith("/") ? "" : "/"}${image}`;

      if (!ogImage) {
        const el = document.createElement("meta");
        el.setAttribute("property", "og:image");
        el.setAttribute("content", fullImageUrl);
        document.head.appendChild(el);
      } else {
        ogImage.setAttribute("content", fullImageUrl);
      }

      if (!twitterImage) {
        const el = document.createElement("meta");
        el.setAttribute("name", "twitter:image");
        el.setAttribute("content", fullImageUrl);
        document.head.appendChild(el);
      } else {
        twitterImage.setAttribute("content", fullImageUrl);
      }

      if (!twitterCard) {
        twitterCard = document.createElement("meta");
        twitterCard.setAttribute("name", "twitter:card");
        document.head.appendChild(twitterCard);
      }
      twitterCard.setAttribute("content", "summary_large_image");
    } else {
      // Remove any generic or stale og:image and twitter:image tags completely from DOM
      if (ogImage) ogImage.remove();
      if (twitterImage) twitterImage.remove();

      if (twitterCard) {
        twitterCard.setAttribute("content", "summary");
      }
    }
  }, [title, description, canonicalPath, image, location.pathname]);
}
