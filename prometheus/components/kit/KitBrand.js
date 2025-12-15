import { KitIcon } from './KitIcon.js';
import { useStyles } from '../../lib/useStyles.js';

// Keep CSS for hover rotation animation (cannot be done with Tailwind)
const styles = `
.kit-brand-icon {
  transition: transform 1s ease-out;
}
.kit-brand:hover .kit-brand-icon {
  transform: rotate(540deg);
}
`;

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
      class="kit-brand flex items-center gap-2 pl-0.5 cursor-pointer transition-colors duration-200 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      :class="{ 'kit-brand-active': isActive }"
    >
      <span class="kit-brand-icon flex" :class="{ 'text-[var(--accent)]': isActive }"><KitIcon :icon="icon" :size="18" /></span>
      <span class="font-light font-serif">{{ name }}</span>
      <span v-if="subtitle" class="opacity-50 text-[10px]">{{ subtitle }}</span>
    </component>
  `,
  setup(props) {
    useStyles('kit-brand', styles);

    const route = VueRouter.useRoute();
    const isExternal = Vue.computed(() => /^https?:\/\//.test(props.to));
    const isActive = Vue.computed(() => !isExternal.value && route.path === props.to);
    return { isExternal, isActive };
  },
};
