const LS_KEY = 'oikaze-toggleMode';

let defaultMode = 'light';

if (
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
) {
  defaultMode = 'dark';
}

function toggleModeState() {
  let darkMode = defaultMode == 'dark';
  if (localStorage.getItem(LS_KEY)) {
    darkMode = localStorage.getItem(LS_KEY) == 'dark';
  }
  applyMode(darkMode ? 'dark' : 'light');
}

function applyMode(mode) {
  document.body.classList[mode === 'dark' ? 'add' : 'remove']('dark');
  document.body.setAttribute('data-theme-mode', mode);

  const toggleMode = document.getElementById('toggleMode');
  if (!!toggleMode) {
    toggleMode.checked = mode === 'dark';
  }
}

function applyTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
}

toggleModeState();

window.onload = function () {
  document.body.classList.remove('loading');
  document.body.classList.add('loaded');
  toggleModeState();

  toggleMode.addEventListener('click', function () {
    if (localStorage.getItem(LS_KEY) == 'dark') {
      localStorage.setItem(LS_KEY, 'light');
    } else {
      localStorage.setItem(LS_KEY, 'dark');
    }

    toggleModeState();
  });
};
