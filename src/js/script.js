const LS_KEY = 'oikaze-toggleMode';

let defaultMode = 'light';

if (
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
) {
  defaultMode = 'dark';
}

function toggleModeState() {
  const toggleMode = document.getElementById('toggleMode');

  let darkMode = defaultMode == 'dark';
  if (localStorage.getItem(LS_KEY)) {
    darkMode = localStorage.getItem(LS_KEY) == 'dark';
  }
  if (!!toggleMode) {
    toggleMode.checked = darkMode;
  }
  document.body.classList[darkMode ? 'add' : 'remove']('dark');
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
