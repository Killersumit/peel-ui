import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  ALL_COMPONENTS,
  getComponentBySlug,
} from "@/config/components-data";
import { ComponentWorkstation } from "@/components/detail/workstation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return ALL_COMPONENTS.map((comp) => ({
    slug: comp.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const comp = getComponentBySlug(slug);

  if (!comp) {
    return {
      title: "Component Not Found",
      description: "Requested Peel UI component could not be found.",
    };
  }

  return {
    title: comp.name,
    description: comp.description,
    openGraph: {
      title: `${comp.name} | Peel UI Tactile Primitives`,
      description: comp.description,
      type: "website",
      url: `https://peel-ui.vercel.app/components/${comp.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${comp.name} | Peel UI`,
      description: comp.description,
    },
  };
}

export default async function ComponentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const comp = getComponentBySlug(slug);

  if (!comp) {
    notFound();
  }

  return <ComponentWorkstation slug={slug} />;
}
