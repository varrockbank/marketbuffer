import { store, actions } from '../../store.js';
import { ViewLayout } from '../ViewLayout.js';

// Type-2 apps
const apps = [
  {
    id: 'simulator',
    label: 'Perfect Liquidity Simulator',
    icon: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
    description: 'Practice trading with simulated market data. Test your strategies without risking real money.',
    version: '1.0.0',
  },
  {
    id: 'wallpaper',
    label: 'Desktop Wallpaper',
    icon: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    description: 'Customize your desktop background with various wallpapers and themes.',
    version: '1.0.0',
  },
];

export const ApplicationsView = {
  components: { ViewLayout },
  template: `
    <ViewLayout>
      <template #menu>
        <div class="app-list">
          <div
            v-for="app in apps"
            :key="app.id"
            class="app-list-item"
            :class="{ selected: selectedApp?.id === app.id }"
            @click="selectApp(app)"
          >
            <svg class="app-list-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="app.icon"></svg>
            <span class="app-list-label">{{ app.label }}</span>
          </div>
        </div>
      </template>
      <div class="view-content-inner" v-if="selectedApp">
        <div class="app-detail-header">
          <svg class="app-detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" v-html="selectedApp.icon"></svg>
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
    </ViewLayout>
  `,
  setup() {
    const router = VueRouter.useRouter();
    const selectedApp = Vue.ref(apps[0]);

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

    return { apps, selectedApp, selectApp, isAppOpen, launchApp };
  },
};
