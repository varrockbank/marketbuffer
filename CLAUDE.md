# Marketbuffer OS

A retro Mac-inspired web desktop environment.

## Architecture

### Single Instance per App

Each card/app/window has exactly one instance. When a user opens an app that's already running, the existing instance is brought to front rather than creating a new one. This applies to all apps including the Editor.

### Apps (cards/)

Apps are self-contained modules in the `cards/` directory. Each app owns:
- Its own rendering logic
- Its own state management
- Its own event handling

The OS core (`index.html`) provides window management (position, z-index, focus) but delegates content rendering to each app's `render()` method.

### Window Structure

Regular windows have this DOM structure:
```html
<div class="window" data-window-id="appId">
  <div class="window-title-bar">
    <div class="close-box" data-window-id="appId"></div>
    <span class="window-title">Title</span>
  </div>
  <!-- content() output is placed directly here, NOT wrapped in .window-content -->
</div>
```

**Important:** The app's `content()` output is placed directly after the title bar, not wrapped in a `.window-content` div. When rerendering, look for your app's own container class (e.g., `.stock-content`) and use `outerHTML` to replace it.

### Event Delegation

- `handleClick(e)` - delegated via click listeners on each window
- `handleChange(e)` - delegated via global change listener that finds the parent `[data-window-id]`
- `init(system)` - called when window opens (NOT awaited, so async init must call `rerender()` when done)

### File Opening API

The OS provides `system.openFile(path)` which routes files to the appropriate app based on extension. The extension-to-app mapping is defined in `fileHandlers` in index.html.

## Version Management

The version number is defined in `default-state.json` - this is the single source of truth.

**Important:** Bump the version in `default-state.json` when making changes to core logic in `index.html`. This ensures users with cached localStorage state get a fresh state when the OS logic changes.

When the version changes, returning users will have their localStorage cleared and state reset to defaults.

## Changelog

When making changes, always update:
1. `changelog.md` - Add new version section with changes
2. `default-state.json` - Bump the version number

## Code Style

- Always use trailing commas in arrays and objects

## Data API

The stock data API has two implementations that must be kept in sync:
- `server/main.go` - HTTP server for local development
- `server/wasm/main.go` - WASM module for static deployment

When adding or modifying API endpoints:
1. Update both `main.go` and `wasm/main.go` with the same logic
2. Update `server-service.js` to call the new function
3. Rebuild WASM with `cd server && make wasm`

Current API functions:
- `getTickers()` - List available stock tickers
- `getOHLC(ticker, year, window)` - Get monthly OHLC data
- `getDaily(ticker, year, month)` - Get daily prices for a specific month
