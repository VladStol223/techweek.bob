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
    if (e.key === 'Escape') { closeNtb(); closeAgenda(); }
    // badge modal Escape is handled in its own listener below
  });

  // ── AGENDA MODAL ───────────────────────────────────────
  var agendaOverlay = document.getElementById('agenda-overlay');

  function openAgenda() {
    agendaOverlay.classList.add('active');
    document.getElementById('agenda-close').focus();
  }
  function closeAgenda() {
    agendaOverlay.classList.remove('active');
  }

  document.getElementById('agenda-btn').addEventListener('click', function() {
    gtag('event', 'agenda_open');
    openAgenda();
  });
  agendaOverlay.addEventListener('click', function(e) {
    if (e.target === agendaOverlay) closeAgenda();
  });
  document.getElementById('agenda-close').addEventListener('click', closeAgenda);

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
          track_name: { 'card-a': 'EngineeringAudit', 'card-b': 'SupplyChainDashboard', 'card-c': 'GuidedLearning', 'card-d': 'DiscoverWithBob', 'card-e': 'BringYourOwn' }[card.id] || card.id
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
    if (link.closest('#card-e')) recordTrackEStep('marketplace-' + (link.getAttribute('data-eq-name') || 'item'));
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
  var copyState  = { 'card-a': new Set(), 'card-b': new Set(), 'card-c': new Set(), 'card-d': new Set(), 'card-e': new Set() };
  var copyTotals = { 'card-a': 3, 'card-b': 5, 'card-c': 12, 'card-d': 4, 'card-e': 3 };

  // ── TRACK A: progress per-action (marketplace + confirm + copy) ──
  function recordTrackAAction(type) {
    if (copyState['card-a'].has(type)) return;
    copyState['card-a'].add(type);
    var prog = loadProgress();
    var done_count = Math.max(copyState['card-a'].size, prog['card-a'] || 0);
    var total      = copyTotals['card-a'];
    var pct        = Math.min(100, Math.round((done_count / total) * 100));
    var bar   = document.getElementById('progress-bar-a');
    var count = document.getElementById('progress-count-a');
    if (bar)   bar.style.width = pct + '%';
    if (count) count.textContent = done_count + ' / ' + total;
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
    var prog = loadProgress();
    var done_count = Math.max(copyState['card-c'].size, prog['card-c'] || 0);
    var total      = copyTotals['card-c'];
    var pct        = Math.min(100, Math.round((done_count / total) * 100));
    var bar   = document.getElementById('progress-bar-c');
    var count = document.getElementById('progress-count-c');
    if (bar)   bar.style.width = pct + '%';
    if (count) count.textContent = done_count + ' / ' + total;
    prog['card-c'] = done_count;
    saveProgress(prog);
    updateGlobalFooter('card-c', done_count);
    if (done_count >= total) setTimeout(function() { celebrateTrack('card-c'); }, 2200);
  }
  var trackNames = { 'card-a': 'EngineeringAudit', 'card-b': 'SupplyChainDashboard', 'card-c': 'GuidedLearning', 'card-d': 'DiscoverWithBob', 'card-e': 'BringYourOwn' };

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
    'card-d': 'Track D — Discover with Bob',
    'card-e': 'Track E — Bring Your Own Problem'
  };
  var trackColorVars = {
    'card-a': '#7c3aed', 'card-b': '#0057B8', 'card-c': '#1a7a4a', 'card-d': '#c2790a', 'card-e': '#c2120a'
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
    var isQuiz = trackId === 'card-d' || trackId === 'card-e';
    var hint0 = isQuiz ? 'Pick your problem type to find your tool' : 'Copy a prompt to get started';
    if (trackId === 'card-d') hint0 = 'Answer the three questions to get your custom prompt';
    gfHintEl.textContent = count === 0
      ? hint0
      : count >= total
        ? 'All done — paste your prompt into Bob!'
        : isQuiz
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

  // ── BADGE MODAL + CREDLY CHIP ─────────────────────────

  // Per-track audit prompts (hidden from UI, copied by Step 4 button)
  var BADGE_AUDIT_PROMPTS = {
    'card-a': 'I have just completed Track A — Audit Your Codebase Now — at the IBM Bob Atlanta Tech Week Bobathon.\n\nTrack A completion standards:\n• I installed the engineering-audit skill from the Bob Marketplace\n• I opened Bob inside a real project or codebase directory (not just any empty folder)\n• I ran the full /engineering-audit command and Bob executed all 9 autonomous stages:\n  Stage 1 — Repository Discovery (produced an architecture map)\n  Stage 2 — Technical Audit (classified findings as Critical, High, Medium, Low, or False Positive)\n  Stage 3 — Product Decision Gate (escalated any business-decision findings)\n  Stage 4 — Remediation (implemented fixes for all Critical and High findings)\n  Stage 5 — Independent Verification (re-audited the codebase to confirm all fixes)\n  Stage 6 — Validation (ran type check, lint, build, and tests — reported PASS/FAIL/SKIP)\n  Stage 7 — First-Time User Journey Audit (traced all user flows as a new user)\n  Stage 8 — Beta Readiness Triage (classified all open findings by priority)\n  Stage 9 — Release Report (produced a Go / Go With Conditions / No-Go verdict)\n• The final release report exists in this workspace\n• All Critical and High findings were resolved before the release verdict\n\nPlease audit my workspace now. Check for the engineering audit output, verify the 9 stages were completed, confirm the release report exists and contains a verdict, and then guide me through the Credly badge claim process.',

    'card-b': 'I have just completed Track B — Supply Chain Operations Dashboard — at the IBM Bob Atlanta Tech Week Bobathon.\n\nTrack B completion standards:\n• I downloaded winn-dixie-data.json into my workspace using a Bob prompt\n• Bob created dashboard.html — a fully self-contained interactive supply chain dashboard\n• The dashboard runs in a browser with no errors and no missing files\n• Step 2: The dashboard contains a live OpenStreetMap (Leaflet 1.9.4) centered on Florida with gold hexagon warehouse markers and color-coded store circle markers (green ≥70%, yellow 40–69%, red <40%), connecting route lines, and clickable popups on every node\n• Step 3: 15 animated delivery trucks move in real time along their routes, color-coded by status (green = on time, yellow = delayed, grey = delivered/returning), with click popups showing delivery details\n• Step 4: Clicking any store or warehouse opens a slide-in side panel — stores show a CSS grid floor plan with section health bars, warehouses show dock utilization and inventory breakdown\n• Step 5: A delivery timeline section below the map shows all 15 deliveries organized in three swimlane columns (Delayed / On Time / Delivered), with timeline bars, ETAs, and live filtering when a node panel is open\n• The entire page fits within the browser viewport with no vertical scrolling\n\nPlease audit my workspace now. Check that dashboard.html exists and contains all five layers of functionality. Verify the file is self-contained and the Leaflet map, truck animation, drill-down panels, and delivery timeline are all present in the source. Then guide me through the Credly badge claim process.',

    'card-c': 'I have just completed Track C — Guided Learning Modes — at the IBM Bob Atlanta Tech Week Bobathon.\n\nTrack C completion standards:\n• I installed at least one of the four guided learning modes from the Bob Marketplace: QisBob Quantum Mentor, PyBob Python Mentor, SqlBob Database Mentor, or Jenny the Language Mentor\n• I switched Bob to that mode using the mode picker\n• I sent the track\'s start prompt and began a real learning session\n• The learning session was interactive — Bob assessed my level, I answered questions or wrote code or responded to prompts, and the session progressed past the introduction into actual lesson content\n• For QisBob: I reached the point where Bob walked me through at least one Qiskit concept or circuit, and I responded to at least one Socratic checkpoint question\n• For PyBob: I reached the point where Bob identified a real project for me to learn through and taught me at least one Python concept with working code\n• For SqlBob: I reached the point where Bob created a sample database in my field and I wrote at least one SQL query against it with Bob\'s feedback\n• For Jenny: I started a lesson in a real language and completed at least one conversational exchange or vocabulary/grammar checkpoint\n• The conversation history in this workspace shows the session was substantive — not just the opening prompt\n\nPlease audit my workspace now. Review the conversation history or any files created during the learning session. Confirm that at least one guided learning mode was used and that the session went beyond the start prompt into real lesson content. Then guide me through the Credly badge claim process.',

    'card-d': 'I have just completed Track D — Discover Where Bob Can Help — at the IBM Bob Atlanta Tech Week Bobathon.\n\nTrack D completion standards:\n• I answered all three discovery quiz questions on the Track D card:\n  Question 1: My role / background (technical, lead, communicator, builder, or new)\n  Question 2: What would be most valuable to me right now (automate, analyze, create, or understand)\n  Question 3: How I want to work with Bob (done-for-you result, reusable prompt, or guided walkthrough)\n• The quiz generated a custom Bob prompt matched to my three answers\n• I copied that custom-generated prompt and pasted it into Bob\n• Bob responded substantively to my custom prompt — it understood my role, my goal, and the format I asked for\n• I engaged with Bob\'s response and either iterated on it, asked a follow-up, or applied the output to something real\n• The custom prompt was not just copied and ignored — it produced a real, useful output that I found valuable\n\nPlease audit my workspace now. Look for any files, notes, or conversation output that shows I used the custom-generated prompt from Track D. Confirm that the session produced a meaningful result aligned with one of the four goal categories (automate, analyze, create, or understand). Then guide me through the Credly badge claim process.',

    'card-e': 'I have just completed Track E — Bring Your Own Problem — at the IBM Bob Atlanta Tech Week Bobathon.\n\nTrack E completion standards:\n• I selected one of the four problem categories on the Track E card (build/code, analyze, write/create, or learn)\n• The marketplace router surfaced three matched Bob modes or skills for my problem type\n• I installed at least one of the three recommended modes or skills from the Bob Marketplace\n• I used the ready-to-paste starter prompt for the mode or skill I installed\n• I ran the mode or skill against my own real problem — not a test or demo input, but something I actually care about or work on\n• The output was substantive and relevant to my real use case — a piece of code, an analysis, a document draft, a learning session, or a tool recommendation that I could actually use\n• For "build/code": Bob helped me design, scaffold, or implement something real in my workspace\n• For "analyze": Bob read and analyzed a real file, codebase, or document I provided and produced findings or insights\n• For "write/create": Bob produced a draft, pitch, proposal, or content piece for a real topic I provided\n• For "learn": Bob taught me something in my chosen area and I progressed past the introduction into actual learning content\n\nPlease audit my workspace now. Look for any output files, conversation history, or deliverables that show I completed Track E with a real problem. Confirm the output is substantive and tied to a real use case — not just the starter prompt pasted and left unanswered. Then guide me through the Credly badge claim process.'
  };

  var badgeOverlay     = document.getElementById('badge-overlay');
  var credlyChip       = document.getElementById('credly-chip');
  var credlyDismissBtn = document.getElementById('credly-chip-dismiss');
  var chipDismissed    = false;
  var chipEverShown    = false;
  var currentBadgeTrack = null;

  function openBadgeModal(trackId) {
    if (trackId) {
      currentBadgeTrack = trackId;
      // Populate the hidden audit prompt textarea with this track's prompt
      var auditTextarea = document.getElementById('badge-audit-prompt-text');
      if (auditTextarea) auditTextarea.value = BADGE_AUDIT_PROMPTS[trackId] || '';
      // Update modal subtitle to name the track
      var sub = document.getElementById('badge-modal-sub');
      if (sub) sub.textContent = (trackLabels[trackId] || trackId) + ' — 4 steps to your Credly badge';
    }
    badgeOverlay.classList.add('active');
    document.getElementById('badge-close').focus();
    gtag('event', 'badge_modal_open', { track_id: currentBadgeTrack || 'unknown' });
  }
  function closeBadgeModal() {
    badgeOverlay.classList.remove('active');
    if (chipEverShown && !chipDismissed) showCredlyChip();
  }

  function showCredlyChip() {
    chipEverShown = true;
    chipDismissed = false;
    credlyChip.classList.remove('chip-dismissed');
    requestAnimationFrame(function() { credlyChip.classList.add('chip-visible'); });
  }
  function hideCredlyChip() {
    credlyChip.classList.add('chip-dismissed');
    credlyChip.classList.remove('chip-visible');
  }

  // Modal close
  document.getElementById('badge-close').addEventListener('click', closeBadgeModal);
  badgeOverlay.addEventListener('click', function(e) {
    if (e.target === badgeOverlay) closeBadgeModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && badgeOverlay.classList.contains('active')) closeBadgeModal();
  });

  // Credly chip — click body (not dismiss) opens modal
  credlyChip.addEventListener('click', function(e) {
    if (e.target.closest('.credly-chip-dismiss')) return;
    openBadgeModal(currentBadgeTrack);
  });
  credlyChip.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBadgeModal(currentBadgeTrack); }
  });

  // Dismiss chip
  credlyDismissBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    chipDismissed = true;
    hideCredlyChip();
    gtag('event', 'badge_chip_dismissed');
  });

  // Generic copy-from-element helper used by both badge copy buttons
  function makeBadgeCopyBtn(btn, getTextFn, label) {
    btn.addEventListener('click', function() {
      var text = getTextFn();
      var originalHTML = btn.innerHTML;
      function onCopied() {
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:14px;height:14px;flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
        btn.classList.add('copied');
        setTimeout(function() {
          btn.innerHTML = originalHTML;
          btn.classList.remove('copied');
        }, 2200);
        gtag('event', 'badge_prompt_copy', { label: label });
      }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(onCopied).catch(function() { fallbackCopy(text); onCopied(); });
      } else { fallbackCopy(text); onCopied(); }
    });
  }

  // Step 1: copy the VSIX install prompt
  makeBadgeCopyBtn(
    document.getElementById('badge-copy-vsix-btn'),
    function() { return document.getElementById('badge-vsix-prompt-text').value; },
    'vsix-install'
  );

  // Step 4: copy the track-specific audit prompt
  makeBadgeCopyBtn(
    document.getElementById('badge-copy-audit-btn'),
    function() { return document.getElementById('badge-audit-prompt-text').value; },
    'track-audit'
  );

  function celebrateTrack(trackId) {
    var done = loadDone();
    if (done.indexOf(trackId) !== -1) return;
    done.push(trackId);
    saveDone(done);
    dismissGlobalFooter();
    setTimeout(spawnConfetti, 350);
    // Pre-load the track-specific audit prompt so it's ready when the chip is clicked
    currentBadgeTrack = trackId;
    var auditTextarea = document.getElementById('badge-audit-prompt-text');
    if (auditTextarea) auditTextarea.value = BADGE_AUDIT_PROMPTS[trackId] || '';
    // Show Credly chip after confetti settles
    setTimeout(showCredlyChip, 1800);
  }

  (function checkReturnVisit() {
    var prog = loadProgress();
    var done = loadDone();

    // If a track was already completed on a previous visit, show the chip right away
    if (done.length > 0) {
      var lastDone = done[done.length - 1];
      currentBadgeTrack = lastDone;
      var auditTextarea = document.getElementById('badge-audit-prompt-text');
      if (auditTextarea) auditTextarea.value = BADGE_AUDIT_PROMPTS[lastDone] || '';
      setTimeout(showCredlyChip, 600);
      return;
    }

    // Otherwise check if progress just crossed the threshold this session
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
    var isQuizTrack = trackId === 'card-d' || trackId === 'card-e';
    var openHint = trackId === 'card-d' ? 'Answer the three questions to get your custom prompt'
                 : trackId === 'card-e' ? 'Pick your problem type to find your tool'
                 : 'Copy a prompt to get started';
    gfHintEl.textContent     = count === 0
      ? openHint
      : count >= total
        ? 'All done — paste your prompt into Bob!'
        : (isQuizTrack
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
    // Track E copy buttons have data-eq-idx and are handled by their own listener below.
    if (btn.hasAttribute('data-eq-idx')) return;
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
      } else if (cardId !== 'card-a' && cardId !== 'card-e' && copyState[cardId]) {
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
    var prog = loadProgress();
    // Use the higher of the live Set size and the saved count so that a
    // page-refresh mid-track never causes the bar to go backward.
    var done_count = Math.max(dTrackDone.size, prog['card-d'] || 0);
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

  // ── TRACK E: Marketplace Quiz ──────────────────────────
  var eTrackDone = new Set();

  function recordTrackEStep(stepKey) {
    if (eTrackDone.has(stepKey)) return;
    eTrackDone.add(stepKey);
    copyState['card-e'].add(stepKey);
    var prog = loadProgress();
    // Same floor fix as Track D: never let an in-session count go below
    // what was already persisted from a previous session.
    var done_count = Math.max(eTrackDone.size, prog['card-e'] || 0);
    prog['card-e'] = done_count;
    saveProgress(prog);
    updateGlobalFooter('card-e', done_count);
    var bar   = document.getElementById('progress-bar-e');
    var count = document.getElementById('progress-count-e');
    var total = copyTotals['card-e'];
    if (bar)   bar.style.width = Math.min(100, Math.round((done_count / total) * 100)) + '%';
    if (count) count.textContent = done_count + ' / ' + total;
    document.getElementById('progress-e').style.display = '';
    if (done_count >= total) setTimeout(function() { celebrateTrack('card-e'); }, 2200);
  }

  function esc(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function renderEResults(category) {
    var TE    = window.TRACK_E;
    var recs  = TE.recommendations[category];
    if (!recs) return;
    var loader = document.getElementById('eq-generating');
    var resultsEl = document.getElementById('eq-results');

    loader.classList.add('active');
    loader.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    setTimeout(function() {
      loader.classList.remove('active');
      resultsEl.innerHTML = recs.map(function(rec, i) {
        var qParam   = encodeURIComponent(rec.install || rec.name);
        var mktUrl   = 'https://vladstol223.github.io/bob.marketplace/?q=' + qParam;
        var linkSvg  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:13px;height:13px;flex-shrink:0"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
        return (
          '<div class="eq-card">' +
            '<div class="eq-card-header">' +
              '<span class="eq-badge">' + esc(rec.type) + '</span>' +
              '<span class="eq-name">' + esc(rec.name) + '</span>' +
            '</div>' +
            '<div class="eq-why">' + esc(rec.why) + '</div>' +
            '<a class="step-download-btn eq-mkt-btn" href="' + mktUrl + '" target="_blank" rel="noopener" data-marketplace-link="true" data-eq-name="' + esc(rec.name) + '" style="margin-bottom:14px">' +
              linkSvg + ' View on Marketplace' +
            '</a>' +
            '<div class="eq-prompt-label">Starter prompt — paste this into Bob</div>' +
            '<div class="eq-prompt-wrap">' +
              '<pre>' + esc(rec.prompt) + '</pre>' +
              '<button class="copy-btn" data-eq-idx="' + i + '" data-eq-cat="' + category + '">Copy</button>' +
            '</div>' +
          '</div>'
        );
      }).join('') +
      '<button class="eq-reset-btn" id="eq-reset">&#8592; Try a different problem type</button>';

      resultsEl.style.display = '';
      // apply pulse-cta to the freshly rendered marketplace links
      resultsEl.querySelectorAll('[data-marketplace-link]').forEach(function(a) {
        a.classList.add('pulse-cta');
      });
      void resultsEl.offsetWidth;
      resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      gtag('event', 'eq_complete', { category: category });
    }, 950);
  }

  document.addEventListener('click', function(e) {
    // Category pick
    var eOpt = e.target.closest('.eq-opt');
    if (eOpt && eOpt.closest('#card-e')) {
      var category = eOpt.getAttribute('data-ev');
      if (!category) return;

      // Clear previous results
      document.getElementById('eq-results').innerHTML = '';
      document.getElementById('eq-results').style.display = '';

      // Mark selected
      eOpt.closest('.eq-opts').querySelectorAll('.eq-opt').forEach(function(o) {
        o.classList.remove('selected');
      });
      eOpt.classList.add('selected');

      recordTrackEStep('pick');
      renderEResults(category);
      return;
    }

    // Copy button inside eq-card
    var eBtn = e.target.closest('.copy-btn[data-eq-idx]');
    if (eBtn && eBtn.closest('#card-e')) {
      var idx      = parseInt(eBtn.getAttribute('data-eq-idx'), 10);
      var cat      = eBtn.getAttribute('data-eq-cat');
      var recs     = window.TRACK_E.recommendations[cat];
      if (!recs || !recs[idx]) return;
      var text = recs[idx].prompt;
      function doneE() {
        eBtn.textContent = '\u2713 Copied!';
        eBtn.classList.remove('copied');
        void eBtn.offsetWidth;
        eBtn.classList.add('copied');
        setTimeout(function() { eBtn.textContent = 'Copy'; eBtn.classList.remove('copied'); }, 2000);
        recordTrackEStep('copy-' + cat + '-' + idx);
        gtag('event', 'prompt_copy', { track_id: 'card-e', track_name: 'BringYourOwn', step: cat + '-' + idx });
      }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(doneE).catch(function() { fallbackCopy(text); doneE(); });
      } else { fallbackCopy(text); doneE(); }
      return;
    }

    // Reset button
    if (e.target.id === 'eq-reset' && e.target.closest('#card-e')) {
      document.getElementById('eq-results').innerHTML = '';
      document.getElementById('eq-results').style.display = '';
      document.getElementById('eq-generating').classList.remove('active');
      document.querySelector('#card-e .eq-opts').querySelectorAll('.eq-opt').forEach(function(o) {
        o.classList.remove('selected');
      });
    }
  });

})();
