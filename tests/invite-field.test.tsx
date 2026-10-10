import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { InviteField } from "@/components/ui/invite-field";

describe("InviteField Component", () => {
  it("renders with default emails and flags invalid ones", () => {
    render(
      <InviteField
        defaultValue={["maya@acme.co", "jo@acme"]}
      />
    );

    expect(screen.getByText("Invite teammates")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit maya@acme.co" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit jo@acme" })).toBeInTheDocument();
    expect(screen.getByText(/1 needs fixing/)).toBeInTheDocument();

    const sendBtn = screen.getByRole("button", { name: /Send/ });
    expect(sendBtn).toBeDisabled();
  });

  it("adds emails on Enter, comma, space, and semicolon", () => {
    const onChange = vi.fn();
    render(<InviteField onChange={onChange} />);

    const input = screen.getByRole("textbox");

    // Enter
    fireEvent.change(input, { target: { value: "test@domain.com" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByRole("button", { name: "Edit test@domain.com" })).toBeInTheDocument();

    // Comma
    fireEvent.change(input, { target: { value: "alex@domain.io," } });
    expect(screen.getByRole("button", { name: "Edit alex@domain.io" })).toBeInTheDocument();

    expect(onChange).toHaveBeenCalled();
  });

  it("splits pasted text with multiple separators", () => {
    const onChange = vi.fn();
    render(<InviteField onChange={onChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.paste(input, {
      clipboardData: {
        getData: () => "alice@foo.com, bob@bar.com; charlie@baz.io",
      },
    });

    expect(screen.getByRole("button", { name: "Edit alice@foo.com" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit bob@bar.com" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit charlie@baz.io" })).toBeInTheDocument();
    expect(screen.getByText("3 people")).toBeInTheDocument();
  });

  it("removes a chip via remove button", () => {
    const onChange = vi.fn();
    render(
      <InviteField
        defaultValue={["maya@acme.co", "sam@northwind.com"]}
        onChange={onChange}
      />
    );

    const removeBtn = screen.getByRole("button", { name: "Remove maya@acme.co" });
    fireEvent.click(removeBtn);

    expect(screen.queryByRole("button", { name: "Edit maya@acme.co" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit sam@northwind.com" })).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith(["sam@northwind.com"]);
  });

  it("pulls chip back to input when clicking chip body or Backspace on empty input", () => {
    const onChange = vi.fn();
    render(
      <InviteField
        defaultValue={["maya@acme.co", "dev@startup.io"]}
        onChange={onChange}
      />
    );

    const input = screen.getByRole("textbox") as HTMLInputElement;

    // Backspace on empty input pulls last chip
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(input.value).toBe("dev@startup.io");
    expect(screen.queryByRole("button", { name: "Edit dev@startup.io" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit maya@acme.co" })).toBeInTheDocument();

    // Clicking chip body pulls that chip
    const mayaChip = screen.getByRole("button", { name: "Edit maya@acme.co" });
    fireEvent.click(mayaChip);
    expect(input.value).toBe("maya@acme.co");
    expect(screen.queryByRole("button", { name: "Edit maya@acme.co" })).not.toBeInTheDocument();
  });

  it("handles onSend and transitions to sent state, reset with invite more", async () => {
    const onSend = vi.fn().mockResolvedValue(undefined);
    render(
      <InviteField
        defaultValue={["maya@acme.co", "sam@northwind.com"]}
        onSend={onSend}
      />
    );

    const sendBtn = screen.getByRole("button", { name: "Send 2 invites" });
    expect(sendBtn).not.toBeDisabled();

    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByText("Invites sent")).toBeInTheDocument();
    });

    expect(onSend).toHaveBeenCalledWith(["maya@acme.co", "sam@northwind.com"]);
    expect(screen.getByText("2 invites sent just now")).toBeInTheDocument();
    expect(screen.getAllByText("Invited")).toHaveLength(2);

    // Click Invite more
    const inviteMoreBtn = screen.getByRole("button", { name: "Invite more" });
    fireEvent.click(inviteMoreBtn);

    expect(screen.getByText("Invite teammates")).toBeInTheDocument();
    expect(screen.getByText("Add at least one email.")).toBeInTheDocument();
  });
});
