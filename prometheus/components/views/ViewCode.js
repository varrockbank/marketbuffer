import { KitViewLayout } from '../kit/KitViewLayout.js';
import { KitMenu } from '../kit/KitMenu.js';
import { KitMenuItem } from '../kit/KitMenuItem.js';
import { KitIcon } from '../kit/KitIcon.js';
import { KitFileTree } from '../kit/KitFileTree.js';
import { KitTerminal } from '../kit/KitTerminal.js';
import { store, actions } from '../../store.js';
import { useStyles } from '../../useStyles.js';
import { listProjects, listFiles, loadFile } from '../../projectService.js';

const styles = `
.project-selector-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  color: var(--text-primary);
  width: 100%;
}

.project-selector-trigger:hover {
  background: var(--bg-tertiary);
}

.project-selector-name {
  font-weight: 500;
}

.project-selector-chevron {
  width: 14px;
  height: 14px;
  color: var(--text-secondary);
}

.file-tree-container {
  flex: 1;
  overflow-y: auto;
}

.view-view-code-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.view-view-code-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.view-view-code-content {
  flex: 1;
  overflow: auto;
  background: var(--bg-primary);
}

.view-view-code-editor {
  display: flex;
  min-height: 100%;
}

.view-view-code-gutter {
  flex-shrink: 0;
  padding: 12px 8px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  text-align: right;
  user-select: none;
  font-family: 'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-secondary);
}

.view-view-code-lines {
  flex: 1;
  padding: 12px 16px;
  font-family: 'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre;
  overflow-x: auto;
  color: var(--text-primary);
}

.view-view-code-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 120px;
  gap: 16px;
  color: var(--text-secondary);
}

.view-view-code-empty-icon {
  width: 48px;
  height: 48px;
  opacity: 0.5;
}

.view-view-code-empty-title {
  font-size: 14px;
  font-weight: bold;
  color: var(--text-primary);
}

.view-view-code-empty-text {
  font-size: 12px;
}

.view-view-code-loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 12px;
}
`;

const icons = {
  folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  fileX: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m14.5 12.5-5 5"/><path d="m9.5 12.5 5 5"/>',
};

export const ViewCode = {
  components: { KitViewLayout, KitMenu, KitMenuItem, KitIcon, KitFileTree, KitTerminal },
  template: `
    <div class="view-view-code-wrapper">
    <KitViewLayout :collapsed="store.subSidenavCollapsed">
      <template #header>
        <KitMenu direction="down">
          <template #trigger>
            <div class="project-selector-trigger">
              <span class="project-selector-name">{{ store.currentProject }}</span>
              <KitIcon icon="chevronDown" class="project-selector-chevron" />
            </div>
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
            <div class="dropdown-menu-separator"></div>
            <KitMenuItem icon="plus" variant="success" @click="newProject(close)">
              <span>New project</span>
            </KitMenuItem>
          </template>
        </KitMenu>
      </template>
      <template #menu>
        <div class="file-tree-container">
          <KitFileTree
            :files="files"
            :activeFilePath="store.activeFilePath"
            @select="onFileSelect"
          />
        </div>
      </template>
      <div class="view-view-code-main">
        <template v-if="store.activeFileError">
          <div class="view-view-code-empty">
            <svg class="view-view-code-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" v-html="icons.fileX"></svg>
            <div class="view-view-code-empty-title">{{ store.activeFile }}</div>
            <div class="view-view-code-empty-text">File not found</div>
          </div>
        </template>
        <template v-else-if="store.activeFile">
          <div class="view-view-code-content">
            <div v-if="store.fileLoading" class="view-view-code-loading">
              Loading...
            </div>
            <div v-else class="view-view-code-editor">
              <div class="view-view-code-gutter">
                <div v-for="n in lineCount" :key="n">{{ n }}</div>
              </div>
              <div class="view-view-code-lines">{{ store.activeFileContent }}</div>
            </div>
          </div>
        </template>
        <div v-else class="view-view-code-empty">
          <svg class="view-view-code-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" v-html="icons.folder"></svg>
          <div class="view-view-code-empty-title">{{ store.currentProject }}</div>
          <div class="view-view-code-empty-text">Select a file from the tree to view its contents</div>
        </div>
      </div>
    </KitViewLayout>
    <KitTerminal />
    </div>
  `,
  setup() {
    useStyles('view-code-styles', styles);

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
      icons,
      files,
      projects,
      lineCount,
      onFileSelect,
      newProject,
    };
  },
};
