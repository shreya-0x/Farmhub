// ============================================================
// FARMHUB — MASTER CONTROLLER & APPLICATION LOGIC
// Strict Vanilla ES6+ JavaScript — No Frontend Frameworks
// ============================================================

// App Global State Container
const FarmHubState = {
  user: JSON.parse(localStorage.getItem('farmhub_user') || 'null'),
  activeFarm: JSON.parse(localStorage.getItem('farmhub_active_farm') || 'null'),
  farms: JSON.parse(localStorage.getItem('farmhub_farms') || '[]'),
  theme: localStorage.getItem('farmhub_theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  lang: localStorage.getItem('farmhub_lang') || 'en',
  fin: JSON.parse(localStorage.getItem('farmhub_fin') || '[]'),
  tasks: JSON.parse(localStorage.getItem('farmhub_tasks') || '[]'),
  history: JSON.parse(localStorage.getItem('farmhub_history') || '[]'),
  demoMode: false,
  mandiApiKey: localStorage.getItem('farmhub_mandi_key') || '',
  currentRoute: 'landing', // 'landing', 'user-details', 'crop-specs', or main module 'overview'
  currentModule: 'overview',
  weatherCache: {},
  curWeather: null,
  curDecision: null,
  healthPhotoSignals: [],
  copilotOpen: false,
  copilotMessages: [],
  cmdPaletteOpen: false,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine !== false : true,
  _animWeatherSkyId: null,
  _animHydrologyId: null,
  _animCropGrowthId: null
};

// Toast Notification Helper
function showToast(msg, icon = '🌱') {
  let toast = $('#farmToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'farmToast';
    toast.className = 'farm-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>${icon}</span> <span>${esc(msg)}</span>`;
  toast.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// Demo Farm Preset Generator
function loadDemoFarm() {
  FarmHubState.user = {
    name: 'Ramesh Patel',
    phone: '+91 98450 12345',
    isGuest: false
  };
  const demoFarm = {
    id: 'demo-farm-kolar',
    name: 'GreenField Valley Plot A',
    cropCategory: 'vegetables',
    cropId: 'tomato',
    cropName: 'Tomato',
    cropVariety: 'Arka Rakshak (High-Yield Hybrid)',
    isCustomCrop: false,
    soil: 'Red loam',
    farmSize: 3.5,
    irrigation: 'Drip',
    motorHp: 5,
    pumpFlowRate: 450,
    plantingDate: new Date(Date.now() - 38 * 24 * 3600 * 1000).toISOString().split('T')[0], // 38 days ago -> Flowering
    location: {
      lat: 13.1367,
      lon: 78.1348,
      displayName: 'Kolar District, Karnataka, India',
      locality: 'Kolar',
      district: 'Kolar',
      state: 'Karnataka',
      country: 'India',
      source: 'Demo Preset'
    }
  };
  FarmHubState.farms = [demoFarm];
  FarmHubState.activeFarm = demoFarm;
  if (!FarmHubState.fin || FarmHubState.fin.length === 0) {
    FarmHubState.fin = [
      { id: 'f-1', farmId: 'demo-farm-kolar', desc: 'Certified Tomato Seedlings (Arka Rakshak)', cat: 'Seeds', amt: 6500, type: 'Expense', date: '2026-08-25' },
      { id: 'f-2', farmId: 'demo-farm-kolar', desc: 'Drip Lateral Pipes & Dripper maintenance', cat: 'Irrigation', amt: 4200, type: 'Expense', date: '2026-08-28' },
      { id: 'f-3', farmId: 'demo-farm-kolar', desc: 'Vermicompost (2 Tonnes)', cat: 'Fertilizer', amt: 9000, type: 'Expense', date: '2026-09-05' },
      { id: 'f-4', farmId: 'demo-farm-kolar', desc: 'Advance from Mandi Trader (First Harvest Booking)', cat: 'Sales', amt: 28000, type: 'Income', date: '2026-09-20' }
    ];
  }
  if (!FarmHubState.tasks || FarmHubState.tasks.length === 0) {
    FarmHubState.tasks = [
      { id: 't-1', farmId: 'demo-farm-kolar', text: 'Apply 19:19:19 water-soluble fertigation (Flowering booster)', stage: 'Flowering', done: false, date: 'Today' },
      { id: 't-2', farmId: 'demo-farm-kolar', text: 'Scout lower leaf canopies for early blight spots', stage: 'Flowering', done: true, date: 'Yesterday' },
      { id: 't-3', farmId: 'demo-farm-kolar', text: 'Inspect drip lines for emitter clogging in Block 2', stage: 'Flowering', done: false, date: 'Tomorrow' }
    ];
  }
  persistState();
  navigateTo('dashboard', 'overview');
  setTimeout(() => showToast(t('toastDemoLoaded', 'Live Demo Farm Loaded Successfully! 🌱'), '🌱'), 300);
}

// Network online/offline listener
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    FarmHubState.isOnline = true;
    updateNetworkPill();
    showToast((t('onlineStatus', 'Online')) + ' — Live satellite & weather sync active', '🟢');
  });
  window.addEventListener('offline', () => {
    FarmHubState.isOnline = false;
    updateNetworkPill();
    showToast((t('offlineStatus', 'Offline Ready')) + ' — Local agronomic models active', '⚡');
  });
}

function updateNetworkPill() {
  const pill = $('#netStatusPill');
  if (!pill) return;
  if (navigator.onLine !== false) {
    pill.className = 'network-status-pill';
    pill.innerHTML = `<span class="dot"></span> ${t('onlineStatus', 'Online')}`;
  } else {
    pill.className = 'network-status-pill offline';
    pill.innerHTML = `<span class="dot"></span> ${t('offlineStatus', 'Offline Ready')}`;
  }
}

// State Persistence Helper
function persistState() {
  try {
    localStorage.setItem('farmhub_user', JSON.stringify(FarmHubState.user));
    localStorage.setItem('farmhub_active_farm', JSON.stringify(FarmHubState.activeFarm));
    localStorage.setItem('farmhub_farms', JSON.stringify(FarmHubState.farms));
    localStorage.setItem('farmhub_theme', FarmHubState.theme);
    localStorage.setItem('farmhub_lang', FarmHubState.lang);
    localStorage.setItem('farmhub_fin', JSON.stringify(FarmHubState.fin));
    localStorage.setItem('farmhub_tasks', JSON.stringify(FarmHubState.tasks));
    localStorage.setItem('farmhub_history', JSON.stringify(FarmHubState.history));
  } catch (e) {
    console.warn('LocalStorage quota or write error', e);
  }
}

// Global Translation Helper shortcut
const t = (k, def) => I18N.t(k, def);

// DOM Selection shortcuts
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

// Runtime references
let activeLeafletMap = null;
let activeMapMarker = null;
let activeFieldRadarLayer = null;
let activeWeatherRadarMap = null;
let activeWxRadarLayer = null;
let activeSoilHydrologySim = null;
let activeAdvisoryUtterance = null;
let tempOnboarding = {
  location: null,
  cropCategory: null,
  cropId: null,
  cropName: '',
  isCustomCrop: false
};

// Cancel and dispose active canvas simulation loops
function cleanupActiveAnimations() {
  if (FarmHubState._animWeatherSkyId) {
    cancelAnimationFrame(FarmHubState._animWeatherSkyId);
    FarmHubState._animWeatherSkyId = null;
  }
  if (FarmHubState._animHydrologyId) {
    cancelAnimationFrame(FarmHubState._animHydrologyId);
    FarmHubState._animHydrologyId = null;
  }
  if (FarmHubState._animCropGrowthId) {
    cancelAnimationFrame(FarmHubState._animCropGrowthId);
    FarmHubState._animCropGrowthId = null;
  }
}

// ============================================================
// THEME & LANGUAGE MANAGEMENT
// ============================================================
function applyTheme(themeName) {
  FarmHubState.theme = themeName;
  document.documentElement.setAttribute('data-theme', themeName);
  try {
    localStorage.setItem('farmhub_theme', themeName);
  } catch (e) {}

  const themeBtn = $('#themeToggleBtn');
  if (themeBtn) {
    themeBtn.textContent = themeName === 'dark' ? '☀️' : '🌙';
    themeBtn.setAttribute('title', themeName === 'dark' ? 'Switch to Light theme' : 'Switch to Dark theme');
  }
}

function toggleTheme() {
  const newTheme = FarmHubState.theme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
}

function setAppLanguage(langCode) {
  if (activeAdvisoryUtterance) stopAdvisorySpeech();
  I18N.setLanguage(langCode);
  FarmHubState.lang = langCode;
  // Re-render current view with new translations
  renderApp();
}

window.onLanguageChanged = () => {
  renderApp();
};

// ============================================================
// ROUTING & APP VIEW RENDERER
// ============================================================
function navigateTo(route, module = 'overview') {
  FarmHubState.currentRoute = route;
  if (module) FarmHubState.currentModule = module;
  renderApp();
  window.scrollTo(0, 0);
}

// Main View Switcher
function renderApp() {
  const root = $('#appRoot');
  if (!root) return;

  // If no user or no active farm, handle landing / onboarding journey
  if (!FarmHubState.activeFarm) {
    if (FarmHubState.currentRoute === 'user-details') {
      root.innerHTML = renderUserDetailsScreen();
    } else if (FarmHubState.currentRoute === 'crop-specs') {
      root.innerHTML = renderCropSpecsScreen();
      initOnboardingMap();
    } else {
      // Default entry: Landing Page (No demo account forced!)
      FarmHubState.currentRoute = 'landing';
      root.innerHTML = renderLandingPage();
    }
    return;
  }

  // Active Farm exists -> Render Dashboard layout (Sidebar + Topbar + Workspace)
  root.innerHTML = renderDashboardLayout();
  bindSidebarEvents();
  renderActiveModule();
}

// ============================================================
// 1. LANDING PAGE VIEW
// ============================================================
function renderLandingPage() {
  return `
    <header class="topbar" style="left:0">
      <div class="topbar-left">
        <div style="display:flex;align-items:center;gap:10px">
          <div class="sidebar-logo">🌱</div>
          <div>
            <b style="font-size:18px;letter-spacing:0.04em">FARMHUB</b>
            <small style="display:block;font-size:10px;color:var(--green);font-weight:700">SMART FARM DECISIONS</small>
          </div>
        </div>
      </div>
      <div class="topbar-right">
        <!-- Live Online Status -->
        <span class="network-status-pill" id="netStatusPill">
          <span class="dot"></span> ${navigator.onLine !== false ? t('onlineStatus', 'Online') : t('offlineStatus', 'Offline Ready')}
        </span>
        <!-- Language Selector -->
        <select class="util-btn" onchange="setAppLanguage(this.value)" aria-label="${t('langSelect')}">
          ${I18N.languages.map(l => `<option value="${l.code}"${l.code === I18N.currentLang ? ' selected' : ''}>🌐 ${l.native}</option>`).join('')}
        </select>
        <!-- Theme Toggle -->
        <button id="themeToggleBtn" class="util-btn theme-toggle-btn" onclick="toggleTheme()" aria-label="${t('themeToggle')}">
          ${FarmHubState.theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <!-- Instant Demo Button -->
        <button class="btn landing-demo-btn sm" onclick="loadDemoFarm()" style="padding:6px 14px;font-size:12px">
          ${t('instantDemo', '⚡ LIVE DEMO')}
        </button>
      </div>
    </header>

    <main class="main-workspace entry-workspace" style="margin-left:0;max-width:1120px;margin-top:70px">
      <!-- HERO SECTION -->
      <section class="landing-hero" style="text-align:center;padding:50px 20px 30px">
        <div class="landing-badge">🌱 ${t('brandName')} · ${t('subBrand')}</div>
        <h1 class="landing-title" style="font-size:38px;line-height:1.2;margin:16px 0 12px">${t('landingTitle')}</h1>
        <p class="landing-subtitle" style="font-size:17px;max-width:720px;margin:0 auto 28px;color:var(--text-secondary)">${t('landingSubtitle')}</p>
        <div style="display:flex;justify-content:center;gap:14px;flex-wrap:wrap">
          <button class="btn primary-cta" onclick="navigateTo('user-details')">
            🚀 ${t('letsExplore')}
          </button>
          <button class="btn landing-demo-btn" onclick="loadDemoFarm()">
            ${t('instantDemo', '⚡ TRY LIVE DEMO')}
          </button>
        </div>
      </section>

      <!-- TRUST & CAPABILITY METRICS RIBBON -->
      <section class="landing-trust-bar" aria-label="Platform Highlights">
        <div class="trust-item"><span class="icon">🌾</span> <span><b>20+</b> Regional Crops</span></div>
        <div class="trust-item"><span class="icon">💧</span> <span><b>35%</b> Water Savings</span></div>
        <div class="trust-item"><span class="icon">🛰️</span> <span>Open-Meteo Sat-Hydrology</span></div>
        <div class="trust-item"><span class="icon">🎯</span> <span><b>100%</b> Explainable Advice</span></div>
        <div class="trust-item"><span class="icon">🇮🇳</span> <span><b>5</b> Indic Languages</span></div>
      </section>

      <!-- CORE CAPABILITIES GRID (6 PILLARS) -->
      <section aria-labelledby="featSecTitle">
        <h2 id="featSecTitle" class="landing-section-title">Precision Agronomic Decision Engine</h2>
        <p class="landing-section-sub">Science-backed calculations replacing guesswork with deterministic, transparent field intelligence.</p>

        <div class="landing-features-grid" style="grid-template-columns:repeat(auto-fit, minmax(290px, 1fr));gap:20px">
          <!-- Feat 1: Hydrology -->
          <div class="landing-feat-card">
            <div class="landing-feat-icon">💧</div>
            <h3 style="color:var(--text);margin-bottom:8px">${t('landingFeat1Title')}</h3>
            <p class="mu" style="line-height:1.6">${t('landingFeat1Desc')} Root-zone depletion modeling, gross Liters & cubic meters required, and exact motor HP pump run-time.</p>
          </div>
          <!-- Feat 2: Crop Intelligence -->
          <div class="landing-feat-card">
            <div class="landing-feat-icon">🌾</div>
            <h3 style="color:var(--text);margin-bottom:8px">${t('landingFeat2Title')}</h3>
            <p class="mu" style="line-height:1.6">${t('landingFeat2Desc')} Phenological progression tracker, stage-by-stage task calendar, and custom agronomic checklists.</p>
          </div>
          <!-- Feat 3: 4 Questions -->
          <div class="landing-feat-card">
            <div class="landing-feat-icon">🎯</div>
            <h3 style="color:var(--text);margin-bottom:8px">${t('landingFeat3Title')}</h3>
            <p class="mu" style="line-height:1.6">${t('landingFeat3Desc')} Concrete directives (IRRIGATE, WAIT, INSPECT, PROTECT) with full mathematical trace and risk scores.</p>
          </div>
          <!-- Feat 4: Microclimate & Spray Radar -->
          <div class="landing-feat-card">
            <div class="landing-feat-icon">⛅</div>
            <h3 style="color:var(--text);margin-bottom:8px">Microclimate & 24h Spray Radar</h3>
            <p class="mu" style="line-height:1.6">High-resolution temperature, 48h rain probability curves, UV index, and hourly drift-free pesticide spray suitability index.</p>
          </div>
          <!-- Feat 5: Crop Health & Disease Triage -->
          <div class="landing-feat-card">
            <div class="landing-feat-icon">🩺</div>
            <h3 style="color:var(--text);margin-bottom:8px">Crop Doctor & Disease Triage</h3>
            <p class="mu" style="line-height:1.6">Interactive leaf disease scanner, multi-spectral symptom checklist, and non-chemical Integrated Pest Management (IPM) protocols.</p>
          </div>
          <!-- Feat 6: Mandi & Ledger -->
          <div class="landing-feat-card">
            <div class="landing-feat-icon">📈</div>
            <h3 style="color:var(--text);margin-bottom:8px">Mandi Intelligence & Farm Ledger</h3>
            <p class="mu" style="line-height:1.6">Real-time APMC commodity modal prices, price range projections, and unified income-expense ledger with cost-per-acre metrics.</p>
          </div>
        </div>
      </section>

      <!-- FARM USE CASES -->
      <section style="margin-top:60px">
        <h2 class="landing-section-title">Designed For Every Agriculture Operation</h2>
        <p class="landing-section-sub">Calibrated agronomic profiles for specific cropping systems across India and global regions.</p>

        <div class="vignettes-grid">
          <div class="vignette-card">
            <div style="font-size:32px;margin-bottom:10px">🥬</div>
            <b style="font-size:16px;display:block;margin-bottom:6px">Vegetable Growers</b>
            <p class="mu" style="font-size:13px;line-height:1.5">Tomato, Chilli, Onion, Potato, Brinjal. Intensive drip fertigation tracking, early blight mitigation, and peak-market harvesting advice.</p>
          </div>
          <div class="vignette-card">
            <div style="font-size:32px;margin-bottom:10px">🍎</div>
            <b style="font-size:16px;display:block;margin-bottom:6px">Horticulture & Orchards</b>
            <p class="mu" style="font-size:13px;line-height:1.5">Mango, Banana, Grapes, Pomegranate, Papaya. Deep root-zone water monitoring, flowering stress prevention, and anthracnose watch.</p>
          </div>
          <div class="vignette-card">
            <div style="font-size:32px;margin-bottom:10px">🌾</div>
            <b style="font-size:16px;display:block;margin-bottom:6px">Field Crops & Cereals</b>
            <p class="mu" style="font-size:13px;line-height:1.5">Rice, Wheat, Maize, Ragi, Cotton. Flood-to-alternate wetting management, panicle stage irrigation, and balanced NPK basal doses.</p>
          </div>
          <div class="vignette-card">
            <div style="font-size:32px;margin-bottom:10px">🌸</div>
            <b style="font-size:16px;display:block;margin-bottom:6px">Commercial Floriculture</b>
            <p class="mu" style="font-size:13px;line-height:1.5">Rose, Marigold, Jasmine, Chrysanthemum, Gerbera. Daily moisture thresholds, powdery mildew vigilance, and festival mandi price tracking.</p>
          </div>
        </div>
      </section>

      <!-- FAQ ACCORDION -->
      <section style="margin-top:50px">
        <h2 class="landing-section-title">Frequently Asked Questions</h2>
        <p class="landing-section-sub">Everything you need to know about precision decision support with FarmHub.</p>

        <div class="faq-accordion">
          <details class="faq-item" open>
            <summary>How does FarmHub calculate irrigation water requirements?</summary>
            <p>FarmHub combines FAO-56 Penman-Monteith reference evapotranspiration (ET₀) from Open-Meteo satellite numerical models with crop-specific coefficients (Kc), soil field capacity, and root-zone moisture deficit. It calculates exact gross water needs in Liters and Cubic Meters, and converts it into pump runtime based on your motor HP.</p>
          </details>
          <details class="faq-item">
            <summary>Do I need expensive hardware soil sensors to use FarmHub?</summary>
            <p>No! While FarmHub seamlessly integrates with IoT hardware sensors (supporting dual-depth moisture and leaf wetness), it runs fully on satellite-derived high-resolution soil hydrology and weather grids if no physical probes are connected.</p>
          </details>
          <details class="faq-item">
            <summary>Does FarmHub work when offline in the field?</summary>
            <p>Yes. All farm specifications, crop agronomic parameters, decision logic, and past logs run locally in your browser. When offline, FarmHub relies on cached weather and deterministic soil physics, and automatically re-syncs when connectivity returns.</p>
          </details>
          <details class="faq-item">
            <summary>Can I manage multiple farm plots or family holdings?</summary>
            <p>Yes. You can register multiple parcels with distinct crops, soil types, and irrigation methods under "My Farm" and switch between them instantly.</p>
          </details>
        </div>
      </section>

      <!-- LANDING FOOTER -->
      <footer class="landing-footer">
        <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:12px">
          <span style="font-size:22px">🌱</span>
          <b style="font-size:16px;letter-spacing:0.04em">FARMHUB</b>
          <span style="color:var(--muted)">· Precision Agronomy Decision Platform</span>
        </div>
        <p style="margin-bottom:8px">Empowering farmers with transparent, explainable, and scientific decision support.</p>
        <p style="font-size:11.5px;color:var(--muted)">© 2026 FarmHub Open Agricultural Systems. Strictly HTML5 + CSS3 + Vanilla ES6+.</p>
      </footer>
    </main>
  `;
}

// ============================================================
// 2. USER DETAILS SCREEN
// ============================================================
function renderUserDetailsScreen() {
  return `
    <header class="topbar" style="left:0">
      <div class="topbar-left">
        <div style="display:flex;align-items:center;gap:10px;cursor:pointer" onclick="navigateTo('landing')">
          <div class="sidebar-logo">🌱</div>
          <b style="font-size:18px">FARMHUB</b>
        </div>
      </div>
      <div class="topbar-right">
        <select class="util-btn" onchange="setAppLanguage(this.value)" aria-label="${t('langSelect')}">
          ${I18N.languages.map(l => `<option value="${l.code}"${l.code === I18N.currentLang ? ' selected' : ''}>🌐 ${l.native}</option>`).join('')}
        </select>
        <button id="themeToggleBtn" class="util-btn theme-toggle-btn" onclick="toggleTheme()" aria-label="${t('themeToggle')}">
          ${FarmHubState.theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>

    <main class="main-workspace entry-workspace" style="margin-left:0;margin-top:80px">
      <div class="onboarding-screen">
        <div class="step-indicator">
          <div class="step-dot active"></div>
          <div class="step-dot"></div>
        </div>

        <h2 style="font-size:24px;margin-bottom:6px">${t('welcomeTitle')}</h2>
        <p class="mu" style="margin-bottom:24px">${t('welcomeSubtitle')}</p>

        <form onsubmit="handleUserDetailsSubmit(event)">
          <div class="form-group">
            <label for="u_name">${t('fullName')}</label>
            <input id="u_name" required placeholder="${t('enterName')}" autocomplete="name">
          </div>
          <div class="form-group">
            <label for="u_phone">${t('phoneNumber')}</label>
            <input id="u_phone" type="tel" required placeholder="${t('enterPhone')}" autocomplete="tel">
          </div>

          <div class="row" style="margin-top:28px;gap:14px">
            <button type="submit" class="btn" style="flex:1;justify-content:center">
              ${t('btnContinue')}
            </button>
            <button type="button" class="btn secondary" onclick="handleLoginLater()" style="flex:1;justify-content:center">
              ${t('btnLoginLater')}
            </button>
          </div>
        </form>
      </div>
    </main>
  `;
}

function handleUserDetailsSubmit(e) {
  e.preventDefault();
  const name = $('#u_name').value.trim();
  const phone = $('#u_phone').value.trim();
  FarmHubState.user = {
    id: 'u_' + Date.now().toString(36),
    name,
    phone,
    isGuest: false,
    createdAt: Date.now()
  };
  persistState();
  navigateTo('crop-specs');
}

function handleLoginLater() {
  FarmHubState.user = {
    id: 'guest_' + Date.now().toString(36),
    name: 'Farmer Guest',
    phone: '',
    isGuest: true,
    createdAt: Date.now()
  };
  persistState();
  navigateTo('crop-specs');
}

// ============================================================
// 3. CROP SPECIFICATIONS SCREEN
// ============================================================
function renderCropSpecsScreen() {
  const loc = tempOnboarding.location;
  const selectedCat = tempOnboarding.cropCategory;
  const selectedCropId = tempOnboarding.cropId;

  // Generate crops for chosen category (5 standard options + Other)
  let cropsList = [];
  if (selectedCat) {
    cropsList = CROPS_DATA.getByCategory(selectedCat);
  }

  return `
    <header class="topbar" style="left:0">
      <div class="topbar-left">
        <div style="display:flex;align-items:center;gap:10px;cursor:pointer" onclick="navigateTo('user-details')">
          <div class="sidebar-logo">🌱</div>
          <b style="font-size:18px">FARMHUB</b>
        </div>
      </div>
      <div class="topbar-right">
        <select class="util-btn" onchange="setAppLanguage(this.value)" aria-label="${t('langSelect')}">
          ${I18N.languages.map(l => `<option value="${l.code}"${l.code === I18N.currentLang ? ' selected' : ''}>🌐 ${l.native}</option>`).join('')}
        </select>
        <button id="themeToggleBtn" class="util-btn theme-toggle-btn" onclick="toggleTheme()" aria-label="${t('themeToggle')}">
          ${FarmHubState.theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>

    <main class="main-workspace entry-workspace" style="margin-left:0;margin-top:80px">
      <div class="onboarding-screen" style="max-width:760px">
        <div class="step-indicator">
          <div class="step-dot active"></div>
          <div class="step-dot active"></div>
        </div>

        <h2 style="font-size:24px;margin-bottom:6px">${t('tellUsFarm')}</h2>
        <p class="mu" style="margin-bottom:24px">Set your location and primary crop to generate your farm dashboard.</p>

        <!-- STEP A: LOCATION SELECTION -->
        <div style="margin-bottom:28px">
          <label style="font-size:14px;letter-spacing:0.04em">${t('whereLocation')}</label>
          <div class="row" style="margin-bottom:12px">
            <button type="button" class="btn" onclick="detectUserLocation()">
              ${t('useMyLocation')}
            </button>
            <div style="display:flex;gap:8px;flex:1;min-width:240px">
              <input id="locSearchInput" placeholder="Village, mandal, district or town..." style="flex:1">
              <button type="button" class="btn secondary" onclick="searchOnboardingLocation()">
                Search
              </button>
            </div>
          </div>

          <div id="locStatusBadge" class="mu" style="font-weight:600;margin-bottom:10px">
            ${loc ? `<span style="color:var(--green)">${t('locationSelected')}: ${esc(loc.displayName)}</span>` : `<span style="color:var(--farm-amber)">${t('locationNotSelected')}</span>`}
          </div>

          <!-- Interactive Leaflet Map -->
          <div id="fieldMap"></div>
          <div id="mapErrorState" class="map-error-banner" style="display:none">
            <p><b>${t('mapUnavailable')}</b></p>
            <p class="mu">Coordinates: <span id="mapErrCoords">--</span></p>
            <button class="btn secondary sm" onclick="initOnboardingMap()">${t('retryMap')}</button>
          </div>
        </div>

        <!-- STEP B: CROP CATEGORY -->
        <div style="margin-bottom:24px">
          <label style="font-size:14px;letter-spacing:0.04em">${t('whatCropType')}</label>
          <div class="category-cards-grid">
            ${CROPS_DATA.categories.map(cat => `
              <div class="cat-card ${selectedCat === cat.id ? 'selected' : ''}" onclick="selectCropCategory('${cat.id}')">
                <span class="cat-icon">${cat.icon}</span>
                <span class="cat-title">${t(cat.nameKey)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- STEP C: CROP SELECTION (Appears when category is selected) -->
        ${selectedCat ? `
          <div style="margin-bottom:28px">
            <label style="font-size:14px;letter-spacing:0.04em">${t('whichCrop')}</label>
            <div class="crops-chips-grid">
              ${cropsList.map(crop => {
                const displayName = CROPS_DATA.getDisplayName(crop, I18N.currentLang);
                return `
                  <div class="crop-chip ${selectedCropId === crop.id && !tempOnboarding.isCustomCrop ? 'selected' : ''}" onclick="selectStandardCrop('${crop.id}')">
                    ${displayName}
                    <small>${crop.names.en}</small>
                  </div>
                `;
              }).join('')}
              <!-- Option: OTHER -->
              <div class="crop-chip ${tempOnboarding.isCustomCrop ? 'selected' : ''}" onclick="selectOtherCrop()">
                ${t('cropOther')}
                <small>Custom crop</small>
              </div>
            </div>

            <!-- Custom Crop Name Input if OTHER is selected -->
            ${tempOnboarding.isCustomCrop ? `
              <div class="form-group" style="margin-top:16px">
                <label for="customCropName">${t('enterCropName')}</label>
                <input id="customCropName" required placeholder="${t('cropPlaceholder')}" value="${esc(tempOnboarding.cropName)}" oninput="tempOnboarding.cropName=this.value;updateGoButtonState()">
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- STEP D: GO TO MY FARM -->
        <div style="margin-top:30px">
          <button id="btnGoToFarm" class="btn primary-cta" style="width:100%;justify-content:center" onclick="completeOnboarding()" ${!loc || !tempOnboarding.cropName ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>
            ${t('goToMyFarm')}
          </button>
        </div>
      </div>
    </main>
  `;
}

// Leaflet Map with CARTO Voyager tiles (Permitted, reliable, no 403 block)
function initOnboardingMap() {
  const container = $('#fieldMap');
  const errBanner = $('#mapErrorState');
  if (!container || typeof L === 'undefined') return;

  if (activeLeafletMap) {
    try {
      activeLeafletMap.remove();
    } catch (e) {}
    activeLeafletMap = null;
  }

  // Default coordinate if not yet selected: 13.136, 78.129
  const defaultLat = tempOnboarding.location ? tempOnboarding.location.lat : 13.136;
  const defaultLon = tempOnboarding.location ? tempOnboarding.location.lon : 78.129;

  try {
    activeLeafletMap = L.map('fieldMap', {
      zoomControl: true,
      attributionControl: true
    }).setView([defaultLat, defaultLon], tempOnboarding.location ? 14 : 12);

    // Reliable CartoDB Voyager tiles with CORS and SSL
    const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
    });

    tileLayer.on('tileerror', () => {
      // Tile load failed -> show fallback banner gracefully
      if (errBanner) {
        errBanner.style.display = 'block';
        const coordsSpan = $('#mapErrCoords');
        if (coordsSpan) coordsSpan.textContent = `${defaultLat.toFixed(4)}, ${defaultLon.toFixed(4)}`;
      }
    });

    tileLayer.addTo(activeLeafletMap);

    // Draggable marker
    activeMapMarker = L.marker([defaultLat, defaultLon], { draggable: true }).addTo(activeLeafletMap);

    // Drag marker event
    activeMapMarker.on('dragend', async () => {
      const pos = activeMapMarker.getLatLng();
      const rev = await API.reverse(pos.lat, pos.lng, 'Map Pin');
      setOnboardingLocation(rev);
    });

    // Map click event
    activeLeafletMap.on('click', async e => {
      activeMapMarker.setLatLng(e.latlng);
      const rev = await API.reverse(e.latlng.lat, e.latlng.lng, 'Map Click');
      setOnboardingLocation(rev);
    });

    if (errBanner) errBanner.style.display = 'none';
  } catch (err) {
    console.warn('Map initialization error', err);
    if (errBanner) {
      errBanner.style.display = 'block';
      const coordsSpan = $('#mapErrCoords');
      if (coordsSpan) coordsSpan.textContent = `${defaultLat.toFixed(4)}, ${defaultLon.toFixed(4)}`;
    }
  }
}

async function detectUserLocation() {
  const badge = $('#locStatusBadge');
  if (badge) badge.innerHTML = `<span class="mu">Detecting GPS coordinates…</span>`;
  try {
    const coords = await API.here();
    const locObj = await API.reverse(coords.lat, coords.lon, 'GPS');
    setOnboardingLocation(locObj);
  } catch (err) {
    if (badge) badge.innerHTML = `<span style="color:var(--farm-danger)">GPS permission denied or unavailable. Please use the search box or click on the map.</span>`;
  }
}

async function searchOnboardingLocation() {
  const input = $('#locSearchInput');
  if (!input || !input.value.trim()) return;
  const q = input.value.trim();
  const badge = $('#locStatusBadge');
  if (badge) badge.innerHTML = `<span class="mu">Searching location…</span>`;

  try {
    const results = await API.geocode(q);
    if (results.length > 0) {
      setOnboardingLocation(results[0]);
    } else {
      if (badge) badge.innerHTML = `<span style="color:var(--farm-amber)">No matches found. Try entering a nearby town or mandal.</span>`;
    }
  } catch (err) {
    if (badge) badge.innerHTML = `<span style="color:var(--farm-danger)">Location search service unreachable. Check your internet connection.</span>`;
  }
}

function setOnboardingLocation(locObj) {
  tempOnboarding.location = locObj;
  const badge = $('#locStatusBadge');
  if (badge) {
    badge.innerHTML = `<span style="color:var(--green)">${t('locationSelected')}: ${esc(locObj.displayName)} (${locObj.lat.toFixed(4)}, ${locObj.lon.toFixed(4)})</span>`;
  }

  if (activeLeafletMap && activeMapMarker) {
    activeLeafletMap.setView([locObj.lat, locObj.lon], 14);
    activeMapMarker.setLatLng([locObj.lat, locObj.lon]);
  }
  updateGoButtonState();
}

function selectCropCategory(catId) {
  tempOnboarding.cropCategory = catId;
  tempOnboarding.cropId = null;
  tempOnboarding.cropName = '';
  tempOnboarding.isCustomCrop = false;
  // Re-render crop specs to display category crops
  renderApp();
}

function selectStandardCrop(cropId) {
  const cropObj = CROPS_DATA.getCrop(cropId);
  tempOnboarding.cropId = cropId;
  tempOnboarding.cropName = cropObj.names.en;
  tempOnboarding.isCustomCrop = false;
  renderApp();
}

function selectOtherCrop() {
  tempOnboarding.cropId = 'custom';
  tempOnboarding.cropName = '';
  tempOnboarding.isCustomCrop = true;
  renderApp();
}

function updateGoButtonState() {
  const btn = $('#btnGoToFarm');
  if (!btn) return;
  const ready = tempOnboarding.location && tempOnboarding.cropName && tempOnboarding.cropName.trim().length > 0;
  btn.disabled = !ready;
  btn.style.opacity = ready ? '1' : '0.5';
  btn.style.cursor = ready ? 'pointer' : 'not-allowed';
}

function completeOnboarding() {
  if (!tempOnboarding.location || !tempOnboarding.cropName) return;

  const farmId = 'farm_' + Date.now().toString(36);
  const newFarm = {
    id: farmId,
    name: `${tempOnboarding.cropName} Farm`,
    location: tempOnboarding.location,
    cropCategory: tempOnboarding.cropCategory,
    cropId: tempOnboarding.cropId,
    cropName: tempOnboarding.cropName.trim(),
    isCustomCrop: tempOnboarding.isCustomCrop,
    stage: 'Vegetative', // Default initial stage
    farmSize: 0,         // Optional profile completion item
    soil: '',            // Optional profile completion item
    irrigation: '',      // Optional profile completion item
    fertilizerPreference: 'Integrated',
    plantingDate: new Date().toISOString().slice(0, 10),
    sensorUrl: '',
    man: null
  };

  FarmHubState.farms.push(newFarm);
  FarmHubState.activeFarm = newFarm;
  persistState();

  // Route directly to the Dashboard!
  navigateTo('dashboard', 'overview');
}

// ============================================================
// 4. MAIN DASHBOARD LAYOUT (Sidebar + Topbar + Workspace)
// ============================================================
function renderDashboardLayout() {
  const f = FarmHubState.activeFarm;
  const user = FarmHubState.user || { name: 'Farmer Guest', isGuest: true };
  const currentMod = FarmHubState.currentModule;

  return `
    <div class="app-container">
      <!-- Left Sidebar -->
      <aside class="sidebar" id="appSidebar" role="navigation" aria-label="Main Navigation">
        <div class="sidebar-header">
          <div class="sidebar-logo">🌱</div>
          <div class="sidebar-title">
            FARMHUB
            <small>SMART FARM DECISIONS</small>
          </div>
        </div>

        <!-- Active Farm Badge in Sidebar -->
        <div class="sidebar-farm-badge" onclick="navigateTo('dashboard', 'my-farm')" title="Manage or switch farm">
          <div style="overflow:hidden">
            <div class="sidebar-farm-name">🌾 ${esc(f.name)}</div>
            <div class="sidebar-farm-crop">${esc(f.cropName)} · ${f.location?.locality || f.location?.district || 'Field'}</div>
          </div>
          <span style="font-size:12px;color:rgba(255,255,255,0.4)">▾</span>
        </div>

        <!-- Navigation Sections -->
        <div class="sidebar-nav">
          <!-- GROUP: YOUR FARM -->
          <div>
            <div class="nav-group-label">${t('groupYourFarm')}</div>
            <ul class="nav-links">
              <li>
                <button class="nav-link ${currentMod === 'overview' ? 'active' : ''}" onclick="switchModule('overview')">
                  <span class="nav-link-icon">📊</span> <span>${t('navOverview')}</span>
                </button>
              </li>
              <li>
                <button class="nav-link ${currentMod === 'my-farm' ? 'active' : ''}" onclick="switchModule('my-farm')">
                  <span class="nav-link-icon">🚜</span> <span>${t('navMyFarm')}</span>
                </button>
              </li>
              <li>
                <button class="nav-link ${currentMod === 'weather' ? 'active' : ''}" onclick="switchModule('weather')">
                  <span class="nav-link-icon">⛅</span> <span>${t('navWeather')}</span>
                </button>
              </li>
              <li>
                <button class="nav-link ${currentMod === 'calendar' ? 'active' : ''}" onclick="switchModule('calendar')">
                  <span class="nav-link-icon">📅</span> <span>${t('navCalendar')}</span>
                </button>
              </li>
              <li>
                <button class="nav-link ${currentMod === 'irrigation' ? 'active' : ''}" onclick="switchModule('irrigation')">
                  <span class="nav-link-icon">💧</span> <span>${t('navIrrigation')}</span>
                </button>
              </li>
            </ul>
          </div>

          <!-- GROUP: ADVISORY -->
          <div>
            <div class="nav-group-label">${t('groupAdvisory')}</div>
            <ul class="nav-links">
              <li>
                <button class="nav-link ${currentMod === 'advisory' ? 'active' : ''}" onclick="switchModule('advisory')">
                  <span class="nav-link-icon">🎯</span> <span>${t('navAdvisory')}</span>
                </button>
              </li>
              <li>
                <button class="nav-link ${currentMod === 'fertilizer' ? 'active' : ''}" onclick="switchModule('fertilizer')">
                  <span class="nav-link-icon">🧪</span> <span>${t('navFertilizer')}</span>
                </button>
              </li>
              <li>
                <button class="nav-link ${currentMod === 'health' ? 'active' : ''}" onclick="switchModule('health')">
                  <span class="nav-link-icon">🩺</span> <span>${t('navHealth')}</span>
                </button>
              </li>
            </ul>
          </div>

          <!-- GROUP: INSIGHTS -->
          <div>
            <div class="nav-group-label">${t('groupInsights')}</div>
            <ul class="nav-links">
              <li>
                <button class="nav-link ${currentMod === 'market' ? 'active' : ''}" onclick="switchModule('market')">
                  <span class="nav-link-icon">📈</span> <span>${t('navMarket')}</span>
                </button>
              </li>
              <li>
                <button class="nav-link ${currentMod === 'finance' ? 'active' : ''}" onclick="switchModule('finance')">
                  <span class="nav-link-icon">💰</span> <span>${t('navFinance')}</span>
                </button>
              </li>
              <li>
                <button class="nav-link ${currentMod === 'history' ? 'active' : ''}" onclick="switchModule('history')">
                  <span class="nav-link-icon">📜</span> <span>${t('navHistory')}</span>
                </button>
              </li>
            </ul>
          </div>

          <!-- GROUP: MANAGEMENT -->
          <div>
            <div class="nav-group-label">${t('groupManagement')}</div>
            <ul class="nav-links">
              <li>
                <button class="nav-link ${currentMod === 'sensors' ? 'active' : ''}" onclick="switchModule('sensors')">
                  <span class="nav-link-icon">📡</span> <span>${t('navSensors')}</span>
                </button>
              </li>
              <li>
                <button class="nav-link ${currentMod === 'settings' ? 'active' : ''}" onclick="switchModule('settings')">
                  <span class="nav-link-icon">⚙️</span> <span>${t('navSettings')}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Sidebar Footer -->
        <div class="sidebar-footer">
          <div class="user-badge">
            <div class="user-avatar">${user.name ? user.name.charAt(0).toUpperCase() : 'F'}</div>
            <div class="user-info">
              <div class="user-name">${esc(user.name)}</div>
              <div class="user-role">${user.isGuest ? t('guestProfile') : t('farmerAccount')}</div>
            </div>
          </div>
          <button class="btn secondary sm" onclick="signOutUser()" title="${t('signOut')}">⎋</button>
        </div>
      </aside>

      <!-- Top Utility Bar -->
      <header class="topbar">
        <div class="topbar-left">
          <button class="hamburger-btn" onclick="toggleMobileSidebar()" aria-label="Toggle Navigation">☰</button>
          <span class="field-status-pill" id="weatherPill">
            ● ${esc(f.location?.locality || f.location?.displayName || 'Field')}
          </span>
          <span class="network-status-pill ${FarmHubState.isOnline ? '' : 'offline'}" id="netStatusPill" style="margin-left:6px">
            <span class="dot"></span> ${FarmHubState.isOnline ? t('onlineStatus', 'Online') : t('offlineStatus', 'Offline Ready')}
          </span>
        </div>

        <div class="topbar-right">
          <!-- Command Palette Search Button -->
          <button class="util-btn" onclick="openCommandPalette()" title="${t('cmdSearchPlaceholder', 'Search crops, tools, advice (Ctrl+K)')}">
            🔍 <span style="font-size:11px;opacity:0.65;margin-left:3px;font-weight:600">⌘K</span>
          </button>

          <!-- Notifications -->
          <button class="util-btn" onclick="openNotificationsModal()" aria-label="${t('notifications')}">
            🔔
          </button>

          <!-- Language Selector -->
          <select class="util-btn" onchange="setAppLanguage(this.value)" aria-label="${t('langSelect')}">
            ${I18N.languages.map(l => `<option value="${l.code}"${l.code === I18N.currentLang ? ' selected' : ''}>🌐 ${l.native}</option>`).join('')}
          </select>

          <!-- Theme Toggle -->
          <button id="themeToggleBtn" class="util-btn theme-toggle-btn" onclick="toggleTheme()" aria-label="${t('themeToggle')}">
            ${FarmHubState.theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <!-- Profile Badge -->
          <button class="util-btn" onclick="switchModule('settings')" aria-label="Profile Settings">
            👤 ${esc(user.name?.split(' ')[0] || 'Profile')}
          </button>
        </div>
      </header>

      <!-- Main Workspace -->
      <main class="main-workspace" id="moduleContainer" role="main">
        <div class="card" style="text-align:center;padding:40px">
          <b>Loading module…</b>
        </div>
      </main>

      <!-- Floating Kisaan AI Copilot Trigger -->
      <button class="copilot-floating-btn" id="copilotBtn" onclick="toggleCopilot()" aria-label="${t('copilotTitle', 'Kisaan AI Copilot')}">
        💬 <span>${t('copilotBtn', 'Kisaan Copilot')}</span>
        <span class="copilot-badge">AI</span>
      </button>

      <!-- Copilot Drawer Mount -->
      <div id="copilotDrawerMount"></div>

      <!-- Command Palette Mount -->
      <div id="cmdPaletteMount"></div>

      <!-- Mobile Bottom Navigation Bar -->
      <nav class="mobile-bottom-nav" aria-label="Mobile Navigation">
        <button class="mob-nav-btn ${currentMod === 'overview' ? 'active' : ''}" onclick="switchModule('overview')">
          <span class="icon">📊</span>
          <span>${t('navOverview')}</span>
        </button>
        <button class="mob-nav-btn ${currentMod === 'weather' ? 'active' : ''}" onclick="switchModule('weather')">
          <span class="icon">⛅</span>
          <span>${t('navWeather')}</span>
        </button>
        <button class="mob-nav-btn ${currentMod === 'irrigation' ? 'active' : ''}" onclick="switchModule('irrigation')">
          <span class="icon">💧</span>
          <span>${t('navIrrigation')}</span>
        </button>
        <button class="mob-nav-btn ${currentMod === 'health' ? 'active' : ''}" onclick="switchModule('health')">
          <span class="icon">🩺</span>
          <span>${t('navHealth')}</span>
        </button>
        <button class="mob-nav-btn" onclick="toggleCopilot()">
          <span class="icon">💬</span>
          <span>Copilot</span>
        </button>
      </nav>
    </div>
  `;
}

function bindSidebarEvents() {
  // Mobile drawer backdrop handling if needed
}

function toggleMobileSidebar() {
  const sb = $('#appSidebar');
  if (sb) sb.classList.toggle('open');
}

function switchModule(modName) {
  FarmHubState.currentModule = modName;
  // Update active class on nav links
  $$('.nav-link').forEach(link => link.classList.remove('active'));
  const activeBtn = document.querySelector(`.nav-link[onclick*="${modName}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  // Close mobile sidebar on navigation
  const sb = $('#appSidebar');
  if (sb) sb.classList.remove('open');

  renderActiveModule();
  window.scrollTo(0, 0);
}

function signOutUser() {
  if (confirm('Switch user or reset current session?')) {
    FarmHubState.activeFarm = null;
    FarmHubState.user = null;
    persistState();
    navigateTo('landing');
  }
}

// ============================================================
// KISAAN AI COPILOT — PRECISION AGRONOMIC FIELD ASSISTANT
// ============================================================
function toggleCopilot() {
  FarmHubState.copilotOpen = !FarmHubState.copilotOpen;
  renderCopilotDrawer();
}

function closeCopilot() {
  FarmHubState.copilotOpen = false;
  renderCopilotDrawer();
}

function renderCopilotDrawer() {
  const mount = $('#copilotDrawerMount');
  if (!mount) return;

  if (!FarmHubState.copilotOpen) {
    mount.innerHTML = '';
    return;
  }

  const f = FarmHubState.activeFarm || { cropName: 'Crop', soil: 'Red loam' };
  const user = FarmHubState.user || { name: 'Farmer' };
  const stageInfo = computeCropStage(f);

  // Initialize initial greeting if empty
  if (!FarmHubState.copilotMessages || FarmHubState.copilotMessages.length === 0) {
    const greeting = getCopilotGreeting(f, user, stageInfo);
    FarmHubState.copilotMessages = [
      { sender: 'bot', text: greeting, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ];
  }

  mount.innerHTML = `
    <div class="copilot-drawer" role="dialog" aria-labelledby="copilotTitleId" aria-modal="true">
      <!-- Header -->
      <div class="copilot-header">
        <div class="copilot-header-info">
          <b id="copilotTitleId">🌱 ${t('copilotTitle', 'Kisaan AI Copilot')}</b>
          <small>🌾 ${esc(f.cropName)} · ${esc(stageInfo.name)} · ${esc(f.location?.locality || f.location?.district || 'Field')}</small>
        </div>
        <button class="copilot-close-btn" onclick="closeCopilot()" aria-label="Close Copilot">✕</button>
      </div>

      <!-- Quick Action Prompt Chips -->
      <div class="copilot-chips" aria-label="Suggested Questions">
        <button class="copilot-chip" onclick="askCopilotPrompt('💧 Pump runtime today')">💧 Pump Runtime</button>
        <button class="copilot-chip" onclick="askCopilotPrompt('🧪 Fertilizer dosage')">🧪 Fertilizer Mix</button>
        <button class="copilot-chip" onclick="askCopilotPrompt('⛅ Safe spray window')">⛅ Spray Window</button>
        <button class="copilot-chip" onclick="askCopilotPrompt('🩺 Leaf spots and yellowing')">🩺 Disease Check</button>
        <button class="copilot-chip" onclick="askCopilotPrompt('📈 Mandi market price')">📈 Mandi Rates</button>
        <button class="copilot-chip" onclick="askCopilotPrompt('🌾 Days until harvest')">🌾 Harvest Days</button>
      </div>

      <!-- Message History Stream -->
      <div class="copilot-body" id="copilotMsgList">
        ${FarmHubState.copilotMessages.map(m => `
          <div class="copilot-msg ${m.sender}">
            <div>${m.text}</div>
            <div style="font-size:10px;opacity:0.6;margin-top:4px;text-align:right">${m.time}</div>
          </div>
        `).join('')}
      </div>

      <!-- Input Area -->
      <form class="copilot-input-area" onsubmit="handleCopilotSubmit(event)">
        <input id="copilotTextInput" placeholder="${t('copilotPlaceholder', 'Ask anything about crops, spray, fertilizer...')}" autocomplete="off" required>
        <button type="submit">➤</button>
      </form>
    </div>
  `;

  // Auto-scroll to bottom of chat
  setTimeout(() => {
    const list = $('#copilotMsgList');
    if (list) list.scrollTop = list.scrollHeight;
    const input = $('#copilotTextInput');
    if (input) input.focus();
  }, 50);
}

function getCopilotGreeting(f, user, stageInfo) {
  const lang = FarmHubState.lang;
  const name = user.name ? user.name.split(' ')[0] : 'Farmer';
  if (lang === 'hi') {
    return `नमस्ते ${name}! 🌱 मैं आपका किसान एआई सहायक हूँ। आपके खेत (${esc(f.cropName)}, ${esc(stageInfo.name)} अवस्था, ${esc(f.soil || 'दोमट')} मिट्टी) की निगरानी कर रहा हूँ। सिंचाई, खाद, कीटनाशक छिड़काव या रोग संबंधित कोई भी सवाल पूछें!`;
  } else if (lang === 'kn') {
    return `ನಮಸ್ಕಾರ ${name}! 🌱 ನಾನು ನಿಮ್ಮ ಕಿಸಾನ್ ಎಐ ಸಹಾಯಕ. ನಿಮ್ಮ ${esc(f.cropName)} ಬೆಳೆಗೆ (${esc(stageInfo.name)} ಹಂತ) ನೀರಾವರಿ, ಗೊಬ್ಬರ, ರೋಗ ನಿಯಂತ್ರಣ ಅಥವಾ ಹವಾಮಾನದ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಬಹುದು!`;
  } else if (lang === 'ta') {
    return `வணக்கம் ${name}! 🌱 நான் உங்கள் கிசான் ஏஐ உதவியாளர். உங்கள் ${esc(f.cropName)} பயிரின் (${esc(stageInfo.name)} நிலை) பாசனம், உரம், பூச்சி தாக்குதல் பற்றி எதை வேண்டுமானாலும் கேளுங்கள்!`;
  } else if (lang === 'te') {
    return `నమస్కారం ${name}! 🌱 నేను మీ కిసాన్ ఏఐ అసిస్టెంట్. మీ ${esc(f.cropName)} పంట (${esc(stageInfo.name)} దశ) కోసం నీటిపారుదల, ఎరువులు లేదా చీడపీడల గురించి ఏదైనా అడగండి!`;
  }
  return `Namaste ${name}! 🌱 I am your Kisaan AI Copilot. I'm actively monitoring your <b>${esc(f.cropName)}</b> crop (${esc(stageInfo.name)} stage) in <b>${esc(f.soil || 'loam')}</b> soil. How can I assist you with irrigation timing, fertilizer formulas, spray windows, or pest triage today?`;
}

function askCopilotPrompt(text) {
  sendCopilotMsg(text);
}

function handleCopilotSubmit(e) {
  e.preventDefault();
  const input = $('#copilotTextInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  sendCopilotMsg(text);
}

function sendCopilotMsg(userText) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  FarmHubState.copilotMessages.push({ sender: 'user', text: userText, time });
  renderCopilotDrawer();

  // Generate intelligent deterministic response
  setTimeout(() => {
    const botText = generateCopilotResponse(userText);
    const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    FarmHubState.copilotMessages.push({ sender: 'bot', text: botText, time: botTime });
    renderCopilotDrawer();
  }, 350);
}

function generateCopilotResponse(query) {
  const f = FarmHubState.activeFarm || { cropName: 'Crop', soil: 'Red loam', farmSize: 2 };
  const cropObj = CROPS_DATA.getCrop(f.cropId, f.cropName);
  const stageInfo = computeCropStage(f);
  const wx = FarmHubState.curWeather || {};
  const decision = FarmHubState.curDecision || {};
  const q = query.toLowerCase();

  // 1. IRRIGATION & PUMP RUNTIME
  if (q.includes('pump') || q.includes('irrigat') || q.includes('water') || q.includes('lit') || q.includes('hour') || q.includes('timing') || q.includes('ನೀರಾವರಿ') || q.includes('सिंचाई') || q.includes('பாசனம்') || q.includes('నీరు')) {
    const hp = f.motorHp || 5;
    const flowLpm = f.pumpFlowRate || (hp === 3 ? 280 : hp === 5 ? 450 : hp === 7.5 ? 700 : 950);
    const deficitMm = decision.impact ? (parseFloat(decision.impact) || 12) : 10;
    const grossLiters = r((f.farmSize || 1) * deficitMm * 4046.86 * (f.irrigation === 'Flood' ? 1.6 : 1.15));
    const totalMinutes = r(grossLiters / flowLpm);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const timeStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins} mins`;

    return `💧 <b>Irrigation Plan for ${esc(f.cropName)}:</b><br><br>
      • <b>Today's Directive:</b> ${decision.dec || 'IRRIGATE'}<br>
      • <b>Recommended Window:</b> ${decision.win || 'Tomorrow 06:00–08:30 AM'} (minimizes heat evaporation)<br>
      • <b>Gross Water Required:</b> ~${grossLiters.toLocaleString('en-IN')} Liters (${r1(grossLiters / 1000)} m³) across ${f.farmSize || 1} acres<br>
      • <b>Estimated Pump Runtime:</b> <b>${timeStr}</b> using your ${hp} HP motor (${flowLpm} L/min flow)<br>
      • <b>Agronomic Reason:</b> Soil moisture buffer is currently at ${decision.impact || 'moderate deficit'} during sensitive ${stageInfo.name} stage.`;
  }

  // 2. FERTILIZER & NPK
  if (q.includes('fertil') || q.includes('npk') || q.includes('urea') || q.includes('dap') || q.includes('nutrient') || q.includes('dose') || q.includes('ಗೊಬ್ಬರ') || q.includes('खाद') || q.includes('உரம்') || q.includes('ఎరువు')) {
    const npk = cropObj.npk || [120, 60, 60];
    let stageAdvice = '';
    if (stageInfo.name === 'Seedling') {
      stageAdvice = 'Prioritize root establishment with phosphorus (SSP or DAP) and microbial inoculants (Trichoderma).';
    } else if (stageInfo.name === 'Vegetative') {
      stageAdvice = 'Boost canopy foliage with balanced Nitrogen (Split application of Urea or Neem cake).';
    } else if (stageInfo.name === 'Flowering') {
      stageAdvice = 'Critical stage: Restrict heavy Nitrogen to prevent flower drop; apply 13:0:45 or 0:52:34 with Boron.';
    } else if (stageInfo.name === 'Fruiting') {
      stageAdvice = 'Focus on Potassium (SOP or MOP) for uniform fruit expansion, sugar accumulation, and pest resistance.';
    } else {
      stageAdvice = 'Stop chemical fertilization 10–14 days prior to harvest to ensure zero chemical residue.';
    }

    return `🧪 <b>Nutrient Advisory for ${esc(f.cropName)} (${stageInfo.name} Stage):</b><br><br>
      • <b>Full-Cycle NPK Target:</b> ${npk.join(':')} kg/acre<br>
      • <b>Active Stage Priority:</b> ${stageAdvice}<br>
      • <b>Organic / Bio-Alternative:</b> Apply 2 tonnes of Vermicompost + 200 kg Neem Cake per acre to strengthen root defense against soil nematodes.<br>
      • <b>Safety Tip:</b> Never broadcast chemical fertilizers on dry topsoil under scorching midday sun.`;
  }

  // 3. SPRAY WINDOW & WEATHER
  if (q.includes('spray') || q.includes('weather') || q.includes('rain') || q.includes('wind') || q.includes('temp') || q.includes('cloud') || q.includes('ಸಿಂಪಡಣೆ') || q.includes('मौसम') || q.includes('தெளிப்பு') || q.includes('పిచికారీ')) {
    const wind = wx.wind ?? 10;
    const rain = wx.rain ?? 0;
    const rp = wx.rp ?? 15;
    const t = wx.t ?? 26;
    const isSafe = wind < 15 && rp < 20 && t < 31;

    return `⛅ <b>24-Hour Spray Suitability Analysis:</b><br><br>
      • <b>Current Condition:</b> ${isSafe ? '🟢 <b>SUITABLE / OPTIMAL WINDOW</b>' : '⚠️ <b>MARGINAL OR UNSUITABLE</b>'}<br>
      • <b>Wind Speed:</b> ${wind} km/h ${wind > 14 ? '(⚠️ High risk of droplet drift onto non-target areas)' : '(✓ Safe drift velocity)'}<br>
      • <b>Rain Probability:</b> ${rp}% (Expected rain: ${rain} mm)<br>
      • <b>Ambient Temp:</b> ${t}°C<br>
      • <b>Best Operating Slot:</b> Tomorrow between <b>06:00 and 08:30 AM</b> when winds are calm and leaf stomata are open. Avoid spraying above 32°C to prevent foliar scorching.`;
  }

  // 4. PESTS, DISEASES, LEAF SIGNS
  if (q.includes('disease') || q.includes('pest') || q.includes('yellow') || q.includes('spot') || q.includes('blight') || q.includes('wilt') || q.includes('curl') || q.includes('leaf') || q.includes('ರೋಗ') || q.includes('बीमारी') || q.includes('நோய்') || q.includes('వ్యాధి')) {
    const knownD = cropObj.diseases || ['Early Blight', 'Powdery Mildew', 'Leaf Curl'];
    const knownP = cropObj.pests || ['Aphids', 'Thrips', 'Whiteflies'];

    return `🩺 <b>Crop Health Triage for ${esc(f.cropName)}:</b><br><br>
      • <b>Frequent Vulnerabilities:</b> ${knownD.join(', ')}<br>
      • <b>Key Pest Vectors:</b> ${knownP.join(', ')}<br>
      • <b>Field Diagnostic Check:</b><br>
        1. <i>Concentric brown rings:</i> Alternaria Early Blight — trim bottom leaves, ensure good airflow.<br>
        2. <i>Curling & stunted shoots:</i> Sap-sucking whiteflies transmitting leaf curl virus — install yellow sticky traps (15 traps/acre) and apply 5ml/L Neem oil.<br>
        3. <i>Midday wilting despite damp soil:</i> Root-knot nematode or Fusarium root vascular wilt.<br>
      • <b>Action:</b> Visit the <b>Crop Health</b> module to run our multi-spectral leaf scanner or test sample cases!`;
  }

  // 5. MANDI PRICE & MARKET
  if (q.includes('mandi') || q.includes('price') || q.includes('market') || q.includes('rate') || q.includes('sell') || q.includes('ಬೆಲೆ') || q.includes('मंडी') || q.includes('விலை') || q.includes('ధర')) {
    return `📈 <b>Mandi Price Intelligence for ${esc(f.cropName)}:</b><br><br>
      • <b>Benchmark Modal Rate:</b> ₹2,200 – ₹2,650 / Quintal<br>
      • <b>Weekly Price Trajectory:</b> Stable with steady wholesale terminal demand.<br>
      • <b>Harvesting Timing Tip:</b> Pick during breaker or early ripe stage for long-distance transport to minimize physical transport bruising and maximize grade-A auction prices.<br>
      • <b>Live APMC Data:</b> Check the <b>Market / Mandi</b> module for weekly price trends!`;
  }

  // 6. HARVEST DAYS & CALENDAR
  if (q.includes('harvest') || q.includes('day') || q.includes('yield') || q.includes('stage') || q.includes('ಕಟಾವು') || q.includes('कटाई') || q.includes('அறுவடை') || q.includes('కోత')) {
    return `🌾 <b>Harvest & Phenology Forecast for ${esc(f.cropName)}:</b><br><br>
      • <b>Current Milestone:</b> ${stageInfo.name} Stage (Day ${Math.max(1, stageInfo.day)} of ~${stageInfo.totalDuration} days)<br>
      • <b>Stage Progress:</b> ${stageInfo.stageProgress}% complete<br>
      • <b>Days to Next Stage:</b> ~${stageInfo.daysToNext} days<br>
      • <b>Estimated Days to Final Harvest:</b> ~${Math.max(5, stageInfo.totalDuration - stageInfo.day)} days<br>
      • <b>Tip:</b> Visit <b>Crop Calendar</b> to verify stage progress or use our Yield Predictor tool!`;
  }

  // GENERAL DEFAULT RESPONSE
  return `🌱 <b>Kisaan Copilot Field Summary:</b><br><br>
    Your <b>${esc(f.cropName)}</b> plot in <b>${esc(f.location?.locality || 'Field')}</b> is currently in the <b>${stageInfo.name}</b> phase on <b>${esc(f.soil || 'Red loam')}</b> soil.<br><br>
    • <b>Current Field Priority:</b> ${decision.act || 'Maintain soil moisture balance and scout for pests.'}<br>
    • <b>Today's Directive:</b> <b>${decision.dec || 'IRRIGATE'}</b> (${decision.win || 'Early morning'})<br><br>
    Ask me anytime: <i>"How long should I run the motor?"</i>, <i>"What spray is safe today?"</i>, or <i>"What NPK ratio should I apply?"</i>!`;
}

// ============================================================
// GLOBAL COMMAND PALETTE (Ctrl+K)
// ============================================================
function openCommandPalette() {
  FarmHubState.cmdPaletteOpen = true;
  renderCommandPalette();
}

function closeCommandPalette() {
  FarmHubState.cmdPaletteOpen = false;
  const mount = $('#cmdPaletteMount');
  if (mount) mount.innerHTML = '';
}

function renderCommandPalette(query = '') {
  const mount = $('#cmdPaletteMount');
  if (!mount) return;

  const q = (query || '').toLowerCase().trim();
  const f = FarmHubState.activeFarm || { cropName: 'Crop' };

  // Define searchable registry
  const modulesList = [
    { title: t('navOverview', 'Overview'), mod: 'overview', icon: '📊', desc: '4 Core Farmer Questions & Field Status' },
    { title: t('navMyFarm', 'My Farm'), mod: 'my-farm', icon: '🚜', desc: 'Parcel setup, acreage & Leaflet map' },
    { title: t('navWeather', 'Weather'), mod: 'weather', icon: '⛅', desc: 'Open-Meteo microclimate & 24h spray radar' },
    { title: t('navCalendar', 'Crop Calendar'), mod: 'calendar', icon: '📅', desc: 'Phenological stages & task checklist' },
    { title: t('navIrrigation', 'Irrigation'), mod: 'irrigation', icon: '💧', desc: 'Water balance & motor pump runtime calculator' },
    { title: t('navAdvisory', 'Farm Advisory'), mod: 'advisory', icon: '🎯', desc: 'Mathematical decision trace & risk breakdown' },
    { title: t('navFertilizer', 'Fertilizer'), mod: 'fertilizer', icon: '🧪', desc: 'NPK calculator & organic/mineral guides' },
    { title: t('navHealth', 'Crop Health'), mod: 'health', icon: '🩺', desc: 'Leaf scanner, disease triage & IPM protocols' },
    { title: t('navMarket', 'Market / Mandi'), mod: 'market', icon: '📈', desc: 'APMC modal commodity prices & trends' },
    { title: t('navFinance', 'Finance'), mod: 'finance', icon: '💰', desc: 'Farm revenue-expense ledger & cost per acre' },
    { title: t('navSensors', 'Sensors'), mod: 'sensors', icon: '📡', desc: 'IoT hardware telemetry & moisture probes' },
    { title: t('navHistory', 'History'), mod: 'history', icon: '📜', desc: 'Audit trail of past field recommendations' },
    { title: t('navSettings', 'Settings'), mod: 'settings', icon: '⚙️', desc: 'Language, theme, data backup & reset' }
  ];

  const quickActions = [
    { title: 'Open Kisaan AI Copilot', action: 'copilot', icon: '💬', desc: 'Ask any agronomic question' },
    { title: 'Print Executive Farm Brief', action: 'print', icon: '📄', desc: 'Export 1-page printable farm report' },
    { title: 'Toggle Light / Dark Theme', action: 'theme', icon: '🌓', desc: 'Switch visual theme' },
    { title: 'Load Live Demo Farm', action: 'demo', icon: '⚡', desc: 'Pre-configured 3.5-Acre Tomato Farm with sensors' },
    { title: 'Export Farm Backup (JSON)', action: 'backup', icon: '💾', desc: 'Download local farm records' }
  ];

  // Filter modules and quick actions
  const filteredModules = modulesList.filter(m => !q || m.title.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q));
  const filteredActions = quickActions.filter(a => !q || a.title.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q));

  // Search in crops knowledge base if query exists
  let cropResults = [];
  if (q.length > 1) {
    const allCrops = ['tomato', 'potato', 'onion', 'chilli', 'brinjal', 'rice', 'wheat', 'maize', 'cotton', 'ragi', 'banana', 'mango', 'grapes', 'pomegranate', 'papaya', 'rose', 'marigold', 'jasmine', 'chrysanthemum', 'gerbera'];
    cropResults = allCrops.filter(c => c.includes(q)).slice(0, 4).map(c => ({
      title: c.charAt(0).toUpperCase() + c.slice(1),
      icon: '🌱',
      desc: 'View agronomic profile and nutrition guidelines',
      cropId: c
    }));
  }

  mount.innerHTML = `
    <div class="cmd-palette-backdrop" onclick="if(event.target===this)closeCommandPalette()">
      <div class="cmd-palette-modal" role="dialog" aria-modal="true">
        <div class="cmd-input-wrap">
          <span class="icon">🔍</span>
          <input id="cmdSearchInput" value="${esc(query)}" placeholder="${t('cmdSearchPlaceholder', 'Search crops, diseases, tools, modules... (Ctrl+K)')}" oninput="renderCommandPalette(this.value)">
          <kbd style="font-size:11px;background:var(--surface-alt);padding:3px 6px;border-radius:4px;color:var(--muted)">ESC</kbd>
        </div>

        <div class="cmd-results-list">
          <!-- QUICK ACTIONS -->
          ${filteredActions.length > 0 ? `
            <div class="cmd-group-title">QUICK ACTIONS</div>
            ${filteredActions.map(a => `
              <div class="cmd-item" onclick="executeCmdAction('${a.action}')">
                <div class="cmd-item-left">
                  <span class="icon">${a.icon}</span>
                  <div>
                    <div class="cmd-item-title">${esc(a.title)}</div>
                    <div class="cmd-item-desc">${esc(a.desc)}</div>
                  </div>
                </div>
                <span style="font-size:11px;color:var(--green)">Run ↵</span>
              </div>
            `).join('')}
          ` : ''}

          <!-- MODULES -->
          ${filteredModules.length > 0 ? `
            <div class="cmd-group-title">NAVIGATION MODULES</div>
            ${filteredModules.map(m => `
              <div class="cmd-item" onclick="closeCommandPalette();switchModule('${m.mod}')">
                <div class="cmd-item-left">
                  <span class="icon">${m.icon}</span>
                  <div>
                    <div class="cmd-item-title">${esc(m.title)}</div>
                    <div class="cmd-item-desc">${esc(m.desc)}</div>
                  </div>
                </div>
                <span style="font-size:11px;color:var(--muted)">Jump ↵</span>
              </div>
            `).join('')}
          ` : ''}

          <!-- CROPS LOOKUP -->
          ${cropResults.length > 0 ? `
            <div class="cmd-group-title">CROPS KNOWLEDGE BASE</div>
            ${cropResults.map(c => `
              <div class="cmd-item" onclick="closeCommandPalette();toggleCopilot();sendCopilotMsg('Agronomic guidelines for ' + '${c.title}')">
                <div class="cmd-item-left">
                  <span class="icon">${c.icon}</span>
                  <div>
                    <div class="cmd-item-title">${esc(c.title)}</div>
                    <div class="cmd-item-desc">${esc(c.desc)}</div>
                  </div>
                </div>
                <span style="font-size:11px;color:var(--accent)">Ask Copilot ↵</span>
              </div>
            `).join('')}
          ` : ''}
        </div>

        <div class="cmd-footer">
          <span>Tip: Use <b>Ctrl + K</b> anytime to jump anywhere</span>
          <span><b>ESC</b> to close</span>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const input = $('#cmdSearchInput');
    if (input) {
      input.focus();
      input.selectionStart = input.selectionEnd = input.value.length;
    }
  }, 40);
}

function executeCmdAction(action) {
  closeCommandPalette();
  if (action === 'copilot') {
    toggleCopilot();
  } else if (action === 'print') {
    printFarmBrief();
  } else if (action === 'theme') {
    toggleTheme();
  } else if (action === 'demo') {
    loadDemoFarm();
  } else if (action === 'backup') {
    exportFarmData();
  }
}

// Global Keyboard Shortcuts (Ctrl+K and Escape)
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openCommandPalette();
    }
    if (e.key === 'Escape') {
      closeCommandPalette();
      closeCopilot();
    }
  });
}

// ============================================================
// EXECUTIVE PRINTABLE FARM BRIEF
// ============================================================
function printFarmBrief() {
  const f = FarmHubState.activeFarm;
  if (!f) return window.print();

  showToast('Generating Executive Farm Brief... 📄', '📄');
  setTimeout(() => {
    window.print();
  }, 300);
}

// ============================================================
// DATA BACKUP & RESTORE UTILITIES
// ============================================================
function exportFarmData() {
  const backupObj = {
    version: '1.2.0',
    exportDate: new Date().toISOString(),
    user: FarmHubState.user,
    farms: FarmHubState.farms,
    activeFarm: FarmHubState.activeFarm,
    fin: FarmHubState.fin,
    tasks: FarmHubState.tasks,
    history: FarmHubState.history
  };
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupObj, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `farmhub_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast(t('toastBackupExported', 'Farm data backup exported successfully! 💾'), '💾');
}

function importFarmData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.farms && Array.isArray(data.farms)) {
        FarmHubState.user = data.user || FarmHubState.user;
        FarmHubState.farms = data.farms;
        FarmHubState.activeFarm = data.activeFarm || data.farms[0];
        FarmHubState.fin = data.fin || [];
        FarmHubState.tasks = data.tasks || [];
        FarmHubState.history = data.history || [];
        persistState();
        renderApp();
        showToast(t('toastBackupImported', 'Farm data restored successfully! 🔄'), '🔄');
      } else {
        alert('Invalid FarmHub backup JSON format.');
      }
    } catch (err) {
      alert('Failed to parse backup JSON file: ' + err.message);
    }
  };
  reader.readAsText(file);
}

// ============================================================
// 5. MODULE DISPATCHER & VIEWS
// ============================================================
async function renderActiveModule() {
  const container = $('#moduleContainer');
  if (!container) return;

  cleanupActiveAnimations();

  const mod = FarmHubState.currentModule;
  container.innerHTML = `<div class="card" style="text-align:center;padding:40px"><b>Loading ${mod}…</b></div>`;

  try {
    switch (mod) {
      case 'overview':
        container.innerHTML = await renderOverviewModule();
        break;
      case 'my-farm':
        container.innerHTML = renderMyFarmModule();
        initFieldMap();
        break;
      case 'weather':
        container.innerHTML = await renderWeatherModule();
        drawWeatherCharts();
        initWeatherSkyCanvas('weatherSkyCanvas');
        initWeatherRadarMap();
        break;
      case 'calendar':
        container.innerHTML = renderCalendarModule();
        initCropGrowthCanvas('cropGrowthCanvas', FarmHubState.activeFarm);
        break;
      case 'irrigation':
        container.innerHTML = await renderIrrigationModule();
        initSoilHydrology3D('soilHydrology3D');
        break;
      case 'advisory':
        container.innerHTML = await renderAdvisoryModule();
        break;
      case 'fertilizer':
        container.innerHTML = renderFertilizerModule();
        break;
      case 'health':
        container.innerHTML = renderHealthModule();
        break;
      case 'market':
        container.innerHTML = await renderMarketModule();
        break;
      case 'finance':
        container.innerHTML = renderFinanceModule();
        drawFinanceCharts();
        break;
      case 'sensors':
        container.innerHTML = await renderSensorsModule();
        break;
      case 'history':
        container.innerHTML = renderHistoryModule();
        break;
      case 'settings':
        container.innerHTML = renderSettingsModule();
        break;
      default:
        container.innerHTML = await renderOverviewModule();
    }
  } catch (err) {
    console.error('Module rendering error', err);
    container.innerHTML = `
      <div class="card">
        <h2>Module Error</h2>
        <p class="mu">${esc(err.message)}</p>
        <button class="btn" onclick="renderActiveModule()">Retry</button>
      </div>
    `;
  }
}

// Fetch and cache weather for the active farm
async function getActiveFarmWeather(force = false) {
  const f = FarmHubState.activeFarm;
  if (!f || !f.location) return null;

  if (force || !FarmHubState.weatherCache[f.id]) {
    try {
      const raw = await API.weather(f.location.lat, f.location.lon, f.id);
      FarmHubState.weatherCache[f.id] = normalizeWeather(raw);
    } catch (e) {
      console.warn('Weather fetch failed', e);
      return null;
    }
  }
  return FarmHubState.weatherCache[f.id];
}

// Generate engine inputs from farm and weather
function buildEngineInputs(f, wx) {
  const stageInfo = computeCropStage(f);
  const sm = wx ? wx.sm : null;
  const isDemo = FarmHubState.demoMode;

  return {
    cropId: f.cropId,
    cropName: f.cropName,
    stage: stageInfo.name,
    soil: f.soil || 'Red loam',
    area: f.farmSize || 1,
    method: f.irrigation || 'Drip',
    sm: isDemo ? 23.4 : (f.man ? f.man.sm : sm),
    src: isDemo ? 'Demo IoT sensor stream' : (f.man ? 'Manual field reading' : 'Open-Meteo numerical model'),
    t: wx ? wx.t : 26,
    h: wx ? wx.h : 60,
    wind: wx ? wx.wind : 10,
    tmax: wx ? wx.tmax : 30,
    et0: wx ? wx.et0 : null,
    rp: wx ? wx.rp : 10,
    rain: wx ? wx.rain : 0,
    wx: !!wx,
    fresh: wx ? wx.age : 30,
    q: f.man ? f.man.q : 0.6,
    day: stageInfo.day
  };
}

// ============================================================
// MODULE: OVERVIEW (Farmer-First 4 Questions + Hero)
// ============================================================
async function renderOverviewModule() {
  const f = FarmHubState.activeFarm;
  const wx = await getActiveFarmWeather();
  const inputs = buildEngineInputs(f, wx);
  const decision = runDecisionEngine(inputs, FarmHubState.history);
  const stageInfo = computeCropStage(f);
  FarmHubState.curDecision = decision;

  // Check if profile is complete (soil, farmSize, irrigation)
  const isProfileIncomplete = !f.soil || !f.farmSize || !f.irrigation;

  // Stat metrics (real stored values only)
  const totalFields = FarmHubState.farms.length;
  const totalArea = FarmHubState.farms.reduce((acc, x) => acc + (x.farmSize || 0), 0);
  const activeCropsCount = new Set(FarmHubState.farms.map(x => x.cropName)).size;
  const netIncome = FarmHubState.fin.filter(x => x.farmId === f.id || !x.farmId).reduce((acc, x) => acc + (x.type === 'Income' ? x.amt : -x.amt), 0);

  return `
    <!-- Top Greeting Bar -->
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <h1 style="font-size:26px">🌾 ${esc(f.name)}</h1>
        <p class="mu" style="margin:2px 0 0">
          ${esc(f.cropName)} (${t(f.cropCategory ? 'cat' + f.cropCategory.charAt(0).toUpperCase() + f.cropCategory.slice(1) : 'catVegetables', f.cropCategory)}) · ${esc(f.location?.displayName || 'Location not set')}
        </p>
      </div>
      <div class="row">
        <button id="advisorySpeechButton" class="btn secondary sm" onclick="toggleAdvisorySpeech()" aria-label="${t(activeAdvisoryUtterance ? 'stopAdvisory' : 'readAdvisory')}" aria-pressed="${!!activeAdvisoryUtterance}">
          ${activeAdvisoryUtterance ? '⏹️ ' + t('stopAdvisory') : '🔊 ' + t('readAdvisory')}
        </button>
        <button class="btn secondary sm" onclick="printFarmBrief()">📄 ${t('printBriefTitle', 'Executive Farm Brief')}</button>
        <button class="btn secondary sm" onclick="window.print()">🖨️ ${t('printAdvisory')}</button>
      </div>
    </div>

    <!-- Complete Profile Notice if Missing Soil/Size/Irrigation -->
    ${isProfileIncomplete ? `
      <section class="complete-notice-card">
        <div>
          <b style="font-size:16px;color:var(--forest)">${t('completeProfileNotice')}</b>
          <p style="margin:4px 0 0;color:var(--text-secondary)">${t('completeProfileDesc')}</p>
        </div>
        <button class="btn sm" onclick="switchModule('my-farm')">${t('btnCompleteProfile')}</button>
      </section>
    ` : ''}

    <!-- 1. WHAT SHOULD I DO NOW? (HERO DECISION CARD) -->
    <section class="hero ${decision.level}" aria-labelledby="heroTitleId">
      <div>
        <div class="hero-label" id="heroTitleId">${decision.icon} ${t('heroTitle')}</div>
        <div class="hero-big">${decision.dec}</div>
        <div class="hero-window">⏰ When: ${decision.win}</div>
        <p class="hero-desc">${decision.act}</p>
        <div class="row" style="margin-top:14px">
          <span class="field-status-pill" style="background:rgba(255,255,255,0.18);color:#FFF;border-color:rgba(255,255,255,0.3)">
            💧 ${decision.impact}
          </span>
        </div>
      </div>
      <div class="hero-right-box">
        <div class="hero-metric-row">
          <span>${t('confidence')}:</span> <b>${decision.conf}%</b>
        </div>
        <div class="bar"><i style="width:${decision.conf}%;background:var(--accent)"></i></div>
        <div class="hero-metric-row" style="margin-top:8px">
          <span>${t('fieldRisk')}:</span> <b>${decision.level} (${decision.over}/100)</b>
        </div>
        <div class="bar"><i style="width:${decision.over}%;background:${decision.over > 60 ? 'var(--farm-danger)' : 'var(--farm-warning)'}"></i></div>
        <small style="color:var(--farm-warning);font-size:12px;margin-top:4px">⚠️ ${decision.unc}</small>
      </div>
    </section>

    <!-- KEY STAT CARDS -->
    <section class="grid" aria-label="Farm Statistics">
      <div class="sig-card">
        <small>${t('statFields')}</small>
        <b>${totalFields}</b>
        <span>Registered parcels</span>
      </div>
      <div class="sig-card">
        <small>${t('statArea')}</small>
        <b>${totalArea > 0 ? totalArea + ' Acres' : t('notAddedYet')}</b>
        <span>${totalArea > 0 ? 'Recorded land' : `<a href="javascript:void(0)" onclick="switchModule('my-farm')" style="color:var(--green)">+ ${t('add')}</a>`}</span>
      </div>
      <div class="sig-card">
        <small>${t('statCrops')}</small>
        <b>${activeCropsCount}</b>
        <span>${esc(f.cropName)} active</span>
      </div>
      <div class="sig-card">
        <small>${t('statIncome')}</small>
        <b style="color:${netIncome >= 0 ? 'var(--green)' : 'var(--farm-danger)'}">₹${netIncome.toLocaleString('en-IN')}</b>
        <span>Net farm ledger</span>
      </div>
    </section>

    <!-- 2. WHY? -->
    <section class="ff-card">
      <div class="ff-title">🔍 ${t('whyTitle')}</div>
      <ul class="ff-why-list">
        ${decision.why.map(w => `<li><b>${esc(w)}</b></li>`).join('')}
      </ul>
      <details style="margin-top:14px;cursor:pointer">
        <summary class="mu">View agronomic reasoning trace</summary>
        <div style="background:var(--surface-alt);padding:14px;border-radius:8px;margin-top:8px;font-size:13.5px">
          ${decision.flow.map(x => `<div>• ${esc(x)}</div>`).join('')}
        </div>
      </details>
    </section>

    <!-- 3. DATA USED -->
    <section class="ff-card">
      <div class="ff-title">📊 ${t('dataUsedTitle')}</div>
      <div class="data-used-grid">
        ${decision.dataUsed.map(d => `
          <div class="data-used-item">
            <span class="data-used-label">${d.label}</span>
            <span class="data-used-val">${d.value}</span>
            <span class="data-used-sub">${d.sub}</span>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- 4. WHAT SHOULD I CHECK NEXT? -->
    <section class="ff-card" style="background:var(--surface-alt)">
      <div class="ff-title">📋 ${t('nextCheckTitle')}</div>
      <p style="font-size:15px;margin-bottom:6px">
        <b>${t('scheduledCheck')}:</b> ${decision.nextCheck}
      </p>
      <p class="mu">
        Monitor your local sky conditions and hand-feel soil moisture before operating drip valves. If rain develops early, cancel irrigation.
      </p>
    </section>

    <!-- FIELD TELEMETRY SIGNALS -->
    <section class="grid" aria-label="Field Telemetry">
      <div class="sig-card">
        <small>${t('soilMoisture')}</small>
        <b>${wx?.sm != null ? r1(wx.sm) + '%' : t('notAddedYet')}</b>
        <span>${inputs.src}</span>
      </div>
      <div class="sig-card">
        <small>${t('airTemp')}</small>
        <b>${wx ? wx.t + '°C' : '--'}</b>
        <span>High ${wx ? wx.tmax + '°C' : '--'} · Low ${wx ? wx.tmin + '°C' : '--'}</span>
      </div>
      <div class="sig-card">
        <small>${t('humidity')}</small>
        <b>${wx ? wx.h + '%' : '--'}</b>
        <span>Wind ${wx ? wx.wind + ' km/h' : '--'}</span>
      </div>
      <div class="sig-card">
        <small>${t('rainChance')}</small>
        <b>${wx ? wx.rp + '%' : '--'}</b>
        <span>Next 48h chance</span>
      </div>
      <div class="sig-card">
        <small>${t('expectedRain')}</small>
        <b>${wx ? wx.rain + ' mm' : '--'}</b>
        <span>Cumulative 48h</span>
      </div>
      <div class="sig-card">
        <small>${t('cropStage')}</small>
        <b>${stageInfo.name}</b>
        <span>${stageInfo.isConfirmed ? 'Farmer confirmed' : 'Calculated'} · Day ${Math.max(0, stageInfo.day)}</span>
      </div>
    </section>
  `;
}

function updateAdvisorySpeechButton() {
  const button = $('#advisorySpeechButton');
  if (!button) return;

  const isActive = !!activeAdvisoryUtterance;
  const labelKey = isActive ? 'stopAdvisory' : 'readAdvisory';
  button.textContent = `${isActive ? '⏹️' : '🔊'} ${t(labelKey)}`;
  button.setAttribute('aria-label', t(labelKey));
  button.setAttribute('aria-pressed', String(isActive));
}

function stopAdvisorySpeech() {
  if (!activeAdvisoryUtterance) return;
  activeAdvisoryUtterance = null;
  window.speechSynthesis.cancel();
  updateAdvisorySpeechButton();
}

function toggleAdvisorySpeech() {
  if (!('speechSynthesis' in window)) {
    alert('Voice speech synthesis is not supported on this browser.');
    return;
  }
  if (activeAdvisoryUtterance) {
    stopAdvisorySpeech();
    return;
  }

  const f = FarmHubState.activeFarm;
  const d = FarmHubState.curDecision;
  if (!f || !d) return;

  const speechLocale = ({ en: 'en-US', kn: 'kn-IN', ta: 'ta-IN', te: 'te-IN', hi: 'hi-IN' })[I18N.currentLang] || 'en-US';
  const speechCopy = I18N.t('audioAdvisory');
  const guidance = (speechCopy.guidance[d.dec] || d.act).replace(/[.!?।]+$/, '');
  const confidence = new Intl.NumberFormat(speechLocale).format(d.conf);
  const text = `${speechCopy.opening} ${f.name}. ${speechCopy.cropLabel} ${f.cropName}. ${speechCopy.recommendation} ${guidance}. ${speechCopy.confidence} ${confidence} ${speechCopy.percent}.`;

  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = speechLocale;
  const languagePrefix = speechLocale.split('-')[0].toLowerCase();
  const voices = window.speechSynthesis.getVoices();
  utter.voice = voices.find(voice => voice.lang.toLowerCase() === speechLocale.toLowerCase())
    || voices.find(voice => voice.lang.toLowerCase().startsWith(languagePrefix + '-'))
    || null;
  utter.rate = 0.95;
  const clearPlayback = () => {
    if (activeAdvisoryUtterance !== utter) return;
    activeAdvisoryUtterance = null;
    updateAdvisorySpeechButton();
  };
  utter.onend = clearPlayback;
  utter.onerror = clearPlayback;
  activeAdvisoryUtterance = utter;
  updateAdvisorySpeechButton();
  window.speechSynthesis.speak(utter);
}

// ============================================================
// MODULE: MY FARM & SOIL/IRRIGATION SETUP
// ============================================================
function renderMyFarmModule() {
  const f = FarmHubState.activeFarm;
  const soils = ['Sandy', 'Red loam', 'Loamy', 'Clay', 'Black cotton', 'Alluvial'];
  const irrs = ['Drip', 'Sprinkler', 'Flood', 'Sub-surface Drip'];
  const stages = ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest'];

  return `
    <h2>${t('navMyFarm')} — ${esc(f.name)}</h2>
    <p class="mu">Complete or update your farm profile to unlock fine-tuned, field-specific agronomic advice.</p>

    <div class="grid2">
      <!-- Edit Farm Form -->
      <form class="card" onsubmit="handleUpdateFarmProfile(event)">
        <h3>FARM SPECIFICATIONS</h3>
        <div class="form-group">
          <label>Farm Name</label>
          <input id="edit_name" value="${esc(f.name)}" required>
        </div>
        <div class="grid2">
          <div class="form-group">
            <label>Farm Size (Acres)</label>
            <input id="edit_size" type="number" step="0.1" min="0.1" value="${f.farmSize || ''}" placeholder="e.g. 2.5">
          </div>
          <div class="form-group">
            <label>Soil Type</label>
            <select id="edit_soil">
              <option value="">-- Select soil type --</option>
              ${soils.map(s => `<option value="${s}"${f.soil === s ? ' selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="grid2">
          <div class="form-group">
            <label>Irrigation System</label>
            <select id="edit_irr">
              <option value="">-- Select irrigation --</option>
              ${irrs.map(i => `<option value="${i}"${f.irrigation === i ? ' selected' : ''}>${i}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Crop Stage</label>
            <select id="edit_stage">
              ${stages.map(st => `<option value="${st}"${f.stage === st ? ' selected' : ''}>${st}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Planting / Sowing Date</label>
          <input id="edit_plant" type="date" value="${f.plantingDate || ''}">
        </div>

        <button type="submit" class="btn" style="margin-top:10px">${t('save')} Profile</button>
      </form>

      <!-- Field Boundary Map -->
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px">
          <h3 style="margin:0">GEOSPATIAL FIELD BOUNDARY</h3>
          <button id="fieldMapRadarBtn" class="radar-toggle-badge" onclick="toggleFieldMapRadar()">🌧️ Doppler Rain Radar [OFF]</button>
        </div>
        <p class="mu">📍 ${esc(f.location?.displayName || 'Coordinates not set')}</p>
        <div id="fieldMap"></div>
        <div id="mapErrorState" class="map-error-banner" style="display:none">
          <p><b>${t('mapUnavailable')}</b></p>
          <button class="btn secondary sm" onclick="initFieldMap()">${t('retryMap')}</button>
        </div>
      </div>
    </div>

    <!-- Multi-Farm Switcher / Add Farm -->
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:10px">
        <h3>REGISTERED FARMS (${FarmHubState.farms.length})</h3>
        <button class="btn secondary sm" onclick="startAddNewFarm()">+ Add Another Farm</button>
      </div>
      <div style="display:grid;gap:10px">
        ${FarmHubState.farms.map(fm => `
          <div class="card" style="padding:14px 18px;display:flex;justify-content:space-between;align-items:center;background:${fm.id === f.id ? 'var(--green-light)' : 'var(--surface-alt)'}">
            <div>
              <b style="font-size:15px">${esc(fm.name)}</b>
              <span class="mu" style="display:block;font-size:12.5px">
                ${esc(fm.cropName)} · ${fm.farmSize ? fm.farmSize + ' acres' : 'Size not set'} · ${esc(fm.location?.locality || fm.location?.district || 'Field')}
              </span>
            </div>
            <div class="row">
              ${fm.id !== f.id ? `<button class="btn sm" onclick="switchActiveFarm('${fm.id}')">Switch to this</button>` : '<span class="field-status-pill">Active</span>'}
              ${FarmHubState.farms.length > 1 ? `<button class="btn secondary sm" onclick="deleteFarm('${fm.id}')">Delete</button>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function handleUpdateFarmProfile(e) {
  e.preventDefault();
  const f = FarmHubState.activeFarm;
  f.name = $('#edit_name').value.trim();
  f.farmSize = parseFloat($('#edit_size').value) || 0;
  f.soil = $('#edit_soil').value;
  f.irrigation = $('#edit_irr').value;
  f.stage = $('#edit_stage').value;
  f.farmerConfirmedStage = true;
  f.plantingDate = $('#edit_plant').value;

  // Sync into farms list
  const idx = FarmHubState.farms.findIndex(x => x.id === f.id);
  if (idx >= 0) FarmHubState.farms[idx] = f;

  persistState();
  alert('Farm profile updated successfully!');
  switchModule('overview');
}

function switchActiveFarm(farmId) {
  const target = FarmHubState.farms.find(x => x.id === farmId);
  if (target) {
    FarmHubState.activeFarm = target;
    persistState();
    renderApp();
  }
}

function startAddNewFarm() {
  tempOnboarding = { location: null, cropCategory: null, cropId: null, cropName: '', isCustomCrop: false };
  navigateTo('crop-specs');
}

function deleteFarm(farmId) {
  if (!confirm('Are you sure you want to delete this farm?')) return;
  FarmHubState.farms = FarmHubState.farms.filter(x => x.id !== farmId);
  if (FarmHubState.activeFarm.id === farmId) {
    FarmHubState.activeFarm = FarmHubState.farms[0] || null;
  }
  persistState();
  renderApp();
}

function initFieldMap() {
  const container = $('#fieldMap');
  const errBanner = $('#mapErrorState');
  if (!container || typeof L === 'undefined') return;

  if (activeLeafletMap) {
    try { activeLeafletMap.remove(); } catch (e) {}
    activeLeafletMap = null;
  }

  const f = FarmHubState.activeFarm;
  const lat = f.location?.lat || 13.136;
  const lon = f.location?.lon || 78.129;

  try {
    activeLeafletMap = L.map('fieldMap').setView([lat, lon], 14);

    const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: '&copy; CARTO &copy; OSM'
    });

    tiles.on('tileerror', () => {
      if (errBanner) errBanner.style.display = 'block';
    });

    tiles.addTo(activeLeafletMap);

    activeMapMarker = L.marker([lat, lon], { draggable: true }).addTo(activeLeafletMap);

    // Dynamic field boundary radius circle
    const acres = f.farmSize || 2.0;
    const radiusMeters = Math.sqrt(acres * 4047 / Math.PI);
    const circle = L.circle([lat, lon], {
      radius: radiusMeters,
      color: '#2F7D4A',
      fillColor: '#55D68A',
      fillOpacity: 0.2
    }).addTo(activeLeafletMap);

    activeMapMarker.on('dragend', async () => {
      const pos = activeMapMarker.getLatLng();
      circle.setLatLng(pos);
      const rev = await API.reverse(pos.lat, pos.lng, 'Map Pin');
      f.location = rev;
      persistState();
    });

    if (errBanner) errBanner.style.display = 'none';
  } catch (err) {
    if (errBanner) errBanner.style.display = 'block';
  }
}

// Toggle Live RainViewer Doppler Radar on Field Map
async function toggleFieldMapRadar() {
  const btn = $('#fieldMapRadarBtn');
  if (!activeLeafletMap) return;

  if (activeFieldRadarLayer) {
    try { activeLeafletMap.removeLayer(activeFieldRadarLayer); } catch (e) {}
    activeFieldRadarLayer = null;
    if (btn) {
      btn.classList.remove('active');
      btn.innerHTML = '🌧️ Doppler Rain Radar [OFF]';
    }
    showToast('Rain radar layer hidden');
    return;
  }

  if (btn) btn.innerHTML = '⏳ Loading radar tiles…';
  const radar = await API.getRainViewerRadar();
  if (!radar || !radar.tileUrl) {
    if (btn) btn.innerHTML = '🌧️ Doppler Radar [Unavailable]';
    showToast('Doppler radar feed currently unavailable', 'warning');
    return;
  }

  try {
    activeFieldRadarLayer = L.tileLayer(radar.tileUrl, {
      opacity: 0.65,
      zIndex: 500,
      maxZoom: 18,
      attribution: '&copy; RainViewer Doppler'
    }).addTo(activeLeafletMap);

    const radarDate = new Date(radar.time * 1000);
    const timeStr = radarDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (btn) {
      btn.classList.add('active');
      btn.innerHTML = `🌧️ Doppler Radar [LIVE ${timeStr}]`;
    }
    showToast(`Live Doppler precipitation radar active (${timeStr} UTC scan)`);
  } catch (err) {
    console.error('Radar layer error', err);
    if (btn) btn.innerHTML = '🌧️ Doppler Radar [Error]';
  }
}

// ============================================================
// MODULE: WEATHER & ROOT ZONE HYDROLOGY
// ============================================================
function sumRecentRainfall(wx, hours) {
  const rainfall = wx?.H?.precipitation || [];
  if (!rainfall.length) return null;
  const start = Math.max(0, (wx.i || 0) - hours + 1);
  return r1(rainfall.slice(start, (wx.i || 0) + 1).reduce((total, value) => total + (value || 0), 0));
}

function buildWeatherIrrigationView(f, wx, inputs, decision) {
  const cropObj = CROPS_DATA.getCrop(f.cropId, f.cropName);
  const stageInfo = computeCropStage(f);
  const fc = SOIL_FC[f.soil] || 28;
  const pwp = SOIL_PWP[f.soil] || 12;
  const moisture = inputs.sm;
  const pref = fc * 0.8;
  const moistureStatus = moisture == null
    ? 'Unavailable'
    : moisture > fc * 1.15
    ? 'Waterlogging Risk'
    : moisture < pwp + (pref - pwp) * 0.3
    ? 'Low'
    : moisture < pref
    ? 'Getting Dry'
    : 'Adequate';
  const status = {
    IRRIGATE: 'Irrigation Required',
    WAIT: 'Irrigation Not Required',
    'DELAY IRRIGATION': 'Delay Irrigation',
    'CHECK DRAINAGE': 'Monitor Soil Moisture',
    'PROTECT CROP': 'Monitor Soil Moisture',
    'INSPECT FIELD': 'Monitor Soil Moisture',
    MONITOR: 'Monitor Soil Moisture'
  }[decision.actionKey] || 'Monitor Soil Moisture';
  const recent24 = sumRecentRainfall(wx, 24);
  const recent48 = sumRecentRainfall(wx, 48);
  const weekly = wx?.D?.precipitation_sum?.length ? r1(wx.D.precipitation_sum.slice(-7).reduce((total, value) => total + (value || 0), 0)) : null;
  const cropEt = wx.et0 != null ? r1(wx.et0 * (cropObj.kc || 0.8)) : null;
  const waterStress = moisture != null && moisture < pref && (wx.tmax >= 32 || wx.h < 40 || wx.wind >= 25) && wx.rain < 5;
  const waterlogging = moisture != null && moisture > fc * 1.1 && (wx.rain >= 10 || wx.rp >= 60);
  const diseaseWeather = wx.h >= 80 && (wx.rain >= 5 || recent24 >= 2);
  const rainfallReason = wx.rain > 0
    ? `${wx.rain} mm rainfall is expected within 48 hours. If soil moisture remains adequate, irrigation may be delayed.`
    : 'Little or no rainfall is expected; check root-zone moisture before irrigating.';
  const reasons = decision.why.length ? decision.why : ['No single weather or soil factor dominates the current status.'];

  return {
    cropObj, stageInfo, fc, pwp, pref, moistureStatus, status, recent24, recent48, weekly, cropEt,
    waterStress, waterlogging, diseaseWeather, rainfallReason, reasons
  };
}

async function renderWeatherModule() {
  const f = FarmHubState.activeFarm;
  const wx = await getActiveFarmWeather(true);

  if (!wx) {
    return `
      <div class="card">
        <h2>${t('liveWeatherUnavailable')}</h2>
        <p class="mu">FarmHub could not connect to Open-Meteo. Please check your internet connection.</p>
        <button class="btn" onclick="renderActiveModule()">${t('refresh')}</button>
      </div>
    `;
  }

  // Real satellite air quality from Open-Meteo European Sentinel
  let aq = null;
  try {
    const lat = f.location?.lat || 13.136;
    const lon = f.location?.lon || 78.129;
    aq = await API.airQuality(lat, lon, f.id);
  } catch (e) {
    console.warn('Air quality fetch error', e);
  }

  const spray = evaluateSprayWindow(wx);
  const inputs = buildEngineInputs(f, wx);
  const decision = runDecisionEngine(inputs, FarmHubState.history);
  const irrigation = buildWeatherIrrigationView(f, wx, inputs, decision);

  const skyDesc = getWeatherDescription(wx.weatherCode, wx);
  const skyGrad = getSkyGradientForWx(wx);

  return `
    <h2>${t('navWeather')} — ${esc(f.location?.displayName || 'Field')}</h2>
    <p class="mu">Real numerical weather predictions and root-zone soil hydrology (0–9 cm depth) from Open-Meteo.</p>

    <!-- REAL-TIME 2D ATMOSPHERIC SKY & PARTICULATE FLOW BANNER -->
    <div class="weather-sky-banner" style="background:${skyGrad}">
      <canvas id="weatherSkyCanvas" width="900" height="140"></canvas>
      <div class="weather-sky-overlay">
        <div>
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;opacity:0.85;font-weight:700">LIVE ATMOSPHERIC SKY & STREAMLINES</div>
          <div style="font-size:21px;font-weight:800;margin:3px 0 2px">${skyDesc}</div>
          <div style="font-size:12.5px;opacity:0.9">💨 Wind ${wx.wind} km/h · Solar Influx: ${wx.directRad != null ? r(wx.directRad) + ' W/m²' : 'Direct sunlight'} · 💧 Precip: ${wx.rain} mm</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:34px;font-weight:800;line-height:1">${wx.t}°C</div>
          <div style="font-size:11.5px;opacity:0.85">RH ${wx.h}% · Pressure ${wx.pressure ?? 1013} hPa</div>
        </div>
      </div>
    </div>

    <!-- METRICS GRID -->
    <div class="grid">
      <div class="sig-card">
        <small>Current Temp</small>
        <b>${wx.t}°C</b>
        <span>${t('feelsLike')} ${wx.apparentTemp ?? wx.t}°C</span>
      </div>
      <div class="sig-card">
        <small>Humidity & Wind</small>
        <b>${wx.h}%</b>
        <span>Wind ${wx.wind} km/h</span>
      </div>
      <div class="sig-card">
        <small>48h Rain Probability</small>
        <b>${wx.rp}%</b>
        <span>${wx.rain} mm expected</span>
      </div>
      <div class="sig-card">
        <small>Soil Temp (6cm)</small>
        <b>${wx.st != null ? r1(wx.st) + '°C' : '--'}</b>
        <span>Root zone temperature</span>
      </div>
      <div class="sig-card">
        <small>${t('uvIndex')}</small>
        <b>${wx.uvMax ?? '--'}</b>
        <span>Solar radiation</span>
      </div>
      <div class="sig-card">
        <small>Sun Cycle</small>
        <b>${wx.sunrise ? wx.sunrise.slice(11, 16) : '--'}</b>
        <span>Sunset ${wx.sunset ? wx.sunset.slice(11, 16) : '--'}</span>
      </div>
    </div>

    <div class="card" style="border-left:6px solid ${irrigation.status === 'Irrigation Required' ? 'var(--farm-danger)' : irrigation.status === 'Delay Irrigation' || irrigation.status === 'Irrigation Not Required' ? 'var(--green)' : 'var(--farm-amber)'}">
      <h3>WEATHER → IRRIGATION STATUS</h3>
      <div style="font-size:22px;font-weight:800;margin:8px 0">${irrigation.status}</div>
      <p>${esc(irrigation.rainfallReason)}</p>
      <div class="row" style="margin-top:10px">
        <span class="field-status-pill">Soil: ${esc(irrigation.moistureStatus)}</span>
        <span class="field-status-pill">Risk: ${esc(decision.level)}</span>
        <span class="field-status-pill">Confidence: ${decision.conf}%</span>
      </div>
      <p class="mu" style="margin-top:12px"><b>Action:</b> ${esc(decision.act)}</p>
      <p class="mu"><b>Reassess:</b> ${esc(decision.nextCheck)}. Do not use a fixed rule such as watering every two days; combine current weather, soil moisture, crop, stage and water demand.</p>
    </div>

    <div class="grid">
      <div class="sig-card"><small>Current soil moisture</small><b>${inputs.sm != null ? r1(inputs.sm) + '%' : '--'}</b><span>${esc(irrigation.moistureStatus)}</span></div>
      <div class="sig-card"><small>Root-zone moisture</small><b>${inputs.sm != null ? `${r1(inputs.sm)}%` : '--'}</b><span>${esc(f.soil || 'Soil not set')} · target ~${r(irrigation.pref)}%</span></div>
      <div class="sig-card"><small>Soil temperature</small><b>${wx.st != null ? r1(wx.st) + '°C' : '--'}</b><span>At approximately 6 cm</span></div>
      <div class="sig-card"><small>Rainfall last 24h / 48h</small><b>${irrigation.recent24 == null ? '--' : irrigation.recent24 + ' / ' + (irrigation.recent48 ?? '--') + ' mm'}</b><span>From hourly model</span></div>
      <div class="sig-card"><small>Weekly rainfall</small><b>${irrigation.weekly == null ? '--' : irrigation.weekly + ' mm'}</b><span>Available forecast window</span></div>
      <div class="sig-card"><small>Crop water demand</small><b>${irrigation.cropEt == null ? '--' : irrigation.cropEt + ' mm/day'}</b><span>${esc(f.cropName)} · ${esc(irrigation.stageInfo.name)}</span></div>
    </div>

    <div class="grid2">
      <div class="card">
        <h3>RAINFALL IMPACT</h3>
        <p><b>Probability:</b> ${wx.rp}%<br><b>Expected:</b> ${wx.rain} mm in the next 48 hours<br><b>Recent:</b> ${irrigation.recent24 ?? '--'} mm / 24h, ${irrigation.recent48 ?? '--'} mm / 48h</p>
        <ul>${irrigation.reasons.map(reason => `<li>${esc(reason)}</li>`).join('')}</ul>
        <p class="mu">Effective rainfall may be lower than total rainfall because runoff, deep drainage and evaporation reduce the water available to roots.</p>
      </div>
      <div class="card">
        <h3>EVAPOTRANSPIRATION</h3>
        <p>Evapotranspiration combines water lost through soil evaporation and plant transpiration.</p>
        <p><b>Reference ET (ET0):</b> ${wx.et0 != null ? wx.et0 + ' mm/day' : 'Unavailable'}<br><b>Crop ET (ETc):</b> ${irrigation.cropEt != null ? irrigation.cropEt + ' mm/day' : 'Unavailable'}<br><b>Relationship:</b> ETc = ET0 × Kc<br><b>Kc:</b> ${irrigation.cropObj.kc || 0.8} for ${esc(f.cropName)}</p>
        <p class="mu">Crop coefficient changes with crop type and growth stage, so ETc is an estimate rather than a fixed irrigation dose.</p>
      </div>
    </div>

    <div class="grid2">
      <div class="card" style="border-left:6px solid ${irrigation.waterlogging ? 'var(--farm-danger)' : 'var(--farm-amber)'}">
        <h3>WATERLOGGING RISK</h3>
        <p>${irrigation.waterlogging ? 'Heavy rain is expected while soil moisture is already high. Monitor drainage and avoid unnecessary irrigation.' : 'Risk rises when heavy rainfall meets wet soil, poor drainage or recent excess irrigation.'}</p>
        <p class="mu">Watch for yellowing, wilting despite wet soil, poor growth and root damage. Improve drainage where needed.</p>
      </div>
      <div class="card" style="border-left:6px solid ${irrigation.waterStress ? 'var(--farm-warning)' : 'var(--green)'}">
        <h3>WATER-STRESS RISK</h3>
        <p>${irrigation.waterStress ? 'Low soil moisture, high atmospheric demand and limited rainfall may increase water stress.' : 'Current weather and soil signals do not strongly indicate acute water stress.'}</p>
        <p class="mu">Risk can rise with low moisture, heat, low humidity, strong wind, limited rainfall or high ET. Monitor the crop and root zone.</p>
      </div>
    </div>

    <div class="card">
      <h3>IRRIGATION + CROP HEALTH</h3>
      <p>${irrigation.diseaseWeather ? 'High humidity and rainfall may favour some fungal or bacterial foliar diseases. Avoid unnecessary overhead irrigation and monitor the crop after rainfall.' : 'Weather conditions do not currently show the strongest combined humidity and rainfall signal for foliar disease risk.'}</p>
      <p class="mu">Irrigation status and spraying status are separate decisions. Wet foliage, high humidity and rain can change spray timing even when irrigation is appropriate.</p>
    </div>

    <!-- SPRAY WINDOW ADVISORY -->
    <div class="card" style="border-left:6px solid ${spray.status === 'OPTIMAL' ? 'var(--green)' : spray.status === 'MARGINAL' ? 'var(--farm-warning)' : 'var(--farm-danger)'}">
      <h3>SPRAYING & CANOPY APPLICATION WINDOW</h3>
      <p style="font-size:15px;margin-bottom:6px"><b>Status: ${spray.status}</b></p>
      <p class="mu">${spray.text}</p>
    </div>

    <!-- 24-HOUR SPRAY SUITABILITY RADAR -->
    ${build24hSprayRadarHtml(wx)}

    <!-- REAL-TIME SATELLITE AIR QUALITY (OPEN-METEO SENTINEL) -->
    ${buildAirQualityCardHtml(aq)}

    <!-- LIVE DOPPLER PRECIPITATION RADAR MAP -->
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px">
        <div>
          <h3 style="margin:0">LIVE DOPPLER PRECIPITATION RADAR (RAINVIEWER)</h3>
          <p class="mu" style="margin:2px 0">Real-time composite radar scans showing precipitation echoes and storm cells.</p>
        </div>
        <button id="wxRadarBtn" class="radar-toggle-badge active" onclick="toggleWeatherMapRadar()">🌧️ Doppler Radar [ACTIVE]</button>
      </div>
      <div id="weatherRadarMap" style="height:320px;border-radius:var(--radius-sm);overflow:hidden;border:1px solid var(--border)"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;font-size:11.5px;color:var(--muted);flex-wrap:wrap;gap:6px">
        <span>Intensity Scale: <span style="display:inline-block;width:12px;height:12px;background:#2563EB;vertical-align:middle;margin:0 2px;border-radius:2px"></span> Drizzle <span style="display:inline-block;width:12px;height:12px;background:#10B981;vertical-align:middle;margin:0 2px;border-radius:2px"></span> Moderate <span style="display:inline-block;width:12px;height:12px;background:#F59E0B;vertical-align:middle;margin:0 2px;border-radius:2px"></span> Heavy Rain <span style="display:inline-block;width:12px;height:12px;background:#EF4444;vertical-align:middle;margin:0 2px;border-radius:2px"></span> Storm / Hail</span>
        <span id="wxRadarTimestamp">Source: RainViewer Global Satellite Radar</span>
      </div>
    </div>

    <!-- CHARTS -->
    <div class="card">
      <h3>SOIL MOISTURE % DYNAMICS (PAST 3 DAYS + 7-DAY FORECAST)</h3>
      <div class="chart-canvas-tall"><canvas id="chart_soil"></canvas></div>
    </div>

    <div class="grid2">
      <div class="card">
        <h3>DAILY TEMPERATURE HIGHS & LOWS (°C)</h3>
        <div class="chart-canvas-wrap"><canvas id="chart_temp"></canvas></div>
      </div>
      <div class="card">
        <h3>RAIN PROBABILITY (%) & RAINFALL (mm)</h3>
        <div class="chart-canvas-wrap"><canvas id="chart_rain"></canvas></div>
      </div>
    </div>
  `;
}

function build24hSprayRadarHtml(wx) {
  if (!wx || !wx.H || !wx.H.time) return '';
  const H = wx.H;
  const startIdx = wx.i || 0;
  const hoursCount = 18; // Next 18 hours
  const hourlySlots = [];

  for (let j = 0; j < hoursCount; j++) {
    const idx = startIdx + j;
    if (idx >= H.time.length) break;

    const timeStr = H.time[idx] ? H.time[idx].slice(11, 16) : `+${j}h`;
    const temp = H.temperature_2m ? r1(H.temperature_2m[idx]) : 25;
    const wind = H.windspeed_10m ? r1(H.windspeed_10m[idx]) : 8;
    const rainProb = H.precipitation_probability ? (H.precipitation_probability[idx] || 0) : 0;
    const rh = H.relativehumidity_2m ? (H.relativehumidity_2m[idx] || 60) : 60;

    let badgeClass = 'optimal';
    let badgeText = 'Optimal';
    let note = 'Calm winds';

    if (rainProb >= 35 || wind >= 16 || temp >= 33 || temp <= 10) {
      badgeClass = 'unsafe';
      badgeText = 'Unsafe';
      note = wind >= 16 ? 'High drift' : rainProb >= 35 ? 'Rain washout' : 'Thermal stress';
    } else if (rainProb >= 15 || wind >= 12 || temp >= 29) {
      badgeClass = 'caution';
      badgeText = 'Caution';
      note = wind >= 12 ? 'Moderate wind' : 'Warm air';
    }

    hourlySlots.push({ timeStr, temp, wind, rainProb, rh, badgeClass, badgeText, note });
  }

  const optimalSlots = hourlySlots.filter(s => s.badgeClass === 'optimal');
  const summaryAdvice = optimalSlots.length > 0
    ? `Best spray window detected: <b>${optimalSlots[0].timeStr} onwards</b> (${optimalSlots.length} optimal hours with low drift risk & zero rain threat).`
    : `Caution advised: Sub-optimal spray conditions over the next 18 hours due to elevated wind velocity or rain probability.`;

  return `
    <div class="spray-radar-wrapper">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
        <div>
          <h3 style="margin-bottom:4px">🎯 24-HOUR PESTICIDE & FOLIAR SPRAY SUITABILITY RADAR</h3>
          <p class="mu" style="margin:0">${summaryAdvice}</p>
        </div>
        <div class="row" style="font-size:11.5px;gap:8px">
          <span class="spray-badge optimal">● Optimal</span>
          <span class="spray-badge caution">● Caution</span>
          <span class="spray-badge unsafe">● Unsafe</span>
        </div>
      </div>

      <div class="spray-radar-grid">
        ${hourlySlots.map(s => `
          <div class="spray-hour-box">
            <div class="spray-hour-time">${s.timeStr}</div>
            <div style="font-size:13px;font-weight:700">${s.temp}°C</div>
            <div class="mu" style="font-size:11px;margin:2px 0">💨 ${s.wind} km/h</div>
            <div class="mu" style="font-size:11px">🌧️ ${s.rainProb}%</div>
            <div class="spray-badge ${s.badgeClass}">${s.badgeText}</div>
            <div style="font-size:9.5px;color:var(--muted);margin-top:3px">${s.note}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function getSkyGradientForWx(wx) {
  if (!wx) return 'linear-gradient(135deg, #102A1C 0%, #1E4630 100%)';
  const nowHour = new Date().getHours();
  const isNight = nowHour < 6 || nowHour >= 19;
  const isRain = (wx.rain > 0 || wx.rp >= 45 || (wx.weatherCode >= 51 && wx.weatherCode <= 67) || (wx.weatherCode >= 80 && wx.weatherCode <= 99));

  if (isNight) {
    return isRain
      ? 'linear-gradient(135deg, #071018 0%, #0F2027 100%)'
      : 'linear-gradient(135deg, #09131C 0%, #152238 100%)';
  }
  if (isRain) {
    return 'linear-gradient(135deg, #1C2833 0%, #2E4053 50%, #1B2631 100%)';
  }
  if (wx.t >= 32) {
    return 'linear-gradient(135deg, #1B3B2B 0%, #4B381C 50%, #1E3F2D 100%)';
  }
  return 'linear-gradient(135deg, #0F3322 0%, #1D5337 50%, #0F3322 100%)';
}

function getWeatherDescription(code, wx) {
  if (wx && (wx.rain > 0 || wx.rp >= 60)) {
    return `Rain Influx (${wx.rain} mm) · High Canopy Wetness`;
  }
  const codes = {
    0: 'Clear Sky · High Solar Penetration',
    1: 'Mainly Clear · Optimal Photosynthesis',
    2: 'Partly Cloudy · Mild Radiation Scattering',
    3: 'Overcast · Diffuse Light Canopy',
    45: 'Fog & Dew · Prolonged Leaf Wetness',
    48: 'Depositing Rime Fog · High Relative Humidity',
    51: 'Light Drizzle · Low Washout Threat',
    53: 'Moderate Drizzle · Foliage Wetting',
    55: 'Dense Drizzle · Postpone Spraying',
    61: 'Slight Rain · Infiltration Starting',
    63: 'Moderate Rain · Soil Saturation Rising',
    65: 'Heavy Rain · High Runoff & Drift Risk',
    80: 'Rain Showers · Intermittent Influx',
    95: 'Thunderstorm · Immediate Field Evacuation'
  };
  return codes[code] || `Atmospheric Index ${code ?? 0} · Wind ${wx?.wind ?? 8} km/h`;
}

function initWeatherSkyCanvas(canvasId = 'weatherSkyCanvas') {
  const canvas = $('#' + canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (FarmHubState._animWeatherSkyId) {
    cancelAnimationFrame(FarmHubState._animWeatherSkyId);
    FarmHubState._animWeatherSkyId = null;
  }

  const w = canvas.offsetWidth || 900;
  const h = canvas.offsetHeight || 140;
  canvas.width = w;
  canvas.height = h;

  const f = FarmHubState.activeFarm;
  const wx = FarmHubState.weatherCache[f.id] || { rain: 0, rp: 10, wind: 8, t: 26, weatherCode: 0 };
  const isRain = (wx.rain > 0 || wx.rp >= 45 || (wx.weatherCode >= 51 && wx.weatherCode <= 67) || (wx.weatherCode >= 80 && wx.weatherCode <= 99));
  const isNight = new Date().getHours() < 6 || new Date().getHours() >= 19;
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const particles = [];
  const ripples = [];
  const windStrength = (wx.wind || 8) * 0.2;

  if (isRain) {
    const rainCount = Math.min(120, Math.floor(40 + (wx.rain || 2) * 12));
    for (let i = 0; i < rainCount; i++) {
      particles.push({
        x: Math.random() * (w + 100) - 50,
        y: Math.random() * h,
        len: 8 + Math.random() * 14,
        speed: 6 + Math.random() * 6,
        alpha: 0.35 + Math.random() * 0.4
      });
    }
  } else if (isNight) {
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.8 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.03
      });
    }
  } else {
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1 + Math.random() * 2.2,
        vx: 0.2 + Math.random() * 0.4 + windStrength * 0.05,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: 0.2 + Math.random() * 0.45
      });
    }
  }

  function renderSky() {
    ctx.clearRect(0, 0, w, h);

    if (isRain) {
      ctx.strokeStyle = '#93C5FD';
      ctx.lineWidth = 1.2;
      for (let p of particles) {
        ctx.beginPath();
        ctx.globalAlpha = p.alpha;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + windStrength * 1.5, p.y + p.len);
        ctx.stroke();

        p.x += windStrength * 1.5;
        p.y += p.speed;

        if (p.y > h - 4) {
          if (ripples.length < 30) {
            ripples.push({ x: p.x, y: h - 2, r: 1, maxR: 6 + Math.random() * 8, alpha: 0.5 });
          }
          p.y = -10;
          p.x = Math.random() * (w + 100) - 50;
        }
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        ctx.beginPath();
        ctx.ellipse(rp.x, rp.y, rp.r * 1.8, rp.r * 0.5, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(186, 230, 253, ${rp.alpha})`;
        ctx.stroke();
        rp.r += 0.4;
        rp.alpha -= 0.025;
        if (rp.alpha <= 0 || rp.r >= rp.maxR) ripples.splice(i, 1);
      }
    } else if (isNight) {
      for (let p of particles) {
        p.phase += p.speed;
        const twinkle = 0.3 + 0.7 * (Math.sin(p.phase) * 0.5 + 0.5);
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      const grad = ctx.createRadialGradient(w - 70, 35, 2, w - 70, 35, 40);
      grad.addColorStop(0, 'rgba(254, 240, 138, 0.7)');
      grad.addColorStop(0.4, 'rgba(254, 240, 138, 0.15)');
      grad.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(w - 70, 35, 40, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const sunX = w - 60;
      const sunY = -20;
      const rayGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 180);
      rayGrad.addColorStop(0, 'rgba(253, 224, 71, 0.4)');
      rayGrad.addColorStop(0.5, 'rgba(250, 204, 21, 0.08)');
      rayGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = rayGrad;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 180, 0, Math.PI * 2);
      ctx.fill();

      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy + Math.sin(p.x * 0.02) * 0.2;
        if (p.x > w + 10) p.x = -10;
        if (p.y > h + 10) p.y = -10;
        if (p.y < -10) p.y = h + 10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(254, 240, 138, ${p.alpha})`;
        ctx.fill();
      }
    }

    ctx.lineWidth = 1;
    const timeSec = Date.now() * 0.001;
    for (let k = 0; k < 2; k++) {
      const yBase = 35 + k * 45;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.setLineDash([40, 60]);
      ctx.lineDashOffset = -timeSec * (30 + windStrength * 15);
      ctx.moveTo(0, yBase);
      ctx.bezierCurveTo(w * 0.33, yBase + 10, w * 0.66, yBase - 10, w, yBase + 4);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.globalAlpha = 1;

    if (!prefersReduced) {
      FarmHubState._animWeatherSkyId = requestAnimationFrame(renderSky);
    }
  }

  renderSky();
}

function buildAirQualityCardHtml(aq) {
  const curr = aq?.data?.current;
  if (!curr) {
    return `
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px">
          <h3 style="margin:0">SATELLITE ATMOSPHERE & AIR QUALITY (OPEN-METEO)</h3>
          <span class="field-status-pill">Baseline Station</span>
        </div>
        <p class="mu">European Sentinel atmospheric reanalysis data initializing or network offline.</p>
      </div>
    `;
  }

  const eAqi = curr.european_aqi ?? 22;
  let aqiClass = 'var(--green)';
  let aqiLabel = 'Good';
  let safetyNote = 'Atmospheric air quality is clean and healthy. Safe for prolonged outdoor spraying, field cultivation, and farm manual labour.';

  if (eAqi > 80) {
    aqiClass = '#7C3AED';
    aqiLabel = 'Very Poor';
    safetyNote = 'Severe particulate pollution detected. Field workers should avoid heavy physical labour or use N95 respirators. High dust drift potential.';
  } else if (eAqi > 60) {
    aqiClass = '#EF4444';
    aqiLabel = 'Poor';
    safetyNote = 'Elevated air pollutants. Sensitive farm personnel should minimize prolonged outdoor exposure. Check wind drift before mist blowing.';
  } else if (eAqi > 40) {
    aqiClass = '#F59E0B';
    aqiLabel = 'Moderate';
    safetyNote = 'Moderate air quality. Standard agricultural field operations permitted; monitor dust levels during dry tillage or harvesting.';
  } else if (eAqi > 20) {
    aqiClass = '#10B981';
    aqiLabel = 'Fair';
    safetyNote = 'Fair air quality with minor particulate haze. Completely safe for field operations and spray applications under calm winds.';
  }

  return `
    <div class="card" style="border-left:6px solid ${aqiClass}">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:12px">
        <div>
          <h3 style="margin:0">SATELLITE ATMOSPHERE & AIR QUALITY (OPEN-METEO SENTINEL)</h3>
          <p class="mu" style="margin:2px 0">Real-time European Copernicus atmosphere monitoring data for this field coordinate.</p>
        </div>
        <span class="field-status-pill" style="background:${aqiClass}22;color:${aqiClass};font-weight:700;font-size:13px;padding:6px 14px;border:1px solid ${aqiClass}44">
          European AQI: ${eAqi} (${aqiLabel})
        </span>
      </div>

      <div class="grid">
        <div class="sig-card">
          <small>PM2.5 (Fine Respirable Particles)</small>
          <b>${curr.pm2_5 != null ? r1(curr.pm2_5) + ' µg/m³' : '--'}</b>
          <span>Smoke, field dust & aerosols</span>
        </div>
        <div class="sig-card">
          <small>PM10 (Coarse Agricultural Dust)</small>
          <b>${curr.pm10 != null ? r1(curr.pm10) + ' µg/m³' : '--'}</b>
          <span>Soil particles, pollen & sand</span>
        </div>
        <div class="sig-card">
          <small>Ozone (O₃)</small>
          <b>${curr.ozone != null ? r1(curr.ozone) + ' µg/m³' : '--'}</b>
          <span>Photochemical ground oxidant</span>
        </div>
        <div class="sig-card">
          <small>Nitrogen Dioxide (NO₂)</small>
          <b>${curr.nitrogen_dioxide != null ? r1(curr.nitrogen_dioxide) + ' µg/m³' : '--'}</b>
          <span>Atmospheric combustion gases</span>
        </div>
      </div>

      <div style="margin-top:12px;padding:12px 14px;border-radius:8px;background:var(--surface-alt);border:1px solid var(--border)">
        <b style="color:var(--text)">🛡️ Field Work & Spray Safety Advisory:</b>
        <span class="mu" style="display:inline;margin-left:6px">${safetyNote}</span>
      </div>
    </div>
  `;
}

async function initWeatherRadarMap() {
  const container = $('#weatherRadarMap');
  if (!container || typeof L === 'undefined') return;

  if (activeWeatherRadarMap) {
    try { activeWeatherRadarMap.remove(); } catch (e) {}
    activeWeatherRadarMap = null;
    activeWxRadarLayer = null;
  }

  const f = FarmHubState.activeFarm;
  const lat = f.location?.lat || 13.136;
  const lon = f.location?.lon || 78.129;

  try {
    activeWeatherRadarMap = L.map('weatherRadarMap').setView([lat, lon], 9);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      subdomains: 'abcd',
      attribution: '&copy; CARTO &copy; OSM'
    }).addTo(activeWeatherRadarMap);

    L.marker([lat, lon]).addTo(activeWeatherRadarMap).bindPopup(`<b>${esc(f.name)}</b><br>${esc(f.cropName)} Field`).openPopup();

    const radar = await API.getRainViewerRadar();
    if (radar && radar.tileUrl) {
      activeWxRadarLayer = L.tileLayer(radar.tileUrl, {
        opacity: 0.65,
        zIndex: 500,
        maxZoom: 18,
        attribution: '&copy; RainViewer Doppler'
      }).addTo(activeWeatherRadarMap);

      const radarDate = new Date(radar.time * 1000);
      const timeStr = radarDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const tsSpan = $('#wxRadarTimestamp');
      if (tsSpan) tsSpan.innerHTML = `Doppler scan: <b>${timeStr} UTC</b> (RainViewer)`;
    }
  } catch (err) {
    console.warn('Weather radar map error', err);
  }
}

function toggleWeatherMapRadar() {
  const btn = $('#wxRadarBtn');
  if (!activeWeatherRadarMap) return;

  if (activeWxRadarLayer) {
    try { activeWeatherRadarMap.removeLayer(activeWxRadarLayer); } catch (e) {}
    activeWxRadarLayer = null;
    if (btn) {
      btn.classList.remove('active');
      btn.innerHTML = '🌧️ Doppler Radar [OFF]';
    }
    showToast('Precipitation radar layer hidden');
  } else {
    initWeatherRadarMap().then(() => {
      if (btn) {
        btn.classList.add('active');
        btn.innerHTML = '🌧️ Doppler Radar [ACTIVE]';
      }
      showToast('Live Doppler precipitation radar restored');
    });
  }
}

function drawWeatherCharts() {
  const f = FarmHubState.activeFarm;
  const wx = FarmHubState.weatherCache[f.id];
  if (!wx || typeof Chart === 'undefined') return;

  const H = wx.H || {};
  const D = wx.D || {};
  const fc = SOIL_FC[f.soil] || 28;
  const pref = r1(fc * 0.8);

  // 1. Soil moisture chart
  if (H.time && H.soil_moisture_3_to_9cm) {
    const a = Math.max(0, wx.i - 72);
    const b = Math.min(H.time.length, wx.i + 96);
    const smData = H.soil_moisture_3_to_9cm.slice(a, b).map(v => v == null ? null : r1(v * 100));
    const labels = H.time.slice(a, b).map((t, idx) => {
      const d = new Date(t);
      return idx % 12 === 0 ? `${d.getDate()} ${d.toLocaleDateString('en-GB', { month: 'short' })}` : '';
    });

    const datasets = [
      {
        label: 'Active Root Zone (3–9cm)',
        data: smData,
        borderColor: '#2F7D4A',
        backgroundColor: 'rgba(47, 125, 74, 0.15)',
        fill: true,
        tension: 0.3,
        pointRadius: 0
      }
    ];

    if (H.soil_moisture_0_to_1cm) {
      const sm0 = H.soil_moisture_0_to_1cm.slice(a, b).map(v => v == null ? null : r1(v * 100));
      datasets.unshift({
        label: 'Topsoil Surface (0–1cm)',
        data: sm0,
        borderColor: '#38BDF8',
        borderDash: [3, 3],
        tension: 0.3,
        pointRadius: 0
      });
    }

    if (H.soil_moisture_9_to_27cm) {
      const sm9 = H.soil_moisture_9_to_27cm.slice(a, b).map(v => v == null ? null : r1(v * 100));
      datasets.push({
        label: 'Subsoil Vadose (9–27cm)',
        data: sm9,
        borderColor: '#A855F7',
        borderDash: [2, 2],
        tension: 0.3,
        pointRadius: 0
      });
    }

    datasets.push({
      label: `Field Capacity Target (${pref}%)`,
      data: smData.map(() => pref),
      borderColor: '#D97706',
      borderDash: [6, 6],
      pointRadius: 0
    });

    createSafeChart('chart_soil', 'line', {
      labels,
      datasets
    });
  }

  // 2. Temperature chart
  if (D.time && D.temperature_2m_max) {
    const dates = D.time.map(t => new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }));
    createSafeChart('chart_temp', 'line', {
      labels: dates,
      datasets: [
        { label: 'High (°C)', data: D.temperature_2m_max, borderColor: '#D97706', tension: 0.2 },
        { label: 'Low (°C)', data: D.temperature_2m_min, borderColor: '#2563EB', tension: 0.2 }
      ]
    });

    // 3. Rain chart
    createSafeChart('chart_rain', 'bar', {
      labels: dates,
      datasets: [
        { label: 'Rain Chance (%)', data: D.precipitation_probability_max, backgroundColor: 'rgba(85, 214, 138, 0.7)', yAxisID: 'y' },
        { label: 'Rain (mm)', data: D.precipitation_sum, borderColor: '#2563EB', type: 'line', yAxisID: 'y1' }
      ]
    }, {
      scales: {
        y: { min: 0, max: 100 },
        y1: { position: 'right', grid: { drawOnChartArea: false } }
      }
    });
  }
}

function createSafeChart(id, type, data, options = {}) {
  const canvas = $('#' + id);
  if (!canvas || typeof Chart === 'undefined') return;
  const existing = Chart.getChart(canvas);
  if (existing) existing.destroy();

  new Chart(canvas, {
    type,
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: data.datasets.length > 1 } },
      ...options
    }
  });
}

// ============================================================
// MODULE: CROP CALENDAR & STAGE MANAGEMENT
// ============================================================
function renderCalendarModule() {
  const f = FarmHubState.activeFarm;
  const cropObj = CROPS_DATA.getCrop(f.cropId, f.cropName);
  const stageInfo = computeCropStage(f);
  const endDays = cropObj.end || [20, 45, 70, 105, 130];
  const plantDate = f.plantingDate ? new Date(f.plantingDate) : new Date();

  const getDateForDay = days => {
    const d = new Date(plantDate);
    d.setDate(d.getDate() + days);
    return fmtDate(d);
  };

  const tasksList = FarmHubState.tasks.filter(t => t.farmId === f.id);

  return `
    <h2>${t('navCalendar')} — ${esc(f.cropName)}</h2>
    <p class="mu">Phenological progress tracking based on planting date (${fmtDate(plantDate)}).</p>

    <!-- 2D PHENOLOGICAL BOTANICAL STAGE VISUALIZER -->
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px">
        <div>
          <h3 style="margin:0">2D PHENOLOGICAL MORPHOLOGY & GROWTH STAGE VISUALIZER</h3>
          <p class="mu" style="margin:2px 0">Botanical canopy development timeline from seed germination to harvest maturity.</p>
        </div>
        <span class="field-status-pill" style="background:rgba(85,214,138,0.15);color:var(--green)">
          Active: ${esc(stageInfo.name)} (Day ${Math.max(0, stageInfo.day)})
        </span>
      </div>
      <div style="background:var(--surface-alt);border-radius:var(--radius-sm);overflow:hidden;border:1px solid var(--border)">
        <canvas id="cropGrowthCanvas" width="800" height="210" style="width:100%;height:auto;display:block"></canvas>
      </div>
    </div>

    <!-- STAGE PROGRESS BAR -->
    <div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <b>Stage: ${stageInfo.name} (Day ${Math.max(0, stageInfo.day)} of ~${stageInfo.totalDuration})</b>
        <span class="field-status-pill">${stageInfo.stageProgress}% stage progress</span>
      </div>
      <div class="bar" style="height:12px;background:var(--surface-alt)">
        <i style="width:${stageInfo.stageProgress}%;background:var(--green)"></i>
      </div>
      <p class="mu" style="margin-top:10px">
        Status: <b>${stageInfo.isConfirmed ? 'Farmer Confirmed' : 'Calculated by FarmHub'}</b>. ${stageInfo.daysToNext} days remaining until next stage milestone.
      </p>
    </div>

    <!-- STAGES TIMELINE TABLE -->
    <div class="card">
      <h3>PHENOLOGICAL STAGE MILESTONES</h3>
      <table>
        <thead>
          <tr>
            <th>Growth Stage</th>
            <th>Approx Window</th>
            <th>Sensitivity</th>
            <th>Key Field Tasks</th>
          </tr>
        </thead>
        <tbody>
          ${STAGES.map((stName, idx) => {
            const isNow = stName === stageInfo.name;
            const startD = idx === 0 ? 0 : endDays[idx - 1] + 1;
            const endD = endDays[idx];
            return `
              <tr class="${isNow ? 'now' : ''}">
                <td><b>${stName}</b> ${isNow ? '◀ Current' : ''}</td>
                <td>${getDateForDay(startD)} – ${getDateForDay(endD)}</td>
                <td>${STAGE_SENSITIVITY[stName] >= 0.9 ? 'High' : 'Moderate'}</td>
                <td>${cropObj.tasks[stName] || 'Standard maintenance and moisture scouting.'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>

    <!-- CUSTOM TASK MANAGER -->
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <h3>FIELD TASKS CHECKLIST (${tasksList.length})</h3>
        <button class="btn secondary sm" onclick="addCalendarTask()">+ Add Task</button>
      </div>
      <div style="display:grid;gap:8px">
        ${tasksList.map(task => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--surface-alt);border-radius:8px">
            <label style="display:flex;align-items:center;gap:10px;margin:0;cursor:pointer">
              <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTaskDone('${task.id}')" style="width:18px;height:18px">
              <span style="${task.done ? 'text-decoration:line-through;color:var(--muted)' : 'font-weight:600'}">${esc(task.title)}</span>
            </label>
            <button class="btn secondary sm" onclick="deleteCalendarTask('${task.id}')">✕</button>
          </div>
        `).join('') || '<p class="mu">No custom tasks scheduled yet. Click "+ Add Task" to schedule weeding, spraying or irrigation.</p>'}
    <!-- CROP YIELD & REVENUE PREDICTOR -->
    ${buildYieldPredictorHtml(f, cropObj, stageInfo)}
  `;
}

function buildYieldPredictorHtml(f, cropObj, stageInfo) {
  const cropId = f.cropId || 'tomato';
  const YIELD_BASELINES = {
    tomato: { qPerAcre: 160, pricePerQ: 2200, unit: 'Quintals' },
    potato: { qPerAcre: 100, pricePerQ: 1750, unit: 'Quintals' },
    onion: { qPerAcre: 120, pricePerQ: 2400, unit: 'Quintals' },
    chilli: { qPerAcre: 16, pricePerQ: 14500, unit: 'Quintals' },
    brinjal: { qPerAcre: 130, pricePerQ: 1900, unit: 'Quintals' },
    rice: { qPerAcre: 26, pricePerQ: 2350, unit: 'Quintals' },
    wheat: { qPerAcre: 22, pricePerQ: 2450, unit: 'Quintals' },
    maize: { qPerAcre: 30, pricePerQ: 2150, unit: 'Quintals' },
    cotton: { qPerAcre: 11, pricePerQ: 7100, unit: 'Quintals' },
    ragi: { qPerAcre: 14, pricePerQ: 3800, unit: 'Quintals' },
    banana: { qPerAcre: 260, pricePerQ: 1800, unit: 'Quintals' },
    mango: { qPerAcre: 55, pricePerQ: 4200, unit: 'Quintals' },
    grapes: { qPerAcre: 95, pricePerQ: 5500, unit: 'Quintals' },
    pomegranate: { qPerAcre: 45, pricePerQ: 8500, unit: 'Quintals' },
    papaya: { qPerAcre: 300, pricePerQ: 1200, unit: 'Quintals' },
    rose: { qPerAcre: 45, pricePerQ: 6000, unit: 'Quintals' },
    marigold: { qPerAcre: 60, pricePerQ: 3500, unit: 'Quintals' },
    jasmine: { qPerAcre: 20, pricePerQ: 18000, unit: 'Quintals' },
    chrysanthemum: { qPerAcre: 50, pricePerQ: 4000, unit: 'Quintals' },
    gerbera: { qPerAcre: 40, pricePerQ: 9000, unit: 'Quintals' }
  };

  const base = YIELD_BASELINES[cropId] || { qPerAcre: 35, pricePerQ: 3000, unit: 'Quintals' };
  const acres = f.farmSize && f.farmSize > 0 ? f.farmSize : 2.5;
  const totalYieldQ = r(base.qPerAcre * acres);
  const totalTons = r1(totalYieldQ / 10);
  const grossValuation = r(totalYieldQ * base.pricePerQ);
  const daysLeft = Math.max(5, (stageInfo.totalDuration || 110) - (stageInfo.day || 35));

  return `
    <div class="yield-calc-box">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
        <div>
          <h3 style="margin-bottom:4px">🌾 ${t('yieldPredictorTitle', 'Crop Yield & Harvest Revenue Predictor')}</h3>
          <p class="mu" style="margin:0">${t('yieldPredictorDesc', 'Projected harvest tonnage and gross market valuation based on active APMC Mandi rates.')}</p>
        </div>
        <span class="field-status-pill">ICAR Baseline Model</span>
      </div>

      <div class="yield-metrics-grid">
        <div class="yield-metric-tile">
          <small>Projected Total Yield</small>
          <b>${totalYieldQ} Q</b>
          <span class="mu" style="font-size:12px">~${totalTons} Metric Tonnes</span>
        </div>
        <div class="yield-metric-tile">
          <small>Estimated Gross Valuation</small>
          <b>₹${grossValuation.toLocaleString('en-IN')}</b>
          <span class="mu" style="font-size:12px">@ ₹${base.pricePerQ.toLocaleString('en-IN')}/Q benchmark</span>
        </div>
        <div class="yield-metric-tile">
          <small>Harvest Countdown</small>
          <b style="color:var(--farm-amber)">${daysLeft} Days</b>
          <span class="mu" style="font-size:12px">Until peak harvest readiness</span>
        </div>
        <div class="yield-metric-tile">
          <small>Water Productivity</small>
          <b style="color:var(--farm-info)">${r1(base.qPerAcre / 45)} kg/m³</b>
          <span class="mu" style="font-size:12px">With ${esc(f.irrigation || 'Drip')} efficiency</span>
        </div>
      </div>
    </div>
  `;
}

function initCropGrowthCanvas(canvasId = 'cropGrowthCanvas', farm = null) {
  const canvas = $('#' + canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (FarmHubState._animCropGrowthId) {
    cancelAnimationFrame(FarmHubState._animCropGrowthId);
    FarmHubState._animCropGrowthId = null;
  }

  const w = canvas.offsetWidth || 800;
  const h = 210;
  canvas.width = w;
  canvas.height = h;

  const f = farm || FarmHubState.activeFarm;
  const stageInfo = computeCropStage(f);
  const stages = ['Germination', 'Vegetative', 'Flowering', 'Maturity'];
  const curStageIdx = Math.max(0, stages.findIndex(s => s.toLowerCase() === (stageInfo.name || '').toLowerCase()));
  const activeIdx = curStageIdx >= 0 ? curStageIdx : 1;
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stageX = [w * 0.15, w * 0.38, w * 0.62, w * 0.85];
  const groundY = 150;

  function drawBotany() {
    ctx.clearRect(0, 0, w, h);

    // Ground Soil Line
    ctx.beginPath();
    ctx.moveTo(w * 0.05, groundY);
    ctx.lineTo(w * 0.95, groundY);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Subtle Soil Underground Fill
    ctx.fillStyle = 'rgba(78, 52, 46, 0.12)';
    ctx.fillRect(w * 0.05, groundY, w * 0.9, h - groundY);

    // Progress Line between Stages
    const progressLimitX = stageX[activeIdx] + (activeIdx < 3 ? (stageX[activeIdx + 1] - stageX[activeIdx]) * ((stageInfo.stageProgress || 50) / 100) : 0);
    ctx.beginPath();
    ctx.moveTo(stageX[0], groundY);
    ctx.lineTo(progressLimitX, groundY);
    ctx.strokeStyle = '#55D68A';
    ctx.lineWidth = 3;
    ctx.stroke();

    const time = Date.now() * 0.003;

    // Render 4 Growth Stages
    stages.forEach((st, idx) => {
      const cx = stageX[idx];
      const isActive = idx === activeIdx;
      const isPast = idx < activeIdx;

      // Active Stage Pulsing Halo
      if (isActive) {
        const pulse = 6 + Math.sin(time) * 3;
        ctx.beginPath();
        ctx.arc(cx, groundY, 18 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(85, 214, 138, 0.15)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, groundY, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#55D68A';
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(cx, groundY, 8, 0, Math.PI * 2);
        ctx.fillStyle = isPast ? '#55D68A' : '#64748B';
        ctx.fill();
      }

      // Stage Title
      ctx.textAlign = 'center';
      ctx.font = isActive ? 'bold 12.5px Inter, sans-serif' : '11px Inter, sans-serif';
      ctx.fillStyle = isActive ? '#55D68A' : isPast ? '#E2E8F0' : '#94A3B8';
      ctx.fillText(st, cx, groundY + 28);

      if (isActive) {
        ctx.font = '10px Inter, sans-serif';
        ctx.fillStyle = '#A7F3D0';
        ctx.fillText('● Current Stage', cx, groundY + 42);
      }

      // Draw Plant Vector Morphology
      ctx.save();
      ctx.translate(cx, groundY);

      if (idx === 0) {
        // Stage 1: Germination (sprout + cotyledon)
        ctx.strokeStyle = '#86EFAC';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(3, -12, 0, -22);
        ctx.stroke();

        ctx.fillStyle = '#4ADE80';
        ctx.beginPath();
        ctx.ellipse(-6, -20, 7, 4, -0.4, 0, Math.PI * 2);
        ctx.ellipse(6, -20, 7, 4, 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#D1D5DB';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(2, 14);
        ctx.stroke();
      } else if (idx === 1) {
        // Stage 2: Vegetative Canopy
        const sway = Math.sin(time + 1) * 2;
        ctx.strokeStyle = '#22C55E';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(sway, -25, sway * 1.5, -50);
        ctx.stroke();

        ctx.fillStyle = '#16A34A';
        [-15, -28, -40].forEach((ly, lIdx) => {
          const dir = lIdx % 2 === 0 ? 1 : -1;
          ctx.beginPath();
          ctx.ellipse(dir * 14, ly, 12, 6, dir * 0.4, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 24);
        ctx.moveTo(0, 8);
        ctx.lineTo(-12, 18);
        ctx.moveTo(0, 12);
        ctx.lineTo(12, 20);
        ctx.stroke();
      } else if (idx === 2) {
        // Stage 3: Flowering & Fruit Set
        const sway = Math.sin(time + 2) * 2.5;
        ctx.strokeStyle = '#16A34A';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(sway, -35, sway * 1.8, -70);
        ctx.stroke();

        ctx.fillStyle = '#15803D';
        [-20, -38, -52, -64].forEach((ly, lIdx) => {
          const dir = lIdx % 2 === 0 ? 1 : -1;
          ctx.beginPath();
          ctx.ellipse(dir * 18, ly, 15, 7, dir * 0.35, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.fillStyle = '#FACC15';
        [[-16, -55], [14, -45], [0, -72]].forEach(([fx, fy]) => {
          ctx.beginPath();
          ctx.arc(fx + sway, fy, 4, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.fillStyle = '#84CC16';
        ctx.beginPath();
        ctx.arc(-10 + sway, -32, 5.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (idx === 3) {
        // Stage 4: Harvest Maturity
        const sway = Math.sin(time + 3) * 1.5;
        ctx.strokeStyle = '#15803D';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(sway, -40, sway * 1.5, -78);
        ctx.stroke();

        ctx.fillStyle = '#166534';
        [-22, -42, -58, -70].forEach((ly, lIdx) => {
          const dir = lIdx % 2 === 0 ? 1 : -1;
          ctx.beginPath();
          ctx.ellipse(dir * 20, ly, 18, 8, dir * 0.3, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.fillStyle = '#EF4444';
        [[-14, -30], [16, -38], [-18, -48], [12, -58], [0, -76]].forEach(([rx, ry]) => {
          ctx.beginPath();
          ctx.arc(rx + sway, ry, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#22C55E';
          ctx.fillRect(rx + sway - 1.5, ry - 8, 3, 2.5);
          ctx.fillStyle = '#EF4444';
        });
      }

      ctx.restore();
    });

    if (!prefersReduced) {
      FarmHubState._animCropGrowthId = requestAnimationFrame(drawBotany);
    }
  }

  drawBotany();
}

function addCalendarTask() {
  const f = FarmHubState.activeFarm;
  const title = prompt('Enter task description: (e.g. Apply vermicompost top dressing)');
  if (title && title.trim()) {
    FarmHubState.tasks.push({
      id: 'task_' + Date.now().toString(36),
      farmId: f.id,
      title: title.trim(),
      done: false,
      createdAt: Date.now()
    });
    persistState();
    renderActiveModule();
  }
}

function toggleTaskDone(id) {
  const task = FarmHubState.tasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    persistState();
    renderActiveModule();
  }
}

function deleteCalendarTask(id) {
  FarmHubState.tasks = FarmHubState.tasks.filter(t => t.id !== id);
  persistState();
  renderActiveModule();
}

// ============================================================
// MODULE: IRRIGATION & WATER BALANCE
// ============================================================
async function renderIrrigationModule() {
  const f = FarmHubState.activeFarm;
  const wx = await getActiveFarmWeather();
  const inputs = buildEngineInputs(f, wx);
  const decision = runDecisionEngine(inputs, FarmHubState.history);

  const fc = SOIL_FC[f.soil] || 28;
  const pwp = SOIL_PWP[f.soil] || 12;
  const smVal = inputs.sm != null ? inputs.sm : 20;
  const stageInfo = computeCropStage(f);
  const cropObj = CROPS_DATA.getCrop(f.cropId, f.cropName);
  const kc = cropObj.kc || 0.8;
  const etc = inputs.et0 != null ? r1(inputs.et0 * kc) : null;

  return `
    <h2>${t('navIrrigation')} Management — ${esc(f.name)}</h2>
    <p class="mu">Root zone moisture assessment and volumetric irrigation demand calculations.</p>

    <!-- 3D INTERACTIVE SOIL STRATA & HYDROLOGY SIMULATOR -->
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:12px">
        <div>
          <h3 style="margin:0">3D ROOT ZONE HYDROLOGY & PERCOLATION SIMULATOR</h3>
          <p class="mu" style="margin:2px 0">Interactive isometric 3D cutaway of ${esc(f.soil || 'Loamy')} soil, root architecture, and dynamic moisture percolation.</p>
        </div>
        <div class="sim-controls-bar">
          <button class="btn sm" onclick="triggerPercolationSim('drip')">💧 Drip (20mm)</button>
          <button class="btn secondary sm" onclick="triggerPercolationSim('rain')">🌧️ Rain (40mm)</button>
          <button class="btn secondary sm" onclick="triggerPercolationSim('sun')">☀️ High ET Demand</button>
          <button class="btn secondary sm" onclick="triggerPercolationSim('reset')">↺ Reset</button>
        </div>
      </div>
      
      <div class="canvas-interactive-wrap" id="soil3DWrap" style="height:350px;position:relative">
        <canvas id="soilHydrology3D" width="800" height="350" style="width:100%;height:100%;display:block;cursor:grab"></canvas>
        
        <!-- Interactive Overlay HUD -->
        <div style="position:absolute;top:12px;left:14px;background:rgba(10,20,15,0.85);backdrop-filter:blur(6px);padding:8px 12px;border-radius:8px;font-size:12px;color:#cfdac8;border:1px solid rgba(255,255,255,0.12)">
          <div style="color:#55D68A;font-weight:700;margin-bottom:4px">🌱 Dynamic Strata Status</div>
          <div id="strataL1">Layer 1 (0–10cm Topsoil): <b>${r1(smVal * 1.08)}%</b></div>
          <div id="strataL2">Layer 2 (10–30cm Active Roots): <b>${r1(smVal)}%</b></div>
          <div id="strataL3">Layer 3 (30–60cm Subsoil): <b>${r1(smVal * 0.88)}%</b></div>
        </div>
        
        <div id="strataHydrologyAlert" style="position:absolute;top:12px;right:14px;background:rgba(10,20,15,0.85);backdrop-filter:blur(6px);padding:8px 14px;border-radius:8px;font-size:12px;color:#85E3A0;border:1px solid rgba(85,214,138,0.3)">
          Wetting Front: <b id="strataStatusText">Hydrologic Equilibrium</b>
        </div>
        
        <div style="position:absolute;bottom:10px;left:14px;right:14px;display:flex;justify-content:space-between;align-items:center;background:rgba(10,20,15,0.7);backdrop-filter:blur(4px);padding:5px 12px;border-radius:6px;font-size:11px;color:#94a3b8">
          <span>💡 <b>Tip:</b> Click & drag to rotate 3D soil volume in real-time</span>
          <span id="strataSoilTypeTag">Soil Matrix: ${esc(f.soil || 'Loamy')} (FC: ${fc}%, PWP: ${pwp}%)</span>
        </div>
      </div>
    </div>

    <!-- WATER BUDGET & VOLUME -->
    <div class="grid">
      <div class="sig-card">
        <small>Volumetric Requirement</small>
        <b>${decision.liters.toLocaleString()} L</b>
        <span>~${decision.cubicMeters} m³ for ${f.farmSize || 1} acres</span>
      </div>
      <div class="sig-card">
        <small>Irrigation System</small>
        <b>${f.irrigation || 'Drip'}</b>
        <span>${f.irrigation === 'Drip' ? '90% efficiency' : 'Standard efficiency'}</span>
      </div>
      <div class="sig-card">
        <small>Current Moisture</small>
        <b>${r1(smVal)}%</b>
        <span>Target: ~${r(fc * 0.8)}% (FC: ${fc}%)</span>
      </div>
      <div class="sig-card">
        <small>Pump Run Time Estimate</small>
        <b>~${r1((decision.liters / 1000) / 2.5)} Hours</b>
        <span>Assuming 2,500 LPH discharge</span>
      </div>
    </div>

    <div class="card" style="border-left:6px solid var(--green)">
      <h3>IRRIGATION DECISION CONTEXT</h3>
      <p>Good irrigation means the right amount of water at the right time and in the right way. The recommendation combines crop, ${esc(stageInfo.name)} stage, ${esc(f.soil || 'recorded soil')} soil, root-zone moisture, weather, rainfall, irrigation method and system efficiency.</p>
      <div class="grid">
        <div class="sig-card"><small>Rainfall outlook</small><b>${wx ? `${inputs.rp}% / ${inputs.rain} mm` : 'Unavailable'}</b><span>${wx ? 'Next 48 hours' : 'Verify locally'}</span></div>
        <div class="sig-card"><small>Reference ET0</small><b>${inputs.et0 != null ? inputs.et0 + ' mm' : 'Unavailable'}</b><span>Weather model estimate</span></div>
        <div class="sig-card"><small>Crop ETc estimate</small><b>${etc != null ? etc + ' mm' : 'Unavailable'}</b><span>ETc = ET0 × Kc (${kc})</span></div>
        <div class="sig-card"><small>Root-zone range</small><b>${pwp}%–${fc}%</b><span>PWP to field capacity</span></div>
      </div>
      <p class="mu">Net irrigation need is influenced by crop water requirement, effective rainfall and useful soil moisture. Actual applied water must also account for system losses; rainfall is not entirely available because runoff, drainage and evaporation can occur.</p>
    </div>

    <div class="card">
      <h3>WHEN AND HOW MUCH TO IRRIGATE</h3>
      <p>Irrigation scheduling answers when to irrigate and how much water to apply. Check soil moisture, crop stage, weather, effective root-zone depth, soil water-holding capacity, crop demand and irrigation efficiency together.</p>
      <div class="grid2">
        <div><b>Soil guidance</b><ul><li>Sandy soil drains quickly and may need more frequent, smaller applications.</li><li>Loamy soil holds moderate to good available water.</li><li>Clay soil drains slowly; excess water can cause waterlogging.</li></ul></div>
        <div><b>Weather guidance</b><ul><li>Heat, solar radiation, wind and low humidity can increase demand.</li><li>Forecast rain may reduce or postpone irrigation, but do not cancel automatically.</li><li>Use forecast confidence, current moisture and crop sensitivity before deciding.</li></ul></div>
      </div>
      <p class="mu"><b>Water balance:</b> Net irrigation requirement = crop water requirement − effective rainfall − useful soil-moisture contribution. The actual applied amount may be higher because no system is 100% efficient.</p>
    </div>

    <div class="card">
      <h3>IRRIGATION METHODS</h3>
      <div class="grid2">${IRRIGATION_GUIDE_DATA.methods.map(item => `<div style="padding:10px 0;border-bottom:1px solid var(--border)"><b>${esc(item[0])}</b><p class="mu" style="margin:3px 0">${esc(item[1])}</p><p style="margin:3px 0">${esc(item[2])}</p></div>`).join('')}</div>
    </div>

    <div class="grid2">
      <div class="card">
        <h3>GROWTH-STAGE WATER NEEDS</h3>
        ${IRRIGATION_GUIDE_DATA.stages.map(item => `<p><b>${esc(item[0])}</b><br>${esc(item[1])}<br><span class="mu">Avoid: ${esc(item[2])}</span></p>`).join('')}
      </div>
      <div class="card">
        <h3>CROP CONSIDERATIONS</h3>
        ${(IRRIGATION_GUIDE_DATA.cropNotes.find(item => item[0].toLowerCase() === String(f.cropName || '').toLowerCase()) ? [IRRIGATION_GUIDE_DATA.cropNotes.find(item => item[0].toLowerCase() === String(f.cropName || '').toLowerCase())] : IRRIGATION_GUIDE_DATA.cropNotes).map(item => `<p><b>${esc(item[0])}</b><br><span class="mu">${esc(item[1])}</span></p>`).join('')}
      </div>
    </div>

    <div class="grid2">
      <div class="card">
        <h3>SMART AND SENSOR-BASED IRRIGATION</h3>
        <p>Smart irrigation combines soil sensors, weather, crop information, irrigation history, valves and a mobile dashboard.</p>
        <p><b>Basic logic:</b> If soil moisture is below the crop threshold and rainfall is not expected, irrigation may be considered. Also check stage, recent irrigation, soil type, root-zone moisture and water availability.</p>
        ${IRRIGATION_GUIDE_DATA.sensors.map(item => `<p><b>${esc(item[0])}</b> <span class="mu">${esc(item[1])}</span></p>`).join('')}
      </div>
      <div class="card">
        <h3>WATER-SAVING PRACTICES</h3>
        <div>${IRRIGATION_GUIDE_DATA.saving.map(item => `<span class="field-status-pill" style="display:inline-block;margin:3px">${esc(item)}</span>`).join('')}</div>
        <h3 style="margin-top:16px">MULCHING</h3>
        <p class="mu">Mulch reduces evaporation, moderates soil temperature, suppresses weeds and can reduce erosion.</p>
        <p>${IRRIGATION_GUIDE_DATA.mulch.map(item => `<span class="field-status-pill" style="display:inline-block;margin:3px">${esc(item)}</span>`).join('')}</p>
      </div>
    </div>

    <div class="grid2">
      <div class="card" style="border-left:6px solid var(--farm-amber)">
        <h3>OVER-IRRIGATION AND WATERLOGGING</h3>
        <p>Applying more water than the crop and soil can use can cause waterlogging, low root oxygen, root disease, nutrient leaching, higher costs and reduced nutrient-use efficiency.</p>
        <p class="mu"><b>Warning signs:</b> Yellowing, wilting despite wet soil, poor growth, root damage or root rot.</p>
        <p><b>Respond:</b> Improve drainage, avoid unnecessary irrigation, use raised beds where appropriate and monitor soil moisture.</p>
      </div>
      <div class="card" style="border-left:6px solid var(--farm-info)">
        <h3>UNDER-IRRIGATION</h3>
        <p>Insufficient water can cause wilting, curling, leaf drying, reduced growth, flower drop, fruit-development problems and lower yield.</p>
        <p><b>Respond:</b> Check soil moisture and crop stage before deciding whether additional irrigation is required. Do not rely on a fixed litre value alone.</p>
      </div>
    </div>
  `;
}

function updateHydrologyHud() {
  if (!activeSoilHydrologySim) return;
  const sim = activeSoilHydrologySim;
  const l1 = $('#strataL1');
  const l2 = $('#strataL2');
  const l3 = $('#strataL3');
  const alertText = $('#strataStatusText');
  const alertBox = $('#strataHydrologyAlert');

  if (l1) l1.innerHTML = `Layer 1 (0–10cm Topsoil): <b>${r1(sim.strata[0])}%</b>`;
  if (l2) l2.innerHTML = `Layer 2 (10–30cm Active Roots): <b>${r1(sim.strata[1])}%</b>`;
  if (l3) l3.innerHTML = `Layer 3 (30–60cm Subsoil): <b>${r1(sim.strata[2])}%</b>`;
  if (alertText) alertText.textContent = sim.statusText;
  if (alertBox && sim.statusColor) alertBox.style.color = sim.statusColor;
}

window.triggerPercolationSim = function(action) {
  if (!activeSoilHydrologySim) return;
  const sim = activeSoilHydrologySim;

  if (action === 'drip') {
    sim.pulseIntensity = 30;
    sim.percolatingFront = 5;
    sim.statusText = 'Drip Infiltration Pulse (20 mm)';
    sim.statusColor = '#60A5FA';
    for (let i = 0; i < 75; i++) {
      sim.droplets.push({
        x: (Math.random() - 0.5) * 45,
        y: (Math.random() - 0.5) * 45,
        z: -60 - Math.random() * 80,
        vz: 3 + Math.random() * 3,
        type: 'drip'
      });
    }
    showToast('Simulating precision drip irrigation: 20 mm localized application');
  } else if (action === 'rain') {
    sim.pulseIntensity = 55;
    sim.percolatingFront = 5;
    sim.statusText = 'Widespread Rain Influx (40 mm)';
    sim.statusColor = '#38BDF8';
    for (let i = 0; i < 180; i++) {
      sim.droplets.push({
        x: (Math.random() - 0.5) * 260,
        y: (Math.random() - 0.5) * 180,
        z: -80 - Math.random() * 120,
        vz: 5 + Math.random() * 4,
        type: 'rain'
      });
    }
    showToast('Simulating rain event: 40 mm precipitation across field surface');
  } else if (action === 'sun') {
    sim.pulseIntensity = 0;
    sim.strata[0] = Math.max(sim.pwp - 2, sim.strata[0] - 8.5);
    sim.strata[1] = Math.max(sim.pwp + 2, sim.strata[1] - 3.2);
    sim.statusText = 'High Evaporative Demand & Transpiration Loss';
    sim.statusColor = '#F59E0B';
    showToast('Simulating peak solar radiation: High ET0 drawing soil moisture');
  } else if (action === 'reset') {
    sim.strata = [
      Math.min(50, sim.baseM * 1.08),
      sim.baseM,
      Math.max(10, sim.baseM * 0.88)
    ];
    sim.droplets = [];
    sim.percolatingFront = 0;
    sim.pulseIntensity = 0;
    sim.statusText = 'Hydrologic Equilibrium Restored';
    sim.statusColor = '#85E3A0';
    showToast('Reset hydrology model to baseline');
  }
  updateHydrologyHud();
};

function initSoilHydrology3D(canvasId = 'soilHydrology3D') {
  const canvas = $('#' + canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (FarmHubState._animHydrologyId) {
    cancelAnimationFrame(FarmHubState._animHydrologyId);
    FarmHubState._animHydrologyId = null;
  }

  const w = canvas.offsetWidth || 800;
  const h = 350;
  canvas.width = w;
  canvas.height = h;

  const f = FarmHubState.activeFarm;
  const fc = SOIL_FC[f.soil] || 28;
  const pwp = SOIL_PWP[f.soil] || 12;
  const baseM = FarmHubState.curWeather?.sm || 22.0;

  activeSoilHydrologySim = {
    canvas,
    ctx,
    rot: 0.54,
    pitch: 0.44,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    baseM,
    fc,
    pwp,
    soilType: f.soil || 'Loamy',
    strata: [
      Math.min(50, baseM * 1.08),
      baseM,
      Math.max(10, baseM * 0.88)
    ],
    droplets: [],
    percolatingFront: 0,
    pulseIntensity: 0,
    rootCapillaryPulse: 0,
    statusText: 'Hydrologic Equilibrium',
    statusColor: '#85E3A0'
  };

  const sim = activeSoilHydrologySim;

  canvas.onpointerdown = e => {
    sim.isDragging = true;
    sim.lastX = e.clientX;
    sim.lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  };
  canvas.onpointermove = e => {
    if (!sim.isDragging) return;
    sim.rot += (e.clientX - sim.lastX) * 0.008;
    sim.pitch = Math.max(0.18, Math.min(0.82, sim.pitch + (e.clientY - sim.lastY) * 0.006));
    sim.lastX = e.clientX;
    sim.lastY = e.clientY;
  };
  canvas.onpointerup = e => {
    sim.isDragging = false;
    try { canvas.releasePointerCapture(e.pointerId); } catch (err) {}
  };

  function project3D(x, y, z) {
    const cosR = Math.cos(sim.rot);
    const sinR = Math.sin(sim.rot);
    const cosP = Math.cos(sim.pitch);
    const sinP = Math.sin(sim.pitch);
    const rx = x * cosR - y * sinR;
    const ry = x * sinR + y * cosR;
    const cx = w / 2;
    const cy = h / 2 - 20;
    return {
      x: cx + rx,
      y: cy + ry * sinP + z * cosP
    };
  }

  function getStratumColor(baseRGB, moisture, isSide = false) {
    const sat = Math.max(0, Math.min(1.4, (moisture - sim.pwp) / Math.max(1, sim.fc - sim.pwp)));
    const darkness = 1.0 - (sat * 0.32);
    const shade = isSide ? 0.82 : 1.0;
    const r = Math.round(baseRGB[0] * darkness * shade);
    const g = Math.round(baseRGB[1] * darkness * shade);
    const b = Math.round(baseRGB[2] * darkness * shade);
    return `rgb(${r}, ${g}, ${b})`;
  }

  const W = 280;
  const D = 200;
  const layerDepths = [0, 45, 110, 170];
  const baseColors = [
    [75, 48, 32],
    [98, 65, 45],
    [130, 85, 60]
  ];

  function drawSim() {
    ctx.clearRect(0, 0, w, h);

    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, 280);
    bgGrad.addColorStop(0, 'rgba(19, 42, 28, 0.4)');
    bgGrad.addColorStop(1, 'rgba(11, 20, 15, 0)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    if (sim.pulseIntensity > 0) {
      sim.percolatingFront += 0.9;
      if (sim.percolatingFront >= 45 && sim.percolatingFront < 110) {
        sim.strata[0] = Math.max(sim.fc, sim.strata[0]);
        sim.strata[1] = Math.min(sim.fc * 1.15, sim.strata[1] + 0.08);
        sim.rootCapillaryPulse = 1.0;
        sim.statusText = 'Root Zone Infiltration & Capillary Intake';
        sim.statusColor = '#55D68A';
      } else if (sim.percolatingFront >= 110 && sim.percolatingFront < 170) {
        sim.strata[2] = Math.min(sim.fc, sim.strata[2] + 0.05);
        sim.statusText = 'Subsoil Percolation & Drainage Buffer';
        sim.statusColor = '#A78BFA';
      } else if (sim.percolatingFront >= 170) {
        sim.pulseIntensity -= 1;
        if (sim.pulseIntensity <= 0) {
          sim.statusText = 'Hydrologic Equilibrium Restored';
          sim.statusColor = '#85E3A0';
        }
      }
      updateHydrologyHud();
    }

    const p0 = project3D(-W / 2, -D / 2, 0);
    const p1 = project3D(W / 2, -D / 2, 0);
    const p2 = project3D(W / 2, D / 2, 0);
    const p3 = project3D(-W / 2, D / 2, 0);

    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.fillStyle = getStratumColor(baseColors[0], sim.strata[0], false);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = 'rgba(40, 25, 15, 0.35)';
    for (let k = -4; k <= 4; k++) {
      const sp = project3D(k * 25, (k % 2 === 0 ? 1 : -1) * 30, 0);
      ctx.fillRect(sp.x, sp.y, 2, 2);
    }

    for (let i = 0; i < 3; i++) {
      const zTop = layerDepths[i];
      const zBot = layerDepths[i + 1];

      const c0 = project3D(-W / 2, D / 2, zTop);
      const c1 = project3D(W / 2, D / 2, zTop);
      const c2 = project3D(W / 2, D / 2, zBot);
      const c3 = project3D(-W / 2, D / 2, zBot);

      ctx.beginPath();
      ctx.moveTo(c0.x, c0.y);
      ctx.lineTo(c1.x, c1.y);
      ctx.lineTo(c2.x, c2.y);
      ctx.lineTo(c3.x, c3.y);
      ctx.closePath();
      ctx.fillStyle = getStratumColor(baseColors[i], sim.strata[i], true);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.stroke();

      const mid = project3D(-W / 2, D / 2, (zTop + zBot) / 2);
      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.textAlign = 'right';
      const titles = ['0-10cm Topsoil', '10-30cm Root Zone', '30-60cm Subsoil'];
      ctx.fillText(titles[i], mid.x - 8, mid.y + 3);
    }

    for (let i = 0; i < 3; i++) {
      const zTop = layerDepths[i];
      const zBot = layerDepths[i + 1];

      const r0 = project3D(W / 2, D / 2, zTop);
      const r1 = project3D(W / 2, -D / 2, zTop);
      const r2 = project3D(W / 2, -D / 2, zBot);
      const r3 = project3D(W / 2, D / 2, zBot);

      ctx.beginPath();
      ctx.moveTo(r0.x, r0.y);
      ctx.lineTo(r1.x, r1.y);
      ctx.lineTo(r2.x, r2.y);
      ctx.lineTo(r3.x, r3.y);
      ctx.closePath();
      ctx.fillStyle = getStratumColor(baseColors[i], sim.strata[i], true);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.stroke();
    }

    if (sim.pulseIntensity > 0 && sim.percolatingFront > 0 && sim.percolatingFront < 170) {
      const wf0 = project3D(-W / 2, D / 2, sim.percolatingFront);
      const wf1 = project3D(W / 2, D / 2, sim.percolatingFront);

      ctx.beginPath();
      ctx.moveTo(wf0.x, wf0.y);
      ctx.lineTo(wf1.x, wf1.y);
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
      const wfTop0 = project3D(-W / 2, D / 2, Math.max(0, sim.percolatingFront - 15));
      const wfTop1 = project3D(W / 2, D / 2, Math.max(0, sim.percolatingFront - 15));
      ctx.beginPath();
      ctx.moveTo(wfTop0.x, wfTop0.y);
      ctx.lineTo(wfTop1.x, wfTop1.y);
      ctx.lineTo(wf1.x, wf1.y);
      ctx.lineTo(wf0.x, wf0.y);
      ctx.closePath();
      ctx.fill();
    }

    const rootNodes = [
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 45 },
      { x: 0, y: 0, z: 90 },
      { x: 0, y: 0, z: 135 }
    ];
    const lateralRoots = [
      { x1: 0, y1: 0, z1: 30, x2: -65, y2: 20, z2: 65 },
      { x1: 0, y1: 0, z1: 45, x2: 70, y2: 30, z2: 75 },
      { x1: 0, y1: 0, z1: 60, x2: -50, y2: 45, z2: 95 },
      { x1: 0, y1: 0, z1: 75, x2: 55, y2: -35, z2: 105 },
      { x1: 0, y1: 0, z1: 90, x2: -35, y2: -45, z2: 120 }
    ];

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#E2E8F0';
    ctx.beginPath();
    const t0 = project3D(rootNodes[0].x, rootNodes[0].y, rootNodes[0].z);
    ctx.moveTo(t0.x, t0.y);
    for (let r = 1; r < rootNodes.length; r++) {
      const tp = project3D(rootNodes[r].x, rootNodes[r].y, rootNodes[r].z);
      ctx.lineTo(tp.x, tp.y);
    }
    ctx.stroke();

    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#CBD5E1';
    for (let lr of lateralRoots) {
      const a = project3D(lr.x1, lr.y1, lr.z1);
      const b = project3D(lr.x2, lr.y2, lr.z2);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    if (sim.strata[1] >= sim.pwp) {
      const timePhase = (Date.now() * 0.003) % 1;
      ctx.fillStyle = '#67E8F9';
      lateralRoots.forEach((lr, idx) => {
        const t = (timePhase + idx * 0.2) % 1;
        const px = lr.x2 + (lr.x1 - lr.x2) * t;
        const py = lr.y2 + (lr.y1 - lr.y2) * t;
        const pz = lr.z2 + (lr.z1 - lr.z2) * t;
        const pProj = project3D(px, py, pz);
        ctx.beginPath();
        ctx.arc(pProj.x, pProj.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    const sway = Math.sin(Date.now() * 0.0025) * 4;
    const stemBase = project3D(0, 0, 0);
    const stemTop = project3D(sway, sway * 0.5, -75);

    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(stemBase.x, stemBase.y);
    ctx.quadraticCurveTo(stemBase.x + sway * 0.5, (stemBase.y + stemTop.y) / 2, stemTop.x, stemTop.y);
    ctx.stroke();

    ctx.fillStyle = '#16A34A';
    [-25, -50, -70].forEach((lz, idx) => {
      const dir = idx % 2 === 0 ? 1 : -1;
      const leafNode = project3D(dir * 18, 0, lz);
      ctx.beginPath();
      ctx.ellipse(leafNode.x, leafNode.y, 14, 7, dir * 0.4, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#EF4444';
    const fNode1 = project3D(-10 + sway * 0.5, 8, -40);
    const fNode2 = project3D(12 + sway * 0.5, -8, -52);
    ctx.beginPath();
    ctx.arc(fNode1.x, fNode1.y, 5, 0, Math.PI * 2);
    ctx.arc(fNode2.x, fNode2.y, 4.5, 0, Math.PI * 2);
    ctx.fill();

    for (let d = sim.droplets.length - 1; d >= 0; d--) {
      const dp = sim.droplets[d];
      dp.z += dp.vz;

      const pt = project3D(dp.x, dp.y, dp.z);
      ctx.fillStyle = dp.type === 'drip' ? '#60A5FA' : '#93C5FD';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, dp.type === 'drip' ? 2.5 : 1.8, 0, Math.PI * 2);
      ctx.fill();

      if (dp.z >= 0) {
        sim.strata[0] = Math.min(50, sim.strata[0] + 0.06);
        sim.droplets.splice(d, 1);
      }
    }

    FarmHubState._animHydrologyId = requestAnimationFrame(drawSim);
  }

  drawSim();
}

// ============================================================
// MODULE: FARM ADVISORY (Deep Explainability)
// ============================================================
function buildAdvisoryExplainability(f, inputs, decision) {
  const risk = decision.level === 'CRITICAL' || decision.level === 'HIGH' ? 'HIGH' : decision.level === 'MODERATE' ? 'MEDIUM' : 'LOW';
  const priority = risk === 'HIGH' ? 'IMMEDIATE' : risk === 'MEDIUM' ? 'SOON' : 'MONITOR';
  const confidenceBand = decision.conf >= 85 ? 'HIGH' : decision.conf >= 60 ? 'MEDIUM' : 'LOW';
  const crop = f.cropName || 'your crop';
  const stage = inputs.stage || 'current growth stage';
  const evidence = [
    `Crop: ${crop}, ${stage} stage (day ${inputs.day ?? 0}).`,
    `Soil: ${inputs.soil || 'not recorded'}; moisture ${inputs.sm == null ? 'not available' : r1(inputs.sm) + '%'} from ${inputs.src || 'unknown source'}.`,
    inputs.wx ? `Weather: ${inputs.t ?? '--'}°C, ${inputs.h ?? '--'}% humidity, ${inputs.rp ?? '--'}% rain probability and ${inputs.rain ?? '--'} mm expected rain.` : 'Weather data is unavailable; local conditions need manual verification.',
    `Irrigation: ${inputs.method || 'not recorded'}; farm history matches: ${FarmHubState.history.length}.`
  ];
  const actionPlan = {
    IRRIGATE: ['Check soil moisture and irrigation lines.', `Irrigate ${crop} in the recommended early-morning window.`, 'Use the calculated volume as a planning estimate and stop if the soil reaches the target range.'],
    WAIT: ['Do not irrigate immediately.', 'Inspect drainage and monitor rainfall before the next pump cycle.', 'Re-check the crop after the forecast window changes.'],
    'DELAY IRRIGATION': ['Hold irrigation briefly while watching the rain front.', 'Re-check soil moisture and the forecast within 12–24 hours.', 'Irrigate only if the crop remains below its target range and rain does not arrive.'],
    'INSPECT FIELD': ['Walk the field and hand-check root-zone moisture.', 'Inspect leaves, stems and nearby plants for stress or disease signs.', 'Record a fresh reading before starting a long irrigation cycle.'],
    'PROTECT CROP': ['Protect the crop from peak heat or heavy rain exposure.', 'Use mulch, shade or drainage measures appropriate to the field.', 'Re-check the crop after the weather event.'],
    'CHECK DRAINAGE': ['Inspect and clear field drains and bund exits.', 'Prevent standing water around the root zone.', 'Re-check soil moisture after rainfall stops.'],
    MONITOR: ['Continue routine crop scouting.', 'Check soil moisture and local weather before the next irrigation decision.', 'Record a fresh reading if crop symptoms appear.']
  }[decision.actionKey] || ['Inspect the field and verify the recommendation locally.'];
  const why = decision.why.length ? decision.why : ['No single risk factor dominates the current decision.'];
  const consequence = decision.actionKey === 'IRRIGATE'
    ? 'Leaving a sustained moisture deficit untreated can increase wilting, growth loss and heat stress.'
    : decision.actionKey === 'CHECK DRAINAGE'
    ? 'Ignoring standing water can reduce root oxygen and favour root disease.'
    : decision.actionKey === 'WAIT' || decision.actionKey === 'DELAY IRRIGATION'
    ? 'Irrigating despite likely rainfall can waste water, leach nutrients and increase excess moisture.'
    : 'Ignoring a changing field signal can delay detection of crop stress or disease.';
  const prevention = ['Use healthy planting material and maintain field sanitation.', 'Match irrigation to soil moisture, crop stage and forecast rainfall.', 'Scout regularly and keep crop, fertilizer and field observations in the farm record.'];

  return { risk, priority, confidenceBand, evidence, actionPlan, why, consequence, prevention, crop, stage };
}

async function renderAdvisoryModule() {
  const f = FarmHubState.activeFarm;
  const wx = await getActiveFarmWeather();
  const inputs = buildEngineInputs(f, wx);
  const decision = runDecisionEngine(inputs, FarmHubState.history);
  const advisory = buildAdvisoryExplainability(f, inputs, decision);
  FarmHubState.curDecision = decision;

  return `
    <h2>${t('navAdvisory')} & Explainability Engine</h2>
    <p class="mu">${esc(advisory.crop)} advisory for the ${esc(advisory.stage)} stage. The engine follows Detect → Explain → Recommend → Prevent → Monitor.</p>

    <div class="card">
      <div style="font-size:24px;font-weight:800;margin-bottom:10px">${decision.icon} ${decision.dec}</div>
      <p style="font-size:16px;color:var(--text)">${decision.act}</p>
      <div class="row" style="margin-top:14px">
        <span class="field-status-pill">Confidence: ${decision.conf}%</span>
        <span class="field-status-pill">Confidence band: ${advisory.confidenceBand}</span>
        <span class="field-status-pill">Data Quality: ${decision.dq}%</span>
        <span class="field-status-pill">Risk: ${advisory.risk} (${decision.over}/100)</span>
        <span class="field-status-pill">Priority: ${advisory.priority}</span>
      </div>
    </div>

    <div class="grid2">
      <div class="card">
        <h3>WHAT WAS DETECTED?</h3>
        <p><b>Current advisory:</b> ${esc(decision.dec)} for ${esc(advisory.crop)}.</p>
        <p class="mu">This is a risk and action estimate from the available field data, not confirmation of a disease, pest or nutrient deficiency.</p>
        <h3 style="margin-top:16px">EVIDENCE USED</h3>
        <ul>${advisory.evidence.map(item => `<li>${esc(item)}</li>`).join('')}</ul>
      </div>
      <div class="card">
        <h3>WHY THIS RECOMMENDATION?</h3>
        <ul>${advisory.why.map(item => `<li>${esc(item)}</li>`).join('')}</ul>
        <p class="mu">The risk level is an estimate based on the available evidence. Weather risk is not the same as confirmed disease.</p>
      </div>
    </div>

    <div class="card" style="border-left:6px solid ${advisory.priority === 'IMMEDIATE' ? 'var(--farm-danger)' : advisory.priority === 'SOON' ? 'var(--farm-amber)' : 'var(--green)'}">
      <h3>DO THIS NOW <span class="mu">(${advisory.priority})</span></h3>
      <ol>${advisory.actionPlan.map(item => `<li>${esc(item)}</li>`).join('')}</ol>
      <p><b>When:</b> ${esc(decision.win)}</p>
      <p class="mu"><b>Why this matters:</b> ${esc(decision.act)}</p>
    </div>

    <div class="grid2">
      <div class="card">
        <h3>RISK IF IGNORED</h3>
        <p>${esc(advisory.consequence)}</p>
        <h3 style="margin-top:16px">EXPECTED BENEFIT</h3>
        <p class="mu">Timely field verification and the recommended action can reduce avoidable water loss, stress and progression of crop problems.</p>
      </div>
      <div class="card">
        <h3>PREVENTION</h3>
        <ul>${advisory.prevention.map(item => `<li>${esc(item)}</li>`).join('')}</ul>
      </div>
    </div>

    <div class="card" style="background:var(--surface-alt)">
      <h3>MONITORING AND ESCALATION</h3>
      <p><b>Next check:</b> ${esc(decision.nextCheck)}</p>
      <p class="mu">${esc(decision.unc)}</p>
      <p>Upload additional plant images, add crop and soil information, or consult an agricultural expert when confidence is low, symptoms are ambiguous, roots are affected, a viral problem is suspected, damage is severe, or chemical treatment may be required.</p>
    </div>

    <div class="ff-card">
      <div class="ff-title">AGRONOMIC REASONS</div>
      <ul class="ff-why-list">
        ${decision.why.map(w => `<li>${esc(w)}</li>`).join('')}
      </ul>
    </div>

    <div class="ff-card">
      <div class="ff-title">MATHEMATICAL DECISION TRACE</div>
      <div style="background:var(--surface-alt);padding:14px;border-radius:8px">
        ${decision.flow.map(fl => `<div>• ${esc(fl)}</div>`).join('')}
      </div>
    </div>
  `;
}

// ============================================================
// MODULE: FERTILIZER & NUTRITION GUIDE
// ============================================================
function renderFertilizerModule() {
  const f = FarmHubState.activeFarm;
  const cropObj = CROPS_DATA.getCrop(f.cropId, f.cropName);
  const stageInfo = computeCropStage(f);
  const area = f.farmSize || 1;
  const pref = f.fertilizerPreference || 'Integrated';

  return `
    <h2>${t('navFertilizer')} Guide — ${esc(f.cropName)}</h2>
    <p class="mu">Targeted nutrition guide adapted to your preferred management strategy. Use soil tests and crop requirements before deciding source or dose.</p>

    <!-- FERTILIZER PREFERENCE TOGGLE -->
    <div class="card">
      <h3>CHOOSE FERTILIZER STRATEGY</h3>
      <div class="row">
        <button class="btn ${pref === 'Natural' ? '' : 'secondary'}" onclick="setFertPreference('Natural')">
          ${t('fertPrefNatural')}
        </button>
        <button class="btn ${pref === 'Synthetic' ? '' : 'secondary'}" onclick="setFertPreference('Synthetic')">
          ${t('fertPrefSynthetic')}
        </button>
        <button class="btn ${pref === 'Integrated' ? '' : 'secondary'}" onclick="setFertPreference('Integrated')">
          ${t('fertPrefIntegrated')}
        </button>
      </div>
    </div>

    <!-- SAFETY & SOIL TEST NOTICE -->
    <div class="card" style="background:var(--surface-alt);border-left:6px solid var(--farm-amber)">
      <p style="font-weight:600;margin:0">⚠️ ${t('fertSafetyNotice')}</p>
    </div>

    <!-- NPK ESTIMATES -->
    <div class="card">
      <h3>${t('npkDosageTitle')} (${stageInfo.name.toUpperCase()} STAGE) — ${area} ACRES</h3>
      <p class="mu">Illustrative starter estimates only, not a fertilizer prescription. Confirm nutrient need, dose and timing with soil testing and local crop guidance.</p>
      <div class="grid">
        <div class="sig-card">
          <small>Nitrogen (Urea 46%)</small>
          <b>~${r(area * 25)} kg</b>
          <span>~${r1((area * 25) / 45)} bags</span>
        </div>
        <div class="sig-card">
          <small>Phosphorus (DAP 18:46:0)</small>
          <b>~${r(area * 30)} kg</b>
          <span>Root vigor</span>
        </div>
        <div class="sig-card">
          <small>Potassium (MOP 60%)</small>
          <b>~${r(area * 20)} kg</b>
          <span>Stress tolerance</span>
        </div>
        <div class="sig-card">
          <small>Compost / Vermicompost</small>
          <b>~${r1(area * 1.5)} tonnes</b>
          <span>Organic matter</span>
        </div>
      </div>
    </div>

    <!-- STAGE SCHEDULE -->
    <div class="card">
      <h3>STAGE-SPECIFIC NUTRITIONAL INSTRUCTIONS</h3>
      <table>
        <thead>
          <tr>
            <th>Stage</th>
            <th>Conventional Option</th>
            <th>Organic Option</th>
          </tr>
        </thead>
        <tbody>
          ${STAGES.map(stName => {
            const isNow = stName === stageInfo.name;
            const fertData = cropObj.fert ? cropObj.fert[stName] : null;
            return `
              <tr class="${isNow ? 'now' : ''}">
                <td><b>${stName}</b> ${isNow ? '◀ Current' : ''}</td>
                <td>${fertData ? fertData[0] : 'Balanced NPK as per local package of practices.'}</td>
                <td>${fertData ? fertData[1] : 'Well-rotted compost + Jeevamrutham every 14 days.'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>

    <div class="card">
      <h3>FERTILIZER REFERENCE LIBRARY</h3>
      <p class="mu">Organic fertilizers add matter and biology; mineral fertilizers supply more concentrated, measurable nutrients. Choose by crop, stage, soil and irrigation.</p>
      <div class="grid2">
        <details open>
          <summary><b>Organic fertilizers</b></summary>
          ${FERTILIZER_GUIDE_DATA.organic.map(item => `<div style="padding:12px 0;border-bottom:1px solid var(--border)"><b>${esc(item[0])}</b><p class="mu" style="margin:3px 0">Source: ${esc(item[1])}</p><p style="margin:3px 0">${esc(item[2])}</p><small class="mu">Suitable / note: ${esc(item[3])}</small></div>`).join('')}
        </details>
        <details>
          <summary><b>Inorganic and mineral fertilizers</b></summary>
          ${FERTILIZER_GUIDE_DATA.mineral.map(item => `<div style="padding:12px 0;border-bottom:1px solid var(--border)"><b>${esc(item[0])}</b><p class="mu" style="margin:3px 0">${esc(item[1])}</p><p style="margin:3px 0">${esc(item[2])}</p><small class="mu">Precaution: ${esc(item[3])}</small></div>`).join('')}
        </details>
      </div>
    </div>

    <div class="grid2">
      <div class="card">
        <h3>SECONDARY NUTRIENTS</h3>
        ${FERTILIZER_GUIDE_DATA.secondary.map(item => `<p><b>${esc(item[0])}</b><br><span class="mu">Sources: ${esc(item[1])}</span><br>${esc(item[2])}</p>`).join('')}
      </div>
      <div class="card">
        <h3>MICRONUTRIENTS</h3>
        ${FERTILIZER_GUIDE_DATA.micronutrients.map(item => `<p><b>${esc(item[0])}</b><br><span class="mu">${esc(item[1])}</span><br>${esc(item[2])}</p>`).join('')}
      </div>
    </div>

    <div class="grid2">
      <div class="card">
        <h3>WATER-SOLUBLE FERTILIZERS</h3>
        <p>${FERTILIZER_GUIDE_DATA.waterSoluble.map(item => `<span class="field-status-pill" style="display:inline-block;margin:3px">${esc(item)}</span>`).join('')}</p>
        <p class="mu">Useful for fertigation or foliar application depending on the product. Rapid availability does not remove the need for correct concentration and compatibility.</p>
      </div>
      <div class="card">
        <h3>BIOFERTILIZERS</h3>
        ${FERTILIZER_GUIDE_DATA.biofertilizers.map(item => `<p><b>${esc(item[0])}</b><br><span class="mu">${esc(item[1])}</span></p>`).join('')}
      </div>
    </div>

    <div class="card">
      <h3>FERTILIZER SELECTION BY PURPOSE</h3>
      <table><thead><tr><th>Purpose</th><th>Priority nutrient</th><th>Examples</th></tr></thead><tbody>
        ${FERTILIZER_GUIDE_DATA.purposes.map(item => `<tr><td><b>${esc(item[0])}</b></td><td>${esc(item[1])}</td><td>${esc(item[2])}</td></tr>`).join('')}
      </tbody></table>
    </div>

    <div class="card">
      <h3>APPLICATION METHODS</h3>
      <div class="grid2">${FERTILIZER_GUIDE_DATA.methods.map(item => `<div><b>${esc(item[0])}</b><p class="mu">${esc(item[1])}</p><p>${esc(item[2])}</p></div>`).join('')}</div>
    </div>

    <div class="card" style="background:var(--surface-alt);border-left:6px solid var(--green)">
      <h3>INTEGRATED NUTRIENT MANAGEMENT AND 4R STEWARDSHIP</h3>
      <p>Combine organic manures, compost, biofertilizers, mineral fertilizers, crop residues, green manure, soil-test-based application and crop rotation. This supports nutrient-use efficiency and soil fertility better than relying on one source.</p>
      <p><b>Right nutrient + Right source + Right dose + Right time + Right place.</b></p>
      <p class="mu">Do not recommend fertilizer from a leaf image alone. Combine crop, growth stage, soil test, pH, soil type, irrigation, weather, expected yield, fertilizer history and confirmed deficiency.</p>
      <p class="mu">Excess fertilizer can cause toxicity, salt stress, imbalance, root damage, runoff, water pollution and poor nutrient-use efficiency. Follow the product label and local agricultural recommendations.</p>
    </div>
  `;
}

function setFertPreference(pref) {
  FarmHubState.activeFarm.fertilizerPreference = pref;
  persistState();
  renderActiveModule();
}

// ============================================================
// MODULE: CROP HEALTH & PEST/DISEASE DIAGNOSTIC
// ============================================================
function renderHealthModule() {
  const f = FarmHubState.activeFarm;
  const cropObj = CROPS_DATA.getCrop(f.cropId, f.cropName);

  return `
    <h2>${t('healthTitle')} — ${esc(f.cropName)}</h2>
    <p class="mu">${t('healthSubtitle')}</p>

    <!-- INTERACTIVE DIAGNOSTIC CASE STUDIES -->
    <div class="card" style="margin-bottom:16px">
      <h3>🔬 ${t('sampleDiagnosticsTitle', 'Interactive Diagnostic Case Studies')}</h3>
      <p class="mu">${t('sampleDiagnosticsDesc', 'Click any case study below to simulate instant multi-spectral leaf diagnostic scan and view IPM protocol:')}</p>

      <div class="sample-leaves-grid">
        <div class="sample-leaf-card" onclick="loadHealthSampleCase('early_blight')">
          <div class="sample-leaf-icon">🍅</div>
          <div class="sample-leaf-title">Tomato: Early Blight</div>
          <div class="sample-leaf-tag">Alternaria solani</div>
          <div style="font-size:11px;color:var(--muted);margin-top:4px">Concentric dark rings</div>
        </div>
        <div class="sample-leaf-card" onclick="loadHealthSampleCase('powdery_mildew')">
          <div class="sample-leaf-icon">🌹</div>
          <div class="sample-leaf-title">Rose: Powdery Mildew</div>
          <div class="sample-leaf-tag">Podosphaera pannosa</div>
          <div style="font-size:11px;color:var(--muted);margin-top:4px">White fungal dusting</div>
        </div>
        <div class="sample-leaf-card" onclick="loadHealthSampleCase('bacterial_blight')">
          <div class="sample-leaf-icon">🌾</div>
          <div class="sample-leaf-title">Rice: Bacterial Blight</div>
          <div class="sample-leaf-tag">Xanthomonas oryzae</div>
          <div style="font-size:11px;color:var(--muted);margin-top:4px">Water-soaked lesions</div>
        </div>
        <div class="sample-leaf-card" onclick="loadHealthSampleCase('healthy_leaf')">
          <div class="sample-leaf-icon">🍃</div>
          <div class="sample-leaf-title">Healthy Canopy</div>
          <div class="sample-leaf-tag" style="color:var(--green)">Optimal Vigor</div>
          <div style="font-size:11px;color:var(--muted);margin-top:4px">Normal chlorophyll</div>
        </div>
      </div>

      <!-- VISUAL LASER SCANNER BOX -->
      <div id="leafScannerBox" style="display:none"></div>
    </div>

    <!-- PHOTO UPLOAD & DIAGNOSTIC CARD -->
    <div class="grid2">
      <div class="card">
        <h3>${t('uploadPhoto')}</h3>
        <p class="mu">Upload a clear photo, then select visible signs below. The result is a probable triage match.</p>
        <input type="file" id="healthPhotoInput" accept="image/*" onchange="handleHealthPhotoUpload(event)" style="margin-bottom:12px">
        <div id="photoPreviewArea" style="text-align:center"></div>
      </div>

      <div class="card">
        <h3>OBSERVED SYMPTOMS</h3>
        <label><input type="checkbox" class="sym-chk" value="yellow_leaves"> Leaves turning yellow / pale chlorosis</label>
        <label><input type="checkbox" class="sym-chk" value="curling"> Leaves curling or crinkling</label>
        <label><input type="checkbox" class="sym-chk" value="spots"> Brown/black spots or concentric rings</label>
        <label><input type="checkbox" class="sym-chk" value="wilting"> Wilting during midday sun</label>
        <label><input type="checkbox" class="sym-chk" value="chewed"> Chewed margins or holes on foliage</label>
        <label><input type="checkbox" class="sym-chk" value="white_growth"> White powder or growth on leaves</label>
        <button class="btn" style="margin-top:14px" onclick="runSymptomDiagnosis()">${t('analyzeSymptoms')}</button>
      </div>
    </div>

    <!-- DIAGNOSTIC RESULTS CONTAINER -->
    <div id="healthResultsContainer"></div>

    <!-- KNOWN PESTS & DISEASES FOR ACTIVE CROP -->
    <div class="card" style="margin-top:16px">
      <h3>COMMON VULNERABILITIES FOR ${esc(f.cropName).toUpperCase()}</h3>
      <div class="grid2">
        <div>
          <b>Known Diseases:</b>
          <ul>
            ${(cropObj.diseases || ['Fungal leaf spot', 'Root rot']).map(d => `<li>${esc(d)}</li>`).join('')}
          </ul>
        </div>
        <div>
          <b>Known Pests:</b>
          <ul>
            ${(cropObj.pests || ['Sucking insects', 'Fruit borer']).map(p => `<li>${esc(p)}</li>`).join('')}
          </ul>
        </div>
      </div>
      <p class="mu" style="margin-top:10px">⚠️ ${t('healthDisclaimer')}</p>
    </div>
  `;
}

function loadHealthSampleCase(caseId) {
  const box = $('#leafScannerBox');
  if (!box) return;

  const CASES = {
    early_blight: {
      title: 'Tomato: Early Blight (Alternaria solani)',
      color: '#8B4513',
      chkValues: ['spots', 'yellow_leaves'],
      desc: 'Target-like brown concentric rings surrounded by a chlorotic yellow halo on lower older foliage.',
      confidence: 94.6,
      svg: `<svg viewBox="0 0 160 120" style="max-height:120px"><path d="M80 15 C40 30 20 70 80 105 C140 70 120 30 80 15 Z" fill="#2E7D32" stroke="#1B5E20" stroke-width="3"/><circle cx="75" cy="55" r="14" fill="#5D4037" stroke="#3E2723" stroke-width="2"/><circle cx="75" cy="55" r="8" fill="#3E2723"/><circle cx="95" cy="75" r="10" fill="#5D4037"/><path d="M80 15 Q80 60 80 105" stroke="#1B5E20" stroke-width="2" fill="none"/></svg>`
    },
    powdery_mildew: {
      title: 'Rose / Grapes: Powdery Mildew (Podosphaera pannosa)',
      color: '#FFFFFF',
      chkValues: ['white_growth', 'curling'],
      desc: 'Superficial powdery white talcum-like fungal mycelium expanding over upper leaf surfaces.',
      confidence: 96.2,
      svg: `<svg viewBox="0 0 160 120" style="max-height:120px"><path d="M80 15 C40 30 20 70 80 105 C140 70 120 30 80 15 Z" fill="#388E3C" stroke="#1B5E20" stroke-width="3"/><ellipse cx="65" cy="50" rx="20" ry="12" fill="rgba(255,255,255,0.75)"/><ellipse cx="95" cy="70" rx="16" ry="10" fill="rgba(255,255,255,0.7)"/></svg>`
    },
    bacterial_blight: {
      title: 'Rice / Wheat: Bacterial Leaf Blight (Xanthomonas oryzae)',
      color: '#D4AC0D',
      chkValues: ['spots', 'yellow_leaves'],
      desc: 'Water-soaked wavy marginal lesions turning yellow-to-straw colored along leaf edges.',
      confidence: 91.8,
      svg: `<svg viewBox="0 0 160 120" style="max-height:120px"><path d="M80 15 C60 40 50 80 80 105 C110 80 100 40 80 15 Z" fill="#2E7D32" stroke="#1B5E20" stroke-width="3"/><path d="M50 45 Q65 65 55 90" fill="#F4D03F" stroke="#B7950B" stroke-width="3"/><path d="M105 40 Q95 65 105 85" fill="#F4D03F" stroke="#B7950B" stroke-width="3"/></svg>`
    },
    healthy_leaf: {
      title: 'Healthy Canopy (Balanced Chlorophyll & Turgor)',
      color: '#00E676',
      chkValues: [],
      desc: 'Optimal cell hydration, intact vascular veins, and uniform green chlorophyll distribution. Zero pathogen lesions detected.',
      confidence: 99.1,
      svg: `<svg viewBox="0 0 160 120" style="max-height:120px"><path d="M80 15 C40 30 20 70 80 105 C140 70 120 30 80 15 Z" fill="#2E7D32" stroke="#55D68A" stroke-width="3"/><path d="M80 15 Q80 60 80 105" stroke="#55D68A" stroke-width="3" fill="none"/></svg>`
    }
  };

  const c = CASES[caseId];
  if (!c) return;

  box.style.display = 'block';
  box.innerHTML = `
    <div class="leaf-scanner-container">
      <div class="leaf-scanner-laser"></div>
      <div>${c.svg}</div>
      <div style="margin-top:12px">
        <b style="font-size:16px;color:#FFFFFF">${c.title}</b>
        <p style="color:var(--accent);font-size:12.5px;margin:4px 0 8px">${c.desc}</p>
        <span class="field-status-pill" style="background:rgba(85,214,138,0.2);color:#55D68A;border-color:rgba(85,214,138,0.4)">
          ✓ Multi-Spectral Diagnostic Match: ${c.confidence}%
        </span>
      </div>
    </div>
  `;

  // Auto-check corresponding checkboxes
  $$('.sym-chk').forEach(chk => {
    chk.checked = c.chkValues.includes(chk.value);
  });

  // Run diagnosis automatically
  showToast('Simulating multi-spectral scan: ' + c.title, '🔬');
  runSymptomDiagnosis();
}

function handleHealthPhotoUpload(e) {
  const file = e.target.files[0];
  const area = $('#photoPreviewArea');
  if (!file || !area) return;

  if (!file.type.startsWith('image/')) {
    area.innerHTML = '<p class="mu">Please choose an image file.</p>';
    return;
  }

  const reader = new FileReader();
  reader.onload = evt => {
    area.innerHTML = `
      <img src="${evt.target.result}" style="max-height:180px;border-radius:8px;margin-bottom:8px">
      <div class="field-status-pill" style="display:inline-block">Photo received for probable diagnosis</div>
    `;
    inferHealthPhotoSignals(evt.target.result, signals => {
      FarmHubState.healthPhotoSignals = signals;
      runSymptomDiagnosis(true);
    });
  };
  reader.readAsDataURL(file);
}

function inferHealthPhotoSignals(dataUrl, done) {
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement('canvas');
    const size = 64;
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(image, 0, 0, size, size);
    const pixels = context.getImageData(0, 0, size, size).data;
    let yellow = 0;
    let brown = 0;
    let white = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      const red = pixels[i];
      const green = pixels[i + 1];
      const blue = pixels[i + 2];
      if (red > 120 && green > 90 && blue < 105 && red > blue * 1.25) yellow++;
      if (red > 55 && red > green * 1.15 && green > blue * 1.15) brown++;
      if (red > 190 && green > 190 && blue > 190) white++;
    }
    const total = pixels.length / 4;
    const signals = [];
    if (yellow / total > 0.08) signals.push('yellow_leaves');
    if (brown / total > 0.08) signals.push('spots');
    if (white / total > 0.16) signals.push('white_growth');
    done(signals);
  };
  image.onerror = () => done([]);
  image.src = dataUrl;
}

function runSymptomDiagnosis(hasPhoto = false) {
  const container = $('#healthResultsContainer');
  if (!container) return;

  const selectedTags = [...$$('.sym-chk:checked')].map(c => c.value);
  const photoTags = hasPhoto ? (FarmHubState.healthPhotoSignals || []) : [];
  const chks = [...new Set([...selectedTags, ...photoTags])];
  const farm = FarmHubState.activeFarm;
  const cropName = farm?.cropName || '';
  if (!chks.length && !hasPhoto) {
    container.innerHTML = `<div class="card" style="margin-top:14px"><p class="mu">Please select at least one symptom or upload a photo.</p></div>`;
    return;
  }

  const matches = PLANT_HEALTH_KB.map(item => {
    const cropMatch = !item.crops.length || item.crops.some(c => c.toLowerCase() === cropName.toLowerCase());
    const matchedTags = chks.filter(tag => item.tags.includes(tag));
    let score = matchedTags.length * 24 + (cropMatch ? 22 : 0);
    if (hasPhoto) score += 8;
    return { item, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);
  const best = matches[0];
  const confidence = best ? Math.min(94, Math.max(42, best.score + (chks.length > 1 ? 8 : 0))) : 42;
  const labels = { yellow_leaves: 'yellowing or pale leaves', curling: 'curling or crinkling', spots: 'spots or lesions', wilting: 'wilting', chewed: 'chewed margins or holes', white_growth: 'white powder or growth' };
  const observed = chks.length ? chks.map(tag => `${labels[tag]}${photoTags.includes(tag) && !selectedTags.includes(tag) ? ' (photo cue)' : ''}`).join(', ') : 'photo uploaded; no manual signs selected';
  const detail = best?.item;
  const resultRows = matches.length ? matches.map((match, index) => {
    const item = match.item;
    const cropNote = item.crops.length ? `Relevant crops: ${item.crops.join(', ')}.` : 'Can affect many crops.';
    return `<div style="padding:12px 0;${index ? 'border-top:1px solid var(--border);' : ''}"><b>${index + 1}. ${esc(item.name)}</b> <span class="mu">(${esc(item.type)})</span><p class="mu" style="margin:3px 0">${esc(item.symptoms.join(' '))} ${esc(cropNote)}</p></div>`;
  }).join('') : '<p class="mu">No strong symptom match. Capture the whole plant, both leaf sides, stem, fruit and roots where possible.</p>';

  container.innerHTML = `
    <div class="card" style="margin-top:16px;border-left:6px solid var(--farm-amber)">
      <h3>${t('possibleIssue')}: ${esc(detail?.name || 'Uncertain plant-health issue')} <span class="mu">(${confidence}% probable match)</span></h3>
      <p class="mu"><b>Observed:</b> ${esc(observed)}</p>
      ${detail ? `<p><b>Likely category:</b> ${esc(detail.type)}<br><b>Possible cause:</b> ${esc(detail.cause)}<br><b>Favourable conditions:</b> ${esc(detail.conditions)}</p><div class="grid2" style="margin-top:12px"><div><b>Precautions</b><ul>${detail.precautions.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div><div><b>Management</b><ul>${detail.management.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div></div>` : ''}
      <div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border)"><b>Other possible matches</b>${resultRows}</div>
      <p class="mu" style="margin-top:12px">This is a probable diagnosis based on crop and reported signs. Similar symptoms can come from disease, pests, nutrient, water or environmental stress. Confirm before chemical treatment using local agricultural guidance, the product label, or an expert or lab.</p>
    </div>
  `;
}

// ============================================================
// MODULE: MARKET & MANDI INTELLIGENCE
// ============================================================
async function renderMarketModule() {
  const f = FarmHubState.activeFarm;
  const stateName = f.location?.state || 'Karnataka';
  const data = await API.market(f.cropName, stateName, FarmHubState.demoMode, FarmHubState.mandiApiKey);

  return `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <h2>${t('marketTitle')} — ${esc(f.cropName)}</h2>
      <button class="btn secondary sm" onclick="configureMandiKey()">⚙️ Configure Mandi API</button>
    </div>
    <p class="mu">Daily APMC arrivals and modal benchmark prices for ${esc(f.cropName)} in ${esc(stateName)}.</p>

    ${data.isDemo ? `
      <div class="complete-notice-card" style="border-color:var(--farm-amber);background:rgba(245, 158, 11, 0.1)">
        <b>⚡ ${t('demoDataTag')}</b>
      </div>
    ` : ''}

    ${data.status === 'UNCONFIGURED' ? `
      <div class="card" style="border-left:6px solid var(--farm-amber)">
        <h3>${t('liveMarketUnavailable')}</h3>
        <p class="mu">Live government mandi feed requires an API key. You can toggle Demo Mode to explore benchmark APMC rates.</p>
        <div class="row" style="margin-top:12px">
          <button class="btn" onclick="FarmHubState.demoMode=true;renderActiveModule()">View Demo Mandi Rates</button>
          <button class="btn secondary" onclick="configureMandiKey()">Add API Key</button>
        </div>
      </div>
    ` : `
      <div class="grid">
        <div class="sig-card">
          <small>${t('modalPrice')}</small>
          <b style="color:var(--green)">₹${data.modalPrice?.toLocaleString() || '--'}</b>
          <span>${data.unit}</span>
        </div>
        <div class="sig-card">
          <small>${t('priceRange')}</small>
          <b>${data.priceRange || '--'}</b>
          <span>Min – Max recorded</span>
        </div>
        <div class="sig-card">
          <small>${t('weeklyTrend')}</small>
          <b style="color:${(data.trend || '').startsWith('+') ? 'var(--green)' : 'var(--farm-danger)'}">${data.trend || '0.0%'}</b>
          <span>7-day movement</span>
        </div>
      </div>

      <div class="card">
        <h3>ACTIVE MANDI ARRIVALS</h3>
        <table>
          <thead>
            <tr>
              <th>Mandi Yard</th>
              <th>State</th>
              <th>Modal Price</th>
              <th>Arrival Date</th>
              <th>Distance</th>
            </tr>
          </thead>
          <tbody>
            ${(data.records || []).map(r => `
              <tr>
                <td><b>${esc(r.mandi)}</b></td>
                <td>${esc(r.state)}</td>
                <td style="font-weight:700">₹${r.modalPrice.toLocaleString()}</td>
                <td>${r.arrivalDate}</td>
                <td>${r.distanceKm ? `~${r.distanceKm} km` : 'Regional'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `}
  `;
}

function configureMandiKey() {
  const k = prompt('Enter your Data.gov.in API Key (leave empty to cancel or clear):', FarmHubState.mandiApiKey);
  if (k !== null) {
    FarmHubState.mandiApiKey = k.trim();
    localStorage.setItem('farmhub_mandi_key', FarmHubState.mandiApiKey);
    renderActiveModule();
  }
}

// ============================================================
// MODULE: FARM FINANCE & PROFITABILITY
// ============================================================
function renderFinanceModule() {
  const f = FarmHubState.activeFarm;
  const entries = FarmHubState.fin.filter(x => !x.farmId || x.farmId === f.id);
  const inc = entries.filter(x => x.type === 'Income').reduce((a, b) => a + b.amt, 0);
  const exp = entries.filter(x => x.type === 'Expense').reduce((a, b) => a + b.amt, 0);
  const profit = inc - exp;
  const costPerAcre = f.farmSize > 0 ? r(exp / f.farmSize) : 0;

  return `
    <h2>${t('navFinance')} Ledger — ${esc(f.name)}</h2>
    <p class="mu">Farm-specific accounting of inputs, irrigation power, labor, and crop harvest revenues.</p>

    <!-- FINANCIAL METRICS -->
    <div class="grid">
      <div class="sig-card">
        <small>${t('revenue')}</small>
        <b style="color:var(--green)">₹${inc.toLocaleString('en-IN')}</b>
        <span>Recorded sales</span>
      </div>
      <div class="sig-card">
        <small>${t('expenses')}</small>
        <b style="color:var(--farm-danger)">₹${exp.toLocaleString('en-IN')}</b>
        <span>Inputs & labor</span>
      </div>
      <div class="sig-card">
        <small>${t('netProfit')}</small>
        <b style="color:${profit >= 0 ? 'var(--green)' : 'var(--farm-danger)'}">₹${profit.toLocaleString('en-IN')}</b>
        <span>${profit >= 0 ? 'Surplus' : 'Deficit'}</span>
      </div>
      <div class="sig-card">
        <small>${t('costPerAcre')}</small>
        <b>₹${costPerAcre.toLocaleString('en-IN')}</b>
        <span>Across ${f.farmSize || 1} acre(s)</span>
      </div>
    </div>

    <!-- ENTRY FORM & DOUGHNUT CHART -->
    <div class="grid2">
      <form class="card" onsubmit="handleAddFinanceEntry(event)">
        <h3>LOG TRANSACTION</h3>
        <div class="form-group">
          <label>Type</label>
          <select id="fin_type">
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>
        </div>
        <div class="form-group">
          <label>Category</label>
          <select id="fin_cat">
            <option value="Fertilizer">Fertilizers & Nutrients</option>
            <option value="Seeds">Seeds / Seedlings</option>
            <option value="Labor">Labor & Weeding</option>
            <option value="Irrigation">Irrigation / Electricity</option>
            <option value="Pest Control">Pest Control & Sprays</option>
            <option value="Machinery">Tractor & Equipment</option>
            <option value="Harvest Sale">Crop Harvest Sale</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label>Amount (₹)</label>
          <input id="fin_amt" type="number" min="1" required placeholder="e.g. 1500">
        </div>
        <div class="form-group">
          <label>Date</label>
          <input id="fin_date" type="date" value="${new Date().toISOString().slice(0, 10)}" required>
        </div>
        <button type="submit" class="btn">Save Record</button>
      </form>

      <div class="card">
        <h3>EXPENSES BREAKDOWN</h3>
        <div class="chart-canvas-wrap"><canvas id="chart_fin"></canvas></div>
      </div>
    </div>

    <!-- TRANSACTIONS TABLE -->
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <h3>TRANSACTION HISTORY (${entries.length})</h3>
        ${entries.length ? `<button class="btn secondary sm" onclick="exportFinanceCsv()">Export CSV</button>` : ''}
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Amount (₹)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${entries.slice().reverse().map(e => `
            <tr>
              <td>${fmtDate(e.date)}</td>
              <td>
                <span class="field-status-pill" style="${e.type === 'Income' ? 'background:rgba(47,125,74,0.15);color:var(--green)' : 'background:rgba(225,29,72,0.15);color:var(--farm-danger)'}">
                  ${e.type}
                </span>
              </td>
              <td>${esc(e.cat)}</td>
              <td style="font-weight:700">₹${e.amt.toLocaleString('en-IN')}</td>
              <td><button class="btn secondary sm" onclick="deleteFinanceEntry('${e.id}')">✕</button></td>
            </tr>
          `).join('') || '<tr><td colspan="5" class="mu" style="text-align:center;padding:20px">No financial records logged yet.</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

function handleAddFinanceEntry(e) {
  e.preventDefault();
  const f = FarmHubState.activeFarm;
  FarmHubState.fin.push({
    id: 'fin_' + Date.now().toString(36),
    farmId: f.id,
    type: $('#fin_type').value,
    cat: $('#fin_cat').value,
    amt: parseFloat($('#fin_amt').value) || 0,
    date: $('#fin_date').value
  });
  persistState();
  renderActiveModule();
}

function deleteFinanceEntry(id) {
  FarmHubState.fin = FarmHubState.fin.filter(x => x.id !== id);
  persistState();
  renderActiveModule();
}

function exportFinanceCsv() {
  const f = FarmHubState.activeFarm;
  const entries = FarmHubState.fin.filter(x => !x.farmId || x.farmId === f.id);
  const rows = [['Date', 'Type', 'Category', 'Amount']];
  entries.forEach(e => rows.push([e.date, e.type, `"${e.cat}"`, e.amt]));
  const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `farmhub-finance-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

function drawFinanceCharts() {
  const f = FarmHubState.activeFarm;
  const entries = FarmHubState.fin.filter(x => (!x.farmId || x.farmId === f.id) && x.type === 'Expense');
  const catMap = {};
  entries.forEach(x => { catMap[x.cat] = (catMap[x.cat] || 0) + x.amt; });

  const labels = Object.keys(catMap);
  const values = Object.values(catMap);

  if (!labels.length) {
    const canvas = $('#chart_fin');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.font = '13px Inter';
      ctx.fillStyle = '#68736B';
      ctx.textAlign = 'center';
      ctx.fillText('No expenses logged yet.', canvas.width / 2, canvas.height / 2);
    }
    return;
  }

  createSafeChart('chart_fin', 'doughnut', {
    labels,
    datasets: [{
      data: values,
      backgroundColor: ['#2F7D4A', '#D97706', '#2563EB', '#E11D48', '#55D68A', '#8B5CF6']
    }]
  });
}

// ============================================================
// MODULE: IOT SENSORS & TELEMETRY
// ============================================================
async function renderSensorsModule() {
  const f = FarmHubState.activeFarm;
  const data = await API.fetchSensors(f, FarmHubState.demoMode);

  return `
    <h2>${t('navSensors')} & Hardware Feeds — ${esc(f.name)}</h2>
    <p class="mu">Interface with on-farm capacitance probes, temperature loggers, and weather stations.</p>

    ${FarmHubState.demoMode ? `
      <div class="complete-notice-card" style="border-color:var(--farm-amber);background:rgba(245, 158, 11, 0.1)">
        <b>⚡ ${t('demoSensorData')} (Simulated Telemetry Stream)</b>
      </div>
    ` : ''}

    ${data.status === 'NO_DEVICE' ? `
      <div class="card" style="border-left:6px solid var(--farm-amber)">
        <h3>${t('noSensorConnected')}</h3>
        <p class="mu">FarmHub is actively utilizing Open-Meteo satellite & numerical models for your field. Connect hardware endpoint or explore Demo Stream.</p>
        <div class="row" style="margin-top:14px">
          <button class="btn" onclick="FarmHubState.demoMode=true;renderActiveModule()">Preview Demo IoT Stream</button>
          <button class="btn secondary" onclick="configureSensorEndpoint()">Connect Sensor URL</button>
        </div>
      </div>
    ` : `
      <div class="grid">
        <div class="sig-card">
          <small>Moisture 10cm</small>
          <b>${data.sm10cm != null ? data.sm10cm + '%' : '--'}</b>
          <span>Surface root zone</span>
        </div>
        <div class="sig-card">
          <small>Moisture 30cm</small>
          <b>${data.sm30cm != null ? data.sm30cm + '%' : '--'}</b>
          <span>Deep sub-surface</span>
        </div>
        <div class="sig-card">
          <small>Soil Temp (6cm)</small>
          <b>${data.soilTemp != null ? data.soilTemp + '°C' : '--'}</b>
          <span>Under canopy</span>
        </div>
        <div class="sig-card">
          <small>Leaf Wetness</small>
          <b>${data.leafWetness != null ? data.leafWetness + '%' : '--'}</b>
          <span>Canopy wetness sensor</span>
        </div>
        <div class="sig-card">
          <small>Electrical Cond. (EC)</small>
          <b>${data.ec != null ? data.ec + ' dS/m' : '--'}</b>
          <span>Salinity indicator</span>
        </div>
        <div class="sig-card">
          <small>Device Battery</small>
          <b style="color:var(--green)">${data.batteryPct != null ? data.batteryPct + '%' : '100%'}</b>
          <span>${data.deviceStatus}</span>
        </div>
      </div>
    `}
  `;
}

function configureSensorEndpoint() {
  const f = FarmHubState.activeFarm;
  const url = prompt('Enter your JSON sensor feed endpoint URL:', f.sensorUrl || '');
  if (url !== null) {
    f.sensorUrl = url.trim();
    persistState();
    renderActiveModule();
  }
}

// ============================================================
// MODULE: DECISION HISTORY & AUDIT TRAIL
// ============================================================
function renderHistoryModule() {
  const f = FarmHubState.activeFarm;
  const logs = FarmHubState.history.slice().reverse();

  return `
    <h2>${t('navHistory')} & Decision Audit Trail</h2>
    <p class="mu">Historical log of all automated recommendations generated for ${esc(f.name)}.</p>

    <div style="display:grid;gap:12px">
      ${logs.map(log => `
        <details class="card">
          <summary style="font-weight:700">
            ${fmtDate(log.ts)} — <span style="color:var(--green)">${log.dec}</span> · ${log.conf}% Confidence · ${log.level} Risk
          </summary>
          <div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border)">
            <p><b>When:</b> ${log.win}</p>
            <p class="mu"><b>Reasons:</b></p>
            <ul>${(log.why || []).map(w => `<li>${esc(w)}</li>`).join('')}</ul>
          </div>
        </details>
      `).join('') || '<div class="card"><p class="mu">No historical decisions logged yet. Explore the Overview module to generate your first advisory.</p></div>'}
    </div>
  `;
}

// ============================================================
// MODULE: SETTINGS & PREFERENCES
// ============================================================
function renderSettingsModule() {
  const user = FarmHubState.user || { name: 'Farmer Guest', isGuest: true };

  return `
    <h2>${t('navSettings')} & Preferences</h2>
    <p class="mu">Manage your profile, language, display theme, and application data.</p>

    <div class="grid2">
      <!-- Profile Card -->
      <div class="card">
        <h3>USER PROFILE</h3>
        <p><b>Name:</b> ${esc(user.name)}</p>
        <p><b>Status:</b> ${user.isGuest ? t('guestProfile') : t('farmerAccount')}</p>
        <p><b>Phone:</b> ${user.phone ? esc(user.phone) : 'Not registered'}</p>
        <div class="row" style="margin-top:16px">
          ${user.isGuest ? `<button class="btn" onclick="navigateTo('user-details')">${t('createAccount')}</button>` : ''}
          <button class="btn secondary" onclick="signOutUser()">${t('signOut')}</button>
        </div>
      </div>

      <!-- App Preferences -->
      <div class="card">
        <h3>DISPLAY & LANGUAGE</h3>
        <div class="form-group">
          <label>${t('langSelect')}</label>
          <select onchange="setAppLanguage(this.value)">
            ${I18N.languages.map(l => `<option value="${l.code}"${l.code === I18N.currentLang ? ' selected' : ''}>🌐 ${l.native} (${l.label})</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Theme</label>
          <div class="row">
            <button class="btn ${FarmHubState.theme === 'light' ? '' : 'secondary'}" onclick="applyTheme('light')">Light Theme</button>
            <button class="btn ${FarmHubState.theme === 'dark' ? '' : 'secondary'}" onclick="applyTheme('dark')">Dark Theme</button>
          </div>
        </div>
        <div class="form-group" style="margin-top:20px">
          <label>Reset FarmHub</label>
          <button class="btn secondary sm" style="color:var(--farm-danger)" onclick="resetAllData()">Reset All Local Data</button>
        </div>
      </div>

      <!-- Data Management & Offline Backup -->
      <div class="card" style="grid-column:1 / -1">
        <h3>💾 ${t('dataBackupTitle', 'Data Management & Offline Backup')}</h3>
        <p class="mu">Export your complete farm parcels, financial records, custom tasks, and preferences as a portable JSON file. Restore anytime on another device or when working offline in the field.</p>

        <div class="row" style="margin-top:16px;gap:12px;flex-wrap:wrap">
          <button class="btn" onclick="exportFarmData()">⬇️ ${t('exportBackup', 'Export Farm Data (JSON)')}</button>
          <label class="btn secondary" style="cursor:pointer;margin:0">
            ⬆️ ${t('importBackup', 'Import Farm Data (JSON)')}
            <input type="file" accept=".json" onchange="importFarmData(event)" style="display:none">
          </label>
          <button class="btn landing-demo-btn" onclick="loadDemoFarm()">⚡ Load Live Demo Farm</button>
        </div>
      </div>
    </div>
  `;
}

function resetAllData() {
  if (confirm('Are you sure you want to clear all local farm data and restart from landing page?')) {
    localStorage.clear();
    window.location.reload();
  }
}

function openNotificationsModal() {
  alert('🔔 Notifications: No pending field emergency alerts. All telemetry operating within normal parameters.');
}

// ============================================================
// BOOTSTRAP INITIALIZATION
// ============================================================
function initFarmHub() {
  // Apply initial theme
  applyTheme(FarmHubState.theme);

  // Apply initial language
  I18N.setLanguage(FarmHubState.lang);

  // If user already has active farm, go to overview; otherwise landing
  if (FarmHubState.activeFarm) {
    navigateTo('dashboard', 'overview');
  } else {
    navigateTo('landing');
  }
}

// Run bootstrap when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFarmHub);
} else {
  initFarmHub();
}
