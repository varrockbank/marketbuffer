import { store } from '../store.js';

export const MenuBar = {
  template: `
    <div class="menu-bar">
      <span style="color: var(--text-secondary);">Menu Bar</span>
    </div>
  `,
  setup() {
    return { store };
  },
};
