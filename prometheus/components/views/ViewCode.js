import { KitViewLayout } from '../kit/KitViewLayout.js';
import { KitMenu } from '../kit/KitMenu.js';
import { KitMenuItem } from '../kit/KitMenuItem.js';
import { KitMenuSeparator } from '../kit/KitMenuSeparator.js';
import { KitButton } from '../kit/KitButton.js';
import { KitIcon } from '../kit/KitIcon.js';
import { KitFileTree } from '../kit/KitFileTree.js';
import { KitDrawer } from '../kit/KitDrawer.js';
import { KitTerminal } from '../kit/KitTerminal.js';
import { store, actions } from '../../store.js';
import { listProjects, listFiles, loadFile } from '../../lib/projectService.js';

export const ViewCode = {
  components: { KitViewLayout, KitMenu, KitMenuItem, KitMenuSeparator, KitButton, KitIcon, KitFileTree, KitDrawer, KitTerminal },
  template: `
    <div class="flex-1 flex flex-col overflow-hidden">
    <KitViewLayout :collapsed="store.subSidenavCollapsed">
      <template #header>
        <KitMenu direction="down">
          <template #trigger>
            <KitButton variant="sidebar" iconRight="chevronDown">{{ store.currentProject }}</KitButton>
          </template>
          <template #menu="{ close }">
            <KitMenuItem
              v-for="project in projects"
              :key="project"
              :to="'/code/' + project"
              :selected="store.currentProject === project"
              selectable
              @click="close"
            >
              <span>{{ project }}</span>
            </KitMenuItem>
            <KitMenuSeparator />
            <KitMenuItem icon="plus" variant="success" @click="newProject(close)">
              <span>New project</span>
            </KitMenuItem>
          </template>
        </KitMenu>
      </template>
      <template #menu>
        <div class="flex-1 overflow-y-auto">
          <KitFileTree
            :files="files"
            :activeFilePath="store.activeFilePath"
            @select="onFileSelect"
          />
        </div>
      </template>
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <template v-if="store.activeFileError">
          <div class="flex-1 flex flex-col items-center justify-start pt-[120px] gap-4 text-[var(--text-secondary)]">
            <span class="opacity-50"><KitIcon icon="fileX" :size="48" /></span>
            <div class="text-sm font-bold text-[var(--text-primary)]">{{ store.activeFile }}</div>
            <div class="text-xs">File not found</div>
          </div>
        </template>
        <template v-else-if="store.activeFile">
          <div class="flex-1 overflow-auto bg-[var(--bg-primary)]">
            <div v-if="store.fileLoading" class="flex-1 flex items-center justify-center text-[var(--text-secondary)] text-xs">
              Loading...
            </div>
            <div v-else class="flex min-h-full">
              <div class="shrink-0 py-3 px-2 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] text-right select-none font-mono text-xs leading-normal text-[var(--text-secondary)]">
                <div v-for="n in lineCount" :key="n">{{ n }}</div>
              </div>
              <div class="flex-1 py-3 px-4 font-mono text-xs leading-normal whitespace-pre overflow-x-auto text-[var(--text-primary)]">{{ store.activeFileContent }}</div>
            </div>
          </div>
        </template>
        <div v-else class="flex-1 flex flex-col items-center justify-start pt-[120px] gap-4 text-[var(--text-secondary)]">
          <span class="opacity-50"><KitIcon icon="folder" :size="48" /></span>
          <div class="text-sm font-bold text-[var(--text-primary)]">{{ store.currentProject }}</div>
          <div class="text-xs">Select a file from the tree to view its contents</div>
        </div>
      </div>
    </KitViewLayout>
    <KitDrawer title="Terminal" :expanded="store.terminalExpanded" @toggle="actions.toggleTerminal">
      <KitTerminal />
    </KitDrawer>
    </div>
  `,
  setup() {

    const route = VueRouter.useRoute();
    const files = Vue.ref([]);
    const projects = Vue.ref([]);

    // Load projects list
    Vue.onMounted(async () => {
      projects.value = await listProjects();
    });

    // Load files for current project
    const loadProjectFiles = async (project) => {
      if (project) {
        files.value = await listFiles(project);
      } else {
        files.value = [];
      }
    };

    // Update current project from route and clear active file when project changes
    Vue.watch(
      () => route.params.project,
      async (newProject, oldProject) => {
        if (newProject && newProject !== oldProject) {
          store.currentProject = newProject;
          // Clear active file when switching projects
          actions.clearActiveFile();
          // Load files for new project
          await loadProjectFiles(newProject);
        }
      },
      { immediate: true }
    );

    // Handle file selection
    const onFileSelect = async ({ name, path }) => {
      actions.setActiveFile(name, path);
      actions.setFileLoading(true);

      try {
        const content = await loadFile(store.currentProject, path);
        actions.setFileContent(content);
      } catch (error) {
        console.error('Failed to load file:', error);
        actions.setFileError(error.message);
      }
    };

    const newProject = (close) => {
      close();
      // TODO: Open new project dialog
    };

    const lineCount = Vue.computed(() => {
      if (!store.activeFileContent) return 0;
      return store.activeFileContent.split('\n').length;
    });

    return {
      store,
      actions,
      files,
      projects,
      lineCount,
      onFileSelect,
      newProject,
    };
  },
};
