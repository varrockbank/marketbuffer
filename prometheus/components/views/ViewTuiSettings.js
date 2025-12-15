import { store, actions } from '../../store.js';
import { KitTUIViewLayout } from '../kit/tui/KitTUIViewLayout.js';
import { KitTUIVbufViewSidenav } from '../kit/tui/KitTUIVbufViewSidenav.js';
import { KitTUIVbufContent } from '../kit/tui/KitTUIVbufContent.js';

const categories = [
  { id: 'appearance', label: 'Appearance' },
  { id: 'desktop', label: 'Desktop' },
];

export const ViewTuiSettings = {
  components: { KitTUIViewLayout, KitTUIVbufViewSidenav, KitTUIVbufContent },
  template: `
    <KitTUIViewLayout :collapsed="store.subSidenavCollapsed || store.distractionFree" :title="selectedLabel">
      <template #menu>
        <KitTUIVbufViewSidenav
          :sections="menuSections"
          :activeId="selectedCategory"
          @select="onSelect"
        />
      </template>

      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <KitTUIVbufContent :lines="contentLines" />
      </div>
    </KitTUIViewLayout>
  `,
  setup() {
    const router = VueRouter.useRouter();
    const route = VueRouter.useRoute();

    // Get selected category from route or default to 'appearance'
    const selectedCategory = Vue.computed(() => route.params.category || 'appearance');

    const menuSections = Vue.computed(() => [
      { header: 'Settings', items: categories.map(c => ({ id: c.id, label: c.label })) },
    ]);

    const selectedLabel = Vue.computed(() => {
      const cat = categories.find(c => c.id === selectedCategory.value);
      return cat ? cat.label : 'Settings';
    });

    const onSelect = (id) => {
      router.push(`/settings/${id}`);
    };

    const setTheme = (value) => {
      store.theme = value;
    };

    const contentLines = Vue.computed(() => {
      const lines = [];

      if (selectedCategory.value === 'appearance') {
        lines.push('== Appearance ==');
        lines.push('');
        lines.push(`Theme: ${store.theme === 'dark' ? '[Dark]*' : '[Dark]'} ${store.theme === 'light' ? '[Light]*' : '[Light]'}`);
        lines.push('');
        lines.push(`Contrast borders: ${store.contrast ? '[ON]' : '[OFF]'}`);
      } else if (selectedCategory.value === 'desktop') {
        lines.push('== Desktop ==');
        lines.push('');
        lines.push('Wallpaper:');
        const wpLine = store.wallpapers.map(wp =>
          store.wallpaper === wp.id ? `[${wp.id}]*` : `[${wp.id}]`
        ).join(' ');
        lines.push(wpLine);
      }

      return lines;
    });

    return { store, actions, categories, selectedCategory, selectedLabel, contentLines, menuSections, onSelect, setTheme };
  },
};
