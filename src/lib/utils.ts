import { clsx, type ClassValue } from "clsx";
import type { PrismTheme } from "prism-react-renderer";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes cleanly resolving any conflicts.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Converts a 3-digit or 6-digit hex string and an alpha channel [0, 1] into an rgba string.
 */
function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace("#", "").trim();
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split("")
          .map((c) => c + c)
          .join("")
      : cleanHex;

  const num = parseInt(fullHex, 16);
  if (Number.isNaN(num)) {
    return `rgba(255, 255, 255, ${alpha})`;
  }

  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Returns a PrismTheme object for prism-react-renderer using 4 luminance/opacity
 * shades of the provided accentHex, paired with #F5F5F7 identifiers and #52555A comments.
 */
export function createSingleAccentTheme(accentHex: string): PrismTheme {
  const shade1 = hexToRgba(accentHex, 1.0);
  const shade2 = hexToRgba(accentHex, 0.78);
  const shade3 = hexToRgba(accentHex, 0.58);
  const shade4 = hexToRgba(accentHex, 0.38);

  return {
    plain: {
      color: "#F5F5F7",
      backgroundColor: "transparent",
    },
    styles: [
      {
        types: ["comment", "prolog", "doctype", "cdata"],
        style: {
          color: "#52555A",
        },
      },
      {
        types: ["variable", "property", "identifier"],
        style: {
          color: "#F5F5F7",
        },
      },
      {
        types: ["keyword", "operator", "tag", "selector", "important", "atrule"],
        style: {
          color: shade1,
        },
      },
      {
        types: ["function", "class-name", "attr-name", "module"],
        style: {
          color: shade2,
        },
      },
      {
        types: ["string", "char", "attr-value", "regex"],
        style: {
          color: shade3,
        },
      },
      {
        types: ["number", "boolean", "constant", "symbol", "builtin", "entity"],
        style: {
          color: shade4,
        },
      },
      {
        types: ["punctuation"],
        style: {
          color: "#8E9299",
        },
      },
    ],
  };
}
