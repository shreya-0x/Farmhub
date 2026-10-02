// ============================================================
// FARMHUB — API INTEGRATION LAYER (ES6 Fetch)
// Connects to:
// 1. Open-Meteo Weather & Soil Hydrology (Live)
// 2. Open-Meteo Geocoding API (Live)
// 3. Reverse Geocoding (Live BigDataCloud / OpenStreetMap)
// 4. Mandi / Market Intelligence (Live or Transparent Unconfigured/Demo)
// 5. IoT Sensor Telemetry (Live or Transparent Unconfigured/Demo)
// ============================================================

const API = {
  // Base JSON fetch with timeout
  async json(url, timeoutMs = 8000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  },

  // Geocoding location search
  async geocode(query) {
    if (!query || !query.trim()) return [];
    const data = await API.json(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=en`
    );
    return (data.results || []).map(x => ({
      displayName: [x.name, x.admin1, x.country].filter(Boolean).join(', '),
      locality: x.name || '',
      district: x.admin2 || x.admin1 || '',
      state: x.admin1 || '',
      country: x.country || '',
      lat: x.latitude,
      lon: x.longitude,
      elevation: x.elevation,
      source: 'Manual Search'
    }));
  },

  // Browser Geolocation API
  here() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error('Geolocation is not supported by your browser.'));
      }
      navigator.geolocation.getCurrentPosition(
        pos => resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          source: 'GPS'
        }),
        err => reject(err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
      );
    });
  },

  // Reverse geocode coordinates to structured location object
  async reverse(lat, lon, source = 'GPS') {
    try {
      const d = await API.json(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
        6000
      );
      const locality = d.locality || d.city || d.village || '';
      const district = d.localityInfo?.administrative?.[2]?.name || d.principalSubdivision || '';
      const state = d.principalSubdivision || '';
      const country = d.countryName || '';
      const parts = [locality, state, country].filter(Boolean);
      const displayName = parts.join(', ') || `${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`;

      return {
        lat,
        lon,
        displayName,
        locality,
        district,
        state,
        country,
        source
      };
    } catch (e) {
      return {
        lat,
        lon,
        displayName: `${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`,
        locality: '',
        district: '',
        state: '',
        country: '',
        source
      };
    }
  },

  // Real-time Open-Meteo Weather & 4-Layer Soil Model
  async weather(lat, lon, farmId = 'default') {
    const key = `fh_wx_${farmId}`;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,wind_direction_10m,surface_pressure,weather_code,uv_index` +
      `&hourly=soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm,soil_temperature_6cm,temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,direct_radiation,diffuse_radiation` +
      `&daily=precipitation_probability_max,precipitation_sum,temperature_2m_max,temperature_2m_min,et0_fao_evapotranspiration,uv_index_max,sunrise,sunset` +
      `&forecast_days=7&past_days=3&timezone=auto`;

    try {
      const d = await API.json(url, 9000);
      const payload = { t: Date.now(), d };
      try {
        localStorage.setItem(key, JSON.stringify(payload));
      } catch (err) {}
      return { ...payload, live: true };
    } catch (err) {
      let cached = null;
      try {
        cached = JSON.parse(localStorage.getItem(key));
      } catch (e) {}
      if (cached) {
        return { ...cached, live: false };
      }
      throw err;
    }
  },

  // Real-Time Satellite Air Quality & Atmosphere (PM2.5, PM10, AQI)
  async airQuality(lat, lon, farmId = 'default') {
    const key = `fh_aq_${farmId}`;
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone`;
    try {
      const d = await API.json(url, 6000);
      try {
        localStorage.setItem(key, JSON.stringify({ t: Date.now(), d }));
      } catch (e) {}
      return { data: d, live: true };
    } catch (e) {
      let cached = null;
      try {
        cached = JSON.parse(localStorage.getItem(key));
      } catch (err) {}
      return cached ? { data: cached.d, live: false } : null;
    }
  },

  // Live Real-Time Doppler Rain Radar Tiles (Global RainViewer API)
  async getRainViewerRadar() {
    try {
      const maps = await API.json('https://api.rainviewer.com/public/weather-maps.json', 5000);
      if (maps && maps.radar && maps.radar.past && maps.radar.past.length > 0) {
        const latest = maps.radar.past[maps.radar.past.length - 1];
        const host = maps.host || 'https://tilecache.rainviewer.com';
        return {
          host,
          path: latest.path,
          time: latest.time,
          tileUrl: `${host}${latest.path}/256/{z}/{x}/{y}/2/1_1.png`
        };
      }
    } catch (e) {
      console.warn('RainViewer API offline/unavailable', e);
    }
    return null;
  },

  // Mandi / Commodity Prices
  async market(cropName, stateName, isDemoMode = false, apiKey = '') {
    if (isDemoMode) {
      return API.getDemoMarket(cropName, stateName);
    }

    if (apiKey && apiKey.trim()) {
      try {
        const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${encodeURIComponent(apiKey)}&format=json&filters[commodity]=${encodeURIComponent(cropName)}&limit=10`;
        const res = await API.json(url, 7000);
        if (res.records && res.records.length > 0) {
          return {
            status: 'LIVE',
            isDemo: false,
            commodity: cropName,
            records: res.records.map(r => ({
              mandi: r.market,
              district: r.district,
              state: r.state,
              minPrice: +r.min_price || 0,
              maxPrice: +r.max_price || 0,
              modalPrice: +r.modal_price || 0,
              arrivalDate: r.arrival_date
            }))
          };
        }
      } catch (e) {
        console.warn('Live mandi API error', e);
      }
    }

    return {
      status: 'UNCONFIGURED',
      isDemo: false,
      commodity: cropName,
      message: 'LIVE MARKET DATA UNAVAILABLE'
    };
  },

  // Demo Mandi Benchmark Data
  getDemoMarket(cropName, stateName = 'Karnataka') {
    const benchmarks = {
      Tomato: { min: 1400, max: 2200, modal: 1850, unit: '₹/Quintal', trend: '+4.2%' },
      Chilli: { min: 11000, max: 16500, modal: 14200, unit: '₹/Quintal', trend: '-1.5%' },
      Onion: { min: 1600, max: 2600, modal: 2100, unit: '₹/Quintal', trend: '+5.6%' },
      Potato: { min: 1100, max: 1750, modal: 1450, unit: '₹/Quintal', trend: '-2.0%' },
      Banana: { min: 1800, max: 2600, modal: 2250, unit: '₹/Quintal', trend: '+2.1%' },
      Mango: { min: 3500, max: 6000, modal: 4800, unit: '₹/Quintal', trend: '+6.4%' },
      Rose: { min: 120, max: 280, modal: 210, unit: '₹/Bunch (20 stems)', trend: '+8.0%' },
      Marigold: { min: 40, max: 95, modal: 70, unit: '₹/Kg', trend: '+3.5%' },
      Rice: { min: 2183, max: 2800, modal: 2450, unit: '₹/Quintal (MSP ₹2,183)', trend: '+0.9%' },
      Wheat: { min: 2275, max: 2750, modal: 2500, unit: '₹/Quintal (MSP ₹2,275)', trend: '+3.1%' },
      Cotton: { min: 6620, max: 7600, modal: 7250, unit: '₹/Quintal (MSP ₹6,620)', trend: '-0.8%' },
      Maize: { min: 1950, max: 2350, modal: 2150, unit: '₹/Quintal (MSP ₹2,090)', trend: '+1.8%' },
      Ragi: { min: 3600, max: 4400, modal: 4050, unit: '₹/Quintal (MSP ₹3,846)', trend: '+2.5%' }
    };

    const b = benchmarks[cropName] || { min: 1500, max: 2500, modal: 2000, unit: '₹/Quintal', trend: '0.0%' };

    return {
      status: 'DEMO',
      isDemo: true,
      commodity: cropName,
      unit: b.unit,
      modalPrice: b.modal,
      priceRange: `₹${b.min.toLocaleString()} – ₹${b.max.toLocaleString()}`,
      trend: b.trend,
      records: [
        { mandi: 'Central APMC Yard', state: stateName, modalPrice: b.modal, arrivalDate: 'Today', distanceKm: 14 },
        { mandi: 'District Mandi', state: stateName, modalPrice: Math.round(b.modal * 0.98), arrivalDate: 'Today', distanceKm: 28 },
        { mandi: 'Regional Terminal Market', state: stateName, modalPrice: Math.round(b.modal * 1.03), arrivalDate: 'Yesterday', distanceKm: 45 }
      ]
    };
  },

  // IoT Sensor Telemetry Feed
  async fetchSensors(farm, isDemoMode = false) {
    if (isDemoMode) {
      return {
        status: 'DEMO',
        isDemo: true,
        sm10cm: 23.4,
        sm30cm: 28.1,
        soilTemp: 24.2,
        airTemp: 27.5,
        humidity: 65,
        leafWetness: 12,
        ec: 1.15,
        batteryPct: 88,
        deviceStatus: 'DEMO SENSOR DATA'
      };
    }

    if (farm && farm.sensorUrl) {
      try {
        const data = await API.json(farm.sensorUrl, 5000);
        return {
          status: 'LIVE',
          isDemo: false,
          sm10cm: data.sm10cm ?? data.soil_moisture ?? null,
          sm30cm: data.sm30cm ?? null,
          soilTemp: data.soil_temp ?? null,
          airTemp: data.air_temp ?? null,
          humidity: data.humidity ?? null,
          leafWetness: data.leaf_wetness ?? null,
          ec: data.ec ?? null,
          batteryPct: data.battery ?? null,
          deviceStatus: 'LIVE SENSOR'
        };
      } catch (e) {
        return { status: 'OFFLINE', isDemo: false, message: 'Sensor unreachable' };
      }
    }

    return {
      status: 'NO_DEVICE',
      isDemo: false,
      message: 'NO SENSOR CONNECTED'
    };
  }
};

// Normalize raw Open-Meteo weather response
function normalizeWeather(w) {
  const d = w.d || {};
  const c = d.current || {};
  const H = d.hourly || {};
  const D = d.daily || {};

  const nowIso = c.time || new Date().toISOString().slice(0, 13) + ':00';
  const i = Math.max(0, (H.time || []).findLastIndex(x => x <= nowIso));
  const k = 3; // today index in 7-day forecast (past_days=3)

  const p0 = D.precipitation_probability_max ? D.precipitation_probability_max[k] : null;
  const p1 = D.precipitation_probability_max ? D.precipitation_probability_max[k + 1] : null;
  const rain0 = D.precipitation_sum ? (D.precipitation_sum[k] || 0) : 0;
  const rain1 = D.precipitation_sum ? (D.precipitation_sum[k + 1] || 0) : 0;

  const sm = H.soil_moisture_3_to_9cm ? H.soil_moisture_3_to_9cm[i] : null;
  const smSurface = H.soil_moisture_0_to_1cm ? H.soil_moisture_0_to_1cm[i] : null;
  const st = H.soil_temperature_6cm ? H.soil_temperature_6cm[i] : null;

  return {
    t: c.temperature_2m,
    h: c.relative_humidity_2m,
    wind: c.wind_speed_10m,
    windDir: c.wind_direction_10m,
    apparentTemp: c.apparent_temperature,
    pressure: c.surface_pressure,
    weatherCode: c.weather_code,
    tmax: D.temperature_2m_max ? D.temperature_2m_max[k] : c.temperature_2m,
    tmin: D.temperature_2m_min ? D.temperature_2m_min[k] : c.temperature_2m,
    et0: D.et0_fao_evapotranspiration ? D.et0_fao_evapotranspiration[k] : null,
    uvMax: D.uv_index_max ? D.uv_index_max[k] : null,
    sunrise: D.sunrise ? D.sunrise[k] : null,
    sunset: D.sunset ? D.sunset[k] : null,
    rpok: p0 != null,
    rp: Math.max(p0 || 0, p1 || 0),
    rain: r1(rain0 + rain1),
    todayRain: r1(rain0),
    directRad: H.direct_radiation ? H.direct_radiation[i] : null,
    diffuseRad: H.diffuse_radiation ? H.diffuse_radiation[i] : null,
    sm: sm == null ? null : sm * 100,
    smSurface: smSurface == null ? null : smSurface * 100,
    smL1: H.soil_moisture_0_to_1cm && H.soil_moisture_0_to_1cm[i] != null ? H.soil_moisture_0_to_1cm[i] * 100 : (smSurface != null ? smSurface * 100 : null),
    smL2: sm == null ? null : sm * 100,
    smL3: H.soil_moisture_9_to_27cm && H.soil_moisture_9_to_27cm[i] != null ? H.soil_moisture_9_to_27cm[i] * 100 : null,
    st,
    age: w.live ? 5 : r((Date.now() - w.t) / 6e4),
    live: w.live,
    D,
    H,
    i
  };
}
