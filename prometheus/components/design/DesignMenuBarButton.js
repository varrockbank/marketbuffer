import { DesignIcon } from './DesignIcon.js';

// Todo: rename toolbarbutton

export const DesignMenuBarButton = {
  components: { DesignIcon },
  props: ['icon', 'title', 'active'],
  emits: ['click'],
  template: `
    <button
      ref="btn"
      class="menu-bar-btn"
      :class="{ 'tooltip-right': alignRight, 'active': active }"
      :data-tooltip="title"
      @click="$emit('click')"
      @mouseenter="checkPosition"
    >
      <DesignIcon :icon="icon" />
    </button>
  `,
  setup() {
    const btn = Vue.ref(null);
    const alignRight = Vue.ref(false);

    const checkPosition = () => {
      if (btn.value) {
        const rect = btn.value.getBoundingClientRect();
        const buttonCenter = rect.left + rect.width / 2;
        const spaceRight = window.innerWidth - buttonCenter;
        alignRight.value = spaceRight < 80;
      }
    };

    return { btn, alignRight, checkPosition };
  },
};
