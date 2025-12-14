# Prometheus

Prometheus is a UI rework of Marketbuffer's original desktop-oriented environment. 
The main QF modalities: research, develop, observe are first-class applications.

It adopts Vue 3, via CDN and without buildstep. The benefit of Vue 3 over VanillaJS
it that is forces claude to think about components. It defines CSS isolation. 
It forces strict boundaries between components. It forces us to think about 
app-agnostic components vs app-specific tweaks. Vue's state container also helps to this end.

### Layout

```
┌─────────────────────────────────────────────────────┐
│                Topbar (a variant of KitBar)         │
├────────┬────────────────────────────────────────────┤
│        │                                            │
| Dock   │              Viewport                      │
│        │  ┌──────────┬─────────────────────────┐    │
│        │  │ View Menu│     View Content        │    │
│        │  │ (panel)  │                         │    │
│        │  └──────────┴─────────────────────────┘    │
└────────┴────────────────────────────────────────────┘
```

- **Dock**: App selection
- **View Menu**: Collapsible panel within each view (via ViewLayout)
- **View Content**: Main content area within each view

## Architecture

```
prometheus/
├── index.html          # App shell, global styles, mounts Vue
├── store.js            # Global store + actions
├── useStyles.js        # Helper to inject component styles
├── projectService.js   # Project/file listing and loading (future: server API)
├── CLAUDE.md
├── demo/               # Static project files for demo mode
│   └── WarrenBuffer/   # Sample project
│       ├── main.py
│       ├── portfolio.py
│       ├── data.py
│       ├── config.yaml
│       └── strategies/
│           ├── value.py
│           └── moat.py
└── components/
    ├── Topbar.js       # Top menu bar
    ├── Dock.js         # Collapsible sidebar
    ├── AppViewport.js  # Content area for windows (sidebar, apps, Terminal)
    ├── Terminal.js     # Terminal component
    ├── apps/           # App components (AppX.js naming)
    │   ├── AppSimulator.js
    │   └── AppWallpaper.js
    ├── kit/            # Reusable, app-agnostic UI components (Kit* prefix)
    │   ├── KitBar.js
    │   ├── KitBarButton.js
    │   ├── KitBrand.js
    │   ├── KitButton.js
    │   ├── KitFileTree.js
    │   ├── KitIcon.js
    │   ├── KitMenu.js
    │   ├── KitMenuItem.js
    │   ├── KitPanel.js
    │   ├── KitSidebar.js
    │   ├── KitSidebarFooter.js
    │   ├── KitSidebarItem.js
    │   └── KitViewLayout.js
    └── views/          # View components (ViewX.js naming)
        ├── ViewAgents.js
        ├── ViewApplications.js
        ├── ViewCode.js
        ├── ViewData.js
        ├── ViewDeployments.js
        ├── ViewHome.js
        ├── ViewPublish.js
        ├── ViewSettings.js
        ├── ViewSimulate.js
        ├── ViewStream.js
        └── ViewYap.js
```

## Terminology

- **Apps**: Type-2 components that open as windows on the desktop
- **Views**: Type-1 and Type-3 components that render as full-page routes

## App Types

All app types are defined in the unified `apps` array in `store.js` with a `type` property (1, 2, or 3). Derived arrays (`menuItems`, `type2Apps`, `type3Apps`, `type2AppIds`) are exported for convenience.

### Type-1 (Views)
- Permanent items in the **sidenav**
- Navigate to routes/views
- Do NOT appear in the Applications menu
- Examples: Yap, Deployments, Data, Stream, Code, Publish, Simulate, Agents
- Components: `components/views/ViewX.js` (e.g., `ViewYap.js`)

### Type-2 (Apps)
- Available in the **Applications menu** (dropdown in menu bar)
- Open as windows on the home view desktop
- When open, also appear in sidenav below type-1 items (with separator)
- Components: `components/apps/AppX.js` (e.g., `AppSimulator.js`)
- Examples: Perfect Liquidity Simulator, Desktop Wallpaper

### Type-3 (Views)
- Have a route but are NOT listed in the Applications menu
- Appear in sidenav active apps section when navigated to
- Navigate via direct links or "More Apps" button
- Components: `components/views/ViewX.js` (e.g., `ViewSettings.js`)
- Examples: Applications (/applications), Settings (/settings)

## View Architecture

Type-1 and Type-3 are **self-contained views**. Each view:
- Lives in `components/views/` directory (e.g., `ViewApplications.js`)
- Uses the `KitViewLayout` component for consistent structure
- Manages its own local state
- Is registered directly in the router

### KitViewLayout Component

All views use `KitViewLayout` (`components/kit/KitViewLayout.js`) which provides:
- Collapsible menu panel (accepts `collapsed` prop)
- Slots for customization: `#header`, `#menu`, and default slot for content

```javascript
import { store } from '../../store.js';
import { KitViewLayout } from '../kit/KitViewLayout.js';

export const ViewExample = {
  components: { KitViewLayout },
  template: `
    <KitViewLayout :collapsed="store.subSidenavCollapsed">
      <template #header><!-- Optional: custom header --></template>
      <template #menu><!-- Menu panel content --></template>
      <div class="view-content-inner"><!-- Main content --></div>
    </KitViewLayout>
  `,
  setup() {
    return { store };
  },
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

**Where to put styles:**
- `index.html` - Global styles, shared components, theme variables
- Component files - View-specific styles using `useStyles` helper

**View-specific styles** should be co-located with the component using `useStyles`:

```javascript
import { useStyles } from '../../useStyles.js';

const styles = `
.view-view-data-header { }
.view-view-data-table { }
`;

export const ViewData = {
  setup() {
    useStyles('view-data-styles', styles);
    // ...
  },
};
```

**CSS prefix conventions:**
- `view-*` - Shared ViewLayout component styles (e.g., `view-layout`, `view-menu`, `view-content`)
- `view-view-{viewname}-*` - View-specific styles (e.g., `view-view-data-*`, `view-view-code-*`)

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

**Kit components** (`components/kit/`):
- `KitBar` - Horizontal bar with left/right slots. Props: `draggable`. Slots: `#left`, default (right). Emits: `dragstart`, `drag`, `dragend`.
- `KitBrand` - Brand logo with icon, name, subtitle. Props: `icon`, `name`, `subtitle`, `to` (optional URL).
- `KitButton` - Reusable button using `.nav-item` styling (same height/padding as sidenav items).
- `KitBarButton` - Icon button for bars/toolbars with tooltip positioning. Uses KitIcon internally.
- `KitFileTree` - Recursive file tree component with `files`, `depth`, `parentPath`, `activeFilePath` props.
- `KitIcon` - Centralized icon library. Use icon names (e.g., `icon="home"`) instead of raw SVG paths. Warns on invalid icon names.
- `KitMenu` - Configurable dropdown menu with `direction` and `trigger` props.
- `KitMenuItem` - Dropdown menu item with `icon`, `selected`, `selectable`, `variant` (default/success/danger), `to` props. Shows checkmark when selected. Use `selectable` to reserve icon space for alignment in lists.
- `KitSidebarFooter` - Footer for KitSidebar. Automatically pushed to bottom via margin-top: auto.
- `KitSidebarItem` - Navigation item with icon and label for sidebars. Props: `icon`, `label`, `to` (optional route), `active`. Renders as router-link if `to` is provided.
- `KitPanel` - Window panel with draggable title bar. Uses KitBar internally. Props: `title`. Emits: `close`, `dragstart`, `drag`, `dragend`.
- `KitSidebar` - Collapsible sidebar container. Props: `collapsed`. Use KitSidebarFooter as child for footer.
- `KitViewLayout` - Layout for views with collapsible menu panel (accepts `collapsed` prop).

**Alignment principle:** When aligning UI elements, match the rendered pixel height - not the CSS values. Different internal structures (e.g., sidenav-item vs buttons) require different padding values to achieve the same visual height.

**Available CSS variables:**
- `--text-primary` - Main text color (use for titles, labels, content)
- `--text-secondary` - Muted text (use for metadata, hints, secondary info)
- `--bg-primary` - Main background
- `--bg-secondary` - Secondary background (sidebars, panels)
- `--bg-tertiary` - Tertiary background (hover states, inputs)
- `--border-color` - Border color
- `--accent` - Accent color (highlights, active states)

## Project Service

The `projectService.js` module provides functions for listing and loading project files. Currently fetches from the local `assets/` directory; in the future, will call a server API.

```javascript
import { listProjects, listFiles, loadFile } from './projectService.js';

// List all projects
const projects = await listProjects();
// ['WarrenBuffer']

// List files for a project
const files = await listFiles('WarrenBuffer');
// [{ name: 'main.py', type: 'file' }, { name: 'strategies', type: 'folder', children: [...] }]

// Load file content
const content = await loadFile('WarrenBuffer', 'main.py');
const nestedContent = await loadFile('WarrenBuffer', 'strategies/value.py');
```

**Store properties for file state:**
- `store.activeFile` - Currently open filename
- `store.activeFilePath` - Full path for loading (e.g., `strategies/value.py`)
- `store.activeFileContent` - Content of the open file
- `store.fileLoading` - Loading state
