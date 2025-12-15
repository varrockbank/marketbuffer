import { store, actions } from '../../store.js';
import { KitViewLayout } from '../kit/KitViewLayout.js';
import { KitIcon } from '../kit/KitIcon.js';
import { useStyles } from '../../lib/useStyles.js';
import { wallpaperPreviewStyles } from '../../lib/wallpaperService.js';

// Keep only CSS for pseudo-elements and dynamic wallpaper previews
const styles = `
/* Toggle switch knob - requires pseudo-element */
.view-settings-toggle::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.15s ease-out;
}
.view-settings-toggle.active::after {
  transform: translateX(18px);
}

/* Dynamic wallpaper previews */
${wallpaperPreviewStyles.replace(/^\.wp-/gm, '.view-settings-wallpaper-option.wp-')}
`;

const categories = [
  { id: 'appearance', label: 'Appearance', icon: 'sun' },
  { id: 'desktop', label: 'Desktop', icon: 'image' },
];

export const ViewSettings = {
  components: { KitViewLayout, KitIcon },
  template: `
    <KitViewLayout :collapsed="store.subSidenavCollapsed">
      <template #menu>
        <div class="py-1">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors hover:bg-[var(--bg-tertiary)]"
            :class="{ 'bg-[var(--bg-tertiary)]': selectedCategory === cat.id }"
            @click="selectedCategory = cat.id"
          >
            <span :class="selectedCategory === cat.id ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'"><KitIcon :icon="cat.icon" :size="16" /></span>
            <span class="text-xs text-[var(--text-primary)]">{{ cat.label }}</span>
          </div>
        </div>
      </template>
      <div class="p-6 max-w-[600px]">
        <template v-if="selectedCategory === 'appearance'">
          <h1 class="text-2xl font-semibold mb-6 text-[var(--text-primary)]">Appearance</h1>
          <div class="mb-8">
            <div class="flex items-center justify-between py-3 border-b border-[var(--border-color)]">
              <div>
                <div class="text-xs text-[var(--text-primary)]">Theme</div>
                <div class="text-[11px] text-[var(--text-secondary)] mt-0.5">Switch between light and dark mode</div>
              </div>
              <select class="px-2.5 py-1.5 border border-[var(--border-color)] rounded bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs cursor-pointer" :value="store.theme" @change="setTheme($event.target.value)">
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
            <div class="flex items-center justify-between py-3">
              <div>
                <div class="text-xs text-[var(--text-primary)]">Contrast borders</div>
                <div class="text-[11px] text-[var(--text-secondary)] mt-0.5">Show borders between UI regions</div>
              </div>
              <div class="view-settings-toggle w-10 h-[22px] rounded-[11px] border border-[var(--border-color)] cursor-pointer relative transition-colors" :class="store.contrast ? 'active bg-[var(--accent)] !border-[var(--accent)]' : 'bg-[var(--bg-tertiary)]'" @click="actions.toggleContrast"></div>
            </div>
          </div>
        </template>
        <template v-else-if="selectedCategory === 'desktop'">
          <h1 class="text-2xl font-semibold mb-6 text-[var(--text-primary)]">Desktop</h1>
          <div class="mb-8">
            <div class="text-sm font-semibold text-[var(--text-primary)] mb-3">Wallpaper</div>
            <div class="grid grid-cols-[repeat(5,48px)] gap-2 mt-2">
              <div
                v-for="wp in store.wallpapers"
                :key="wp.id"
                class="view-settings-wallpaper-option w-12 aspect-[4/3] border-2 border-[var(--border-color)] cursor-pointer rounded bg-[var(--bg-secondary)] hover:border-[var(--text-primary)]"
                :class="['wp-' + wp.id, { 'selected !border-[var(--accent)] !border-[3px]': store.wallpaper === wp.id }]"
                :title="wp.label"
                @click="store.wallpaper = wp.id"
              ></div>
            </div>
          </div>
        </template>
      </div>
    </KitViewLayout>
  `,
  setup() {
    useStyles('view-settings', styles);

    const selectedCategory = Vue.ref('appearance');

    const setTheme = (value) => {
      store.theme = value;
    };

    return { store, actions, categories, selectedCategory, setTheme };
  },
};
