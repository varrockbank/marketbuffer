export const KitDrawer = {
  props: {
    title: { type: String, default: 'Panel' },
    expanded: { type: Boolean, default: false },
  },
  emits: ['toggle'],
  template: `
    <div class="flex flex-col shrink-0 overflow-hidden transition-all duration-200 bg-[var(--bg-tertiary)] border-t border-[var(--border-color)]" :class="expanded ? 'h-[200px]' : 'h-0'">
      <div class="h-7 flex items-center px-3 cursor-pointer shrink-0 text-[11px] font-medium bg-[var(--bg-secondary)] border-b border-[var(--border-color)] text-[var(--text-primary)]" @click="$emit('toggle')">
        <span>{{ title }}</span>
      </div>
      <div class="flex-1 overflow-auto">
        <slot></slot>
      </div>
    </div>
  `,
};
