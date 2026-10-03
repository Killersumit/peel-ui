import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MoireIntro } from "@/components/ui/moire-intro";
import { setReducedMotion } from "./setup";

function createMock2DContext() {
  return {
    save: vi.fn(),
    restore: vi.fn(),
    scale: vi.fn(),
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
  };
}

describe("MoireIntro", () => {
  let originalGetContext: typeof HTMLCanvasElement.prototype.getContext;

  beforeEach(() => {
    originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = vi.fn(
      () => createMock2DContext() as unknown as RenderingContext
    ) as unknown as typeof HTMLCanvasElement.prototype.getContext;
    setReducedMotion(false);
  });

  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = originalGetContext;
    vi.restoreAllMocks();
    setReducedMotion(false);
    document.body.style.overflow = "";
  });

  it("renders nothing when open is false", () => {
    const { container } = render(<MoireIntro open={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders with progressbar accessibility role and label", () => {
    render(<MoireIntro open={true} label="Northfield" />);

    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute("aria-label", "Loading");
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "100");
    expect(screen.getByText("Northfield")).toBeInTheDocument();
  });

  it("locks body overflow when fixed and restores it on unmount", () => {
    expect(document.body.style.overflow).toBe("");

    const { unmount } = render(
      <MoireIntro open={true} position="fixed" lockScroll={true} />
    );

    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("does not lock scroll when lockScroll is false", () => {
    render(
      <MoireIntro open={true} position="fixed" lockScroll={false} />
    );
    expect(document.body.style.overflow).not.toBe("hidden");
  });


  it("calls onComplete once when animation finishes", async () => {
    let errorCaught: unknown = null;
    window.addEventListener("error", (e) => {
      errorCaught = e.error;
    });

    const handleComplete = vi.fn();

    render(
      <MoireIntro
        open={true}
        duration={0.05}
        onComplete={handleComplete}
      />
    );

    try {
      await waitFor(
        () => {
          expect(handleComplete).toHaveBeenCalledTimes(1);
        },
        { timeout: 3000 }
      );
    } catch (err) {
      if (errorCaught) {
        throw new Error(`Window error: ${String(errorCaught)}`);
      }
      throw err;
    }
  });

  it("runs reduced motion path and restores body overflow", async () => {
    setReducedMotion(true);
    const handleComplete = vi.fn();

    render(
      <MoireIntro
        open={true}
        duration={0.05}
        position="fixed"
        lockScroll={true}
        onComplete={handleComplete}
      />
    );

    expect(document.body.style.overflow).toBe("hidden");

    await waitFor(
      () => {
        expect(handleComplete).toHaveBeenCalledTimes(1);
        expect(document.body.style.overflow).toBe("");
      },
      { timeout: 3000 }
    );
  });

  it("restarts animation when open toggles from false to true", () => {
    const { rerender } = render(<MoireIntro open={false} />);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

    rerender(<MoireIntro open={true} label="Reset Test" />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByText("Reset Test")).toBeInTheDocument();
  });
});
