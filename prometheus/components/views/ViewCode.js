import { KitViewLayout } from '../kit/KitViewLayout.js';
import { KitMenu } from '../kit/KitMenu.js';
import { KitMenuItem } from '../kit/KitMenuItem.js';
import { KitIcon } from '../kit/KitIcon.js';
import { KitFileTree } from '../kit/KitFileTree.js';
import { KitDrawer } from '../kit/KitDrawer.js';
import { KitTerminal } from '../kit/KitTerminal.js';
import { store, actions } from '../../store.js';
import { useStyles } from '../../lib/useStyles.js';
import { listProjects, listFiles, loadFile } from '../../lib/projectService.js';

const styles = `
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


export const ViewCode = {
  components: { KitViewLayout, KitMenu, KitMenuItem, KitIcon, KitFileTree, KitDrawer, KitTerminal },
  template: `
    <div class="view-view-code-wrapper">
    <KitViewLayout :collapsed="store.subSidenavCollapsed">
      <template #header>
        <KitMenu direction="down">
          <template #trigger>
            <div class="kit-menu-selector">
              <span class="kit-menu-selector-label">{{ store.currentProject }}</span>
              <span class="kit-menu-selector-chevron"><KitIcon icon="chevronDown" :size="14" /></span>
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
            <div class="kit-menu-separator"></div>
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
            <span class="view-view-code-empty-icon"><KitIcon icon="fileX" :size="48" /></span>
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
          <span class="view-view-code-empty-icon"><KitIcon icon="folder" :size="48" /></span>
          <div class="view-view-code-empty-title">{{ store.currentProject }}</div>
          <div class="view-view-code-empty-text">Select a file from the tree to view its contents</div>
        </div>
      </div>
    </KitViewLayout>
    <KitDrawer title="Terminal" :expanded="store.terminalExpanded" @toggle="actions.toggleTerminal">
      <KitTerminal />
    </KitDrawer>
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
      actions,
      files,
      projects,
      lineCount,
      onFileSelect,
      newProject,
    };
  },
};
