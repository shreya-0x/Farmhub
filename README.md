# 🌱 FarmHub — Smart Decisions. Better Farming.

> **A genuine HTML5 + CSS3 + Vanilla JavaScript (ES6+) agricultural decision-support web application designed for Indian and global farmers.**

Built strictly without React, Vue, Angular, Next.js, Nuxt, Svelte, Astro, Tailwind, or Bootstrap. Employs **Chart.js** (charts and analytics) and **Leaflet.js** (interactive field boundary mapping with high-reliability CARTO Voyager tiles) exclusively as supporting JavaScript libraries.

---

## 🌟 Product Principles & User Experience

FarmHub replaces complex SaaS dashboards with an intuitive, farmer-first experience:
- **No forced demo account**: First-time users are greeted by a modern, high-conversion landing page.
- **No OTP friction**: Minimal initial registration (Full Name + Phone Number), with a single-click **[ LOGIN LATER ]** guest option.
- **Instant Onboarding**: User selects location and crop category/variety, then jumps **directly into the dashboard** without upfront forms for soil or irrigation.
- **Profile Completion on Demand**: Unlocks deeper personalized advice progressively.

---

## 🚀 Primary User Journey

```
LANDING PAGE
    ↓  [ LET'S EXPLORE → ]
USER DETAILS
    ↓  Full Name + Phone Number (or [ LOGIN LATER ])
CROP SPECIFICATIONS
    ↓  1. Location (GPS or Search + Interactive Leaflet Map)
    ↓  2. Crop Category (🌸 Flowers, 🍎 Fruits, 🥬 Vegetables, 🌾 Other)
    ↓  3. Specific Crop (5 standard crops per category or custom "Other" crop)
    ↓  [ GO TO MY FARM → ]
PREMIUM DASHBOARD
    ↓  Sidebar + Top Utility Bar + Main Workspace
    ↓  Live Weather + Soil Hydrology + Decision Engine
```

---

## 🌾 Agronomic Core Loop

```
DATA  ➔  ANALYSIS  ➔  DECISION  ➔  REASONING  ➔  ACTION  ➔  HISTORY
```

The central dashboard explicitly answers the 4 vital farmer questions:
1. **WHAT SHOULD I DO NOW?** — Directives (`IRRIGATE`, `WAIT`, `INSPECT FIELD`, `PROTECT CROP`, `MONITOR`, `DELAY IRRIGATION`, `CHECK DRAINAGE`), precise action windows (e.g. *Tomorrow 06:00–08:30*), confidence %, risk level, and estimated water impact.
2. **WHY?** — Agronomic and meteorological reasons (soil deficit, heat stress, rain probability, phenological stage sensitivity).
3. **DATA USED** — Full transparency on every parameter (exact readings, units, data origin: physical probe, Open-Meteo model, or weather station).
4. **WHAT SHOULD I CHECK NEXT?** — Clear scheduled follow-up trigger and condition check.

---

## 📁 Project Structure

```
FarmHub/
├── index.html              # Semantic HTML5 base with appRoot mount
├── styles.css              # Root stylesheet proxy
│
├── css/
│   └── style.css           # FarmHub CSS3 design tokens (Light/Dark themes, Sidebar, Cards)
│
├── js/
│   ├── translations.js     # Centralized multi-language dictionary (en, kn, ta, te, hi)
│   ├── crops-data.js       # Agronomic knowledge base (20 crops + custom crop fallback)
│   ├── engine.js           # Deterministic decision engine, soil physics, spray window
│   ├── api.js              # Open-Meteo weather/soil, geocoding, APMC market data, IoT sensors
│   └── app.js              # State manager, router, Leaflet map, Chart.js, module views
│
├── data/
│   └── crops.json          # Crop agronomic database reference
│
├── assets/                 # Icons & media
└── README.md               # Complete documentation
```

---

## 🌐 Multi-Language Support

FarmHub provides instant language switching without page reload across 5 languages:
- **English** (`en`)
- **ಕನ್ನಡ — Kannada** (`kn`)
- **தமிழ் — Tamil** (`ta`)
- **తెలుగు — Telugu** (`te`)
- **हिन्दी — Hindi** (`hi`)

Crop varieties preserve internal stable IDs (`rose`, `mango`, `tomato`, `rice`, `cucumber`) while displaying native localized names in every view and table.

---

## 💡 Light & Dark Theme System

A custom CSS3 variable architecture supports both modes with persistent memory (`farmhub_theme` in `localStorage`):
- **Light Theme**: Warm cream background (`#F7F5EF`), pure white surfaces, deep forest green (`#123D28`), vibrant plant green (`#2F7D4A`), high-contrast dark text (`#18231D`).
- **Dark Theme**: Rich dark forest background (`#0E1712`), deep surfaces (`#15231B`), emerald accents (`#63B77A`), legible light text (`#F1F5F2`), subtle borders (`#304138`).
- Accessible theme switch (`💡`) in the top utility bar.

---

## 🚜 Comprehensive Module Overview

1. **Overview**: Dashboard hero card, 4 core farmer questions, profile completion banner, stat cards, live signals, 1-click Executive Farm Brief generation, and audio voice advisory (`window.speechSynthesis`).
2. **My Farm**: Multi-farm management, interactive Leaflet field map with draggable pin and acreage radius circle, soil profile, and irrigation method setup.
3. **Weather**: Real Open-Meteo microclimate, feels like, humidity, wind, 48-hour rain probability, rainfall volume, UV index, sunrise/sunset, 24-Hour Spray Suitability Radar with hour-by-hour drift safety badges, and Chart.js forecast curves.
4. **Crop Calendar**: Visual phenological stage timeline, calculated vs farmer-confirmed stage, task checklist, custom task scheduling, and Crop Yield & Harvest Revenue Predictor.
5. **Irrigation**: Water balance calculations, root-zone moisture deficit, gross water requirement in Liters and Cubic Meters, pump run time estimator (3–10 HP motor conversion).
6. **Farm Advisory**: Explainability engine, mathematical decision trace, and risk score breakdown.
7. **Fertilizer**: 3 strategy choices (🌿 Natural/Organic, 🧪 Synthetic/Mineral, 🔄 Integrated), NPK dosage calculator, and soil testing safety guidelines.
8. **Crop Health**: Interactive diagnostic case studies (Early Blight, Powdery Mildew, Bacterial Blight, Healthy Canopy), visual laser scanner simulation, symptom checklist, leaf photo analyzer, and IPM guidelines.
9. **Market / Mandi**: APMC commodity rates for active crop, modal price, min/max range, and weekly price trend. Transparent `DEMO DATA · ILLUSTRATIVE ONLY` badge if in demo mode.
10. **Finance**: Farm-specific ledger, income, expenses, net profit, cost per acre, Chart.js doughnut chart, and CSV export.
11. **Sensors**: Hardware telemetry status (`LIVE SENSOR`, `NO SENSOR CONNECTED`, `DEMO SENSOR DATA`), dual-depth soil moisture (10 cm & 30 cm), canopy temp, EC, and leaf wetness.
12. **History**: Full audit trail of past recommendations and field decisions.
13. **Settings**: User profile details, language switch, theme switch, active farm switch, and complete Data Backup & Restore (portable JSON export/import).
14. **Kisaan AI Copilot**: 24/7 conversational agronomic field assistant grounded in crop parameters, soil hydrology, and weather conditions across 5 languages.
15. **Global Command Palette (`Ctrl + K`)**: Instant keyboard navigation across all modules, crops database, pest diagnoses, and quick actions.

---

## 🎨 2D/3D Interactive Animations & Real Data Integrations

FarmHub incorporates lightweight, hardware-accelerated native HTML5 Canvas simulations and live satellite data pipelines without heavy 3D framework overhead:

1. **3D Interactive Soil Strata & Hydrology Simulator (Irrigation Module)**:
   - True isometric 3D cutaway volume block of soil layers (Topsoil 0–10cm, Active Root Zone 10–30cm, Subsoil 30–60cm).
   - Dynamic soil color modulation based on real-time moisture saturation between Permanent Wilting Point (PWP) and Field Capacity (FC).
   - Detailed botanical root system showing taproot and lateral branches with **animated cyan capillary flow particles** demonstrating active water uptake by the crop.
   - Interactive 3D rotation and tilt on drag with mouse or touch.
   - Live percolation simulation triggers: **Simulate Drip (20mm)**, **Simulate Rain (40mm)**, **High ET Evaporation**, and **Baseline Reset** with moving wetting front and dynamic HUD moisture readouts.

2. **2D Dynamic Atmospheric Weather Sky Canvas (Weather Module)**:
   - Dynamic sky hero banner reacting to live atmospheric conditions:
     - **Rain / Thunderstorm**: Angle-adjusted raindrops calculated from wind velocity with expanding ground splash ripples.
     - **Clear / Sunny**: Rotating solar sunburst rays with floating golden pollen and dust motes.
     - **Twilight / Night**: Ambient starfield with twinkling star phases and moon glow.
     - **Wind Streamlines**: Dynamic aerodynamic streamlines flowing across the sky matching wind km/h.
   - Respects `prefers-reduced-motion` for accessibility and battery conservation.

3. **Real-time Satellite Air Quality & Atmosphere (Open-Meteo European Sentinel)**:
   - Live query of European AQI, PM2.5, PM10, Ground Ozone (O₃), and Nitrogen Dioxide (NO₂).
   - Automated agricultural health and safety advisory for field workers (e.g. spray drift safety, dust respirator guidance during tillage/harvesting).

4. **Live Doppler Rain Radar Overlay (RainViewer Global Composite API)**:
   - Integrates real-time precipitation radar tiles directly onto Leaflet maps in both **My Farm** and **Weather** modules.
   - 1-click toggle (`🌧️ Doppler Radar [LIVE]`) showing radar timestamp and rain intensity scale (Drizzle, Moderate, Heavy, Severe/Storm).

5. **2D Phenological Growth Stage Visualizer (Crop Calendar)**:
   - Interactive botanical canvas depicting the crop's morphological progression across 4 phenological stages (Germination/Seedling, Vegetative Canopy, Flowering & Fruit Set, Harvest Maturity).
   - Animated glowing pulse ring highlighting the current growth milestone and stage progress percentage.

6. **4-Depth Satellite Soil Moisture Hydrology**:
   - Expanded Open-Meteo numerical weather pipeline to pull 4 distinct soil layers: Topsoil (0–1cm), Upper Root (1–3cm), Active Root Zone (3–9cm), and Vadose Subsoil (9–27cm).
   - Multi-depth comparative time-series chart showing surface infiltration vs root-zone depletion.

---

## 🗺️ Geospatial Map Integration (Leaflet.js)

- **Tile Provider**: Configured with high-reliability **CARTO Voyager tiles** (`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`).
- Eliminates 403 access blocked errors commonly encountered with default OSM tiles.
- **Doppler Rain Radar Layer**: Toggleable overlay streamed from RainViewer API displaying live precipitation echoes.
- Graceful error boundary: If offline or tile load fails, displays **MAP TEMPORARILY UNAVAILABLE** with a **[ RETRY MAP ]** button while keeping geographic coordinates and reverse-geocoded place names intact.

---

## 🛠️ How to Run & Test

1. Open `index.html` directly in any modern browser (Chrome, Edge, Firefox, Safari).
2. Click **"⚡ TRY LIVE DEMO"** on the landing page for an instant, pre-configured 3.5-Acre Tomato Farm with live weather, sensors, and financial ledger entries.
3. Or click **"LET'S EXPLORE →"** to set up a new custom farm parcel with your GPS location or search.
4. Press **`Ctrl + K`** anywhere to launch the Command Palette, or click **`💬 Kisaan Copilot`** at the bottom right for instant agronomic Q&A.
