const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const toast = (message) => { const el = $('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => el.classList.remove('show'), 2600); };

$('#todayLabel').textContent = new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date());

const views = ['overview', 'courses', 'projects', 'schedule'];
function showView(name) {
  views.forEach(v => { const el = $(`#${v}View`); if (el) el.hidden = v !== name; });
  $$('.nav-link').forEach(a => a.classList.toggle('active', a.dataset.view === name));
  $('#pageLabel').textContent = name === 'overview' ? 'Overview' : name === 'courses' ? 'My learning' : name === 'projects' ? 'Projects' : 'Schedule';
  $('#sidebar').classList.remove('open');
  $('#menuToggle').setAttribute('aria-expanded', 'false');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
$$('.nav-link').forEach(a => a.addEventListener('click', e => { e.preventDefault(); showView(a.dataset.view) }));
$$('[data-go]').forEach(b => b.addEventListener('click', () => showView(b.dataset.go)));
$('#exploreCourses').addEventListener('click', () => showView('courses'));
$('#continueTop').addEventListener('click', () => toast('Pick a course below and keep learning.'));
$$('[data-course]').forEach(b => b.addEventListener('click', () => toast(`Opening ${b.dataset.course} — course content can be connected next.`)));

$('#menuToggle').addEventListener('click', () => { const open = $('#sidebar').classList.toggle('open'); $('#menuToggle').setAttribute('aria-expanded', String(open)); });
$('#themeToggle').addEventListener('click', () => { document.body.classList.toggle('dark'); localStorage.setItem('skillpath-theme', document.body.classList.contains('dark') ? 'dark' : 'light'); });
if (localStorage.getItem('skillpath-theme') === 'dark') document.body.classList.add('dark');

$$('.task-check').forEach(box => box.addEventListener('change', () => { const status = box.closest('.task-row').querySelector('.task-status'); status.textContent = box.checked ? 'Done' : 'To do'; status.classList.toggle('done', box.checked); const count = $$('.task-check:checked').length; toast(`${count} of ${$$('.task-check').length} project steps completed.`); }));

const dialog = $('#sessionDialog');
function openSession() { dialog.showModal(); }
$('#addSession').addEventListener('click', openSession);
$('#addSessionAlt').addEventListener('click', openSession);
$('#sessionForm').addEventListener('submit', e => {
  if (e.submitter?.value === 'cancel') return;
  e.preventDefault();
  const title = $('#sessionTitle').value.trim(), time = $('#sessionTime').value;
  if (!title || !time) return;
  const [h, m] = time.split(':').map(Number), suffix = h >= 12 ? 'PM' : 'AM', display = `${String(h % 12 || 12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${suffix}`;
  const p = document.createElement('p'); p.className = 'schedule-entry'; p.textContent = `${display} — ${title}`; $('#scheduleList').append(p);
  dialog.close(); $('#sessionForm').reset(); $('#sessionTime').value = '16:00'; toast('Your study session has been added.');
});
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
