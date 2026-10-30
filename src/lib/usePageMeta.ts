import { useEffect } from "react";

interface PageMetaOptions {
  title: string;
  description?: string;
}

export function usePageMeta({ title, description }: PageMetaOptions) {
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

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute("content", description);
      }

      const twitterDesc = document.querySelector('meta[name="twitter:description"]');
      if (twitterDesc) {
        twitterDesc.setAttribute("content", description);
      }
    }
  }, [title, description]);
}
