import { store } from '../store.js';
import { Window } from './Window.js';

export const HomeView = {
  components: { Window },
  template: `
    <div class="home-view" ref="homeView" :class="[{ 'show-grid': store.isDraggingWindow }, 'wp-' + store.wallpaper]">
      <Window
        v-for="type in store.openWindows"
        :key="type"
        :type="type"
        :style="getWindowStyle(type)"
      />
    </div>
  `,
  setup() {
    const homeView = Vue.ref(null);

    const getWindowStyle = (type) => {
      const pos = store.windowPositions[type] || { x: 0, y: 0, z: 1 };
      return {
        left: pos.x + 'px',
        top: pos.y + 'px',
        zIndex: pos.z,
        width: store.defaultWindowWidth + 'px',
      };
    };

    const constrainWindows = () => {
      if (!homeView.value) return;

      const maxX = homeView.value.offsetWidth - store.defaultWindowWidth;
      const maxY = homeView.value.offsetHeight - 28; // titleBarHeight

      for (const type of store.openWindows) {
        const pos = store.windowPositions[type];
        if (pos) {
          let changed = false;
          let newX = pos.x;
          let newY = pos.y;

          if (pos.x > maxX) {
            newX = Math.max(0, maxX);
            changed = true;
          }
          if (pos.y > maxY) {
            newY = Math.max(0, maxY);
            changed = true;
          }

          if (changed) {
            // Snap to grid
            pos.x = Math.round(newX / store.gridSize) * store.gridSize;
            pos.y = Math.round(newY / store.gridSize) * store.gridSize;
          }
        }
      }
    };

    Vue.onMounted(() => {
      window.addEventListener('resize', constrainWindows);
    });

    Vue.onUnmounted(() => {
      window.removeEventListener('resize', constrainWindows);
    });

    return { store, getWindowStyle, homeView };
  },
};
