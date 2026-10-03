import * as React from "react";
import { SlideToConfirm } from "@/components/ui/slide-to-confirm";
import { MagneticSplitButton } from "@/components/ui/magnetic-split-button";
import { TactileOtpInput } from "@/components/ui/tactile-otp-input";
import { PrivacyShutter } from "@/components/ui/privacy-shutter";
import { VoicePill } from "@/components/ui/voice-pill";
import { SaveStatePill } from "@/components/ui/save-state-pill";
import { FilterChips } from "@/components/ui/filter-chips";
import { NoteButtonDemo } from "@/components/demos/note-button-demo";

import Image from "next/image";

const SkeletonHandoffPreview = React.lazy(() =>
  import("@/components/demos/skeleton-handoff-demo").then((module) => ({
    default: module.SkeletonHandoffPreview,
  })),
);

export interface ComponentMetadata {
  name: string;
  slug: string;
  category: "Actions" | "Inputs" | "Security";
  description: string;
  cliCommand: string;
  theme?: "dark" | "light";
  component: React.ComponentType;
}

export const REGISTRY_COMPONENTS: ComponentMetadata[] = [
  {
    name: "Slide to Confirm",
    slug: "slide-to-confirm",
    category: "Actions",
    description:
      "Tactile slide-to-confirm track with spring recoil, dynamic constraints, and matte progress feedback.",
    cliCommand:
      "npx shadcn@latest add https://peel-ui.vercel.app/r/slide-to-confirm.json",
    theme: "light",
    component: () => (
      <div className="w-full flex items-center justify-center p-2">
        <SlideToConfirm
          label="Slide to deploy"
          className="w-full max-w-[280px]"
        />
      </div>
    ),
  },
  {
    name: "Magnetic Split Button",
    slug: "magnetic-split-button",
    category: "Actions",
    description:
      "Tactile split action button with magnetic separation physics, spring recoil, and integrated dropdown menu.",
    cliCommand:
      "npx shadcn@latest add https://peel-ui.vercel.app/r/magnetic-split-button.json",
    theme: "dark",
    component: () => (
      <div className="w-full flex items-center justify-center p-2">
        <MagneticSplitButton defaultAction="Deploy to prod" />
      </div>
    ),
  },
  {
    name: "Tactile OTP Input",
    slug: "tactile-otp-input",
    category: "Inputs",
    description:
      "Tactile verification input with a spring-loaded floating lens focus frame, digit tumblers, and full mobile support.",
    cliCommand:
      "npx shadcn@latest add https://peel-ui.vercel.app/r/tactile-otp-input.json",
    theme: "light",
    component: () => (
      <div className="w-full flex items-center justify-center p-2">
        <TactileOtpInput initialValues={["3", "8", "1", ""]} />
      </div>
    ),
  },
  {
    name: "Voice Pill",
    slug: "voice-pill",
    category: "Inputs",
    description:
      "Tactile expanding voice memo pill with live audio FFT waveform, slide-to-cancel physics, and hardware mic capture.",
    cliCommand:
      "npx shadcn@latest add https://peel-ui.vercel.app/r/voice-pill.json",
    theme: "dark",
    component: () => (
      <div className="w-full flex items-center justify-center p-2">
        <VoicePill reactive="simulated" size={40} />
      </div>
    ),
  },
  {
    name: "Privacy Shutter",
    slug: "privacy-shutter",
    category: "Security",
    description:
      "Tactile mechanical privacy shutter primitive for sensitive credential concealment, spring peek, and latch detent.",
    cliCommand:
      "npx shadcn@latest add https://peel-ui.vercel.app/r/privacy-shutter.json",
    theme: "dark",
    component: () => (
      <div className="w-full flex items-center justify-center p-2">
        <PrivacyShutter className="w-full max-w-[320px]" />
      </div>
    ),
  },
  {
    name: "Save State Pill",
    slug: "save-state-pill",
    category: "Actions",
    description:
      "Spring-morphing toolbar status indicator with offline queuing, error recovery, and relative timestamps.",
    cliCommand:
      "npx shadcn@latest add https://peel-ui.vercel.app/r/save-state-pill.json",
    theme: "dark",
    component: () => (
      <div className="w-full flex items-center justify-center p-2">
        <SaveStatePill state="saved" />
      </div>
    ),
  },
  {
    name: "Tactile Filter Chips",
    slug: "filter-chips",
    category: "Inputs",
    description:
      "Hardware-inspired multi-select and radio filter chips with spring-bound layout morphing and tabular counters.",
    cliCommand:
      "npx shadcn@latest add https://peel-ui.vercel.app/r/filter-chips.json",
    theme: "dark",
    component: () => (
      <div className="w-full flex items-center justify-center p-2">
        <FilterChips
          options={[
            { id: "all", label: "All Issues" },
            { id: "open", label: "Open", count: 14 },
            { id: "pull-requests", label: "Pull Requests", count: 6 },
          ]}
          defaultValue="all"
          size="sm"
        />
      </div>
    ),
  },
  {
    name: "Note Button",
    slug: "note-button",
    category: "Actions",
    description:
      "A notebook trigger that expands into a persistent, line-numbered note panel with a keyboard-aware mobile sheet.",
    cliCommand:
      "npx shadcn@latest add https://peel-ui.vercel.app/r/note-button.json",
    theme: "dark",
    component: NoteButtonDemo,
  },
  {
    name: "Skeleton Handoff",
    slug: "skeleton-handoff",
    category: "Actions",
    description:
      "Measured loading blocks travel into matching content while its final height settles.",
    cliCommand:
      "npx shadcn@latest add https://peel-ui.vercel.app/r/skeleton-handoff.json",
    theme: "dark",
    component: () => (
      <React.Suspense
        fallback={
          <div className="w-full space-y-2 p-4" aria-hidden="true">
            <div className="h-4 w-1/3 bg-[#1e2129]" />
            <div className="h-16 w-full bg-[#1e2129]" />
          </div>
        }
      >
        <SkeletonHandoffPreview />
      </React.Suspense>
    ),
  },
  {
    name: "Moiré Field",
    slug: "moire-field",
    category: "Actions",
    description:
      "Full-bleed background with dual gratings, calm falloff masks, and pointer response.",
    cliCommand:
      "npx shadcn@latest add https://peel-ui.vercel.app/r/moire-field.json",
    theme: "dark",
    component: () => (
      <div className="-m-4 h-52 sm:h-56 w-[calc(100%+2rem)] overflow-hidden">
        <Image
          src="/previews/moire-field.webp"
          alt="Moiré Field pattern preview"
          width={760}
          height={440}
          loading="lazy"
          className="size-full object-cover"
        />
      </div>
    ),
  },
  {
    name: "Moiré Intro",
    slug: "moire-intro",
    category: "Actions",
    description:
      "Dual line gratings rotate, widen, and calm into register before a mechanical exit reveal.",
    cliCommand:
      "npx shadcn@latest add https://peel-ui.vercel.app/r/moire-intro.json",
    theme: "dark",
    component: () => (
      <div className="-m-4 h-52 sm:h-56 w-[calc(100%+2rem)] overflow-hidden">
        <Image
          src="/previews/moire-intro.webp"
          alt="Moiré Intro pattern preview"
          width={760}
          height={440}
          loading="lazy"
          className="size-full object-cover"
        />
      </div>
    ),
  },
];

export const CATEGORIES = [
  "Actions",
  "Inputs",
  "Security",
] as const;

export function getComponentsByCategory(
  category: string
): ComponentMetadata[] {
  return REGISTRY_COMPONENTS.filter((comp) => comp.category === category);
}

export function getComponentBySlug(
  slug: string
): ComponentMetadata | undefined {
  return REGISTRY_COMPONENTS.find((comp) => comp.slug === slug);
}
