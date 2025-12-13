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
};

// Expose to console for testing
window.store = store;
window.actions = actions;
