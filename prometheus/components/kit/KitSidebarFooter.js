import { useStyles } from '../../useStyles.js';

const styles = `
.kit-sidebar-footer {
  margin-top: auto;
  flex-shrink: 0;
  border-top: 1px solid var(--border-color);
}
`;

/**
 * KitSidebarFooter - Footer section for KitSidebar.
 * Automatically pushed to bottom via margin-top: auto.
 */
export const KitSidebarFooter = {
  template: `
    <div class="kit-sidebar-footer">
      <slot></slot>
    </div>
  `,
  setup() {
    useStyles('kit-sidebar-footer', styles);
  },
};
