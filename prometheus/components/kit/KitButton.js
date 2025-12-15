import { KitIcon } from './KitIcon.js';
import { useStyles } from '../../lib/useStyles.js';

// Keep only: theme-light parent selector, svg child rotation, tooltip ::after
const styles = `
.theme-light .kit-button:hover {
  background: var(--bg-tertiary);
}

.kit-button:hover svg {
  transform: rotate(15deg);
}

/* Tooltip - requires ::after pseudo-element */
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
    iconPlaceholder: { type: Boolean, default: false },
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
      class="kit-button flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-150 bg-transparent border-0 font-inherit relative no-underline min-w-0 text-[var(--text-secondary)] hover:bg-black hover:text-[var(--text-primary)]"
      :class="[sizeClass, variantClass, { '!text-[var(--accent)]': active, 'tooltip-align-right': tooltipAlignRight, 'tooltip-right': tooltipPosition === 'right' }]"
      :data-tooltip="effectiveTooltip"
      @mouseenter="checkPosition"
    >
      <KitIcon v-if="icon" :icon="icon" :size="iconSize" />
      <span v-else-if="iconPlaceholder" class="shrink-0" :style="{ width: iconSize + 'px', height: iconSize + 'px' }"></span>
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
      switch (props.variant) {
        case 'inherit':
          classes.push('!text-inherit hover:!bg-[rgba(128,128,128,0.2)] hover:!text-inherit');
          break;
        case 'primary':
          // Don't apply primary color if active - let active state win
          if (!props.active) classes.push('!text-[var(--text-primary)]');
          break;
        case 'danger':
          classes.push('!text-[#e55] hover:!bg-[rgba(238,85,85,0.1)] hover:!text-[#e55] w-full !rounded');
          break;
        case 'success':
          classes.push('!text-[rgb(131,193,141)] hover:!bg-[rgba(131,193,141,0.1)] hover:!text-[rgb(131,193,141)] w-full !rounded');
          break;
        case 'menu':
          classes.push('hover:!bg-black hover:!text-white w-full !rounded');
          break;
        case 'sidebar':
          classes.push('w-full', props.active ? '!text-[var(--text-primary)] shadow-[inset_2px_0_0_var(--accent),inset_-2px_0_0_var(--accent)]' : '');
          break;
      }
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
