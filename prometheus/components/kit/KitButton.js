import { KitIcon } from './KitIcon.js';
import { useStyles } from '../../lib/useStyles.js';

const styles = `
.kit-button {
  color: var(--text-secondary);
}

.kit-button:hover {
  background: #000;
  color: var(--text-primary);
}

.kit-button:hover svg {
  transform: rotate(15deg);
}

.theme-light .kit-button:hover {
  background: var(--bg-tertiary);
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

.kit-button-primary {
  color: var(--text-primary);
}

.kit-button-sidebar.active {
  color: var(--text-primary);
  box-shadow: inset 2px 0 0 var(--accent), inset -2px 0 0 var(--accent);
}

.kit-button-danger {
  color: #e55;
}

.kit-button-danger:hover {
  background: rgba(238, 85, 85, 0.1);
  color: #e55;
}

.kit-button-success {
  color: rgb(131, 193, 141);
}

.kit-button-success:hover {
  background: rgba(131, 193, 141, 0.1);
  color: rgb(131, 193, 141);
}

.kit-button-menu:hover {
  background: #000;
  color: #fff;
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

.kit-button[data-tooltip].tooltip-align-right::after {
  left: auto;
  right: 0;
  transform: none;
}

.kit-button[data-tooltip].tooltip-right::after {
  top: 50%;
  left: 100%;
  right: auto;
  transform: translateY(-50%);
  margin-top: 0;
  margin-left: 8px;
}

.kit-button[data-tooltip]:hover::after {
  opacity: 1;
}
`;

export const KitButton = {
  components: { KitIcon },
  props: {
    icon: { type: String, default: null },
    iconRight: { type: String, default: null },
    label: { type: String, default: null },
    tooltip: { type: String, default: null },
    tooltipPosition: { type: String, default: 'bottom' },
    collapsed: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    size: { type: String, default: null },
    variant: { type: String, default: null },
    to: { type: String, default: null },
  },
  template: `
    <component
      :is="to ? 'router-link' : 'button'"
      :to="to"
      ref="btn"
      class="kit-button flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-150 bg-transparent border-0 font-inherit text-inherit relative no-underline min-w-0"
      :class="[sizeClass, variantClass, { active, 'tooltip-align-right': tooltipAlignRight, 'tooltip-right': tooltipPosition === 'right' }]"
      :data-tooltip="effectiveTooltip"
      @mouseenter="checkPosition"
    >
      <KitIcon v-if="icon" :icon="icon" :size="iconSize" />
      <span v-if="!collapsed && (label || $slots.default)" class="truncate">{{ label }}<slot></slot></span>
      <span v-if="iconRight" class="ml-auto shrink-0"><KitIcon :icon="iconRight" :size="iconRightSize" /></span>
    </component>
  `,
  setup(props) {
    useStyles('kit-button', styles);

    const btn = Vue.ref(null);
    const tooltipAlignRight = Vue.ref(false);
    const sizeClass = Vue.computed(() => props.size === 'sm' ? '!p-0.5 !rounded' : null);
    const variantClass = Vue.computed(() => {
      const classes = [];
      if (props.variant) classes.push(`kit-button-${props.variant}`);
      if (props.variant === 'sidebar' || props.variant === 'menu') classes.push('w-full');
      if (props.variant === 'menu') classes.push('!rounded');
      return classes.join(' ') || null;
    });
    const iconSize = Vue.computed(() => props.size === 'sm' ? 16 : 18);
    const iconRightSize = Vue.computed(() => props.size === 'sm' ? 12 : 14);
    const effectiveTooltip = Vue.computed(() => props.tooltip || (props.collapsed ? props.label : null));

    const checkPosition = () => {
      if (props.tooltipPosition !== 'bottom') return;
      if (btn.value) {
        const el = btn.value.$el || btn.value;
        const rect = el.getBoundingClientRect();
        const buttonCenter = rect.left + rect.width / 2;
        const spaceRight = window.innerWidth - buttonCenter;
        tooltipAlignRight.value = spaceRight < 80;
      }
    };

    return { btn, tooltipAlignRight, sizeClass, variantClass, iconSize, iconRightSize, effectiveTooltip, checkPosition };
  },
};
