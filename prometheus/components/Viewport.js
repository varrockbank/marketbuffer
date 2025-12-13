import { store } from '../store.js';
import { WindowViewport } from './WindowViewport.js';
import { HomeView } from './HomeView.js';

export const Viewport = {
  components: { WindowViewport, HomeView },
  template: `
    <div class="viewport">
      <HomeView v-if="isHome" />
      <WindowViewport v-else />
    </div>
  `,
  setup() {
    const route = VueRouter.useRoute();
    const isHome = Vue.computed(() => route.path === '/');

    return { store, isHome };
  },
};
