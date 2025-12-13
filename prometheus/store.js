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
    }
  },
};

// Expose to console for testing
window.store = store;
window.actions = actions;
