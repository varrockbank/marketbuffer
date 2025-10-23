# Cards API

Cards are self-contained application modules for the Marketbuffer OS. Each card defines a complete application including its UI, styles, logic, and lifecycle hooks.

## Card Structure

```javascript
const myCard = {
  // ============================================
  // METADATA (required)
  // ============================================
  id: 'my-app',              // Unique identifier
  title: 'My Application',   // Window title bar text

  // ============================================
  // WINDOW CONFIGURATION
  // ============================================
  draggable: true,           // Can the window be dragged?
  closeable: true,           // Show close button?
  zIndex: 100,               // Initial stacking order

  // Position (use top/right for standard windows)
  top: 100,                  // Pixels from top
  right: 50,                 // Pixels from right
  width: 400,                // Window width in pixels

  // For tabbed windows (like Editor), use all four:
  // top, left, right, bottom

  // ============================================
  // CONTEXT MENU
  // ============================================
  contextMenu: [
    { label: 'Close', action: 'close' }
  ],

  // ============================================
  // CONTENT (required)
  // ============================================
  content: `
    <div class="my-app-content">
      <!-- Your HTML here -->
    </div>
  `,

  // ============================================
  // STYLES (required)
  // ============================================
  styles: `
    .my-app-content {
      padding: 16px;
      background: var(--window-bg);
    }
  `,

  // ============================================
  // LIFECYCLE HOOKS
  // ============================================

  // Called once when OS boots (before any windows open)
  // Use for: loading saved settings, system-wide initialization
  boot() {
    // Optional
  },

  // Called each time this app's window is opened
  // Use for: initializing UI state, attaching handlers
  init() {
    // Optional
  },

  // Called when this app's window is closed
  // Use for: cleanup, saving state
  destroy() {
    // Optional
  },

  // ============================================
  // EVENT HANDLERS
  // ============================================

  // Handle click events within this app's window
  handleClick(e) {
    if (e.target.closest('.my-button')) {
      this.doSomething();
    }
  },

  // Handle change events (selects, checkboxes, inputs)
  handleChange(e) {
    if (e.target.id === 'my-select') {
      this.onSelectChange(e.target.value);
    }
  },

  // ============================================
  // CUSTOM METHODS
  // ============================================

  doSomething() {
    // Your app logic
  }
};
```

## CSS Variables

Use these CSS variables for theme compatibility:

```css
/* Backgrounds */
var(--bg-color)        /* Desktop background */
var(--window-bg)       /* Window background */
var(--sidebar-bg)      /* Sidebar/header background */
var(--pane-bg)         /* Editor pane background */
var(--input-bg)        /* Input field background */
var(--hover-bg)        /* Hover state background */
var(--selected-bg)     /* Selected item background */

/* Borders */
var(--window-border)   /* Window/element borders */
var(--menu-border)     /* Menu borders */
var(--input-border)    /* Input field borders */

/* Text */
var(--text-color)      /* Primary text */
var(--text-muted)      /* Secondary/muted text */

/* Diff colors (for code diff displays) */
var(--diff-added)      /* Added line background */
var(--diff-removed)    /* Removed line background */
var(--diff-added-text) /* Added line text */
var(--diff-removed-text) /* Removed line text */
var(--diff-header-bg)  /* Diff header background */
```

## OS Services

Cards can call these OS-level functions:

```javascript
// Close a window by ID
closeWindow(windowId)

// Show a UI alert dialog
showUIAlert(message)

// Open an application
openApplication(appId)
```

## Special Card Types

### Tabbed Window (Editor)

For tabbed windows, add:

```javascript
{
  tabbed: true,
  tabs: [
    {
      id: 'tab-1',
      name: 'Tab 1',
      activePane: 'pane-1',
      panes: { id: 'pane-1', title: 'Pane 1' }
    }
  ],

  // Method to generate pane content
  generatePaneContent(paneId) {
    return `<div id="editor-${paneId}">...</div>`;
  }
}
```

## Storage

Use localStorage for persistence:

```javascript
const MY_STORAGE_KEY = 'marketbuffer_myapp_setting';

// Save
localStorage.setItem(MY_STORAGE_KEY, JSON.stringify(value));

// Load
const value = JSON.parse(localStorage.getItem(MY_STORAGE_KEY) || 'null');
```

## Example: Minimal Card

```javascript
const helloCard = {
  id: 'hello',
  title: 'Hello World',
  draggable: true,
  closeable: true,
  zIndex: 100,
  top: 100,
  right: 100,
  width: 300,
  contextMenu: [
    { label: 'Close', action: 'close' }
  ],

  content: `
    <div class="hello-content">
      <p>Hello, World!</p>
      <button class="hello-btn">Click Me</button>
    </div>
  `,

  styles: `
    .hello-content {
      padding: 20px;
      text-align: center;
      background: var(--window-bg);
    }
    .hello-btn {
      padding: 8px 16px;
      border: 1px solid var(--window-border);
      background: var(--window-bg);
      cursor: pointer;
    }
    .hello-btn:hover {
      background: var(--text-color);
      color: var(--window-bg);
    }
  `,

  clickCount: 0,

  init() {
    this.clickCount = 0;
  },

  handleClick(e) {
    if (e.target.closest('.hello-btn')) {
      this.clickCount++;
      e.target.textContent = `Clicked ${this.clickCount} times`;
    }
  },

  boot() {},
  destroy() {}
};
```

## Registration

Add your card to `index.html`:

```html
<!-- Load the card -->
<script src="cards/mycard.js"></script>
```

```javascript
// Add to initialWindows array
const initialWindows = [
  editorCard,
  finderCard,
  // ... other cards
  myCard  // Your new card
];
```
