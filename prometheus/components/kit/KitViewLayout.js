import { useStyles } from '../../lib/useStyles.js';

const styles = `
.kit-view-layout-menu {
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
}

.kit-view-layout-menu.collapsed {
  width: 0;
  border-right: none;
}

.kit-view-layout-menu-header {
  border-bottom: 1px solid var(--border-color);
}

.kit-view-layout-menu-header > .kit-menu {
  flex: 1;
}

.kit-view-layout-menu-title {
  font-weight: 500;
  color: var(--text-primary);
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

.kit-view-layout-content {
  background: var(--bg-primary);
}
`;

export const KitViewLayout = {
  props: {
    collapsed: { type: Boolean, default: false },
  },
  template: `
    <div class="kit-view-layout flex flex-1 overflow-hidden">
      <div
        class="kit-view-layout-menu w-[220px] flex flex-col shrink-0 transition-all duration-150 overflow-hidden"
        :class="{ collapsed }"
      >
        <div class="kit-view-layout-menu-header flex items-center shrink-0" v-if="$slots.header">
          <slot name="header"></slot>
        </div>
        <div class="kit-view-layout-menu-content flex-1 overflow-hidden flex flex-col">
          <slot name="menu"></slot>
        </div>
      </div>
      <div class="kit-view-layout-main flex-1 flex flex-col overflow-hidden">
        <div class="kit-view-layout-content flex-1 overflow-auto">
          <slot></slot>
        </div>
      </div>
    </div>
  `,
  setup() {
    useStyles('kit-view-layout', styles);
  },
};
