import { useStyles } from '../../lib/useStyles.js';

const styles = `
.kit-sidebar-footer {
  margin-top: auto;
  flex-shrink: 0;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 0.5em;
  overflow: visible;
}

.no-contrast .kit-sidebar-footer {
  border-top: none;
}

.kit-sidebar-footer.kit-sidebar-footer-padded {
  padding: 0.5em;
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
    <div class="kit-sidebar-footer" :class="{ 'kit-sidebar-footer-padded': padded }">
      <slot></slot>
    </div>
  `,
  setup() {
    useStyles('kit-sidebar-footer', styles);
  },
};
