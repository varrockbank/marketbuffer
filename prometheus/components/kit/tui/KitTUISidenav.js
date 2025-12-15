import { useStyles } from '../../../lib/useStyles.js';

const styles = `
.kit-tui-sidenav,
.kit-tui-sidenav * {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
  font-size: 16px;
}

.kit-tui-sidenav {
  background: var(--tui-bg);
  color: var(--tui-fg);
}

.kit-tui-sidenav-item {
  cursor: pointer;
  white-space: nowrap;
}

.kit-tui-sidenav-item:hover {
  background: var(--tui-fg);
  color: var(--tui-bg);
}

.kit-tui-sidenav-item.active {
  color: #0abab5;
}

.kit-tui-sidenav-item.active:hover {
  background: var(--tui-fg);
  color: var(--tui-bg);
}

.kit-tui-sidenav-footer {
  border: 3px double var(--tui-fg);
  margin-top: auto;
  margin-left: calc((1ch - 3px) / 2); /* center border within 1ch */
  margin-right: 0.5lh; /* align with sidenav border */
  margin-bottom: 0.5lh; /* align with content box bottom */
}
`;

export const KitTUISidenav = {
  props: {
    items: { type: Array, default: () => [] },
    activeId: { type: String, default: '' },
  },
  emits: ['select'],
  template: `
    <div class="kit-tui-sidenav flex flex-col shrink-0 w-[16ch] pl-[1ch]">
      <div
        v-for="item in items"
        :key="item.id"
        class="kit-tui-sidenav-item pl-0 pr-2"
        :class="{ active: item.id === activeId }"
        @click="$emit('select', item.id)"
      ><span class="inline-block" style="width: 2ch;">{{ item.id === activeId ? '>' : '' }}</span>{{ item.label }}</div>
      <div class="kit-tui-sidenav-footer pr-[1ch] py-1" style="padding-left: calc(1ch + 3px);">
        <slot name="footer"></slot>
      </div>
    </div>
  `,
  setup() {
    useStyles('kit-tui-sidenav', styles);
  },
};
