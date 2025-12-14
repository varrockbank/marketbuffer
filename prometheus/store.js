const { reactive } = Vue;

// ============================================
// GLOBAL STORE
// ============================================
export const store = reactive({
  // App
  version: '0.1.0',

  // Theme
  theme: 'dark', // 'dark' | 'light'
  contrast: true, // contrast mode for sidenavs
  wallpaper: 'hokusai', // desktop wallpaper

  // UI State
  sidenavCollapsed: false,
  subSidenavCollapsed: false,
  terminalExpanded: false,
  activeMenuItem: 'yap',
  currentProject: 'prometheus',
  activeFile: null,

  // Project Files
  projectFiles: {
    'prometheus': [
      { name: 'index.html', type: 'file' },
      { name: 'store.js', type: 'file' },
      { name: 'CLAUDE.md', type: 'file' },
      { name: 'components', type: 'folder', children: [
        { name: 'Brand.js', type: 'file' },
        { name: 'MenuBar.js', type: 'file' },
        { name: 'Sidenav.js', type: 'file' },
        { name: 'Viewport.js', type: 'file' },
        { name: 'Terminal.js', type: 'file' },
      ]},
    ],
    'marketbuffer-api': [
      { name: 'main.go', type: 'file' },
      { name: 'go.mod', type: 'file' },
      { name: 'handlers', type: 'folder', children: [
        { name: 'auth.go', type: 'file' },
        { name: 'users.go', type: 'file' },
        { name: 'projects.go', type: 'file' },
      ]},
      { name: 'models', type: 'folder', children: [
        { name: 'user.go', type: 'file' },
        { name: 'project.go', type: 'file' },
      ]},
    ],
    'marketbuffer-web': [
      { name: 'package.json', type: 'file' },
      { name: 'index.html', type: 'file' },
      { name: 'src', type: 'folder', children: [
        { name: 'App.vue', type: 'file' },
        { name: 'main.js', type: 'file' },
        { name: 'components', type: 'folder', children: [
          { name: 'Header.vue', type: 'file' },
          { name: 'Sidebar.vue', type: 'file' },
        ]},
      ]},
    ],
    'data-pipeline': [
      { name: 'pipeline.py', type: 'file' },
      { name: 'requirements.txt', type: 'file' },
      { name: 'config.yaml', type: 'file' },
      { name: 'tasks', type: 'folder', children: [
        { name: 'extract.py', type: 'file' },
        { name: 'transform.py', type: 'file' },
        { name: 'load.py', type: 'file' },
      ]},
    ],
  },

  // Windows
  openWindows: ['simulator'],
  windowPositions: {
    simulator: { x: 0, y: 0, z: 1 },
  },
  activeWindow: 'simulator', // Window that receives keyboard shortcuts
  topZIndex: 1,
  gridSize: 40,
  defaultWindowWidth: 400,
  isDraggingWindow: false,
  distractionFree: false,
});

// ============================================
// ACTIONS
// ============================================
export const actions = {
  toggleTheme() {
    store.theme = store.theme === 'dark' ? 'light' : 'dark';
  },

  toggleContrast() {
    store.contrast = !store.contrast;
  },

  toggleSidenav() {
    store.sidenavCollapsed = !store.sidenavCollapsed;
  },

  toggleTerminal() {
    store.terminalExpanded = !store.terminalExpanded;
  },

  toggleSubSidenav() {
    store.subSidenavCollapsed = !store.subSidenavCollapsed;
  },

  closeWindow(type) {
    const index = store.openWindows.indexOf(type);
    if (index > -1) {
      store.openWindows.splice(index, 1);
      if (store.activeWindow === type) {
        store.activeWindow = null;
      }
    }
  },

  openWindow(type) {
    if (!store.openWindows.includes(type)) {
      store.openWindows.push(type);
      store.topZIndex++;

      // Get occupied positions
      const occupied = new Set();
      for (const w of store.openWindows) {
        if (w !== type && store.windowPositions[w]) {
          const pos = store.windowPositions[w];
          occupied.add(`${pos.x},${pos.y}`);
        }
      }

      // Try positions in a row first, then cascade down
      const windowWidth = store.defaultWindowWidth + store.gridSize; // Account for spacing
      let found = false;
      let bestX = 0;
      let bestY = 0;

      // Estimate max columns (assume ~1600px viewport, minus sidenav ~200px)
      const maxCols = Math.floor(1400 / windowWidth);

      // Try rows of windows
      for (let row = 0; row < 10 && !found; row++) {
        const y = row * store.gridSize * 2;
        for (let col = 0; col < maxCols && !found; col++) {
          const x = col * windowWidth;
          const snappedX = Math.round(x / store.gridSize) * store.gridSize;

          // Check if this position overlaps with any existing window
          let overlaps = false;
          for (const w of store.openWindows) {
            if (w !== type && store.windowPositions[w]) {
              const pos = store.windowPositions[w];
              // Check if windows would overlap (within window width)
              if (Math.abs(snappedX - pos.x) < store.defaultWindowWidth &&
                  Math.abs(y - pos.y) < store.gridSize * 2) {
                overlaps = true;
                break;
              }
            }
          }

          if (!overlaps) {
            bestX = snappedX;
            bestY = y;
            found = true;
          }
        }
      }

      store.windowPositions[type] = {
        x: bestX,
        y: bestY,
        z: store.topZIndex,
      };
      store.activeWindow = type;
    } else {
      // Window already open, just bring to front
      this.bringToFront(type);
    }
  },

  moveWindow(type, x, y, maxY = Infinity, maxX = Infinity) {
    // Snap to grid
    const snappedX = Math.round(x / store.gridSize) * store.gridSize;
    const snappedY = Math.round(y / store.gridSize) * store.gridSize;
    // Constrain to viewport (can't drag off left, top, right, or below bottom)
    const constrainedX = Math.min(Math.max(0, snappedX), maxX);
    const constrainedY = Math.min(Math.max(0, snappedY), maxY);
    if (store.windowPositions[type]) {
      store.windowPositions[type].x = constrainedX;
      store.windowPositions[type].y = constrainedY;
    }
  },

  bringToFront(type) {
    if (store.windowPositions[type]) {
      store.topZIndex++;
      store.windowPositions[type].z = store.topZIndex;
      store.activeWindow = type;
    }
  },

  toggleDistractionFree() {
    store.distractionFree = !store.distractionFree;
  },
};

// Expose to console for testing
window.store = store;
window.actions = actions;
