const { reactive } = Vue;

// ============================================
// APP CONFIGURATION
// ============================================

// All apps in one place with type property
// Type 1: Permanent sidenav items (views)
// Type 2: Apps available in Applications menu (open as windows)
// Type 3: Have routes but not in Applications menu
export const apps = [
  // Type 1: Views
  { id: 'yap', label: 'Yap', icon: 'yap', type: 1 },
  { id: 'deployments', label: 'Deployments', icon: 'deployments', type: 1 },
  { id: 'data', label: 'Data', icon: 'data', type: 1 },
  { id: 'stream', label: 'Stream', icon: 'stream', type: 1 },
  { id: 'code', label: 'Code', icon: 'code', type: 1 },
  { id: 'publish', label: 'Publish', icon: 'publish', type: 1 },
  { id: 'simulate', label: 'Simulate', icon: 'simulate', type: 1 },
  { id: 'agents', label: 'Agents', icon: 'agents', type: 1 },
  // Type 2: Window apps
  {
    id: 'simulator',
    label: 'Perfect Liquidity Simulator',
    icon: 'chart',
    type: 2,
    description: 'Practice trading with simulated market data. Test your strategies without risking real money.',
    version: '1.0.0',
  },
  {
    id: 'wallpaper',
    label: 'Desktop Wallpaper',
    icon: 'image',
    type: 2,
    description: 'Customize your desktop background with various wallpapers and themes.',
    version: '1.0.0',
  },
  // Type 3: Routes not in Applications menu
  { id: 'applications', route: '/applications', label: 'Applications', icon: 'apps', type: 3 },
  { id: 'settings', route: '/settings', label: 'Settings', icon: 'settings', type: 3 },
];

// Derived lists by type
export const menuItems = apps.filter(a => a.type === 1);
export const type2Apps = apps.filter(a => a.type === 2);
export const type3Apps = apps.filter(a => a.type === 3);
export const type2AppIds = type2Apps.map(a => a.id);

// ============================================
// GLOBAL STORE
// ============================================
export const store = reactive({
  // App
  brandName: 'Marketbuffer',
  brandIcon: 'sparkle',
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
  currentProject: 'WarrenBuffer',
  activeFile: null,
  activeFilePath: null,  // Full path for loading file content
  activeFileContent: null,  // Content of the currently open file
  activeFileError: null,  // Error message if file failed to load
  fileLoading: false,  // Loading state for file content

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

  // File actions
  setActiveFile(filename, filepath) {
    store.activeFile = filename;
    store.activeFilePath = filepath;
    store.activeFileError = null;
  },

  setFileContent(content) {
    store.activeFileContent = content;
    store.activeFileError = null;
    store.fileLoading = false;
  },

  setFileError(error) {
    store.activeFileError = error;
    store.activeFileContent = null;
    store.fileLoading = false;
  },

  setFileLoading(loading) {
    store.fileLoading = loading;
  },

  clearActiveFile() {
    store.activeFile = null;
    store.activeFilePath = null;
    store.activeFileContent = null;
    store.activeFileError = null;
    store.fileLoading = false;
  },
};

// Expose to console for testing
window.store = store;
window.actions = actions;
