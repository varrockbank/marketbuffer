# Prometheus

A web-based IDE built with Vue 3.

## Overview

Prometheus is a browser-based IDE with a flexible panel layout. Built with Vue 3 via CDN (no build step required).

### Layout

```
┌─────────────────────────────────────────────────────┐
│                    Menu Bar                         │
├────────┬──────────┬─────────────────────────────────┤
│        │          │                                 │
│Sidenav │Sub-Sidenav│         Viewport               │
│ (icons)│ (panel)  │                                 │
│        │          ├─────────────────────────────────┤
│        │          │  Terminal (collapsible)         │
└────────┴──────────┴─────────────────────────────────┘
```

- **Sidenav**: Icon-based navigation (files, search, settings, etc.)
- **Sub-Sidenav**: Context panel that changes based on active sidenav item
- **Viewport**: Main editor/content area
- **Terminal**: Collapsible bottom panel

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
    ├── Brand.js        # Logo, name, version
    ├── MenuBar.js      # Top menu bar
    ├── MenuBarButton.js# Reusable button for menu bar
    ├── ProjectSelector.js # Project dropdown for code tab
    ├── Sidenav.js      # Collapsible sidebar
    ├── SidenavItem.js  # Reusable menu item
    ├── SubSidenav.js   # Context panel (changes based on active menu)
    ├── UserProfile.js  # User profile in sidenav footer
    ├── UserProfileMenu.js # Dropdown menu for user profile
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

## App Types

When we say "app", we mean type-2 apps.

### Type-1 (Sidenav Items)
- Permanent items in the **sidenav**
- Navigate to routes/views
- Do NOT appear in the Applications menu
- Examples: Yap, Deployments, Data, Stream, Code, Publish, Simulate, Agents
- Defined in `menuItems` array in `Sidenav.js`

### Type-2 (Apps)
- Available in the **Applications menu** (flyout from Applications sidenav item)
- Open as windows in the home view
- When open, also appear in sidenav below type-1 items (with separator)
- Components live in `components/apps/` directory
- Examples: Perfect Liquidity Simulator, Desktop Wallpaper
- Defined in `appSubmenu` array in `Sidenav.js`

### Active Window
- The **active window** is the app that receives keyboard shortcuts
- Tracked in `store.activeWindow`
- Set when: window is opened, brought to front, or clicked in sidenav
- Highlighted with accent color in the sidenav
- Each app can define its own keyboard shortcuts that only work when active

### Keyboard Shortcuts

**Perfect Liquidity Simulator:**
- `Space` - Buy (when no position) / Sell (when holding)
- `Enter` - Next Day

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
