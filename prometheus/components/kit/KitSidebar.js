import { useStyles } from '../../lib/useStyles.js';

const styles = `
.kit-sidebar {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.kit-sidebar-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.kit-sidebar.collapsed .kit-sidebar-content {
  overflow: visible;
}

.kit-sidebar-content.kit-sidebar-content-padded {
  padding: 0.5em;
}
`;

/**
 * KitSidebar - Collapsible sidebar container.
 * Props:
 *   collapsed - Collapses sidebar, enables overflow for tooltips
 *   padded    - Adds padding to content area
 * Slots:
 *   default - Main content (wrapped in .kit-sidebar-content)
 *   footer  - Footer content (use KitSidebarFooter)
 */
export const KitSidebar = {
  props: {
    collapsed: { type: Boolean, default: false },
    padded: { type: Boolean, default: false },
  },
  template: `
    <div class="kit-sidebar" :class="{ collapsed }">
      <div class="kit-sidebar-content" :class="{ 'kit-sidebar-content-padded': padded }">
        <slot></slot>
      </div>
      <slot name="footer"></slot>
    </div>
  `,
  setup() {
    useStyles('kit-sidebar', styles);
  },
};
