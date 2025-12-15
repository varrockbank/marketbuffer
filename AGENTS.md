# Marketbuffer Agents Guide

Quick reference for AI agents contributing to the retro Mac–style web desktop.

## App Lifecycle
- Single instance per app: opening an existing app brings its window to front instead of spawning another (applies to all cards, including the Editor).
- Cards live in `cards/` and own their rendering, state, and event handling; the OS core (`index.html`) only manages window chrome, z-index, and focus.
- Window DOM:
  ```html
  <div class="window" data-window-id="appId">
    <div class="window-title-bar">
      <div class="close-box" data-window-id="appId"></div>
      <span class="window-title">Title</span>
    </div>
    <!-- app content() is inserted directly here (no .window-content wrapper) -->
  </div>
  ```
- When rerendering, locate your app’s container (e.g., `.stock-content`) and replace its `outerHTML`; do not wrap content in `.window-content`.
- Event delegation is centralized: `handleClick(e)` per window, `handleChange(e)` via global change listener that finds `[data-window-id]`; `init(system)` fires on open (not awaited—async init must call `rerender()` when done).
- File opening: `system.openFile(path)` routes by extension per `fileHandlers` in `index.html`.

## Versioning and Changelog
- `default-state.json` holds the single source of truth for the version; bump it when changing core OS logic (`index.html`) so cached localStorage resets.
- On changes, update `changelog.md` with a new version section and bump the version in `default-state.json`.

## Code Style
- Use trailing commas in arrays and objects.

## Icons
- Use Lucide SVGs (no emojis/Unicode glyphs). Pattern:
  ```html
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Lucide paths -->
  </svg>
  ```
- Fetch from `https://unpkg.com/lucide-static@latest/icons/{icon-name}.svg`; browse at https://lucide.dev/icons.

## Data API Parity
- Keep `server/main.go` and `server/wasm/main.go` in sync for any endpoint changes; update `server-service.js` accordingly, then rebuild WASM with `cd server && make wasm`.
- Current API surface: `getTickers()`, `getOHLC(ticker, year, window)`, `getDaily(ticker, year, month)`.
