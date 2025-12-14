import { KitIcon } from './KitIcon.js';
import { useStyles } from '../../useStyles.js';

const styles = `
.brand {
    display: flex;
    align-items: center;
    gap: 1em;
    color: var(--text-secondary);
    padding-left: 0.167em;
    cursor: pointer;
    transition: color 0.2s ease-out;
  }

  .brand:hover {
    color: var(--text-primary);
  }

  .brand-name {
    font-family: Georgia, 'Times New Roman', serif;
    font-weight: 300;
  }

  .brand-icon {
    width: 18px;
    height: 18px;
    transition: transform 1s ease-out;
  }

  .brand:hover .brand-icon {
    transform: rotate(540deg);
  }

  .brand.active .brand-icon {
    color: var(--accent);
  }

  .brand-version {
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
      class="brand"
      :class="{ active: isActive }"
    >
      <KitIcon :icon="icon" class="brand-icon" />
      <span class="brand-name">{{ name }}</span>
      <span v-if="subtitle" class="brand-version">{{ subtitle }}</span>
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
