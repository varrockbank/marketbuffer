import { store, actions } from '../../store.js';
import { KitBackground } from '../kit/KitBackground.js';
import { KitPanel } from '../kit/KitPanel.js';
import { KitDrawer } from '../kit/KitDrawer.js';
import { KitTerminal } from '../kit/KitTerminal.js';
import { AppSimulator } from '../apps/AppSimulator.js';
import { AppWallpaper } from '../apps/AppWallpaper.js';

export const ViewHome = {
  components: { KitBackground, KitPanel, KitDrawer, KitTerminal, AppSimulator, AppWallpaper },
  template: `
    <div class="flex-1 flex flex-col overflow-hidden">
      <KitBackground ref="homeView" :wallpaper="store.wallpaper" :showGrid="store.isDraggingWindow">
        <KitPanel
          v-for="type in store.openWindows"
          :key="type"
          class="absolute"
          :title="getWindowTitle(type)"
          :style="getWindowStyle(type)"
          @close="closeWindow(type)"
          @dragstart="onDragStart(type, $event)"
          @drag="onDrag(type, $event)"
          @dragend="onDragEnd"
        >
          <AppSimulator v-if="type === 'simulator'" />
          <AppWallpaper v-else-if="type === 'wallpaper'" />
        </KitPanel>
      </KitBackground>
      <KitDrawer title="Terminal" :expanded="store.terminalExpanded" @toggle="actions.toggleTerminal">
        <KitTerminal />
      </KitDrawer>
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
      const app = store.apps.find(a => a.id === type);
      return app?.label || 'Window';
    };

    const getWindowWidth = (type) => {
      const app = store.apps.find(a => a.id === type);
      return app?.width;
    };

    const getWindowStyle = (type) => {
      const pos = store.windowPositions[type] || { x: 0, y: 0, z: 1 };
      const width = getWindowWidth(type);
      return {
        left: pos.x + 'px',
        top: pos.y + 'px',
        zIndex: pos.z,
        ...(width && { width: width + 'px' }),
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
      const width = getWindowWidth(type) || store.defaultWindowWidth;
      const maxX = containerWidth - width;
      actions.moveWindow(type, initialX + deltaX, initialY + deltaY, maxY, maxX);
    };

    const onDragEnd = () => {
      store.isDraggingWindow = false;
    };

    const constrainWindows = () => {
      if (!homeView.value) return;

      const maxY = homeView.value.offsetHeight - titleBarHeight;

      for (const type of store.openWindows) {
        const pos = store.windowPositions[type];
        if (pos) {
          const width = getWindowWidth(type) || store.defaultWindowWidth;
          const maxX = homeView.value.offsetWidth - width;
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

    return { store, actions, getWindowTitle, getWindowStyle, closeWindow, onDragStart, onDrag, onDragEnd, homeView };
  },
};
