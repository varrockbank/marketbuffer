import { store, actions } from '../../store.js';
import { KitTUIViewLayout } from '../kit/tui/KitTUIViewLayout.js';

const categories = [
  { id: 'appearance', label: 'Appearance' },
  { id: 'desktop', label: 'Desktop' },
];

export const ViewTuiSettings = {
  components: { KitTUIViewLayout },
  template: `
    <KitTUIViewLayout :collapsed="store.subSidenavCollapsed" :title="selectedLabel">
      <template #menu>
        <div class="flex-1 overflow-y-auto">
          <div class="kit-tui-header">Settings</div>
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="kit-tui-menu-item pl-0 ml-[1ch] pr-0 gap-0 flex items-center cursor-pointer"
            :class="selectedCategory === cat.id ? 'active' : ''"
            @click="selectedCategory = cat.id"
          >
            <span class="inline-block" style="width: 2ch;">{{ selectedCategory === cat.id ? '>' : '' }}</span>
            <span class="truncate">{{ cat.label }}</span>
          </div>
        </div>
      </template>

      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <template v-if="selectedCategory === 'appearance'">
          <div class="font-bold mb-2">== Appearance ==</div>
          <div class="mb-2">
            <span>Theme: </span>
            <span class="cursor-pointer" :class="store.theme === 'dark' ? 'font-bold' : ''" @click="setTheme('dark')">[Dark]</span>
            <span class="cursor-pointer" :class="store.theme === 'light' ? 'font-bold' : ''" @click="setTheme('light')">[Light]</span>
          </div>
          <div class="mb-2">
            <span>Contrast borders: </span>
            <span class="cursor-pointer" @click="actions.toggleContrast">{{ store.contrast ? '[ON]' : '[OFF]' }}</span>
          </div>
        </template>
        <template v-else-if="selectedCategory === 'desktop'">
          <div class="font-bold mb-2">== Desktop ==</div>
          <div class="mb-1">Wallpaper:</div>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="wp in store.wallpapers"
              :key="wp.id"
              class="cursor-pointer"
              :class="store.wallpaper === wp.id ? 'font-bold' : ''"
              @click="store.wallpaper = wp.id"
            >[{{ wp.id }}]</span>
          </div>
        </template>
      </div>
    </KitTUIViewLayout>
  `,
  setup() {
    const selectedCategory = Vue.ref('appearance');

    const selectedLabel = Vue.computed(() => {
      const cat = categories.find(c => c.id === selectedCategory.value);
      return cat ? cat.label : 'Settings';
    });

    const setTheme = (value) => {
      store.theme = value;
    };

    return { store, actions, categories, selectedCategory, selectedLabel, setTheme };
  },
};
