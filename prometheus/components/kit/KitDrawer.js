import { useStyles } from '../../lib/useStyles.js';

const styles = `
.kit-drawer {
  background: var(--bg-tertiary);
  border-top: 1px solid var(--border-color);
}

.kit-drawer-header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
}
`;

export const KitDrawer = {
  props: {
    title: { type: String, default: 'Panel' },
    expanded: { type: Boolean, default: false },
  },
  emits: ['toggle'],
  template: `
    <div class="kit-drawer flex flex-col shrink-0 overflow-hidden transition-all duration-200" :class="expanded ? 'h-[200px]' : 'h-0'">
      <div class="kit-drawer-header h-7 flex items-center px-3 cursor-pointer shrink-0 text-[11px] font-medium" @click="$emit('toggle')">
        <span>{{ title }}</span>
      </div>
      <div class="flex-1 overflow-auto">
        <slot></slot>
      </div>
    </div>
  `,
  setup() {
    useStyles('kit-drawer', styles);
  },
};
