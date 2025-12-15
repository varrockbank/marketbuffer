import { store } from '../../store.js';
import { useStyles } from '../../lib/useStyles.js';
import { wallpaperPreviewStyles } from '../../lib/wallpaperService.js';

// Keep minimal CSS for dynamic wallpaper previews and selected checkmark pseudo-element
const styles = `
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

/* Wallpaper previews - dynamically generated */
${wallpaperPreviewStyles.replace(/^\.wp-/gm, '.wallpaper-option.wp-')}
`;

export const AppWallpaper = {
  template: `
    <div class="p-3 bg-[var(--bg-primary)]">
      <div class="grid grid-cols-[repeat(5,60px)] gap-2">
        <div
          v-for="wp in store.wallpapers"
          :key="wp.id"
          class="wallpaper-option w-[60px] aspect-[4/3] border-2 border-[var(--border-color)] cursor-pointer relative rounded bg-[var(--bg-secondary)] hover:border-[var(--text-primary)]"
          :class="['wp-' + wp.id, { 'selected !border-[var(--accent)] !border-[3px]': store.wallpaper === wp.id }]"
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
