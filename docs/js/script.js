const LS_KEY = 'oikaze-theme';

const DEFAULT_LIGHT = 'light';
const DEFAULT_DARK = 'dark';

let defaultMode = DEFAULT_LIGHT;

if (
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
) {
  defaultMode = DEFAULT_DARK;
}

function toggleModeState() {
  let darkMode = defaultMode == DEFAULT_DARK;
  if (localStorage.getItem(LS_KEY)) {
    darkMode = localStorage.getItem(LS_KEY) == DEFAULT_DARK;
  }
  applyTheme(darkMode ? DEFAULT_DARK : DEFAULT_LIGHT);
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
    if (localStorage.getItem(LS_KEY) == DEFAULT_DARK) {
      localStorage.setItem(LS_KEY, DEFAULT_LIGHT);
    } else {
      localStorage.setItem(LS_KEY, DEFAULT_DARK);
    }

    toggleModeState();
  });
};
