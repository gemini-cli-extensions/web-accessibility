
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { AxeAnalyzer } from './axe-analyzer.js';
import { AxeResults } from 'axe-core';

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
      description: 'Audits a live URL for accessibility violations.',
      inputSchema: z.object({
        url: z
          .string()
          .url()
          .describe('The localhost:port or public URL to analyze.'),
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

  // TODO(mayurvaid): Enable when ready.
  // registerUpcomingA11yTools(server, analyzer);
}


function registerUpcomingA11yTools(server: McpServer, analyzer: AxeAnalyzer) {
  // Placeholder for future accessibility tools.

  // Tool for analyzing an HTML string.
  server.registerTool(
    'a11y_audit_html_string',
    {
      description: 'Audits a string of HTML content for accessibility violations.',
      inputSchema: z.object({
        html: z.string().describe('The valid HTML string to analyze.'),
        tags: z
          .array(z.string())
          .optional()
          .describe('Optional list of axe-core tags to filter the rules.'),
      }).shape,
    },
    async ({ html, tags }: { html: string; tags?: string[] }) => {
      const result = await analyzer.analyze((page) => page.setContent(html), {
        tags,
      });
      return formatAxeResults(result);
    }
  );
}