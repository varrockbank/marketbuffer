import { useStyles } from '../../lib/useStyles.js';

const styles = `
.kit-sidebar {
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
}

.no-contrast .kit-sidebar {
  background: var(--bg-primary);
  border-right-color: transparent;
}
`;

/**
 * KitSidebar - Collapsible sidebar container.
 * Props:
 *   mode   - 'expanded' (full width), 'icon' (48px, icons only), 'collapsed' (hidden)
 *   padded - Adds padding to content area
 * Slots:
 *   default - Main content (wrapped in .kit-sidebar-content)
 *   footer  - Footer content (use KitSidebarFooter)
 */
export const KitSidebar = {
  props: {
    mode: { type: String, default: 'expanded' },
    padded: { type: Boolean, default: false },
  },
  template: `
    <div
      class="kit-sidebar flex flex-col shrink-0 transition-all duration-200"
      :class="{
        'w-[200px]': mode === 'expanded',
        'w-12': mode === 'icon',
        'hidden': mode === 'collapsed',
      }"
    >
      <div
        class="flex-1 flex flex-col"
        :class="{
          'overflow-y-auto': mode !== 'icon',
          'overflow-visible': mode === 'icon',
          'px-2 pt-1.5 pb-2': padded,
        }"
      >
        <slot></slot>
      </div>
      <slot name="footer"></slot>
    </div>
  `,
  setup() {
    useStyles('kit-sidebar', styles);
  },
};
