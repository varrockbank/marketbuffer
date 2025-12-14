import { store } from '../../store.js';

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
