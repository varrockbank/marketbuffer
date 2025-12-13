import { store } from '../store.js';

export const SubSidenav = {
  template: `
    <div class="sub-sidenav" :class="{ collapsed: store.subSidenavCollapsed }">
      <div class="sub-sidenav-header">
        <span class="sub-sidenav-title">{{ title }}</span>
      </div>
      <div class="sub-sidenav-content">
        <div style="padding: 8px; color: var(--text-secondary);">
          {{ store.activeMenuItem }} panel
        </div>
      </div>
    </div>
  `,
  setup() {
    const title = Vue.computed(() => {
      const titles = {
        home: 'Home',
        files: 'Explorer',
        search: 'Search',
        settings: 'Settings',
      };
      return titles[store.activeMenuItem] || 'Panel';
    });

    return { store, title };
  },
};
