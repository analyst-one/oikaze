const LS_KEY = 'toggleMode';

function toggleModeState() {
  if (localStorage.getItem(LS_KEY) == '1') {
    toggleMode.checked = true;
  } else {
    localStorage.setItem(LS_KEY, '0');
    toggleMode.checked = false;
  }
}

toggleMode.addEventListener('click', function () {
  if (localStorage.getItem(LS_KEY) == '1') {
    localStorage.setItem(LS_KEY, '0');
  } else {
    localStorage.setItem(LS_KEY, '1');
  }

  toggleModeState();
});

toggleModeState();

window.onload = function () {
  document.body.className += ' loaded';
};
