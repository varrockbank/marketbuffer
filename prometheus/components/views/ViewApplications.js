import { store, actions, type2Apps } from '../../store.js';
import { KitViewLayout } from '../kit/KitViewLayout.js';
import { KitIcon } from '../kit/KitIcon.js';
import { useStyles } from '../../useStyles.js';

// TODO(claude): all css selectors hsould be prefixed with view-applications-
const styles = `
.app-list {
  padding: 4px 0;
}

.app-list-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.1s ease-out;
}

.app-list-item:hover {
  background: var(--bg-tertiary);
}

.app-list-item.selected {
  background: var(--bg-tertiary);
}

.app-list-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--text-secondary);
}

.app-list-item.selected .app-list-icon {
  color: var(--accent);
}

.app-list-label {
  font-size: 12px;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-detail-version {
  font-size: 11px;
  color: var(--text-secondary);
}

.app-detail-actions {
  margin-top: 24px;
}
.app-detail-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.app-detail-icon {
  width: 48px;
  height: 48px;
  color: var(--accent);
  flex-shrink: 0;
}

.app-detail-title {
  flex: 1;
}

.app-detail-title .window-content-title {
  margin-bottom: 4px;
}
.app-detail-btn {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 12px;
  cursor: pointer;
  transition: background 0.1s ease-out, border-color 0.1s ease-out;
}

.app-detail-btn:hover {
  background: var(--bg-tertiary);
  border-color: var(--text-secondary);
}

.app-detail-btn-primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.app-detail-btn-primary:hover {
  background: #6a5a9a;
  border-color: #6a5a9a;
}
`;

export const ViewApplications = {
  components: { KitViewLayout, KitIcon },
  template: `
    <KitViewLayout :collapsed="store.subSidenavCollapsed">
      <template #menu>
        <div class="app-list">
          <div
            v-for="app in type2Apps"
            :key="app.id"
            class="app-list-item"
            :class="{ selected: selectedApp?.id === app.id }"
            @click="selectApp(app)"
          >
            <KitIcon :icon="app.icon" class="app-list-icon" />
            <span class="app-list-label">{{ app.label }}</span>
          </div>
        </div>
      </template>
      <div class="view-content-inner" v-if="selectedApp">
        <div class="app-detail-header">
          <KitIcon :icon="selectedApp.icon" :size="48" class="app-detail-icon" />
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
