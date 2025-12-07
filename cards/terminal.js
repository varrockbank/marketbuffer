// Terminal App Card - AI prompt box at bottom of screen
const terminalCard = {
  id: 'terminal',
  title: 'Terminal',
  isExpanded: false,

  // Terminal state
  history: [],
  historyIndex: -1,
  commandHistory: [],
  currentDir: '/home/user',

  // Fake filesystem for demo
  fileSystem: {
    '/': ['home', 'usr', 'etc', 'var'],
    '/home': ['user'],
    '/home/user': ['Documents', 'Desktop', '.bashrc'],
    '/home/user/Documents': ['notes.txt', 'todo.md'],
    '/home/user/Desktop': [],
    '/usr': ['bin', 'lib'],
    '/usr/bin': ['ls', 'cat', 'echo', 'pwd', 'cd', 'clear', 'help'],
    '/etc': ['hosts', 'passwd'],
    '/var': ['log']
  },

  styles: `
    #chat-panel {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 0;
      background-color: #7A68AA;
      border-left: 4px solid #83C18D;
      box-shadow: -4px 0 32px rgba(0, 0, 0, 0.2);
      z-index: 500;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: width 0.3s ease-in-out;
    }

    #chat-panel.expanded {
      width: 50%;
    }

    #chat-panel .terminal-output-drawer,
    #chat-panel .terminal-input-wrapper {
      opacity: 0;
      transition: opacity 0.15s ease-out;
    }

    #chat-panel.expanded .terminal-output-drawer,
    #chat-panel.expanded .terminal-input-wrapper {
      opacity: 1;
      transition: opacity 0.15s ease-in 0.15s;
    }

    #chat-panel,
    #chat-panel * {
      border-radius: 0 !important;
    }

    .terminal-output-drawer {
      flex: 1;
      overflow: hidden;
    }

    .terminal-output {
      height: 100%;
      overflow-y: auto;
      padding: 20px 24px 8px;
      font-family: 'SF Mono', Monaco, 'Courier New', monospace;
      font-size: 13px;
      color: #1a1a1a;
      white-space: pre-wrap;
      word-wrap: break-word;
      line-height: 1.5;
    }

    .terminal-output::-webkit-scrollbar {
      width: 6px;
    }

    .terminal-output::-webkit-scrollbar-track {
      background: transparent;
    }

    .terminal-output::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
    }

    .terminal-output .error {
      color: #ff6b6b;
    }

    .terminal-output .info {
      color: #74b9ff;
    }

    .terminal-output .success {
      color: #55efc4;
    }

    .terminal-output .ai-response {
      color: #a29bfe;
      border-left: 2px solid #a29bfe;
      padding-left: 12px;
      margin: 8px 0;
    }

    .terminal-input-wrapper {
      display: flex;
      align-items: center;
      padding: 14px 20px;
      gap: 12px;
      font-family: 'SF Mono', Monaco, 'Courier New', monospace;
      font-size: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      cursor: text;
      flex-shrink: 0;
    }

    .terminal-caret {
      color: rgba(0, 0, 0, 0.7);
      font-size: 16px;
      font-weight: 300;
      flex-shrink: 0;
    }

    .terminal-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: #1a1a1a;
      font-family: inherit;
      font-size: inherit;
      caret-color: #1a1a1a;
    }

    .terminal-input::placeholder {
      color: rgba(0, 0, 0, 0.6);
    }

    .terminal-input::selection {
      background: rgba(162, 155, 254, 0.3);
    }
  `,

  render() {
    return `
      <div class="terminal-output-drawer">
        <div class="terminal-output" id="terminal-output"></div>
      </div>
      <div class="terminal-input-wrapper">
        <span class="terminal-caret">&gt;</span>
        <input type="text" class="terminal-input" id="terminal-input" placeholder="Ask anything..." autocomplete="off" spellcheck="false">
      </div>
    `;
  },

  init(system) {
    this.history = [
      '<div class="ai-response">Hi! I\'m your AI assistant. Ask me anything or try commands like <span class="info">help</span>, <span class="info">ls</span>, or <span class="info">neofetch</span>.</div>'
    ];
    this.commandHistory = [];
    this.historyIndex = -1;
    this.currentDir = '/home/user';
    this.updateOutput();
  },

  expand() {
    const box = document.getElementById('chat-panel');
    if (box && !this.isExpanded) {
      this.isExpanded = true;
      box.classList.add('expanded');
      document.body.classList.add('terminal-active');
    }
  },

  collapse() {
    const box = document.getElementById('chat-panel');
    if (box && this.isExpanded) {
      this.isExpanded = false;
      box.classList.remove('expanded');
      document.body.classList.remove('terminal-active');
      const input = document.getElementById('terminal-input');
      if (input) input.blur();
    }
  },

  toggle() {
    if (this.isExpanded) {
      this.collapse();
    } else {
      this.expand();
      setTimeout(() => {
        const input = document.getElementById('terminal-input');
        if (input) input.focus();
      }, 50);
    }
  },

  print(text, className = '') {
    if (className) {
      this.history.push(`<span class="${className}">${text}</span>`);
    } else {
      this.history.push(text);
    }
    this.updateOutput();
  },

  updateOutput() {
    const output = document.getElementById('terminal-output');
    if (output) {
      output.innerHTML = this.history.join('\n');
      output.scrollTop = output.scrollHeight;
    }
  },

  updatePrompt() {
    // No longer needed for AI prompt style
  },

  executeCommand(cmd) {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    // Expand to show output
    this.expand();

    // Add user message to history
    this.history.push(`<span class="info">›</span> ${trimmed}`);

    // Add to command history
    this.commandHistory.push(trimmed);
    this.historyIndex = this.commandHistory.length;

    // Parse command
    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Check for system commands first
    switch (command) {
      case 'help':
        this.cmdHelp();
        break;
      case 'clear':
        this.cmdClear();
        break;
      case 'echo':
        this.cmdEcho(args);
        break;
      case 'pwd':
        this.cmdPwd();
        break;
      case 'ls':
        this.cmdLs(args);
        break;
      case 'cd':
        this.cmdCd(args);
        break;
      case 'cat':
        this.cmdCat(args);
        break;
      case 'whoami':
        this.print('user');
        break;
      case 'date':
        this.print(new Date().toString());
        break;
      case 'uname':
        this.print('MarketbufferOS 1.0.0 marketbuffer');
        break;
      case 'neofetch':
        this.cmdNeofetch();
        break;
      case 'exit':
      case 'close':
        this.collapse();
        break;
      default:
        // Treat as AI query
        this.handleAIQuery(trimmed);
    }

    this.updateOutput();
  },

  handleAIQuery(query) {
    // Simulated AI responses
    const responses = [
      "I'm a demo AI assistant in MarketbufferOS. In a real implementation, I would connect to an AI backend to answer your questions.",
      "This is a simulated response. Try commands like 'help', 'ls', 'neofetch', or ask me anything!",
      "I can help you navigate the system. Try 'ls' to list files or 'help' for available commands.",
      "As a demo, I can only provide simulated responses. Type 'help' to see what I can do.",
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];
    this.print(`<div class="ai-response">${response}</div>`);
  },

  cmdHelp() {
    this.print('<div class="ai-response">Available commands:\n' +
      '  help     - Show this help\n' +
      '  clear    - Clear output\n' +
      '  ls       - List directory\n' +
      '  cd       - Change directory\n' +
      '  cat      - View file\n' +
      '  pwd      - Current directory\n' +
      '  neofetch - System info\n' +
      '  exit     - Collapse terminal\n\n' +
      'Or just type a question to ask the AI!</div>');
  },

  cmdClear() {
    this.history = [];
    this.updateOutput();
  },

  cmdEcho(args) {
    this.print(args.join(' '));
  },

  cmdPwd() {
    this.print(this.currentDir);
  },

  cmdLs(args) {
    const target = args[0] ? this.resolvePath(args[0]) : this.currentDir;
    const contents = this.fileSystem[target];
    if (contents) {
      if (contents.length === 0) {
        this.print('<span class="info">(empty directory)</span>');
      } else {
        this.print(contents.join('  '));
      }
    } else {
      this.print(`ls: cannot access '${args[0] || target}': No such file or directory`, 'error');
    }
  },

  cmdCd(args) {
    if (!args[0] || args[0] === '~') {
      this.currentDir = '/home/user';
      return;
    }

    const target = this.resolvePath(args[0]);
    if (this.fileSystem[target]) {
      this.currentDir = target;
    } else {
      this.print(`cd: ${args[0]}: No such file or directory`, 'error');
    }
  },

  cmdCat(args) {
    if (!args[0]) {
      this.print('cat: missing file operand', 'error');
      return;
    }

    const fileName = args[0];
    const fileContents = {
      '.bashrc': '# ~/.bashrc\nexport PS1="user@marketbuffer:~$ "\nalias ll="ls -la"',
      'notes.txt': 'Remember to backup the system!\nAlso check the server logs.',
      'todo.md': '# TODO\n- [ ] Fix bugs\n- [x] Add terminal\n- [ ] World domination',
      'hosts': '127.0.0.1 localhost\n::1 localhost',
      'passwd': 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash'
    };

    if (fileContents[fileName]) {
      this.print(fileContents[fileName]);
    } else {
      this.print(`cat: ${fileName}: No such file or directory`, 'error');
    }
  },

  cmdNeofetch() {
    this.print('');
    this.print('  <span class="success">███╗   ███╗</span>  user@marketbuffer');
    this.print('  <span class="success">████╗ ████║</span>  ─────────────────');
    this.print('  <span class="success">██╔████╔██║</span>  OS: MarketbufferOS 1.0');
    this.print('  <span class="success">██║╚██╔╝██║</span>  Host: Web Browser');
    this.print('  <span class="success">██║ ╚═╝ ██║</span>  Kernel: JavaScript');
    this.print('  <span class="success">╚═╝     ╚═╝</span>  Shell: msh 1.0');
    this.print('                Memory: 8192K');
    this.print('');
  },

  resolvePath(path) {
    if (path.startsWith('/')) {
      return path;
    }
    if (path === '..') {
      const parts = this.currentDir.split('/').filter(Boolean);
      parts.pop();
      return '/' + parts.join('/') || '/';
    }
    if (path === '.') {
      return this.currentDir;
    }
    return this.currentDir === '/' ? '/' + path : this.currentDir + '/' + path;
  },

  handleClick(e) {
    // Click anywhere in the wrapper to focus input
    if (e.target.closest('.terminal-input-wrapper')) {
      const input = document.getElementById('terminal-input');
      if (input) input.focus();
    }
  },

  handleFocus() {
    this.expand();
  },

  handleKeydown(e) {
    const input = document.getElementById('terminal-input');
    if (!input) return;

    if (e.key === 'Enter') {
      this.executeCommand(input.value);
      input.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        input.value = this.commandHistory[this.historyIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++;
        input.value = this.commandHistory[this.historyIndex] || '';
      } else {
        this.historyIndex = this.commandHistory.length;
        input.value = '';
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      this.cmdClear();
      this.updateOutput();
    } else if (e.key === 'Escape') {
      this.collapse();
    }
  }
};
