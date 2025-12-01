import { test, expect } from '@playwright/test';

/**
 * Desktop E2E Test Suite
 * Tests the complete user journey on desktop viewport (1920x1080)
 */
test.describe('Desktop User Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app with tour disabled
    await page.goto('/?tour=false');
    // Wait for the app to be fully loaded
    await page.waitForSelector('h1:has-text("Climate Data Explorer")');
  });

  test('should display the main dashboard layout', async ({ page }) => {
    // Header should be visible
    await expect(page.locator('h1').filter({ hasText: 'Climate Data Explorer' })).toBeVisible();

    // Sidebar should be visible with station selector
    await expect(page.locator('#station-selector-desktop')).toBeVisible();

    // Footer should be visible
    await expect(page.getByText('Mike Chionidis').first()).toBeVisible();
  });

  test('should select stations and display chart', async ({ page }) => {
    // Click on first station in the sidebar
    await page.locator('#station-selector-desktop').getByText('Station 101234').click();

    // Verify station is selected (check for 1/10)
    await expect(page.locator('#station-selector-desktop').getByText('1/10')).toBeVisible();

    // Wait for chart to load in the desktop chart section
    const chartSection = page.locator('#chart-section-desktop');
    await chartSection.locator('.js-plotly-plot').waitFor({ state: 'visible', timeout: 15000 });

    // Chart should be visible
    await expect(chartSection.locator('.js-plotly-plot')).toBeVisible();
  });

  test('should toggle between Monthly and Annual modes', async ({ page }) => {
    // Select a station first
    await page.locator('#station-selector-desktop').getByText('Station 101234').click();
    const chartSection = page.locator('#chart-section-desktop');
    await chartSection.locator('.js-plotly-plot').waitFor({ state: 'visible', timeout: 15000 });

    // Default should be Annual Avg mode
    await expect(page.getByRole('radio', { name: /Annual/ })).toBeChecked();

    // Switch to Monthly mode
    await page.getByRole('radio', { name: /Monthly/ }).click();

    // Verify Monthly is now selected
    await expect(page.getByRole('radio', { name: /Monthly/ })).toBeChecked();
  });

  test('should toggle ±1σ overlay', async ({ page }) => {
    // Select a station first
    await page.locator('#station-selector-desktop').getByText('Station 101234').click();
    const chartSection = page.locator('#chart-section-desktop');
    await chartSection.locator('.js-plotly-plot').waitFor({ state: 'visible', timeout: 15000 });

    // Find and click the sigma toggle
    const switchToggle = page.getByRole('switch', { name: /standard deviation overlay/i });
    await switchToggle.click();

    // Toggle should be checked
    await expect(switchToggle).toBeChecked();
  });

  test('should use year range presets', async ({ page }) => {
    // Select a station first
    await page.locator('#station-selector-desktop').getByText('Station 101234').click();
    const chartSection = page.locator('#chart-section-desktop');
    await chartSection.locator('.js-plotly-plot').waitFor({ state: 'visible', timeout: 15000 });

    // Click "20th C" preset (1900-1999)
    await page.getByRole('button', { name: '20th C' }).click();

    // Year inputs should update to 1900
    const yearFromInput = page.getByRole('spinbutton', { name: /Year range start/i });
    await expect(yearFromInput).toHaveValue('1900');
  });

  test('should toggle theme between dark and light', async ({ page }) => {
    // Find theme toggle switch
    const themeToggle = page.getByRole('switch', { name: /light mode|dark mode/i });

    // Toggle theme
    await themeToggle.click();

    // Wait for theme transition
    await page.waitForTimeout(300);

    // Toggle back
    await themeToggle.click();
  });

  test('should collapse and expand sidebar', async ({ page }) => {
    // Sidebar content container should be visible initially with opacity 1
    const sidebarContent = page.locator('#sidebar-content');
    await expect(sidebarContent).toHaveCSS('opacity', '1');

    // Click collapse button inside the sidebar
    await page.getByRole('button', { name: /Collapse sidebar/i }).click();

    // Wait for animation to complete
    await page.waitForTimeout(400);

    // After collapse, the sidebar content should have opacity 0
    await expect(sidebarContent).toHaveCSS('opacity', '0');

    // Click Filters button in header to expand
    await page.getByRole('button', { name: 'Filters' }).click();

    // Wait for animation
    await page.waitForTimeout(400);

    // Sidebar should be visible again with opacity 1
    await expect(sidebarContent).toHaveCSS('opacity', '1');
  });

  test('keyboard shortcut M should toggle mode', async ({ page }) => {
    // Select a station first
    await page.locator('#station-selector-desktop').getByText('Station 101234').click();
    const chartSection = page.locator('#chart-section-desktop');
    await chartSection.locator('.js-plotly-plot').waitFor({ state: 'visible', timeout: 15000 });

    // Press M to toggle mode
    await page.keyboard.press('m');
    await expect(page.getByRole('radio', { name: /Monthly/ })).toBeChecked();

    // Press M again to toggle back
    await page.keyboard.press('m');
    await expect(page.getByRole('radio', { name: /Annual/ })).toBeChecked();
  });
});
