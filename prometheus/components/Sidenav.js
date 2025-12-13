import { store } from '../store.js';

export const Sidenav = {
  template: `
    <div class="sidenav" :class="{ collapsed: store.sidenavCollapsed }">
      <div style="padding: 12px; color: var(--text-secondary);">Sidenav</div>
    </div>
  `,
  setup() {
    return { store };
  },
};
