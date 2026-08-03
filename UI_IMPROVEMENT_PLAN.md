# UI/UX Improvement Plan — `index.html`
### Atlanta Tech Week · IBM Bob Demo Page

> **Motion design lens:** This is a **marketing/landing page** → primary designer is **Jakub Krehel** (production polish), secondary is **Jhey Tompkins** (creative delight), with **Emil Kowalski** applied to high-frequency interactions (copy button, accordion headers).
> **Frequency gate:** Card opens = occasional → expressive 350–450ms spring OK. Copy button = frequent → fast 150ms max. Modal = rare → expressive entrance OK.
> Each step is self-contained. Check the page between steps before approving the next.

---

## Step 1 — Typography & Design Foundation
**What changes:** Font stack, CSS custom properties, color palette refinements, and global spacing tokens.

### Changes
- Load `Inter` from Google Fonts as the primary typeface (replaces `-apple-system` fallback chain that renders inconsistently cross-platform)
- Add `--font-mono: 'JetBrains Mono', 'Fira Code', monospace` for all `<pre>` and `<code>` elements — improves prompt box legibility
- Add refined color tokens:
  - `--surface-2: #22263080` — second-level card surface
  - `--surface-glass: rgba(28,31,38,0.7)` — frosted glass base
  - `--glow-a / --glow-b / --glow-c / --glow-d` — per-track ambient glow colors
  - `--border-subtle: rgba(255,255,255,0.06)` — lighter inner borders
- Increase base `line-height` to `1.65` and tighten heading `letter-spacing` slightly
- Update `body` font-family to use Inter

### What to check
- [ ] Font renders as Inter across the page (inspect computed styles)
- [ ] `<pre>` blocks use JetBrains Mono / Fira Code
- [ ] No visual regressions — layout should look identical, just crisper text

---

## Step 2 — Hero Section Redesign
**What changes:** Visual depth, animated badge entrance, word-mask title reveal, glowing radial background, and orbit ring satellite.

### Changes
- **Hero background:** Replace the flat radial gradient with a two-stop mesh gradient (`conic-gradient` + `radial-gradient`) at lower opacity — adds depth without noise
- **Badge entrance:** Change from plain `translateY` to a `clip-path: inset(0 100% 0 0)` → `inset(0 0% 0 0)` wipe-in (Jhey technique — more purposeful than a generic fade-up)
- **H1 word-mask reveal:** Wrap each word in a `<span class="word-mask">` with `overflow: hidden`, inner span animates `translateY(110%) → translateY(0)` with staggered delay — the "rising word" technique (Jakub signature)
- **Orbit rings:** Add a single `<div class="orbit-satellite">` small dot (4×4px, white/30%) that travels along the outermost ring using `offset-path` animation — one delightful detail that rewards attention
- **CTA button:** Upgrade hover state — add a `box-shadow` glow pulse on hover (`0 0 0 4px rgba(0,87,184,0.25)`) instead of just background change
- **"New to Bob?" button:** Add a soft underline-draw on hover using `::after` pseudo-element `scaleX(0→1)` 200ms

### What to check
- [ ] H1 words reveal with an upward mask wipe on page load (staggered ~60ms per word)
- [ ] Badge wipes in from left, not fades up
- [ ] A small dot orbits the outer ring
- [ ] CTA button glows on hover (not just darkens)
- [ ] "New to Bob?" button draws an underline on hover
- [ ] No layout shift during animations

---

## Step 3 — Track Cards Visual Upgrade
**What changes:** Card surface, left accent treatment, hover glow, and icon badge redesign.

### Changes
- **Card surface:** Apply subtle `background: linear-gradient(135deg, var(--surface), #1a1d24)` instead of flat color — adds imperceptible depth
- **Left accent border:** Replace `border-left: 5px solid` with a CSS `::before` pseudo-element that uses `scaleY(0→1)` to paint in when card becomes `.bubble-in` — the border "draws" onto the card as it enters (Jakub: every element earns its place)
- **Hover glow:** Add `box-shadow: 0 0 0 1px var(--track-glow), 0 8px 32px var(--track-glow-shadow)` on `:hover` using per-track CSS variables — each track glows in its own color instead of generic shadow elevation
- **Card icon:** Increase to `68px`, add a soft inner glow ring (inset box-shadow) in track color, icon scales `1.0 → 1.12` with spring on card open (already present, just improving values)
- **Card label (Track A/B/C/D):** Add `background: linear-gradient(90deg, var(--track-color), transparent)` underline via `::after` pseudo 2px line
- **Chevron:** On open, animate background fill as a radial-circle expand from center (not just color change)
- **Card entrance:** Improve from `translateY(24px)` to `translateY(20px) scale(0.98)` — the scale adds a sense of z-depth settling

### What to check
- [ ] Left border paints in (draws from top to bottom) when card scrolls into view
- [ ] Hover causes a colored glow matching the track (purple for A, blue for B, green for C, amber for D)
- [ ] Card entrance feels like the card "rises and settles" from slightly below and behind
- [ ] Card icon glows softly when card is open
- [ ] Chevron fill expands from center on open

---

## Step 4 — Accordion (Use Case) Polish
**What changes:** Replace the `max-height` hack with `grid-template-rows` for proper easing, improve header hover state, and add number badge micro-animation.

### Changes
- **Accordion expand:** Switch from `max-height: 0 → 3000px` (which has broken easing) to `display: grid; grid-template-rows: 0fr → 1fr` with `transition: grid-template-rows 350ms var(--ease-premium)` — the content now expands with a true ease curve instead of snapping at the end
- **Use-case `uc-body`:** Same `grid-template-rows` treatment for inner accordion (300ms)
- **Header hover:** Add `translateX(2px)` to the entire header row on hover — a subtle nudge that signals interactivity (Emil: purposeful micro-motion)
- **Number badge:** On use-case open, the `.uc-num` circle does a brief `scale(1 → 1.2 → 1)` spring pop — confirms selection without being loud
- **Locked steps:** Improve the locked visual — use a `blur(0.5px)` filter and `grayscale(30%)` instead of just `opacity: 0.28`, making it look "not yet accessible" rather than just faded
- **Unlock animation:** Upgrade `.uc-unlocked` to `clip-path: inset(0 0 100% 0) → inset(0 0 0% 0)` wipe-down + fade in — more satisfying unlock moment

### What to check
- [ ] Accordion content expands with smooth ease, not snap-then-slow (`max-height` artifact)
- [ ] Use-case header nudges right on hover
- [ ] Number badge pops when use-case opens
- [ ] Locked steps look "fogged" not just dim
- [ ] Unlock animation feels like a curtain lifting

---

## Step 5 — Prompt Box & Copy Button Upgrade
**What changes:** Syntax-inspired prompt box glow, copy button liquid-fill animation, and success state checkmark draw.

### Changes
- **Prompt box:** Add a `1px` top border in `rgba(0,87,184,0.3)` and a very faint `box-shadow: 0 0 40px rgba(0,87,184,0.08) inset` — makes the prompt box feel like it has a backlit screen glow
- **Prompt label:** Change from plain text to a styled pill with a small `●` indicator dot that pulses once on accordion open
- **Copy button normal state:** Add `letter-spacing: 0.04em` and a subtle `border: 1px solid rgba(255,255,255,0.12)` outline
- **Copy button press:** Change from `scale(0.96)` to a "liquid press" — `scale(0.94)` + `box-shadow` collapses to `0` in 100ms, then spring-bounces back
- **Copy button success:** Replace plain background change with a radial-circle fill that expands from the click point using a `::before` pseudo-element `clip-path: circle(0% at 50% 50%) → circle(150% at 50% 50%)` over 300ms — a satisfying "ink fill" effect (Jhey technique)
- **Checkmark draw:** On `.copied` state, the "✓ Copied!" text is preceded by an SVG checkmark that draws via `stroke-dashoffset: 20 → 0` over 200ms
- **Pulse CTA:** The existing `pulse-cta` glow animation is kept but tuned — reduce glow spread from `14px` to `10px`, increase speed from `2.4s` to `2.0s`

### What to check
- [ ] Prompt boxes have a faint backlit glow on the top edge
- [ ] Copy button has a visible border and letter-spacing in idle state
- [ ] Pressing copy triggers a visible press animation (scale down + shadow collapse)
- [ ] Success state shows a radial ink-fill expanding across the button
- [ ] Checkmark SVG draws itself in on copied state
- [ ] Pulse CTA glow is visible but not distracting

---

## Step 6 — Modal (New to Bob) Upgrade
**What changes:** Backdrop blur, refined entrance animation, close button upgrade, and content polish.

### Changes
- **Overlay backdrop:** Add `backdrop-filter: blur(8px) saturate(1.4)` to `.ntb-overlay` — creates proper frosted-glass effect instead of a flat dark overlay
- **Overlay entrance:** Add `animation: overlay-in 250ms var(--ease-out) both` that fades the overlay from `opacity: 0` — synchronized with modal entrance
- **Modal entrance:** Upgrade from `scale(0.94) translateY(16px)` to `scale(0.96) translateY(12px)` at a slightly longer 400ms with `--ease-spring` — feels more like a sheet rising from below
- **Close button:** Replace `&times;` text with a proper SVG `✕` (two diagonal lines), add a `rotate(0 → 90deg)` transform on hover over 200ms — classic "spinning close" micro-interaction
- **Modal border:** Add `border: 1px solid rgba(255,255,255,0.08)` top + `border-bottom: 1px solid rgba(0,0,0,0.4)` — glass edge definition
- **Screenshot box:** Add `border-radius: 10px` and `overflow: hidden` with a slight inner shadow — feels framed
- **Close on Escape / backdrop:** Already wired in JS, just add a transition on `ntb-overlay` opacity for the hide direction (200ms ease-in)

### What to check
- [ ] Overlay background is blurred (content behind is visible but soft)
- [ ] Modal slides up and settles with spring motion
- [ ] Close `✕` button rotates on hover
- [ ] Dismissing (Escape or backdrop click) fades out smoothly — no instant disappear
- [ ] Modal looks "elevated" above the page, not pasted on top

---

## Step 7 — Persona Pills & Section Intro
**What changes:** Staggered pill entrance, improved section heading, and divider upgrade.

### Changes
- **Persona pills:** Add `opacity: 0; transform: translateX(-8px)` initial state, then stagger each pill entrance with `animation-delay: calc(var(--i) * 40ms)` using `translateX(-8px) → 0` + fade over 300ms — pills slide in from the left in a wave
- **Pills hover:** Add `background: rgba(255,255,255,0.06)` and `border-color: rgba(255,255,255,0.15)` on hover — pills become interactive-feeling
- **Section intro h2:** Wrap "Choose Your Track" in a `<span>` with a gradient text fill `linear-gradient(135deg, var(--uah-gold), #f5cc4a)` — warm gold shimmer
- **Divider:** Upgrade from a static gradient bar to an `@keyframes` animated shimmer — the divider "glows" once on scroll-into-view using a `background-position` slide
- **Scroll progress indicator:** Add a `4px` fixed top bar (`position: fixed; top: 0; left: 0; height: 4px; z-index: 999`) that fills with a `linear-gradient(90deg, var(--ibm-blue), var(--uah-gold))` as user scrolls — updated via `scrollY / (documentHeight - viewportHeight)` in JS

### What to check
- [ ] Persona pills slide in from the left one by one as page loads
- [ ] Pills highlight on hover
- [ ] "Choose Your Track" heading has a warm gold gradient fill
- [ ] Divider bar animates (shimmers or glows) when scrolled into view
- [ ] A thin gradient progress bar appears at the very top of the viewport, filling as you scroll

---

## Step 8 — Quiz (Track D) Polish
**What changes:** Radio option micro-animation, question reveal, and result box entrance.

### Changes
- **Quiz option select:** On click, the selected `.quiz-opt` gets a `background: rgba(194,121,10,0.08)` fill that expands from the left using `clip-path: inset(0 100% 0 0) → inset(0 0% 0 0)` over 250ms — a "select sweep" instead of an instant background swap
- **`.qdot` on select:** Change from `scale(1.15)` to a two-step: `scale(0.6) → scale(1.2) → scale(1.0)` spring (more physical, like pressing a button)
- **Next question reveal:** Change from `display: none` toggled off + fade to a `clip-path: inset(0 0 100% 0) → inset(0 0 0% 0)` wipe down + translateY(10px → 0) over 350ms
- **Reveal button:** On quiz completion, the button does a `scale(0.97) → scale(1.04) → scale(1.0)` spring bounce when it first appears
- **Result box entrance:** Upgrade from `translateY(12px) scale(0.98)` to a proper spring entrance with a brief `box-shadow` pulse that expands and fades — the result feels "delivered"

### What to check
- [ ] Clicking a quiz option sweeps a highlight across it from left to right
- [ ] Radio dot does a physical pop (compress then spring) on select
- [ ] Next question wipes down from the top (not just fades in)
- [ ] Generate button bounces into view when all 3 answers are selected
- [ ] Result box springs in with a brief glow pulse

---

## Step 9 — Footer & Final Polish
**What changes:** Footer gradient text, audit stats animation, and any remaining rough edges.

### Changes
- **Footer:** Add a subtle `border-top` gradient (`linear-gradient(90deg, transparent, var(--border), transparent)`) — already partially there, just improve it. Add a "Made with IBM Bob" text that on hover does a shimmer text animation using `@property --shimmer-pos` sliding highlight
- **Audit stats (Track A):** Each `.stat-num` counts up from `0` to its value using a JS counter animation (`requestAnimationFrame` over 800ms) when the card opens — makes `9`, `13`, `16/16`, `$35`, `Go` feel earned
- **`@media (prefers-reduced-motion: reduce)`:** Audit and tighten the reduced-motion block — ensure every new animation/transition added in steps 1–8 is covered. Set all to `0.01ms` and disable counter animation
- **Scroll-linked card glow:** As user scrolls past a card, add a brief `1s` glow flash to the card that just cleared the viewport midpoint (a "you passed this" ambient signal — very subtle, `opacity: 0 → 0.3 → 0`)
- **`will-change` cleanup:** Audit all animated elements — add `will-change: transform` only on the orbit satellite and the hero word masks (both use continuous or load-time animation); remove it from everything else to avoid layer-creation bloat

### What to check
- [ ] Footer text shimmers on hover
- [ ] Track A stat numbers count up when card opens (9, 13, 16/16, $35, Go)
- [ ] All new animations respect `prefers-reduced-motion` (test in Chrome DevTools)
- [ ] No performance warnings in DevTools (no excessive layer count, no layout thrash)
- [ ] Full page visual review — nothing looks broken, clipped, or misaligned on mobile (375px) and desktop (1280px)

---

## Checkoff Summary

| Step | Scope | Status |
|------|-------|--------|
| 1 | Typography & Design Foundation | ✅ Done |
| 2 | Hero Section Redesign | ✅ Done |
| 3 | Track Cards Visual Upgrade | ✅ Done |
| 4 | Accordion (Use Case) Polish | ✅ Done |
| 5 | Prompt Box & Copy Button Upgrade | ✅ Done |
| 6 | Modal (New to Bob) Upgrade | ✅ Done |
| — | Global Progress Footer + Confetti | ✅ Done |
| 7 | Persona Pills & Section Intro | ⬜ Not started |
| 8 | Quiz (Track D) Polish | ⬜ Not started |
| 9 | Footer & Final Polish | ⬜ Not started |

---

## Non-goals (explicitly out of scope)
- No changes to JavaScript logic, GA4 events, accordion unlock mechanics, or quiz prompt generation
- No changes to HTML structure beyond what's needed to support animations (adding `<span>` wrappers, `data-` attributes)
- No new dependencies beyond Google Fonts (Inter + JetBrains Mono)
- No changes to responsive breakpoints or layout grid
