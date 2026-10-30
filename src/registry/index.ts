import React from "react";
import type { PeelRegistryItem, ComponentCategory } from "./schema";

// Raw primitive source files (for CodeInspector, copy actions, and CLI payloads)
import morphingShareIslandCode from "./primitives/morphing-share-island.tsx?raw";
import slideToConfirmCode from "./primitives/slide-to-confirm.tsx?raw";
import magneticSplitButtonCode from "./primitives/magnetic-split-button.tsx?raw";
import tactileOtpInputCode from "./primitives/tactile-otp-input.tsx?raw";
import voicePillCode from "./primitives/voice-pill.tsx?raw";
import privacyShutterCode from "./primitives/privacy-shutter.tsx?raw";
import saveStatePillCode from "./primitives/save-state-pill.tsx?raw";
import filterChipsCode from "./primitives/filter-chips.tsx?raw";
import noteButtonCode from "./primitives/note-button.tsx?raw";
import skeletonHandoffCode from "./primitives/skeleton-handoff.tsx?raw";
import moireFieldCode from "./primitives/moire-field.tsx?raw";
import moireIntroCode from "./primitives/moire-intro.tsx?raw";
import waitlistJoinCode from "./primitives/waitlist-join.tsx?raw";
import cookieConsentCode from "./primitives/cookie-consent.tsx?raw";
import nextUpCode from "./primitives/next-up.tsx?raw";
import detentTabsCode from "./primitives/detent-tabs.tsx?raw";
import layoutScrubCode from "./primitives/layout-scrub.tsx?raw";
import inviteFieldCode from "./primitives/invite-field.tsx?raw";
import roadmapVoteCode from "./primitives/roadmap-vote.tsx?raw";
import releaseNotesCode from "./primitives/release-notes.tsx?raw";
import skillPileCode from "./primitives/skill-pile.tsx?raw";
import notificationInboxCode from "./primitives/notification-inbox.tsx?raw";

// Live Component Implementations
import { MorphingShareIsland } from "./primitives/morphing-share-island";
import { SlideToConfirm } from "./primitives/slide-to-confirm";
import { MagneticSplitButton } from "./primitives/magnetic-split-button";
import { TactileOtpInput } from "./primitives/tactile-otp-input";
import { VoicePill } from "./primitives/voice-pill";
import { PrivacyShutter } from "./primitives/privacy-shutter";
import { SaveStatePillDemo } from "./primitives/save-state-pill";
import { FilterChipsDemo } from "./demos/filter-chips-demo";
import { NoteButtonDemo } from "./demos/note-button-demo";
import { SkeletonHandoffPreview } from "./demos/skeleton-handoff-demo";
import { MoireFieldDemo } from "./demos/moire-field-demo";
import { MoireIntroDemo } from "./demos/moire-intro-demo";
import { WaitlistJoinDemo } from "./demos/waitlist-join-demo";
import { CookieConsentDemo } from "./demos/cookie-consent-demo";
import { NextUpDemo } from "./demos/next-up-demo";
import { DetentTabsDemo } from "./demos/detent-tabs-demo";
import { LayoutScrubDemo } from "./demos/layout-scrub-demo";
import { InviteFieldDemo } from "./demos/invite-field-demo";
import { RoadmapVoteDemo } from "./demos/roadmap-vote-demo";
import { ReleaseNotesDemo } from "./demos/release-notes-demo";
import { SkillPileDemo } from "./demos/skill-pile-demo";
import { NotificationInboxDemo } from "./demos/notification-inbox-demo";

export const REGISTRY_ITEMS: PeelRegistryItem[] = [
  // =========================================================================
  // CATEGORY 1: NEW RELEASE
  // =========================================================================
  {
    slug: "morphing-share-island",
    title: "Morphing Share Island",
    category: "new-release",
    isNew: true,
    catalogCardTheme: "dark",
    leadPitch:
      "A compact share pill that spring-morphs into a 4-action radial dock and collapses into a confirmed state.",
    interactionNotes:
      "Driven by interruptible motion/react springs with differential icon stagger, shared layoutId tooltips, clipboard integration, and an automated replay sequence.",
    dependencies: ["motion", "@phosphor-icons/react"],
    filePath: "src/registry/primitives/morphing-share-island.tsx",
    code: morphingShareIslandCode,
    props: [
      {
        name: "defaultTheme",
        type: '"obsidian" | "paper" | "titanium"',
        defaultValue: '"obsidian"',
        description: "Initial surface palette.",
      },
      {
        name: "shareUrl",
        type: "string",
        defaultValue: '"https://peel-ui.vercel.app"',
        description: "URL copied to clipboard or shared.",
      },
      {
        name: "onAction",
        type: '(action: "copy" | "post" | "send" | "qr") => void',
        description: "Callback when an action is selected.",
      },
      {
        name: "showControls",
        type: "boolean",
        defaultValue: "true",
        description: "Whether to display the bottom theme & replay dock.",
      },
      {
        name: "className",
        type: "string",
        description: "Optional container class name.",
      },
    ],
    component: (props) => React.createElement(MorphingShareIsland, props),
  },
  {
    slug: "save-state-pill",
    title: "Save State Pill",
    category: "new-release",
    isNew: true,
    isCompactHeroFeatured: true,
    catalogCardTheme: "dark",
    leadPitch:
      "Spring-morphing toolbar status capsule with offline queuing, error recovery, and relative timestamps.",
    interactionNotes:
      "Cycles smoothly between saving spinner, saved checkmark, offline warning, and conflict state with zero layout thrashing via layoutId and critically damped spring transitions.",
    dependencies: ["motion", "lucide-react"],
    filePath: "src/registry/primitives/save-state-pill.tsx",
    code: saveStatePillCode,
    props: [
      {
        name: "state",
        type: '"idle" | "saving" | "saved" | "error" | "offline"',
        defaultValue: '"idle"',
        description: "Current network save lifecycle state.",
      },
      {
        name: "lastSavedAt",
        type: "Date",
        description: "Timestamp of last confirmed successful sync.",
      },
      {
        name: "onRetry",
        type: "() => void",
        description: "Callback invoked when clicking retry in error state.",
      },
    ],
    component: () => React.createElement("div", { className: "w-full flex items-center justify-center p-2" }, React.createElement(SaveStatePillDemo)),
  },
  {
    slug: "skill-pile",
    title: "Skill Pile",
    category: "new-release",
    isNew: true,
    previewImage: "/previews/skill-pile.webp",
    catalogCardTheme: "dark",
    leadPitch:
      "Rigid-body 2D physics tag stack driven by Matter.js with realistic gravity, mass, friction, and draggable impulse throwing.",
    interactionNotes:
      "Runs on Matter.js rigid-body physics engine. Pills fall into an invisible container, collide realistically, and can be dragged or flung across the canvas with momentum.",
    dependencies: ["matter-js"],
    filePath: "src/registry/primitives/skill-pile.tsx",
    code: skillPileCode,
    props: [
      {
        name: "skills",
        type: "SkillItem[]",
        description: "Array of skill tag definitions with label and accent tone.",
      },
    ],
    component: () => React.createElement("div", { className: "w-full h-full flex items-center justify-center overflow-hidden" }, React.createElement(SkillPileDemo)),
  },

  // =========================================================================
  // CATEGORY 2: TACTILE INPUTS
  // =========================================================================
  {
    slug: "slide-to-confirm",
    title: "Slide to Confirm",
    category: "tactile-inputs",
    isCompactHeroFeatured: true,
    catalogCardTheme: "dark",
    leadPitch:
      "Mechanical verification trigger with high-friction drag track and 75% magnetic snap pocket.",
    interactionNotes:
      "Constrained 1D compositor drag. If released below the 75% threshold, spring recoil returns puck to origin. Past 75%, puck snaps forward into confirmation detent.",
    dependencies: ["motion", "lucide-react"],
    filePath: "src/registry/primitives/slide-to-confirm.tsx",
    code: slideToConfirmCode,
    props: [
      {
        name: "label",
        type: "string",
        defaultValue: '"Slide to deploy"',
        description: "Idle placeholder label across the track.",
      },
      {
        name: "confirmedLabel",
        type: "string",
        defaultValue: '"Executed"',
        description: "Success label shown once puck locks into place.",
      },
      {
        name: "onConfirm",
        type: "() => void",
        description: "Callback triggered when puck locks into detent.",
      },
    ],
    component: () =>
      React.createElement(
        "div",
        { className: "w-full flex items-center justify-center p-2" },
        React.createElement(SlideToConfirm, {
          label: "Slide to deploy",
          confirmedLabel: "Executed",
          className: "w-full max-w-[320px]",
        })
      ),
  },
  {
    slug: "magnetic-split-button",
    title: "Magnetic Split Button",
    category: "tactile-inputs",
    isCompactHeroFeatured: true,
    catalogCardTheme: "dark",
    leadPitch:
      "Dual-capsule action trigger with proximity resistance and spring latching.",
    interactionNotes:
      "Subtle magnetic pull attaches the primary execute button to the option selector. Hovering near the seam causes an elastic separation before menu disclosure.",
    dependencies: ["motion", "lucide-react"],
    filePath: "src/registry/primitives/magnetic-split-button.tsx",
    code: magneticSplitButtonCode,
    props: [
      {
        name: "defaultAction",
        type: "string",
        defaultValue: '"Deploy to prod"',
        description: "Initial action label on the primary half.",
      },
      {
        name: "actions",
        type: "MagneticSplitAction[]",
        description: "Dropdown option choices for the split secondary half.",
      },
    ],
    component: () =>
      React.createElement(
        "div",
        { className: "w-full flex items-center justify-center p-4" },
        React.createElement(MagneticSplitButton, {
          defaultAction: "Deploy to prod",
        })
      ),
  },
  {
    slug: "tactile-otp-input",
    title: "Tactile OTP Input",
    category: "tactile-inputs",
    isCompactHeroFeatured: true,
    catalogCardTheme: "dark",
    leadPitch:
      "Numeric verification code input with sliding focus box and mechanical digit roll.",
    interactionNotes:
      "Features a floating squircle focus indicator driven by layoutId that glides mechanically between slots as digits are typed or deleted via backspace.",
    dependencies: ["motion"],
    filePath: "src/registry/primitives/tactile-otp-input.tsx",
    code: tactileOtpInputCode,
    props: [
      {
        name: "length",
        type: "number",
        defaultValue: "4",
        description: "Total number of code input slots.",
      },
      {
        name: "onComplete",
        type: "(code: string) => void",
        description: "Callback fired once all digits are entered.",
      },
    ],
    component: () =>
      React.createElement(
        "div",
        { className: "w-full flex items-center justify-center p-4" },
        React.createElement(TactileOtpInput, {
          initialValues: ["3", "8", "1", ""],
        })
      ),
  },
  {
    slug: "filter-chips",
    title: "Tactile Filter Chips",
    category: "tactile-inputs",
    isCompactHeroFeatured: true,
    catalogCardTheme: "dark",
    leadPitch:
      "Hardware-inspired filter group supporting radio selection, multi-select, and spring-bound indicator morphing.",
    interactionNotes:
      "Single mode glides a shared machined pill between items using layoutId with zero jitter. Multiple mode toggles individual mechanical states with tabular counters.",
    dependencies: ["motion"],
    filePath: "src/registry/primitives/filter-chips.tsx",
    code: filterChipsCode,
    props: [
      {
        name: "options",
        type: "FilterChipOption[]",
        description: "Filter choices with label, counter, and identifier.",
        required: true,
      },
      {
        name: "mode",
        type: '"single" | "multiple"',
        defaultValue: '"single"',
        description: "Exclusive single choice or multi-tag selection.",
      },
    ],
    component: () => React.createElement("div", { className: "w-full flex items-center justify-center p-2" }, React.createElement(FilterChipsDemo)),
  },
  {
    slug: "invite-field",
    title: "Invite Field",
    category: "tactile-inputs",
    previewImage: "/previews/invite-field.webp",
    catalogCardTheme: "dark",
    leadPitch:
      "Interactive teammate invitation field with real-time email tag chip tokenization and GSAP Flip layout morphing.",
    interactionNotes:
      "Tokens convert instantly on space/enter/comma. GSAP Flip calculates DOM coordinates dynamically, animating chip inserts and state transitions with silky 120fps precision.",
    dependencies: ["gsap", "@gsap/react"],
    filePath: "src/registry/primitives/invite-field.tsx",
    code: inviteFieldCode,
    props: [
      {
        name: "onInvite",
        type: "(emails: string[]) => Promise<void>",
        description: "Callback invoked when confirming teammate invites.",
      },
    ],
    component: () => React.createElement("div", { className: "w-full flex items-center justify-center p-2" }, React.createElement(InviteFieldDemo)),
  },
  {
    slug: "note-button",
    title: "Note Button",
    category: "tactile-inputs",
    isCompactHeroFeatured: true,
    catalogCardTheme: "dark",
    leadPitch:
      "Tactile floating notepad trigger expanding into a persistent, line-numbered code note sheet with keyboard management.",
    interactionNotes:
      "Expands smoothly from trigger origin using GSAP layout transforms, maintains local-storage state, and displays line-numbered gutter with synchronized scroll.",
    dependencies: ["gsap", "@gsap/react", "lucide-react"],
    filePath: "src/registry/primitives/note-button.tsx",
    code: noteButtonCode,
    props: [
      {
        name: "storageKey",
        type: "string",
        defaultValue: '"peel-note:v1"',
        description: "LocalStorage persistence key.",
      },
      {
        name: "showLineNumbers",
        type: "boolean",
        defaultValue: "true",
        description: "Toggles technical gutter line numbering.",
      },
    ],
    component: () => React.createElement("div", { className: "w-full flex items-center justify-center p-4" }, React.createElement(NoteButtonDemo)),
  },

  // =========================================================================
  // CATEGORY 3: SURFACES & NAVIGATION
  // =========================================================================
  {
    slug: "detent-tabs",
    title: "Detent Tabs",
    category: "surfaces-navigation",
    previewImage: "/previews/detent-tabs.webp",
    catalogCardTheme: "dark",
    leadPitch:
      "Range switcher whose dynamic preview follows the user's thumb and snaps cleanly into magnetic detent positions.",
    interactionNotes:
      "Continuous pointer scrub across the range bar dynamically updates values, with tactile spring snap into predefined detent milestones.",
    dependencies: ["motion"],
    filePath: "src/registry/primitives/detent-tabs.tsx",
    code: detentTabsCode,
    props: [
      {
        name: "ranges",
        type: "DetentTabsRange[]",
        description: "Selectable ranges and metrics.",
      },
    ],
    component: () => React.createElement("div", { className: "w-full flex items-center justify-center p-2" }, React.createElement(DetentTabsDemo)),
  },
  {
    slug: "layout-scrub",
    title: "Layout Scrub",
    category: "surfaces-navigation",
    previewImage: "/previews/layout-scrub.webp",
    catalogCardTheme: "dark",
    leadPitch:
      "Continuous scrub control morphing card list layout into multi-column grid layout with spatial consistency.",
    interactionNotes:
      "Interpolates position, opacity, and typography continuously between 1D vertical list and 2D grid arrangements based on scrub progress.",
    dependencies: ["motion"],
    filePath: "src/registry/primitives/layout-scrub.tsx",
    code: layoutScrubCode,
    props: [
      {
        name: "items",
        type: "LayoutScrubItem[]",
        description: "Data items transformed between list and grid presentations.",
      },
    ],
    component: () => React.createElement("div", { className: "w-full flex items-center justify-center p-2" }, React.createElement(LayoutScrubDemo)),
  },
  {
    slug: "privacy-shutter",
    title: "Privacy Shutter",
    category: "surfaces-navigation",
    catalogCardTheme: "dark",
    leadPitch:
      "Security credential shroud with spring-loaded physical slider and automatic release peek cover.",
    interactionNotes:
      "Requires dragging or holding the tactile slider to reveal sensitive keys. Releasing snaps the shroud shut with spring recoil to prevent shoulder surfing.",
    dependencies: ["motion", "lucide-react"],
    filePath: "src/registry/primitives/privacy-shutter.tsx",
    code: privacyShutterCode,
    props: [
      {
        name: "value",
        type: "string",
        defaultValue: '"pk_live_51M0...938"',
        description: "Masked secret or API token.",
      },
    ],
    component: () =>
      React.createElement(
        "div",
        { className: "w-full flex items-center justify-center p-4" },
        React.createElement(PrivacyShutter, {
          className: "w-full max-w-[360px]",
        })
      ),
  },
  {
    slug: "cookie-consent",
    title: "Cookie Consent",
    category: "surfaces-navigation",
    previewImage: "/previews/cookie-consent.webp",
    catalogCardTheme: "dark",
    leadPitch:
      "Quiet, respectful privacy choice card with zero telemetry tracking, keyboard navigation, and machined carbon shell.",
    interactionNotes:
      "Expands from unobtrusive bottom badge to granular categorization sheet with critically damped spring transitions and complete keyboard accessibility.",
    dependencies: ["motion", "lucide-react"],
    filePath: "src/registry/primitives/cookie-consent.tsx",
    code: cookieConsentCode,
    props: [
      {
        name: "onAcceptAll",
        type: "() => void",
        description: "Callback fired when approving all categories.",
      },
    ],
    component: () => React.createElement("div", { className: "w-full flex items-center justify-center p-2" }, React.createElement(CookieConsentDemo)),
  },

  // =========================================================================
  // CATEGORY 4: MOTION & DISPLAY
  // =========================================================================
  {
    slug: "moire-field",
    title: "Moiré Field",
    category: "motion-display",
    previewImage: "/previews/moire-field.webp",
    catalogCardTheme: "dark",
    leadPitch:
      "Optical interference pattern canvas with dual rotating gratings, gentle falloff masks, and pointer tracking.",
    interactionNotes:
      "Renders hardware-accelerated dual radial line grids whose angular offset creates dynamic physical Moiré fringe interference waves.",
    dependencies: [],
    filePath: "src/registry/primitives/moire-field.tsx",
    code: moireFieldCode,
    props: [
      {
        name: "density",
        type: "number",
        defaultValue: "36",
        description: "Number of concentric grating lines.",
      },
    ],
    component: () => React.createElement("div", { className: "w-full h-full flex items-center justify-center overflow-hidden" }, React.createElement(MoireFieldDemo)),
  },
  {
    slug: "moire-intro",
    title: "Moiré Intro",
    category: "motion-display",
    previewImage: "/previews/moire-intro.webp",
    catalogCardTheme: "dark",
    leadPitch:
      "Full-screen atmospheric page loader with optical grating interference, mechanical lock settle, and slide exit.",
    interactionNotes:
      "Coordinates an introductory dual-grating canvas interference pattern driven by GSAP timelines that locks into place before splitting outward to reveal page contents.",
    dependencies: ["gsap", "@gsap/react"],
    filePath: "src/registry/primitives/moire-intro.tsx",
    code: moireIntroCode,
    props: [
      {
        name: "onComplete",
        type: "() => void",
        description: "Fires once intro lock and reveal finish.",
      },
    ],
    component: () => React.createElement("div", { className: "w-full flex items-center justify-center p-2" }, React.createElement(MoireIntroDemo)),
  },
  {
    slug: "skeleton-handoff",
    title: "Skeleton Handoff",
    category: "motion-display",
    catalogCardTheme: "dark",
    leadPitch:
      "Measured loading blocks that travel directly into resolved content positions using GSAP Flip state transitions.",
    interactionNotes:
      "Rather than crossfading, placeholder geometries morph into actual images and text lines using GSAP Flip layout state transitions for zero visual jarring.",
    dependencies: ["gsap", "@gsap/react"],
    filePath: "src/registry/primitives/skeleton-handoff.tsx",
    code: skeletonHandoffCode,
    props: [
      {
        name: "loading",
        type: "boolean",
        description: "Active loading state.",
      },
    ],
    component: () => React.createElement("div", { className: "w-full flex items-center justify-center p-2" }, React.createElement(SkeletonHandoffPreview)),
  },
  {
    slug: "release-notes",
    title: "Release Notes",
    category: "motion-display",
    previewImage: "/previews/release-notes.webp",
    catalogCardTheme: "dark",
    leadPitch:
      "Changelog timeline where monumental pinned version numerals roll smoothly into accent bands during scroll.",
    interactionNotes:
      "ScrollTrigger coordinates pinned left-side version indices with active timeline content sections, rolling numerals as reading boundaries cross.",
    dependencies: ["gsap", "@gsap/react"],
    filePath: "src/registry/primitives/release-notes.tsx",
    code: releaseNotesCode,
    props: [
      {
        name: "releases",
        type: "ReleaseItem[]",
        description: "Ordered release versions and entry logs.",
      },
    ],
    component: () => React.createElement("div", { className: "w-full flex items-center justify-center p-2" }, React.createElement(ReleaseNotesDemo)),
  },

  // =========================================================================
  // CATEGORY 5: FEEDBACK & STATUS
  // =========================================================================
  {
    slug: "voice-pill",
    title: "Voice Pill",
    category: "feedback-status",
    catalogCardTheme: "dark",
    leadPitch:
      "Hardware voice capsule with real-time audio AnalyserNode frequency bars and slide-to-cancel physics.",
    interactionNotes:
      "Connects to Web Audio API for 60fps waveform visualization. Holding allows speech recording; dragging left triggers red cancel threshold.",
    dependencies: ["lucide-react"],
    filePath: "src/registry/primitives/voice-pill.tsx",
    code: voicePillCode,
    props: [
      {
        name: "onRecord",
        type: "() => void",
        description: "Fires when voice input starts.",
      },
      {
        name: "onCancel",
        type: "() => void",
        description: "Fires when user slides puck left past cancel detent.",
      },
    ],
    component: () =>
      React.createElement(
        "div",
        { className: "w-full flex items-center justify-center p-4" },
        React.createElement(VoicePill, {
          reactive: "simulated",
          size: 40,
        })
      ),
  },
  {
    slug: "waitlist-join",
    title: "Waitlist Join",
    category: "feedback-status",
    previewImage: "/previews/waitlist-join.webp",
    catalogCardTheme: "dark",
    leadPitch:
      "Tactile email capture card with layout-morphing confirmation, dynamic rank queue position, and instant social sharing.",
    interactionNotes:
      "Input field morphs into celebratory confirmation card with rolling position counter and single-click clipboard referral link.",
    dependencies: ["motion", "lucide-react"],
    filePath: "src/registry/primitives/waitlist-join.tsx",
    code: waitlistJoinCode,
    props: [
      {
        name: "onSubmit",
        type: "(email: string) => Promise<{ position: number }>",
        description: "Asynchronous subscription submission callback.",
      },
    ],
    component: () => React.createElement("div", { className: "w-full flex items-center justify-center p-2" }, React.createElement(WaitlistJoinDemo)),
  },
  {
    slug: "next-up",
    title: "Next Up",
    category: "feedback-status",
    previewImage: "/previews/next-up.webp",
    catalogCardTheme: "dark",
    leadPitch:
      "Setup checklist card focusing human attention on the single next actionable task with calm GSAP Flip reordering.",
    interactionNotes:
      "Checking off an item captures DOM layout state with GSAP Flip, tucks it underneath, and smoothly animates the next pending step into primary prominence.",
    dependencies: ["gsap", "@gsap/react"],
    filePath: "src/registry/primitives/next-up.tsx",
    code: nextUpCode,
    props: [
      {
        name: "steps",
        type: "NextUpStep[]",
        description: "Ordered checklist steps with title and description.",
      },
    ],
    component: () => React.createElement("div", { className: "w-full flex items-center justify-center p-2" }, React.createElement(NextUpDemo)),
  },
  {
    slug: "roadmap-vote",
    title: "Roadmap Vote",
    category: "feedback-status",
    previewImage: "/previews/roadmap-vote.webp",
    catalogCardTheme: "dark",
    leadPitch:
      "Public feature backlog ranking list where items reorder with GSAP Flip when their vote tallies pass neighbours.",
    interactionNotes:
      "Clicking vote increments counter with tabular font animation and immediately reorders row positions using GSAP Flip state transitions.",
    dependencies: ["gsap", "@gsap/react"],
    filePath: "src/registry/primitives/roadmap-vote.tsx",
    code: roadmapVoteCode,
    props: [
      {
        name: "items",
        type: "RoadmapVoteItem[]",
        description: "Roadmap features with title, vote tally, and state.",
      },
    ],
    component: () => React.createElement("div", { className: "w-full flex items-center justify-center p-2" }, React.createElement(RoadmapVoteDemo)),
  },
  {
    slug: "notification-inbox",
    title: "Notification Inbox",
    category: "feedback-status",
    previewImage: "/previews/notification-inbox.webp",
    catalogCardTheme: "dark",
    leadPitch:
      "Tactile notification bell trigger with unread badge counter roll and anchored glass inbox panel.",
    interactionNotes:
      "New alerts trigger micro-chime bell rotation, increment the monospace badge counter, and highlight unread cards with high-voltage accent indicators using pure CSS transforms and state management.",
    dependencies: [],
    filePath: "src/registry/primitives/notification-inbox.tsx",
    code: notificationInboxCode,
    props: [
      {
        name: "unreadCount",
        type: "number",
        defaultValue: "3",
        description: "Number of active unread notifications.",
      },
    ],
    component: () => React.createElement("div", { className: "w-full flex items-center justify-center p-2" }, React.createElement(NotificationInboxDemo)),
  },
];

export function getAllRegistryItems(): PeelRegistryItem[] {
  return REGISTRY_ITEMS;
}

export function getFeaturedHeroItems(): PeelRegistryItem[] {
  return REGISTRY_ITEMS.filter((item) => item.isCompactHeroFeatured);
}

export function getRegistryItemBySlug(slug: string): PeelRegistryItem | undefined {
  return REGISTRY_ITEMS.find((item) => item.slug === slug);
}

const CATEGORY_METADATA: { category: ComponentCategory; title: string }[] = [
  { category: "new-release", title: "New Release" },
  { category: "tactile-inputs", title: "Tactile Inputs" },
  { category: "surfaces-navigation", title: "Surfaces & Navigation" },
  { category: "motion-display", title: "Motion & Display" },
  { category: "feedback-status", title: "Feedback & Status" },
];

export function getRegistryByCategories(): {
  category: ComponentCategory;
  title: string;
  items: PeelRegistryItem[];
}[] {
  return CATEGORY_METADATA.map((cat) => ({
    category: cat.category,
    title: cat.title,
    items: REGISTRY_ITEMS.filter((item) => item.category === cat.category),
  }));
}
