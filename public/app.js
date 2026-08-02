const tabButtons = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.tab-panel');
const statusEl = document.getElementById('status');
const resultsEl = document.getElementById('results');

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    tabButtons.forEach((b) => b.classList.remove('active'));
    panels.forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`${btn.dataset.tab}-form`).classList.add('active');
    statusEl.textContent = '';
    resultsEl.textContent = '';
  });
});

async function submitSearch(endpoint, payload) {
  statusEl.textContent = 'Searching...';
  resultsEl.textContent = '';
  try {
    const res = await fetch(`/api/search/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    statusEl.textContent = res.ok ? 'Done.' : `Error (${res.status})`;
    resultsEl.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    statusEl.textContent = 'Request failed.';
    resultsEl.textContent = err.message;
  }
}

function formToPayload(form) {
  return Object.fromEntries(new FormData(form).entries());
}

document.getElementById('name-form').addEventListener('submit', (e) => {
  e.preventDefault();
  submitSearch('name', formToPayload(e.target));
});

document.getElementById('phone-form').addEventListener('submit', (e) => {
  e.preventDefault();
  submitSearch('phone', formToPayload(e.target));
});

document.getElementById('email-form').addEventListener('submit', (e) => {
  e.preventDefault();
  submitSearch('email', formToPayload(e.target));
});
