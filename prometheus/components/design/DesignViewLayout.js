export const DesignViewLayout = {
  props: {
    collapsed: { type: Boolean, default: false },
  },
  template: `
    <div class="view-layout">
      <div class="view-menu" :class="{ collapsed: collapsed }">
        <div class="view-menu-header" v-if="$slots.header">
          <slot name="header"></slot>
        </div>
        <div class="view-menu-content">
          <slot name="menu"></slot>
        </div>
      </div>
      <div class="view-main">
        <div class="view-content">
          <slot></slot>
        </div>
      </div>
    </div>
  `,
};
