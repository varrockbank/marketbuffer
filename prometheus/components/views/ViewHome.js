import { store, actions, apps } from '../../store.js';
import { KitPanel } from '../kit/KitPanel.js';
import { AppViewport } from '../AppViewport.js';

export const ViewHome = {
  components: { KitPanel, AppViewport },
  template: `
    <div class="home-view" ref="homeView" :class="[{ 'show-grid': store.isDraggingWindow }, 'wp-' + store.wallpaper]">
      <KitPanel
        v-for="type in store.openWindows"
        :key="type"
        :title="getWindowTitle(type)"
        :style="getWindowStyle(type)"
        @close="closeWindow(type)"
        @dragstart="onDragStart(type, $event)"
        @drag="onDrag(type, $event)"
        @dragend="onDragEnd"
      >
        <AppViewport :type="type" />
      </KitPanel>
    </div>
  `,
  setup() {
    const homeView = Vue.ref(null);
    const titleBarHeight = 28;
    let initialX = 0;
    let initialY = 0;
    let containerHeight = 0;
    let containerWidth = 0;

    const getWindowTitle = (type) => {
      const app = apps.find(a => a.id === type);
      return app?.label || 'Window';
    };

    const getWindowStyle = (type) => {
      const pos = store.windowPositions[type] || { x: 0, y: 0, z: 1 };
      return {
        left: pos.x + 'px',
        top: pos.y + 'px',
        zIndex: pos.z,
        width: store.defaultWindowWidth + 'px',
      };
    };

    const closeWindow = (type) => {
      actions.closeWindow(type);
    };

    const onDragStart = (type, e) => {
      containerHeight = homeView.value?.offsetHeight || window.innerHeight;
      containerWidth = homeView.value?.offsetWidth || window.innerWidth;

      actions.bringToFront(type);
      store.isDraggingWindow = true;

      const pos = store.windowPositions[type];
      initialX = pos?.x || 0;
      initialY = pos?.y || 0;
    };

    const onDrag = (type, { deltaX, deltaY }) => {
      const maxY = containerHeight - titleBarHeight;
      const maxX = containerWidth - store.defaultWindowWidth;
      actions.moveWindow(type, initialX + deltaX, initialY + deltaY, maxY, maxX);
    };

    const onDragEnd = () => {
      store.isDraggingWindow = false;
    };

    const constrainWindows = () => {
      if (!homeView.value) return;

      const maxX = homeView.value.offsetWidth - store.defaultWindowWidth;
      const maxY = homeView.value.offsetHeight - titleBarHeight;

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

    return { store, getWindowTitle, getWindowStyle, closeWindow, onDragStart, onDrag, onDragEnd, homeView };
  },
};
