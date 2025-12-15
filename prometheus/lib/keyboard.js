import { store, actions } from '../store.js';

const handleKeydown = (e) => {
  const mod = store.isMac ? e.metaKey : e.ctrlKey;
  if (!mod) return;

  if (e.shiftKey && e.key.toLowerCase() === 'f') {
    e.preventDefault();
    actions.toggleDistractionFree();
  } else if (e.shiftKey && e.key.toLowerCase() === 't') {
    e.preventDefault();
    actions.toggleTheme();
  } else if (e.shiftKey && e.key.toLowerCase() === 'c') {
    e.preventDefault();
    actions.toggleContrast();
  } else if (e.key.toLowerCase() === 'b') {
    e.preventDefault();
    actions.toggleSidenav();
  } else if (e.key.toLowerCase() === 'j') {
    e.preventDefault();
    actions.toggleSubSidenav();
  } else if (e.key === '`') {
    e.preventDefault();
    actions.toggleTerminal();
  }
};

export const initKeyboard = () => {
  window.addEventListener('keydown', handleKeydown);
};
