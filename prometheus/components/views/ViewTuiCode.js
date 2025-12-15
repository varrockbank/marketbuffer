import { KitTUIViewLayout } from '../kit/tui/KitTUIViewLayout.js';
import { KitTUIVbufViewSidenav } from '../kit/tui/KitTUIVbufViewSidenav.js';
import { KitTUIVbufContent } from '../kit/tui/KitTUIVbufContent.js';
import { store, actions } from '../../store.js';
import { listProjects, listFiles, loadFile } from '../../lib/projectService.js';

export const ViewTuiCode = {
  components: { KitTUIViewLayout, KitTUIVbufViewSidenav, KitTUIVbufContent },
  template: `
    <KitTUIViewLayout :collapsed="store.subSidenavCollapsed || store.distractionFree" :title="store.activeFile || store.currentProject">
      <template #menu>
        <KitTUIVbufViewSidenav
          :sections="menuSections"
          :activeId="store.activeFilePath"
          :borderless="!store.contrast"
          @select="onMenuSelect"
        />
      </template>

      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <KitTUIVbufContent :lines="contentLines" :showGutter="!!store.activeFile" />
      </div>
    </KitTUIViewLayout>
  `,
  setup() {
    const route = VueRouter.useRoute();
    const files = Vue.ref([]);
    const projects = Vue.ref([]);

    Vue.onMounted(async () => {
      projects.value = await listProjects();
    });

    const loadProjectFiles = async (project) => {
      if (project) {
        files.value = await listFiles(project);
      } else {
        files.value = [];
      }
    };

    Vue.watch(
      () => route.params.project,
      async (newProject, oldProject) => {
        if (newProject && newProject !== oldProject) {
          store.currentProject = newProject;
          actions.clearActiveFile();
          await loadProjectFiles(newProject);
        }
      },
      { immediate: true }
    );

    // Build ASCII tree with proper prefixes
    const treeFiles = Vue.computed(() => {
      const result = [];

      const buildTree = (items, prefix = '', isLast = []) => {
        items.forEach((item, index) => {
          const isLastItem = index === items.length - 1;
          const connector = isLastItem ? '└── ' : '├── ';
          const linePrefix = prefix + connector;

          result.push({
            ...item,
            path: item.path || item.name,
            prefix: linePrefix,
          });

          if (item.children && item.children.length > 0) {
            const newPrefix = prefix + (isLastItem ? '    ' : '│   ');
            buildTree(item.children, newPrefix, [...isLast, isLastItem]);
          }
        });
      };

      buildTree(files.value);
      return result;
    });

    // Build menu sections for vbuf sidenav
    const menuSections = Vue.computed(() => [
      {
        header: store.currentProject,
        items: treeFiles.value.map(f => ({
          id: f.path,
          label: f.type === 'folder' ? f.name + '/' : f.name,
          prefix: f.prefix,
        })),
      },
    ]);

    const onFileSelect = async (file) => {
      if (file.type === 'folder') return;
      actions.setActiveFile(file.name, file.path);
      actions.setFileLoading(true);

      try {
        const content = await loadFile(store.currentProject, file.path);
        actions.setFileContent(content);
      } catch (error) {
        console.error('Failed to load file:', error);
        actions.setFileError(error.message);
      }
    };

    const onMenuSelect = (id) => {
      const file = treeFiles.value.find(f => f.path === id);
      if (file) {
        onFileSelect(file);
      }
    };

    const contentLines = Vue.computed(() => {
      if (store.activeFileError) {
        return [`File not found: ${store.activeFile}`];
      }

      if (store.activeFile) {
        if (store.fileLoading) {
          return ['Loading...'];
        }
        if (store.activeFileContent) {
          return store.activeFileContent.split('\n');
        }
        return [];
      }

      return [
        store.currentProject,
        '',
        'Select a file to view its contents',
      ];
    });

    return {
      store,
      actions,
      files,
      projects,
      treeFiles,
      menuSections,
      contentLines,
      onFileSelect,
      onMenuSelect,
    };
  },
};
