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

  // UI State
  sidenavCollapsed: false,
  subSidenavCollapsed: false,
  terminalExpanded: false,
  activeMenuItem: 'yap',
  currentProject: 'prometheus',
  activeFile: null,

  // Windows
  openWindows: ['data', 'stream', 'code'],
  windowPositions: {
    data: { x: 0, y: 0, z: 1 },
    stream: { x: 440, y: 0, z: 2 },
    code: { x: 880, y: 0, z: 3 },
  },
  topZIndex: 3,
  gridSize: 40,
  defaultWindowWidth: 400,
  isDraggingWindow: false,
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
    }
  },

  openWindow(type) {
    if (!store.openWindows.includes(type)) {
      store.openWindows.push(type);
      store.topZIndex++;
      store.windowPositions[type] = {
        x: store.gridSize * 2,
        y: store.gridSize * 2,
        z: store.topZIndex,
      };
    }
  },

  moveWindow(type, x, y, maxY = Infinity) {
    // Snap to grid
    const snappedX = Math.round(x / store.gridSize) * store.gridSize;
    const snappedY = Math.round(y / store.gridSize) * store.gridSize;
    // Constrain to viewport (can't drag off left, top, or below bottom)
    const constrainedX = Math.max(0, snappedX);
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
    }
  },
};

// Expose to console for testing
window.store = store;
window.actions = actions;
