
import AxeBuilder from '@axe-core/playwright';
import { chromium, Browser } from 'playwright';

export async function performStaticAccessibilityCheck(url: string) {
    // The target URL and port are expected to be passed as command-line arguments.
    let browser: Browser | undefined;
    try {
        console.log(`Launching browser for a11y check on ${url}...`);
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();
        console.log(`Navigating to page: ${url}`);
        await page.goto(url);
        console.log('Page loaded.');
        console.log('Analyzing page with axe-core...');
        const axeResults = await new AxeBuilder({ page })
            .withTags([
                'wcag2a',
                'wcag21a',
                'wcag22a',
                'wcag2aa',
                'wcag21aa',
                'wcag22aa',
                'best-practice',
            ])
            .analyze();
        console.log('Analysis complete.');
        const { violations } = axeResults;
        return violations;
    } catch (e) {
        const error = e as Error;
        console.error('An error occurred during the accessibility check:', error);
        return [];
    } finally {
        if (browser) {
            console.log('Closing browser...');
            await browser.close();
            console.log('Browser closed.');
        }
    }
}