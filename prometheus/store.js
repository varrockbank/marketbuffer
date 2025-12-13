const { reactive } = Vue;

// ============================================
// GLOBAL STORE
// ============================================
export const store = reactive({
  // Theme
  theme: 'dark', // 'dark' | 'light'

  // UI State
  sidenavCollapsed: false,
  terminalExpanded: false,
});

// ============================================
// ACTIONS
// ============================================
export const actions = {
  toggleTheme() {
    store.theme = store.theme === 'dark' ? 'light' : 'dark';
  },

  toggleSidenav() {
    store.sidenavCollapsed = !store.sidenavCollapsed;
  },

  toggleTerminal() {
    store.terminalExpanded = !store.terminalExpanded;
  },
};

// Expose to console for testing
window.store = store;
window.actions = actions;
