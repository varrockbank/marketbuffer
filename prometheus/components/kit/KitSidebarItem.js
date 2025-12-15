import { KitIcon } from './KitIcon.js';
import { useStyles } from '../../lib/useStyles.js';

const styles = `
.kit-sidebar-item {
  display: flex;
  align-items: center;
  gap: 0.667em;
  padding: 0.667em;
  border-radius: 0.5em;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.15s ease-out;
  text-decoration: none;
}

.kit-sidebar-item:hover {
  background: #000;
  color: var(--text-primary);
}

.theme-light .kit-sidebar-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.kit-sidebar-item.active {
  color: var(--text-primary);
  box-shadow: inset 2px 0 0 var(--accent), inset -2px 0 0 var(--accent);
}

.kit-sidebar-item-label {
  white-space: nowrap;
  overflow: hidden;
  transition: opacity 0.2s ease-out;
}

/* Collapsed state */
.kit-sidebar-item.collapsed {
  position: relative;
}

.kit-sidebar-item.collapsed .kit-sidebar-item-label {
  opacity: 0;
  width: 0;
}

.kit-sidebar-item.collapsed::after {
  content: attr(data-tooltip);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 8px;
  padding: 4px 8px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  white-space: nowrap;
  font-size: 12px;
  color: var(--text-primary);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease-out;
  z-index: 100;
}

.kit-sidebar-item.collapsed:hover::after {
  opacity: 1;
}
`;

/**
 * KitSidebarItem - Navigation item with icon and label for sidebars.
 *
 * Props:
 *   icon      - Icon name
 *   label     - Text label (also used as tooltip)
 *   to        - Route path (renders as router-link if provided)
 *   active    - Whether item is active
 *   collapsed - Hides label and shows tooltip on hover
 */
export const KitSidebarItem = {
  components: { KitIcon },
  props: {
    icon: { type: String, required: true },
    label: { type: String, required: true },
    to: { type: String, default: null },
    active: { type: Boolean, default: false },
    collapsed: { type: Boolean, default: false },
  },
  template: `
    <component
      :is="to ? 'router-link' : 'div'"
      :to="to"
      class="kit-sidebar-item"
      :class="{ active, collapsed }"
      :data-tooltip="label"
    >
      <KitIcon :icon="icon" :size="18" />
      <span class="kit-sidebar-item-label">{{ label }}</span>
    </component>
  `,
  setup() {
    useStyles('kit-sidebar-item', styles);
  }
};
