import { KitIcon } from './KitIcon.js';
import { useStyles } from '../../lib/useStyles.js';

const styles = `
.kit-tree-item {
  color: var(--text-secondary);
}

.kit-tree-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.kit-tree-item.active {
  background: var(--accent);
  color: #fff;
}

.kit-tree-chevron.open {
  transform: rotate(90deg);
}
`;

export const KitFileTree = {
  name: 'KitFileTree',
  components: { KitIcon },
  props: {
    files: { type: Array, default: () => [] },
    depth: { type: Number, default: 0 },
    parentPath: { type: String, default: '' },
    activeFilePath: { type: String, default: null },
  },
  emits: ['select'],
  template: `
    <div class="kit-tree">
      <div
        v-for="file in files"
        :key="file.name"
        class="kit-tree-item-wrapper"
      >
        <div
          class="kit-tree-item flex items-center gap-1 py-1 px-2 cursor-pointer rounded mx-1"
          :class="{ active: activeFilePath === getFilePath(file) }"
          :style="{ paddingLeft: (depth * 12 + 8) + 'px' }"
          @click="handleClick(file)"
        >
          <span v-if="file.type === 'folder'" class="kit-tree-chevron shrink-0 transition-transform duration-150" :class="{ open: isOpen(file.name) }">
            <KitIcon icon="chevronRight" :size="12" />
          </span>
          <span v-else class="w-3 shrink-0"></span>
          <span class="shrink-0">
            <KitIcon :icon="getIcon(file)" :size="14" />
          </span>
          <span class="truncate">{{ file.name }}</span>
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
    useStyles('kit-file-tree', styles);
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
        return isOpen(file.name) ? 'folderOpen' : 'folder';
      }
      return 'file';
    };

    return { isOpen, handleClick, getIcon, getFilePath };
  },
};
