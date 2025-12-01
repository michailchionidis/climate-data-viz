import { test, expect } from '@playwright/test';

/**
 * Mobile E2E Test Suite
 * Tests responsive behavior on mobile viewport (Pixel 5: 393x851)
 */
test.describe('Mobile Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app with tour disabled
    await page.goto('/?tour=false');
    // Wait for the app to be fully loaded
    await page.waitForSelector('h1:has-text("Climate Data Explorer")');
  });

  test('should display mobile-optimized layout', async ({ page }) => {
    // Header should be visible
    await expect(page.locator('h1').filter({ hasText: 'Climate Data Explorer' })).toBeVisible();

    // Mobile layout should show station selector
    await expect(page.locator('#station-selector-mobile')).toBeVisible();

    // Desktop sidebar should NOT be visible
    await expect(page.locator('#station-selector-desktop')).not.toBeVisible();

    // Footer should be hidden on mobile (as per design)
    await expect(page.getByText('Mike Chionidis').first()).not.toBeVisible();
  });

  test('should allow station selection on mobile', async ({ page }) => {
    // Station selector should be visible
    await expect(page.locator('#station-selector-mobile')).toBeVisible();

    // Click on a station
    await page.locator('#station-selector-mobile').getByText('Station 101234').click();

    // Verify selection
    await expect(page.locator('#station-selector-mobile').getByText('1/10')).toBeVisible();
  });

  test('should display chart on mobile after selecting station', async ({ page }) => {
    // Select a station
    await page.locator('#station-selector-mobile').getByText('Station 101234').click();

    // Wait for chart to load in mobile chart section
    const chartSection = page.locator('#chart-section');
    await chartSection.locator('.js-plotly-plot').waitFor({ state: 'visible', timeout: 15000 });

    // Chart should be visible
    await expect(chartSection.locator('.js-plotly-plot')).toBeVisible();
  });

  test('should toggle visualization mode on mobile', async ({ page }) => {
    // Select a station
    await page.locator('#station-selector-mobile').getByText('Station 101234').click();
    const chartSection = page.locator('#chart-section');
    await chartSection.locator('.js-plotly-plot').waitFor({ state: 'visible', timeout: 15000 });

    // First, expand the "Visualization Options" collapsible section
    const vizOptionsHeader = page.getByText('Visualization Options');
    await vizOptionsHeader.scrollIntoViewIfNeeded();
    await vizOptionsHeader.click();
    await page.waitForTimeout(300);

    // Now find and click the Monthly radio button
    const monthlyRadio = page.getByRole('radio', { name: /Monthly/ });
    await monthlyRadio.scrollIntoViewIfNeeded();
    await monthlyRadio.click();

    // Verify it's selected
    await expect(monthlyRadio).toBeChecked();
  });

  test('should show analytics data on mobile', async ({ page }) => {
    // Select all stations
    await page.locator('#station-selector-mobile').getByText('All').click();

    // Wait for data to load
    const chartSection = page.locator('#chart-section');
    await chartSection.locator('.js-plotly-plot').waitFor({ state: 'visible', timeout: 20000 });

    // Should show temperature values (°C)
    await expect(page.getByText(/\d+\.?\d*°C/).first()).toBeVisible();
  });

  test('should allow scrolling through content', async ({ page }) => {
    // Select stations to generate content
    await page.locator('#station-selector-mobile').getByText('All').click();
    const chartSection = page.locator('#chart-section');
    await chartSection.locator('.js-plotly-plot').waitFor({ state: 'visible', timeout: 20000 });

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));

    // Wait a moment for scroll
    await page.waitForTimeout(300);

    // Chart should still be accessible (either visible or can scroll to it)
    const chart = chartSection.locator('.js-plotly-plot');
    await chart.scrollIntoViewIfNeeded();
    await expect(chart).toBeVisible();
  });

  test('should handle touch-friendly controls', async ({ page }) => {
    // Select a station
    await page.locator('#station-selector-mobile').getByText('Station 101234').click();
    const chartSection = page.locator('#chart-section');
    await chartSection.locator('.js-plotly-plot').waitFor({ state: 'visible', timeout: 15000 });

    // First, expand the "Visualization Options" collapsible section
    const vizOptionsHeader = page.getByText('Visualization Options');
    await vizOptionsHeader.scrollIntoViewIfNeeded();
    await vizOptionsHeader.click();
    await page.waitForTimeout(300);

    // Year presets should be accessible - use 20th C
    const presetButton = page.getByRole('button', { name: '20th C' });
    await presetButton.scrollIntoViewIfNeeded();
    await presetButton.click();

    // Verify it worked
    const yearFromInput = page.getByRole('spinbutton', { name: /Year range start/i });
    await expect(yearFromInput).toHaveValue('1900');
  });

  test('should not show Grok chat sidebar on mobile', async ({ page }) => {
    // Select stations
    await page.locator('#station-selector-mobile').getByText('All').click();
    const chartSection = page.locator('#chart-section');
    await chartSection.locator('.js-plotly-plot').waitFor({ state: 'visible', timeout: 20000 });

    // The chat sidebar should not be visible (desktop only)
    const chatSidebar = page.locator('[aria-label="Grok chat sidebar"]');

    // Chat sidebar should not be visible on mobile
    await expect(chatSidebar).not.toBeVisible();
  });
});
