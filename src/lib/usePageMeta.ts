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
    // 1. Purge all X / Twitter meta tags completely from the DOM
    document
      .querySelectorAll('meta[name^="twitter:"], meta[property^="twitter:"]')
      .forEach((el) => el.remove());

    // 2. Purge OpenGraph detail text (og:title, og:description) completely from the DOM
    const existingOgTitle = document.querySelector('meta[property="og:title"]');
    if (existingOgTitle) existingOgTitle.remove();

    const existingOgDesc = document.querySelector('meta[property="og:description"]');
    if (existingOgDesc) existingOgDesc.remove();

    // 3. Document title & Google/browser title tag
    document.title = title;

    let metaTitle = document.querySelector('meta[name="title"]');
    if (!metaTitle) {
      metaTitle = document.createElement("meta");
      metaTitle.setAttribute("name", "title");
      document.head.appendChild(metaTitle);
    }
    metaTitle.setAttribute("content", title);

    // 4. Google/browser description tag
    if (description && description.trim().length > 0) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", description);
    } else {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.remove();
    }

    // 5. Canonical URL & OpenGraph URL sync
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

    // 6. OpenGraph Image (STRICT: ONLY image when explicit real asset exists; otherwise empty/removed)
    const ogImage = document.querySelector('meta[property="og:image"]');

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
    } else {
      if (ogImage) ogImage.remove();
    }
  }, [title, description, canonicalPath, image, location.pathname]);
}
