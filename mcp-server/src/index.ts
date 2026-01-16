/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { AxeAnalyzer } from './tools/axe-analyzer.js';
import { registerA11yTools } from './tools/tools.js';

/**
 * Main function to initialize and run the accessibility MCP server.
 */
async function main() {
  const server = new McpServer({
    name: 'accessibility-mcp-server',
    version: '0.1.0',
  });

  const analyzer = new AxeAnalyzer();
  await analyzer.initialize();

  registerA11yTools(server, analyzer);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Gracefully handle shutdown to ensure the browser instance is closed.
  const shutdown = async () => {
    console.log('Shutting down server and browser...');
    await analyzer.close();
    process.exit(0);
  };

  process.on('SIGINT', shutdown); // Catches Ctrl+C
  process.on('SIGTERM', shutdown); // Catches kill commands
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});