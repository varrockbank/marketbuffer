import { useStyles } from '../../useStyles.js';

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
`;

/**
 * KitSidebar - Collapsible sidebar container.
 * Props: collapsed
 * Slots:
 *   default - Main content (wrapped in .kit-sidebar-content)
 *   footer  - Footer content (use KitSidebarFooter)
 */
export const KitSidebar = {
  props: {
    collapsed: { type: Boolean, default: false },
  },
  template: `
    <div class="kit-sidebar" :class="{ collapsed }">
      <div class="kit-sidebar-content">
        <slot></slot>
      </div>
      <slot name="footer"></slot>
    </div>
  `,
  setup() {
    useStyles('kit-sidebar', styles);
  },
};
