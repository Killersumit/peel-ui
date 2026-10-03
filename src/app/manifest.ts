import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Peel UI | Tactile Motion Primitives",
    short_name: "Peel UI",
    description:
      "Tactile, hardware-grade motion primitives for React and Tailwind CSS.",
    start_url: "/",
    display: "standalone",
    background_color: "#08090a",
    theme_color: "#08090a",
    icons: [
      {
        src: "/peeluiicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/peeluiicon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
