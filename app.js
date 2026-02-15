// ===== State =====

const audio = new Audio();
let lines = [];
let currentLineIdx = 0;
let appState = 'idle';
let spaceDown = false;
let retimeIdx = -1;
let retimeAutoPause = null;
let retimeOldStart = null;
let retimeOldEnd = null;
let retimeStamped = false;
let animFrame = null;
let audioFileName = '';

// ===== Mobile Detection =====

const mobileQuery = window.matchMedia('(max-width: 768px)');
function applyMobileClass(e) {
  document.body.classList.toggle('is-mobile', e.matches);
}
applyMobileClass(mobileQuery);
mobileQuery.addEventListener('change', applyMobileClass);

// ===== DOM =====

const $ = (s) => document.querySelector(s);
const screenSetup = $('#screen-setup');
const screenTiming = $('#screen-timing');
const screenPreview = $('#screen-preview');

const dropZone = $('#drop-zone');
const dropLabel = $('#drop-label');
const fileInput = $('#file-input');
const lyricsInput = $('#lyrics-input');
const btnStart = $('#btn-start');

const playBtn = $('#play-btn');
const iconPlay = $('#icon-play');
const iconPause = $('#icon-pause');
const iconRestart = $('#icon-restart');
const seekBar = $('#seek-bar');
const timeCur = $('#time-current');
const timeDur = $('#time-duration');
const lyricsList = $('#lyrics-list');

const stripCheckbox = $('#strip-punctuation');
const keepExclamationLabel = $('#keep-exclamation-label');
const keepQuestionLabel = $('#keep-question-label');
const keepExclamation = $('#keep-exclamation');
const keepQuestion = $('#keep-question');
const stripPreview = $('#strip-preview');
const stripList = $('#strip-preview-list');

const previewBody = $('#preview-body');
const btnDownload = $('#btn-download');
const btnBack = $('#btn-back');
const retimeBanner = $('#retime-banner');
const previewCurrentLine = $('#preview-current-line');

const playBtn2 = $('#play-btn-2');
const seekBar2 = $('#seek-bar-2');
const timeCur2 = $('#time-current-2');
const timeDur2 = $('#time-duration-2');

const countdownOverlay = $('#countdown-overlay');
const countdownNum = $('#countdown-num');
const mobileTapBtn = $('#mobile-tap-btn');

// ===== Helpers =====

function formatSRT(seconds) {
  if (seconds == null || isNaN(seconds)) return '00:00:00,000';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);
  return (
    String(h).padStart(2, '0') + ':' +
    String(m).padStart(2, '0') + ':' +
    String(s).padStart(2, '0') + ',' +
    String(ms).padStart(3, '0')
  );
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function showScreen(name) {
  screenSetup.classList.toggle('active', name === 'setup');
  screenTiming.classList.toggle('active', name === 'timing');
  screenPreview.classList.toggle('active', name === 'preview');
}

function updateStartBtn() {
  btnStart.disabled = !(audio.src && lyricsInput.value.trim());
}

// ===== Countdown =====

function startCountdown(callback) {
  appState = 'countdown';
  countdownOverlay.classList.add('active');
  let count = 3;
  countdownNum.textContent = count;
  countdownNum.style.animation = 'none';
  void countdownNum.offsetWidth;
  countdownNum.style.animation = '';

  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownNum.textContent = count;
      countdownNum.style.animation = 'none';
      void countdownNum.offsetWidth;
      countdownNum.style.animation = '';
    } else {
      clearInterval(interval);
      countdownOverlay.classList.remove('active');
      callback();
    }
  }, 1000);
}

// ===== Audio Drop Zone =====

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) loadAudioFile(file);
});

fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) loadAudioFile(fileInput.files[0]);
});

function loadAudioFile(file) {
  audio.src = URL.createObjectURL(file);
  audio.load();
  dropZone.classList.add('has-file');
  dropLabel.innerHTML = '';
  const fn = document.createElement('span');
  fn.className = 'filename';
  fn.textContent = file.name;
  audioFileName = file.name.replace(/\.[^.]+$/, '');
  dropLabel.appendChild(fn);
  updateStartBtn();
}

lyricsInput.addEventListener('input', updateStartBtn);

// ===== Strip Punctuation Preview =====

function buildStripRegex() {
  let chars = '\\s.,\\-–—…:;\'"»«)}\\]';
  if (!keepExclamation.checked) chars += '!';
  if (!keepQuestion.checked) chars += '?';
  return new RegExp('[' + chars + ']+$');
}

let stripDebounce = null;
function renderStripPreview() {
  if (!stripCheckbox.checked) {
    stripPreview.style.display = 'none';
    keepExclamationLabel.style.display = 'none';
    keepQuestionLabel.style.display = 'none';
    return;
  }
  stripPreview.style.display = '';
  keepExclamationLabel.style.display = '';
  keepQuestionLabel.style.display = '';
  const re = buildStripRegex();
  const raw = lyricsInput.value.split('\n');
  const parsed = raw
    .map(l => l.trimEnd())
    .filter(l => l.trim().length > 0);

  stripList.innerHTML = '';
  parsed.forEach((text, i) => {
    const li = document.createElement('li');
    const match = text.match(re);
    const numSpan = `<span class="line-num">${i + 1}</span>`;
    if (match) {
      const clean = text.slice(0, match.index);
      li.innerHTML = numSpan +
        `<span>${escapeHtml(clean)}<span class="strip-removed">${escapeHtml(match[0])}</span></span>`;
    } else {
      li.innerHTML = numSpan + `<span>${escapeHtml(text)}</span>`;
    }
    stripList.appendChild(li);
  });
}

stripCheckbox.addEventListener('change', renderStripPreview);
keepExclamation.addEventListener('change', renderStripPreview);
keepQuestion.addEventListener('change', renderStripPreview);
lyricsInput.addEventListener('input', () => {
  clearTimeout(stripDebounce);
  stripDebounce = setTimeout(renderStripPreview, 200);
});


// ===== Timing =====

function renderLyricsList() {
  lyricsList.innerHTML = '';
  lines.forEach((line, i) => {
    const li = document.createElement('li');
    const tsText = line.startTime != null && line.endTime != null
      ? `${formatSRT(line.startTime)} → ${formatSRT(line.endTime)}`
      : '';
    li.innerHTML =
      `<span class="line-num">${i + 1}</span>` +
      `<span>${escapeHtml(line.text)}</span>` +
      `<span class="line-ts" id="line-ts-${i}">${tsText}</span>`;
    lyricsList.appendChild(li);
  });
  updateLyricsHighlight();
}

function updateLyricsHighlight() {
  const items = lyricsList.children;
  for (let i = 0; i < items.length; i++) {
    items[i].className = '';
    if (i < currentLineIdx) {
      items[i].classList.add('timed');
    } else if (i === currentLineIdx && spaceDown) {
      items[i].classList.add('recording');
    } else if (i === currentLineIdx) {
      items[i].classList.add('current');
    }
  }
}

function scrollToLine(idx) {
  const item = lyricsList.children[idx];
  if (item) item.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

function restartTiming() {
  audio.pause();
  audio.currentTime = 0;
  lines.forEach(l => { l.startTime = null; l.endTime = null; });
  currentLineIdx = 0;
  spaceDown = false;
  renderLyricsList();
  scrollToLine(0);

  startCountdown(() => {
    appState = 'timing';
    audio.play();
    updatePlayIcons();
  });
}

btnStart.addEventListener('click', () => {
  const raw = lyricsInput.value.split('\n');
  const shouldStrip = stripCheckbox.checked;
  const stripRe = buildStripRegex();
  lines = raw
    .map(l => l.trimEnd())
    .filter(l => l.trim().length > 0)
    .map(text => {
      if (shouldStrip) text = text.replace(stripRe, '');
      return { text, startTime: null, endTime: null };
    });

  if (lines.length === 0) return;

  currentLineIdx = 0;
  spaceDown = false;
  showScreen('timing');
  renderLyricsList();
  scrollToLine(0);
  audio.currentTime = 0;
  startPlayerLoop();

  startCountdown(() => {
    appState = 'timing';
    audio.play();
    updatePlayIcons();
  });
});

// ===== Stamp Logic (shared by keyboard & mobile tap) =====

function stampDown() {
  if (appState === 'timing') {
    if (spaceDown) return;
    spaceDown = true;
    lines[currentLineIdx].startTime = audio.currentTime;
    const tsEl = document.getElementById('line-ts-' + currentLineIdx);
    if (tsEl) tsEl.textContent = formatSRT(audio.currentTime) + ' →';
    updateLyricsHighlight();
    mobileTapBtn.classList.add('recording');
    mobileTapBtn.textContent = 'Recording…';
  } else if (appState === 'retiming') {
    if (spaceDown) return;
    spaceDown = true;
    retimeStamped = true;
    lines[retimeIdx].startTime = audio.currentTime;
    const row = previewBody.children[retimeIdx];
    if (row) row.children[1].textContent = formatSRT(audio.currentTime);
    highlightRetimeRow();
  }
}

function stampUp() {
  if (appState === 'timing') {
    if (!spaceDown) return;
    spaceDown = false;
    lines[currentLineIdx].endTime = audio.currentTime;
    const tsEl = document.getElementById('line-ts-' + currentLineIdx);
    if (tsEl) {
      tsEl.textContent =
        formatSRT(lines[currentLineIdx].startTime) + ' → ' + formatSRT(audio.currentTime);
    }
    currentLineIdx++;

    mobileTapBtn.classList.remove('recording');
    mobileTapBtn.textContent = 'Hold to Time';

    if (currentLineIdx >= lines.length) {
      appState = 'preview';
      audio.pause();
      cancelAnimationFrame(animFrame);
      showScreen('preview');
      renderPreview();
      startPlayerLoop();
    } else {
      updateLyricsHighlight();
      scrollToLine(currentLineIdx);
    }
  } else if (appState === 'retiming') {
    if (!spaceDown) return;
    spaceDown = false;
    lines[retimeIdx].endTime = audio.currentTime;
    const row = previewBody.children[retimeIdx];
    if (row) row.children[2].textContent = formatSRT(audio.currentTime);
    audio.pause();
    appState = 'preview';
    retimeAutoPause = null;
    retimeBanner.classList.remove('active');
    renderPreview();
    updatePlayIcons();
  }
}

// ===== Mobile Tap Button =====

mobileTapBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  stampDown();
}, { passive: false });

mobileTapBtn.addEventListener('touchend', (e) => {
  e.preventDefault();
  stampUp();
}, { passive: false });

mobileTapBtn.addEventListener('contextmenu', (e) => e.preventDefault());

// ===== Spacebar Events =====

document.addEventListener('keydown', (e) => {
  if (e.code === 'Escape' && appState === 'retiming') {
    cancelRetime();
    return;
  }

  if (e.code !== 'Space') return;

  if (appState === 'countdown') {
    e.preventDefault();
    return;
  }

  if (appState === 'timing' || appState === 'retiming') {
    e.preventDefault();
    if (e.repeat) return;
    stampDown();
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code !== 'Space') return;

  if (appState === 'timing' || appState === 'retiming') {
    e.preventDefault();
    stampUp();
  }
});

// ===== Audio Player =====

function startPlayerLoop() {
  cancelAnimationFrame(animFrame);

  function tick() {
    if (audio.duration) {
      const pct = (audio.currentTime / audio.duration) * 1000;
      seekBar.value = pct;
      seekBar2.value = pct;
      timeCur.textContent = formatSRT(audio.currentTime);
      timeCur2.textContent = formatSRT(audio.currentTime);
      timeDur.textContent = formatSRT(audio.duration);
      timeDur2.textContent = formatSRT(audio.duration);
    }
    if (appState === 'retiming' && retimeAutoPause != null && audio.currentTime >= retimeAutoPause) {
      audio.pause();
    }
    if (appState === 'preview') {
      updatePreviewHighlight();
    }
    updatePlayIcons();
    animFrame = requestAnimationFrame(tick);
  }

  tick();
}

function updatePlayIcons() {
  const paused = audio.paused;
  const isTiming = appState === 'timing' || appState === 'countdown';

  iconRestart.style.display = isTiming ? '' : 'none';
  iconPlay.style.display = isTiming ? 'none' : (paused ? '' : 'none');
  iconPause.style.display = isTiming ? 'none' : (paused ? 'none' : '');

  playBtn2.querySelector('.pp-play').style.display = paused ? '' : 'none';
  playBtn2.querySelector('.pp-pause').style.display = paused ? 'none' : '';
}

function togglePlay() {
  if (audio.paused) audio.play();
  else audio.pause();
  updatePlayIcons();
}

playBtn.addEventListener('click', () => {
  if (appState === 'timing') {
    restartTiming();
  } else {
    togglePlay();
  }
});

playBtn2.addEventListener('click', togglePlay);

seekBar.addEventListener('input', () => {
  if (audio.duration) audio.currentTime = (seekBar.value / 1000) * audio.duration;
});

seekBar2.addEventListener('input', () => {
  if (audio.duration) audio.currentTime = (seekBar2.value / 1000) * audio.duration;
});

audio.addEventListener('pause', () => {
  if (appState === 'preview') {
    updatePreviewHighlight();
  }
});

// ===== Preview =====

function renderPreview() {
  previewBody.innerHTML = '';
  lines.forEach((line, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML =
      `<td class="ts">${i + 1}</td>` +
      `<td class="ts">${formatSRT(line.startTime)}</td>` +
      `<td class="ts">${formatSRT(line.endTime)}</td>` +
      `<td>${escapeHtml(line.text)}</td>`;
    if (!mobileQuery.matches) {
      tr.addEventListener('click', () => startRetime(i));
    }
    previewBody.appendChild(tr);
  });
}

function updatePreviewHighlight() {
  const t = audio.currentTime;
  const rows = previewBody.children;
  let activeIdx = -1;
  let nearestIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startTime != null && lines[i].endTime != null &&
        t >= lines[i].startTime && t < lines[i].endTime) {
      activeIdx = i;
      break;
    }
    if (lines[i].endTime != null && t >= lines[i].endTime) {
      nearestIdx = i;
    }
  }
  for (let i = 0; i < rows.length; i++) {
    rows[i].classList.toggle('active-playback', i === activeIdx);
  }
  if (activeIdx >= 0) {
    previewCurrentLine.textContent = lines[activeIdx].text;
    previewCurrentLine.classList.add('visible');
    previewCurrentLine.classList.add('active');
  } else if (nearestIdx >= 0) {
    previewCurrentLine.textContent = lines[nearestIdx].text;
    previewCurrentLine.classList.add('visible');
    previewCurrentLine.classList.remove('active');
  } else {
    previewCurrentLine.textContent = '';
    previewCurrentLine.classList.add('visible');
    previewCurrentLine.classList.remove('active');
  }
}

// ===== Retime =====

function startRetime(idx) {
  if (appState === 'retiming' && retimeIdx === idx) {
    cancelRetime();
    return;
  }

  if (appState === 'retiming' && !retimeStamped) {
    lines[retimeIdx].startTime = retimeOldStart;
    lines[retimeIdx].endTime = retimeOldEnd;
  }

  retimeOldStart = lines[idx].startTime;
  retimeOldEnd = lines[idx].endTime;
  retimeStamped = false;

  retimeIdx = idx;
  appState = 'retiming';
  spaceDown = false;
  retimeBanner.classList.add('active');
  highlightRetimeRow();

  const seekTo = Math.max(0, (lines[idx].startTime || 0) - 5);
  retimeAutoPause = null;
  audio.currentTime = seekTo;
  audio.play();
  updatePlayIcons();
}

function cancelRetime() {
  if (!retimeStamped) {
    lines[retimeIdx].startTime = retimeOldStart;
    lines[retimeIdx].endTime = retimeOldEnd;
  }
  audio.pause();
  appState = 'preview';
  retimeAutoPause = null;
  retimeBanner.classList.remove('active');
  renderPreview();
  updatePlayIcons();
}

function highlightRetimeRow() {
  const rows = previewBody.children;
  for (let i = 0; i < rows.length; i++) {
    rows[i].classList.toggle('retiming', i === retimeIdx);
    rows[i].classList.toggle('recording', i === retimeIdx && spaceDown);
  }
}

// ===== Download =====

btnDownload.addEventListener('click', () => {
  let srt = '';
  lines.forEach((line, i) => {
    srt += `${i + 1}\n`;
    srt += `${formatSRT(line.startTime)} --> ${formatSRT(line.endTime)}\n`;
    srt += `${line.text}\n\n`;
  });

  const blob = new Blob([srt], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (audioFileName || 'subtitles') + '.srt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// ===== Back to Setup =====

function goToSetup() {
  appState = 'idle';
  audio.pause();
  cancelAnimationFrame(animFrame);
  retimeBanner.classList.remove('active');
  showScreen('setup');
}

btnBack.addEventListener('click', goToSetup);
$('#btn-back-setup').addEventListener('click', goToSetup);
