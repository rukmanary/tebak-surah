// SURAHS tersedia sebagai global variable dari surahs.js yang dimuat sebelumnya


// ── STATE ──
let stats = { correct: 0, wrong: 0, streak: 0 };
let currentQ = null;
let startIdx = 0;
let endIdx = SURAHS.length - 1;

// ── BUILD SELECTS ──
function buildSelects() {
  const startSelect = document.getElementById('startSelect');
  const endSelect   = document.getElementById('endSelect');

  SURAHS.forEach((surah, idx) => {
    const opt = `<option value="${idx}">${surah.number}. ${surah.latin}</option>`;
    startSelect.innerHTML += opt;
    endSelect.innerHTML   += opt;
  });

  endSelect.value = SURAHS.length - 1;
  updateRangeSummary();
}

function onRangeChange() {
  let s = parseInt(document.getElementById('startSelect').value);
  let e = parseInt(document.getElementById('endSelect').value);
  if (s > e) { e = s; document.getElementById('endSelect').value = s; }
  startIdx = s;
  endIdx   = e;
  updateRangeSummary();
}

function updateRangeSummary() {
  const s     = SURAHS[startIdx];
  const e     = SURAHS[endIdx];
  const count = endIdx - startIdx + 1;
  document.getElementById('rangeSummary').textContent =
    `${s.number}. ${s.latin}  —  ${e.number}. ${e.latin}  ·  ${count} surat`;
}

// ── NAVIGATION ──
function startQuiz() {
  stats = { correct: 0, wrong: 0, streak: 0 };
  updateStats();

  const s = SURAHS[startIdx];
  const e = SURAHS[endIdx];
  document.getElementById('quizRangeDesc').textContent =
    `Soal acak dari rentang ${s.number}. ${s.latin} — ${e.number}. ${e.latin}`;

  switchPage('homePage', 'quizPage');
  generateQuestion();
}

function goHome() {
  document.getElementById('resultOverlay').classList.remove('show');
  clearConfetti();
  switchPage('quizPage', 'homePage');
}

function switchPage(fromId, toId) {
  const from = document.getElementById(fromId);
  const to   = document.getElementById(toId);
  from.classList.add('exit');
  setTimeout(() => {
    from.classList.remove('active', 'exit');
    to.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, 260);
}

// ── QUIZ LOGIC ──
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickDistractors(correctIdx, count) {
  const pool = SURAHS.filter((_, i) => i !== correctIdx);
  shuffle(pool);
  return pool.slice(0, count);
}

function generateQuestion() {
  const rangeSize  = endIdx - startIdx + 1;
  const correctIdx = startIdx + randInt(0, rangeSize - 1);
  const correct    = SURAHS[correctIdx];

  // qType 0 = tebak nomor, 1 = tebak nama
  const qType = Math.random() < 0.5 ? 0 : 1;

  let questionText, options;

  if (qType === 0) {
    questionText = `Surat <strong>${correct.latin}</strong> adalah surat ke-...`;
    const dist   = pickDistractors(correctIdx, 3).map(s => ({ val: s.number, display: String(s.number), isCorrect: false }));
    options      = shuffle([{ val: correct.number, display: String(correct.number), isCorrect: true }, ...dist]);
  } else {
    questionText = `Surat ke-<strong>${correct.number}</strong> adalah...`;
    const dist   = pickDistractors(correctIdx, 3).map(s => ({ val: s.latin, display: s.latin, isCorrect: false }));
    options      = shuffle([{ val: correct.latin, display: correct.latin, isCorrect: true }, ...dist]);
  }

  currentQ = { correctIdx, qType, options };

  document.getElementById('qTypeBadge').textContent    = qType === 0 ? '🔢 Tebak Nomor' : '📜 Tebak Nama';
  document.getElementById('questionText').innerHTML    = questionText;
  document.getElementById('questionSub').textContent   = 'Pilih jawaban yang paling tepat';

  const s = SURAHS[startIdx];
  const e = SURAHS[endIdx];
  document.getElementById('progressText').textContent  =
    `Rentang: ${s.number}. ${s.latin} — ${e.number}. ${e.latin}`;

  const letters = ['A', 'B', 'C', 'D'];
  const grid    = document.getElementById('optionsGrid');
  grid.innerHTML = '';

  options.forEach((opt, i) => {
    const btn       = document.createElement('button');
    btn.className   = 'option-btn';
    btn.innerHTML   = `<span class="option-letter">${letters[i]}</span>${opt.display}`;
    btn.onclick     = () => handleAnswer(btn, opt.isCorrect);
    grid.appendChild(btn);
  });

  const card = document.getElementById('quizCard');
  card.style.animation = 'none';
  card.offsetHeight; // reflow trigger
  card.style.animation = 'pageIn 0.38s ease both';
}

function handleAnswer(btn, isCorrect) {
  const btns = document.querySelectorAll('.option-btn');
  btns.forEach(b => b.disabled = true);

  currentQ.options.forEach((opt, i) => {
    if (opt.isCorrect) btns[i].classList.add('correct');
  });

  if (isCorrect) {
    btn.classList.add('correct');
    btns.forEach((b, i) => { if (!currentQ.options[i].isCorrect) b.classList.add('dim'); });
    stats.correct++;
    stats.streak++;
  } else {
    btn.classList.add('wrong');
    btns.forEach((b, i) => { if (!currentQ.options[i].isCorrect && b !== btn) b.classList.add('dim'); });
    stats.wrong++;
    stats.streak = 0;
  }

  updateStats();
  setTimeout(() => showResult(isCorrect), isCorrect ? 580 : 680);
}

function updateStats() {
  document.getElementById('statCorrect').textContent = stats.correct;
  document.getElementById('statWrong').textContent   = stats.wrong;
  document.getElementById('statStreak').textContent  = stats.streak;
}

function showResult(isCorrect) {
  const correct = SURAHS[currentQ.correctIdx];
  document.getElementById('resultOverlay').classList.add('show');

  const icons = isCorrect
    ? ['🎉', '✨', '🌟', '🏆', '💫', '🥳']
    : ['😅', '🤔', '💭', '📖'];
  document.getElementById('resultIcon').textContent = icons[Math.floor(Math.random() * icons.length)];

  if (isCorrect) {
    document.getElementById('resultTitle').textContent  = 'Benar!';
    document.getElementById('resultTitle').className   = 'result-title correct-title';
    document.getElementById('resultDesc').textContent  =
      `Tepat sekali! ${correct.latin} (${correct.meaning}) adalah surat ke-${correct.number} dengan ${correct.verses} ayat.`;
    launchConfetti();
  } else {
    document.getElementById('resultTitle').textContent  = 'Kurang Tepat';
    document.getElementById('resultTitle').className   = 'result-title wrong-title';
    document.getElementById('resultDesc').textContent  =
      `Jangan menyerah! Terus berlatih dan pelajari urutan surat Al-Qur'an. Barakallahu fiikum 🤍`;
  }

  const answerLabel = currentQ.qType === 0
    ? `Nomor ${correct.number} — ${correct.latin}`
    : `${correct.latin} (${correct.arabic})`;
  document.getElementById('correctAnswerText').textContent = answerLabel;
}

function nextQuestion() {
  document.getElementById('resultOverlay').classList.remove('show');
  clearConfetti();
  generateQuestion();
}

// ── CONFETTI ──
function launchConfetti() {
  const container = document.getElementById('confettiContainer');
  container.innerHTML = '';
  const colors = ['#c9a84c', '#f0c060', '#3fb950', '#58a6ff', '#f85149', '#d2a8ff', '#ff7b72'];

  for (let i = 0; i < 55; i++) {
    const p       = document.createElement('div');
    p.className   = 'confetti-piece';
    p.style.cssText = `
      left:${Math.random() * 100}%;
      background:${colors[i % colors.length]};
      width:${4 + Math.random() * 7}px;
      height:${4 + Math.random() * 7}px;
      border-radius:${Math.random() > .5 ? '50%' : '2px'};
      animation-duration:${1.4 + Math.random() * 1.4}s;
      animation-delay:${Math.random() * 0.4}s;
      --drift:${(Math.random() - .5) * 180}px;
    `;
    container.appendChild(p);
  }
}

function clearConfetti() {
  document.getElementById('confettiContainer').innerHTML = '';
}

// ── EXPOSE HANDLERS ke HTML (inline onclick) ──
window.onRangeChange  = onRangeChange;
window.startQuiz      = startQuiz;
window.goHome         = goHome;
window.nextQuestion   = nextQuestion;

// ── INIT ──
buildSelects();
