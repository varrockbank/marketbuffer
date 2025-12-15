import { store, actions, apps } from '../../store.js';
import { KitPanel } from '../kit/KitPanel.js';
import { KitDrawer } from '../kit/KitDrawer.js';
import { KitTerminal } from '../kit/KitTerminal.js';
import { AppSimulator } from '../apps/AppSimulator.js';
import { AppWallpaper } from '../apps/AppWallpaper.js';
import { useStyles } from '../../lib/useStyles.js';

const styles = `
.view-home-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.view-home-desktop {
  flex: 1;
  position: relative;
  background: var(--bg-primary);
  overflow: hidden;
}

.view-home-desktop.show-grid {
  background-image:
    linear-gradient(to right, var(--border-color) 1px, transparent 1px),
    linear-gradient(to bottom, var(--border-color) 1px, transparent 1px);
  background-size: 40px 40px;
}

.view-home-desktop > .kit-panel {
  position: absolute;
  height: 100%;
}

.view-home-desktop.wp-classic {
  background:
    repeating-linear-gradient(0deg, transparent, transparent 1px, var(--bg-secondary) 1px, var(--bg-secondary) 2px),
    repeating-linear-gradient(90deg, transparent, transparent 1px, var(--bg-secondary) 1px, var(--bg-secondary) 2px);
  background-color: var(--bg-tertiary);
}
.view-home-desktop.wp-solid-gray { background: #808080; }
.view-home-desktop.wp-solid-teal { background: #008080; }
.view-home-desktop.wp-starfield {
  background:
    radial-gradient(ellipse at center, rgba(122, 104, 170, 0.3) 0%, rgba(60, 40, 100, 0.15) 40%, transparent 70%),
    radial-gradient(1px 1px at 20px 30px, white, transparent),
    radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 50px 160px, rgba(255,255,255,0.6), transparent),
    radial-gradient(1px 1px at 90px 40px, white, transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.7), transparent),
    radial-gradient(1px 1px at 160px 120px, white, transparent),
    #0a0a1a;
  background-size: 100% 100%, 200px 200px, 200px 200px, 200px 200px, 200px 200px, 200px 200px, 200px 200px, 100% 100%;
  animation: starfield-move 60s linear infinite;
}
.view-home-desktop.wp-hokusai { background: url('../assets/hokusai.png') center/cover no-repeat; }
.view-home-desktop.wp-gradient-sunset { background: linear-gradient(180deg, #FF7E5F 0%, #FEB47B 100%); }
.view-home-desktop.wp-checkerboard {
  background: repeating-conic-gradient(var(--border-color) 0% 25%, var(--bg-secondary) 0% 50%) 50% / 20px 20px;
}
.view-home-desktop.wp-diagonal {
  background: repeating-linear-gradient(45deg, var(--bg-tertiary), var(--bg-tertiary) 5px, var(--bg-secondary) 5px, var(--bg-secondary) 10px);
}
.view-home-desktop.wp-dots {
  background: radial-gradient(circle, var(--border-color) 1px, transparent 1px);
  background-size: 10px 10px;
  background-color: var(--bg-tertiary);
}
.view-home-desktop.wp-mac-ii {
  background: repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 6px 6px;
}
`;

export const ViewHome = {
  components: { KitPanel, KitDrawer, KitTerminal, AppSimulator, AppWallpaper },
  template: `
    <div class="view-home-wrapper">
      <div class="view-home-desktop" ref="homeView" :class="[{ 'show-grid': store.isDraggingWindow }, 'wp-' + store.wallpaper]">
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
          <AppSimulator v-if="type === 'simulator'" />
          <AppWallpaper v-else-if="type === 'wallpaper'" />
        </KitPanel>
      </div>
      <KitDrawer title="Terminal" :expanded="store.terminalExpanded" @toggle="actions.toggleTerminal">
        <KitTerminal />
      </KitDrawer>
    </div>
  `,
  setup() {
    useStyles('view-home', styles);

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

    return { store, actions, getWindowTitle, getWindowStyle, closeWindow, onDragStart, onDrag, onDragEnd, homeView };
  },
};
