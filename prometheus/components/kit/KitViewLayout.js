import { useStyles } from '../../lib/useStyles.js';

const styles = `
.kit-view-layout-menu {
  width: 220px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.15s ease-out;
}

.kit-view-layout-menu.collapsed {
  width: 0;
  border-right: none;
  overflow: hidden;
}

.kit-view-layout-menu-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.kit-view-layout-menu-header > .kit-menu {
  flex: 1;
}

.kit-view-layout-menu-title {
  font-weight: 500;
  color: var(--text-primary);
}

.kit-view-layout-menu-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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

.kit-view-layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.kit-view-layout-content {
  flex: 1;
  overflow: auto;
  background: var(--bg-primary);
}
`;

export const KitViewLayout = {
  props: {
    collapsed: { type: Boolean, default: false },
  },
  template: `
    <div class="kit-view-layout">
      <div class="kit-view-layout-menu" :class="{ collapsed: collapsed }">
        <div class="kit-view-layout-menu-header" v-if="$slots.header">
          <slot name="header"></slot>
        </div>
        <div class="kit-view-layout-menu-content">
          <slot name="menu"></slot>
        </div>
      </div>
      <div class="kit-view-layout-main">
        <div class="kit-view-layout-content">
          <slot></slot>
        </div>
      </div>
    </div>
  `,
  setup() {
    useStyles('kit-view-layout', styles);
  },
};
