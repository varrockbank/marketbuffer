import { store } from '../store.js';
import { DesignDropdownMenu } from './design/DesignDropdownMenu.js';
import { listProjects } from '../projectService.js';

export const ProjectSelector = {
  components: { DesignDropdownMenu },
  template: `
    <DesignDropdownMenu direction="down" ref="dropdown">
      <template #trigger>
        <div class="project-selector-trigger">
          <span class="project-selector-name">{{ store.currentProject }}</span>
          <svg class="project-selector-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </template>
      <template #menu="{ close }">
        <router-link
          v-for="project in projects"
          :key="project"
          :to="'/code/' + project"
          class="dropdown-menu-item"
          :class="{ active: store.currentProject === project }"
          @click="close"
        >
          <svg v-if="store.currentProject === project" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
          <span :style="{ marginLeft: store.currentProject === project ? '0' : '24px' }">{{ project }}</span>
        </router-link>
        <div class="dropdown-menu-separator"></div>
        <div class="dropdown-menu-item success" @click="newProject(close)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"/><path d="M12 5v14"/>
          </svg>
          <span>New project</span>
        </div>
      </template>
    </DesignDropdownMenu>
  `,
  setup() {
    const projects = Vue.ref([]);

    Vue.onMounted(async () => {
      projects.value = await listProjects();
    });

    const newProject = (close) => {
      close();
      // TODO: Open new project dialog
    };

    return { store, projects, newProject };
  },
};
