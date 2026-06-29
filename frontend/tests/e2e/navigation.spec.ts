import { expect, test } from "@playwright/test";

const pages = [
  ["/workspace", "Workspace Dashboard"],
  ["/upload", "Upload Center"],
  ["/knowledge", "Knowledge Base"],
  ["/analysis", "Analysis Dashboard"],
  ["/recommendations", "Recommendations Dashboard"],
  ["/review", "Human Review Dashboard"],
  ["/audit", "Audit Timeline"],
  ["/settings", "Settings"],
  ["/admin", "Admin Console"]
] as const;

test("landing page renders", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "DECISIONMESH AI" })).toBeVisible();
});

test("core pages render", async ({ page }) => {
  for (const [path, heading] of pages) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }
});
