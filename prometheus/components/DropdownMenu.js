export const DropdownMenu = {
  props: {
    direction: { type: String, default: 'down' }, // 'up' or 'down'
  },
  template: `
    <div class="dropdown-menu-wrapper">
      <div class="dropdown-menu-trigger" @click="open = !open">
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
