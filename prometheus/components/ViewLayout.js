import { store } from '../store.js';

export const ViewLayout = {
  template: `
    <div class="view-layout">
      <div class="view-menu" :class="{ collapsed: store.subSidenavCollapsed }">
        <div class="view-menu-header" v-if="$slots.header">
          <slot name="header"></slot>
        </div>
        <div class="view-menu-content">
          <slot name="menu"></slot>
        </div>
      </div>
      <div class="view-main">
        <div class="view-content">
          <slot></slot>
        </div>
      </div>
    </div>
  `,
  setup() {
    return { store };
  },
};
