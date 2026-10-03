#!/usr/bin/env node
/**
 * TapColor MCP server — lets AI assistants (Claude, ChatGPT, …) browse
 * TapColor coloring categories and collections through the Model Context Protocol.
 *
 * Transport: stdio. Auth: set TAPCOLOR_API_KEY in the environment.
 * Docs: https://developer.tapcolor.app
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { TapColor, TapColorError } from "@tapcolorapp/api";

const apiKey = process.env.TAPCOLOR_API_KEY;
if (!apiKey) {
  console.error(
    "TapColor MCP: TAPCOLOR_API_KEY environment variable is required.\n" +
      "Request a key at https://tapcolor.app/contact/",
  );
  process.exit(1);
}

const tc = new TapColor({ apiKey });

function ok(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

function fail(err: unknown) {
  const msg =
    err instanceof TapColorError
      ? `TapColor API error ${err.status}: ${err.message}`
      : err instanceof Error
        ? err.message
        : String(err);
  return { isError: true, content: [{ type: "text" as const, text: msg }] };
}

const server = new McpServer({ name: "tapcolor", version: "1.0.0" });

server.tool(
  "list_categories",
  "List all 25 TapColor coloring categories with the number of collections and pages in each. Use the returned `slug` as the `category` argument of list_coloring_pages.",
  async () => {
    try {
      return ok(await tc.categories());
    } catch (err) {
      return fail(err);
    }
  },
);

server.tool(
  "list_coloring_pages",
  "List TapColor coloring collections (subtopics), with optional category filter, name search and pagination. Returns public page URLs and cover images.",
  {
    category: z
      .string()
      .optional()
      .describe("Category slug, e.g. 'animals', 'disney'. Omit for all categories."),
    q: z.string().optional().describe("Search collection names (partial, case-insensitive)."),
    limit: z.number().int().min(1).max(100).optional().describe("Page size 1–100 (default 20)."),
    offset: z.number().int().min(0).optional().describe("Pagination offset (default 0)."),
  },
  async (args) => {
    try {
      return ok(await tc.coloringPages(args));
    } catch (err) {
      return fail(err);
    }
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("TapColor MCP server running on stdio.");
