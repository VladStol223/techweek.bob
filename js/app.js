(function() {

  // ── STARFIELD ──────────────────────────────────────────
  var c = document.getElementById('stars-canvas');
  var ctx = c.getContext('2d');
  var W, H, stars = [];
  function resizeStars() {
    W = c.width  = window.innerWidth;
    H = c.height = Math.max(document.body.scrollHeight, window.innerHeight);
  }
  function initStars() {
    resizeStars();
    stars = [];
    for (var i = 0; i < 180; i++) {
      stars.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        r:  Math.random() * 1.4 + 0.3,
        a:  Math.random(),
        da: (Math.random() - 0.5) * 0.005
      });
    }
  }
  function drawStars() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      s.a = Math.max(0.08, Math.min(1, s.a + s.da));
      if (s.a <= 0.08 || s.a >= 1) s.da *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(180,200,255,' + s.a + ')';
      ctx.fill();
    }
    requestAnimationFrame(drawStars);
  }
  window.addEventListener('resize', initStars);
  initStars();
  drawStars();

  // ── SCROLL DEPTH TRACKING ──────────────────────────────
  var scrollMilestones = { 25: false, 50: false, 75: false, 100: false };
  window.addEventListener('scroll', function() {
    var scrolled = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
    [25, 50, 75, 100].forEach(function(m) {
      if (!scrollMilestones[m] && scrolled >= m) {
        scrollMilestones[m] = true;
        gtag('event', 'scroll_depth', { depth_percent: m });
      }
    });
  }, { passive: true });

  // ── HERO SCROLL CTA ────────────────────────────────────
  document.getElementById('hero-cta-btn').addEventListener('click', function() {
    gtag('event', 'hero_cta_click');
    document.getElementById('tracks-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // ── NEW TO BOB MODAL ───────────────────────────────────
  var ntbOverlay = document.getElementById('ntb-overlay');

  function openNtb(startTab) {
    ntbOverlay.classList.add('active');
    if (startTab) ntbSwitchTab(startTab);
    document.getElementById('ntb-close').focus();
  }
  function closeNtb() {
    ntbOverlay.classList.remove('active');
  }

  function ntbSwitchTab(num) {
    var panels = ntbOverlay.querySelectorAll('.ntb-panel');
    var tabs   = ntbOverlay.querySelectorAll('.ntb-tab');
    panels.forEach(function(p) { p.classList.remove('ntb-panel-active'); });
    tabs.forEach(function(t) {
      t.classList.remove('ntb-tab-active');
      t.setAttribute('aria-selected', 'false');
    });
    var activePanel = document.getElementById('ntb-panel-' + num);
    var activeTab   = document.getElementById('ntb-tab-' + num);
    if (activePanel) activePanel.classList.add('ntb-panel-active');
    if (activeTab) {
      activeTab.classList.add('ntb-tab-active');
      activeTab.setAttribute('aria-selected', 'true');
    }
    tabs.forEach(function(t) {
      var n = parseInt(t.getAttribute('data-ntb-tab'), 10);
      if (n < num) t.classList.add('ntb-tab-done');
      else t.classList.remove('ntb-tab-done');
    });
  }

  document.getElementById('new-to-bob-btn').addEventListener('click', function() {
    gtag('event', 'new_to_bob_open');
    openNtb(1);
  });
  document.addEventListener('click', function(e) {
    if (e.target.closest('[data-ntb]')) openNtb(2);
  });
  ntbOverlay.addEventListener('click', function(e) {
    var tab = e.target.closest('[data-ntb-tab]');
    if (tab) { ntbSwitchTab(parseInt(tab.getAttribute('data-ntb-tab'), 10)); return; }
    if (e.target.closest('#ntb-next-btn')) { ntbSwitchTab(2); return; }
    if (e.target === ntbOverlay) closeNtb();
  });
  document.getElementById('ntb-close').addEventListener('click', closeNtb);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeNtb();
  });

  // ── BUBBLE POP-IN via IntersectionObserver ─────────────
  var cards = document.querySelectorAll('.bubble-card');
  if ('IntersectionObserver' in window) {
    var cardObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var idx = Array.prototype.indexOf.call(cards, entry.target);
          var delay = Math.min(idx * 60, 420);
          setTimeout(function(t) { t.classList.add('bubble-in'); }, delay, entry.target);
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10 });
    cards.forEach(function(card) { cardObserver.observe(card); });
  } else {
    cards.forEach(function(card) { card.classList.add('bubble-in'); });
  }

  // ── TRACK CARD TOGGLE (open/close) ─────────────────────
  cards.forEach(function(card) {
    var summary = card.querySelector('.card-summary');
    summary.addEventListener('click', function() {
      var isOpen = card.classList.contains('open');
      cards.forEach(function(c) { c.classList.remove('open'); });
      if (!isOpen) {
        card.classList.add('open');
        gtag('event', 'track_open', {
          track_id: card.id,
          track_name: { 'card-a': 'EngineeringAudit', 'card-b': 'SupplyChainDashboard', 'card-c': 'GuidedLearning', 'card-d': 'BringYourOwn' }[card.id] || card.id
        });
        onTrackOpen(card.id);
        setTimeout(function() {
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
        if (card.id === 'card-d') {
          setTimeout(function() {
            document.getElementById('dq1').classList.add('qvisible');
          }, 320);
        }
      }
    });
  });

  // ── USE CASE ACCORDION ─────────────────────────────────
  var ucHeaders = document.querySelectorAll('.use-case-header');
  ucHeaders.forEach(function(header) {
    header.addEventListener('click', function() {
      var uc = header.closest('.use-case');
      var isOpen = uc.classList.contains('uc-open');
      uc.closest('.use-cases').querySelectorAll('.use-case').forEach(function(s) {
        s.classList.remove('uc-open');
      });
      if (!isOpen) {
        uc.classList.add('uc-open');
        gtag('event', 'usecase_open', { usecase_id: uc.id || header.textContent.trim().slice(0, 60) });
      }
    });
  });

  // ── MARKETPLACE LINK BUTTONS ────────────────────────────
  document.querySelectorAll('[data-marketplace-link]').forEach(function(a) {
    a.classList.add('pulse-cta');
  });
  document.addEventListener('click', function(e) {
    var link = e.target.closest('[data-marketplace-link]');
    if (!link) return;
    link.classList.remove('pulse-cta');
    gtag('event', 'marketplace_open', { item: link.href });
    var stepsBlock = link.closest('.mode-steps');
    if (stepsBlock) revealStep(stepsBlock, 2);
    if (link.closest('#card-a') && link.getAttribute('data-track-a-action')) recordTrackAAction('marketplace');
    if (link.closest('#card-c')) recordTrackCAction(link, 'marketplace');
  });

  // ── DOWNLOAD BUTTONS ───────────────────────────────────
  document.querySelectorAll('[data-download-file]').forEach(function(b) {
    b.classList.add('pulse-cta');
  });
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-download-file]');
    if (!btn) return;
    btn.classList.remove('pulse-cta');
    var filename = btn.getAttribute('data-download-file');
    btn.disabled = true;
    fetch(filename)
      .then(function(r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.blob();
      })
      .then(function(blob) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
        gtag('event', 'yaml_download', { filename: filename });
        btn.classList.add('downloaded');
        btn.querySelector('svg').style.display = 'none';
        for (var i = btn.childNodes.length - 1; i >= 0; i--) {
          if (btn.childNodes[i].nodeType === 3 && btn.childNodes[i].textContent.trim()) {
            btn.childNodes[i].textContent = ' \u2713 Downloaded!';
            break;
          }
        }
        var stepsBlock = btn.closest('.mode-steps');
        if (stepsBlock) revealStep(stepsBlock, 2);
      })
      .catch(function() {
        var a = document.createElement('a');
        a.href = filename; a.download = filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        btn.disabled = false;
        var stepsBlock = btn.closest('.mode-steps');
        if (stepsBlock) revealStep(stepsBlock, 2);
      });
  });

  // ── CONFIRM BUTTON ("It's there — continue") ───────────
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-confirm-step]');
    if (!btn) return;
    btn.classList.remove('pulse-cta');
    btn.disabled = true;
    btn.textContent = '\u2713 Confirmed';
    btn.style.background = 'var(--ca)';
    btn.style.color = 'white';
    var parentStep = btn.closest('.mode-step');
    var currentNum = parentStep ? parseInt(parentStep.querySelector('.step-num').textContent.trim(), 10) : 2;
    var parentCard = btn.closest('.bubble-card');
    var cardId = parentCard ? parentCard.id : 'unknown';
    gtag('event', 'step_confirm', { track_id: cardId, track_name: trackNames[cardId] || cardId, step: currentNum });
    var stepsBlock = btn.closest('.mode-steps');
    if (stepsBlock) revealStep(stepsBlock, currentNum + 1);
    if (btn.closest('#card-a') && btn.getAttribute('data-track-a-action')) recordTrackAAction('confirm');
    if (btn.closest('#card-c')) recordTrackCAction(btn, 'confirm');
  });

  function revealStep(stepsBlock, stepNum) {
    var steps = stepsBlock.querySelectorAll('.mode-step');
    steps.forEach(function(s) {
      var num = parseInt(s.querySelector('.step-num').textContent.trim(), 10);
      if (num === stepNum && s.classList.contains('step-hidden')) {
        s.classList.remove('step-hidden');
        s.classList.add('step-reveal');
        setTimeout(function() {
          if (stepNum === 2 || stepNum === 4) {
            var cb = s.querySelector('.step-confirm-btn');
            if (cb) cb.classList.add('pulse-cta');
          } else if (stepNum === 3 || stepNum === 5) {
            var cp = s.querySelector('.copy-btn');
            if (cp) cp.classList.add('pulse-cta');
          }
          s.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 60);
      }
    });
  }

  // ── COPY COMPLETION TRACKING STATE ────────────────────
  var copyState  = { 'card-a': new Set(), 'card-b': new Set(), 'card-c': new Set(), 'card-d': new Set() };
  var copyTotals = { 'card-a': 3, 'card-b': 5, 'card-c': 12, 'card-d': 4 };

  // ── TRACK A: progress per-action (marketplace + confirm + copy) ──
  function recordTrackAAction(type) {
    if (copyState['card-a'].has(type)) return;
    copyState['card-a'].add(type);
    var done_count = copyState['card-a'].size;
    var total      = copyTotals['card-a'];
    var pct        = Math.min(100, Math.round((done_count / total) * 100));
    var bar   = document.getElementById('progress-bar-a');
    var count = document.getElementById('progress-count-a');
    if (bar)   bar.style.width = pct + '%';
    if (count) count.textContent = done_count + ' / ' + total;
    var prog = loadProgress();
    prog['card-a'] = done_count;
    saveProgress(prog);
    updateGlobalFooter('card-a', done_count);
    if (done_count >= total) setTimeout(function() { celebrateTrack('card-a'); }, 2200);
  }

  // ── TRACK C: progress per-action (marketplace + confirm + copy) ──
  function trackCActionKey(el, type) {
    var uc = el.closest('.use-case');
    var titleEl = uc ? uc.querySelector('.uc-title') : null;
    var title = titleEl ? titleEl.textContent.trim().slice(0, 10) : (uc ? (uc.id || 'uc') : 'uc');
    return title + '|' + type;
  }
  function recordTrackCAction(el, type) {
    var key = trackCActionKey(el, type);
    if (copyState['card-c'].has(key)) return;
    copyState['card-c'].add(key);
    var done_count = copyState['card-c'].size;
    var total      = copyTotals['card-c'];
    var pct        = Math.min(100, Math.round((done_count / total) * 100));
    var bar   = document.getElementById('progress-bar-c');
    var count = document.getElementById('progress-count-c');
    if (bar)   bar.style.width = pct + '%';
    if (count) count.textContent = done_count + ' / ' + total;
    var prog = loadProgress();
    prog['card-c'] = done_count;
    saveProgress(prog);
    updateGlobalFooter('card-c', done_count);
    if (done_count >= total) setTimeout(function() { celebrateTrack('card-c'); }, 2200);
  }
  var trackNames = { 'card-a': 'EngineeringAudit', 'card-b': 'SupplyChainDashboard', 'card-c': 'GuidedLearning', 'card-d': 'BringYourOwn' };

  // ── GLOBAL FOOTER + CONFETTI ──────────────────────────
  var GF_KEY      = 'atl-bob-progress-v2';
  var GF_DONE_KEY = 'atl-bob-done-v2';

  var gfEl           = document.getElementById('global-footer');
  var gfBarEl        = document.getElementById('gf-bar');
  var gfCountEl      = document.getElementById('gf-count');
  var gfNameEl       = document.getElementById('gf-track-name');
  var gfHintEl       = document.getElementById('gf-step-hint');
  var confettiCanvas = document.getElementById('confetti-canvas');
  var confettiCtx    = confettiCanvas.getContext('2d');
  var confettiRunning = false;
  var confettiParticles = [];
  var CONFETTI_COLORS = ['#F0AB00','#0F62FE','#7c3aed','#1a7a4a','#e25822','#ffffff'];

  var trackLabels = {
    'card-a': 'Track A — Engineering Audit',
    'card-b': 'Track B — Supply Chain',
    'card-c': 'Track C — Guided Learning',
    'card-d': 'Track D — Bring Your Own'
  };
  var trackColorVars = {
    'card-a': '#7c3aed', 'card-b': '#0057B8', 'card-c': '#1a7a4a', 'card-d': '#c2790a'
  };

  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(GF_KEY) || '{}'); } catch(e) { return {}; }
  }
  function saveProgress(prog) {
    try { localStorage.setItem(GF_KEY, JSON.stringify(prog)); } catch(e) {}
  }
  function loadDone() {
    try { return JSON.parse(localStorage.getItem(GF_DONE_KEY) || '[]'); } catch(e) { return []; }
  }
  function saveDone(arr) {
    try { localStorage.setItem(GF_DONE_KEY, JSON.stringify(arr)); } catch(e) {}
  }

  function updateGlobalFooter(trackId, count) {
    var total = copyTotals[trackId] || 1;
    var pct   = Math.min(100, Math.round((count / total) * 100));
    var done  = loadDone();
    if (done.indexOf(trackId) !== -1) return;

    gfNameEl.textContent = trackLabels[trackId] || trackId;
    var hint0 = trackId === 'card-d' ? 'Answer the three questions to get your custom prompt' : 'Copy a prompt to get started';
    gfHintEl.textContent = count === 0
      ? hint0
      : count >= total
        ? 'All done — paste your prompt into Bob!'
        : trackId === 'card-d'
          ? 'Keep going — ' + (total - count) + ' step' + (total - count === 1 ? '' : 's') + ' left'
          : 'Paste into Bob, then come back for the next step';
    gfBarEl.style.width      = pct + '%';
    gfBarEl.style.background = trackColorVars[trackId] || 'var(--ibm-blue)';
    gfCountEl.textContent    = count + ' / ' + total;

    if (!gfEl.classList.contains('gf-visible')) {
      gfEl.classList.remove('gf-dismissing');
      requestAnimationFrame(function() { gfEl.classList.add('gf-visible'); });
    }
  }

  function dismissGlobalFooter() {
    gfEl.classList.add('gf-dismissing');
    gfEl.classList.remove('gf-visible');
    setTimeout(function() { gfEl.classList.remove('gf-dismissing'); }, 600);
  }

  // ── CONFETTI ENGINE ───────────────────────────────────
  function spawnConfetti() {
    confettiCanvas.width  = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    confettiCanvas.style.display = 'block';
    confettiParticles = [];
    for (var i = 0; i < 160; i++) {
      confettiParticles.push({
        x:     Math.random() * confettiCanvas.width,
        y:     -10 - Math.random() * 80,
        vx:    (Math.random() - 0.5) * 5,
        vy:    2 + Math.random() * 4,
        r:     4 + Math.random() * 5,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rot:   Math.random() * Math.PI * 2,
        rvel:  (Math.random() - 0.5) * 0.18,
        shape: Math.random() > 0.5 ? 'rect' : 'circle'
      });
    }
    confettiRunning = true;
    rafConfetti();
  }

  function rafConfetti() {
    if (!confettiRunning) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    var alive = false;
    for (var i = 0; i < confettiParticles.length; i++) {
      var p = confettiParticles[i];
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.12; p.vx *= 0.99; p.rot += p.rvel;
      if (p.y < confettiCanvas.height + 20) alive = true;
      confettiCtx.save();
      confettiCtx.globalAlpha = Math.max(0, 1 - (p.y / confettiCanvas.height));
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.rot);
      confettiCtx.fillStyle = p.color;
      if (p.shape === 'rect') {
        confettiCtx.fillRect(-p.r / 2, -p.r * 1.6 / 2, p.r, p.r * 1.6);
      } else {
        confettiCtx.beginPath();
        confettiCtx.arc(0, 0, p.r / 2, 0, Math.PI * 2);
        confettiCtx.fill();
      }
      confettiCtx.restore();
    }
    if (alive) { requestAnimationFrame(rafConfetti); }
    else { confettiRunning = false; confettiCanvas.style.display = 'none'; }
  }

  function celebrateTrack(trackId) {
    var done = loadDone();
    if (done.indexOf(trackId) !== -1) return;
    done.push(trackId);
    saveDone(done);
    dismissGlobalFooter();
    setTimeout(spawnConfetti, 350);
  }

  (function checkReturnVisit() {
    var prog = loadProgress();
    var done = loadDone();
    var toFire = [];
    Object.keys(copyTotals).forEach(function(id) {
      if ((prog[id] || 0) >= copyTotals[id] && done.indexOf(id) === -1) toFire.push(id);
    });
    if (toFire.length) setTimeout(function() { celebrateTrack(toFire[0]); }, 800);
  })();

  function onTrackOpen(trackId) {
    var prog  = loadProgress();
    var count = prog[trackId] || 0;
    var total = copyTotals[trackId] || 1;
    var pct   = Math.min(100, Math.round((count / total) * 100));

    gfNameEl.textContent     = trackLabels[trackId] || trackId;
    gfHintEl.textContent     = count === 0
      ? (trackId === 'card-d' ? 'Answer the three questions to get your custom prompt' : 'Copy a prompt to get started')
      : count >= total
        ? 'All done — paste your prompt into Bob!'
        : (trackId === 'card-d'
            ? 'Keep going — ' + (total - count) + ' step' + (total - count === 1 ? '' : 's') + ' left'
            : 'Paste into Bob, then come back for the next step');
    gfBarEl.style.width      = pct + '%';
    gfBarEl.style.background = trackColorVars[trackId] || 'var(--ibm-blue)';
    gfCountEl.textContent    = count + ' / ' + total;

    gfEl.classList.remove('gf-dismissing');
    requestAnimationFrame(function() { gfEl.classList.add('gf-visible'); });
  }

  // ── COPY BUTTONS ───────────────────────────────────────
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.copy-btn');
    if (!btn) return;
    var pre = btn.parentElement.querySelector('pre');
    if (!pre) return;
    var text = pre.textContent;
    function done() {
      btn.classList.remove('pulse-cta');
      btn.textContent = '\u2713 Copied!';
      btn.classList.remove('copied');
      void btn.offsetWidth;
      btn.classList.add('copied');
      setTimeout(function() {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 2000);

      var parentCard = btn.closest('.bubble-card');
      var cardId = parentCard ? parentCard.id : 'unknown';
      var parentUcEl = btn.closest('.use-case');
      var ucId = parentUcEl ? (parentUcEl.id || 'unknown') : 'unknown';
      var parentModeStep = btn.closest('.mode-step');
      var stepLabel = parentModeStep ? ('step-' + (parentModeStep.querySelector('.step-num') ? parentModeStep.querySelector('.step-num').textContent.trim() : '?')) : ucId;
      gtag('event', 'prompt_copy', { track_id: cardId, track_name: trackNames[cardId] || cardId, step: stepLabel });

      if (cardId === 'card-a' && btn.closest('.mode-step')) {
        recordTrackAAction('copy');
        if (copyState['card-a'].size >= copyTotals['card-a']) {
          gtag('event', 'track_complete', { track_id: cardId, track_name: trackNames[cardId] || cardId });
        }
      } else if (cardId === 'card-c') {
        recordTrackCAction(btn, 'copy');
        if (copyState['card-c'].size >= copyTotals['card-c']) {
          gtag('event', 'track_complete', { track_id: cardId, track_name: trackNames[cardId] || cardId });
        }
      } else if (cardId === 'card-d') {
        recordTrackDStep('copy');
        if (dTrackDone.size >= copyTotals['card-d']) {
          gtag('event', 'track_complete', { track_id: cardId, track_name: trackNames[cardId] || cardId });
        }
      } else if (cardId !== 'card-a' && copyState[cardId]) {
        copyState[cardId].add(btn);
        if (copyState[cardId].size >= copyTotals[cardId]) {
          gtag('event', 'track_complete', { track_id: cardId, track_name: trackNames[cardId] || cardId });
        }
        var suffix = { 'card-a': 'a', 'card-b': 'b', 'card-d': 'd' }[cardId];
        if (suffix) {
          var done_count = copyState[cardId].size;
          var total      = copyTotals[cardId];
          var pct        = Math.min(100, Math.round((done_count / total) * 100));
          var bar   = document.getElementById('progress-bar-' + suffix);
          var count = document.getElementById('progress-count-' + suffix);
          if (bar)   bar.style.width = pct + '%';
          if (count) count.textContent = done_count + ' / ' + total;
          var prog = loadProgress();
          prog[cardId] = done_count;
          saveProgress(prog);
          updateGlobalFooter(cardId, done_count);
          if (done_count >= total) {
            setTimeout(function() { celebrateTrack(cardId); }, 2200);
          }
        }
      }

      var parentStep = btn.closest('.mode-step');
      if (parentStep) {
        var stepNum = parseInt(parentStep.querySelector('.step-num').textContent.trim(), 10);
        if (stepNum === 3) {
          var stepsBlock = parentStep.closest('.mode-steps');
          if (stepsBlock) revealStep(stepsBlock, 4);
        }
      }
      var unlockTarget = btn.getAttribute('data-unlock-uc');
      if (unlockTarget) {
        collapseCurrentUc(btn);
        unlockUcStep(unlockTarget);
      }
      var parentUc = btn.closest('.use-case');
      if (parentUc) {
        if (parentUc.id === 'uc-step2-a') { collapseCurrentUc(btn); unlockUcStep('uc-step3-a'); }
        else if (parentUc.id === 'uc-step3-a') { collapseCurrentUc(btn); unlockUcStep('uc-step4-a'); }
        else if (parentUc.id === 'uc-step4-a') { collapseCurrentUc(btn); unlockUcStep('uc-step5-a'); }
      }
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(done).catch(function() { fallbackCopy(text); done(); });
    } else {
      fallbackCopy(text); done();
    }
  });

  function collapseCurrentUc(btn) {
    var uc = btn.closest('.use-case');
    if (uc) uc.classList.remove('uc-open');
  }
  function unlockUcStep(id) {
    var el = document.getElementById(id);
    if (!el || !el.classList.contains('uc-locked')) return;
    el.classList.remove('uc-locked');
    el.classList.add('uc-unlocked');
    el.classList.add('uc-open');
  }
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch(e) {}
    document.body.removeChild(ta);
  }

  // ── QUIZ (Track D) ─────────────────────────────────────
  var quizAnswers = {};
  var quizLabels  = {};
  var dTrackDone  = new Set();

  function recordTrackDStep(stepKey) {
    if (dTrackDone.has(stepKey)) return;
    dTrackDone.add(stepKey);
    copyState['card-d'].add(stepKey);
    var done_count = dTrackDone.size;
    var prog = loadProgress();
    prog['card-d'] = done_count;
    saveProgress(prog);
    updateGlobalFooter('card-d', done_count);
    if (done_count >= copyTotals['card-d']) setTimeout(function() { celebrateTrack('card-d'); }, 2200);
  }

  function buildPrompt(q1bucket, q1label, q2goal, q3mode) {
    var TD = window.TRACK_D;
    var openerFn = TD.openers[q1bucket] || TD.openers['new'];
    var bodyKey  = q2goal + '_' + q3mode;
    var body     = TD.taskBodies[bodyKey] || TD.taskBodies['understand_done_for_you'];
    return openerFn(q1label) + '\n\n' + body;
  }

  document.addEventListener('click', function(e) {
    var opt = e.target.closest('.quiz-opt');
    if (!opt) return;
    var qId = opt.getAttribute('data-q');
    var val = opt.getAttribute('data-v');
    if (!opt.closest('#card-d') || !qId || !val) return;

    opt.closest('.quiz-opts').querySelectorAll('.quiz-opt').forEach(function(o) {
      o.classList.remove('selected');
    });
    opt.classList.add('selected');

    var wasAnswered = !!quizAnswers[qId];
    quizAnswers[qId] = val;
    quizLabels[qId]  = opt.textContent.trim();
    gtag('event', 'quiz_answer', { question: qId, answer: val });

    if (!wasAnswered) recordTrackDStep(qId);

    var nextMap = { dq1: 'dq2', dq2: 'dq3' };
    var nextId = nextMap[qId];
    if (nextId) {
      setTimeout(function() {
        var nextQ = document.getElementById(nextId);
        nextQ.style.display = '';
        setTimeout(function() { nextQ.classList.add('qvisible'); }, 30);
        nextQ.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 300);
    } else if (qId === 'dq3') {
      setTimeout(function() {
        var loader = document.getElementById('quiz-generating');
        loader.classList.add('active');
        loader.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(function() {
          loader.classList.remove('active');
          var promptText = buildPrompt(quizAnswers.dq1, quizLabels.dq1 || quizAnswers.dq1, quizAnswers.dq2, quizAnswers.dq3);
          gtag('event', 'quiz_complete', { type: quizAnswers.dq1, value: quizAnswers.dq2, outcome: quizAnswers.dq3 });
          var box = document.getElementById('quiz-result-box');
          box.innerHTML =
            '<div class="prompt-box" style="margin-top:0">' +
              '<div class="prompt-label">Your custom Bob prompt — paste this in</div>' +
              '<pre>' + promptText.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</pre>' +
              '<button class="copy-btn quiz-copy-btn">Copy</button>' +
            '</div>';
          box.style.display = 'block';
          void box.offsetWidth;
          box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 950);
      }, 300);
    }
  });

})();
