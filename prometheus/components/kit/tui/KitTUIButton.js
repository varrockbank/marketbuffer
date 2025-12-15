import { useStyles } from '../../../lib/useStyles.js';

const styles = `
.kit-tui-btn {
  font-family: inherit;
  font-size: inherit;
  color: var(--tui-fg);
  cursor: pointer;
  transition: all 0.1s;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3ch;
  text-align: center;
}

.kit-tui-btn:hover {
  border-top: 1px solid var(--tui-fg);
  border-bottom: 1px solid var(--tui-fg);
}

.kit-tui-btn.active {
  color: #0abab5;
}
`;

export const KitTUIButton = {
  props: {
    char: { type: String, default: 'A' },
    active: { type: Boolean, default: false },
    tooltip: { type: String, default: '' },
    tooltipTarget: { type: String, default: 'tui-bar-tooltip' },
  },
  emits: ['click'],
  template: `
    <span
      class="kit-tui-btn"
      :class="{ active }"
      @click="$emit('click', $event)"
      @mouseenter="showTooltip"
      @mouseleave="hideTooltip"
    >[{{ char }}]</span>
  `,
  setup(props) {
    useStyles('kit-tui-btn', styles);

    const showTooltip = () => {
      if (props.tooltip && props.tooltipTarget) {
        const el = document.getElementById(props.tooltipTarget);
        if (el) el.textContent = '<' + props.tooltip + '> |';
      }
    };

    const hideTooltip = () => {
      if (props.tooltipTarget) {
        const el = document.getElementById(props.tooltipTarget);
        if (el) el.textContent = '';
      }
    };

    return { showTooltip, hideTooltip };
  },
};
