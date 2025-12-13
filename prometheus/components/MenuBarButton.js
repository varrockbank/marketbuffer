export const MenuBarButton = {
  props: ['icon', 'title'],
  emits: ['click'],
  template: `
    <button
      ref="btn"
      class="menu-bar-btn"
      :class="{ 'tooltip-right': alignRight }"
      :data-tooltip="title"
      @click="$emit('click')"
      @mouseenter="checkPosition"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="icon"></svg>
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
