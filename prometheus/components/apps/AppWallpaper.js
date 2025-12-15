import { store } from '../../store.js';
import { useStyles } from '../../lib/useStyles.js';

const styles = `
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
`;

export const AppWallpaper = {
  template: `
    <div class="wallpaper-content">
      <div class="wallpaper-grid">
        <div
          v-for="wp in store.wallpapers"
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

    return { store, selectWallpaper };
  },
};
