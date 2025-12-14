import { DesignViewLayout } from '../design/DesignViewLayout.js';
import { ProjectSelector } from '../ProjectSelector.js';
import { DesignFileTree } from '../design/DesignFileTree.js';
import { store, actions } from '../../store.js';
import { useStyles } from '../../useStyles.js';
import { listFiles, loadFile } from '../../projectService.js';

const styles = `
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
  components: { DesignViewLayout, ProjectSelector, DesignFileTree },
  template: `
    <DesignViewLayout :collapsed="store.subSidenavCollapsed">
      <template #header>
        <ProjectSelector />
      </template>
      <template #menu>
        <div class="file-tree-container">
          <DesignFileTree
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
    </DesignViewLayout>
  `,
  setup() {
    useStyles('view-code-styles', styles);

    const route = VueRouter.useRoute();
    const files = Vue.ref([]);

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

    const lineCount = Vue.computed(() => {
      if (!store.activeFileContent) return 0;
      return store.activeFileContent.split('\n').length;
    });

    return {
      store,
      icons,
      files,
      lineCount,
      onFileSelect,
    };
  },
};
