import { store, actions, isWindowOpen } from '../../store.js';
import { KitTUIViewLayout } from '../kit/tui/KitTUIViewLayout.js';

export const ViewTuiApplications = {
  components: { KitTUIViewLayout },
  template: `
    <KitTUIViewLayout :collapsed="store.subSidenavCollapsed" :title="selectedApp ? selectedApp.label : 'Applications'">
      <template #menu>
        <div class="flex-1 overflow-y-auto">
          <div class="kit-tui-header">Applications</div>
          <div
            v-for="app in store.type2Apps"
            :key="app.id"
            class="kit-tui-menu-item pl-0 ml-[1ch] pr-0 gap-0 flex items-center cursor-pointer"
            :class="selectedApp?.id === app.id ? 'active' : ''"
            @click="selectApp(app)"
          >
            <span class="inline-block" style="width: 2ch;">{{ selectedApp?.id === app.id ? '>' : '' }}</span>
            <span class="truncate">{{ app.label }}</span>
          </div>
        </div>
      </template>

      <div class="flex-1 flex flex-col min-w-0 overflow-hidden p-0">
        <template v-if="selectedApp">
          <div class="mb-1">{{ selectedApp.label }} v{{ selectedApp.version }}</div>
          <div class="mb-1">{{ selectedApp.description }}</div>
          <div class="mt-2">
            <span class="cursor-pointer" @click="launchApp">[{{ isWindowOpen(selectedApp.id) ? 'Open' : 'Launch' }}]</span>
          </div>
        </template>
        <template v-else>
          <div>Select an application to view details</div>
        </template>
      </div>
    </KitTUIViewLayout>
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
