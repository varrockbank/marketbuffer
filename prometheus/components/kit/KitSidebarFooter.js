import { useStyles } from '../../useStyles.js';

const styles = `
.kit-sidebar-footer {
  margin-top: auto;
  flex-shrink: 0;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 0.5em;
  overflow: visible;
  padding: 0.5em;
}

.kit-sidebar-footer > .dropdown-menu-wrapper {
  padding: 0;
  flex: 1;
}

.kit-sidebar-footer .sidenav-item {
  margin-bottom: 0;
}

.kit-sidebar-footer .dropdown-menu {
  left: 0.5em;
  right: 0.5em;
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
