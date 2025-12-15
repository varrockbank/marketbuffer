import { store, actions, type2Apps } from '../../store.js';
import { KitViewLayout } from '../kit/KitViewLayout.js';
import { KitIcon } from '../kit/KitIcon.js';
import { useStyles } from '../../lib/useStyles.js';

const styles = `
.view-applications-list {
  padding: 4px 0;
}

.view-applications-list-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.1s ease-out;
}

.view-applications-list-item:hover {
  background: var(--bg-tertiary);
}

.view-applications-list-item.selected {
  background: var(--bg-tertiary);
}

.view-applications-list-item-icon {
  color: var(--text-secondary);
}

.view-applications-list-item.selected .view-applications-list-item-icon {
  color: var(--accent);
}

.view-applications-list-label {
  font-size: 12px;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.view-applications-detail-version {
  font-size: 11px;
  color: var(--text-secondary);
}

.view-applications-detail-actions {
  margin-top: 24px;
}

.view-applications-detail-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.view-applications-detail-header-icon {
  color: var(--accent);
}

.view-applications-detail-title {
  flex: 1;
}

.view-applications-detail-title .view-content-title {
  margin-bottom: 4px;
}

.view-applications-detail-btn {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 12px;
  cursor: pointer;
  transition: background 0.1s ease-out, border-color 0.1s ease-out;
}

.view-applications-detail-btn:hover {
  background: var(--bg-tertiary);
  border-color: var(--text-secondary);
}

.view-applications-detail-btn-primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.view-applications-detail-btn-primary:hover {
  background: #6a5a9a;
  border-color: #6a5a9a;
}
`;

export const ViewApplications = {
  components: { KitViewLayout, KitIcon },
  template: `
    <KitViewLayout :collapsed="store.subSidenavCollapsed">
      <template #menu>
        <div class="view-applications-list">
          <div
            v-for="app in type2Apps"
            :key="app.id"
            class="view-applications-list-item"
            :class="{ selected: selectedApp?.id === app.id }"
            @click="selectApp(app)"
          >
            <span class="view-applications-list-item-icon"><KitIcon :icon="app.icon" :size="16" /></span>
            <span class="view-applications-list-label">{{ app.label }}</span>
          </div>
        </div>
      </template>
      <div class="view-content-inner" v-if="selectedApp">
        <div class="view-applications-detail-header">
          <span class="view-applications-detail-header-icon"><KitIcon :icon="selectedApp.icon" :size="48" /></span>
          <div class="view-applications-detail-title">
            <h1 class="view-content-title">{{ selectedApp.label }}</h1>
            <span class="view-applications-detail-version">v{{ selectedApp.version }}</span>
          </div>
        </div>
        <p class="view-content-text">{{ selectedApp.description }}</p>
        <div class="view-applications-detail-actions">
          <button class="view-applications-detail-btn view-applications-detail-btn-primary" @click="launchApp">
            {{ isAppOpen ? 'Open' : 'Launch' }}
          </button>
        </div>
      </div>
      <div class="view-content-inner view-content-empty" v-else>
        <p>Select an application to view details</p>
      </div>
    </KitViewLayout>
  `,
  setup() {
    useStyles('view-applications', styles);

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
