import { KitIcon } from './KitIcon.js';
import { useStyles } from '../../lib/useStyles.js';

const styles = `
.kit-button {
  display: flex;
  align-items: center;
  gap: 0.667em;
  padding: 0.667em;
  border-radius: 0.5em;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.15s ease-out;
  background: none;
  border: none;
  font-family: inherit;
  font-size: inherit;
  position: relative;
}

.kit-button-sm {
  padding: 4px;
}

.kit-button-xs {
  padding: 4px;
}

.kit-button:hover {
  background: #000;
  color: var(--text-primary);
}

.theme-light .kit-button:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.kit-button.active {
  color: var(--accent);
}

.kit-button-inherit {
  color: inherit;
}

.kit-button-inherit:hover {
  background: rgba(128, 128, 128, 0.2);
  color: inherit;
}

/* Tooltip */
.kit-button[data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
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

.kit-button[data-tooltip].tooltip-right::after {
  left: auto;
  right: 0;
  transform: none;
}

.kit-button[data-tooltip]:hover::after {
  opacity: 1;
}

/* When inside a footer, center the buttons */
.kit-sidebar-footer .kit-button {
  flex: 1;
  justify-content: center;
}
`;

export const KitButton = {
  components: { KitIcon },
  props: {
    icon: { type: String, default: null },
    tooltip: { type: String, default: null },
    active: { type: Boolean, default: false },
    size: { type: String, default: null },
    variant: { type: String, default: null },
  },
  template: `
    <button
      ref="btn"
      class="kit-button"
      :class="[sizeClass, variantClass, { active, 'tooltip-right': tooltipRight }]"
      :data-tooltip="tooltip"
      @mouseenter="checkPosition"
    >
      <KitIcon v-if="icon" :icon="icon" :size="iconSize" />
      <slot></slot>
    </button>
  `,
  setup(props) {
    useStyles('kit-button', styles);

    const btn = Vue.ref(null);
    const tooltipRight = Vue.ref(false);
    const sizeClass = Vue.computed(() => props.size ? `kit-button-${props.size}` : null);
    const variantClass = Vue.computed(() => props.variant ? `kit-button-${props.variant}` : null);
    const iconSize = Vue.computed(() => {
      if (props.size === 'xs') return 14;
      if (props.size === 'sm') return 16;
      return 18;
    });

    const checkPosition = () => {
      if (btn.value) {
        const rect = btn.value.getBoundingClientRect();
        const buttonCenter = rect.left + rect.width / 2;
        const spaceRight = window.innerWidth - buttonCenter;
        tooltipRight.value = spaceRight < 80;
      }
    };

    return { btn, tooltipRight, sizeClass, variantClass, iconSize, checkPosition };
  },
};
