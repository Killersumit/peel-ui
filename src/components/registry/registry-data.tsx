import * as React from "react";
import { SlideToConfirm } from "@/components/ui/slide-to-confirm";
import { MagneticSplitButton } from "@/components/ui/magnetic-split-button";
import { TactileOtpInput } from "@/components/ui/tactile-otp-input";
import { PrivacyShutter } from "@/components/ui/privacy-shutter";
import { VoicePill } from "@/components/ui/voice-pill";
import { SaveStatePill } from "@/components/ui/save-state-pill";

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
      "npx shadcn@latest add https://peelui.dev/r/slide-to-confirm.json",
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
      "npx shadcn@latest add https://peelui.dev/r/magnetic-split-button.json",
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
      "npx shadcn@latest add https://peelui.dev/r/tactile-otp-input.json",
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
      "npx shadcn@latest add https://peelui.dev/r/voice-pill.json",
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
      "npx shadcn@latest add https://peelui.dev/r/privacy-shutter.json",
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
      "npx shadcn@latest add https://peelui.dev/r/save-state-pill.json",
    theme: "dark",
    component: () => (
      <div className="w-full flex items-center justify-center p-2">
        <SaveStatePill state="saved" />
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
