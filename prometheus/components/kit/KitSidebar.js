import { useStyles } from '../../useStyles.js';

const styles = `
.kit-sidebar {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}
`;

/**
 * KitSidebar - Collapsible sidebar container.
 * Props: collapsed
 * Use KitSidebarFooter as child for footer (auto-pushed to bottom).
 */
export const KitSidebar = {
  props: {
    collapsed: { type: Boolean, default: false },
  },
  template: `
    <div class="kit-sidebar" :class="{ collapsed }">
      <slot></slot>
    </div>
  `,
  setup() {
    useStyles('kit-sidebar', styles);
  },
};
