# Prompt: Buc-ee's Florida Locations — Live OSM Map Page

Create a single self-contained HTML file called `bucees_florida_osm.html` that displays a live interactive map of Buc-ee's store locations in Florida. Follow every requirement below exactly.

---

## Libraries

- **Leaflet.js v1.9.4** for the interactive map — load CSS from `https://unpkg.com/leaflet@1.9.4/dist/leaflet.css` and JS from `https://unpkg.com/leaflet@1.9.4/dist/leaflet.js`. Do **not** include `integrity` or `crossorigin` attributes on either tag (they break when opened from `file://`).
- No other external libraries or frameworks.

---

## Page Layout (top to bottom)

All content is centred in a single column, `max-width: 760px`, centred with `margin: 0 auto`.

### 1. Header
- A centred logo area with an inline SVG beaver mascot icon (52×52px, amber/orange tones) beside an `<h1>` reading **"Buc-ee's Florida Locations"**.
- A subtitle paragraph: *"All current locations in the state of Florida"*.
- A small pill badge: *"Source: buc-ees.com/locations — live data"* (background `#f7f8fa`, border `#e5e7eb`, font 12px, muted text).
- Bottom border `2px solid #e5e7eb` separating header from body.

### 2. Count Banner
- A left-bordered info bar (`border-left: 4px solid #3b82d4`, background `#f7f8fa`).
- Text: a large bold blue `2` followed by *"Buc-ee's locations currently open in Florida"*.

### 3. Map Section
- A bordered card (`border: 1px solid #e5e7eb`, `border-radius: 8px`, `overflow: hidden`).
- A title bar with `background: #f7f8fa`, displaying **"Florida — Live Map"** on the left and **"© Stadia Maps · © OpenStreetMap contributors"** in small blue text on the right.
- A `<div id="map">` that is **500px tall** and 100% wide.

### 4. Location Cards (one per store, below the map)
Each card has:
- **Header** (background `#fef3c7`): an amber pill badge showing "Store #XX" and a city/state `<h2>`.
- **Body** (2-column grid): left column = Address, right column = Amenities as coloured pill tags.
  - Amenity tag colours: Car Wash = blue (`#3b82d4`/`#eff6ff`), DEF = purple (`#7c5cd8`/`#f5f3ff`), Ethanol-Free = green (`#16a34a`/`#f0fdf4`).
- **Footer** (background `#f7f8fa`): a "▶ Get Directions on Google Maps" link (blue, `target="_blank"`).

### 5. Page Footer
- Centred, 12px muted text with links to Stadia Maps, OpenStreetMap copyright page, and buc-ees.com.
- Text: *"Map tiles © [Stadia Maps] · Map data © [OpenStreetMap] contributors | Store data from [buc-ees.com] | Made with IBM Bob"*

---

## Map Initialisation (JavaScript)

```js
const map = L.map('map', {
  center: [27.8, -81.8],  // Florida centroid
  zoom: 7,
  zoomControl: true,
  scrollWheelZoom: false  // prevent accidental zoom while scrolling the page
});
```

**Tile layer — use Stadia Maps** (not tile.openstreetmap.org, which requires a Referer header):
```js
L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
  maxZoom: 20,
  attribution: '© Stadia Maps © OpenMapTiles © OpenStreetMap contributors'
}).addTo(map);
```

---

## Custom Map Pins

Use `L.divIcon` to create a CSS teardrop pin for each store:
- Shape: `border-radius: 50% 50% 50% 0`, `transform: rotate(-45deg)`, 32×32px.
- Fill: red `#ea4335` with border `#c0392b` and `box-shadow`.
- Inner text: store number (e.g. `#46`), counter-rotated `45deg` so it reads upright, white bold Arial 11px.
- `iconAnchor: [16, 32]` (pin tip), `popupAnchor: [0, -34]`.

---

## Store Data

| Store | City | Lat | Lng | Amenities | Google Maps URL |
|-------|------|-----|-----|-----------|-----------------|
| #46 | Saint Augustine | 29.9382 | -81.5231 | DEF, Ethanol-Free 87 & 90 Oct | `https://www.google.com/maps/search/200+World+Commerce+Pkwy+Saint+Augustine+Florida+32092` |
| #47 | Daytona Beach | 29.2108 | -81.0927 | Car Wash (7AM–10PM), DEF, Ethanol-Free 87 & 90 Oct | `https://www.google.com/maps/search/2330+Gateway+North+Drive+Daytona+Beach+Florida+32117` |

Store addresses:
- #46: 200 World Commerce Pkwy, Saint Augustine, FL 32092
- #47: 2330 Gateway North Drive, Daytona Beach, FL 32117

---

## Click Popup (per marker)

When a pin is clicked, show a Leaflet popup (`maxWidth: 260, minWidth: 220`) with:
- **Red header** (`#ea4335`): small "Store #XX" label above the city name in bold white.
- **White body**: street address in muted grey, coloured amenity pill tags (same colours as card amenity tags), and a full-width red "▶ Get Directions" button linking to Google Maps (`target="_blank"`).
- Override `.leaflet-popup-content-wrapper` to have `border-radius: 8px`, `padding: 0`, `overflow: hidden`, and a soft `box-shadow`. Set `.leaflet-popup-content { margin: 0 }`.

---

## Key Technical Notes

- Do **not** add `integrity` or `crossorigin` to the Leaflet `<link>` or `<script>` tags — they cause SRI hash mismatch errors when loading from `file://`.
- Use **Stadia Maps** tiles, not `tile.openstreetmap.org` — the OSM tile servers block requests with no `Referer` header (which is the case for all `file://` pages).
- The `#map` div must have an explicit pixel height (`500px`) — Leaflet will render blank if the container has no height.
- Place the Leaflet `<script>` tag and the initialisation `<script>` block at the **bottom of `<body>`**, after the map `<div>`, so the DOM element exists when Leaflet tries to bind to it.
