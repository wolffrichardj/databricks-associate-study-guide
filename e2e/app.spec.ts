import { expect, test } from "@playwright/test";

test("persists weekly checklist on reload", async ({ page }) => {
  await page.goto("/");

  const firstCheckbox = page.locator('input[type="checkbox"]').first();
  await firstCheckbox.check();
  await expect(page.getByTestId("weekly-progress")).toContainText(
    "Completed 1 of 8 tasks",
  );

  await page.reload();
  await expect(firstCheckbox).toBeChecked();
});

test("runs focused topic quiz flow", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Quiz" }).click();
  await page.getByTestId("topic-select").selectOption("auto-loader");
  await page.getByTestId("question-count").fill("5");
  await page.getByTestId("start-quiz").click();

  while (
    (await page.getByRole("button", { name: "Finish Quiz" }).count()) === 0
  ) {
    await page.locator('.choice-item input[type="radio"]').first().check();
    await page.getByRole("button", { name: "Next Question" }).click();
  }

  await page.locator('.choice-item input[type="radio"]').first().check();
  await page.getByRole("button", { name: "Finish Quiz" }).click();
  await expect(page.getByTestId("results-panel")).toBeVisible();
});

test("runs overall skills mode and can reset program", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Quiz" }).click();
  await page.getByTestId("mode-overall").check();
  await page.getByTestId("question-count").fill("5");
  await page.getByTestId("start-quiz").click();

  while (
    (await page.getByRole("button", { name: "Finish Quiz" }).count()) === 0
  ) {
    await page.locator('.choice-item input[type="radio"]').first().check();
    await page.getByRole("button", { name: "Next Question" }).click();
  }

  await page.locator('.choice-item input[type="radio"]').first().check();
  await page.getByRole("button", { name: "Finish Quiz" }).click();
  await expect(page.getByTestId("results-panel")).toBeVisible();

  await page.getByTestId("reset-program").click();
  await expect(page.getByTestId("weekly-progress")).toContainText(
    "Completed 0 of 8 tasks",
  );
});
