import { store, actions, isWindowOpen } from '../../store.js';
import { KitViewLayout } from '../kit/KitViewLayout.js';
import { KitIcon } from '../kit/KitIcon.js';

export const ViewApplications = {
  components: { KitViewLayout, KitIcon },
  template: `
    <KitViewLayout :collapsed="store.subSidenavCollapsed">
      <template #menu>
        <div class="py-1">
          <div
            v-for="app in store.type2Apps"
            :key="app.id"
            class="flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors hover:bg-[var(--bg-tertiary)]"
            :class="{ 'bg-[var(--bg-tertiary)]': selectedApp?.id === app.id }"
            @click="selectApp(app)"
          >
            <span :class="selectedApp?.id === app.id ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'"><KitIcon :icon="app.icon" :size="16" /></span>
            <span class="text-xs text-[var(--text-primary)] truncate">{{ app.label }}</span>
          </div>
        </div>
      </template>
      <div class="p-6 max-w-[800px]" v-if="selectedApp">
        <div class="flex items-start gap-4 mb-4">
          <span class="text-[var(--accent)]"><KitIcon :icon="selectedApp.icon" :size="48" /></span>
          <div class="flex-1">
            <h1 class="text-2xl font-semibold mb-1 text-[var(--text-primary)]">{{ selectedApp.label }}</h1>
            <span class="text-[11px] text-[var(--text-secondary)]">v{{ selectedApp.version }}</span>
          </div>
        </div>
        <p class="leading-relaxed text-[var(--text-secondary)]">{{ selectedApp.description }}</p>
        <div class="mt-6">
          <button class="px-4 py-2 border border-[var(--accent)] rounded bg-[var(--accent)] text-white text-xs cursor-pointer transition-colors hover:bg-[#6a5a9a] hover:border-[#6a5a9a]" @click="launchApp">
            {{ isWindowOpen(selectedApp.id) ? 'Open' : 'Launch' }}
          </button>
        </div>
      </div>
      <div class="p-6 max-w-[800px] flex items-center justify-center h-full text-[var(--text-secondary)]" v-else>
        <p>Select an application to view details</p>
      </div>
    </KitViewLayout>
  `,
  setup() {

    const router = VueRouter.useRouter();
    const selectedApp = Vue.ref(store.type2Apps[0]);

    const selectApp = (app) => {
      selectedApp.value = app;
    };

    const launchApp = () => {
      if (selectedApp.value) {
        actions.openWindow(selectedApp.value.id);
        router.push('/');
      }
    };

    return { store, selectedApp, selectApp, isWindowOpen, launchApp };
  },
};
