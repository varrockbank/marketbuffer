import { store } from '../store.js';
import { NavFooter } from './NavFooter.js';
import { DropdownMenu } from './DropdownMenu.js';
import { UserProfileMenu } from './UserProfileMenu.js';

export const UserProfile = {
  components: { NavFooter, DropdownMenu, UserProfileMenu },
  template: `
    <NavFooter>
      <DropdownMenu direction="up">
        <template #trigger>
          <div class="sidenav-item" data-tooltip="Profile">
            <svg class="sidenav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="8" r="5"/>
              <path d="M20 21a8 8 0 0 0-16 0"/>
            </svg>
            <span class="sidenav-label">Profile</span>
          </div>
        </template>
        <template #menu="{ close }">
          <UserProfileMenu @close="close" />
        </template>
      </DropdownMenu>
    </NavFooter>
  `,
  setup() {
    return { store };
  },
};
