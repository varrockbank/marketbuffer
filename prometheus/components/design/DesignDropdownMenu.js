export const DesignDropdownMenu = {
  props: {
    direction: { type: String, default: 'down' }, // 'up', 'down', or 'right'
    trigger: { type: String, default: 'click' }, // 'click' or 'hover'
  },
  template: `
    <div
      class="dropdown-menu-wrapper"
      @mouseenter="trigger === 'hover' && (open = true)"
      @mouseleave="trigger === 'hover' && (open = false)"
    >
      <div class="dropdown-menu-trigger" @click="trigger === 'click' && (open = !open)">
        <slot name="trigger"></slot>
      </div>
      <div
        v-if="open"
        class="dropdown-menu"
        :class="'dropdown-menu-' + direction"
      >
        <slot name="menu" :close="close"></slot>
      </div>
    </div>
  `,
  setup() {
    const open = Vue.ref(false);

    const close = () => {
      open.value = false;
    };

    return { open, close };
  },
};
