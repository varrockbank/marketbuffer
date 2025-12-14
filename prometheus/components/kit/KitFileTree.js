const icons = {
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
  folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  folderOpen: '<path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
};

export const KitFileTree = {
  name: 'KitFileTree',
  props: {
    files: { type: Array, default: () => [] },
    depth: { type: Number, default: 0 },
    parentPath: { type: String, default: '' },
    activeFilePath: { type: String, default: null },
  },
  emits: ['select'],
  template: `
    <div class="file-tree">
      <div
        v-for="file in files"
        :key="file.name"
        class="file-tree-item-wrapper"
      >
        <div
          class="file-tree-item"
          :class="{ active: activeFilePath === getFilePath(file) }"
          :style="{ paddingLeft: (depth * 12 + 8) + 'px' }"
          @click="handleClick(file)"
        >
          <svg
            v-if="file.type === 'folder'"
            class="file-tree-chevron"
            :class="{ open: isOpen(file.name) }"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            v-html="icons.chevron"
          ></svg>
          <span v-else class="file-tree-chevron-spacer"></span>
          <svg
            class="file-tree-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            v-html="getIcon(file)"
          ></svg>
          <span class="file-tree-name">{{ file.name }}</span>
        </div>
        <KitFileTree
          v-if="file.type === 'folder' && isOpen(file.name)"
          :files="file.children"
          :depth="depth + 1"
          :parentPath="getFilePath(file)"
          :activeFilePath="activeFilePath"
          @select="$emit('select', $event)"
        />
      </div>
    </div>
  `,
  setup(props, { emit }) {
    const openFolders = Vue.ref({});

    const isOpen = (name) => openFolders.value[name];

    const getFilePath = (file) => {
      if (props.parentPath) {
        return `${props.parentPath}/${file.name}`;
      }
      return file.name;
    };

    const handleClick = (file) => {
      if (file.type === 'folder') {
        openFolders.value[file.name] = !openFolders.value[file.name];
      } else {
        emit('select', {
          name: file.name,
          path: getFilePath(file),
        });
      }
    };

    const getIcon = (file) => {
      if (file.type === 'folder') {
        return isOpen(file.name) ? icons.folderOpen : icons.folder;
      }
      return icons.file;
    };

    return { icons, isOpen, handleClick, getIcon, getFilePath };
  },
};
