// Neogotchi App Card - Virtual pet
const neogotchiCard = {
  id: 'neogotchi',
  title: 'Neogotchi',
  draggable: true,
  closeable: true,
  zIndex: 105,
  top: 100,
  right: 100,
  width: 280,
  contextMenu: [
    { label: 'Close', action: 'close' },
  ],

  // Pet state
  pet: {
    name: 'Tama',
    hunger: 50,
    happiness: 50,
    energy: 50,
    age: 0,
    alive: true,
  },

  // Animation frame
  frame: 0,
  intervalId: null,

  content() {
    return `
    <div class="tama-wrapper">
      <div class="tama-screen">
        <div class="tama-pet" id="tama-pet"></div>
        <div class="tama-status" id="tama-status"></div>
      </div>
      <div class="tama-stats">
        <div class="tama-stat">
          <span class="tama-stat-label">Hunger</span>
          <div class="tama-stat-bar"><div class="tama-stat-fill" id="tama-hunger"></div></div>
        </div>
        <div class="tama-stat">
          <span class="tama-stat-label">Happy</span>
          <div class="tama-stat-bar"><div class="tama-stat-fill" id="tama-happiness"></div></div>
        </div>
        <div class="tama-stat">
          <span class="tama-stat-label">Energy</span>
          <div class="tama-stat-bar"><div class="tama-stat-fill" id="tama-energy"></div></div>
        </div>
      </div>
      <div class="tama-buttons">
        <button class="tama-btn" id="tama-feed">Feed</button>
        <button class="tama-btn" id="tama-play">Play</button>
        <button class="tama-btn" id="tama-sleep">Sleep</button>
      </div>
      <div class="tama-age" id="tama-age">Age: 0</div>
    </div>
  `;
  },

  styles: `
    .tama-wrapper {
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .tama-screen {
      width: 120px;
      height: 100px;
      background: #9bbc0f;
      border: 3px solid #0f380f;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .tama-pet {
      font-size: 40px;
      line-height: 1;
      font-family: monospace;
    }

    .tama-status {
      font-size: 10px;
      color: #0f380f;
      margin-top: 4px;
    }

    .tama-stats {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .tama-stat {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tama-stat-label {
      font-size: 10px;
      width: 45px;
    }

    .tama-stat-bar {
      flex: 1;
      height: 10px;
      background: var(--window-border);
      border-radius: 5px;
      overflow: hidden;
    }

    .tama-stat-fill {
      height: 100%;
      background: #4a9;
      transition: width 0.3s ease;
    }

    .tama-buttons {
      display: flex;
      gap: 8px;
    }

    .tama-btn {
      background: var(--window-bg);
      border: 2px solid var(--window-border);
      border-radius: 6px;
      padding: 6px 12px;
      font-family: inherit;
      font-size: 11px;
      cursor: pointer;
      color: var(--text-color);
    }

    .tama-btn:hover {
      background: var(--text-color);
      color: var(--window-bg);
    }

    .tama-btn:active {
      transform: scale(0.95);
    }

    .tama-age {
      font-size: 10px;
      color: var(--text-muted);
    }

    .tama-dead .tama-screen {
      background: #666;
    }
  `,

  getPetFace() {
    if (!this.pet.alive) {
      return 'x_x';
    }
    if (this.pet.energy < 20) {
      return this.frame % 2 === 0 ? '-_-' : '-.-';
    }
    if (this.pet.hunger < 20) {
      return this.frame % 2 === 0 ? '>_<' : 'T_T';
    }
    if (this.pet.happiness < 20) {
      return this.frame % 2 === 0 ? 'u_u' : 'n_n';
    }
    if (this.pet.happiness > 80) {
      return this.frame % 2 === 0 ? '^_^' : '^o^';
    }
    return this.frame % 2 === 0 ? 'o_o' : 'o.o';
  },

  getStatus() {
    if (!this.pet.alive) return 'Goodbye...';
    if (this.pet.hunger < 20) return 'Hungry!';
    if (this.pet.energy < 20) return 'Sleepy...';
    if (this.pet.happiness < 20) return 'Sad...';
    if (this.pet.happiness > 80) return 'Happy!';
    return 'Content';
  },

  updateDisplay() {
    const petEl = document.getElementById('tama-pet');
    const statusEl = document.getElementById('tama-status');
    const hungerEl = document.getElementById('tama-hunger');
    const happinessEl = document.getElementById('tama-happiness');
    const energyEl = document.getElementById('tama-energy');
    const ageEl = document.getElementById('tama-age');

    if (petEl) petEl.textContent = this.getPetFace();
    if (statusEl) statusEl.textContent = this.getStatus();
    if (hungerEl) hungerEl.style.width = this.pet.hunger + '%';
    if (happinessEl) happinessEl.style.width = this.pet.happiness + '%';
    if (energyEl) energyEl.style.width = this.pet.energy + '%';
    if (ageEl) ageEl.textContent = 'Age: ' + this.pet.age;
  },

  tick() {
    if (!this.pet.alive) return;

    this.frame++;

    // Stats decay over time
    this.pet.hunger = Math.max(0, this.pet.hunger - 1);
    this.pet.happiness = Math.max(0, this.pet.happiness - 0.5);
    this.pet.energy = Math.max(0, this.pet.energy - 0.3);

    // Age increases
    if (this.frame % 10 === 0) {
      this.pet.age++;
    }

    // Check death
    if (this.pet.hunger <= 0 || this.pet.happiness <= 0 || this.pet.energy <= 0) {
      this.pet.alive = false;
      const wrapper = document.querySelector('.tama-wrapper');
      if (wrapper) wrapper.classList.add('tama-dead');
    }

    this.updateDisplay();
  },

  feed() {
    if (!this.pet.alive) return;
    this.pet.hunger = Math.min(100, this.pet.hunger + 20);
    this.pet.energy = Math.max(0, this.pet.energy - 5);
    this.updateDisplay();
  },

  play() {
    if (!this.pet.alive) return;
    this.pet.happiness = Math.min(100, this.pet.happiness + 20);
    this.pet.hunger = Math.max(0, this.pet.hunger - 10);
    this.pet.energy = Math.max(0, this.pet.energy - 15);
    this.updateDisplay();
  },

  sleep() {
    if (!this.pet.alive) return;
    this.pet.energy = Math.min(100, this.pet.energy + 30);
    this.pet.hunger = Math.max(0, this.pet.hunger - 5);
    this.updateDisplay();
  },

  reset() {
    this.pet = {
      name: 'Tama',
      hunger: 50,
      happiness: 50,
      energy: 50,
      age: 0,
      alive: true,
    };
    this.frame = 0;
    const wrapper = document.querySelector('.tama-wrapper');
    if (wrapper) wrapper.classList.remove('tama-dead');
    this.updateDisplay();
  },

  init(system) {
    setTimeout(() => {
      this.updateDisplay();
      this.intervalId = setInterval(() => this.tick(), 2000);
    }, 0);
  },

  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  },

  handleClick(e) {
    if (e.target.id === 'tama-feed') {
      this.feed();
    } else if (e.target.id === 'tama-play') {
      this.play();
    } else if (e.target.id === 'tama-sleep') {
      this.sleep();
    } else if (e.target.closest('.tama-screen') && !this.pet.alive) {
      this.reset();
    }
  },

  boot() {
    // Nothing to do on boot
  },
};
