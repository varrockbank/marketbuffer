import { useStyles } from '../../lib/useStyles.js';

// Keep CSS for .no-contrast parent selector
const styles = `
.no-contrast .kit-sidebar-footer {
  border-top: none;
}
`;

/**
 * KitSidebarFooter - Footer section for KitSidebar.
 * Automatically pushed to bottom via margin-top: auto.
 * Props:
 *   padded - Adds padding around content (use for buttons, not for KitMenu)
 */
export const KitSidebarFooter = {
  props: {
    padded: { type: Boolean, default: false },
  },
  template: `
    <div class="kit-sidebar-footer mt-auto shrink-0 flex gap-2 overflow-visible border-t border-[var(--border-color)]" :class="{ 'px-2 py-1': padded }">
      <slot></slot>
    </div>
  `,
  setup() {
    useStyles('kit-sidebar-footer', styles);
  },
};
