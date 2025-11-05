/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { AxeBuilder } from '@axe-core/playwright';
import { chromium, Browser, Page } from 'playwright';
import { AxeResults } from 'axe-core';

export type PageSetup = (page: Page) => Promise<void>;

export interface AxeAnalysisOptions {
  tags?: string[];
  rules?: string[];
}

/**
 * Manages a persistent Playwright browser instance to run Axe accessibility analysis efficiently.
 */
export class AxeAnalyzer {
  private browser: Browser | null = null;

  /**
   * Initializes the analyzer by launching a Playwright browser instance.
   * This should be called before any analysis is run.
   */
  async initialize(): Promise<void> {
    this.browser = await chromium.launch();
  }

  /**
   * Closes the Playwright browser instance.
   * This should be called during graceful shutdown.
   */
  async close(): Promise<void> {
    await this.browser?.close();
  }

  /**
   * Runs an Axe analysis on a new browser page.
   *
   * @param pageSetup A function that prepares the Playwright page for analysis (e.g., sets content or navigates to a URL).
   * @param options Optional configuration for the Axe run, such as tags or specific rules.
   * @returns The accessibility violations found by Axe.
   */
  async analyze(
    pageSetup: PageSetup,
    options: AxeAnalysisOptions = {}
  ): Promise<AxeResults> {
    if (!this.browser) {
      throw new Error(
        'AxeAnalyzer is not initialized. Please call initialize() first.'
      );
    }

    const context = await this.browser.newContext();
    const page = await context.newPage();
    try {
      await pageSetup(page);

      const axeBuilder = new AxeBuilder({ page });

      // If no tags specified, use comprehensive WCAG tags by default
      if (options.tags) {
        axeBuilder.withTags(options.tags);
      } else if (!options.rules) {
        // Run full WCAG 2.0 Level A & AA and WCAG 2.1 Level A & AA
        axeBuilder.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']);
      }

      if (options.rules) {
        axeBuilder.withRules(options.rules);
      }

      return await axeBuilder.analyze();
    } finally {
      await page.close();
      await context.close();
    }
  }
}