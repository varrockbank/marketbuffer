import { store } from '../store.js';

export const ProjectSelector = {
  template: `
    <div class="project-selector">
      <div class="project-selector-trigger" @click="open = !open">
        <span class="project-selector-name">{{ store.currentProject }}</span>
        <svg class="project-selector-chevron" :class="{ open }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </div>
      <div class="project-selector-dropdown" v-if="open">
        <router-link
          v-for="project in projects"
          :key="project"
          :to="'/code/' + project"
          class="project-selector-item"
          :class="{ active: store.currentProject === project }"
          @click="open = false"
        >
          <svg v-if="store.currentProject === project" class="project-selector-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
          <span :style="{ marginLeft: store.currentProject === project ? '0' : '22px' }">{{ project }}</span>
        </router-link>
        <div class="project-selector-separator"></div>
        <div class="project-selector-item project-selector-new" @click="newProject">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"/><path d="M12 5v14"/>
          </svg>
          <span>New project</span>
        </div>
      </div>
    </div>
  `,
  setup() {
    const open = Vue.ref(false);
    const projects = ['marketbuffer-api', 'marketbuffer-web', 'prometheus', 'data-pipeline'];

    const newProject = () => {
      open.value = false;
      // TODO: Open new project dialog
    };

    return { store, open, projects, newProject };
  },
};
