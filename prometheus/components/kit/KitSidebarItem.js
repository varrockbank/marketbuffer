import { KitIcon } from './KitIcon.js';
import { useStyles } from '../../useStyles.js';

const styles = `
.sidenav-item {
  display: flex;
  align-items: center;
  gap: 0.667em;
  padding: 0.667em;
  border-radius: 0.5em;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.15s ease-out;
  text-decoration: none;
  margin-bottom: 0.167em;
}

.sidenav-item:hover {
  background: #000;
  color: var(--text-primary);
}

.theme-light .sidenav-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.sidenav-item.active {
  color: var(--text-primary);
  box-shadow: inset 2px 0 0 var(--accent), inset -2px 0 0 var(--accent);
}
`;

/**
 * KitSidebarItem - Navigation item with icon and label for sidebars.
 *
 * Props:
 *   icon   - Icon name
 *   label  - Text label (also used as tooltip)
 *   to     - Route path (renders as router-link if provided)
 *   active - Whether item is active
 */
export const KitSidebarItem = {
  components: { KitIcon },
  props: {
    icon: { type: String, required: true },
    label: { type: String, required: true },
    to: { type: String, default: null },
    active: { type: Boolean, default: false },
  },
  template: `
    <component
      :is="to ? 'router-link' : 'div'"
      :to="to"
      class="sidenav-item"
      :class="{ active }"
      :data-tooltip="label"
    >
      <KitIcon :icon="icon" class="sidenav-icon" />
      <span class="sidenav-label">{{ label }}</span>
    </component>
  `,
  setup() {
    useStyles('kit-sidebar-item', styles);
  }
};
