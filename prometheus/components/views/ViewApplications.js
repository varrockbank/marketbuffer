import { store, actions, type2Apps } from '../../store.js';
import { DesignViewLayout } from '../design/DesignViewLayout.js';
import { DesignIcon } from '../design/DesignIcon.js';

export const ViewApplications = {
  components: { DesignViewLayout, DesignIcon },
  template: `
    <DesignViewLayout :collapsed="store.subSidenavCollapsed">
      <template #menu>
        <div class="app-list">
          <div
            v-for="app in type2Apps"
            :key="app.id"
            class="app-list-item"
            :class="{ selected: selectedApp?.id === app.id }"
            @click="selectApp(app)"
          >
            <DesignIcon :icon="app.icon" class="app-list-icon" />
            <span class="app-list-label">{{ app.label }}</span>
          </div>
        </div>
      </template>
      <div class="view-content-inner" v-if="selectedApp">
        <div class="app-detail-header">
          <DesignIcon :icon="selectedApp.icon" :size="48" class="app-detail-icon" />
          <div class="app-detail-title">
            <h1 class="view-content-title">{{ selectedApp.label }}</h1>
            <span class="app-detail-version">v{{ selectedApp.version }}</span>
          </div>
        </div>
        <p class="view-content-text">{{ selectedApp.description }}</p>
        <div class="app-detail-actions">
          <button class="app-detail-btn app-detail-btn-primary" @click="launchApp">
            {{ isAppOpen ? 'Open' : 'Launch' }}
          </button>
        </div>
      </div>
      <div class="view-content-inner view-content-empty" v-else>
        <p>Select an application to view details</p>
      </div>
    </DesignViewLayout>
  `,
  setup() {
    const router = VueRouter.useRouter();
    const selectedApp = Vue.ref(type2Apps[0]);

    const selectApp = (app) => {
      selectedApp.value = app;
    };

    const isAppOpen = Vue.computed(() => {
      return selectedApp.value && store.openWindows.includes(selectedApp.value.id);
    });

    const launchApp = () => {
      if (selectedApp.value) {
        actions.openWindow(selectedApp.value.id);
        router.push('/');
      }
    };

    return { store, type2Apps, selectedApp, selectApp, isAppOpen, launchApp };
  },
};
