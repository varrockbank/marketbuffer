import { store } from '../store.js';
import { Window } from './Window.js';

export const HomeView = {
  components: { Window },
  template: `
    <div class="home-view" :class="{ 'show-grid': store.isDraggingWindow }">
      <Window
        v-for="type in store.openWindows"
        :key="type"
        :type="type"
        :style="getWindowStyle(type)"
      />
    </div>
  `,
  setup() {
    const getWindowStyle = (type) => {
      const pos = store.windowPositions[type] || { x: 0, y: 0, z: 1 };
      return {
        left: pos.x + 'px',
        top: pos.y + 'px',
        zIndex: pos.z,
        width: store.defaultWindowWidth + 'px',
      };
    };

    return { store, getWindowStyle };
  },
};
