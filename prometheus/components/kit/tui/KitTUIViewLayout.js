import { useStyles } from '../../../lib/useStyles.js';
import { KitTUIVbufTitle } from './KitTUIVbufTitle.js';

const styles = `
.kit-tui-view-layout {
  background: var(--tui-bg);
  color: var(--tui-fg);
}

.kit-tui-view-layout-menu {
  background: var(--tui-bg);
}

.kit-tui-view-layout-content {
  background: var(--tui-bg);
  padding-left: 4px;
}

.kit-tui-view-layout-content.no-title {
  padding-top: 4px;
}
`;

export const KitTUIViewLayout = {
  components: { KitTUIVbufTitle },
  props: {
    collapsed: { type: Boolean, default: false },
    title: { type: String, default: '' },
  },
  template: `
    <div class="kit-tui-view-layout flex flex-1 overflow-hidden">
      <div
        class="kit-tui-view-layout-menu flex flex-col shrink-0 overflow-hidden"
        :class="collapsed ? 'w-0 !border-r-0' : 'w-[35ch]'"
      >
        <slot name="menu"></slot>
      </div>
      <div class="kit-tui-view-layout-content flex-1 flex flex-col overflow-hidden" :class="{ 'no-title': !title }">
        <KitTUIVbufTitle v-if="title" :text="title" class="shrink-0" />
        <slot></slot>
      </div>
    </div>
  `,
  setup() {
    useStyles('kit-tui-view-layout', styles);
  },
};
