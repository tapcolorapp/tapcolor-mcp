# @tapcolorapp/mcp

[MCP](https://modelcontextprotocol.io) server for the [TapColor Developer API](https://developer.tapcolor.app) —
let AI assistants (Claude, ChatGPT, …) browse TapColor coloring **categories** and **collections**.

- 📚 Docs & live explorer: <https://developer.tapcolor.app>
- 🔑 Request an API key: <https://tapcolor.app/contact/>

## Tools

| Tool | Description |
| --- | --- |
| `list_categories` | All 25 categories with collection & page counts. |
| `list_coloring_pages` | Collections with optional `category`, `q` (search), `limit`, `offset`. |

## Use with Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "tapcolor": {
      "command": "npx",
      "args": ["-y", "@tapcolorapp/mcp"],
      "env": { "TAPCOLOR_API_KEY": "YOUR_API_KEY" }
    }
  }
}
```

Restart Claude Desktop, then ask: *"List TapColor's animal coloring collections."*

## Use with any MCP client

The server speaks MCP over **stdio**. Run it directly:

```bash
TAPCOLOR_API_KEY=YOUR_API_KEY npx -y @tapcolorapp/mcp
```

## Configuration

| Env var | Required | Description |
| --- | --- | --- |
| `TAPCOLOR_API_KEY` | yes | Your TapColor API key (sent as the `api-key` header). |

Built on the official [`@tapcolorapp/api`](https://www.npmjs.com/package/@tapcolorapp/api) client.

## License

MIT © TapColor
