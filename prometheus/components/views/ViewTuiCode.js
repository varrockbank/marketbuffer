import { KitTUIViewLayout } from '../kit/tui/KitTUIViewLayout.js';
import { store, actions } from '../../store.js';
import { listProjects, listFiles, loadFile } from '../../lib/projectService.js';

export const ViewTuiCode = {
  components: { KitTUIViewLayout },
  template: `
    <KitTUIViewLayout :collapsed="store.subSidenavCollapsed" :title="store.activeFile || store.currentProject">
      <template #menu>
        <div class="flex-1 overflow-y-auto">
          <div class="kit-tui-header">{{ store.currentProject }}</div>
          <div
            v-for="file in treeFiles"
            :key="file.path"
            class="kit-tui-menu-item pl-0 ml-[1ch] pr-0 gap-0 flex items-center cursor-pointer whitespace-pre"
            :class="store.activeFilePath === file.path ? 'active' : ''"
            @click="onFileSelect(file)"
          >
            <span class="inline-block" style="width: 2ch;">{{ store.activeFilePath === file.path ? '>' : '' }}</span>
            <span>{{ file.prefix }}</span>
            <span>{{ file.type === 'folder' ? file.name + '/' : file.name }}</span>
          </div>
        </div>
      </template>

      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <template v-if="store.activeFileError">
          <div>File not found: {{ store.activeFile }}</div>
        </template>
        <template v-else-if="store.activeFile">
          <div v-if="store.fileLoading">Loading...</div>
          <div v-else class="flex-1 overflow-auto">
            <div v-for="(line, idx) in lines" :key="idx" class="flex">
              <span class="shrink-0" style="width: 4ch; text-align: right; margin-right: 1ch;">{{ idx + 1 }}</span>
              <span class="flex-1 whitespace-pre">{{ line }}</span>
            </div>
          </div>
        </template>
        <div v-else>
          <div>{{ store.currentProject }}</div>
          <div>Select a file to view its contents</div>
        </div>
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

    const lines = Vue.computed(() => {
      if (!store.activeFileContent) return [];
      return store.activeFileContent.split('\n');
    });

    return {
      store,
      actions,
      files,
      projects,
      treeFiles,
      lines,
      onFileSelect,
    };
  },
};
