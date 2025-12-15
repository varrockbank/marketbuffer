import { useStyles } from '../../lib/useStyles.js';

// Keep CSS for parent selectors (.no-contrast, .distraction-free) and child selector
const styles = `
.kit-view-layout-menu-header > .kit-menu {
  flex: 1;
}

.no-contrast .kit-view-layout-menu {
  background: var(--bg-primary);
  border-right-color: transparent;
}

.no-contrast .kit-view-layout-menu-header {
  border-bottom-color: transparent;
}

.distraction-free .kit-view-layout-menu {
  display: none;
}
`;

export const KitViewLayout = {
  props: {
    collapsed: { type: Boolean, default: false },
  },
  template: `
    <div class="flex flex-1 overflow-hidden">
      <div
        class="kit-view-layout-menu flex flex-col shrink-0 transition-all duration-150 overflow-hidden bg-[var(--bg-secondary)] border-r border-[var(--border-color)]"
        :class="collapsed ? 'w-0 !border-r-0' : 'w-[220px]'"
      >
        <div class="kit-view-layout-menu-header flex items-center shrink-0 border-b border-[var(--border-color)]" v-if="$slots.header">
          <slot name="header"></slot>
        </div>
        <div class="flex-1 overflow-hidden flex flex-col">
          <slot name="menu"></slot>
        </div>
      </div>
      <div class="flex-1 flex flex-col overflow-hidden">
        <div class="flex-1 overflow-auto bg-[var(--bg-primary)]">
          <slot></slot>
        </div>
      </div>
    </div>
  `,
  setup() {
    useStyles('kit-view-layout', styles);
  },
};
