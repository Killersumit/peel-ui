import React from "react";

interface JsonLdProps {
  type?: "website" | "component";
  componentName?: string;
  componentDescription?: string;
  componentSlug?: string;
}

export function JsonLd({
  componentName,
  componentDescription,
  componentSlug,
}: JsonLdProps) {
  const baseUrl = "https://peelui.com";

  // Base SoftwareApplication schema for the design system
  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Peel UI",
    operatingSystem: "Web",
    applicationCategory: "DeveloperApplication",
    description:
      "Tactile, hardware-grade motion primitives for React and Tailwind CSS featuring kinematic spring physics.",
    url: baseUrl,
    softwareVersion: "1.0.0",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Sumit",
      url: "https://x.com/Sumit1476136",
    },
  };

  // WebSite schema with site navigation
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Peel UI",
    url: baseUrl,
    description:
      "Tactile, hardware-grade motion primitives for React and Tailwind CSS.",
    publisher: {
      "@type": "Organization",
      name: "Peel UI",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/peel-logo.png`,
      },
    },
  };

  // Specific component schema if rendered on a component page
  const componentSchema = componentName
    ? {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: `${componentName} Component — Peel UI`,
        description: componentDescription,
        url: `${baseUrl}/components/${componentSlug}`,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${baseUrl}/components/${componentSlug}`,
        },
        author: {
          "@type": "Person",
          name: "Sumit",
        },
        publisher: {
          "@type": "Organization",
          name: "Peel UI",
        },
      }
    : null;

  // Breadcrumb schema
  const breadcrumbSchema = componentName
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: baseUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Components",
            item: `${baseUrl}/components`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: componentName,
            item: `${baseUrl}/components/${componentSlug}`,
          },
        ],
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {componentSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(componentSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
    </>
  );
}
