# Prometheus

A/B test rewrite of the Marketbuffer OS web desktop environment using Vue 3.

## Overview

This is an experimental rewrite using Vue 3 via CDN (no build step required).

## Architecture

- **Framework**: Vue 3 (CDN, no build step)
- **State**: Global reactive store (`store.js`)
- **Components**: ES modules in `components/` directory

### File Structure

```
prometheus/
├── index.html          # App shell, styles, mounts Vue
├── store.js            # Global store + actions
├── CLAUDE.md
└── components/
    ├── MenuBar.js      # Top menu bar
    ├── MenuBarButton.js# Reusable button for menu bar
    ├── Sidenav.js      # Collapsible sidebar
    ├── SidenavItem.js  # Reusable menu item
    ├── Viewport.js     # Main content area
    └── Terminal.js     # Collapsible bottom terminal
```

## Development

Requires a local server (ES modules don't work with `file://`):

```bash
cd prometheus
python -m http.server 8080
# Open http://localhost:8080
```

## Component Guidelines

**Create a separate component when:**
- Element is reused (buttons, list items, icons)
- Element has its own state or logic
- Element is complex enough to benefit from isolation
- Element could be tested independently

**Keep inline when:**
- Simple, one-off elements
- Pure layout/structure with no logic
- Tightly coupled to parent with no reuse potential

**Component conventions:**
- One component per file in `components/`
- Import store/actions only if needed
- Use props for configuration, emits for events
- Keep templates readable - extract sub-components if too long

## Console Commands

```js
store.theme = "light"    // switch theme
store.theme = "dark"
actions.toggleSidenav()  // toggle sidenav
actions.toggleTerminal() // toggle terminal
```
