// Trinale App Card - Card game
const trinaleCard = {
  id: 'trinale',
  title: 'Trinale',
  draggable: true,
  closeable: true,
  zIndex: 106,
  top: 60,
  right: 150,
  width: 400,
  contextMenu: [
    { label: 'New Game', action: 'new-game' },
    { label: 'Close', action: 'close' },
  ],

  // Game state
  board: Array(9).fill(null),
  playerHand: [],
  cpuHand: [],
  playerTurn: true,
  selectedCard: null,
  gameOver: false,
  playerScore: 5,
  cpuScore: 5,

  // Card database (name, top, right, bottom, left)
  cardDatabase: [
    { name: 'Goblin', stats: [1, 4, 4, 1], color: 'blue' },
    { name: 'Bomb', stats: [2, 3, 1, 4], color: 'blue' },
    { name: 'Cactuar', stats: [6, 2, 6, 3], color: 'blue' },
    { name: 'Chocobo', stats: [4, 1, 3, 5], color: 'blue' },
    { name: 'Moogle', stats: [5, 3, 2, 4], color: 'blue' },
    { name: 'Tonberry', stats: [3, 6, 4, 2], color: 'blue' },
    { name: 'Malboro', stats: [7, 2, 7, 1], color: 'blue' },
    { name: 'Iron Giant', stats: [6, 5, 5, 6], color: 'blue' },
    { name: 'Behemoth', stats: [3, 5, 1, 7], color: 'blue' },
    { name: 'Dragon', stats: [6, 2, 3, 7], color: 'blue' },
  ],

  content() {
    return `
    <div class="tt-wrapper">
      <div class="tt-hand tt-hand-cpu" id="tt-cpu-hand"></div>
      <div class="tt-board" id="tt-board"></div>
      <div class="tt-hand tt-hand-player" id="tt-player-hand"></div>
      <div class="tt-status" id="tt-status">Your turn - select a card</div>
    </div>
  `;
  },

  styles: `
    .tt-wrapper {
      padding: 12px;
      background: var(--window-bg);
      min-height: 320px;
      font-family: Chicago, "Geneva", system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    .tt-score {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 12px;
      font-weight: bold;
      color: var(--text-color);
    }

    .tt-score-player {
      color: var(--text-color);
    }

    .tt-score-cpu {
      color: var(--text-color);
    }

    .tt-hand-cpu {
      display: flex;
      flex-direction: row;
      gap: 4px;
      justify-content: center;
      margin-bottom: 8px;
    }

    .tt-hand-player {
      display: flex;
      flex-direction: row;
      gap: 4px;
      justify-content: center;
      margin-top: 8px;
    }

    .tt-board {
      display: grid;
      grid-template-columns: repeat(3, 60px);
      grid-template-rows: repeat(3, 70px);
      gap: 0;
      background: var(--window-bg);
      border: 2px dashed var(--text-color);
      padding: 0;
      margin: 0 auto;
    }

    .tt-cell {
      background: var(--window-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-right: 1px dashed var(--text-color);
      border-bottom: 1px dashed var(--text-color);
    }

    .tt-cell:nth-child(3n) {
      border-right: none;
    }

    .tt-cell:nth-child(n+7) {
      border-bottom: none;
    }

    .tt-cell:hover:empty {
      background: var(--window-border);
    }

    .tt-card {
      width: 50px;
      height: 60px;
      border-radius: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      cursor: pointer;
      position: relative;
      border: 2px solid var(--text-color);
      font-family: Chicago, Geneva, monospace;
      transition: transform 0.3s ease;
      transform-style: preserve-3d;
    }

    .tt-card.flipping {
      animation: tt-flip 0.5s ease-in-out;
    }

    @keyframes tt-flip {
      0% { transform: rotateY(0deg); }
      50% { transform: rotateY(90deg); }
      100% { transform: rotateY(0deg); }
    }

    .tt-card.blue {
      background: var(--window-bg);
      color: var(--text-color);
    }

    .tt-card.red {
      background: var(--text-color);
      color: var(--window-bg);
    }

    .tt-card.facedown {
      background: var(--text-color);
      border-color: var(--text-color);
    }

    .tt-card.facedown .tt-card-stats,
    .tt-card.facedown .tt-card-name {
      display: none;
    }

    .tt-card.selected {
      box-shadow: 0 0 0 2px var(--window-bg), 0 0 0 4px var(--text-color);
    }

    .tt-card-stats {
      display: grid;
      grid-template-areas:
        ". t ."
        "l . r"
        ". b .";
      grid-template-columns: 12px 12px 12px;
      grid-template-rows: 12px 12px 12px;
      font-weight: bold;
      font-size: 10px;
    }

    .tt-card-stats .t { grid-area: t; text-align: center; }
    .tt-card-stats .r { grid-area: r; text-align: center; }
    .tt-card-stats .b { grid-area: b; text-align: center; }
    .tt-card-stats .l { grid-area: l; text-align: center; }

    .tt-card-name {
      font-size: 7px;
      margin-top: 2px;
      text-align: center;
      max-width: 46px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .tt-card-mini {
      width: 56px;
      height: 66px;
    }

    .tt-status {
      margin-top: 8px;
      font-size: 11px;
      text-align: center;
      color: var(--text-color);
    }

    .tt-hand-cpu .tt-card {
      cursor: default;
    }

    .tt-coin-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }

    .tt-coin {
      width: 48px;
      height: 48px;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: bold;
      font-family: Chicago, Geneva, monospace;
      color: #8b7500;
      animation: tt-coin-flip 1s ease-in-out;
      transform-style: preserve-3d;
      image-rendering: pixelated;
      position: relative;
    }

    .tt-coin::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect fill='%23ffd700' x='16' y='0' width='16' height='4'/%3E%3Crect fill='%23ffd700' x='8' y='4' width='8' height='4'/%3E%3Crect fill='%23ffd700' x='32' y='4' width='8' height='4'/%3E%3Crect fill='%23ffd700' x='4' y='8' width='4' height='8'/%3E%3Crect fill='%23ffd700' x='40' y='8' width='4' height='8'/%3E%3Crect fill='%23ffd700' x='0' y='16' width='4' height='16'/%3E%3Crect fill='%23ffd700' x='44' y='16' width='4' height='16'/%3E%3Crect fill='%23ffd700' x='4' y='32' width='4' height='8'/%3E%3Crect fill='%23ffd700' x='40' y='32' width='4' height='8'/%3E%3Crect fill='%23ffd700' x='8' y='40' width='8' height='4'/%3E%3Crect fill='%23ffd700' x='32' y='40' width='8' height='4'/%3E%3Crect fill='%23ffd700' x='16' y='44' width='16' height='4'/%3E%3Crect fill='%23ffd700' x='8' y='8' width='32' height='32'/%3E%3Crect fill='%23000' x='12' y='0' width='4' height='4'/%3E%3Crect fill='%23000' x='32' y='0' width='4' height='4'/%3E%3Crect fill='%23000' x='4' y='4' width='4' height='4'/%3E%3Crect fill='%23000' x='40' y='4' width='4' height='4'/%3E%3Crect fill='%23000' x='0' y='12' width='4' height='4'/%3E%3Crect fill='%23000' x='44' y='12' width='4' height='4'/%3E%3Crect fill='%23000' x='0' y='32' width='4' height='4'/%3E%3Crect fill='%23000' x='44' y='32' width='4' height='4'/%3E%3Crect fill='%23000' x='4' y='40' width='4' height='4'/%3E%3Crect fill='%23000' x='40' y='40' width='4' height='4'/%3E%3Crect fill='%23000' x='12' y='44' width='4' height='4'/%3E%3Crect fill='%23000' x='32' y='44' width='4' height='4'/%3E%3C/svg%3E");
      background-size: 48px 48px;
      image-rendering: pixelated;
      z-index: -1;
    }

    @keyframes tt-coin-flip {
      0% { transform: rotateX(0deg); }
      25% { transform: rotateX(720deg); }
      50% { transform: rotateX(1440deg); }
      75% { transform: rotateX(2160deg); }
      100% { transform: rotateX(2880deg); }
    }

    .tt-coin-result {
      margin-top: 12px;
      font-size: 14px;
      color: #fff;
      font-weight: bold;
    }
  `,

  createCardHtml(card, mini = false, facedown = false) {
    const colorClass = card.owner === 'cpu' ? 'red' : 'blue';
    const facedownClass = facedown ? 'facedown' : '';
    return `
      <div class="tt-card ${colorClass} ${mini ? 'tt-card-mini' : ''} ${facedownClass}" data-card-id="${card.id}">
        <div class="tt-card-stats">
          <span class="t">${card.stats[0]}</span>
          <span class="l">${card.stats[3]}</span>
          <span class="r">${card.stats[1]}</span>
          <span class="b">${card.stats[2]}</span>
        </div>
        <div class="tt-card-name">${card.name}</div>
      </div>
    `;
  },

  shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  dealCards() {
    const shuffled = this.shuffleArray(this.cardDatabase);
    this.playerHand = shuffled.slice(0, 5).map((c, i) => ({
      ...c,
      id: 'p' + i,
      owner: 'player',
    }));
    this.cpuHand = shuffled.slice(5, 10).map((c, i) => ({
      ...c,
      id: 'c' + i,
      owner: 'cpu',
    }));
  },

  renderBoard() {
    const boardEl = document.getElementById('tt-board');
    if (!boardEl) return;

    boardEl.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.className = 'tt-cell';
      cell.dataset.index = i;
      if (this.board[i]) {
        cell.innerHTML = this.createCardHtml(this.board[i], true);
      }
      boardEl.appendChild(cell);
    }
  },

  renderHands() {
    const playerHandEl = document.getElementById('tt-player-hand');
    const cpuHandEl = document.getElementById('tt-cpu-hand');

    if (playerHandEl) {
      playerHandEl.innerHTML = this.playerHand
        .map(c => this.createCardHtml(c))
        .join('');

      // Highlight selected
      if (this.selectedCard) {
        const sel = playerHandEl.querySelector(`[data-card-id="${this.selectedCard.id}"]`);
        if (sel) sel.classList.add('selected');
      }
    }

    if (cpuHandEl) {
      cpuHandEl.innerHTML = this.cpuHand
        .map(c => this.createCardHtml(c, false, true))
        .join('');
    }
  },

  updateScore() {
    let player = 0;
    let cpu = 0;

    // Count cards on board
    this.board.forEach(card => {
      if (card) {
        if (card.owner === 'player') player++;
        else cpu++;
      }
    });

    // Add cards in hand
    player += this.playerHand.length;
    cpu += this.cpuHand.length;

    this.playerScore = player;
    this.cpuScore = cpu;

    const playerScoreEl = document.getElementById('tt-player-score');
    const cpuScoreEl = document.getElementById('tt-cpu-score');
    if (playerScoreEl) playerScoreEl.textContent = player;
    if (cpuScoreEl) cpuScoreEl.textContent = cpu;
  },

  setStatus(msg) {
    const statusEl = document.getElementById('tt-status');
    if (statusEl) statusEl.textContent = msg;
  },

  placeCard(card, index, owner) {
    // Remove from hand
    if (owner === 'player') {
      this.playerHand = this.playerHand.filter(c => c.id !== card.id);
    } else {
      this.cpuHand = this.cpuHand.filter(c => c.id !== card.id);
    }

    // Place on board
    this.board[index] = { ...card, owner };

    // Render board first
    this.renderBoard();
    this.renderHands();

    // Check and animate captures
    this.animateCaptures(index);

    this.updateScore();

    // Check game over
    if (this.board.every(c => c !== null)) {
      this.gameOver = true;
      if (this.playerScore > this.cpuScore) {
        this.setStatus('You win!');
      } else if (this.cpuScore > this.playerScore) {
        this.setStatus('CPU wins!');
      } else {
        this.setStatus('Draw!');
      }
      return;
    }

    // Switch turns
    this.playerTurn = !this.playerTurn;
    this.selectedCard = null;

    if (!this.playerTurn) {
      this.setStatus('CPU is thinking...');
      setTimeout(() => this.cpuTurn(), 800);
    } else {
      this.setStatus('Your turn - select a card');
    }
  },

  animateCaptures(index) {
    const card = this.board[index];
    const col = index % 3;
    const capturedIndices = [];

    // Directions: [deltaIndex, attackingStat, defendingStat]
    const checks = [
      { di: -3, atk: 0, def: 2 }, // top
      { di: 1, atk: 1, def: 3, cond: col < 2 }, // right
      { di: 3, atk: 2, def: 0 }, // bottom
      { di: -1, atk: 3, def: 1, cond: col > 0 }, // left
    ];

    checks.forEach(({ di, atk, def, cond }) => {
      if (cond === false) return;
      const ni = index + di;
      if (ni < 0 || ni > 8) return;

      const neighbor = this.board[ni];
      if (neighbor && neighbor.owner !== card.owner) {
        if (card.stats[atk] > neighbor.stats[def]) {
          capturedIndices.push(ni);
        }
      }
    });

    // Animate captured cards with flip
    if (capturedIndices.length > 0) {
      const self = this;
      capturedIndices.forEach(ni => {
        const cellEl = document.querySelector(`#tt-board .tt-cell:nth-child(${ni + 1}) .tt-card`);
        if (cellEl) {
          cellEl.classList.add('flipping');
          // Change color and update data at midpoint of flip
          setTimeout(() => {
            self.board[ni].owner = card.owner;
            cellEl.classList.remove('red', 'blue');
            cellEl.classList.add(card.owner === 'cpu' ? 'red' : 'blue');
          }, 250);
        }
      });
    }
  },

  cpuTurn() {
    if (this.gameOver || this.cpuHand.length === 0) return;

    // Simple AI: pick random card and random empty cell
    const emptyCells = this.board
      .map((c, i) => (c === null ? i : -1))
      .filter(i => i !== -1);

    const randomCard = this.cpuHand[Math.floor(Math.random() * this.cpuHand.length)];
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.placeCard(randomCard, randomCell, 'cpu');
  },

  newGame() {
    this.board = Array(9).fill(null);
    this.selectedCard = null;
    this.gameOver = false;
    this.dealCards();
    this.renderBoard();
    this.renderHands();
    this.updateScore();

    // Coin flip to determine who goes first
    const wrapper = document.querySelector('.tt-wrapper');
    const playerFirst = Math.random() < 0.5;

    // Create coin overlay
    const overlay = document.createElement('div');
    overlay.className = 'tt-coin-overlay';
    overlay.innerHTML = `
      <div class="tt-coin">?</div>
      <div class="tt-coin-result"></div>
    `;
    wrapper.appendChild(overlay);

    const self = this;
    const coin = overlay.querySelector('.tt-coin');
    const result = overlay.querySelector('.tt-coin-result');

    // Show result after flip animation
    setTimeout(() => {
      coin.textContent = playerFirst ? 'Y' : 'C';
      result.textContent = playerFirst ? 'You go first!' : 'CPU goes first!';
    }, 1000);

    // Remove overlay and start game
    setTimeout(() => {
      overlay.remove();
      self.playerTurn = playerFirst;
      if (playerFirst) {
        self.setStatus('Your turn - select a card');
      } else {
        self.setStatus('CPU is thinking...');
        setTimeout(() => self.cpuTurn(), 800);
      }
    }, 2000);
  },

  init(system) {
    const self = this;
    setTimeout(() => {
      self.newGame();
      // Add direct click listener
      const wrapper = document.querySelector('.tt-wrapper');
      if (wrapper) {
        wrapper.addEventListener('click', (e) => self.handleClick.call(self, e));
      }
    }, 0);
  },

  destroy() {
    // Nothing to cleanup
  },

  executeAction(action) {
    if (action === 'new-game') {
      this.newGame();
    }
  },

  handleClick(e) {
    if (this.gameOver) return;
    if (!this.playerTurn) return;

    // Click on player card to select
    const cardEl = e.target.closest('.tt-card');
    const inPlayerHand = cardEl?.closest('#tt-player-hand');
    if (cardEl && inPlayerHand) {
      const cardId = cardEl.dataset.cardId;
      const card = this.playerHand.find(c => c.id === cardId);
      if (card) {
        this.selectedCard = card;
        this.renderHands();
        this.setStatus('Now click a cell to place');
      }
      return;
    }

    // Click on cell to place
    const cellEl = e.target.closest('.tt-cell');
    if (cellEl && this.selectedCard) {
      const index = parseInt(cellEl.dataset.index);
      if (this.board[index] === null) {
        this.placeCard(this.selectedCard, index, 'player');
      }
    }
  },

  boot() {
    // Nothing to do on boot
  },
};
