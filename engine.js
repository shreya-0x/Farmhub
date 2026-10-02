// ============================================================
// FARMHUB — AGRONOMIC & DECISION ENGINE
// Deterministic decision logic combining:
// Crop + Phenological Stage + Soil Hydrology + Weather Forecast + Sensor/Manual Readings
// ============================================================

const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
const r = Math.round;
const r1 = v => Math.round((v || 0) * 10) / 10;
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ageStr = m => m < 60 ? r(m) + ' min' : m < 1440 ? r(m / 60) + ' h' : r(m / 1440) + ' d';
const fmtDate = d => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

// Crop stages & baseline water stress sensitivity
const STAGES = ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest'];
const STAGE_SENSITIVITY = {
  Seedling: 0.5,
  Vegetative: 0.6,
  Flowering: 1.0,
  Fruiting: 0.9,
  Harvest: 0.4
};

// Soil Field Capacity (FC) % by volume, and Permanent Wilting Point (PWP) %
const SOIL_FC = {
  Sandy: 20,
  'Red loam': 27,
  Loamy: 30,
  Clay: 38,
  'Black cotton': 42,
  Alluvial: 28
};

const SOIL_PWP = {
  Sandy: 8,
  'Red loam': 12,
  Loamy: 14,
  Clay: 20,
  'Black cotton': 22,
  Alluvial: 13
};

// Water requirement baseline (liters per acre per standard irrigation cycle)
const WATER_PER_ACRE = {
  Drip: 380,
  Sprinkler: 550,
  Flood: 900,
  'Sub-surface Drip': 320
};

// Irrigation efficiency factors
const IRRIGATION_EFF = {
  Drip: 0.90,
  Sprinkler: 0.75,
  Flood: 0.50,
  'Sub-surface Drip': 0.95
};

// Decision Action Metadata: [Icon, Timing Window, Default Action Description, Next Check Window]
const ACTION_META = {
  IRRIGATE: [
    '💧',
    'Tomorrow 06:00–08:30',
    'Irrigate in the early-morning window before ambient temperature rises, minimizing evaporative loss.',
    'Tomorrow afternoon'
  ],
  WAIT: [
    '⏳',
    'Re-check tomorrow 18:00',
    'Hold irrigation. Forecast rainfall will restore root zone moisture — irrigating now risks nutrient leaching and water waste.',
    'Tomorrow evening'
  ],
  'INSPECT FIELD': [
    '🔍',
    'Today, within 2 hours',
    'Walk your field and inspect soil moisture by hand feel test before turning on pumps. FarmHub lacks fresh sensor data.',
    'After manual field walk'
  ],
  'PROTECT CROP': [
    '🛡️',
    'Today 11:00–16:00 (peak thermal stress)',
    'Deploy straw mulch or shade nets; avoid heavy flood watering under burning sun to prevent root shock.',
    'This evening at 18:00'
  ],
  MONITOR: [
    '👁️',
    'Re-check in 6–8 hours',
    'No immediate field intervention needed. Soil moisture and weather metrics are within the optimal physiological band.',
    'Tomorrow morning'
  ],
  'DELAY IRRIGATION': [
    '⏸️',
    'Re-check tomorrow 06:00',
    'Postpone irrigation cycle until cloud cover and rain chance clarify. Soil retains sufficient buffer for 24 hours.',
    'Tomorrow dawn'
  ],
  'CHECK DRAINAGE': [
    '🌊',
    'Today, before rainfall arrives',
    'Inspect and clear bund exits and drainage ditches so water does not stand in root zones for more than 4 hours.',
    'Immediately after rain stops'
  ]
};

// Calculate phenological stage from planting date or farmer selection
function computeCropStage(farm) {
  const cropObj = CROPS_DATA.getCrop(farm.cropId, farm.cropName);
  const endDays = cropObj.end || [20, 45, 70, 105, 130];
  const totalDays = endDays[endDays.length - 1];

  let day = 30; // default assumption if no planting date
  let hasPlantingDate = false;

  if (farm.plantingDate) {
    day = Math.floor((Date.now() - new Date(farm.plantingDate)) / 864e5);
    hasPlantingDate = true;
  }

  const stageIdx = endDays.findIndex(x => day <= x);
  const name = day < 0 ? 'Seedling' : stageIdx < 0 ? 'Harvest' : STAGES[stageIdx];
  const effectiveIdx = day < 0 ? 0 : stageIdx < 0 ? 4 : stageIdx;
  const prevEnd = effectiveIdx === 0 ? 0 : endDays[effectiveIdx - 1];
  const currEnd = endDays[effectiveIdx];
  const daysInStage = Math.max(0, day - prevEnd);
  const totalStageDays = currEnd - prevEnd;
  const stageProgress = clamp(r((daysInStage / (totalStageDays || 1)) * 100), 0, 100);

  return {
    name: farm.stage || name,
    isCalculated: hasPlantingDate && !farm.farmerConfirmedStage,
    isConfirmed: !!farm.farmerConfirmedStage,
    day,
    done: stageIdx < 0,
    stageIndex: effectiveIdx,
    daysInStage,
    totalStageDays,
    stageProgress,
    daysToNext: stageIdx < 0 ? 0 : Math.max(0, currEnd - day),
    totalDuration: totalDays
  };
}

// Convert composite risk index (0 to 100) to level text
const riskLevelFromScore = v => v <= 30 ? 'LOW' : v <= 60 ? 'MODERATE' : v <= 80 ? 'HIGH' : 'CRITICAL';

// Agricultural Spray Window Evaluation
function evaluateSprayWindow(w) {
  if (!w || !w.live) {
    return { status: 'UNKNOWN', text: 'Live weather unavailable for spray evaluation', class: 'm' };
  }
  const issues = [];
  if (w.wind > 16) issues.push(`High wind (${w.wind} km/h) causes spray droplet drift`);
  if (w.rp > 25 || w.rain > 1) issues.push(`Rain probability (${w.rp}%) will wash spray off foliage`);
  if (w.t > 33) issues.push(`High heat (${w.t}°C) causes rapid droplet evaporation and leaf scorch`);
  if (w.h > 85) issues.push(`High humidity (${w.h}%) slows drying and favors fungus`);

  if (issues.length === 0) {
    return {
      status: 'OPTIMAL',
      text: 'Calm wind, moderate temperature, dry foliage. Ideal window for foliar feeding or organic sprays.',
      class: 'i'
    };
  } else if (issues.length === 1 && w.wind <= 18 && w.rp <= 35) {
    return {
      status: 'MARGINAL',
      text: `Marginal: ${issues[0]}. Spray with coarse droplets at dawn if urgent.`,
      class: 'm'
    };
  } else {
    return {
      status: 'UNFAVORABLE',
      text: `Do not spray: ${issues.join('; ')}. Postpone until weather clears.`,
      class: 'h'
    };
  }
}

// ============================================================
// Core Deterministic Decision Engine
// ============================================================
function runDecisionEngine(s, hist = []) {
  const cropObj = CROPS_DATA.getCrop(s.cropId, s.cropName);
  const fc = SOIL_FC[s.soil] || 28;
  const pwp = SOIL_PWP[s.soil] || 12;
  const pref = fc * 0.8;
  const none = s.sm == null;
  const sm = none ? 0 : s.sm;
  const low = !none && sm < pref;
  const severeLow = !none && sm < pwp + (pref - pwp) * 0.3;
  const sens = clamp((STAGE_SENSITIVITY[s.stage] || 0.6) * (cropObj.kc || 0.8), 0, 1);

  // Deficit, thermal stress, and rain deficit components
  const def = none ? 50 : clamp(((pref - sm) / pref) * 200);
  const tS = clamp((s.tmax - 26) * 10 + (s.h < 40 ? 10 : 0));
  const rD = s.wx ? clamp(100 - s.rp - s.rain * 2) : 50;

  // History recurrence
  const hm = hist.filter(x => Math.abs(x.sm - sm) <= 4 && Math.abs(x.rp - s.rp) <= 25).length;
  const hi = def > 0 ? clamp(30 + 25 * hm) : 20;

  // Weighted scores: Soil deficit .35, Heat .20, Rain deficit .20, Sensitivity .15, History .10
  const ws = r(clamp(0.35 * def + 0.2 * tS + 0.2 * rD + 0.15 * sens * 100 + 0.1 * hi));
  const wr = r(clamp(Math.max(s.rain * 3, tS, s.wind > 35 ? 70 : 0)));
  const over = Math.max(ws, r(wr * 0.9));

  // Data quality and confidence
  const fr = clamp(1 - (s.fresh - 15) / 250, 0.5, 1);
  const dq = r(100 * (0.35 * fr + 0.35 * s.q + 0.3 * (s.wx ? 1 : 0.4)) * (none ? 0.6 : 1));
  let conf = clamp(r(0.4 * dq + 0.2 * 85 + 0.2 * (!s.wx ? 25 : s.rp >= 30 && s.rp <= 70 ? 55 : 80) + 0.2 * hi), 20, 97);
  if (s.fresh > 180) conf = Math.min(conf, 60);

  const R = [];
  const why = [];
  const add = (c, t) => { R.push(c); why.push(t); };
  let k;

  // Deterministic rule evaluation
  if (s.wx && s.rain >= 35) {
    k = sens >= 0.6 ? 'PROTECT CROP' : 'CHECK DRAINAGE';
    add('HEAVY_RAIN_EXPECTED', `Heavy rainfall (~${s.rain} mm over next 48h) is forecast across your area.`);
  } else if (!s.wx || none || dq < 60 || s.fresh > 180) {
    k = (ws >= 45 || low || none) ? 'INSPECT FIELD' : 'MONITOR';
    if (!s.wx) add('WEATHER_UNAVAILABLE', 'Rainfall forecast is temporarily unavailable — FarmHub will not guess.');
    if (none) add('SOIL_DATA_MISSING', 'No soil moisture reading is present — take a quick physical field test.');
    if (s.fresh > 180) add('STALE_DATA', `Field telemetry reading is ${ageStr(s.fresh)} old.`);
    if (dq < 60) add('LOW_DATA_QUALITY', `Data confidence quality is currently ${dq}%.`);
  } else if (sm >= fc * 1.15) {
    k = 'CHECK DRAINAGE';
    add('WATERLOGGING_RISK', `Soil moisture (${r1(sm)}%) exceeds field capacity (~${fc}%). Risk of root asphyxiation.`);
  } else if (s.tmax >= 35 && s.h < 40) {
    k = 'PROTECT CROP';
    add('HEAT_STRESS', `Extreme heat (${s.tmax}°C) with dry air (${s.h}% RH) causes rapid transpiration deficit.`);
    add('NO_BLIND_IRRIGATION', 'Irrigating under burning midday sun scorches root hairs; protect surface first.');
  } else if (s.rp >= 60 || s.rain >= 10) {
    k = 'WAIT';
    add('RAIN_RESTORES_MOISTURE', `Rain is probable (${s.rp}% probability, ~${s.rain} mm) and will naturally recharge root zone.`);
  } else if (low && s.rp >= 40) {
    k = 'DELAY IRRIGATION';
    add('LOW_SOIL_MOISTURE', `Soil moisture is below optimal (${r1(sm)}% vs ${r(pref)}% optimal).`);
    add('RAIN_UNCERTAIN', `Rain chance is ${s.rp}% — wait 12–24h for cloud front confirmation to prevent double watering.`);
  } else if (low && (sens >= 0.6 || ws >= 55 || severeLow)) {
    k = 'IRRIGATE';
    add('LOW_SOIL_MOISTURE', `Soil moisture (${r1(sm)}%) is below comfortable ${r(pref)}%–${fc}% target for ${s.soil ? s.soil.toLowerCase() : 'your'} soil.`);
    add('LOW_RAIN_PROBABILITY', `Rain chance is low (${s.rp}%, ~${s.rain} mm expected), meaning rainfall will not replenish soil.`);
    if (s.tmax >= 30) add('HIGH_TEMPERATURE', `Daytime maximum of ${s.tmax}°C is accelerating evapotranspiration.`);
    add('CROP_SENSITIVITY', `${s.cropName || cropObj.names.en} in ${s.stage} stage has high moisture vulnerability (factor ${r(sens * 100)}%).`);
  } else {
    k = 'MONITOR';
    add('CONDITIONS_OK', `Root zone moisture (${r1(sm)}%) and ambient weather are in the balanced physiological range.`);
  }

  const meta = ACTION_META[k] || ACTION_META.MONITOR;

  // Water volume calculation in Liters and Cubic Meters
  const baseWPA = WATER_PER_ACRE[s.method] || 380;
  const eff = IRRIGATION_EFF[s.method] || 0.85;
  const depthFactor = s.stage === 'Seedling' ? 0.5 : s.stage === 'Vegetative' ? 0.75 : 1.0;
  const grossLiters = r(((s.area || 1) * baseWPA * depthFactor) / 100) * 100;
  const cubicMeters = r1(grossLiters / 1000);

  // Structured DATA USED for transparency
  const dataUsed = [
    { label: 'Soil Moisture', value: none ? 'Missing' : `${r1(sm)}%`, sub: s.src, status: none ? 'warn' : sm < pref ? 'low' : 'good' },
    { label: 'Rain Probability', value: s.wx ? `${s.rp}%` : 'N/A', sub: 'Next 48 hours', status: s.rp > 50 ? 'info' : 'neutral' },
    { label: 'Expected Rainfall', value: s.wx ? `${s.rain} mm` : 'N/A', sub: 'Open-Meteo model', status: s.rain > 5 ? 'info' : 'neutral' },
    { label: 'Air Temperature', value: `${s.t ?? '--'}°C`, sub: `High today ${s.tmax ?? '--'}°C`, status: s.tmax >= 35 ? 'warn' : 'good' },
    { label: 'Relative Humidity', value: `${s.h ?? '--'}%`, sub: `Wind ${s.wind ?? '--'} km/h`, status: 'neutral' },
    { label: 'Active Crop', value: s.cropName || cropObj.names.en, sub: `${s.stage} (Day ${s.day ?? 0})`, status: 'good' },
    { label: 'Soil Type', value: s.soil || 'Not set', sub: `Field Capacity ~${fc}%`, status: s.soil ? 'neutral' : 'warn' },
    { label: 'Irrigation Method', value: s.method || 'Not set', sub: s.method ? `${r(eff * 100)}% efficiency` : 'Default drip assumed', status: 'neutral' }
  ];

  return {
    actionKey: k,
    dec: k,
    icon: meta[0],
    win: meta[1],
    act: meta[2],
    nextCheck: meta[3] || 'Tomorrow morning',
    conf,
    dq,
    level: riskLevelFromScore(over),
    over,
    ws,
    wr,
    why,
    rules: R,
    dataUsed,
    liters: grossLiters,
    cubicMeters,
    impact: k === 'IRRIGATE'
      ? `~${grossLiters.toLocaleString()} L (~${cubicMeters} m³) needed for ${s.area || 1} acre(s)`
      : k === 'WAIT' || k === 'DELAY IRRIGATION'
      ? `~${grossLiters.toLocaleString()} L saved by utilizing natural rain`
      : 'No irrigation required under current conditions',
    unc: !s.wx
      ? 'Forecast is unavailable, reducing confidence. Verify field manually.'
      : none || s.fresh > 180
      ? 'Soil reading is missing or old. Field inspection strongly recommended.'
      : s.rp >= 30 && s.rp <= 70
      ? 'Forecast model indicates convective rainfall uncertainty in your region.'
      : 'Forecasts naturally shift. Re-check before initiating long pump cycles.',
    flow: [
      `Soil moisture ${none ? 'missing' : r1(sm) + '%'} (FC: ${fc}%, Pref: ${r(pref)}%) → Deficit ${r(def)}/100`,
      `Rain ${s.wx ? s.rp + '% / ' + s.rain + ' mm' : 'unknown'} → Rain deficit ${r(rD)}/100`,
      `Heat ${s.tmax}°C, Humidity ${s.h}% → Stress ${r(tS)}/100`,
      `${s.stage} stage on ${s.cropName || cropObj.names.en} → Sensitivity ${r(sens * 100)}/100`,
      `Overall stress index: ${over}/100 [${riskLevelFromScore(over)} RISK]`,
      `Action Directive: ${k}`
    ]
  };
}
