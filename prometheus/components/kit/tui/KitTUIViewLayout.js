import { useStyles } from '../../../lib/useStyles.js';

const styles = `
.kit-tui-view-layout,
.kit-tui-view-layout * {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
  font-size: 16px;
  line-height: 1.375;
}

.kit-tui-view-layout {
  background: var(--tui-bg);
  color: var(--tui-fg);
}

.kit-tui-view-layout-menu {
  background: var(--tui-bg);
}

.kit-tui-view-layout-content {
  background: var(--tui-bg);
  padding-left: 1ch;
}

.kit-tui-menu-item {
  cursor: pointer;
  white-space: nowrap;
}

.kit-tui-menu-item:hover {
  background: var(--tui-fg);
  color: var(--tui-bg);
}

.kit-tui-menu-item.active {
  color: #0abab5;
}

.kit-tui-menu-item.active:hover {
  background: var(--tui-fg);
  color: var(--tui-bg);
}

.kit-tui-header {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.kit-tui-header::before {
  content: '══';
  margin-right: 1ch;
}

.kit-tui-header::after {
  content: '════════════════════════════════';
  flex: 1;
  overflow: hidden;
  margin-left: 1ch;
}
`;

export const KitTUIViewLayout = {
  props: {
    collapsed: { type: Boolean, default: false },
    title: { type: String, default: '' },
  },
  template: `
    <div class="kit-tui-view-layout flex flex-1 overflow-hidden">
      <div
        class="kit-tui-view-layout-menu flex flex-col shrink-0 overflow-hidden"
        :class="collapsed ? 'w-0 !border-r-0' : 'w-[24ch]'"
      >
        <slot name="menu"></slot>
      </div>
      <div class="kit-tui-view-layout-content flex-1 flex flex-col overflow-hidden">
        <div v-if="title">{{ title }}</div>
        <slot></slot>
      </div>
    </div>
  `,
  setup() {
    useStyles('kit-tui-view-layout', styles);
  },
};
