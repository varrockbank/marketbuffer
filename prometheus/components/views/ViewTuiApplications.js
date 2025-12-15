import { store, actions, isWindowOpen } from '../../store.js';
import { KitTUIViewLayout } from '../kit/tui/KitTUIViewLayout.js';
import { KitTUIVbufViewSidenav } from '../kit/tui/KitTUIVbufViewSidenav.js';
import { KitTUIVbufContent } from '../kit/tui/KitTUIVbufContent.js';

export const ViewTuiApplications = {
  components: { KitTUIViewLayout, KitTUIVbufViewSidenav, KitTUIVbufContent },
  template: `
    <KitTUIViewLayout :collapsed="store.subSidenavCollapsed || store.distractionFree" :title="selectedApp ? selectedApp.label : 'Applications'">
      <template #menu>
        <KitTUIVbufViewSidenav
          :sections="menuSections"
          :activeId="selectedApp?.id"
          :borderless="!store.contrast"
          @select="onSelect"
        />
      </template>

      <div class="flex-1 flex flex-col min-w-0 overflow-hidden p-0">
        <KitTUIVbufContent :lines="contentLines" />
      </div>
    </KitTUIViewLayout>
  `,
  setup() {
    const router = VueRouter.useRouter();
    const route = VueRouter.useRoute();

    // Get selected app from route or default to first app
    const selectedAppId = Vue.computed(() => route.params.app || (store.type2Apps[0]?.id || ''));

    const selectedApp = Vue.computed(() => {
      return store.type2Apps.find(a => a.id === selectedAppId.value) || store.type2Apps[0];
    });

    const menuSections = Vue.computed(() => [
      { header: 'Applications', items: store.type2Apps.map(a => ({ id: a.id, label: a.label })) },
    ]);

    const onSelect = (id) => {
      router.push(`/applications/${id}`);
    };

    const launchApp = () => {
      if (selectedApp.value) {
        actions.openWindow(selectedApp.value.id);
        router.push('/');
      }
    };

    const contentLines = Vue.computed(() => {
      const lines = [];

      if (selectedApp.value) {
        lines.push(`${selectedApp.value.label} v${selectedApp.value.version}`);
        lines.push('');
        lines.push(selectedApp.value.description);
        lines.push('');
        lines.push(`[${isWindowOpen(selectedApp.value.id) ? 'Open' : 'Launch'}]`);
      } else {
        lines.push('Select an application to view details');
      }

      return lines;
    });

    return { store, selectedApp, contentLines, menuSections, onSelect, isWindowOpen, launchApp };
  },
};
