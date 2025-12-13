# Prometheus

A/B test rewrite of the Marketbuffer OS web desktop environment using Vue 3.

## Overview

This is an experimental rewrite using Vue 3 via CDN (no build step required).

## Architecture

- **Framework**: Vue 3 (CDN, no build step)
- **Components**: Single-file components defined in `<script>` tags
- **State**: Vue 3 Composition API with `ref` and `reactive`

### Components

- `SidebarComponent` - Collapsible navigation sidebar
- `MenuBar` - Top menu bar with tabs
- `DesktopComponent` - Window container/desktop area
- `WindowComponent` - Draggable, focusable windows

## Development

Simply open `index.html` in a browser. No build step required.

```bash
# From this directory
open index.html
# Or use a local server
python -m http.server 8080
```

## Differences from Main

| Feature | Main (Vanilla JS) | Prometheus (Vue 3) |
|---------|-------------------|-------------------|
| Framework | None | Vue 3 |
| State | Global OS object | Vue refs/reactive |
| Components | Manual DOM | Vue components |
| Build step | None | None (CDN) |
