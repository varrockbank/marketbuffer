import { store } from '../store.js';

export const SidenavItem = {
  props: ['id', 'label', 'icon'],
  template: `
    <div
      class="sidenav-item"
      :class="{ active: store.activeMenuItem === id }"
      :data-tooltip="label"
      @click="store.activeMenuItem = id"
    >
      <svg class="sidenav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="icon"></svg>
      <span class="sidenav-label">{{ label }}</span>
    </div>
  `,
  setup() {
    return { store };
  },
};
