// Git App Card - Self-contained application module
const gitCard = {
  id: 'git',
  title: 'Git',
  draggable: true,
  closeable: true,
  zIndex: 103,
  top: 60,
  right: 240,
  width: 700,
  contextMenu: [
    { label: 'Close', action: 'close' }
  ],

  // HTML content - function with no args, uses this
  content() {
    return `
    <div class="git-wrapper">
      <div class="git-content">
        <div class="git-sidebar">
          <div class="git-section">
            <div class="git-branch">
              <span class="git-branch-icon">&#9739;</span>
              <strong>main</strong>
            </div>
          </div>
          <div class="git-section">
            <div class="git-section-title">Staged</div>
            <div class="git-file-list">
              <div class="git-file-item" data-file="src/components/Button.js">
                <span class="git-file-status added">A</span>
                <span class="git-file-name">src/components/Button.js</span>
              </div>
            </div>
          </div>
          <div class="git-section">
            <div class="git-section-title">Changes</div>
            <div class="git-file-list">
              <div class="git-file-item selected" data-file="src/App.js">
                <span class="git-file-status modified">M</span>
                <span class="git-file-name">src/App.js</span>
              </div>
              <div class="git-file-item" data-file="styles/main.css">
                <span class="git-file-status modified">M</span>
                <span class="git-file-name">styles/main.css</span>
              </div>
              <div class="git-file-item" data-file="src/old-file.js">
                <span class="git-file-status deleted">D</span>
                <span class="git-file-name">src/old-file.js</span>
              </div>
            </div>
          </div>
        </div>
        <div class="git-diff-panel empty" id="git-diff-panel">
          Select a file to view changes
        </div>
      </div>
      <div class="git-bottom">
        <input type="text" class="git-commit-input" placeholder="Commit message...">
        <div class="git-bottom-actions">
          <button class="git-btn git-revert-btn">Revert</button>
          <button class="git-btn git-btn-primary git-commit-btn">Commit</button>
        </div>
      </div>
    </div>
  `;
  },

  // CSS styles for this app
  styles: `
    .git-wrapper {
      display: flex;
      flex-direction: column;
      height: 350px;
    }

    .git-content {
      padding: 0;
      background: var(--window-bg);
      display: flex;
      flex: 1;
      min-height: 0;
    }

    .git-bottom {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      border-top: 1px solid var(--window-border);
      background: var(--sidebar-bg);
    }

    .git-commit-input {
      flex: 1;
      padding: 4px 8px;
      font-family: inherit;
      font-size: 11px;
      border: 1px solid var(--window-border);
      background: var(--input-bg);
      color: var(--text-color);
    }

    .git-commit-input:focus {
      outline: none;
    }

    .git-bottom-actions {
      display: flex;
      gap: 6px;
    }

    .git-sidebar {
      width: 200px;
      border-right: 1px solid var(--window-border);
      overflow-y: auto;
      flex-shrink: 0;
    }

    .git-diff-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .git-diff-panel.empty {
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      font-size: 11px;
    }

    .diff-panel-header {
      padding: 6px 10px;
      border-bottom: 1px solid var(--window-border);
      font-size: 11px;
      font-weight: bold;
      background: var(--sidebar-bg);
      flex-shrink: 0;
    }

    .diff-panel-content {
      flex: 1;
      overflow-y: auto;
      font-family: Monaco, 'Courier New', monospace;
      font-size: 11px;
      background: var(--window-bg);
    }

    .diff-line {
      padding: 1px 8px;
      white-space: pre;
    }

    .diff-line.header {
      background: var(--diff-header-bg);
      color: var(--text-color);
      font-weight: bold;
    }

    .diff-line.added {
      background: var(--diff-added);
      color: var(--diff-added-text);
    }

    .diff-line.removed {
      background: var(--diff-removed);
      color: var(--diff-removed-text);
    }

    .diff-line.context {
      background: var(--window-bg);
      color: var(--text-color);
    }

    .diff-line-number {
      display: inline-block;
      width: 30px;
      text-align: right;
      margin-right: 8px;
      color: var(--text-muted);
      user-select: none;
    }

    .git-section {
      border-bottom: 1px solid var(--window-border);
      padding: 8px;
    }

    .git-section-title {
      font-weight: bold;
      font-size: 11px;
      margin-bottom: 6px;
    }

    .git-branch {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
    }

    .git-branch-icon {
      font-size: 14px;
    }

    .git-file-list {
      font-size: 11px;
    }

    .git-file-item {
      display: flex;
      align-items: center;
      padding: 3px 4px;
      gap: 6px;
      cursor: pointer;
    }

    .git-file-item:hover {
      background: var(--hover-bg);
    }

    .git-file-item.selected {
      background: var(--selected-bg);
    }

    .git-file-status {
      width: 14px;
      height: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: bold;
    }

    .git-file-status.modified { color: #b58900; }
    .git-file-status.added { color: #28a745; }
    .git-file-status.deleted { color: #dc3545; }

    .git-file-name {
      flex: 1;
      font-size: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .git-btn {
      background: var(--window-bg);
      border: 1px solid var(--window-border);
      padding: 3px 8px;
      font-family: inherit;
      font-size: 10px;
      cursor: pointer;
      color: var(--text-color);
    }

    .git-btn:hover {
      background: var(--text-color);
      color: var(--window-bg);
    }

    .git-btn-primary {
      background: var(--text-color);
      color: var(--window-bg);
    }

    .git-btn-primary:hover {
      background: var(--hover-bg);
      color: var(--text-color);
    }
  `,

  // Demo diff data
  diffData: {
    'src/App.js': {
      header: '@@ -10,6 +10,8 @@ import React from "react";',
      lines: [
        { type: 'context', num: 10, content: 'function App() {' },
        { type: 'context', num: 11, content: '  const [count, setCount] = useState(0);' },
        { type: 'removed', num: 12, content: '  const title = "Old Title";' },
        { type: 'added', num: 12, content: '  const title = "New Title";' },
        { type: 'added', num: 13, content: '  const subtitle = "Welcome";' },
        { type: 'context', num: 14, content: '' },
        { type: 'context', num: 15, content: '  return (' },
      ]
    },
    'styles/main.css': {
      header: '@@ -1,4 +1,6 @@',
      lines: [
        { type: 'context', num: 1, content: '.container {' },
        { type: 'removed', num: 2, content: '  padding: 10px;' },
        { type: 'added', num: 2, content: '  padding: 20px;' },
        { type: 'added', num: 3, content: '  margin: 0 auto;' },
        { type: 'context', num: 4, content: '}' },
      ]
    },
    'src/components/Button.js': {
      header: '@@ -0,0 +1,15 @@',
      lines: [
        { type: 'added', num: 1, content: 'import React from "react";' },
        { type: 'added', num: 2, content: '' },
        { type: 'added', num: 3, content: 'export function Button({ label, onClick }) {' },
        { type: 'added', num: 4, content: '  return (' },
        { type: 'added', num: 5, content: '    <button onClick={onClick}>' },
        { type: 'added', num: 6, content: '      {label}' },
        { type: 'added', num: 7, content: '    </button>' },
        { type: 'added', num: 8, content: '  );' },
        { type: 'added', num: 9, content: '}' },
      ]
    },
    'src/old-file.js': {
      header: '@@ -1,10 +0,0 @@',
      lines: [
        { type: 'removed', num: 1, content: '// This file is no longer needed' },
        { type: 'removed', num: 2, content: 'export const oldFunction = () => {' },
        { type: 'removed', num: 3, content: '  console.log("deprecated");' },
        { type: 'removed', num: 4, content: '};' },
      ]
    }
  },

  // Show diff viewer for a file
  showDiffViewer(filePath) {
    const panel = document.getElementById('git-diff-panel');
    if (!panel) return;

    const diff = this.diffData[filePath];
    if (!diff) {
      panel.className = 'git-diff-panel empty';
      panel.innerHTML = 'No diff available';
      return;
    }

    panel.className = 'git-diff-panel';
    let html = `<div class="diff-panel-header">${filePath}</div>`;
    html += '<div class="diff-panel-content">';
    html += `<div class="diff-line header">${diff.header}</div>`;

    for (const line of diff.lines) {
      const prefix = line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' ';
      html += `<div class="diff-line ${line.type}"><span class="diff-line-number">${line.num}</span>${prefix} ${line.content}</div>`;
    }

    html += '</div>';
    panel.innerHTML = html;
  },

  // Show UI alert (uses OS alert system)
  showAlert(message) {
    // This would call the OS alert system
    if (typeof showUIAlert === 'function') {
      showUIAlert(message);
    } else {
      alert(message);
    }
  },

  // Called when app window is opened - receives system object
  init(system) {
    this.attachFileHandlers();
    this.showDiffViewer('src/App.js');
  },

  // Called when app window is closed
  destroy() {
    // Cleanup if needed
  },

  // Attach click handlers to file items
  attachFileHandlers() {
    document.querySelectorAll('.git-file-item').forEach(item => {
      item.addEventListener('click', (e) => {
        // Remove selected from all
        document.querySelectorAll('.git-file-item').forEach(i => i.classList.remove('selected'));
        // Add selected to clicked
        item.classList.add('selected');
        // Show diff
        const filePath = item.dataset.file;
        if (filePath) {
          this.showDiffViewer(filePath);
        }
      });
    });
  },

  // Event handlers
  handleClick(e) {
    // Handle commit button
    if (e.target.closest('.git-commit-btn')) {
      this.showAlert('You do not have permissions to modify this repository.');
      return;
    }
    // Handle revert button
    if (e.target.closest('.git-revert-btn')) {
      this.showAlert('You do not have permissions to modify this repository.');
      return;
    }
    // Handle file item clicks
    const fileItem = e.target.closest('.git-file-item');
    if (fileItem) {
      document.querySelectorAll('.git-file-item').forEach(i => i.classList.remove('selected'));
      fileItem.classList.add('selected');
      const filePath = fileItem.dataset.file;
      if (filePath) {
        this.showDiffViewer(filePath);
      }
    }
  },

  // Boot - called once when OS starts
  boot() {
    // Nothing to do on boot
  }
};
