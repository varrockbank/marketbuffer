import { store } from '../store.js';
import { HomeView } from './HomeView.js';

export const Viewport = {
  components: { HomeView },
  template: `
    <div class="viewport">
      <HomeView v-if="isHome" />
      <router-view v-else />
    </div>
  `,
  setup() {
    const route = VueRouter.useRoute();
    const isHome = Vue.computed(() => route.path === '/');

    return { store, isHome };
  },
};
