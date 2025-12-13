import { store } from '../store.js';
import { Window } from './Window.js';

export const HomeView = {
  components: { Window },
  template: `
    <div class="home-view">
      <Window v-for="type in store.openWindows" :key="type" :type="type" />
    </div>
  `,
  setup() {
    return { store };
  },
};
