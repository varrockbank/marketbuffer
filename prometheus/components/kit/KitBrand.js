import { KitIcon } from './KitIcon.js';

export const KitBrand = {
  components: { KitIcon },
  props: {
    icon: { type: String, required: true },
    name: { type: String, required: true },
    subtitle: { type: String, default: null },
    to: { type: String, default: '/' },
  },
  template: `
    <component
      :is="isExternal ? 'a' : 'router-link'"
      :href="isExternal ? to : undefined"
      :to="isExternal ? undefined : to"
      :target="isExternal ? '_blank' : undefined"
      class="brand"
      :class="{ active: isActive }"
    >
      <KitIcon :icon="icon" class="brand-icon" />
      <span class="brand-name">{{ name }}</span>
      <span v-if="subtitle" class="brand-version">{{ subtitle }}</span>
    </component>
  `,
  setup(props) {
    const route = VueRouter.useRoute();
    const isExternal = Vue.computed(() => /^https?:\/\//.test(props.to));
    const isActive = Vue.computed(() => !isExternal.value && route.path === props.to);
    return { isExternal, isActive };
  },
};
