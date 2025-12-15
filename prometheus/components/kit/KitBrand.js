import { KitIcon } from './KitIcon.js';
import { useStyles } from '../../lib/useStyles.js';

const styles = `
.kit-brand {
  display: flex;
  align-items: center;
  gap: 1em;
  color: var(--text-secondary);
  padding-left: 0.167em;
  cursor: pointer;
  transition: color 0.2s ease-out;
}

.kit-brand:hover {
  color: var(--text-primary);
}

.kit-brand-name {
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: 300;
}

.kit-brand-icon {
  display: flex;
  transition: transform 1s ease-out;
}

.kit-brand:hover .kit-brand-icon {
  transform: rotate(540deg);
}

.kit-brand.active .kit-brand-icon {
  color: var(--accent);
}

.kit-brand-version {
  opacity: 0.5;
  font-size: 10px;
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
      class="kit-brand"
      :class="{ active: isActive }"
    >
      <span class="kit-brand-icon"><KitIcon :icon="icon" :size="18" /></span>
      <span class="kit-brand-name">{{ name }}</span>
      <span v-if="subtitle" class="kit-brand-version">{{ subtitle }}</span>
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
