/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { AxeAnalyzer } from './axe-analyzer.js';
import { AxeResults } from 'axe-core';
import { makeHexesContrast } from '../../../third_party/color-contrast-picker/lib/index.js'
import { parseExpectedContrastRatio } from './color-utils.js';

/**
 * Formats the Axe results into a structured and concise output.
 * @param result The raw AxeResults object.
 * @returns A content object for the MCP server with structured violation data.
 */
function formatAxeResults(result: AxeResults) {
  const violations = result.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    description: violation.description,
    help: violation.help,
    helpUrl: violation.helpUrl,
    nodes: violation.nodes.map((node) => ({
      html: node.html,
      selector: node.target.join(', '),

      failureDetails: [
        ...node.any.map(check => ({
          checkId: check.id,
          impact: check.impact,
          message: check.message,
          data: check.data
        })),
        ...node.all.map(check => ({
          checkId: check.id,
          impact: check.impact,
          message: check.message,
          data: check.data
        })),
        ...node.none.map(check => ({
          checkId: check.id,
          impact: check.impact,
          message: check.message,
          data: check.data
        }))
      ].filter(detail => detail.data !== null && detail.data !== undefined),

      failureSummary: node.failureSummary,
    })),
  }));

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify({ violations }, null, 2),
      },
    ],
  };
}

/**
 * Registers all accessibility-related tools with the MCP server.
 * @param server The MCP server instance.
 * @param analyzer The AxeAnalyzer instance to use for analysis.
 */
export function registerA11yTools(server: McpServer, analyzer: AxeAnalyzer) {
  // Tool for analyzing a web URL.
  server.registerTool(
    'a11y_audit_web_url',
    {
      description: 'Audits an URL for accessibility violations.',
      inputSchema: z.object({
        url: z
          .string()
          .url()
          .describe('The URL to analyze (e.g., http://localhost:8001).'),
        tags: z
          .array(z.string())
          .optional()
          .describe('Optional list of axe-core tags to filter the rules.'),
        rules: z
          .array(z.string())
          .optional()
          .describe('Optional list of axe-core rules to run.'),
      }).shape,
    },
    async ({ url, tags, rules }: { url: string; tags?: string[], rules?: string[] }) => {
      try {
        const result = await analyzer.analyze(
          async (page) => {
            await page.goto(url);
          },
          { tags, rules }
        );
        return formatAxeResults(result);
      } catch (error) {
        console.error('Error analyzing URL:', error);
        return {
          content: [
            {
              type: 'text' as const,
              text: `An error occurred while analyzing the URL: ${(error as Error).message
                }`,
            },
          ],
        };
      }
    }
  );

  server.registerTool(
    'calculate_compliant_color',
    {
      description: 'Calculates WCAG-compliant colors for contrast violations. Extract expectedContrastRatio, fgColor, and bgColor from axe-core violation data (check.data). Returns compliant foreground colors that meet the target ratio while preserving hue and saturation.',
      inputSchema: z.object({
        violations: z
          .array(
            z.object({
              id: z
                .string()
                .optional()
                .describe('Optional identifier to track which violation this is (e.g., CSS selector, element description). Will be returned in the result.'),
              foreground: z
                .string()
                .describe('Foreground color from axe-core check.data.fgColor (e.g., #888888)'),
              background: z
                .string()
                .describe('Background color from axe-core check.data.bgColor (e.g., #ffffff)'),
              expectedContrastRatio: z
                .string()
                .describe('Expected ratio from axe-core check.data.expectedContrastRatio (e.g., "4.5:1" or "3:1")'),
            })
          )
          .describe('Array of color contrast violations to fix. Pass a single-element array for one violation.'),
      }).shape,
    },
    async ({ violations }: {
      violations: Array<{
        id?: string;
        foreground: string;
        background: string;
        expectedContrastRatio: string;
      }>;
    }) => {
      const results = violations.map((violation, index) => {
        const violationId = violation.id || `violation-${index}`;

        try {
          const targetRatio = parseExpectedContrastRatio(violation.expectedContrastRatio);

          const compliantColor = makeHexesContrast(
            violation.foreground as `#${string}`,
            violation.background as `#${string}`,
            targetRatio
          );

          if (compliantColor === null) {
            return {
              id: violationId,
              success: false,
              error: 'Impossible contrast ratio',
              message:
                `Cannot achieve ${targetRatio}:1 contrast ratio between ${violation.foreground} and ${violation.background} ` +
                `while preserving hue and saturation. Consider changing the background color or ` +
                `accepting a different hue.`,
              input: {
                foreground: violation.foreground,
                background: violation.background,
                expectedContrastRatio: violation.expectedContrastRatio
              }
            };
          }

          return {
            id: violationId,
            success: true,
            original: {
              foreground: violation.foreground,
              background: violation.background,
            },
            result: {
              compliantForeground: compliantColor,
              background: violation.background,
              targetRatio
            },
            recommendation: `Change foreground color from ${violation.foreground} to ${compliantColor} to meet WCAG ${targetRatio}:1 contrast ratio.`
          };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);

          return {
            id: violationId,
            success: false,
            error: 'Invalid input',
            message: errorMessage,
            input: {
              foreground: violation.foreground,
              background: violation.background,
              expectedContrastRatio: violation.expectedContrastRatio
            }
          };
        }
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    }
  );
}