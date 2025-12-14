import { useStyles } from '../../useStyles.js';

const styles = `
.kit-drawer {
  height: 0;
  background: var(--bg-tertiary);
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: height 0.2s ease-out;
  overflow: hidden;
}

.kit-drawer.expanded {
  height: 200px;
}

.kit-drawer-header {
  height: 28px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: pointer;
  flex-shrink: 0;
  color: var(--text-primary);
  font-size: 11px;
  font-weight: 500;
}

.kit-drawer-content {
  flex: 1;
  overflow: auto;
}
`;

export const KitDrawer = {
  props: {
    title: { type: String, default: 'Panel' },
    expanded: { type: Boolean, default: false },
  },
  emits: ['toggle'],
  template: `
    <div class="kit-drawer" :class="{ expanded }">
      <div class="kit-drawer-header" @click="$emit('toggle')">
        <span>{{ title }}</span>
      </div>
      <div class="kit-drawer-content">
        <slot></slot>
      </div>
    </div>
  `,
  setup() {
    useStyles('kit-drawer', styles);
  },
};
