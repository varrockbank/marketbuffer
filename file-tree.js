// File Tree - Sidebar file browser for Marketbuffer
// This module handles the file tree data structure and rendering

const FileTree = {
  // File tree data structure
  data: {
    name: 'marketbuffer',
    type: 'folder',
    expanded: true,
    children: [
      {
        name: 'src',
        type: 'folder',
        expanded: true,
        children: [
          {
            name: 'components',
            type: 'folder',
            expanded: false,
            children: [
              { name: 'Button.js', type: 'file', path: 'demo/src/components/Button.js' },
              { name: 'Modal.js', type: 'file', path: 'demo/src/components/Modal.js' },
              { name: 'Sidebar.js', type: 'file', path: 'demo/src/components/Sidebar.js' },
            ],
          },
          {
            name: 'utils',
            type: 'folder',
            expanded: false,
            children: [
              { name: 'helpers.js', type: 'file', path: 'demo/src/utils/helpers.js' },
              { name: 'constants.js', type: 'file', path: 'demo/src/utils/constants.js' },
            ],
          },
          { name: 'index.js', type: 'file', path: 'demo/src/index.js' },
          { name: 'App.js', type: 'file', path: 'demo/src/App.js' },
        ],
      },
      {
        name: 'public',
        type: 'folder',
        expanded: false,
        children: [
          { name: 'index.html', type: 'file', path: 'demo/public/index.html' },
          { name: 'favicon.ico', type: 'file', path: 'demo/public/favicon.ico' },
        ],
      },
      {
        name: 'styles',
        type: 'folder',
        expanded: false,
        children: [
          { name: 'main.css', type: 'file', path: 'demo/styles/main.css' },
          { name: 'variables.css', type: 'file', path: 'demo/styles/variables.css' },
        ],
      },
      {
        name: 'algos',
        type: 'folder',
        expanded: true,
        children: [
          { name: 'random-walk.algo', type: 'file', path: 'demo/algos/random-walk.algo' },
          { name: 'last-close.algo', type: 'file', path: 'demo/algos/last-close.algo' },
        ],
      },
      { name: 'package.json', type: 'file', path: 'demo/package.json' },
      { name: 'README.md', type: 'file', path: 'demo/README.md' },
      { name: '.gitignore', type: 'file', path: 'demo/.gitignore' },
    ],
  },

  // Cache for loaded file contents (session memory)
  fileContentsCache: {},

  // Callbacks registered by index.html
  _callbacks: {
    getSystemState: null,
    saveSystemState: null,
  },

  // Register callbacks from index.html
  registerCallbacks(callbacks) {
    Object.assign(this._callbacks, callbacks);
  },

  // ============================================
  // Rendering
  // ============================================

  render() {
    // Load saved expansion state before rendering
    this.loadState();

    const container = document.getElementById('file-tree');
    // Render children of root folder directly (don't show root)
    let html = '';
    if (this.data.children) {
      this.data.children.forEach(child => {
        html += this.renderNode(child, 0);
      });
    }
    container.innerHTML = html;
    this.attachListeners();
  },

  renderNode(node, depth) {
    const isFolder = node.type === 'folder';
    const hasChildren = isFolder && node.children && node.children.length > 0;
    const toggleIcon = hasChildren ? (node.expanded ? '&#9660;' : '&#9654;') : '';
    const icon = isFolder ? '&#128193;' : '&#128196;';
    const expandedClass = node.expanded ? 'expanded' : '';
    const pathAttr = node.path ? `data-path="${node.path}"` : '';
    const isPinned = !isFolder && node.path && OS.isPinned(node.path);
    const pinClass = isPinned ? 'pinned' : '';
    const pinIcon = isPinned ? '&#128204;' : '&#128204;'; // pushpin icon

    let html = `
      <div class="tree-item" data-depth="${depth}" data-type="${node.type}" data-name="${node.name}" ${pathAttr}>
        <div class="tree-item-row">
          <span class="tree-toggle">${toggleIcon}</span>
          <span class="tree-icon">${icon}</span>
          <span class="tree-label">${node.name}</span>
          ${!isFolder && node.path ? `<span class="tree-pin ${pinClass}" data-path="${node.path}">${pinIcon}</span>` : ''}
        </div>
    `;

    if (hasChildren) {
      html += `<div class="tree-children ${expandedClass}">`;
      node.children.forEach(child => {
        html += this.renderNode(child, depth + 1);
      });
      html += '</div>';
    }

    html += '</div>';
    return html;
  },

  attachListeners() {
    document.querySelectorAll('.tree-item-row').forEach(row => {
      row.addEventListener('click', (e) => {
        // Handle pin button click
        if (e.target.classList.contains('tree-pin')) {
          e.stopPropagation();
          const path = e.target.dataset.path;
          if (path) {
            OS.togglePinFile(path);
          }
          return;
        }

        e.stopPropagation();
        const item = row.closest('.tree-item');
        const type = item.dataset.type;
        const name = item.dataset.name;
        const path = item.dataset.path;

        // Handle selection
        document.querySelectorAll('.tree-item-row.selected').forEach(el => {
          el.classList.remove('selected');
        });
        row.classList.add('selected');

        // Toggle folder expansion
        if (type === 'folder') {
          const children = item.querySelector('.tree-children');
          const toggle = row.querySelector('.tree-toggle');
          if (children) {
            const isExpanded = children.classList.toggle('expanded');
            toggle.innerHTML = isExpanded ? '&#9660;' : '&#9654;';
            // Update data model and save to localStorage
            this.updateNodeExpanded(this.data, name, isExpanded);
            this.saveState();
          }
        } else if (type === 'file' && path) {
          // Open file with appropriate app
          OS.openFile(path);
        }
      });
    });
  },

  // ============================================
  // Node operations
  // ============================================

  updateNodeExpanded(node, name, expanded) {
    if (node.name === name) {
      node.expanded = expanded;
      return true;
    }
    if (node.children) {
      for (const child of node.children) {
        if (this.updateNodeExpanded(child, name, expanded)) return true;
      }
    }
    return false;
  },

  // ============================================
  // State persistence
  // ============================================

  saveState() {
    const state = {};
    this.collectExpansionState(this.data, state);
    const systemState = this._callbacks.getSystemState ? this._callbacks.getSystemState() : null;
    if (systemState) {
      systemState.fileTree = state;
      if (this._callbacks.saveSystemState) {
        this._callbacks.saveSystemState();
      }
    }
  },

  collectExpansionState(node, state) {
    if (node.type === 'folder') {
      state[node.name] = node.expanded || false;
    }
    if (node.children) {
      node.children.forEach(child => this.collectExpansionState(child, state));
    }
  },

  loadState() {
    const systemState = this._callbacks.getSystemState ? this._callbacks.getSystemState() : null;
    if (systemState && systemState.fileTree && Object.keys(systemState.fileTree).length > 0) {
      this.applyExpansionState(this.data, systemState.fileTree);
    }
  },

  applyExpansionState(node, state) {
    if (node.type === 'folder' && state.hasOwnProperty(node.name)) {
      node.expanded = state[node.name];
    }
    if (node.children) {
      node.children.forEach(child => this.applyExpansionState(child, state));
    }
  },

  // ============================================
  // Utilities
  // ============================================

  highlightFile(filePath) {
    // Remove existing selection
    document.querySelectorAll('.tree-item-row.selected').forEach(el => {
      el.classList.remove('selected');
    });

    // Find and select the matching file
    const fileItem = document.querySelector(`.tree-item[data-path="${filePath}"]`);
    if (fileItem) {
      const row = fileItem.querySelector('.tree-item-row');
      if (row) {
        row.classList.add('selected');
      }
    }
  },

  // Get cached file contents
  getFileContents(path) {
    return this.fileContentsCache[path];
  },

  // Set cached file contents
  setFileContents(path, contents) {
    this.fileContentsCache[path] = contents;
  },
};

// Backward compatibility aliases
const fileTreeData = FileTree.data;
const fileContentsCache = FileTree.fileContentsCache;
function renderFileTree() { FileTree.render(); }
function highlightFileInTree(filePath) { FileTree.highlightFile(filePath); }
