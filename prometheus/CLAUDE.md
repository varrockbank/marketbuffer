# Prometheus

A web-based IDE built with Vue 3.

## Overview

Prometheus is a browser-based IDE with a flexible panel layout. Built with Vue 3 via CDN (no build step required).

### Layout

```
┌─────────────────────────────────────────────────────┐
│                    Menu Bar                         │
├────────┬────────────────────────────────────────────┤
│        │                                            │
│Sidenav │              Viewport                      │
│ (icons)│  ┌──────────┬─────────────────────────┐   │
│        │  │ View Menu│     View Content        │   │
│        │  │ (panel)  │                         │   │
│        │  └──────────┴─────────────────────────┘   │
└────────┴────────────────────────────────────────────┘
```

- **Sidenav**: Icon-based navigation for type-1 apps, plus open type-2/type-3 apps
- **Viewport**: Renders HomeView (desktop) or self-contained views
- **View Menu**: Collapsible panel within each view (via ViewLayout)
- **View Content**: Main content area within each view

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
    ├── UserProfile.js  # User profile in sidenav footer
    ├── UserProfileMenu.js # Dropdown menu for user profile
    ├── Viewport.js     # Routes between HomeView and self-contained views
    ├── ViewLayout.js   # Reusable layout for self-contained views
    ├── HomeView.js     # Desktop with type-2 app windows
    ├── Window.js       # Window container for type-2 apps
    ├── apps/           # Type-2 app components
    │   ├── SimulatorWindow.js
    │   └── WallpaperWindow.js
    └── views/          # Self-contained views (type-1, type-3)
        ├── ApplicationsView.js
        ├── YapView.js
        ├── DeploymentsView.js
        ├── DataView.js
        ├── StreamView.js
        ├── CodeView.js
        ├── PublishView.js
        ├── SimulateView.js
        ├── AgentsView.js
        └── SettingsView.js
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
- Available in the **Applications menu** (dropdown in menu bar)
- Open as windows in the home view
- When open, also appear in sidenav below type-1 items (with separator)
- Components live in `components/apps/` directory
- Examples: Perfect Liquidity Simulator, Desktop Wallpaper
- Defined in `appSubmenu` array in `MenuBar.js`

### Type-3 (Route Apps)
- Have a route but are NOT listed in the Applications menu
- Appear in sidenav active apps section when navigated to
- Navigate via direct links or "More Apps" button
- Examples: Applications (/applications), Settings (/settings)

## View Architecture

Type-1 and Type-3 apps are **self-contained views**. Each view:
- Lives in `components/views/` directory (e.g., `ApplicationsView.js`)
- Uses the `ViewLayout` component for consistent structure
- Manages its own local state
- Is registered directly in the router

### ViewLayout Component

All views use `ViewLayout` (`components/ViewLayout.js`) which provides:
- Collapsible menu panel (responds to `store.subSidenavCollapsed`)
- Slots for customization: `#header`, `#menu`, and default slot for content

```javascript
import { ViewLayout } from '../ViewLayout.js';

export const MyView = {
  components: { ViewLayout },
  template: `
    <ViewLayout title="My View">
      <template #header><!-- Optional: custom header --></template>
      <template #menu><!-- Menu panel content --></template>
      <div class="view-content-inner"><!-- Main content --></div>
    </ViewLayout>
  `,
};
```

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
