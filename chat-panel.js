// Chat Panel - Slide-out chat drawer
const ChatPanel = {
  isExpanded: false,

  // Chat state
  history: [],
  historyIndex: -1,
  commandHistory: [],

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

    #chat-panel .chat-output-drawer,
    #chat-panel .chat-input-wrapper {
      opacity: 0;
      transition: opacity 0.15s ease-out;
    }

    #chat-panel.expanded .chat-output-drawer,
    #chat-panel.expanded .chat-input-wrapper {
      opacity: 1;
      transition: opacity 0.15s ease-in 0.15s;
    }

    #chat-panel,
    #chat-panel * {
      border-radius: 0 !important;
    }

    .chat-output-drawer {
      flex: 1;
      overflow: hidden;
    }

    .chat-output {
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

    .chat-output::-webkit-scrollbar {
      width: 6px;
    }

    .chat-output::-webkit-scrollbar-track {
      background: transparent;
    }

    .chat-output::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
    }

    .chat-output .error {
      color: #ff6b6b;
    }

    .chat-output .info {
      color: #74b9ff;
    }

    .chat-output .success {
      color: #55efc4;
    }

    .chat-output .ai-response {
      color: #1a1a1a;
      border-left: 2px solid rgba(0, 0, 0, 0.3);
      padding-left: 12px;
      margin: 8px 0;
    }

    .chat-input-wrapper {
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

    .chat-caret {
      color: rgba(0, 0, 0, 0.7);
      font-size: 16px;
      font-weight: 300;
      flex-shrink: 0;
    }

    .chat-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: #1a1a1a;
      font-family: inherit;
      font-size: inherit;
      caret-color: #1a1a1a;
    }

    .chat-input::placeholder {
      color: rgba(0, 0, 0, 0.6);
    }

    .chat-input::selection {
      background: rgba(162, 155, 254, 0.3);
    }
  `,

  render() {
    return `
      <div class="chat-output-drawer">
        <div class="chat-output" id="chat-output"></div>
      </div>
      <div class="chat-input-wrapper">
        <span class="chat-caret">&gt;</span>
        <input type="text" class="chat-input" id="chat-input" placeholder="Ask anything..." autocomplete="off" spellcheck="false">
      </div>
    `;
  },

  init() {
    // Inject styles
    const styleEl = document.createElement('style');
    styleEl.textContent = this.styles;
    document.head.appendChild(styleEl);

    // Create chat panel element
    const panelEl = document.createElement('div');
    panelEl.id = 'chat-panel';
    panelEl.innerHTML = this.render();
    document.getElementById('desktop').appendChild(panelEl);

    // Initialize state
    this.history = [
      '<div class="ai-response">Hi! I\'m your AI assistant. Ask me anything!</div>',
    ];
    this.commandHistory = [];
    this.historyIndex = -1;
    this.updateOutput();

    // Setup event listeners
    this.setupEventListeners(panelEl);
  },

  setupEventListeners(panelEl) {
    // Handle focus on input - expand panel
    const input = document.getElementById('chat-input');
    if (input) {
      input.addEventListener('focus', () => {
        this.expand();
      });
    }

    // Handle clicks in panel
    panelEl.addEventListener('click', (e) => {
      this.handleClick(e);
    });

    // Handle keyboard in panel
    panelEl.addEventListener('keydown', (e) => {
      this.handleKeydown(e);
    });

    // Global keyboard shortcut: Ctrl+` or Cmd+` to toggle
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        this.toggle();
      }
    });
  },

  expand() {
    const box = document.getElementById('chat-panel');
    if (box && !this.isExpanded) {
      this.isExpanded = true;
      box.classList.add('expanded');
    }
  },

  collapse() {
    const box = document.getElementById('chat-panel');
    if (box && this.isExpanded) {
      this.isExpanded = false;
      box.classList.remove('expanded');
      const input = document.getElementById('chat-input');
      if (input) input.blur();
    }
  },

  toggle() {
    if (this.isExpanded) {
      this.collapse();
    } else {
      this.expand();
      setTimeout(() => {
        const input = document.getElementById('chat-input');
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
    const output = document.getElementById('chat-output');
    if (output) {
      output.innerHTML = this.history.join('\n');
      output.scrollTop = output.scrollHeight;
    }
  },

  sendMessage(message) {
    const trimmed = message.trim();
    if (!trimmed) return;

    // Add user message to history
    this.history.push(`<span class="info">&gt;</span> ${trimmed}`);

    // Add to command history
    this.commandHistory.push(trimmed);
    this.historyIndex = this.commandHistory.length;

    // Handle message
    if (trimmed.toLowerCase() === 'clear') {
      this.history = [];
    } else if (trimmed.toLowerCase() === 'exit' || trimmed.toLowerCase() === 'close') {
      this.collapse();
    } else {
      // Simulated AI response
      this.handleAIQuery(trimmed);
    }

    this.updateOutput();
  },

  handleAIQuery(query) {
    const responses = [
      "I'm a demo AI assistant in MarketbufferOS. In a real implementation, I would connect to an AI backend to answer your questions.",
      "This is a simulated response. Ask me anything!",
      "I can help you with various tasks. What would you like to know?",
      "As a demo, I can only provide simulated responses.",
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];
    this.print(`<div class="ai-response">${response}</div>`);
  },

  handleClick(e) {
    // Click anywhere in the wrapper to focus input
    if (e.target.closest('.chat-input-wrapper')) {
      const input = document.getElementById('chat-input');
      if (input) input.focus();
    }
  },

  handleKeydown(e) {
    const input = document.getElementById('chat-input');
    if (!input) return;

    if (e.key === 'Enter') {
      this.sendMessage(input.value);
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
      this.history = [];
      this.updateOutput();
    } else if (e.key === 'Escape') {
      this.collapse();
    }
  },
};
