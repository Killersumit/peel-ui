import { test, expect } from "@playwright/test";
import { ALL_COMPONENTS } from "../src/config/components-data";

const routes = [
  "/",
  "/components",
  "/privacy",
  ...ALL_COMPONENTS.map((c) => `/components/${c.slug}`),
];

test.describe("Production smoke test suite", () => {
  for (const route of routes) {
    test(`route ${route} loads with HTTP 200, no errors, no horizontal scroll at 390px`, async ({
      page,
    }) => {
      const pageErrors: Error[] = [];
      const consoleErrors: string[] = [];

      page.on("pageerror", (err) => {
        pageErrors.push(err);
      });

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });

      await page.setViewportSize({ width: 390, height: 844 });
      const response = await page.goto(route);

      expect(response?.status()).toBe(200);
      expect(pageErrors).toEqual([]);
      expect(consoleErrors).toEqual([]);

      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(hasHorizontalScroll).toBe(false);
    });
  }

  test("/components/note-button opens panel and Escape closes it with reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/components/note-button");

    const trigger = page.locator('button[aria-label="Open personal note"]');
    await trigger.waitFor({ state: "visible" });
    await trigger.click();

    const panel = page.getByRole("dialog");
    await expect(panel).toBeVisible();

    const textarea = panel.locator("textarea");
    await expect(textarea).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(panel).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });
});
