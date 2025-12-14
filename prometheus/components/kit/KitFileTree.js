import { KitIcon } from './KitIcon.js';
import { useStyles } from '../../useStyles.js';

const styles = `
.file-tree-container {
  padding: 4px 0;
}

.file-tree-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  cursor: pointer;
  color: var(--text-secondary);
  border-radius: 4px;
  margin: 0 4px;
}

.file-tree-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.file-tree-item.active {
  background: var(--accent);
  color: #fff;
}

.file-tree-chevron {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  transition: transform 0.15s ease-out;
}

.file-tree-chevron.open {
  transform: rotate(90deg);
}

.file-tree-chevron-spacer {
  width: 12px;
  flex-shrink: 0;
}

.file-tree-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.file-tree-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
          <KitIcon
            v-if="file.type === 'folder'"
            icon="chevronRight"
            :size="16"
            class="file-tree-chevron"
            :class="{ open: isOpen(file.name) }"
          />
          <span v-else class="file-tree-chevron-spacer"></span>
          <KitIcon
            :icon="getIcon(file)"
            :size="16"
            class="file-tree-icon"
          />
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
