import { store } from '../store.js';
import { UserProfileMenu } from './UserProfileMenu.js';

export const UserProfile = {
  components: { UserProfileMenu },
  template: `
    <div class="sidenav-profile">
      <div class="sidenav-item" data-tooltip="Profile" @click="menuOpen = !menuOpen">
        <svg class="sidenav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="5"/>
          <path d="M20 21a8 8 0 0 0-16 0"/>
        </svg>
        <span class="sidenav-label">Profile</span>
      </div>
      <UserProfileMenu v-if="menuOpen" />
    </div>
  `,
  setup() {
    const menuOpen = Vue.ref(false);
    return { store, menuOpen };
  },
};
