export const DesignSidebar = {
  props: {
    title: { type: String, default: 'Panel' },
    collapsed: { type: Boolean, default: false },
  },
  template: `
    <div class="app-menu" :class="{ collapsed }">
      <div class="app-menu-header">
        <slot name="header">
          <span class="app-menu-title">{{ title }}</span>
        </slot>
      </div>
      <div class="app-menu-content">
        <slot></slot>
      </div>
    </div>
  `,
};
