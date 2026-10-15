import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SkillPile, type SkillItem } from "@/components/ui/skill-pile";

const TEST_SKILLS: SkillItem[] = [
  { label: "Brand identity", tone: "accent" },
  { label: "Web design", tone: "ink" },
  { label: "Motion", tone: "outline" },
  { label: "React" },
];

describe("SkillPile Component", () => {
  it("renders skills in an accessible hidden list", () => {
    render(<SkillPile skills={TEST_SKILLS} />);

    const list = screen.getByRole("list", { name: "Skills" });
    expect(list).toBeInTheDocument();
    expect(list).toHaveClass("sr-only");

    expect(screen.getByText("Brand identity", { selector: "li" })).toBeInTheDocument();
    expect(screen.getByText("Web design", { selector: "li" })).toBeInTheDocument();
    expect(screen.getByText("Motion", { selector: "li" })).toBeInTheDocument();
    expect(screen.getByText("React", { selector: "li" })).toBeInTheDocument();
  });

  it("renders pills inside an aria-hidden tray", () => {
    const { container } = render(<SkillPile skills={TEST_SKILLS} />);

    const tray = container.querySelector('div[aria-hidden="true"]');
    expect(tray).toBeInTheDocument();
    expect(tray).toHaveClass("border", "border-foreground");

    const pills = tray?.querySelectorAll("span");
    expect(pills?.length).toBe(4);
    expect(pills?.[0]).toHaveTextContent("Brand identity");
    expect(pills?.[0]).toHaveClass("bg-primary", "text-primary-foreground");
    expect(pills?.[1]).toHaveTextContent("Web design");
    expect(pills?.[1]).toHaveClass("bg-foreground", "text-background");
    expect(pills?.[2]).toHaveTextContent("Motion");
    expect(pills?.[2]).toHaveClass("bg-background", "text-foreground");
    expect(pills?.[3]).toHaveTextContent("React");
  });

  it("renders hint and reset button with proper styles", () => {
    render(
      <SkillPile
        skills={TEST_SKILLS}
        hint="Grab one. Throw it."
        resetLabel="Drop again"
      />
    );

    expect(screen.getByText("Grab one. Throw it.")).toBeInTheDocument();
    const btn = screen.getByRole("button", { name: "Drop again" });
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();
  });

  it("hides reset button when resetLabel is empty", () => {
    render(<SkillPile skills={TEST_SKILLS} resetLabel="" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("applies custom height", () => {
    const { container } = render(
      <SkillPile skills={TEST_SKILLS} height={450} />
    );

    const tray = container.querySelector('div[aria-hidden="true"]');
    expect(tray).toHaveStyle({ minHeight: "450px" });
  });
});
