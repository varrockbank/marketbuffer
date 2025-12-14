import { KitIcon } from './KitIcon.js';

/**
 * KitNavItem - Navigation item with icon and label.
 *
 * Props:
 *   icon   - Icon name
 *   label  - Text label (also used as tooltip)
 *   to     - Route path (renders as router-link if provided)
 *   active - Whether item is active
 */
export const KitNavItem = {
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
};
