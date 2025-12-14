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

- **Sidenav**: Icon-based navigation for views, plus open apps
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
    ├── apps/           # App components (AppX.js naming)
    │   ├── AppSimulator.js
    │   └── AppWallpaper.js
    └── views/          # View components (ViewX.js naming)
        ├── ViewAgents.js
        ├── ViewApplications.js
        ├── ViewCode.js
        ├── ViewData.js
        ├── ViewDeployments.js
        ├── ViewPublish.js
        ├── ViewSettings.js
        ├── ViewSimulate.js
        ├── ViewStream.js
        └── ViewYap.js
```

## Development

Requires a local server (ES modules don't work with `file://`):

```bash
cd prometheus
python -m http.server 8080
# Open http://localhost:8080
```

## Terminology

- **Apps**: Type-2 components that open as windows on the desktop
- **Views**: Type-1 and Type-3 components that render as full-page routes

## App Types

### Type-1 (Views)
- Permanent items in the **sidenav**
- Navigate to routes/views
- Do NOT appear in the Applications menu
- Examples: Yap, Deployments, Data, Stream, Code, Publish, Simulate, Agents
- Components: `components/views/ViewX.js` (e.g., `ViewYap.js`)
- Defined in `menuItems` array in `Sidenav.js`

### Type-2 (Apps)
- Available in the **Applications menu** (dropdown in menu bar)
- Open as windows on the home view desktop
- When open, also appear in sidenav below type-1 items (with separator)
- Components: `components/apps/AppX.js` (e.g., `AppSimulator.js`)
- Examples: Perfect Liquidity Simulator, Desktop Wallpaper
- Defined in `appSubmenu` array in `MenuBar.js`

### Type-3 (Views)
- Have a route but are NOT listed in the Applications menu
- Appear in sidenav active apps section when navigated to
- Navigate via direct links or "More Apps" button
- Components: `components/views/ViewX.js` (e.g., `ViewSettings.js`)
- Examples: Applications (/applications), Settings (/settings)

## View Architecture

Type-1 and Type-3 are **self-contained views**. Each view:
- Lives in `components/views/` directory (e.g., `ViewApplications.js`)
- Uses the `ViewLayout` component for consistent structure
- Manages its own local state
- Is registered directly in the router

### ViewLayout Component

All views use `ViewLayout` (`components/ViewLayout.js`) which provides:
- Collapsible menu panel (responds to `store.subSidenavCollapsed`)
- Slots for customization: `#header`, `#menu`, and default slot for content

```javascript
import { ViewLayout } from '../ViewLayout.js';

export const ViewExample = {
  components: { ViewLayout },
  template: `
    <ViewLayout>
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

## CSS Guidelines

**CSS prefix conventions:**
- `view-*` - Shared ViewLayout component styles (e.g., `view-layout`, `view-menu`, `view-content`)
- `view-view-{viewname}-*` - View-specific styles (e.g., `view-view-data-*`, `view-view-code-*`)

```css
/* Shared layout (ViewLayout.js) */
.view-layout { }
.view-menu { }
.view-content { }

/* View-specific (ViewData.js) */
.view-view-data-header { }
.view-view-data-table { }
.view-view-data-sidebar-content { }
```

**Always use explicit text colors** - Do not rely on color inheritance. Every text element must have an explicit `color` property using CSS variables:

```css
/* WRONG - relies on inheritance, breaks in dark/light mode */
.my-title {
  font-weight: bold;
  font-size: 16px;
}

/* CORRECT - explicit color */
.my-title {
  font-weight: bold;
  font-size: 16px;
  color: var(--text-primary);
}
```

**Shared components:**
- `NavFooter` - Bottom section of navs (border-top, flex-shrink: 0, padding: 0.5em). Used by sidenav profile and view menu footers.

**Alignment principle:** When aligning UI elements, match the rendered pixel height - not the CSS values. Different internal structures (e.g., sidenav-item vs buttons) require different padding values to achieve the same visual height.

**Available CSS variables:**
- `--text-primary` - Main text color (use for titles, labels, content)
- `--text-secondary` - Muted text (use for metadata, hints, secondary info)
- `--bg-primary` - Main background
- `--bg-secondary` - Secondary background (sidebars, panels)
- `--bg-tertiary` - Tertiary background (hover states, inputs)
- `--border-color` - Border color
- `--accent` - Accent color (highlights, active states)

## Console Commands

```js
store.theme = "light"    // switch theme
store.theme = "dark"
actions.toggleSidenav()  // toggle sidenav
actions.toggleTerminal() // toggle terminal
```
