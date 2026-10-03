import * as React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MoireField } from "@/components/ui/moire-field";
import { setReducedMotion } from "./setup";

function createMockWebGLContext() {
  const gl = {
    VERTEX_SHADER: 35633,
    FRAGMENT_SHADER: 35632,
    COMPILE_STATUS: 35713,
    LINK_STATUS: 35714,
    ARRAY_BUFFER: 34962,
    STATIC_DRAW: 35044,
    TRIANGLES: 4,
    FLOAT: 5126,
    createShader: vi.fn(() => ({})),
    shaderSource: vi.fn(),
    compileShader: vi.fn(),
    getShaderParameter: vi.fn(() => true),
    deleteShader: vi.fn(),
    createProgram: vi.fn(() => ({})),
    attachShader: vi.fn(),
    linkProgram: vi.fn(),
    getProgramParameter: vi.fn(() => true),
    deleteProgram: vi.fn(),
    useProgram: vi.fn(),
    createBuffer: vi.fn(() => ({})),
    bindBuffer: vi.fn(),
    bufferData: vi.fn(),
    getAttribLocation: vi.fn(() => 0),
    enableVertexAttribArray: vi.fn(),
    vertexAttribPointer: vi.fn(),
    getUniformLocation: vi.fn(() => ({})),
    uniform2f: vi.fn(),
    uniform1i: vi.fn(),
    uniform1f: vi.fn(),
    uniform3f: vi.fn(),
    drawArrays: vi.fn(),
    viewport: vi.fn(),
  };
  return gl;
}

describe("MoireField", () => {
  let originalGetContext: typeof HTMLCanvasElement.prototype.getContext;

  beforeEach(() => {
    originalGetContext = HTMLCanvasElement.prototype.getContext;
    setReducedMotion(false);
  });

  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = originalGetContext;
    vi.restoreAllMocks();
    setReducedMotion(false);
  });

  it("renders the CSS fallback when WebGL is unavailable", () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => null);

    render(
      <MoireField data-testid="moire-root">
        <p>Hero Content</p>
      </MoireField>
    );

    const fallback = screen.getByTestId("moire-fallback");
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Hero Content")).toBeInTheDocument();
  });

  it("renders canvas with aria-hidden='true' when WebGL is available", () => {
    const mockGl = createMockWebGLContext();
    HTMLCanvasElement.prototype.getContext = vi.fn(
      () => mockGl as unknown as RenderingContext
    ) as unknown as typeof HTMLCanvasElement.prototype.getContext;

    const { container } = render(
      <MoireField>
        <span>Content</span>
      </MoireField>
    );

    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute("aria-hidden", "true");
  });

  it("ensures children remain interactive and clickable", () => {
    const handleClick = vi.fn();

    render(
      <MoireField>
        <button type="button" onClick={handleClick}>
          Action Button
        </button>
      </MoireField>
    );

    const button = screen.getByRole("button", { name: "Action Button" });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("under reduced motion draws once and starts no animation loop", () => {
    setReducedMotion(true);
    const mockGl = createMockWebGLContext();
    HTMLCanvasElement.prototype.getContext = vi.fn(
      () => mockGl as unknown as RenderingContext
    ) as unknown as typeof HTMLCanvasElement.prototype.getContext;

    const rafSpy = vi.spyOn(window, "requestAnimationFrame");

    render(<MoireField />);

    expect(mockGl.drawArrays).toHaveBeenCalledTimes(1);
    expect(rafSpy).not.toHaveBeenCalled();
  });

  it("handles reduced motion toggle dynamically", () => {
    const mockGl = createMockWebGLContext();
    HTMLCanvasElement.prototype.getContext = vi.fn(
      () => mockGl as unknown as RenderingContext
    ) as unknown as typeof HTMLCanvasElement.prototype.getContext;

    const rafSpy = vi.spyOn(window, "requestAnimationFrame");

    render(<MoireField />);

    expect(rafSpy).toHaveBeenCalled();
    const callsBefore = rafSpy.mock.calls.length;

    act(() => {
      setReducedMotion(true);
    });

    const callsAfter = rafSpy.mock.calls.length;
    expect(callsAfter).toBe(callsBefore);
  });
});
