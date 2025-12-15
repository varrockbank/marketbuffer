import { store } from '../../store.js';
import { useStyles } from '../../lib/useStyles.js';

const styles = `
/* Wallpaper panel - not full height, auto width */
.view-home-desktop > .kit-panel:has(.wallpaper-content) {
  height: auto;
  width: auto !important;
}

/* Wallpaper Styles */
.wallpaper-content {
  padding: 12px;
  background: var(--bg-primary);
}

.wallpaper-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.wallpaper-option {
  width: 60px;
  aspect-ratio: 4/3;
  border: 2px solid var(--border-color);
  cursor: pointer;
  position: relative;
  border-radius: 4px;
}

.wallpaper-option:hover {
  border-color: var(--text-primary);
}

.wallpaper-option.selected {
  border-color: var(--accent);
  border-width: 3px;
}

.wallpaper-option.selected::after {
  content: '';
  position: absolute;
  top: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: var(--accent);
  border-radius: 50%;
}

/* Wallpaper patterns (used in both thumbnails and home-view) */
.wp-classic {
  background:
    repeating-linear-gradient(0deg, transparent, transparent 1px, var(--bg-secondary) 1px, var(--bg-secondary) 2px),
    repeating-linear-gradient(90deg, transparent, transparent 1px, var(--bg-secondary) 1px, var(--bg-secondary) 2px);
  background-color: var(--bg-tertiary);
}
.wp-solid-gray { background: #808080; }
.wp-solid-teal { background: #008080; }
.wp-starfield {
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
@keyframes starfield-move {
  from { background-position: 0 0; }
  to { background-position: -200px 200px; }
}
.wp-hokusai { background: url('../assets/hokusai.png') center/cover no-repeat; }
.wp-gradient-sunset { background: linear-gradient(180deg, #FF7E5F 0%, #FEB47B 100%); }
.wp-checkerboard {
  background: repeating-conic-gradient(var(--border-color) 0% 25%, var(--bg-secondary) 0% 50%) 50% / 20px 20px;
}
.wp-diagonal {
  background: repeating-linear-gradient(45deg, var(--bg-tertiary), var(--bg-tertiary) 5px, var(--bg-secondary) 5px, var(--bg-secondary) 10px);
}
.wp-dots {
  background: radial-gradient(circle, var(--border-color) 1px, transparent 1px);
  background-size: 10px 10px;
  background-color: var(--bg-tertiary);
}
.wp-mac-ii {
  background: repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 6px 6px;
}
`;

const wallpapers = [
  { id: 'classic', label: 'Classic' },
  { id: 'solid-gray', label: 'Solid Gray' },
  { id: 'solid-teal', label: 'Solid Teal' },
  { id: 'starfield', label: 'Starfield' },
  { id: 'hokusai', label: 'Hokusai Wave' },
  { id: 'gradient-sunset', label: 'Sunset' },
  { id: 'checkerboard', label: 'Checkerboard' },
  { id: 'diagonal', label: 'Diagonal' },
  { id: 'dots', label: 'Dots' },
  { id: 'mac-ii', label: 'Mac II Dither' },
];

export const AppWallpaper = {
  template: `
    <div class="wallpaper-content">
      <div class="wallpaper-grid">
        <div
          v-for="wp in wallpapers"
          :key="wp.id"
          class="wallpaper-option"
          :class="['wp-' + wp.id, { selected: store.wallpaper === wp.id }]"
          :title="wp.label"
          @click="selectWallpaper(wp.id)"
        ></div>
      </div>
    </div>
  `,
  setup() {
    useStyles('app-wallpaper', styles);

    const selectWallpaper = (id) => {
      store.wallpaper = id;
    };

    return {
      store,
      wallpapers,
      selectWallpaper,
    };
  },
};
