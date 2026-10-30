import { useState, useId } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowCounterClockwise,
  Copy,
  Check,
  ArrowLeft,
  ArrowRight,
  FileText,
} from "@phosphor-icons/react";
import {
  getAllRegistryItems,
  getRegistryItemBySlug,
  getRegistryByCategories,
} from "@/registry";
import Footer from "@/components/layout/Footer";
import { usePageMeta } from "@/lib/usePageMeta";
import { cn } from "@/lib/utils";

type TabMode = "preview" | "code";
type InstallMode = "cli" | "manual";
type PkgManager = "pnpm" | "npm" | "yarn" | "bun";

function renderSyntaxLine(line: string) {
  const trimmed = line.trim();
  if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
    return <span className="text-[#555961]">{line}</span>;
  }

  const tokenRegex =
    /(\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:import|export|from|default|return|function|const|let|var|interface|type|extends|as|typeof|boolean|string|number|void|null|undefined|true|false)\b|<\/?[A-Za-z0-9_.-]+|[{}()[\],;]|\S+|\s+)/g;

  const tokens = line.match(tokenRegex) || [line];
  return tokens.map((token, i) => {
    if (token.startsWith("//")) {
      return (
        <span key={i} className="text-[#555961]">
          {token}
        </span>
      );
    }
    if (
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("'") && token.endsWith("'")) ||
      (token.startsWith("`") && token.endsWith("`"))
    ) {
      return (
        <span key={i} className="text-[#76B872]">
          {token}
        </span>
      );
    }
    if (
      /^(?:import|export|from|default|return|function|const|let|var|interface|type|extends|as|typeof|boolean|string|number|void|null|undefined|true|false)$/.test(
        token
      )
    ) {
      return (
        <span key={i} className="text-[#F5F5F7] font-semibold">
          {token}
        </span>
      );
    }
    if (token.startsWith("<") || token.startsWith("</")) {
      return (
        <span key={i} className="text-[#D4D8E2]">
          {token}
        </span>
      );
    }
    if (/^[{}()[\],;]$/.test(token)) {
      return (
        <span key={i} className="text-[#6D727D]">
          {token}
        </span>
      );
    }
    return (
      <span key={i} className="text-[#B4B8C2]">
        {token}
      </span>
    );
  });
}

export default function ComponentWorkspacePage() {
  const { slug } = useParams<{ slug: string }>();
  const currentSlug = slug || "slide-to-confirm";

  const item = getRegistryItemBySlug(currentSlug);
  const allItems = getAllRegistryItems();
  const categorized = getRegistryByCategories();

  const [activeTab, setActiveTab] = useState<TabMode>("preview");
  const [stageTheme, setStageTheme] = useState<"dark" | "light">("dark");
  const [installMode, setInstallMode] = useState<InstallMode>("cli");
  const [previewKey, setPreviewKey] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedManualDep, setCopiedManualDep] = useState(false);
  const [copiedManualSource, setCopiedManualSource] = useState(false);

  const [pkgManager, setPkgManager] = useState<PkgManager>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("peel-pkg-manager");
      if (saved === "pnpm" || saved === "npm" || saved === "yarn" || saved === "bun") {
        return saved;
      }
    }
    return "pnpm";
  });

  const layoutTabId = useId();

  // Page Meta & SEO update
  usePageMeta({
    title: item ? `${item.title} — Peel UI` : "Components — Peel UI",
    description: item?.leadPitch || "Explore tactile UI component primitives.",
  });

  const handleSetPkgManager = (pm: PkgManager) => {
    setPkgManager(pm);
    if (typeof window !== "undefined") {
      localStorage.setItem("peel-pkg-manager", pm);
    }
  };

  const handleCopyCode = async (codeText: string, setter: (val: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(codeText);
      setter(true);
      setTimeout(() => setter(false), 1500);
    } catch {
      // Fallback
    }
  };

  const handleCopyMdForLLMs = async () => {
    if (!item) return;
    const mdSpec = `# ${item.title} (@peel-ui/${item.slug})

${item.leadPitch}
${item.interactionNotes}

## Install via shadcn CLI
\`\`\`bash
npx shadcn@latest add @peel-ui/${item.slug}
\`\`\`

## Dependencies
${item.dependencies.join(", ")}

## Source Code (\`${item.filePath || `components/ui/${item.slug}.tsx`}\`)
\`\`\`tsx
${item.code}
\`\`\`
`;
    await handleCopyCode(mdSpec, setCopiedMd);
  };

  // Find sequential prev/next items
  const currentIndex = allItems.findIndex((it) => it.slug === currentSlug);
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextItem =
    currentIndex >= 0 && currentIndex < allItems.length - 1
      ? allItems[currentIndex + 1]
      : null;

  // Not Found Slug Fallback
  if (!item) {
    return (
      <div className="relative min-h-screen w-full bg-[var(--peel-base)] text-[var(--peel-text-primary)] flex flex-col justify-between">
        <main className="max-w-[1040px] mx-auto w-full px-5 sm:px-6 pt-36 pb-24 text-center">
          <div className="text-[12px] font-medium text-[var(--peel-text-tertiary)] mb-3">
            404 — Not found
          </div>
          <h1 className="text-[28px] font-medium tracking-[-0.03em] text-[#F5F5F7]">
            Component primitive not found
          </h1>
          <p className="mt-2 text-[14px] text-[var(--peel-text-secondary)]">
            The component &ldquo;{currentSlug}&rdquo; does not exist in the Peel UI registry.
          </p>
          <div className="mt-7">
            <Link
              to="/components"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-[11px] bg-[#F5F5F7] text-[#08090A] text-[13px] font-medium transition-colors hover:bg-white"
            >
              <span>Browse Components</span>
              <span className="inline-flex items-center">
                <ArrowRight size={13} weight="bold" />
              </span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const ItemComponent = item.component;

  const cliCommands: Record<PkgManager, string> = {
    pnpm: `pnpm dlx shadcn@latest add @peel-ui/${item.slug}`,
    npm: `npx shadcn@latest add @peel-ui/${item.slug}`,
    yarn: `yarn dlx shadcn@latest add @peel-ui/${item.slug}`,
    bun: `bunx --bun shadcn@latest add @peel-ui/${item.slug}`,
  };

  const manualDependencies =
    item.dependencies && item.dependencies.length > 0
      ? item.dependencies
      : ["motion", "clsx", "tailwind-merge"];

  const manualInstallCmd = `npm install ${manualDependencies.join(" ")}`;

  const codeLines = (item.code || "").split("\n");

  return (
    <div className="relative min-h-screen w-full bg-[var(--peel-base)] text-[var(--peel-text-primary)] selection:bg-[var(--peel-lime)] selection:text-[var(--peel-lime-foreground)]">
      {/* Background Dot Matrix (Fixed & Composited: Zero Repaint on Scroll) */}
      <div
        className="pointer-events-none fixed inset-0 -z-20 [background-image:radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_20%,transparent_100%)] transform-gpu"
        aria-hidden="true"
      />

      <div className="max-w-[1040px] mx-auto w-full px-3 sm:px-6 pt-28 pb-24">
        {/* Mobile Component Stepper Bar */}
        <div className="flex lg:hidden items-center justify-between gap-2 mb-6">
          <Link
            to="/components"
            className="h-9 px-3 rounded-[10px] bg-[#16181E] hover:bg-[#1B1E25] text-[12.5px] font-medium text-[#8E9299] hover:text-[#F5F5F7] inline-flex items-center gap-1.5 whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,0.085)]"
          >
            <span className="inline-flex items-center">
              <ArrowLeft size={12} weight="bold" />
            </span>
            <span>All Components</span>
          </Link>
          <div className="inline-flex items-center gap-1.5">
            {prevItem ? (
              <Link
                to={`/components/${prevItem.slug}`}
                aria-label="Previous component"
                className="size-9 rounded-[10px] bg-[#16181E] hover:bg-[#1B1E25] active:bg-[#232730] text-[#F5F5F7] flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.085)]"
              >
                <span className="inline-flex items-center">
                  <ArrowLeft size={14} weight="bold" />
                </span>
              </Link>
            ) : (
              <span className="size-9 rounded-[10px] bg-[#16181E]/50 text-[#555961] flex items-center justify-center cursor-not-allowed">
                <span className="inline-flex items-center">
                  <ArrowLeft size={14} weight="bold" />
                </span>
              </span>
            )}
            <div className="px-2.5 h-9 rounded-[10px] bg-[#060709] font-mono text-[11.5px] tabular-nums text-[#8E9299] flex items-center justify-center shadow-[inset_0_2px_6px_rgba(0,0,0,0.92),inset_0_0_0_1px_rgba(255,255,255,0.035)]">
              {currentIndex + 1} / {allItems.length}
            </div>
            {nextItem ? (
              <Link
                to={`/components/${nextItem.slug}`}
                aria-label="Next component"
                className="size-9 rounded-[10px] bg-[#16181E] hover:bg-[#1B1E25] active:bg-[#232730] text-[#F5F5F7] flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.085)]"
              >
                <span className="inline-flex items-center">
                  <ArrowRight size={14} weight="bold" />
                </span>
              </Link>
            ) : (
              <span className="size-9 rounded-[10px] bg-[#16181E]/50 text-[#555961] flex items-center justify-center cursor-not-allowed">
                <span className="inline-flex items-center">
                  <ArrowRight size={14} weight="bold" />
                </span>
              </span>
            )}
          </div>
        </div>

        {/* ── Main Workspace Grid: Left Rail + Center Stage ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[210px_minmax(0,1fr)] gap-8 lg:gap-10 items-start">
          {/* ===================================================================
              1. LEFT STICKY COMPONENT NAVIGATION RAIL (Lenis-safe)
              =================================================================== */}
          <aside
            data-lenis-prevent
            className="hidden lg:block sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {categorized.map((cat) => (
              <div key={cat.category} className="mb-5 first:mt-0">
                <div className="text-[12px] font-medium tracking-[-0.01em] text-[#8E9299] mb-2 whitespace-nowrap">
                  {cat.title}
                </div>
                <div className="space-y-0.5 border-l border-white/[0.05]">
                  {cat.items.map((entry) => {
                    const isActive = entry.slug === currentSlug;
                    return (
                      <Link
                        key={entry.slug}
                        to={`/components/${entry.slug}`}
                        className={`relative flex items-center justify-between pl-3.5 py-1.5 text-[13px] tracking-[-0.012em] whitespace-nowrap transition-colors duration-150 ${
                          isActive
                            ? "text-[#F5F5F7] font-medium"
                            : "text-[#8E9299] hover:text-[#F5F5F7]"
                        }`}
                      >
                        {isActive && (
                          <div className="absolute -left-[1px] inset-y-1 w-[2px] rounded-full bg-[#F5F5F7]" />
                        )}
                        <span className="truncate">{entry.title}</span>
                        {entry.isNew && (
                          <span
                            className="size-1.5 rounded-full bg-[#5E9E5A] shrink-0 ml-2"
                            aria-label="New primitive"
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </aside>

          {/* ===================================================================
              2. RIGHT WORKSPACE COLUMN (Header, Stage, Install, Props, Nav)
              =================================================================== */}
          <main id="main-content" className="min-w-0">
            {/* ── Top Meta Breadcrumb Row ── */}
            <div className="flex items-center justify-between gap-4 mb-3">
              <nav aria-label="Breadcrumbs" className="flex items-center font-sans font-medium text-[12px] tracking-[-0.01em]">
                <Link
                  to="/components"
                  className="text-[#8E9299] hover:text-[#F5F5F7] transition-colors"
                >
                  Components
                </Link>
                <span className="text-[#555961] mx-2">/</span>
                <span className="text-[#555961]">
                  {categorized.find((c) => c.category === item.category)?.title || item.category}
                </span>
              </nav>

              <button
                type="button"
                onClick={handleCopyMdForLLMs}
                className="h-7 px-2.5 rounded-[8px] bg-[#1B1E25] hover:bg-[#232730] text-[11px] font-mono text-[#8E9299] hover:text-[#F5F5F7] inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,0.085)]"
                title="Copy Markdown specification for AI coding agents"
              >
                {copiedMd ? (
                  <>
                    <span className="text-[var(--peel-lime)] inline-flex items-center">
                      <Check size={12} weight="bold" />
                    </span>
                    <span>Copied .md!</span>
                  </>
                ) : (
                  <>
                    <span className="inline-flex items-center">
                      <FileText size={12} />
                    </span>
                    <span>Copy .md for LLMs</span>
                  </>
                )}
              </button>
            </div>

            {/* ── Title & Two-Tone Lead Pitch ── */}
            <h1 className="font-sans font-medium tracking-[-0.038em] leading-[1.06] text-[clamp(1.75rem,3.4vw,2.75rem)] text-[#F5F5F7] text-balance">
              {item.title}
            </h1>

            <p className="mt-3 max-w-[48ch] text-[15px] leading-[1.6] tracking-[-0.012em] text-pretty">
              <span className="text-[#F5F5F7] font-medium">{item.leadPitch}</span>
              <span className="text-[#8E9299] font-normal"> {item.interactionNotes}</span>
            </p>

            {/* ===================================================================
                3. DOPPELRAND INTERACTIVE STAGE & CODE VIEWER (Preview | Code)
                =================================================================== */}
            <div className="mt-7">
              {/* Toolbar Row */}
              <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                {/* Left Pod: Preview | Code + Stage Theme Switch */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Segmented Preview | Code Switch */}
                  <div className="p-1 rounded-[12px] bg-[#060709] shadow-[inset_0_1px_4px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(255,255,255,0.04)] inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab("preview")}
                      className={`h-7 px-3.5 rounded-[8px] text-[12.5px] font-medium tracking-[-0.01em] relative z-10 cursor-pointer whitespace-nowrap transition-colors ${
                        activeTab === "preview"
                          ? "text-[#F5F5F7]"
                          : "text-[#8E9299] hover:text-[#F5F5F7]"
                      }`}
                    >
                      {activeTab === "preview" && (
                        <motion.div
                          layoutId={`workspace-tab-pill-${layoutTabId}`}
                          transition={{ type: "spring", stiffness: 520, damping: 38, mass: 0.7 }}
                          className="bg-[#1B1E25] shadow-[inset_0_1px_0_rgba(255,255,255,0.09)] rounded-[8px] absolute inset-0 -z-10"
                        />
                      )}
                      Preview
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("code")}
                      className={`h-7 px-3.5 rounded-[8px] text-[12.5px] font-medium tracking-[-0.01em] relative z-10 cursor-pointer whitespace-nowrap transition-colors ${
                        activeTab === "code"
                          ? "text-[#F5F5F7]"
                          : "text-[#8E9299] hover:text-[#F5F5F7]"
                      }`}
                    >
                      {activeTab === "code" && (
                        <motion.div
                          layoutId={`workspace-tab-pill-${layoutTabId}`}
                          transition={{ type: "spring", stiffness: 520, damping: 38, mass: 0.7 }}
                          className="bg-[#1B1E25] shadow-[inset_0_1px_0_rgba(255,255,255,0.09)] rounded-[8px] absolute inset-0 -z-10"
                        />
                      )}
                      Code
                    </button>
                  </div>

                  {/* Stage Theme Switch (Dark | Light) */}
                  {activeTab === "preview" && (
                    <div className="p-1 rounded-[12px] bg-[#060709] shadow-[inset_0_1px_4px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(255,255,255,0.04)] inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setStageTheme("dark")}
                        className={`h-7 px-2.5 rounded-[8px] text-[12px] font-medium tracking-[-0.01em] cursor-pointer whitespace-nowrap transition-colors ${
                          stageTheme === "dark"
                            ? "bg-[#1B1E25] text-[#F5F5F7] shadow-[inset_0_1px_0_rgba(255,255,255,0.09)]"
                            : "text-[#8E9299] hover:text-[#F5F5F7]"
                        }`}
                      >
                        Dark
                      </button>
                      <button
                        type="button"
                        onClick={() => setStageTheme("light")}
                        className={`h-7 px-2.5 rounded-[8px] text-[12px] font-medium tracking-[-0.01em] cursor-pointer whitespace-nowrap transition-colors ${
                          stageTheme === "light"
                            ? "bg-[#F5F5F7] text-[#08090A] shadow-[0_1px_4px_rgba(0,0,0,0.25)]"
                            : "text-[#8E9299] hover:text-[#F5F5F7]"
                        }`}
                      >
                        Light
                      </button>
                    </div>
                  )}
                </div>

                {/* Stage Utilities */}
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewKey((k) => k + 1)}
                    aria-label="Replay component animation"
                    className="h-8 px-3 rounded-[10px] bg-[#1B1E25] hover:bg-[#232730] text-[12px] text-[#8E9299] hover:text-[#F5F5F7] inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,0.085)]"
                  >
                    <span className="inline-flex items-center">
                      <ArrowCounterClockwise size={13} weight="bold" />
                    </span>
                    <span>Reset</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyCode(item.code, setCopiedCode)}
                    aria-label="Copy source code"
                    className="h-8 px-3 rounded-[10px] bg-[#1B1E25] hover:bg-[#232730] text-[12px] text-[#8E9299] hover:text-[#F5F5F7] inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,0.085)]"
                  >
                    {copiedCode ? (
                      <>
                        <span className="text-[var(--peel-lime)] inline-flex items-center">
                          <Check size={13} weight="bold" />
                        </span>
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <span className="inline-flex items-center">
                          <Copy size={13} />
                        </span>
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Doppelrand Stage Chassis */}
              <div className="rounded-[20px] p-1.5 bg-gradient-to-b from-[#16181E] to-[#101216] shadow-[inset_0_1px_0_rgba(255,255,255,0.085),inset_0_0_0_1px_rgba(255,255,255,0.03),0_14px_28px_-8px_rgba(0,0,0,0.78)]">
                {activeTab === "preview" ? (
                  /* Sunken Stage Well */
                  <div
                    className={cn(
                      "rounded-[14px] px-2.5 py-6 sm:p-10 min-h-[380px] sm:min-h-[480px] flex flex-col items-center justify-center relative overflow-x-hidden transition-colors duration-200",
                      stageTheme === "light"
                        ? "bg-[#F7F7F8] shadow-[inset_0_1px_6px_rgba(0,0,0,0.08),inset_0_0_0_1px_rgba(0,0,0,0.06)]"
                        : "bg-[#060709] shadow-[inset_0_2px_8px_rgba(0,0,0,0.92),inset_0_0_0_1px_rgba(255,255,255,0.035)]"
                    )}
                  >
                    <div
                      className={cn(
                        "pointer-events-none absolute inset-0",
                        stageTheme === "light"
                          ? "bg-[radial-gradient(circle_at_50%_40%,rgba(0,0,0,0.025)_0%,transparent_70%)]"
                          : "bg-[radial-gradient(circle_at_50%_40%,rgba(245,245,247,0.035)_0%,transparent_70%)]"
                      )}
                      aria-hidden="true"
                    />
                    <div className="relative z-10 w-full flex flex-col items-center justify-center">
                      <ItemComponent key={`${previewKey}-${stageTheme}`} replayKey={previewKey} theme={stageTheme} />
                    </div>
                  </div>
                ) : (
                  /* Sunken Code Well */
                  <div className="rounded-[14px] bg-[#060709] shadow-[inset_0_2px_8px_rgba(0,0,0,0.92),inset_0_0_0_1px_rgba(255,255,255,0.035)] overflow-hidden">
                    {/* File Header Bar */}
                    <div className="px-4 py-2.5 border-b border-white/[0.05] flex items-center justify-between font-mono text-[11.5px] text-[#8E9299]">
                      <span className="truncate">
                        {item.filePath || `components/ui/${item.slug}.tsx`}
                      </span>
                      <div className="flex items-center gap-3 shrink-0 ml-3">
                        <span className="text-[#555961]">TSX</span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(item.code, setCopiedCode)}
                          className="text-[#8E9299] hover:text-[#F5F5F7] transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          {copiedCode ? (
                            <span className="text-[var(--peel-lime)] inline-flex items-center">
                              <Check size={12} weight="bold" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center">
                              <Copy size={12} />
                            </span>
                          )}
                          <span>{copiedCode ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Scrollable Code Viewport (Lenis-safe) */}
                    <div
                      data-lenis-prevent
                      className="max-h-[440px] overflow-auto p-4 font-mono text-[12px] leading-[1.65] tabular-nums"
                    >
                      <pre className="m-0 p-0">
                        <code>
                          {codeLines.map((line, index) => (
                            <div key={index} className="flex hover:bg-white/[0.02]">
                              <span className="w-8 pr-4 text-right text-[#3A3D45] select-none shrink-0 font-mono text-[11px]">
                                {index + 1}
                              </span>
                              <span className="whitespace-pre overflow-x-visible">
                                {renderSyntaxLine(line)}
                              </span>
                            </div>
                          ))}
                        </code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ===================================================================
                4. INSTALLATION SECTION (CLI | Manual)
                =================================================================== */}
            <section className="mt-12" aria-labelledby="install-heading">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2
                  id="install-heading"
                  className="text-[14px] sm:text-[15px] font-medium tracking-[-0.015em] leading-[1.3] text-[#F5F5F7]"
                >
                  Installation
                </h2>

                {/* Tactile CLI | Manual toggle */}
                <div className="p-1 rounded-[10px] bg-[#060709] shadow-[inset_0_1px_4px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(255,255,255,0.04)] inline-flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setInstallMode("cli")}
                    className={`h-6 px-2.5 rounded-[7px] text-[11.5px] font-medium tracking-[-0.01em] transition-colors cursor-pointer ${
                      installMode === "cli"
                        ? "bg-[#1B1E25] text-[#F5F5F7] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                        : "text-[#8E9299] hover:text-[#F5F5F7]"
                    }`}
                  >
                    CLI
                  </button>
                  <button
                    type="button"
                    onClick={() => setInstallMode("manual")}
                    className={`h-6 px-2.5 rounded-[7px] text-[11.5px] font-medium tracking-[-0.01em] transition-colors cursor-pointer ${
                      installMode === "manual"
                        ? "bg-[#1B1E25] text-[#F5F5F7] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                        : "text-[#8E9299] hover:text-[#F5F5F7]"
                    }`}
                  >
                    Manual
                  </button>
                </div>
              </div>

              {installMode === "cli" ? (
                /* Doppelrand CLI Housing */
                <div className="rounded-[18px] p-1.5 bg-gradient-to-b from-[#16181E] to-[#101216] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                  <div className="px-3 py-1.5 flex items-center justify-between">
                    <div className="inline-flex items-center gap-1">
                      {(["pnpm", "npm", "yarn", "bun"] as PkgManager[]).map((pm) => (
                        <button
                          key={pm}
                          type="button"
                          onClick={() => handleSetPkgManager(pm)}
                          className={`px-2.5 py-1 rounded-[7px] font-mono text-[11px] transition-colors cursor-pointer ${
                            pkgManager === pm
                              ? "bg-[#1B1E25] text-[#F5F5F7] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] font-medium"
                              : "text-[#8E9299] hover:text-[#F5F5F7]"
                          }`}
                        >
                          {pm}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleCopyCode(cliCommands[pkgManager], setCopiedInstall)
                      }
                      className="h-7 px-2.5 rounded-[7px] bg-[#1B1E25] hover:bg-[#232730] text-[11px] font-mono text-[#F5F5F7] inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.085)]"
                    >
                      {copiedInstall ? (
                        <>
                          <span className="text-[var(--peel-lime)] inline-flex items-center">
                            <Check size={12} weight="bold" />
                          </span>
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <span className="inline-flex items-center">
                            <Copy size={12} />
                          </span>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Sunken Command Slot */}
                  <div className="rounded-[12px] bg-[#060709] px-4 py-3.5 font-mono text-[12.5px] text-[#F5F5F7] overflow-x-auto whitespace-nowrap shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)]">
                    {cliCommands[pkgManager]}
                  </div>
                </div>
              ) : (
                /* Manual 3-Step Flow */
                <div className="border-l border-white/[0.06] ml-3 pl-6 space-y-7">
                  {/* Step 1 */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-[11px] font-medium text-[#8E9299]">
                        Step 1
                      </span>
                      <span className="text-[13.5px] font-medium text-[#F5F5F7]">
                        Install dependencies
                      </span>
                    </div>
                    <div className="rounded-[12px] p-1.5 bg-[#060709] shadow-[inset_0_2px_6px_rgba(0,0,0,0.92),inset_0_0_0_1px_rgba(255,255,255,0.035)] flex items-center justify-between gap-3 font-mono text-[12px] text-[#F5F5F7]">
                      <span className="px-2.5 py-1 truncate">{manualInstallCmd}</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyCode(manualInstallCmd, setCopiedManualDep)
                        }
                        className="h-7 px-2.5 rounded-[7px] bg-[#1B1E25] hover:bg-[#232730] text-[11px] font-mono text-[#F5F5F7] inline-flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
                      >
                        {copiedManualDep ? (
                          <span className="text-[var(--peel-lime)] inline-flex items-center">
                            <Check size={12} weight="bold" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center">
                            <Copy size={12} />
                          </span>
                        )}
                        <span>{copiedManualDep ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-medium text-[#8E9299]">
                          Step 2
                        </span>
                        <span className="text-[13.5px] font-medium text-[#F5F5F7]">
                          Copy component source
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-[#555961]">
                        components/ui/{item.slug}.tsx
                      </span>
                    </div>

                    <div className="rounded-[12px] bg-[#060709] shadow-[inset_0_2px_8px_rgba(0,0,0,0.92),inset_0_0_0_1px_rgba(255,255,255,0.035)] overflow-hidden">
                      <div className="px-3.5 py-2 border-b border-white/[0.04] flex items-center justify-between font-mono text-[11px] text-[#8E9299]">
                        <span>{item.filePath || `components/ui/${item.slug}.tsx`}</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyCode(item.code, setCopiedManualSource)
                          }
                          className="h-6 px-2 rounded-[6px] bg-[#1B1E25] hover:bg-[#232730] text-[#F5F5F7] inline-flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {copiedManualSource ? (
                            <span className="text-[var(--peel-lime)] inline-flex items-center">
                              <Check size={11} weight="bold" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center">
                              <Copy size={11} />
                            </span>
                          )}
                          <span>{copiedManualSource ? "Copied" : "Copy source"}</span>
                        </button>
                      </div>

                      <div
                        data-lenis-prevent
                        className="max-h-[260px] overflow-auto p-3 font-mono text-[11.5px] leading-[1.6]"
                      >
                        <pre className="m-0 p-0 text-[#8E9299]">
                          <code>
                            {codeLines.slice(0, 30).map((line, idx) => (
                              <div key={idx} className="truncate">
                                {line}
                              </div>
                            ))}
                            {codeLines.length > 30 && (
                              <div className="text-[#555961] mt-1 tabular-nums">
                                ... +{codeLines.length - 30} more lines
                              </div>
                            )}
                          </code>
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] font-medium text-[#8E9299]">
                        Step 3
                      </span>
                      <span className="text-[13.5px] font-medium text-[#F5F5F7]">
                        Update import paths
                      </span>
                    </div>
                    <p className="text-[13px] text-[#8E9299]">
                      Adjust alias paths (such as <code className="font-mono text-[11.5px] text-[#F5F5F7]">@/lib/utils</code>) to match your tsconfig path mappings.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* ===================================================================
                5. PROPS SPECIFICATION LEDGER
                =================================================================== */}
            <section className="mt-12" aria-labelledby="props-heading">
              <h2
                id="props-heading"
                className="text-[14px] sm:text-[15px] font-medium tracking-[-0.015em] leading-[1.3] text-[#F5F5F7] mb-4"
              >
                Props &amp; Architecture
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full border-y border-white/[0.06] text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="py-2.5 pr-4 font-sans text-[12px] font-medium tracking-[-0.01em] text-[#8E9299] border-b border-white/[0.06]">
                        Prop
                      </th>
                      <th className="py-2.5 pr-4 font-sans text-[12px] font-medium tracking-[-0.01em] text-[#8E9299] border-b border-white/[0.06]">
                        Type
                      </th>
                      <th className="py-2.5 pr-4 font-sans text-[12px] font-medium tracking-[-0.01em] text-[#8E9299] border-b border-white/[0.06]">
                        Default
                      </th>
                      <th className="py-2.5 font-sans text-[12px] font-medium tracking-[-0.01em] text-[#8E9299] border-b border-white/[0.06]">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] text-[13px]">
                    {item.props && item.props.length > 0 ? (
                      item.props.map((p) => (
                        <tr key={p.name} className="hover:bg-white/[0.01]">
                          <td className="py-3 pr-4 font-mono text-[12px] text-[#F5F5F7] whitespace-nowrap">
                            {p.name}
                            {p.required && (
                              <span className="text-[var(--signal-lime)] ml-1">*</span>
                            )}
                          </td>
                          <td className="py-3 pr-4 font-mono text-[11.5px] text-[#8E9299] whitespace-nowrap">
                            {p.type}
                          </td>
                          <td className="py-3 pr-4 font-mono text-[11.5px] tabular-nums text-[#555961] whitespace-nowrap">
                            {p.defaultValue || "—"}
                          </td>
                          <td className="py-3 text-[13px] text-[#8E9299]">
                            {p.description}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="hover:bg-white/[0.01]">
                        <td className="py-3 pr-4 font-mono text-[12px] text-[#F5F5F7] whitespace-nowrap">
                          className
                        </td>
                        <td className="py-3 pr-4 font-mono text-[11.5px] text-[#8E9299] whitespace-nowrap">
                          string
                        </td>
                        <td className="py-3 pr-4 font-mono text-[11.5px] tabular-nums text-[#555961] whitespace-nowrap">
                          undefined
                        </td>
                        <td className="py-3 text-[13px] text-[#8E9299]">
                          Optional Tailwind class overrides for the outer chassis.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ===================================================================
                6. SEQUENTIAL PREV / NEXT NAVIGATION
                =================================================================== */}
            <div className="mt-14 pt-8 border-t border-white/[0.06] flex items-center justify-between gap-4">
              {prevItem ? (
                <Link
                  to={`/components/${prevItem.slug}`}
                  className="group flex flex-col gap-1 focus:outline-none"
                >
                  <span className="font-sans text-[12px] font-medium tracking-[-0.01em] text-[#8E9299]">
                    Previous
                  </span>
                  <span className="text-[14px] font-medium text-[#8E9299] group-hover:text-[#F5F5F7] transition-colors inline-flex items-center gap-1.5">
                    <span className="inline-flex items-center">
                      <ArrowLeft size={13} weight="bold" />
                    </span>
                    <span>{prevItem.title}</span>
                  </span>
                </Link>
              ) : (
                <div />
              )}

              {nextItem ? (
                <Link
                  to={`/components/${nextItem.slug}`}
                  className="group flex flex-col gap-1 items-end text-right focus:outline-none"
                >
                  <span className="font-sans text-[12px] font-medium tracking-[-0.01em] text-[#8E9299]">
                    Next
                  </span>
                  <span className="text-[14px] font-medium text-[#8E9299] group-hover:text-[#F5F5F7] transition-colors inline-flex items-center gap-1.5">
                    <span>{nextItem.title}</span>
                    <span className="inline-flex items-center">
                      <ArrowRight size={13} weight="bold" />
                    </span>
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Quiet Architectural Footer */}
      <Footer />
    </div>
  );
}
