import type { ComponentType } from "react";

export type ComponentCategory =
  | "new-release"
  | "tactile-inputs"
  | "surfaces-navigation"
  | "motion-display"
  | "feedback-status";

export interface ComponentPropDef {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
  required?: boolean;
}

export interface StageSwatchDef {
  id: string;
  label: string;
  hex: string;
}

export interface PeelRegistryItem {
  slug: string;
  title: string;
  category: ComponentCategory;
  isNew?: boolean;
  /** Optional static preview thumbnail image */
  previewImage?: string;
  /** Whether this primitive is featured in the curated 6-primitive Hero tray */
  isCompactHeroFeatured?: boolean;
  /** 85% "dark" (--peel-surface), 15% "light" (--peel-light-surface) for grid visual rhythm */
  catalogCardTheme?: "dark" | "light";
  /** 1-to-2 sentence 25px pitch displayed in SpecPanel */
  leadPitch: string;
  /** Concise explanation of physics & interaction mechanics */
  interactionNotes: string;
  dependencies: string[];
  registryDependencies?: string[];
  filePath: string;
  code: string;
  props: ComponentPropDef[];
  swatches?: StageSwatchDef[];
  supportsReplay?: boolean;
  component: ComponentType<{
    accentHex?: string;
    replayKey?: number;
    theme?: "dark" | "light";
  }>;
}
