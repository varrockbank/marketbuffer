import { useStyles } from '../../lib/useStyles.js';

const styles = `
.kit-sidebar-footer {
  border-top: 1px solid var(--border-color);
}

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
    <div class="kit-sidebar-footer mt-auto shrink-0 flex gap-2 overflow-visible" :class="{ 'px-2 py-1': padded }">
      <slot></slot>
    </div>
  `,
  setup() {
    useStyles('kit-sidebar-footer', styles);
  },
};
