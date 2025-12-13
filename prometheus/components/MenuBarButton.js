export const MenuBarButton = {
  props: ['icon', 'title'],
  emits: ['click'],
  template: `
    <button class="menu-bar-btn" :title="title" @click="$emit('click')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="icon"></svg>
    </button>
  `,
};
