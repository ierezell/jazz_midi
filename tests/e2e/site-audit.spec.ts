import { test, expect, type ConsoleMessage, type Page, type Response } from '@playwright/test';

interface AuditResult {
  route: string;
  consoleErrors: string[];
  consoleWarnings: string[];
  networkErrors: string[];
  pageErrors: string[];
  brokenLinks: string[];
  visibleIssues: string[];
}

const ROUTES = [
  '/',
  '/journey',
  '/about',
  '/login',
  '/training',
  '/exercises',
  '/exercises/two_five_ones',
  '/exercises/scales',
  '/exercises/chords',
  '/exercises/intervals',
  '/exercises/songs',
  '/exercises/licks',
  '/exercises/names',
  '/exercises/partition',
  '/exercises/rhythm',
  '/exercises/flashcards',
  '/exercises/dexterity',
  '/exercises/boogie',
  '/exercises/enclosure',
  '/exercises/ghost-notes',
  '/exercises/hand-dynamics',
  '/exercises/hand_independence',
  '/exercises/interval-mimicry',
  '/exercises/song-chords',
  '/exercises/song-melody',
  '/exercises/song-rhythm',
  '/profile'
];

async function auditPage(page: Page, route: string): Promise<AuditResult> {
  const result: AuditResult = {
    route,
    consoleErrors: [],
    consoleWarnings: [],
    networkErrors: [],
    pageErrors: [],
    brokenLinks: [],
    visibleIssues: []
  };

  // Capture console messages
  page.on('console', (msg: ConsoleMessage) => {
    const text = msg.text();
    if (msg.type() === 'error') {
      result.consoleErrors.push(text);
    } else if (msg.type() === 'warning') {
      result.consoleWarnings.push(text);
    }
  });

  // Capture page errors
  page.on('pageerror', (error: Error) => {
    result.pageErrors.push(error.message);
  });

  // Capture network errors
  page.on('response', (response: Response) => {
    const status = response.status();
    if (status >= 400) {
      result.networkErrors.push(`${response.url()} - ${status}`);
    }
  });

  // Navigate to the page
  await page.goto(route, { waitUntil: 'networkidle' });

  // Check for broken images
  const images = await page.locator('img').all();
  for (const img of images) {
    const isVisible = await img.isVisible().catch(() => false);
    const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
    if (isVisible && naturalWidth === 0) {
      const src = await img.getAttribute('src');
      result.brokenLinks.push(`Broken image: ${src}`);
    }
  }

  // Check for empty content areas
  const emptyHeadings = await page.locator('h1, h2, h3').filter({ hasText: /^\s*$/ }).count();
  if (emptyHeadings > 0) {
    result.visibleIssues.push(`${emptyHeadings} empty headings found`);
  }

  // Check for buttons without text
  const emptyButtons = await page.locator('button').filter({ hasText: /^\s*$/ }).count();
  if (emptyButtons > 0) {
    result.visibleIssues.push(`${emptyButtons} buttons without text found`);
  }

  // Check for navigation links
  const navLinks = await page.locator('nav a, header a').all();
  for (const link of navLinks) {
    const href = await link.getAttribute('href');
    if (href && !href.startsWith('http') && !href.startsWith('#')) {
      // Check if route exists
      if (!ROUTES.includes(href) && !ROUTES.some(r => href?.startsWith(r))) {
        result.brokenLinks.push(`Suspicious link: ${href}`);
      }
    }
  }

  await page.waitForTimeout(1000); // Wait for any lazy-loaded content

  return result;
}

test.describe('Site-wide Audit', () => {
  const results: AuditResult[] = [];

  for (const route of ROUTES) {
    test(`audit ${route}`, async ({ page }) => {
      const result = await auditPage(page, route);
      results.push(result);

      // Log issues immediately
      if (result.consoleErrors.length > 0) {
        console.log(`\n❌ Console errors on ${route}:`, result.consoleErrors);
      }
      if (result.networkErrors.length > 0) {
        console.log(`\n❌ Network errors on ${route}:`, result.networkErrors);
      }
      if (result.pageErrors.length > 0) {
        console.log(`\n❌ Page errors on ${route}:`, result.pageErrors);
      }
      if (result.brokenLinks.length > 0) {
        console.log(`\n⚠️ Broken links on ${route}:`, result.brokenLinks);
      }
      if (result.visibleIssues.length > 0) {
        console.log(`\n⚠️ Visible issues on ${route}:`, result.visibleIssues);
      }
    });
  }

  test('generate audit report', async () => {
    console.log('\n\n=== AUDIT SUMMARY ===');
    let totalErrors = 0;
    let totalWarnings = 0;

    for (const result of results) {
      const errorCount = result.consoleErrors.length + result.networkErrors.length + result.pageErrors.length;
      const warningCount = result.consoleWarnings.length + result.brokenLinks.length + result.visibleIssues.length;
      totalErrors += errorCount;
      totalWarnings += warningCount;

      if (errorCount > 0 || warningCount > 0) {
        console.log(`\n${result.route}: ${errorCount} errors, ${warningCount} warnings`);
      }
    }

    console.log(`\nTOTAL: ${totalErrors} errors, ${totalWarnings} warnings across ${results.length} pages`);

    // Don't fail the test, just report
    expect(true).toBe(true);
  });
});
