import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface PageMetaOptions {
  title: string;
  description?: string;
  canonicalPath?: string;
}

export function usePageMeta({ title, description, canonicalPath }: PageMetaOptions) {
  const location = useLocation();

  useEffect(() => {
    document.title = title;

    if (description) {
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
    }

    // Dynamic canonical URL & Open Graph URL sync
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
  }, [title, description, canonicalPath, location.pathname]);
}
