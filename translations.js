// ============================================================
// FARMHUB — MULTILINGUAL TRANSLATION SYSTEM
// Supported Languages:
//   en: English
//   kn: ಕನ್ನಡ (Kannada)
//   ta: தமிழ் (Tamil)
//   te: తెలుగు (Telugu)
//   hi: हिन्दी (Hindi)
// ============================================================

const I18N = {
  // Current active language code
  currentLang: localStorage.getItem('farmhub_lang') || 'en',

  // Language display names
  languages: [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' }
  ],

  // Translation Strings Dictionary
  strings: {
    en: {
      // Brand & Navigation
      brandName: 'FARMHUB',
      tagline: 'Smart decisions. Better farming.',
      subBrand: 'SMART FARM DECISIONS',
      navOverview: 'Overview',
      navMyFarm: 'My Farm',
      navWeather: 'Weather',
      navCalendar: 'Crop Calendar',
      navIrrigation: 'Irrigation',
      navAdvisory: 'Farm Advisory',
      navFertilizer: 'Fertilizer',
      navHealth: 'Crop Health',
      navMarket: 'Market / Mandi',
      navFinance: 'Finance',
      navHistory: 'History',
      navSensors: 'Sensors',
      navSettings: 'Settings',
      groupYourFarm: 'YOUR FARM',
      groupAdvisory: 'ADVISORY',
      groupInsights: 'INSIGHTS',
      groupManagement: 'MANAGEMENT',

      // Top bar & Profile
      themeToggle: 'Toggle theme',
      langSelect: 'Language',
      notifications: 'Notifications',
      guestProfile: 'Guest Profile',
      farmerAccount: 'Farmer Account',
      createAccount: 'Create Account',
      signOut: 'Sign Out',
      activeFarm: 'Active Farm',

      // Landing Page
      landingTitle: 'Smart Decisions. Better Farming.',
      landingSubtitle: 'Real-time weather, precision soil hydrology, and actionable agronomic intelligence tailored to your field.',
      letsExplore: "LET'S EXPLORE →",
      landingFeat1Title: 'Live Soil & Hydrology',
      landingFeat1Desc: 'Satellite numerical models & IoT sensor streams for root zone moisture.',
      landingFeat2Title: 'Crop Intelligence',
      landingFeat2Desc: 'Phenology tracking and stage-specific nutritional guidance.',
      landingFeat3Title: 'Explainable Advisory',
      landingFeat3Desc: 'Clear, transparent answers to "What should I do now?" and "Why?".',

      // User Details Step
      welcomeTitle: 'WELCOME TO FARMHUB 🌱',
      welcomeSubtitle: "Let's set up your farm in a few simple steps.",
      fullName: 'FULL NAME',
      enterName: 'Enter your name',
      phoneNumber: 'PHONE NUMBER',
      enterPhone: 'Enter your phone number',
      btnContinue: 'CONTINUE →',
      btnLoginLater: 'LOGIN LATER',
      guestNotice: 'Continuing as a local guest profile. You can register anytime.',

      // Crop Specifications Step
      tellUsFarm: 'TELL US ABOUT YOUR FARM 🌱',
      whereLocation: 'WHERE IS YOUR FARM LOCATED?',
      useMyLocation: '📍 USE MY LOCATION',
      searchLocation: '🔍 SEARCH LOCATION',
      locationNotSelected: 'LOCATION NOT SELECTED',
      locationSelected: 'Farm location selected ✓',
      mapUnavailable: 'MAP TEMPORARILY UNAVAILABLE',
      retryMap: 'RETRY MAP',
      whatCropType: 'WHAT TYPE OF CROP ARE YOU GROWING?',
      catFlowers: 'FLOWERS',
      catFruits: 'FRUITS',
      catVegetables: 'VEGETABLES',
      catOther: 'OTHER',
      whichCrop: 'WHICH CROP ARE YOU GROWING?',
      cropOther: 'Other',
      enterCropName: 'ENTER YOUR CROP NAME',
      cropPlaceholder: 'e.g. Cucumber, Mustard...',
      goToMyFarm: 'GO TO MY FARM →',

      // Dashboard Hero & Core Questions
      heroTitle: 'WHAT SHOULD I DO NOW?',
      whyTitle: 'WHY?',
      dataUsedTitle: 'DATA USED',
      nextCheckTitle: 'WHAT SHOULD I CHECK NEXT?',
      confidence: 'Confidence',
      fieldRisk: 'Risk Level',
      riskLow: 'LOW',
      riskModerate: 'MODERATE',
      riskHigh: 'HIGH',
      riskCritical: 'CRITICAL',
      scheduledCheck: 'Scheduled Check',
      readAdvisory: 'Read Advisory',
      stopAdvisory: 'Stop Audio',
      audioAdvisory: {
        opening: 'FarmHub advisory for',
        cropLabel: 'Crop',
        recommendation: 'Recommendation:',
        guidance: {
          IRRIGATE: 'Irrigate tomorrow between 6 and 8:30 in the morning, before temperatures rise. Soil moisture is below the preferred level.',
          WAIT: 'Wait until tomorrow evening. Rain is expected, so irrigating now could waste water.',
          'INSPECT FIELD': 'Inspect the field within two hours. Check soil moisture by hand before starting irrigation.',
          'PROTECT CROP': 'Protect the crop from expected weather stress. Use mulch or shade, and avoid heavy watering in peak heat.',
          MONITOR: 'No immediate action is needed. Check the field again in six to eight hours.',
          'DELAY IRRIGATION': 'Delay irrigation until six tomorrow morning. The soil should retain enough moisture for now.',
          'CHECK DRAINAGE': 'Check field drains before the rain arrives to prevent water from standing around crop roots.'
        },
        confidence: 'Confidence',
        percent: 'percent'
      },
      printAdvisory: 'Print Advisory',
      completeProfileNotice: 'YOUR FARM IS READY 🌱',
      completeProfileDesc: 'Add a few more farm details (soil type, farm size, irrigation) to unlock personalized recommendations.',
      btnCompleteProfile: 'Complete Profile',

      // Stats
      statFields: 'Total Fields',
      statArea: 'Total Area',
      statCrops: 'Active Crops',
      statIncome: 'Net Farm Income',
      notAddedYet: 'Not added yet',
      add: 'Add',

      // Signals
      soilMoisture: 'Soil Moisture',
      airTemp: 'Air Temp',
      humidity: 'Humidity',
      windSpeed: 'Wind Speed',
      rainChance: 'Rain Chance',
      expectedRain: 'Expected Rain',
      cropStage: 'Crop Stage',

      // Weather View
      liveWeatherUnavailable: 'LIVE WEATHER UNAVAILABLE',
      feelsLike: 'Feels like',
      uvIndex: 'UV Index',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      hourlyForecast: 'Hourly 48-Hour Forecast',
      sevenDayForecast: '7-Day Extended Forecast',

      // Fertilizer View
      fertPrefNatural: '🌿 Natural / Organic',
      fertPrefSynthetic: '🧪 Synthetic / Mineral',
      fertPrefIntegrated: '🔄 Integrated',
      fertSafetyNotice: 'More soil information is needed for a definitive field-specific recommendation. Perform a laboratory soil test before heavy chemical application.',
      npkDosageTitle: 'Indicative Nutrient Requirements',
      assumptionsTitle: 'Basis & Assumptions',

      // Crop Health
      healthTitle: 'Crop Health & Pest Diagnostic',
      healthSubtitle: 'Select observed symptoms or upload a crop photo for diagnostic assessment.',
      uploadPhoto: '📷 Upload Crop Photo',
      analyzeSymptoms: '🔍 Analyze Symptoms',
      possibleIssue: 'Possible Issue',
      managementOptions: 'Management Options',
      healthDisclaimer: 'Agronomic screening tool only. Always confirm severe viral or fungal infections with your local extension office (KVK).',

      // Market & Finance
      marketTitle: 'Market & Mandi Intelligence',
      liveMarketUnavailable: 'LIVE MARKET DATA UNAVAILABLE',
      demoDataTag: 'DEMO DATA · ILLUSTRATIVE ONLY',
      modalPrice: 'Modal Price',
      priceRange: 'Price Range',
      weeklyTrend: 'Weekly Trend',
      revenue: 'Revenue',
      expenses: 'Expenses',
      netProfit: 'Net Profit',
      costPerAcre: 'Cost Per Acre',

      // Sensors
      liveSensor: 'LIVE SENSOR',
      noSensorConnected: 'NO SENSOR CONNECTED',
      demoSensorData: 'DEMO SENSOR DATA',

      // Common actions
      refresh: 'Refresh',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      confirm: 'Confirm',

      // Extended Features & Copilot
      instantDemo: '⚡ TRY LIVE DEMO',
      copilotBtn: 'Kisaan Copilot',
      copilotTitle: 'Kisaan AI Copilot 🌱',
      copilotSubtitle: 'Precision Agronomic Field Assistant',
      copilotPlaceholder: 'Ask anything about crops, spray timing, fertilizer, pests...',
      cmdSearchPlaceholder: 'Search crops, diseases, tools, modules... (Ctrl+K)',
      sprayRadarTitle: '24-Hour Spray Suitability Radar',
      sprayRadarDesc: 'Hourly microclimate analysis for safe, drift-free pesticide and foliar fertilizer application.',
      yieldPredictorTitle: 'Crop Yield & Harvest Revenue Predictor',
      yieldPredictorDesc: 'Projected harvest tonnage and gross market valuation based on active APMC Mandi rates.',
      sampleDiagnosticsTitle: 'Interactive Diagnostic Cases',
      sampleDiagnosticsDesc: 'Click a case to simulate instant multi-spectral leaf diagnostic scan and view IPM protocol:',
      dataBackupTitle: 'Data Management & Offline Backup',
      exportBackup: 'Export Farm Data (JSON)',
      importBackup: 'Import Farm Data (JSON)',
      onlineStatus: 'Online',
      offlineStatus: 'Offline Ready',
      toastDemoLoaded: 'Live Demo Farm Loaded Successfully! 🌱',
      toastBackupExported: 'Farm data backup exported successfully! 💾',
      toastBackupImported: 'Farm data restored successfully! 🔄',
      printBriefTitle: 'Executive Farm Brief',
      soil3DTitle: '3D Root Zone Hydrology & Percolation Simulator',
      soil3DDesc: 'Interactive isometric 3D cutaway of soil strata, root architecture, and dynamic moisture percolation.',
      skyAtmosphereTitle: 'Live Atmospheric Sky & Particulate Flow',
      satelliteAirQuality: 'Satellite Atmosphere & Air Quality (Open-Meteo Sentinel)',
      liveDopplerRadar: 'Live Doppler Precipitation Radar (RainViewer)',
      phenologyMorphologyTitle: '2D Phenological Morphology & Growth Stage Visualizer'
    },

    kn: {
      // Brand & Navigation
      brandName: 'ಫಾರ್ಮ್‌ಹಬ್',
      tagline: 'ಬುದ್ಧಿವಂತ ನಿರ್ಧಾರಗಳು. ಉತ್ತಮ ಕೃಷಿ.',
      subBrand: 'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ನಿರ್ಧಾರಗಳು',
      navOverview: 'ಅವಲೋಕನ',
      navMyFarm: 'ನನ್ನ ಜಮೀನು',
      navWeather: 'ಹವಾಮಾನ',
      navCalendar: 'ಬೆಳೆ ಕ್ಯಾಲೆಂಡರ್',
      navIrrigation: 'ನೀರಾವರಿ',
      navAdvisory: 'ಕೃಷಿ ಸಲಹೆ',
      navFertilizer: 'ಗೊಬ್ಬರ ಮಾರ್ಗದರ್ಶಿ',
      navHealth: 'ಬೆಳೆ ಆರೋಗ್ಯ',
      navMarket: 'ಮಾರುಕಟ್ಟೆ / ಮಂಡಿ',
      navFinance: 'ಆರ್ಥಿಕತೆ',
      navHistory: 'ಇತಿಹಾಸ',
      navSensors: 'ಸಂವೇದಕಗಳು (ಸೆನ್ಸಾರ್)',
      navSettings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
      groupYourFarm: 'ನಿಮ್ಮ ಜಮೀನು',
      groupAdvisory: 'ಸಲಹಾ ಸೇವೆ',
      groupInsights: 'ಒಳನೋಟಗಳು',
      groupManagement: 'ನಿರ್ವಹಣೆ',

      // Top bar & Profile
      themeToggle: 'ಥೀಮ್ ಬದಲಾಯಿಸಿ',
      langSelect: 'ಭಾಷೆ',
      notifications: 'ಸೂಚನೆಗಳು',
      guestProfile: 'ಅತಿಥಿ ಪ್ರೊಫೈಲ್',
      farmerAccount: 'ರೈತ ಖಾತೆ',
      createAccount: 'ಖಾತೆ ತೆರೆಯಿರಿ',
      signOut: 'ಹೊರಹೋಗಿ',
      activeFarm: 'ಪ್ರಸ್ತುತ ಜಮೀನು',

      // Landing Page
      landingTitle: 'ಬುದ್ಧಿವಂತ ನಿರ್ಧಾರಗಳು. ಉತ್ತಮ ಕೃಷಿ.',
      landingSubtitle: 'ನಿಖರ ಹವಾಮಾನ, ಮಣ್ಣಿನ ತೇವಾಂಶ ಮತ್ತು ನಿಮ್ಮ ಜಮೀನಿಗೆ ಸೂಕ್ತವಾದ ಕೃಷಿ ನಿರ್ಧಾರಗಳು.',
      letsExplore: 'ಪ್ರಾರಂಭಿಸಿ →',
      landingFeat1Title: 'ಮಣ್ಣಿನ ತೇವಾಂಶ',
      landingFeat1Desc: 'ಉಪಗ್ರಹ ಮಾದರಿ ಮತ್ತು ಸೆನ್ಸಾರ್ ಮಾಹಿತಿ ಆಧಾರಿತ ಮೇಲ್ವಿಚಾರಣೆ.',
      landingFeat2Title: 'ಬೆಳೆ ಜ್ಞಾನ',
      landingFeat2Desc: 'ಬೆಳವಣಿಗೆಯ ಹಂತಗಳು ಮತ್ತು ಕಾಲೋಚಿತ ಪೋಷಕಾಂಶಗಳ ಮಾರ್ಗದರ್ಶಿ.',
      landingFeat3Title: 'ಸ್ಪಷ್ಟ ಕೃಷಿ ಸಲಹೆ',
      landingFeat3Desc: '"ಈಗ ನಾನು ಏನು ಮಾಡಬೇಕು?" ಮತ್ತು "ಏಕೆ?" ಎಂಬ ಪ್ರಶ್ನೆಗಳಿಗೆ ಸ್ಪಷ್ಟ ಉತ್ತರ.',

      // User Details Step
      welcomeTitle: 'ಫಾರ್ಮ್‌ಹಬ್‌ಗೆ ಸುಸ್ವಾಗತ 🌱',
      welcomeSubtitle: 'ಕೆಲವೇ ಸರಳ ಹಂತಗಳಲ್ಲಿ ನಿಮ್ಮ ಜಮೀನಿನ ವಿವರ ಸೇರಿಸಿ.',
      fullName: 'ಪೂರ್ಣ ಹೆಸರು',
      enterName: 'ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
      phoneNumber: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
      enterPhone: 'ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ',
      btnContinue: 'ಮುಂದುವರಿಯಿರಿ →',
      btnLoginLater: 'ನಂತರ ಲಾಗಿನ್ ಆಗಿ',
      guestNotice: 'ಅತಿಥಿಯಾಗಿ ಮುಂದುವರಿಯುತ್ತಿದ್ದೀರಿ. ನೀವು ಯಾವಾಗ ಬೇಕಾದರೂ ಖಾತೆ ಮಾಡಿಕೊಳ್ಳಬಹುದು.',

      // Crop Specifications Step
      tellUsFarm: 'ನಿಮ್ಮ ಜಮೀನಿನ ಬಗ್ಗೆ ತಿಳಿಸಿ 🌱',
      whereLocation: 'ನಿಮ್ಮ ಜಮೀನು ಎಲ್ಲಿದೆ?',
      useMyLocation: '📍 ನನ್ನ ಸ್ಥಳ ಬಳಸಿ',
      searchLocation: '🔍 ಸ್ಥಳ ಹುಡುಕಿ',
      locationNotSelected: 'ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿಲ್ಲ',
      locationSelected: 'ಜಮೀನಿನ ಸ್ಥಳ ಆಯ್ಕೆಯಾಗಿದೆ ✓',
      mapUnavailable: 'ನಕ್ಷೆ ಸದ್ಯಕ್ಕೆ ಲಭ್ಯವಿಲ್ಲ',
      retryMap: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
      whatCropType: 'ಯಾವ ರೀತಿಯ ಬೆಳೆ ಬೆಳೆಯುತ್ತಿದ್ದೀರಿ?',
      catFlowers: 'ಹೂವುಗಳು',
      catFruits: 'ಹಣ್ಣುಗಳು',
      catVegetables: 'ತರಕಾರಿಗಳು',
      catOther: 'ಇತರ ಬೆಳೆಗಳು',
      whichCrop: 'ಯಾವ ಬೆಳೆಯನ್ನು ಬೆಳೆಯುತ್ತಿದ್ದೀರಿ?',
      cropOther: 'ಇತರ',
      enterCropName: 'ನಿಮ್ಮ ಬೆಳೆಯ ಹೆಸರು ಬರೆಯಿರಿ',
      cropPlaceholder: 'ಉದಾ: ಸೌತೆಕಾಯಿ, ಸಾಸಿವೆ...',
      goToMyFarm: 'ನನ್ನ ಜಮೀನಿಗೆ ಹೋಗಿ →',

      // Dashboard Hero & Core Questions
      heroTitle: 'ಈಗ ನಾನು ಏನು ಮಾಡಬೇಕು?',
      whyTitle: 'ಏಕೆ?',
      dataUsedTitle: 'ಬಳಸಿದ ಮಾಹಿತಿ',
      nextCheckTitle: 'ಮುಂದೆ ಏನು ಪರಿಶೀಲಿಸಬೇಕು?',
      confidence: 'ವಿಶ್ವಾಸಾರ್ಹತೆ',
      fieldRisk: 'ಅಪಾಯ ಮಟ್ಟ',
      riskLow: 'ಕಡಿಮೆ',
      riskModerate: 'ಮಧ್ಯಮ',
      riskHigh: 'ಹೆಚ್ಚು',
      riskCritical: 'ತೀವ್ರ',
      scheduledCheck: 'ನಿಗದಿತ ಪರಿಶೀಲನೆ',
      readAdvisory: 'ಸಲಹೆ ಆಲಿಸಿ (ಧ್ವನಿ)',
      stopAdvisory: 'ಧ್ವನಿಯನ್ನು ನಿಲ್ಲಿಸಿ',
      audioAdvisory: {
        opening: 'ಫಾರ್ಮ್‌ಹಬ್‌ನಿಂದ ಈ ಜಮೀನಿನ ಸಲಹೆ',
        cropLabel: 'ಬೆಳೆ',
        recommendation: 'ಶಿಫಾರಸು:',
        guidance: {
          IRRIGATE: 'ಬಿಸಿಲು ಹೆಚ್ಚಾಗುವ ಮೊದಲು ನಾಳೆ ಬೆಳಿಗ್ಗೆ 6ರಿಂದ 8:30ರ ನಡುವೆ ನೀರಾವರಿ ಮಾಡಿ. ಮಣ್ಣಿನ ತೇವಾಂಶ ಕಡಿಮೆಯಾಗಿದೆ.',
          WAIT: 'ನಾಳೆ ಸಂಜೆವರೆಗೆ ಕಾಯಿರಿ. ಮಳೆಯ ನಿರೀಕ್ಷೆಯಿರುವುದರಿಂದ ಈಗ ನೀರಾವರಿ ಮಾಡಿದರೆ ನೀರು ವ್ಯರ್ಥವಾಗಬಹುದು.',
          'INSPECT FIELD': 'ಎರಡು ಗಂಟೆಗಳೊಳಗೆ ಹೊಲವನ್ನು ಪರಿಶೀಲಿಸಿ. ನೀರಾವರಿ ಆರಂಭಿಸುವ ಮೊದಲು ಕೈಯಿಂದ ಮಣ್ಣಿನ ತೇವಾಂಶ ಪರೀಕ್ಷಿಸಿ.',
          'PROTECT CROP': 'ನಿರೀಕ್ಷಿತ ಹವಾಮಾನ ಒತ್ತಡದಿಂದ ಬೆಳೆಯನ್ನು ರಕ್ಷಿಸಿ. ಮಲ್ಚ್ ಅಥವಾ ನೆರಳು ಬಳಸಿ; ತೀವ್ರ ಬಿಸಿಲಿನಲ್ಲಿ ಹೆಚ್ಚು ನೀರು ಹಾಕಬೇಡಿ.',
          MONITOR: 'ಈಗ ತಕ್ಷಣ ಕ್ರಮ ಅಗತ್ಯವಿಲ್ಲ. ಆರರಿಂದ ಎಂಟು ಗಂಟೆಗಳಲ್ಲಿ ಹೊಲವನ್ನು ಮತ್ತೆ ಪರಿಶೀಲಿಸಿ.',
          'DELAY IRRIGATION': 'ನೀರಾವರಿಯನ್ನು ನಾಳೆ ಬೆಳಿಗ್ಗೆ ಆರು ಗಂಟೆಯವರೆಗೆ ಮುಂದೂಡಿ. ಸದ್ಯಕ್ಕೆ ಮಣ್ಣಿನಲ್ಲಿ ಸಾಕಷ್ಟು ತೇವಾಂಶ ಇರಬಹುದು.',
          'CHECK DRAINAGE': 'ಮಳೆ ಬರುವ ಮೊದಲು ಹೊಲದ ಚರಂಡಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ, ಬೆಳೆಯ ಬೇರುಗಳ ಬಳಿ ನೀರು ನಿಲ್ಲದಂತೆ ಮಾಡಿ.'
        },
        confidence: 'ವಿಶ್ವಾಸ ಮಟ್ಟ',
        percent: 'ಶೇಕಡಾ'
      },
      printAdvisory: 'ಮುದ್ರಿಸಿ',
      completeProfileNotice: 'ನಿಮ್ಮ ಜಮೀನು ಸಿದ್ಧವಾಗಿದೆ 🌱',
      completeProfileDesc: 'ಇನ್ನಷ್ಟು ನಿಖರ ಸಲಹೆಗಾಗಿ ಮಣ್ಣಿನ ಪ್ರಕಾರ, ವಿಸ್ತೀರ್ಣ ಮತ್ತು ನೀರಾವರಿ ವಿವರಗಳನ್ನು ಸೇರಿಸಿ.',
      btnCompleteProfile: 'ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ',

      // Stats
      statFields: 'ಒಟ್ಟು ಜಮೀನುಗಳು',
      statArea: 'ಒಟ್ಟು ವಿಸ್ತೀರ್ಣ',
      statCrops: 'ಬೆಳೆಗಳು',
      statIncome: 'ನಿವ್ವಳ ಆದಾಯ',
      notAddedYet: 'ಇನ್ನೂ ಸೇರಿಸಿಲ್ಲ',
      add: 'ಸೇರಿಸಿ',

      // Signals
      soilMoisture: 'ಮಣ್ಣಿನ ತೇವಾಂಶ',
      airTemp: 'ತಾಪಮಾನ',
      humidity: 'ಆರ್ದ್ರತೆ',
      windSpeed: 'ಗಾಳಿಯ ವೇಗ',
      rainChance: 'ಮಳೆಯ ಸಾಧ್ಯತೆ',
      expectedRain: 'ನಿರೀಕ್ಷಿತ ಮಳೆ',
      cropStage: 'ಬೆಳೆಯ ಹಂತ',

      // Weather View
      liveWeatherUnavailable: 'ಹವಾಮಾನ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ',
      feelsLike: 'ಅನುಭವವಾಗುವ ತಾಪಮಾನ',
      uvIndex: 'ಯುವಿ ಸೂಚ್ಯಂಕ',
      sunrise: 'ಸೂರ್ಯೋದಯ',
      sunset: 'ಸೂರ್ಯಾಸ್ತ',
      hourlyForecast: '48 ಗಂಟೆಗಳ ಮುನ್ಸೂಚನೆ',
      sevenDayForecast: '7 ದಿನಗಳ ವಿಸ್ತೃತ ಮುನ್ಸೂಚನೆ',

      // Fertilizer View
      fertPrefNatural: '🌿 ನೈಸರ್ಗಿಕ / ಸಾವಯವ',
      fertPrefSynthetic: '🧪 ರಾಸಾಯನಿಕ',
      fertPrefIntegrated: '🔄 ಸಮಗ್ರ ಪದ್ಧತಿ',
      fertSafetyNotice: 'ನಿಖರ ಶಿಫಾರಸಿಗಾಗಿ ಮಣ್ಣು ಪರೀಕ್ಷೆ ಅಗತ್ಯ. ರಸಗೊಬ್ಬರ ಹಾಕುವ ಮುನ್ನ ಕೃಷಿ ಅಧಿಕಾರಿಯ ಸಲಹೆ ಪಡೆಯಿರಿ.',
      npkDosageTitle: 'ಅಂದಾಜು ಪೋಷಕಾಂಶಗಳ ಅಗತ್ಯತೆ',
      assumptionsTitle: 'ಆಧಾರ ಮತ್ತು ಲೆಕ್ಕಾಚಾರ',

      // Crop Health
      healthTitle: 'ಬೆಳೆ ರೋಗ ಮತ್ತು ಕೀಟ ಪತ್ತೆ',
      healthSubtitle: 'ಲಕ್ಷಣಗಳನ್ನು ಆರಿಸಿ ಅಥವಾ ಬೆಳೆಯ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
      uploadPhoto: '📷 ಬೆಳೆಯ ಫೋಟೋ ಹಾಕಿ',
      analyzeSymptoms: '🔍 ಲಕ್ಷಣ ಪರಿಶೀಲಿಸಿ',
      possibleIssue: 'ಸಾಧ್ಯವಿರುವ ಸಮಸ್ಯೆ',
      managementOptions: 'ನಿರ್ವಹಣಾ ಕ್ರಮಗಳು',
      healthDisclaimer: 'ಇದು ಪ್ರಾಥಮಿಕ ಮಾರ್ಗದರ್ಶಿ ಮಾತ್ರ. ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರದ (KVK) ತಜ್ಞರಿಂದ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',

      // Market & Finance
      marketTitle: 'ಮಾರುಕಟ್ಟೆ ಮತ್ತು ಮಂಡಿ ದರ',
      liveMarketUnavailable: 'ಲೈವ್ ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ',
      demoDataTag: 'ಮಾದರಿ ಮಾಹಿತಿ · ಉದಾಹರಣೆಗಾಗಿ ಮಾತ್ರ',
      modalPrice: 'ಮಾದರಿ ಬೆಲೆ',
      priceRange: 'ಬೆಲೆ ಶ್ರೇಣಿ',
      weeklyTrend: 'ವಾರದ ಪ್ರವೃತ್ತಿ',
      revenue: 'ಆದಾಯ',
      expenses: 'ವೆಚ್ಚಗಳು',
      netProfit: 'ನಿವ್ವಳ ಲಾಭ',
      costPerAcre: 'ಪ್ರತಿ ಎಕರೆ ವೆಚ್ಚ',

      // Sensors
      liveSensor: 'ಲೈವ್ ಸಂವೇದಕ',
      noSensorConnected: 'ಯಾವುದೇ ಸಂವೇದಕ ಸಂಪರ್ಕಗೊಂಡಿಲ್ಲ',
      demoSensorData: 'ಮಾದರಿ ಸೆನ್ಸಾರ್ ಮಾಹಿತಿ',

      // Common actions
      refresh: 'ನವೀಕರಿಸಿ',
      save: 'ಉಳಿಸಿ',
      cancel: 'ರದ್ದುಮಾಡಿ',
      delete: 'ಅಳಿಸಿ',
      edit: 'ತಿದ್ದಿ',
      confirm: 'ಖಚಿತಪಡಿಸಿ',

      // Extended Features & Copilot
      instantDemo: '⚡ ಲೈವ್ ಡೆಮೊ ಪ್ರಯತ್ನಿಸಿ',
      copilotBtn: 'ಕಿಸಾನ್ ಕೋಪೈಲಟ್',
      copilotTitle: 'ಕಿಸಾನ್ ಎಐ ಕೋಪೈಲಟ್ 🌱',
      copilotSubtitle: 'ನಿಖರ ಕೃಷಿ ಸಲಹಾ ಸಹಾಯಕ',
      copilotPlaceholder: 'ಬೆಳೆ, ಸಿಂಪಡಣೆ, ಗೊಬ್ಬರ, ಕೀಟಬಾಧೆ ಬಗ್ಗೆ ಏನು ಬೇಕಾದರೂ ಕೇಳಿ...',
      cmdSearchPlaceholder: 'ಬೆಳೆಗಳು, ರೋಗಗಳು, ಸಲಕರಣೆಗಳನ್ನು ಹುಡುಕಿ... (Ctrl+K)',
      sprayRadarTitle: '24-ಗಂಟೆಗಳ ಸಿಂಪಡಣೆ ಸೂಕ್ತತೆ ರೇಡಾರ್',
      sprayRadarDesc: 'ಕೀಟನಾಶಕ ಮತ್ತು ಪೋಷಕಾಂಶ ಸಿಂಪಡಣೆಗೆ ಸುರಕ್ಷಿತ, ಗಾಳಿ ರಹಿತ ಸಮಯದ ವಿಶ್ಲೇಷಣೆ.',
      yieldPredictorTitle: 'ಇಳುವರಿ ಮತ್ತು ಆದಾಯ ಅಂದಾಜು ಯಂತ್ರ',
      yieldPredictorDesc: 'ಪ್ರಸ್ತುತ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ದರಗಳ ಆಧಾರದ ಮೇಲೆ ಅಂದಾಜು ಇಳುವರಿ ಮತ್ತು ಮೌಲ್ಯಮಾಪನ.',
      sampleDiagnosticsTitle: 'ಪರೀಕ್ಷಾರ್ಥ ಮಾದರಿ ರೋಗ ಪತ್ತೆ',
      sampleDiagnosticsDesc: 'ಎಲೆ ಸ್ಕ್ಯಾನರ್ ಪರೀಕ್ಷಿಸಲು ಮತ್ತು ರೋಗ ನಿಯಂತ್ರಣ ಮಾಹಿತಿ ವೀಕ್ಷಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ:',
      dataBackupTitle: 'ಡೇಟಾ ನಿರ್ವಹಣೆ ಮತ್ತು ಆಫ್‌ಲೈನ್ ಬ್ಯಾಕಪ್',
      exportBackup: 'ಫಾರ್ಮ್ ಡೇಟಾ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ (JSON)',
      importBackup: 'ಫಾರ್ಮ್ ಡೇಟಾ ಮರುಸ್ಥಾಪಿಸಿ (JSON)',
      onlineStatus: 'ಆನ್‌ಲೈನ್',
      offlineStatus: 'ಆಫ್‌ಲೈನ್ ಸಿದ್ಧ',
      toastDemoLoaded: 'ಡೆಮೊ ಜಮೀನು ಯಶಸ್ವಿಯಾಗಿ ಲೋಡ್ ಆಗಿದೆ! 🌱',
      toastBackupExported: 'ಬ್ಯಾಕಪ್ ಫೈಲ್ ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ! 💾',
      toastBackupImported: 'ಡೇಟಾ ಯಶಸ್ವಿಯಾಗಿ ಮರುಸ್ಥಾಪನೆಗೊಂಡಿದೆ! 🔄',
      printBriefTitle: 'ಜಮೀನಿನ ಮುಖ್ಯಾಂಶ ವರದಿ',
      soil3DTitle: '3D ಮಣ್ಣಿನ ಪದರ ಮತ್ತು ತೇವಾಂಶ ಇಳಿಯುವಿಕೆಯ ಸಿಮ್ಯುಲೇಟರ್',
      soil3DDesc: 'ಮಣ್ಣಿನ ಮೂರು ಪದರಗಳು, ಬೇರುಗಳ ಬೆಳವಣಿಗೆ ಮತ್ತು ನೀರಿನ ಚಲನೆಯ 3D ನೈಜ ಚಿತ್ರಣ.',
      skyAtmosphereTitle: 'ನೈಜ ಸಮಯದ ವಾತಾವರಣ ಮತ್ತು ಗಾಳಿಯ ಹರಿವು',
      satelliteAirQuality: 'ಉಪಗ್ರಹ ಆಧಾರಿತ ಗಾಳಿಯ ಗುಣಮಟ್ಟ (Open-Meteo)',
      liveDopplerRadar: 'ಲೈವ್ ಡಾಪ್ಲರ್ ಮಳೆ ರೇಡಾರ್ (RainViewer)',
      phenologyMorphologyTitle: '2D ಬೆಳೆ ಬೆಳವಣಿಗೆ ಮತ್ತು ಹಂತಗಳ ದೃಶ್ಯೀಕರಣ'
    },

    ta: {
      // Brand & Navigation
      brandName: 'பார்ம்ஹப்',
      tagline: 'புத்திசாலி முடிவுகள். சிறந்த விவசாயம்.',
      subBrand: 'ஸ்மார்ட் விவசாய முடிவுகள்',
      navOverview: 'கண்ணோட்டம்',
      navMyFarm: 'என் பண்ணை',
      navWeather: 'வானிலை',
      navCalendar: 'பயிர் நாட்காட்டி',
      navIrrigation: 'பாசனம்',
      navAdvisory: 'பண்ணை ஆலோசனை',
      navFertilizer: 'உர வழிகாட்டி',
      navHealth: 'பயிர் நலம்',
      navMarket: 'சந்தை / மண்டி',
      navFinance: 'நிதி',
      navHistory: 'வரலாறு',
      navSensors: 'சென்சார்கள்',
      navSettings: 'அமைப்புகள்',
      groupYourFarm: 'உங்கள் பண்ணை',
      groupAdvisory: 'ஆலோசனை',
      groupInsights: 'நுண்ணறிவு',
      groupManagement: 'மேலாண்மை',

      // Top bar & Profile
      themeToggle: 'தீம் மாற்று',
      langSelect: 'மொழி',
      notifications: 'அறிவிப்புகள்',
      guestProfile: 'விருந்தினர் சுயவிவரம்',
      farmerAccount: 'விவசாயி கணக்கு',
      createAccount: 'கணக்கு தொடங்க',
      signOut: 'வெளியேறு',
      activeFarm: 'நடப்பு பண்ணை',

      // Landing Page
      landingTitle: 'புத்திசாலி முடிவுகள். சிறந்த விவசாயம்.',
      landingSubtitle: 'துல்லியமான வானிலை, மண் ஈரப்பதம் மற்றும் உங்கள் வயலுக்கான சரியான விவசாய ஆலோசனைகள்.',
      letsExplore: 'தொடங்குங்கள் →',
      landingFeat1Title: 'மண் ஈரப்பதம்',
      landingFeat1Desc: 'செயற்கைக்கோள் மற்றும் சென்சார் தரவு கண்காணிப்பு.',
      landingFeat2Title: 'பயிர் அறிவு',
      landingFeat2Desc: 'பயிர் வளர்ச்சி நிலைகள் மற்றும் பருவ ஊட்டச்சத்து வழிகாட்டுதல்.',
      landingFeat3Title: 'விளக்கமான ஆலோசனை',
      landingFeat3Desc: '"இப்போது நான் என்ன செய்ய வேண்டும்?" என்பதற்கு எளிய தீர்வு.',

      // User Details Step
      welcomeTitle: 'பார்ம்ஹப்பிற்கு நல்வரவு 🌱',
      welcomeSubtitle: 'சில எளிய படிகளில் உங்கள் பண்ணை விவரங்களைச் சேர்க்கவும்.',
      fullName: 'முழு பெயர்',
      enterName: 'உங்கள் பெயரை உள்ளிடவும்',
      phoneNumber: 'கைபேசி எண்',
      enterPhone: 'உங்கள் கைபேசி எண்ணை உள்ளிடவும்',
      btnContinue: 'தொடரவும் →',
      btnLoginLater: 'பிறகு உள்நுழையவும்',
      guestNotice: 'விருந்தினராக தொடர்கிறீர்கள். நீங்கள் எப்போது வேண்டுமானாலும் கணக்கு தொடங்கலாம்.',

      // Crop Specifications Step
      tellUsFarm: 'உங்கள் பண்ணை பற்றி சொல்லுங்கள் 🌱',
      whereLocation: 'உங்கள் பண்ணை எங்கே உள்ளது?',
      useMyLocation: '📍 என் இருப்பிடத்தைப் பயன்படுத்து',
      searchLocation: '🔍 இருப்பிடத்தைத் தேடு',
      locationNotSelected: 'இருப்பிடம் தேர்ந்தெடுக்கப்படவில்லை',
      locationSelected: 'பண்ணை இருப்பிடம் தேர்வானது ✓',
      mapUnavailable: 'வரைபடம் தற்காலிகமாக கிடைக்கவில்லை',
      retryMap: 'மீண்டும் முயற்சி செய்',
      whatCropType: 'என்ன வகை பயிர் பயிரிடுகிறீர்கள்?',
      catFlowers: 'பூக்கள்',
      catFruits: 'பழங்கள்',
      catVegetables: 'காய்கறிகள்',
      catOther: 'பிற பயிர்கள்',
      whichCrop: 'எந்த பயிரை பயிரிடுகிறீர்கள்?',
      cropOther: 'மற்றவை',
      enterCropName: 'பயிரின் பெயரை உள்ளிடவும்',
      cropPlaceholder: 'உதா: வெள்ளரி, கடுகு...',
      goToMyFarm: 'என் பண்ணைக்குச் செல் →',

      // Dashboard Hero & Core Questions
      heroTitle: 'இப்போது நான் என்ன செய்ய வேண்டும்?',
      whyTitle: 'ஏன்?',
      dataUsedTitle: 'பயன்படுத்திய தரவு',
      nextCheckTitle: 'அடுத்து என்ன கவனிக்க வேண்டும்?',
      confidence: 'நம்பகத்தன்மை',
      fieldRisk: 'ஆபத்து நிலை',
      riskLow: 'குறைவு',
      riskModerate: 'நடுத்தரம்',
      riskHigh: 'அதிகம்',
      riskCritical: 'தீவிரம்',
      scheduledCheck: 'திட்டமிட்ட ஆய்வு',
      readAdvisory: 'ஆலோசனையைக் கேள் (ஆடியோ)',
      stopAdvisory: 'ஒலியை நிறுத்து',
      audioAdvisory: {
        opening: 'FarmHub பண்ணை ஆலோசனை',
        cropLabel: 'பயிர்',
        recommendation: 'பரிந்துரை:',
        guidance: {
          IRRIGATE: 'வெப்பம் அதிகரிக்கும் முன், நாளை காலை 6 மணி முதல் 8:30 மணிக்குள் நீர்ப்பாசனம் செய்யுங்கள். மண்ணின் ஈரப்பதம் குறைவாக உள்ளது.',
          WAIT: 'நாளை மாலை வரை காத்திருக்கவும். மழை எதிர்பார்க்கப்படுவதால் இப்போது நீர்ப்பாசனம் செய்வது நீரை வீணாக்கலாம்.',
          'INSPECT FIELD': 'இரண்டு மணி நேரத்திற்குள் வயலைப் பாருங்கள். நீர்ப்பாசனத்தைத் தொடங்கும் முன் கையால் மண்ணின் ஈரத்தைச் சரிபார்க்கவும்.',
          'PROTECT CROP': 'எதிர்பார்க்கப்படும் வானிலை பாதிப்பிலிருந்து பயிரைப் பாதுகாக்கவும். மூடாக்கு அல்லது நிழல் பயன்படுத்தி, கடும் வெப்பத்தில் அதிக நீர் பாய்ச்ச வேண்டாம்.',
          MONITOR: 'உடனடி நடவடிக்கை தேவையில்லை. ஆறு முதல் எட்டு மணி நேரத்தில் வயலை மீண்டும் சரிபார்க்கவும்.',
          'DELAY IRRIGATION': 'நீர்ப்பாசனத்தை நாளை காலை 6 மணி வரை தாமதிக்கவும். இப்போது மண்ணில் போதுமான ஈரம் இருக்கும்.',
          'CHECK DRAINAGE': 'மழை வருவதற்கு முன் வயல் வடிகால்களைச் சரிபார்த்து, பயிரின் வேர்ப்பகுதியில் நீர் தேங்காமல் பார்த்துக்கொள்ளுங்கள்.'
        },
        confidence: 'நம்பிக்கை அளவு',
        percent: 'சதவீதம்'
      },
      printAdvisory: 'அச்சிடு',
      completeProfileNotice: 'உங்கள் பண்ணை தயாராக உள்ளது 🌱',
      completeProfileDesc: 'துல்லியமான பரிந்துரைகளுக்கு மண் வகை, பரப்பளவு மற்றும் பாசன விவரங்களைச் சேர்க்கவும்.',
      btnCompleteProfile: 'சுயவிவரத்தை முடிக்கவும்',

      // Stats
      statFields: 'மொத்த வயல்கள்',
      statArea: 'மொத்த பரப்பு',
      statCrops: 'பயிர்கள்',
      statIncome: 'நிகர வருமானம்',
      notAddedYet: 'இன்னும் சேர்க்கவில்லை',
      add: 'சேர்',

      // Signals
      soilMoisture: 'மண் ஈரப்பதம்',
      airTemp: 'வெப்பநிலை',
      humidity: 'ஈரப்பதம்',
      windSpeed: 'காற்றின் வேகம்',
      rainChance: 'மழை வாய்ப்பு',
      expectedRain: 'எதிர்பார்க்கும் மழை',
      cropStage: 'பயிர் நிலை',

      // Weather View
      liveWeatherUnavailable: 'வானிலை தகவல் கிடைக்கவில்லை',
      feelsLike: 'உணரும் வெப்பநிலை',
      uvIndex: 'யுவி குறியீடு',
      sunrise: 'சூரிய உதயம்',
      sunset: 'சூரிய அஸ்தமனம்',
      hourlyForecast: '48 மணிநேர முன்னறிவிப்பு',
      sevenDayForecast: '7 நாள் முன்னறிவிப்பு',

      // Fertilizer View
      fertPrefNatural: '🌿 இயற்கை / மண்புழு உரம்',
      fertPrefSynthetic: '🧪 ரசாயன உரம்',
      fertPrefIntegrated: '🔄 ஒருங்கிணைந்த முறை',
      fertSafetyNotice: 'சரியான பரிந்துரைக்கு மண் பரிசோதனை அவசியம். விவசாய அதிகாரியின் ஆலோசனை பெறவும்.',
      npkDosageTitle: 'தேவையான உர அளவுகள்',
      assumptionsTitle: 'அடிப்படை கணக்கீடுகள்',

      // Crop Health
      healthTitle: 'பயிர் நலம் மற்றும் நோய் கண்டறிதல்',
      healthSubtitle: 'அறிகுறிகளைத் தேர்ந்தெடுக்கவும் அல்லது பயிர் புகைப்படத்தை பதிவேற்றவும்.',
      uploadPhoto: '📷 பயிர் புகைப்படம் பதிவேற்று',
      analyzeSymptoms: '🔍 ஆய்வு செய்',
      possibleIssue: 'சாத்தியமான பிரச்சனை',
      managementOptions: 'மேலாண்மை வழிகள்',
      healthDisclaimer: 'இது ஒரு முதன்மை வழிகாட்டி மட்டுமே. வேளாண் அறிவியல் மைய (KVK) நிபுணரிடம் உறுதி செய்யவும்.',

      // Market & Finance
      marketTitle: 'சந்தை மற்றும் மண்டி விலை',
      liveMarketUnavailable: 'நேரலை சந்தை தகவல் கிடைக்கவில்லை',
      demoDataTag: 'மாதிரி தரவு · உதாரணத்திற்கு மட்டும்',
      modalPrice: 'சராசரி விலை',
      priceRange: 'விலை வரம்பு',
      weeklyTrend: 'வாராந்திர போக்கு',
      revenue: 'வருமானம்',
      expenses: 'செலவுகள்',
      netProfit: 'நிகர லாபம்',
      costPerAcre: 'ஏக்கர் செலவு',

      // Sensors
      liveSensor: 'நேரலை சென்சார்',
      noSensorConnected: 'சென்சார் இணைக்கப்படவில்லை',
      demoSensorData: 'மாதிரி சென்சார் தரவு',

      // Common actions
      refresh: 'புதுப்பி',
      save: 'சேமி',
      cancel: 'ரத்து',
      delete: 'நீக்கு',
      edit: 'திருத்து',
      confirm: 'உறுதி செய்',

      // Extended Features & Copilot
      instantDemo: '⚡ நேரடி செயல்விளக்கம்',
      copilotBtn: 'கிசான் கோபிலட்',
      copilotTitle: 'கிசான் ஏஐ கோபிலட் 🌱',
      copilotSubtitle: 'துல்லிய விவசாய கள உதவியாளர்',
      copilotPlaceholder: 'பயிர், மருந்து தெளிப்பு, உரம், பூச்சிகள் பற்றி கேளுங்கள்...',
      cmdSearchPlaceholder: 'பயிர்கள், நோய்கள், கருவிகளைத் தேடுங்கள்... (Ctrl+K)',
      sprayRadarTitle: '24-மணிநேர மருந்து தெளிப்பு ரேடார்',
      sprayRadarDesc: 'பாதுகாப்பான மருந்து தெளிப்பிற்கான கால நிலை பகுப்பாய்வு.',
      yieldPredictorTitle: 'மகசூல் மற்றும் வருவாய் மதிப்பீட்டாளர்',
      yieldPredictorDesc: 'சந்தை விலையின் அடிப்படையில் எதிர்பார்க்கப்படும் மகசூல் மற்றும் வருவாய்.',
      sampleDiagnosticsTitle: 'மாதிரி நோய் பரிசோதனை',
      sampleDiagnosticsDesc: 'மாதிரி இலையைத் தேர்ந்தெடுத்து ஆய்வு செய்து தீர்வு காண்க:',
      dataBackupTitle: 'தரவு மேலாண்மை மற்றும் ஆஃப்லைன் காப்புநகல்',
      exportBackup: 'பண்ணை தரவைப் பதிவிறக்கு (JSON)',
      importBackup: 'பண்ணை தரவை மீட்டெடு (JSON)',
      onlineStatus: 'ஆன்லைன்',
      offlineStatus: 'ஆஃப்லைன் தயார்',
      toastDemoLoaded: 'டெமோ பண்ணை வெற்றிகரமாக ஏற்றப்பட்டது! 🌱',
      toastBackupExported: 'காப்புநகல் வெற்றிகரமாக பதிவிறக்கப்பட்டது! 💾',
      toastBackupImported: 'தரவு வெற்றிகரமாக மீட்டமைக்கப்பட்டது! 🔄',
      printBriefTitle: 'பண்ணை சுருக்க அறிக்கை',
      soil3DTitle: '3D மண் அடுக்கு மற்றும் நீர் ஊடுருவல் மாதிரி',
      soil3DDesc: 'மண் அடுக்குகள், வேர் அமைப்பு மற்றும் நீர் பரவல் பற்றிய ஊடாடும் முப்பரிமாண காட்சி.',
      skyAtmosphereTitle: 'நேரலை வளிமண்டலம் மற்றும் காற்று ஓட்டம்',
      satelliteAirQuality: 'செயற்கைக்கோள் காற்று தரம் (Open-Meteo Sentinel)',
      liveDopplerRadar: 'நேரலை டாப்ளர் மழை ரேடார் (RainViewer)',
      phenologyMorphologyTitle: '2D பயிர் வளர்ச்சி மற்றும் நிலைகள் காட்சி'
    },

    te: {
      // Brand & Navigation
      brandName: 'ఫార్మ్‌హబ్',
      tagline: 'తెలివైన నిర్ణయాలు. మెరుగైన వ్యవసాయం.',
      subBrand: 'స్మార్ట్ వ్యవసాయ నిర్ణయాలు',
      navOverview: 'అవలోకనం',
      navMyFarm: 'నా పొలం',
      navWeather: 'వాతావరణం',
      navCalendar: 'పంట క్యాలెండర్',
      navIrrigation: 'నీటిపారుదల',
      navAdvisory: 'వ్యవసాయ సలహా',
      navFertilizer: 'ఎరువుల మార్గదర్శి',
      navHealth: 'పంట ఆరోగ్యం',
      navMarket: 'మార్కెట్ / మండి',
      navFinance: 'ఆర్థికం',
      navHistory: 'చరిత్ర',
      navSensors: 'సెన్సార్లు',
      navSettings: 'సెట్టింగ్‌లు',
      groupYourFarm: 'మీ పొలం',
      groupAdvisory: 'సలహా సేవలు',
      groupInsights: 'అంతర్దృష్టులు',
      groupManagement: 'నిర్వహణ',

      // Top bar & Profile
      themeToggle: 'థీమ్ మార్చండి',
      langSelect: 'భాష',
      notifications: 'నోటిఫికేషన్‌లు',
      guestProfile: 'అతిథి ప్రొఫైల్',
      farmerAccount: 'రైతు ఖాతా',
      createAccount: 'ఖాతా తెరవండి',
      signOut: 'లాగ్ అవుట్',
      activeFarm: 'ప్రస్తుత పొలం',

      // Landing Page
      landingTitle: 'తెలివైన నిర్ణయాలు. మెరుగైన వ్యవసాయం.',
      landingSubtitle: 'ఖచ్చితమైన వాతావరణం, నేల తేమ మరియు మీ పొలానికి తగిన వ్యవసాయ సలహాలు.',
      letsExplore: 'ప్రారంభించండి →',
      landingFeat1Title: 'నేల తేమ పరిశీలన',
      landingFeat1Desc: 'శాటిలైట్ మోడల్ మరియు సెన్సార్ సమాచార పర్యవేక్షణ.',
      landingFeat2Title: 'పంట అవగాహన',
      landingFeat2Desc: 'పంట దశలు మరియు సమయానుకూల పోషకాల మార్గదర్శకత్వం.',
      landingFeat3Title: 'స్పష్టమైన సలహా',
      landingFeat3Desc: '"ఇప్పుడు నేను ఏమి చేయాలి?" అనే ప్రశ్నకు స్పష్టమైన పరిష్కారం.',

      // User Details Step
      welcomeTitle: 'ఫార్మ్‌హబ్‌కు స్వాగతం 🌱',
      welcomeSubtitle: 'కొన్ని సాధారణ దశల్లో మీ పొలం వివరాలను నమోదు చేయండి.',
      fullName: 'పూర్తి పేరు',
      enterName: 'మీ పేరు నమోదు చేయండి',
      phoneNumber: 'ఫోన్ నంబర్',
      enterPhone: 'మీ ఫోన్ నంబర్ నమోదు చేయండి',
      btnContinue: 'కొనసాగించండి →',
      btnLoginLater: 'తర్వాత లాగిన్ అవ్వండి',
      guestNotice: 'అతిథిగా కొనసాగుతున్నారు. మీరు ఎప్పుడైనా ఖాతా సృష్టించవచ్చు.',

      // Crop Specifications Step
      tellUsFarm: 'మీ పొలం గురించి చెప్పండి 🌱',
      whereLocation: 'మీ పొలం ఎక్కడ ఉంది?',
      useMyLocation: '📍 నా స్థానాన్ని ఉపయోగించండి',
      searchLocation: '🔍 స్థానాన్ని శోధించండి',
      locationNotSelected: 'స్థానం ఎంచుకోలేదు',
      locationSelected: 'పొలం స్థానం ఎంపికైంది ✓',
      mapUnavailable: 'మ్యాప్ తాత్కాలికంగా అందుబాటులో లేదు',
      retryMap: 'మళ్ళీ ప్రయత్నించండి',
      whatCropType: 'మీరు ఏ రకమైన పంట పండిస్తున్నారు?',
      catFlowers: 'పూలు',
      catFruits: 'పండ్లు',
      catVegetables: 'కూరగాయలు',
      catOther: 'ఇతర పంటలు',
      whichCrop: 'ఏ పంటను పండిస్తున్నారు?',
      cropOther: 'ఇతర',
      enterCropName: 'పంట పేరు నమోదు చేయండి',
      cropPlaceholder: 'ఉదా: దోసకాయ, ఆవాలు...',
      goToMyFarm: 'నా పొలానికి వెళ్ళండి →',

      // Dashboard Hero & Core Questions
      heroTitle: 'ఇప్పుడు నేను ఏమి చేయాలి?',
      whyTitle: 'ఎందుకు?',
      dataUsedTitle: 'ఉపయోగించిన సమాచారం',
      nextCheckTitle: 'తదుపరి ఏమి తనిఖీ చేయాలి?',
      confidence: 'విశ్వసనీయత',
      fieldRisk: 'ప్రమాద స్థాయి',
      riskLow: 'తక్కువ',
      riskModerate: 'మధ్యస్థం',
      riskHigh: 'ఎక్కువ',
      riskCritical: 'తీవ్రం',
      scheduledCheck: 'షెడ్యూల్ చేసిన తనిఖీ',
      readAdvisory: 'సలహా వినండి (ఆడియో)',
      stopAdvisory: 'ఆడియోను ఆపండి',
      audioAdvisory: {
        opening: 'FarmHub వ్యవసాయ సలహా',
        cropLabel: 'పంట',
        recommendation: 'సిఫార్సు:',
        guidance: {
          IRRIGATE: 'వేడి పెరగకముందే రేపు ఉదయం 6 నుంచి 8:30 మధ్య నీరు పెట్టండి. నేలలో తేమ తక్కువగా ఉంది.',
          WAIT: 'రేపు సాయంత్రం వరకు వేచి ఉండండి. వర్షం వచ్చే సూచన ఉంది, కాబట్టి ఇప్పుడు నీరు పెడితే వృథా కావచ్చు.',
          'INSPECT FIELD': 'రెండు గంటల్లో పొలాన్ని పరిశీలించండి. నీరు పెట్టే ముందు చేతితో నేల తేమను పరీక్షించండి.',
          'PROTECT CROP': 'వాతావరణ ఒత్తిడి నుంచి పంటను రక్షించండి. మల్చ్ లేదా నీడను ఉపయోగించండి; తీవ్రమైన వేడిలో ఎక్కువగా నీరు పెట్టవద్దు.',
          MONITOR: 'ప్రస్తుతం తక్షణ చర్య అవసరం లేదు. ఆరు నుంచి ఎనిమిది గంటల్లో పొలాన్ని మళ్లీ పరిశీలించండి.',
          'DELAY IRRIGATION': 'నీరు పెట్టడాన్ని రేపు ఉదయం 6 గంటల వరకు వాయిదా వేయండి. ప్రస్తుతం నేలలో సరిపడా తేమ ఉంది.',
          'CHECK DRAINAGE': 'వర్షం రాకముందే పొలంలోని కాలువలను పరిశీలించి, పంట వేర్ల దగ్గర నీరు నిలవకుండా చూడండి.'
        },
        confidence: 'నమ్మకం స్థాయి',
        percent: 'శాతం'
      },
      printAdvisory: 'ప్రింట్ చేయండి',
      completeProfileNotice: 'మీ పొలం సిద్ధంగా ఉంది 🌱',
      completeProfileDesc: 'ఖచ్చితమైన సిఫార్సుల కోసం నేల రకం, విస్తీర్ణం మరియు నీటిపారుదల వివరాలను నమోదు చేయండి.',
      btnCompleteProfile: 'ప్రొఫైల్ పూర్తి చేయండి',

      // Stats
      statFields: 'మొత్తం పొలాలు',
      statArea: 'మొత్తం విస్తీర్ణం',
      statCrops: 'పంటలు',
      statIncome: 'నికర ఆదాయం',
      notAddedYet: 'ఇంకా జోడించలేదు',
      add: 'జోడించు',

      // Signals
      soilMoisture: 'నేల తేమ',
      airTemp: 'ఉష్ణోగ్రత',
      humidity: 'తేమ శాతం',
      windSpeed: 'గాలి వేగం',
      rainChance: 'వర్షం అవకాశం',
      expectedRain: 'అంచనా వర్షం',
      cropStage: 'పంట దశ',

      // Weather View
      liveWeatherUnavailable: 'వాతావరణ సమాచారం అందుబాటులో లేదు',
      feelsLike: 'అనిపించే ఉష్ణోగ్రత',
      uvIndex: 'యూవీ సూచిక',
      sunrise: 'సూర్యోదయం',
      sunset: 'సూర్యాస్తమయం',
      hourlyForecast: '48 గంటల సూచన',
      sevenDayForecast: '7 రోజుల వాతావరణ సూచన',

      // Fertilizer View
      fertPrefNatural: '🌿 సహజ / సేంద్రీయ',
      fertPrefSynthetic: '🧪 రసాయన ఎరువులు',
      fertPrefIntegrated: '🔄 సమగ్ర పద్ధతి',
      fertSafetyNotice: 'ఖచ్చితమైన మోతాదుకు నేల పరీక్ష అవసరం. వ్యవసాయ అధికారి సలహా తీసుకోండి.',
      npkDosageTitle: 'అవసరమైన ఎరువుల అంచనా',
      assumptionsTitle: 'ఆధారాలు & లెక్కలు',

      // Crop Health
      healthTitle: 'పంట ఆరోగ్యం & తెగుళ్ల గుర్తింపు',
      healthSubtitle: 'లక్షణాలను ఎంచుకోండి లేదా పంట ఫోటోను అప్‌లోడ్ చేయండి.',
      uploadPhoto: '📷 ఫోటో అప్‌లోడ్ చేయండి',
      analyzeSymptoms: '🔍 విశ్లేషించండి',
      possibleIssue: 'సంభవించే సమస్య',
      managementOptions: 'నివారణ చర్యలు',
      healthDisclaimer: 'ఇది ప్రాథమిక సూచన మాత్రమే. కృషి విజ్ఞాన కేంద్రం (KVK) ద్వారా నిర్ధారించుకోండి.',

      // Market & Finance
      marketTitle: 'మార్కెట్ మరియు మండి ధరలు',
      liveMarketUnavailable: 'లైవ్ మార్కెట్ సమాచారం అందుబాటులో లేదు',
      demoDataTag: 'డెమో సమాచారం · నమూనా కోసం మాత్రమే',
      modalPrice: 'సగటు ధర',
      priceRange: 'ధరల పరిధి',
      weeklyTrend: 'వారపు ధోరణి',
      revenue: 'ఆదాయం',
      expenses: 'ఖర్చులు',
      netProfit: 'నికర లాభం',
      costPerAcre: 'ఎకరాకు ఖర్చు',

      // Sensors
      liveSensor: 'లైవ్ సెన్సార్',
      noSensorConnected: 'సెన్సార్ అనుసంధానం కాలేదు',
      demoSensorData: 'డెమో సెన్సార్ డేటా',

      // Common actions
      refresh: 'తాజాకరించు',
      save: 'భద్రపరచు',
      cancel: 'రద్దు చేయి',
      delete: 'తొలగించు',
      edit: 'సవరించు',
      confirm: 'నిర్ధారించు',

      // Extended Features & Copilot
      instantDemo: '⚡ లైవ్ డెమో ప్రయత్నించండి',
      copilotBtn: 'కిసాన్ కోపైలట్',
      copilotTitle: 'కిసాన్ ఏఐ కోపైలట్ 🌱',
      copilotSubtitle: 'ఖచ్చితమైన వ్యవసాయ సహాయకుడు',
      copilotPlaceholder: 'పంటలు, మందుల పిచికారీ, ఎరువులు, తెగుళ్ల గురించి అడగండి...',
      cmdSearchPlaceholder: 'పంటలు, వ్యాధులు, సాధనాలను శోధించండి... (Ctrl+K)',
      sprayRadarTitle: '24-గంటల పిచికారీ అనుకూలత రాడార్',
      sprayRadarDesc: 'సురక్షితమైన మందుల పిచికారీ కోసం సూక్ష్మ వాతావరణ విశ్లేషణ.',
      yieldPredictorTitle: 'దిగుబడి మరియు ఆదాయ అంచనా యంత్రం',
      yieldPredictorDesc: 'మార్కెట్ ధరల ఆధారంగా అంచనా వేసిన దిగుబడి మరియు రాబడి.',
      sampleDiagnosticsTitle: 'నమూనా వ్యాధి నిర్ధారణ కేసులు',
      sampleDiagnosticsDesc: 'ఆకు వ్యాధిని తనిఖీ చేయడానికి మరియు నివారణ చూడటానికి క్లిక్ చేయండి:',
      dataBackupTitle: 'డేటా నిర్వహణ మరియు ఆఫ్‌లైన్ బ్యాకప్',
      exportBackup: 'ఫార్మ్ డేటాను ఎగుమతి చేయండి (JSON)',
      importBackup: 'ఫార్మ్ డేటాను దిగుమతి చేయండి (JSON)',
      onlineStatus: 'ఆన్‌లైన్',
      offlineStatus: 'ఆఫ్‌లైన్ సిద్ధంగా ఉంది',
      toastDemoLoaded: 'డెమో ఫార్మ్ విజయవంతంగా లోడ్ అయింది! 🌱',
      toastBackupExported: 'బ్యాకప్ విజయవంతంగా సేవ్ చేయబడింది! 💾',
      toastBackupImported: 'డేటా విజయవంతంగా పునరుద్ధరించబడింది! 🔄',
      printBriefTitle: 'రైతు సారాంశ నివేదిక',
      soil3DTitle: '3D నేల పొరలు మరియు నీటి ప్రవాహ సిమ్యులేటర్',
      soil3DDesc: 'నేల పొరలు, వేరు వ్యవస్థ మరియు నీటి ఇంకుడు ప్రక్రియల ప్రత్యక్ష 3D మోడల్.',
      skyAtmosphereTitle: 'ప్రత్యక్ష వాతావరణం మరియు గాలి వేగం',
      satelliteAirQuality: 'ఉపగ్రహ ఆధారిత గాలి నాణ్యత (Open-Meteo Sentinel)',
      liveDopplerRadar: 'ప్రత్యక్ష డాప్లర్ వర్షపు రాడార్ (RainViewer)',
      phenologyMorphologyTitle: '2D పంట పెరుగుదల మరియు దశల ప్రత్యక్ష రూపం'
    },

    hi: {
      // Brand & Navigation
      brandName: 'फार्महब',
      tagline: 'सही निर्णय. बेहतर खेती.',
      subBrand: 'स्मार्ट कृषि निर्णय',
      navOverview: 'अवलोकन',
      navMyFarm: 'मेरा खेत',
      navWeather: 'मौसम',
      navCalendar: 'फसल कैलेंडर',
      navIrrigation: 'सिंचाई',
      navAdvisory: 'कृषि सलाह',
      navFertilizer: 'उर्वरक गाइड',
      navHealth: 'फसल स्वास्थ्य',
      navMarket: 'बाज़ार / मंडी',
      navFinance: 'आय-व्यय',
      navHistory: 'इतिहास',
      navSensors: 'सेंसर',
      navSettings: 'सेटिंग्स',
      groupYourFarm: 'आपका खेत',
      groupAdvisory: 'सलाहकार',
      groupInsights: 'विश्लेषण',
      groupManagement: 'प्रबंधन',

      // Top bar & Profile
      themeToggle: 'थीम बदलें',
      langSelect: 'भाषा',
      notifications: 'सूचनाएं',
      guestProfile: 'अतिथि प्रोफ़ाइल',
      farmerAccount: 'किसान खाता',
      createAccount: 'खाता बनाएं',
      signOut: 'लॉग आउट',
      activeFarm: 'सक्रिय खेत',

      // Landing Page
      landingTitle: 'सही निर्णय. बेहतर खेती.',
      landingSubtitle: 'सटीक मौसम, मिट्टी की नमी और आपके खेत के लिए वैज्ञानिक कृषि परामर्श।',
      letsExplore: 'शुरू करें →',
      landingFeat1Title: 'मिट्टी की नमी',
      landingFeat1Desc: 'सैटेलाइट मॉडल व सेंसर डेटा द्वारा जड़ क्षेत्र की नमी की निगरानी।',
      landingFeat2Title: 'फसल ज्ञान',
      landingFeat2Desc: 'फसल अवस्था के अनुसार पोषण व सिंचाई प्रबंधन।',
      landingFeat3Title: 'सटीक सलाह',
      landingFeat3Desc: '"अभी मुझे क्या करना चाहिए?" और "क्यों?" का पारदर्शी उत्तर।',

      // User Details Step
      welcomeTitle: 'फार्महब में आपका स्वागत है 🌱',
      welcomeSubtitle: 'कुछ सरल चरणों में अपने खेत का विवरण जोड़ें।',
      fullName: 'पूरा नाम',
      enterName: 'अपना नाम दर्ज करें',
      phoneNumber: 'मोबाइल नंबर',
      enterPhone: 'अपना मोबाइल नंबर दर्ज करें',
      btnContinue: 'आगे बढ़ें →',
      btnLoginLater: 'बाद में लॉगिन करें',
      guestNotice: 'आप अतिथि के रूप में जारी रख रहे हैं। खाता कभी भी बना सकते हैं।',

      // Crop Specifications Step
      tellUsFarm: 'अपने खेत के बारे में बताएं 🌱',
      whereLocation: 'आपका खेत कहाँ स्थित है?',
      useMyLocation: '📍 मेरी लोकेशन का उपयोग करें',
      searchLocation: '🔍 लोकेशन खोजें',
      locationNotSelected: 'लोकेशन का चयन नहीं हुआ',
      locationSelected: 'खेत की लोकेशन चुनी गई ✓',
      mapUnavailable: 'नक्शा अस्थायी रूप से अनुपलब्ध है',
      retryMap: 'पुनः प्रयास करें',
      whatCropType: 'आप किस प्रकार की फसल उगा रहे हैं?',
      catFlowers: 'फूल',
      catFruits: 'फल',
      catVegetables: 'सब्जियां',
      catOther: 'अन्य फसलें',
      whichCrop: 'आप कौन सी फसल उगा रहे हैं?',
      cropOther: 'अन्य',
      enterCropName: 'अपनी फसल का नाम दर्ज करें',
      cropPlaceholder: 'उदा. खीरा, सरसों...',
      goToMyFarm: 'मेरे खेत पर जाएं →',

      // Dashboard Hero & Core Questions
      heroTitle: 'अभी मुझे क्या करना चाहिए?',
      whyTitle: 'क्यों?',
      dataUsedTitle: 'उपयोग किया गया डेटा',
      nextCheckTitle: 'आगे क्या जांचना चाहिए?',
      confidence: 'सटीकता / विश्वास',
      fieldRisk: 'जोखिम स्तर',
      riskLow: 'कम',
      riskModerate: 'मध्यम',
      riskHigh: 'अधिक',
      riskCritical: 'गंभीर',
      scheduledCheck: 'निर्धारित जांच',
      readAdvisory: 'सलाह सुनें (ऑडियो)',
      stopAdvisory: 'ऑडियो रोकें',
      audioAdvisory: {
        opening: 'FarmHub की खेत सलाह',
        cropLabel: 'फसल',
        recommendation: 'सुझाव:',
        guidance: {
          IRRIGATE: 'तापमान बढ़ने से पहले, कल सुबह 6 से 8:30 बजे के बीच सिंचाई करें। मिट्टी में नमी कम है।',
          WAIT: 'कल शाम तक प्रतीक्षा करें। बारिश की संभावना है, इसलिए अभी सिंचाई करने से पानी व्यर्थ हो सकता है।',
          'INSPECT FIELD': 'दो घंटे के भीतर खेत की जांच करें। सिंचाई शुरू करने से पहले हाथ से मिट्टी की नमी जांचें।',
          'PROTECT CROP': 'संभावित मौसम तनाव से फसल की रक्षा करें। मल्च या छाया का उपयोग करें और तेज गर्मी में अधिक पानी न दें।',
          MONITOR: 'अभी तुरंत कार्रवाई की आवश्यकता नहीं है। छह से आठ घंटे में खेत को फिर जांचें।',
          'DELAY IRRIGATION': 'सिंचाई कल सुबह 6 बजे तक टालें। फिलहाल मिट्टी में पर्याप्त नमी रहनी चाहिए।',
          'CHECK DRAINAGE': 'बारिश आने से पहले खेत की नालियों की जांच करें ताकि फसल की जड़ों के पास पानी न रुके।'
        },
        confidence: 'विश्वास स्तर',
        percent: 'प्रतिशत'
      },
      printAdvisory: 'प्रिंट करें',
      completeProfileNotice: 'आपका खेत तैयार है 🌱',
      completeProfileDesc: 'व्यक्तिगत सिफारिशों के लिए मिट्टी का प्रकार, रकबा और सिंचाई विधि जोड़ें।',
      btnCompleteProfile: 'प्रोफ़ाइल पूरी करें',

      // Stats
      statFields: 'कुल खेत',
      statArea: 'कुल क्षेत्रफल',
      statCrops: 'सक्रिय फसलें',
      statIncome: 'शुद्ध कृषि आय',
      notAddedYet: 'अभी नहीं जोड़ा गया',
      add: 'जोड़ें',

      // Signals
      soilMoisture: 'मिट्टी की नमी',
      airTemp: 'तापमान',
      humidity: 'नमी (आर्द्रता)',
      windSpeed: 'हवा की गति',
      rainChance: 'बारिश की संभावना',
      expectedRain: 'अनुमानित वर्षा',
      cropStage: 'फसल की अवस्था',

      // Weather View
      liveWeatherUnavailable: 'मौसम डेटा उपलब्ध नहीं है',
      feelsLike: 'महसूस होने वाला तापमान',
      uvIndex: 'यूवी इंडेक्स',
      sunrise: 'सूर्योदय',
      sunset: 'सूर्यास्त',
      hourlyForecast: '48 घंटे का पूर्वानुमान',
      sevenDayForecast: '7 दिवसीय विस्तृत पूर्वानुमान',

      // Fertilizer View
      fertPrefNatural: '🌿 प्राकृतिक / जैविक',
      fertPrefSynthetic: '🧪 रासायनिक उर्वरक',
      fertPrefIntegrated: '🔄 समन्वित पोषण',
      fertSafetyNotice: 'सटीक सिफारिश के लिए मिट्टी परीक्षण आवश्यक है। कृषि विशेषज्ञ से सलाह अवश्य लें।',
      npkDosageTitle: 'अनुमानित पोषक तत्वों की आवश्यकता',
      assumptionsTitle: 'आधार व गणना',

      // Crop Health
      healthTitle: 'फसल स्वास्थ्य एवं कीट-रोग निदान',
      healthSubtitle: 'लक्षण चुनें या फसल का फोटो अपलोड करें।',
      uploadPhoto: '📷 फसल की फोटो लगाएं',
      analyzeSymptoms: '🔍 विश्लेषण करें',
      possibleIssue: 'संभावित समस्या',
      managementOptions: 'रोकथाम के उपाय',
      healthDisclaimer: 'यह केवल प्रारंभिक मार्गदर्शिका है। कृषि विज्ञान केंद्र (KVK) के विशेषज्ञों से पुष्टि करें।',

      // Market & Finance
      marketTitle: 'बाज़ार एवं मंडी भाव',
      liveMarketUnavailable: 'लाइव मंडी डेटा उपलब्ध नहीं है',
      demoDataTag: 'डेमो डेटा · केवल उदाहरण के लिए',
      modalPrice: 'मॉडल भाव',
      priceRange: 'भाव सीमा',
      weeklyTrend: 'साप्ताहिक रुझान',
      revenue: 'आय',
      expenses: 'खर्च',
      netProfit: 'शुद्ध लाभ',
      costPerAcre: 'प्रति एकड़ लागत',

      // Sensors
      liveSensor: 'लाइव सेंसर',
      noSensorConnected: 'कोई सेंसर कनेक्ट नहीं है',
      demoSensorData: 'डेमो सेंसर डेटा',

      // Common actions
      refresh: 'रिफ्रेश',
      save: 'सहेजें',
      cancel: 'रद्द करें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      confirm: 'पुष्टि करें',

      // Extended Features & Copilot
      instantDemo: '⚡ लाइव डेमो देखें',
      copilotBtn: 'किसान कोपायलट',
      copilotTitle: 'किसान एआई कोपायलट 🌱',
      copilotSubtitle: 'सटीक कृषि सहायक',
      copilotPlaceholder: 'फसलों, छिड़काव समय, खाद, कीटों के बारे में कुछ भी पूछें...',
      cmdSearchPlaceholder: 'फसलें, रोग, औजार, मॉड्यूल खोजें... (Ctrl+K)',
      sprayRadarTitle: '24-घंटे छिड़काव उपयुक्तता रडार',
      sprayRadarDesc: 'दवा व पर्णीय उर्वरक छिड़काव हेतु सुरक्षित मौसम विश्लेषण।',
      yieldPredictorTitle: 'फसल उपज एवं आय अनुमानक',
      yieldPredictorDesc: 'मंडी भाव के अनुसार संभावित उपज एवं कुल बाजार मूल्यांकन।',
      sampleDiagnosticsTitle: 'इंटरैक्टिव रोग निदान नमूने',
      sampleDiagnosticsDesc: 'पत्ती स्कैन और कीट प्रबंधन उपाय देखने के लिए नमूने पर क्लिक करें:',
      dataBackupTitle: 'डेटा प्रबंधन एवं ऑफलाइन बैकअप',
      exportBackup: 'फार्म डेटा निर्यात करें (JSON)',
      importBackup: 'फार्म डेटा आयात करें (JSON)',
      onlineStatus: 'ऑनलाइन',
      offlineStatus: 'ऑफलाइन तैयार',
      toastDemoLoaded: 'लाइव डेमो खेत सफलतापूर्वक लोड हुआ! 🌱',
      toastBackupExported: 'बैकअप सफलतापूर्वक निर्यात किया गया! 💾',
      toastBackupImported: 'डेटा सफलतापूर्वक पुनर्स्थापित हुआ! 🔄',
      printBriefTitle: 'कार्यकारी खेत सारांश रिपोर्ट',
      soil3DTitle: '3D मृदा संस्तर एवं रिसाव सिम्युलेटर',
      soil3DDesc: 'मृदा परतों, जड़ विकास और नमी रिसने का इंटरैक्टिव 3D आइसोमेट्रिक मॉडल।',
      skyAtmosphereTitle: 'लाइव वायुमंडलीय आकाश एवं पवन प्रवाह',
      satelliteAirQuality: 'उपग्रह वायु गुणवत्ता (Open-Meteo Sentinel)',
      liveDopplerRadar: 'लाइव डॉपलर वर्षा रडार (RainViewer)',
      phenologyMorphologyTitle: '2D फसल वृद्धि एवं वानસ્પतिक चरण विज़ुअलाइज़र'
    }
  },

  // Helper translation function
  t(key, fallback = '') {
    const lang = I18N.currentLang;
    const strMap = I18N.strings[lang] || I18N.strings.en;
    if (strMap && strMap[key] !== undefined) {
      return strMap[key];
    }
    // Fallback to English
    if (I18N.strings.en && I18N.strings.en[key] !== undefined) {
      return I18N.strings.en[key];
    }
    return fallback || key;
  },

  // Set language and update DOM
  setLanguage(langCode) {
    if (!I18N.strings[langCode]) langCode = 'en';
    I18N.currentLang = langCode;
    try {
      localStorage.setItem('farmhub_lang', langCode);
    } catch (e) {}
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = I18N.t(key, el.textContent);
      }
    });

    // Update placeholders with data-i18n-ph attribute
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (key) {
        el.placeholder = I18N.t(key, el.placeholder);
      }
    });

    // Notify application if hook is defined
    if (typeof window.onLanguageChanged === 'function') {
      window.onLanguageChanged(langCode);
    }
  }
};
