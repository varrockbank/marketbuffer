import { store } from '../store.js';
import { Window } from './Window.js';

export const HomeView = {
  components: { Window },
  template: `
    <div class="home-view">
      <Window v-for="type in windowTypes" :key="type" :type="type" />
    </div>
  `,
  setup() {
    const windowTypes = ['data', 'stream', 'code'];

    return { store, windowTypes };
  },
};
