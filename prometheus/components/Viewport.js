import { store } from '../store.js';
import { Window } from './Window.js';
import { HomeView } from './HomeView.js';

export const Viewport = {
  components: { Window, HomeView },
  template: `
    <div class="viewport">
      <HomeView v-if="isHome" />
      <Window v-else />
    </div>
  `,
  setup() {
    const route = VueRouter.useRoute();
    const isHome = Vue.computed(() => route.path === '/');

    return { store, isHome };
  },
};
