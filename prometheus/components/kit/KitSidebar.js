import { useStyles } from '../../lib/useStyles.js';

const styles = `
.kit-sidebar {
  width: 200px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  transition: width 0.2s ease-out;
}

.kit-sidebar.collapsed {
  display: none;
}

.kit-sidebar.icon {
  width: 48px;
}

.kit-sidebar-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.kit-sidebar.icon .kit-sidebar-content {
  overflow: visible;
}

.kit-sidebar-content.kit-sidebar-content-padded {
  padding: 0.5em;
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
    <div class="kit-sidebar" :class="[mode]">
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
