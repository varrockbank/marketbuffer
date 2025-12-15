import { useStyles } from '../../../lib/useStyles.js';

const styles = `
.kit-tui-bar,
.kit-tui-bar * {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
  font-size: 16px;
}

.kit-tui-bar {
  background: var(--tui-bg);
  color: var(--tui-fg);
  border-bottom: 3px double var(--tui-fg);
  letter-spacing: 0;
}

.kit-tui-bar-brand {
  font-weight: bold;
}
`;

export const KitTUIBar = {
  props: {
    brand: { type: String, default: 'SYSTEM' },
  },
  template: `
    <div class="kit-tui-bar h-7 flex items-center justify-between shrink-0 pl-[1ch] pr-2">
      <div class="kit-tui-bar-brand">[{{ brand.toUpperCase() }}]</div>
      <div class="flex items-center" style="gap: 1ch;">
        <span id="tui-bar-tooltip" class="kit-tui-bar-tooltip"></span>
        <slot></slot>
      </div>
    </div>
  `,
  setup() {
    useStyles('kit-tui-bar', styles);
  },
};
