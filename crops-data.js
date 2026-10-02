// ============================================================
// FARMHUB — CROP DATA & AGRONOMY KNOWLEDGE BASE
// Covers 20 standard crops across 4 categories + custom crop fallback:
// - FLOWERS: Rose, Marigold, Jasmine, Chrysanthemum, Gerbera
// - FRUITS: Banana, Mango, Grapes, Pomegranate, Papaya
// - VEGETABLES: Tomato, Chilli, Onion, Potato, Brinjal
// - OTHER: Rice, Wheat, Maize, Ragi, Cotton
// ============================================================

// Evidence-based reference data used by the crop-health triage view.
// Results are probable matches, not laboratory or image-model confirmation.
const PLANT_HEALTH_KB = [
  { name: 'Early Blight', type: 'Fungal disease', crops: ['Tomato', 'Potato', 'Brinjal'], cause: 'Alternaria species', symptoms: ['Brown circular leaf spots with concentric rings', 'Yellowing around lesions; older leaves affected first'], conditions: 'Warm, humid weather, long leaf wetness, poor airflow and infected debris', precautions: ['Remove severely infected leaves and crop debris', 'Space plants and avoid unnecessary overhead irrigation'], management: ['Use healthy planting material and rotate crops', 'Improve air circulation; use a crop-specific fungicide only as locally recommended'], tags: ['spots'] },
  { name: 'Late Blight', type: 'Fungal disease', crops: ['Potato', 'Tomato'], cause: 'Phytophthora infestans', symptoms: ['Dark green to brown irregular lesions', 'Rapid leaf deterioration; dark stems and rotting fruits or tubers'], conditions: 'Cool to moderate temperatures, high humidity, rainfall and extended leaf wetness', precautions: ['Remove affected material and improve airflow', 'Monitor frequently during wet weather'], management: ['Use disease-free planting material and rotate crops', 'Use resistant varieties and locally recommended fungicide management'], tags: ['spots', 'wilting'] },
  { name: 'Powdery Mildew', type: 'Fungal disease', crops: ['Rose', 'Grapes', 'Cucumber', 'Tomato', 'Chilli', 'Mango'], cause: 'Several powdery mildew fungi', symptoms: ['White powder-like growth on leaves', 'Yellowing, curling and reduced growth'], conditions: 'Moderate temperatures, high humidity, dense planting and poor airflow', precautions: ['Improve air circulation and remove affected parts where appropriate', 'Monitor new growth'], management: ['Use resistant varieties and maintain sanitation', 'Use suitable biological or chemical management when required'], tags: ['yellow_leaves', 'curling', 'white_growth'] },
  { name: 'Downy Mildew', type: 'Fungal disease', crops: ['Cucumber', 'Grapes', 'Onion'], cause: 'Crop-specific downy mildew pathogens', symptoms: ['Yellow or pale patches above and grey, white or purple growth below leaves', 'Leaf death and reduced growth'], conditions: 'High humidity, rainfall, prolonged leaf wetness and poor ventilation', precautions: ['Avoid prolonged leaf wetness and remove infected debris', 'Improve air circulation'], management: ['Monitor closely during humid weather and use locally approved management'], tags: ['yellow_leaves', 'spots'] },
  { name: 'Anthracnose', type: 'Fungal disease', crops: ['Mango', 'Chilli', 'Beans', 'Grapes'], cause: 'Colletotrichum species', symptoms: ['Dark sunken lesions or brown-black spots on leaves, stems or fruit', 'Fruit rot and premature fruit drop'], conditions: 'Warm humid weather, rainfall, high moisture and infected debris', precautions: ['Remove infected fruit and plant material', 'Maintain sanitation and airflow; avoid excess moisture'], management: ['Use clean planting material and locally recommended disease management'], tags: ['spots'] },
  { name: 'Rust', type: 'Fungal disease', crops: ['Wheat', 'Beans', 'Maize'], cause: 'Rust fungi', symptoms: ['Orange, yellow, brown or red powdery pustules', 'Yellowing and premature leaf ageing'], conditions: 'Moisture, suitable temperatures and extended leaf wetness', precautions: ['Scout regularly and remove infected material where appropriate', 'Use resistant varieties and maintain field hygiene'], management: ['Use locally recommended integrated disease management'], tags: ['yellow_leaves', 'spots'] },
  { name: 'Fusarium Wilt', type: 'Fungal disease', crops: ['Tomato', 'Banana', 'Chilli', 'Cotton', 'Beans'], cause: 'Fusarium species; a soil-borne pathogen', symptoms: ['Yellowing, wilting, stunting and vascular discoloration', 'Plant may eventually die'], conditions: 'Infected soil or material, root injury and warm soil', precautions: ['Use healthy planting material and rotate crops', 'Avoid moving contaminated soil between fields'], management: ['Maintain sanitation and use tolerant varieties where available'], tags: ['yellow_leaves', 'wilting'] },
  { name: 'Bacterial Leaf Spot', type: 'Bacterial disease', crops: ['Tomato', 'Chilli'], cause: 'Bacterial pathogens', symptoms: ['Small dark or water-soaked spots with yellow halos', 'Leaf drop and fruit spotting'], conditions: 'Warm temperatures, humidity, rainfall and splashing water', precautions: ['Use disease-free seed and avoid overhead irrigation', 'Remove infected material and maintain sanitation'], management: ['Use clean seed and locally recommended bacterial disease management'], tags: ['spots', 'yellow_leaves'] },
  { name: 'Bacterial Wilt', type: 'Bacterial disease', crops: ['Tomato', 'Potato', 'Brinjal'], cause: 'Soil-borne bacterial pathogens', symptoms: ['Sudden wilt while leaves may remain green initially', 'Progressive collapse and possible internal stem discoloration'], conditions: 'Warm temperatures, moist soil, infected soil or water and root injury', precautions: ['Use healthy planting material and maintain drainage', 'Rotate crops and avoid moving contaminated soil'], management: ['Remove severely affected plants where appropriate and use integrated management'], tags: ['wilting'] },
  { name: 'Bacterial Blight', type: 'Bacterial disease', crops: ['Rice', 'Beans'], cause: 'Bacterial pathogens', symptoms: ['Water-soaked lesions, yellowing and leaf drying', 'Lesions extend along leaf margins and can reduce yield'], conditions: 'High humidity, rainfall, wind-driven rain and sometimes excess nitrogen', precautions: ['Avoid excess nitrogen and monitor after wind-driven rain'], management: ['Use locally recommended integrated disease management'], tags: ['yellow_leaves', 'spots'] },
  { name: 'Mosaic Virus', type: 'Viral disease', crops: ['Tomato', 'Chilli', 'Cucumber', 'Beans'], cause: 'Crop-specific viruses', symptoms: ['Light and dark green mosaic pattern', 'Leaf distortion, stunting and reduced or deformed fruit'], conditions: 'Can spread through insects, infected material, tools or contact', precautions: ['Control insect vectors and use healthy planting material', 'Remove severely infected plants where appropriate and sanitize tools'], management: ['Manage vectors and use resistant varieties where available'], tags: ['yellow_leaves', 'curling'] },
  { name: 'Leaf Curl Virus', type: 'Viral disease', crops: ['Tomato', 'Chilli'], cause: 'Several viruses; whiteflies are common vectors', symptoms: ['Upward or downward curling, yellowing, stunting and small leaves', 'Reduced fruit production'], conditions: 'Presence of whiteflies and infected plants or seedlings', precautions: ['Monitor vectors, use healthy seedlings and maintain field hygiene', 'Remove heavily infected plants where appropriate'], management: ['Use integrated vector management; do not treat a virus with fungicide'], tags: ['curling', 'yellow_leaves'] },
  { name: 'Aphids', type: 'Insect pest', crops: ['Tomato', 'Chilli', 'Beans', 'Rose', 'Cotton'], cause: 'Sap-sucking aphids; some species transmit viruses', symptoms: ['Leaf curling, distorted shoots, yellowing and sticky honeydew', 'Small insects on leaves and shoots'], conditions: 'Tender new growth and unmanaged weeds can support populations', precautions: ['Scout regularly, conserve natural predators and remove heavily infested parts'], management: ['Use integrated pest management and an approved control only when necessary'], tags: ['curling', 'yellow_leaves'] },
  { name: 'Whiteflies', type: 'Insect pest', crops: ['Tomato', 'Chilli', 'Cotton'], cause: 'Whitefly adults and nymphs; some transmit viruses', symptoms: ['Small white insects under leaves, yellowing, weak growth and honeydew', 'Sooty mould may develop'], conditions: 'Warm weather, weeds and unmanaged vector populations', precautions: ['Monitor leaf undersides, manage weeds and protect beneficial insects'], management: ['Use integrated pest management and appropriate vector control'], tags: ['yellow_leaves', 'curling'] },
  { name: 'Thrips', type: 'Insect pest', crops: ['Chilli', 'Onion', 'Tomato', 'Rose'], cause: 'Thrips feeding on young tissue and flowers', symptoms: ['Silver or bronze patches, distorted or curled young leaves', 'Flower damage'], conditions: 'Hot and relatively dry conditions', precautions: ['Scout new leaves and flowers regularly and conserve beneficial insects'], management: ['Use integrated pest management when populations are damaging'], tags: ['curling', 'spots'] },
  { name: 'Caterpillars', type: 'Insect pest', crops: ['Tomato', 'Chilli', 'Maize', 'Rice'], cause: 'Leaf-feeding caterpillars', symptoms: ['Large holes, eaten leaf edges, defoliation, caterpillars or droppings'], conditions: 'Crop-specific pest flights and unmanaged host plants', precautions: ['Scout regularly and hand-remove when practical', 'Encourage natural predators'], management: ['Use appropriate integrated pest management'], tags: ['chewed'] },
  { name: 'Mites', type: 'Pest', crops: ['Tomato', 'Chilli', 'Rose', 'Beans'], cause: 'Plant-feeding mites', symptoms: ['Fine yellow speckling, bronzing, leaf drying and sometimes webbing'], conditions: 'Hot and dry weather', precautions: ['Monitor leaf undersides and avoid unnecessary broad-spectrum sprays'], management: ['Use integrated pest management and locally suitable controls'], tags: ['yellow_leaves', 'spots'] },
  { name: 'Nitrogen Deficiency', type: 'Nutrient deficiency', crops: [], cause: 'Insufficient available nitrogen or restricted uptake', symptoms: ['General yellowing, usually beginning on older leaves', 'Slow growth and small plants'], conditions: 'Low nutrient availability or restricted root uptake', precautions: ['Check soil and root condition before adding fertilizer'], management: ['Use soil testing and balanced nutrient management'], tags: ['yellow_leaves'] },
  { name: 'Iron Deficiency', type: 'Nutrient deficiency', crops: [], cause: 'High pH, poor availability, root problems or waterlogging', symptoms: ['Interveinal yellowing on younger leaves while veins remain green'], conditions: 'High pH, poor availability, root problems or waterlogging', precautions: ['Check pH, drainage and roots before treating'], management: ['Confirm with soil or tissue testing and correct the underlying cause'], tags: ['yellow_leaves'] },
  { name: 'Potassium Deficiency', type: 'Nutrient deficiency', crops: [], cause: 'Insufficient available potassium', symptoms: ['Yellowing and brown scorching around leaf margins', 'Weak stems and sometimes poor fruit quality'], conditions: 'Low potassium availability or restricted uptake', precautions: ['Test soil and avoid unbalanced fertilizer applications'], management: ['Apply balanced nutrients based on test results'], tags: ['yellow_leaves', 'spots'] },
  { name: 'Magnesium Deficiency', type: 'Nutrient deficiency', crops: [], cause: 'Insufficient available magnesium', symptoms: ['Interveinal yellowing on older leaves with green veins'], conditions: 'Low magnesium availability or nutrient imbalance', precautions: ['Test soil and inspect older leaves before treatment'], management: ['Correct with balanced nutrient management based on testing'], tags: ['yellow_leaves'] },
  { name: 'Overwatering / Root Rot', type: 'Water or root problem', crops: [], cause: 'Excess irrigation, poor drainage or soil-borne pathogens', symptoms: ['Yellowing, wilting despite wet soil, poor growth and soft or discolored roots'], conditions: 'Waterlogged soil and poor drainage', precautions: ['Improve drainage, avoid unnecessary irrigation and check soil moisture'], management: ['Remove severely affected plants where appropriate and use healthy material'], tags: ['yellow_leaves', 'wilting'] },
  { name: 'Underwatering', type: 'Water problem', crops: [], cause: 'Insufficient irrigation or excessive water loss', symptoms: ['Wilting, dry or curling leaves, brown edges and slow growth'], conditions: 'Dry soil, hot weather or high evaporative demand', precautions: ['Monitor soil moisture and maintain appropriate irrigation', 'Mulch where suitable'], management: ['Restore moisture gradually and correct irrigation scheduling'], tags: ['wilting', 'curling'] },
  { name: 'Heat Stress / Sunscald', type: 'Environmental stress', crops: [], cause: 'Extreme heat or excessive direct sunlight', symptoms: ['Wilting, curling, scorching, flower or fruit drop, or pale and brown exposed patches'], conditions: 'High temperature, intense sunlight and inadequate moisture', precautions: ['Maintain soil moisture and provide shade where appropriate'], management: ['Reduce additional stress and avoid unnecessary work during extreme heat'], tags: ['wilting', 'curling', 'spots'] },
  { name: 'Cold Injury', type: 'Environmental stress', crops: [], cause: 'Exposure below the crop tolerance range', symptoms: ['Darkened tissue, wilting, leaf damage and stunted growth'], conditions: 'Cold temperatures or sudden chilling', precautions: ['Protect sensitive crops when cold is forecast'], management: ['Allow damaged tissue to recover and confirm symptoms as temperatures normalize'], tags: ['wilting'] },
  { name: 'Root-Knot Nematodes', type: 'Root and soil problem', crops: ['Tomato', 'Chilli', 'Cucumber'], cause: 'Plant-parasitic nematodes', symptoms: ['Stunting, yellowing, wilting, poor growth and swollen root galls'], conditions: 'Infested soil and repeated susceptible crops', precautions: ['Use healthy planting material and rotate crops'], management: ['Use resistant varieties and integrated nematode management'], tags: ['yellow_leaves', 'wilting'] }
];

const FERTILIZER_GUIDE_DATA = {
  organic: [
    ['Farmyard Manure (FYM)', 'Cattle dung, urine, bedding and farm residues.', 'Adds organic matter and small amounts of N, P and K; improves soil structure, water-holding capacity and microbial activity.', 'Most field and horticultural crops.'],
    ['Compost', 'Decomposed plant residues, kitchen waste and crop residues.', 'Improves structure and moisture retention, adds organic matter and supports beneficial organisms.', 'Vegetables, fruits, field crops and gardens.'],
    ['Vermicompost', 'Organic waste processed with earthworms.', 'Provides nutrients, improves structure and nutrient availability, and enhances microbial activity.', 'Vegetables, fruits, flowers, nurseries and field crops.'],
    ['Green Manure', 'Sunn hemp, dhaincha, sesbania or cowpea incorporated while green.', 'Adds organic matter and, with suitable legumes, nitrogen; improves structure, erosion control and soil biology.', 'Use where a suitable rotation window is available.'],
    ['Poultry Manure', 'Poultry litter and droppings.', 'Relatively nutrient-rich source of N, P and K plus organic matter.', 'Compost or treat before application; fresh material can damage plants.'],
    ['Animal Manure', 'Cow, sheep, goat or horse manure.', 'Adds nutrients and organic matter and improves soil structure.', 'Nutrient content varies with animal, feed, storage and decomposition.'],
    ['Bone Meal', 'Processed animal bones.', 'Phosphorus and calcium source that supports root development.', 'Use where soil testing indicates a phosphorus need.'],
    ['Neem Cake', 'Residue left after neem seed oil extraction.', 'Supplies nutrients, especially nitrogen, adds organic matter and can support soil pest and nematode management.', 'Vegetables, horticultural, plantation and field crops.'],
    ['Oil Cakes', 'Groundnut, mustard, sesame or castor cake.', 'Supply nutrients and organic matter and can improve soil fertility.', 'Base rates on nutrient content and crop requirement.'],
    ['Fish Meal', 'Processed fish and fish-processing by-products.', 'Relatively available organic nitrogen and phosphorus with smaller amounts of other nutrients.', 'Use as a nutrient source according to crop need.'],
    ['Seaweed-Based Fertilizers', 'Seaweed extracts or processed seaweed.', 'Small nutrient quantities and bioactive compounds; useful as a biostimulant.', 'Not a complete fertilizer or automatic replacement for primary nutrients.']
  ],
  mineral: [
    ['Urea', 'Nitrogen; approximately 46% N.', 'Rapidly supplies nitrogen after conversion and supports vegetative and leaf growth.', 'Excess can cause excessive growth, lodging, imbalance and environmental losses.'],
    ['Ammonium Sulphate', 'Nitrogen and sulphur.', 'Useful where both nitrogen and sulphur are required.', 'Choose based on soil test and crop need.'],
    ['Calcium Ammonium Nitrate (CAN)', 'Nitrogen and calcium.', 'Provides nitrogen for field and horticultural crops.', 'Apply according to crop requirement.'],
    ['Single Super Phosphate (SSP)', 'Phosphorus, sulphur and calcium.', 'Supports roots, flowering, reproductive growth and sulphur supply.', 'Use based on soil test.'],
    ['Diammonium Phosphate (DAP)', '18-46-0: nitrogen and phosphorus.', 'Concentrated basal source of nitrogen and phosphorus.', 'Application must match soil test and crop requirement.'],
    ['Monoammonium Phosphate (MAP)', 'Nitrogen and phosphorus.', 'Concentrated phosphorus source used in crops and some fertigation systems.', 'Follow the formulation and local recommendation.'],
    ['Muriate of Potash (MOP)', 'Potassium chloride; approximately 60% K2O.', 'Supports water regulation, plant strength, stress tolerance and quality.', 'Consider chloride sensitivity of the crop.'],
    ['Sulphate of Potash (SOP)', 'Potassium and sulphur.', 'Potassium and sulphur source for chloride-sensitive crops.', 'Select when crop and soil conditions justify it.'],
    ['Compound NPK', 'Examples: 10-26-26, 12-32-16, 15-15-15, 17-17-17, 20-20-20.', 'Provides two or more primary nutrients in a measured grade.', 'The grade is N-P2O5-K2O; match it to the nutrient requirement.']
  ],
  secondary: [
    ['Calcium', 'Lime, gypsum or calcium nitrate.', 'Cell wall development, root development and plant structural strength.'],
    ['Magnesium', 'Magnesium sulphate or dolomite.', 'Chlorophyll component and support for photosynthesis.'],
    ['Sulphur', 'Gypsum, ammonium sulphate, SSP or SOP.', 'Protein synthesis and enzyme activity; important for oilseed crops where limiting.']
  ],
  micronutrients: [
    ['Zinc', 'Zinc sulphate.', 'Enzyme activity, growth regulation and plant development.'],
    ['Iron', 'Ferrous sulphate or iron chelates.', 'Chlorophyll formation, electron transport and metabolism.'],
    ['Boron', 'Borax, boric acid or soluble boron.', 'Reproductive growth, cell walls and pollen development. Apply carefully because the sufficient-to-toxic range is narrow.'],
    ['Other micronutrients', 'Manganese, copper, molybdenum, chlorine and nickel.', 'Required in small quantities; correct confirmed deficiencies using crop and soil guidance.']
  ],
  waterSoluble: ['19-19-19', '13-0-45', '12-61-0', '0-52-34', 'Potassium nitrate', 'Calcium nitrate', 'Magnesium sulphate'],
  biofertilizers: [
    ['Rhizobium', 'Biological nitrogen fixation, mainly associated with legumes.'],
    ['Azotobacter', 'Free-living nitrogen-fixing bacteria used with various crops.'],
    ['Azospirillum', 'Associated with several crops; can support nitrogen fixation and plant growth.'],
    ['Phosphate-solubilizing microorganisms', 'Help make some forms of soil phosphorus more available.'],
    ['Mycorrhiza', 'Root association that can improve phosphorus acquisition and access to water and nutrients.']
  ],
  purposes: [
    ['Vegetative growth', 'Nitrogen', 'Urea, ammonium sulphate, CAN and suitable organic manures.'],
    ['Root development', 'Phosphorus', 'SSP, DAP, MAP or bone meal where testing indicates need.'],
    ['Flowering and fruit development', 'Phosphorus and potassium with adequate nitrogen and micronutrients', 'NPK fertilizers, SSP, MOP, SOP and suitable water-soluble fertilizers.'],
    ['Plant strength and stress management', 'Potassium', 'MOP, SOP or potassium nitrate, considering crop chloride tolerance.'],
    ['Organic soil improvement', 'Organic matter and balanced nutrient supply', 'Compost, FYM, vermicompost, green manure, neem cake and oil cakes.']
  ],
  methods: [
    ['Basal application', 'Before or during planting.', 'Commonly used for phosphorus, potassium, organic manure and some nitrogen.'],
    ['Top dressing', 'After crop establishment.', 'Commonly used for nitrogen and stage-specific requirements.'],
    ['Fertigation', 'Fertilizer delivered through irrigation water.', 'Precise and efficient delivery, especially with drip irrigation.'],
    ['Foliar application', 'Nutrients sprayed directly onto leaves.', 'Useful for some micronutrient deficiencies and supplemental nutrition; concentration and compatibility prevent leaf burn.']
  ]
};

const IRRIGATION_GUIDE_DATA = {
  methods: [
    ['Surface irrigation', 'Flood, basin, border and furrow methods distribute water over the soil surface.', 'Simple and relatively inexpensive, but can have runoff, uneven distribution, waterlogging and higher losses.'],
    ['Flood irrigation', 'Water is applied over a large portion of the field surface.', 'Simple and suitable where water is abundant and land is level; evaporation, runoff and waterlogging risks are higher.'],
    ['Furrow irrigation', 'Water flows through channels between crop rows.', 'Suitable for row crops and vegetables; requires suitable layout and can lose water through runoff or deep percolation.'],
    ['Drip irrigation', 'Emitters deliver water slowly near the root zone.', 'High efficiency, less foliage wetting and suitable for fertigation; needs filtration, maintenance and clog prevention.'],
    ['Sprinkler irrigation', 'Pressurized sprinklers apply water as droplets.', 'Useful on uneven terrain and large areas; wind, evaporation, pressure needs and wet foliage are limitations.'],
    ['Micro-sprinkler irrigation', 'Small localized sprays apply water around plants.', 'Useful for orchards, fruit crops, nurseries and some vegetables.'],
    ['Subsurface drip', 'Buried drip lines deliver water below the soil surface.', 'Reduces surface evaporation and wetting; installation, root intrusion and clogging need careful management.']
  ],
  cropNotes: [
    ['Rice', 'Water need varies with system, soil, climate and stage. Consider Alternate Wetting and Drying where suitable; avoid unnecessary continuous flooding.'],
    ['Wheat', 'Align irrigation with critical growth stages and soil moisture; avoid waterlogging.'],
    ['Maize', 'Water demand changes with climate and stage; flowering and grain development are sensitive periods.'],
    ['Tomato', 'Maintain consistent soil moisture; drip is common, while irregular or excessive watering can harm fruit development.'],
    ['Chilli', 'Avoid prolonged waterlogging and maintain moisture during establishment, flowering and fruiting.'],
    ['Cotton', 'Schedule according to climate, soil moisture and stage; excess water can cause problems.']
  ],
  stages: [
    ['Germination', 'Maintain moderate, consistent moisture.', 'Avoid drying out and waterlogging.'],
    ['Seedling', 'Support the small root system with suitable moisture.', 'Avoid root-zone saturation and excess irrigation.'],
    ['Vegetative', 'Demand generally rises as canopy and roots develop.', 'Consider canopy size, stage, weather and soil moisture.'],
    ['Flowering', 'Maintain appropriate crop-specific moisture.', 'Water stress can affect reproductive development.'],
    ['Fruit development', 'Avoid severe stress and large moisture swings.', 'Adequate water supports fruit size and quality in many crops.'],
    ['Maturity', 'Adjust irrigation according to crop and harvest objective.', 'Do not apply a fixed schedule without crop-specific guidance.']
  ],
  sensors: [
    ['Soil moisture', 'Measures soil water status and can identify when moisture falls below a crop threshold.'],
    ['Temperature', 'Measures soil and air temperature to indicate crop demand and heat stress.'],
    ['Humidity', 'Shows atmospheric demand and conditions that affect evaporation.'],
    ['Rain sensor', 'Detects actual rainfall for scheduling and system protection.'],
    ['Flow sensor', 'Measures delivered water and can reveal leaks or blocked lines.'],
    ['Water-level sensor', 'Tracks water in tanks, reservoirs and borewell storage.']
  ],
  saving: ['Drip irrigation', 'Micro-sprinklers', 'Mulching', 'Rainwater harvesting', 'Irrigation scheduling', 'Soil-moisture monitoring', 'Deficit irrigation where agronomically appropriate', 'Alternate Wetting and Drying for suitable rice systems', 'Improved drainage', 'System maintenance and leak detection', 'Irrigating during suitable low-evaporation periods'],
  mulch: ['Crop residues', 'Straw', 'Dry leaves', 'Compost or organic mulch', 'Suitable plastic mulch']
};

const CROPS_DATA = {
  // Category list
  categories: [
    { id: 'flowers', icon: '🌸', nameKey: 'catFlowers' },
    { id: 'fruits', icon: '🍎', nameKey: 'catFruits' },
    { id: 'vegetables', icon: '🥬', nameKey: 'catVegetables' },
    { id: 'other', icon: '🌾', nameKey: 'catOther' }
  ],

  // Crop catalog with multilingual names and agronomic properties
  crops: {
    // --- FLOWERS ---
    rose: {
      id: 'rose',
      category: 'flowers',
      names: {
        en: 'Rose',
        kn: 'ಗುಲಾಬಿ',
        ta: 'ரோஜா',
        te: 'గులాబీ',
        hi: 'गुलाब'
      },
      kc: 0.85,
      end: [25, 60, 90, 130, 160],
      rootDepth: [15, 30, 45, 60, 60],
      tasks: {
        Seedling: 'Prune weak shoots after planting. Ensure porous well-drained potting mix or raised bed.',
        Vegetative: 'Deadhead faded buds to promote side shoots. Train climbing canes if applicable.',
        Flowering: 'Maintain uniform moisture without wetting petals to avoid black spot and botrytis.',
        Fruiting: 'Nutrient flush with potassium and micro-nutrients to sustain continuous flushes.',
        Harvest: 'Harvest early in the morning when buds are tight at pencil-point stage.'
      },
      fert: {
        Seedling: ['Basal SSP 50g + Neem cake 100g per bush.', 'Well-rotted FYM and bone meal incorporated into planting pit.'],
        Vegetative: ['NPK 19:19:19 (2g/L) foliar spray every 10 days.', 'Liquid mustard cake tea + vermicompost top dressing.'],
        Flowering: ['Potassium nitrate (13:0:45) + Magnesium sulphate 1g/L.', 'Banana peel extract + fermented compost wash.'],
        Fruiting: ['Calcium nitrate + Boron foliar application.', 'Wood ash sprinkle around root zone.'],
        Harvest: ['Rest period; reduce nitrogen.', 'Compost mulching post pruning.']
      },
      pests: ['Red spider mites', 'Aphids', 'Thrips'],
      diseases: ['Black spot (Diplocarpon)', 'Powdery mildew', 'Die-back']
    },

    marigold: {
      id: 'marigold',
      category: 'flowers',
      names: {
        en: 'Marigold',
        kn: 'ಚೆಂಡು ಹೂ',
        ta: 'சாமந்தி / செண்டுமல்லி',
        te: 'బంతి పూలు',
        hi: 'गेंदा'
      },
      kc: 0.75,
      end: [15, 35, 60, 90, 110],
      rootDepth: [15, 25, 40, 50, 50],
      tasks: {
        Seedling: 'Transplant healthy 20-day nursery seedlings in the evening.',
        Vegetative: 'Pinch terminal shoot at 30 days after transplanting to induce prolific branching.',
        Flowering: 'Regular light watering; peak bloom requires steady moisture.',
        Fruiting: 'Pluck mature blossoms every 3–4 days to stimulate secondary flushes.',
        Harvest: 'Pick flowers in early morning with small stalk intact for festival market.'
      },
      fert: {
        Seedling: ['Basal DAP 30kg + MOP 15kg per acre.', 'Vermicompost 2 tonnes/acre during bed preparation.'],
        Vegetative: ['Urea 20kg/acre top dressing at 25 days.', 'Jeevamrutham soil drenching with irrigation.'],
        Flowering: ['Foliar 19:19:19 (5g/L) + micronutrient spray.', 'Panchagavya (3%) foliar spray.'],
        Fruiting: ['SOP (0:0:50) foliar spray for petal vibrancy.', 'Cow dung slurry drenching.'],
        Harvest: ['No chemical fertilizer.', 'Field incorporation post-harvest.']
      },
      pests: ['Heliothis caterpillar', 'Red spider mite'],
      diseases: ['Alternaria leaf spot', 'Collar rot / damping off']
    },

    jasmine: {
      id: 'jasmine',
      category: 'flowers',
      names: {
        en: 'Jasmine',
        kn: 'ಮಲ್ಲಿಗೆ',
        ta: 'மல்லிகை',
        te: 'మల్లెపూలు',
        hi: 'चमेली / मोगरा'
      },
      kc: 0.8,
      end: [30, 75, 120, 180, 240],
      rootDepth: [20, 40, 60, 80, 80],
      tasks: {
        Seedling: 'Plant rooted cuttings in 45x45 cm pits enriched with organic compost.',
        Vegetative: 'Annual pruning in late winter is essential for fresh flowering shoots.',
        Flowering: 'Withhold water for 10 days before pruning, then irrigate copiously to trigger synchronous blooming.',
        Fruiting: 'Keep root zones weed-free and mulched.',
        Harvest: 'Pick unopened mature white flower buds at dawn (05:00–07:30) for highest essential oil aroma.'
      },
      fert: {
        Seedling: ['Basal 10:26:26 (60g/plant) + zinc sulphate.', 'FYM 10 kg/bush.'],
        Vegetative: ['Urea split application post pruning.', 'Vermicompost + neem cake blend.'],
        Flowering: ['Foliar micronutrient mixture (Zn, B, Fe) to intensify fragrance.', 'Panchagavya + fermented curd spray.'],
        Fruiting: ['MOP (potash) for bud firmness and shelf life.', 'Wood ash broadcast.'],
        Harvest: ['Post-harvest compost incorporation.', 'Mulching.']
      },
      pests: ['Bud worm (Hendecasis)', 'Blossom midge'],
      diseases: ['Cercospora leaf spot', 'Rust']
    },

    chrysanthemum: {
      id: 'chrysanthemum',
      category: 'flowers',
      names: {
        en: 'Chrysanthemum',
        kn: 'ಸೇವಂತಿಗೆ',
        ta: 'செவ்வந்தி',
        te: 'చామంతి',
        hi: 'गुलदाउदी / सेवंती'
      },
      kc: 0.8,
      end: [20, 45, 75, 110, 135],
      rootDepth: [15, 30, 45, 60, 60],
      tasks: {
        Seedling: 'Plant disease-free suckers or terminal cuttings in raised beds.',
        Vegetative: 'Pinch at 4 weeks. Stake tall varieties to avoid wind lodging.',
        Flowering: 'Disbudding: remove auxiliary buds if growing large exhibition blooms.',
        Fruiting: 'Support heavy bloom heads; avoid excess overhead sprinkler watering.',
        Harvest: 'Cut stems when outer ray florets have opened fully.'
      },
      fert: {
        Seedling: ['Basal DAP 40kg + MOP 25kg/acre.', 'Compost 3 tonnes/acre.'],
        Vegetative: ['Top dress nitrogen at 30 and 45 days.', 'Jeevamrutham spray.'],
        Flowering: ['NPK 13:0:45 foliar feed to boost flower count.', 'Vermiwash (5%) spray.'],
        Fruiting: ['Micronutrient spray with Boron.', 'Bio-potash drench.'],
        Harvest: ['Cease fertilizer.', 'Compost addition.']
      },
      pests: ['Aphids', 'Thrips', 'Leaf miner'],
      diseases: ['Septoria leaf spot', 'Ray blight']
    },

    gerbera: {
      id: 'gerbera',
      category: 'flowers',
      names: {
        en: 'Gerbera',
        kn: 'ಜರ್ಬೆರಾ',
        ta: 'ஜெர்பரா',
        te: 'జెర్బెరా',
        hi: 'जरबेरा'
      },
      kc: 0.9,
      end: [25, 60, 95, 140, 180],
      rootDepth: [15, 25, 35, 45, 45],
      tasks: {
        Seedling: 'Crown of the plant must remain 1 cm above soil line to prevent crown rot.',
        Vegetative: 'Maintain raised beds with high organic matter and sand for free drainage.',
        Flowering: 'Continuous harvest of flower scapes at heel without cutting.',
        Fruiting: 'Remove old yellow leaves periodically to allow air circulation.',
        Harvest: 'Pluck stems when two outer rows of disc florets are perpendicular to stem.'
      },
      fert: {
        Seedling: ['Fertigation with 19:19:19 (1g/L) + Magnesium sulphate.', 'Coco-peat + vermicompost bed.'],
        Vegetative: ['Alternate Calcium nitrate and Potassium nitrate fertigation.', 'Seaweed extract spray.'],
        Flowering: ['0:52:34 (MKP) + 13:0:45 for strong, straight flower stems.', 'Fermented fish amino acid.'],
        Fruiting: ['Trace elements (Iron chelate Fe-EDDHA is vital for pH &gt; 6.5).', 'Humic acid drench.'],
        Harvest: ['Maintain balanced EC 1.2-1.5 mS/cm.', 'Regular flush.']
      },
      pests: ['Whitefly', 'Thrips', 'Cyclamen mites'],
      diseases: ['Phytophthora crown rot', 'Powdery mildew']
    },

    // --- FRUITS ---
    banana: {
      id: 'banana',
      category: 'fruits',
      names: {
        en: 'Banana',
        kn: 'ಬಾಳೆ',
        ta: 'வாழை',
        te: 'అరటి',
        hi: 'केला'
      },
      kc: 1.1,
      end: [45, 120, 210, 300, 360],
      rootDepth: [20, 45, 75, 90, 90],
      tasks: {
        Seedling: 'Plant sword suckers or tissue culture plantlets in 60cm pits.',
        Vegetative: 'De-suckering: prune extra suckers until flowering, retaining only one follower.',
        Flowering: 'Bunch emergence (shooting): remove male bud (denavelling) to boost finger weight.',
        Fruiting: 'Prop bunches with bamboo or nylon poles to prevent pseudo-stem breakage.',
        Harvest: 'Harvest bunches when ridges on fruit round out (3/4th maturity).'
      },
      fert: {
        Seedling: ['Basal DAP 100g + MOP 100g + Neem cake 500g per pit.', 'FYM 15 kg/pit.'],
        Vegetative: ['Urea 150g + Potash 150g per plant split every 60 days.', 'Jeevamrutham canal drench.'],
        Flowering: ['Heavy potash application (200g MOP/plant) is crucial at shooting.', 'Panchagavya (3%) spray on bunch.'],
        Fruiting: ['Foliar spray of 0:0:50 (1%) on emerging bunch.', 'Compost mulch around pseudo-stem.'],
        Harvest: ['Cease chemical applications.', 'Chop pseudo-stem as organic mulch.']
      },
      pests: ['Pseudostem borer (Odoiporus)', 'Banana aphid (Pentalonia)'],
      diseases: ['Panama wilt (Fusarium)', 'Sigatoka leaf spot', 'Bunchy top virus']
    },

    mango: {
      id: 'mango',
      category: 'fruits',
      names: {
        en: 'Mango',
        kn: 'ಮಾವಿನ ಹಣ್ಣು',
        ta: 'மாம்பழம்',
        te: 'మామిడి',
        hi: 'आम'
      },
      kc: 0.7,
      end: [40, 90, 140, 200, 240],
      rootDepth: [30, 60, 100, 150, 150],
      tasks: {
        Seedling: 'Protect young grafts from scorching winds; paint trunk with bordeaux paste.',
        Vegetative: 'Canopy pruning post-harvest (center opening) ensures sunlight penetration.',
        Flowering: 'Stop irrigation 2 months prior to flowering to induce flower bud differentiation.',
        Fruiting: 'Resume light irrigation during marble stage to minimize fruit drop.',
        Harvest: 'Harvest with 8-10 mm pedicel using clean harvest nets to avoid latex burn.'
      },
      fert: {
        Seedling: ['FYM 25 kg + SSP 500g per tree basin.', 'Vermicompost 5 kg.'],
        Vegetative: ['Post-harvest NPK 1000g:500g:1000g per adult tree.', 'Green manure grown in basins.'],
        Flowering: ['Foliar 13:0:45 (10g/L) + Boron (1g/L) at panicle emergence.', 'Cow urine spray.'],
        Fruiting: ['Foliar Potassium schoenite or SOP at pea and marble size stages.', 'Mulching with dry leaves.'],
        Harvest: ['No pre-harvest chemicals.', 'Tree basin cleanup.']
      },
      pests: ['Mango hopper (Idioscopus)', 'Fruit fly (Bactrocera)', 'Stem borer'],
      diseases: ['Powdery mildew (Oidium)', 'Anthracnose', 'Die-back']
    },

    grapes: {
      id: 'grapes',
      category: 'fruits',
      names: {
        en: 'Grapes',
        kn: 'ದ್ರಾಕ್ಷಿ',
        ta: 'திராட்சை',
        te: 'ద్రాక్ష',
        hi: 'अंगूर'
      },
      kc: 0.85,
      end: [30, 70, 105, 140, 160],
      rootDepth: [20, 50, 80, 100, 100],
      tasks: {
        Seedling: 'Train on bower or Y-trellis system with strict cordon spacing.',
        Vegetative: 'Foundation pruning in April; Forward (fruiting) pruning in October.',
        Flowering: 'Dip flower clusters in GA3 (Gibberellic acid) solution for berry elongation and bunch loosening.',
        Fruiting: 'Canopy thinning to expose berries to gentle morning light; berry thinning.',
        Harvest: 'Pick sweet mature bunches early morning when TSS exceeds 18° Brix.'
      },
      fert: {
        Seedling: ['Basal DAP + MOP + zinc sulphate.', 'FYM 20 tonnes/acre.'],
        Vegetative: ['High nitrogen post foundation pruning.', 'Jeevamrutham with drip.'],
        Flowering: ['Phosphorus and Boron spray at pre-bloom stage.', 'Panchagavya (3%).'],
        Fruiting: ['Potassium sulphate (0:0:50) fertigation for berry sizing and sugar accumulation.', 'Wood ash.'],
        Harvest: ['Taper off irrigation 10 days before picking.', 'Rest phase.']
      },
      pests: ['Flea beetle', 'Thrips', 'Mealybug'],
      diseases: ['Downy mildew (Plasmopara)', 'Powdery mildew (Uncinula)', 'Anthracnose']
    },

    pomegranate: {
      id: 'pomegranate',
      category: 'fruits',
      names: {
        en: 'Pomegranate',
        kn: 'ದಾಳಿಂಬೆ',
        ta: 'மாதுளை',
        te: 'దానిమ్మ',
        hi: 'अनार'
      },
      kc: 0.75,
      end: [35, 75, 115, 160, 190],
      rootDepth: [20, 45, 75, 90, 90],
      tasks: {
        Seedling: 'Plant air-layered (guttee) saplings; train to 3-4 multi-stem framework.',
        Vegetative: 'Bahar treatment: withhold irrigation for 45 days to induce dormancy before desired flush (Mrig, Hasta, Ambe).',
        Flowering: 'Light initial watering after rest, followed by balanced fertigation.',
        Fruiting: 'Bagging individual fruits with non-woven bags protects from butterfly and sunburn.',
        Harvest: 'Tap fruit — a metallic sound indicates full internal aril maturity and sugar.'
      },
      fert: {
        Seedling: ['Basal 10:26:26 (100g/plant) + Micronutrient mix.', 'FYM 10 kg/plant.'],
        Vegetative: ['Urea and DAP top-dress after pruning.', 'Vermicompost + Trichoderma.'],
        Flowering: ['Foliar spray of 0:52:34 + Boron at flower bud emergence.', 'Panchagavya.'],
        Fruiting: ['Calcium nitrate (5g/L) spray prevents fruit rind cracking.', 'Potash fertigation.'],
        Harvest: ['Withhold water 7 days prior to picking.', 'Clean orchard hygiene.']
      },
      pests: ['Anar butterfly (Deudorix)', 'Thrips', 'Shot hole borer'],
      diseases: ['Bacterial blight (Telya / Xanthomonas)', 'Anthracnose', 'Cercospora spot']
    },

    papaya: {
      id: 'papaya',
      category: 'fruits',
      names: {
        en: 'Papaya',
        kn: 'ಪಪ್ಪಾಯಿ',
        ta: 'பப்பாளி',
        te: 'బొప్పాయి',
        hi: 'पपीता'
      },
      kc: 0.9,
      end: [25, 70, 120, 180, 240],
      rootDepth: [15, 30, 50, 60, 60],
      tasks: {
        Seedling: 'Plant 45-day seedlings on raised beds. STRICTLY avoid collar water stagnation.',
        Vegetative: 'Remove side shoots (lateral buds) along the single trunk continuously.',
        Flowering: 'Identify sex at flowering (cull excess males in dioecious; retain gynodioecious).',
        Fruiting: 'Thin overlapping fruits to allow uniform enlargement and aeration.',
        Harvest: 'Pick when fruit skin shows yellow-orange streaks at blossom end.'
      },
      fert: {
        Seedling: ['Basal SSP 100g + MOP 50g per pit.', 'FYM 5 kg + Neem cake 250g.'],
        Vegetative: ['Monthly application of 50g Urea + 50g DAP + 50g MOP per plant.', 'Jeevamrutham drench.'],
        Flowering: ['Micronutrient spray with Boron (prevents bumpy fruit deformity).', 'Panchagavya (3%).'],
        Fruiting: ['Increase potash (100g MOP/plant) monthly for flesh sweetness.', 'Wood ash ring.'],
        Harvest: ['Maintain light irrigation.', 'Post harvest clearing.']
      },
      pests: ['Papaya mealybug (Paracoccus)', 'Aphids (virus vector)', 'Red spider mites'],
      diseases: ['Papaya ring spot virus (PRSV)', 'Foot rot / collar rot (Pythium)']
    },

    // --- VEGETABLES ---
    tomato: {
      id: 'tomato',
      category: 'vegetables',
      names: {
        en: 'Tomato',
        kn: 'ಟೊಮ್ಯಾಟೊ',
        ta: 'தக்காளி',
        te: 'టమాటా',
        hi: 'टमाटर'
      },
      kc: 1.0,
      end: [20, 40, 60, 100, 130],
      rootDepth: [15, 30, 50, 70, 70],
      tasks: {
        Seedling: 'Light, frequent watering; shade nursery; fill gaps within 7 days.',
        Vegetative: 'Stake with trellis wire, pinch lower suckers, earth up ridges.',
        Flowering: 'CRITICAL moisture window: stress now triggers flower abortion and blossom-end rot.',
        Fruiting: 'Regular drip irrigation, potash boost, remove split or blighted fruits.',
        Harvest: 'Pick at breaker/pink stage for market; ease off watering 2 days prior.'
      },
      fert: {
        Seedling: ['Basal DAP 50kg + MOP 30kg/acre.', 'Compost 3 tonnes/acre.'],
        Vegetative: ['Urea in 2 split top dressings at 25 and 40 days.', 'Jeevamrutham every 14 days.'],
        Flowering: ['19:19:19 balanced fertigation + Calcium nitrate 0.5% foliar.', 'Wood ash + banana brew.'],
        Fruiting: ['0:0:50 SOP for firm fruit walls and lycopene color.', 'Seaweed extract.'],
        Harvest: ['Cease chemical nitrogen.', 'Green manure sowing.']
      },
      pests: ['Fruit borer (Helicoverpa)', 'Tuta absoluta (leafminer)', 'Whiteflies'],
      diseases: ['Early blight (Alternaria)', 'Late blight (Phytophthora)', 'Tomato leaf curl virus']
    },

    chilli: {
      id: 'chilli',
      category: 'vegetables',
      names: {
        en: 'Chilli',
        kn: 'ಮೆಣಸಿನಕಾಯಿ',
        ta: 'மிளகாய்',
        te: 'మిరపకాయ',
        hi: 'मिर्च'
      },
      kc: 0.9,
      end: [20, 45, 65, 110, 150],
      rootDepth: [15, 35, 60, 80, 80],
      tasks: {
        Seedling: 'Protect nursery from damping-off; maintain friable soil moisture.',
        Vegetative: 'Intercultivate and weed. Pinch top shoot at 30 days to induce branching.',
        Flowering: 'Prevent waterlogging which causes immediate flower drop.',
        Fruiting: 'Light frequent irrigation. Scout for thrips, mites, and fruit rot (anthracnose).',
        Harvest: 'Pick mature green chillies or allow uniform red ripening for dry chilli.'
      },
      fert: {
        Seedling: ['Basal NPK 20:20:0 plus zinc sulphate.', 'FYM 4 tonnes/acre.'],
        Vegetative: ['Top dress nitrogen at 30 and 50 days.', 'Panchagavya (3%) foliar spray.'],
        Flowering: ['Foliar NAA (10 ppm) to prevent flower shed; apply potash.', 'Fermented buttermilk spray.'],
        Fruiting: ['MOP side-dressing for pungency and skin shine.', 'Neem cake + compost.'],
        Harvest: ['No fertilizer needed.', 'Residue incorporation.']
      },
      pests: ['Chilli thrips (Scirtothrips)', 'Yellow mite (Polyphagotarsonemus)'],
      diseases: ['Anthracnose / die-back (Colletotrichum)', 'Chilli leaf curl virus']
    },

    onion: {
      id: 'onion',
      category: 'vegetables',
      names: {
        en: 'Onion',
        kn: 'ಈರುಳ್ಳಿ',
        ta: 'வெங்காயம்',
        te: 'ఉల్లిపాయ',
        hi: 'प्याज'
      },
      kc: 0.8,
      end: [20, 50, 75, 110, 130],
      rootDepth: [10, 20, 30, 40, 40],
      tasks: {
        Seedling: 'Transplant 6-8 week healthy nursery seedlings on raised broad beds.',
        Vegetative: 'Shallow frequent weedings; shallow fibrous root system cannot compete.',
        Flowering: 'Bulb initiation: maintain consistent, shallow irrigation cycles.',
        Fruiting: 'Bulb enlargement: avoid moisture fluctuations which cause split or twin bulbs.',
        Harvest: 'Stop watering 12-15 days before harvest when 50% tops fall over (neck break).'
      },
      fert: {
        Seedling: ['Basal NPK 12:32:16 + Sulphur 15 kg/acre (essential for pungency).', 'Compost 4 tonnes/acre.'],
        Vegetative: ['Split Urea at 30 and 45 days after transplanting.', 'Jeevamrutham drench.'],
        Flowering: ['Potash (MOP/SOP) top-dressing at bulb initiation (60 days).', 'Wood ash broadcast.'],
        Fruiting: ['Foliar 0:52:34 for bulb sizing and storage quality.', 'Panchagavya (3%).'],
        Harvest: ['Strictly no nitrogen or water near maturity.', 'Field curing under shade.']
      },
      pests: ['Onion thrips (Thrips tabaci)', 'Head borer'],
      diseases: ['Purple blotch (Alternaria porri)', 'Stemphylium blight', 'Basal rot']
    },

    potato: {
      id: 'potato',
      category: 'vegetables',
      names: {
        en: 'Potato',
        kn: 'ಆಲೂಗಡ್ಡೆ',
        ta: 'உருளைக்கிழங்கு',
        te: 'బంగాళాదుంప',
        hi: 'आलू'
      },
      kc: 0.85,
      end: [20, 45, 70, 95, 115],
      rootDepth: [15, 30, 45, 60, 60],
      tasks: {
        Seedling: 'Plant certified, sprouted seed tubers in well-pulverized furrows.',
        Vegetative: 'Earthing up at 30 days is mandatory to keep tubers covered from greening in sunlight.',
        Flowering: 'Tuber initiation: keep soil moisture uniform. Scout for Late Blight.',
        Fruiting: 'Tuber bulking: critical moisture window. Uneven watering causes cracking.',
        Harvest: 'Dehaulm (cut tops) 10 days before digging to cure tuber skin.'
      },
      fert: {
        Seedling: ['Basal 10:26:26 or DAP 80kg + MOP 40kg/acre.', 'Vermicompost 3 tonnes/acre.'],
        Vegetative: ['Top dress nitrogen just before earthing up at 30 days.', 'Jeevamrutham spray.'],
        Flowering: ['Potassium Schoenite or SOP for starch accumulation and tuber size.', 'Fermented cow urine spray.'],
        Fruiting: ['Foliar 0:0:50 for skin setting and weight.', 'Seaweed extract.'],
        Harvest: ['Stop watering 12 days before digging.', 'Crop rotation.']
      },
      pests: ['Potato tuber moth', 'Aphids', 'Cutworms'],
      diseases: ['Late blight (Phytophthora)', 'Early blight', 'Black scurf']
    },

    brinjal: {
      id: 'brinjal',
      category: 'vegetables',
      names: {
        en: 'Brinjal (Eggplant)',
        kn: 'ಬದನೆಕಾಯಿ',
        ta: 'கத்தரிக்காய்',
        te: 'వంకాయ',
        hi: 'बैंगन'
      },
      kc: 0.9,
      end: [25, 55, 80, 120, 150],
      rootDepth: [15, 35, 60, 75, 75],
      tasks: {
        Seedling: 'Transplant 30-day seedlings with protective neem cake in root zone.',
        Vegetative: 'Prune dead shoots and weed frequently; stake heavy fruiting varieties.',
        Flowering: 'Keep soil moist; water deficit induces flower dropping.',
        Fruiting: 'Scout regularly for shoot & fruit borer wilted tips; clip and destroy affected shoots.',
        Harvest: 'Harvest tender, glossy fruits before seeds harden and turn brown.'
      },
      fert: {
        Seedling: ['Basal DAP 40kg + MOP 25kg + Zinc 5kg/acre.', 'FYM 4 tonnes/acre.'],
        Vegetative: ['Split Urea top dressings at 30, 45, and 60 days.', 'Jeevamrutham spray.'],
        Flowering: ['19:19:19 + Boron foliar spray for good fruit set.', 'Panchagavya (3%).'],
        Fruiting: ['MOP side-dressing for fruit shine and firmness.', 'Compost mulch.'],
        Harvest: ['No chemical fertilizer.', 'Green manure.']
      },
      pests: ['Shoot and fruit borer (Leucinodes)', 'Epilachna beetle', 'Whiteflies'],
      diseases: ['Little leaf of brinjal (phytoplasma)', 'Bacterial wilt (Ralstonia)', 'Phomopsis blight']
    },

    // --- OTHER (CEREALS, GRAINS, CASH CROPS) ---
    rice: {
      id: 'rice',
      category: 'other',
      names: {
        en: 'Rice (Paddy)',
        kn: 'ಭತ್ತ / ಅಕ್ಕಿ',
        ta: 'நெல்',
        te: 'వరి / వడ్లు',
        hi: 'धान / चावल'
      },
      kc: 1.15,
      end: [25, 55, 80, 115, 140],
      rootDepth: [10, 20, 35, 45, 45],
      tasks: {
        Seedling: 'Maintain shallow 2 cm water layer in nursery. Treat against blast.',
        Vegetative: 'Active tillering: Alternate Wetting and Drying (AWD) saves 30% water without yield loss.',
        Flowering: 'Panicle initiation to flowering: maintain 3-5 cm standing water layer.',
        Fruiting: 'Grain filling: keep soil saturated. Scout for brown planthopper (BPH) at plant base.',
        Harvest: 'Drain field 10 days before harvest to hasten ripening and facilitate combine harvesting.'
      },
      fert: {
        Seedling: ['Basal DAP 50kg + MOP 20kg + Zinc Sulphate 10kg/acre.', 'Sesbania green manure incorporation.'],
        Vegetative: ['Urea in 2 splits (active tillering and panicle initiation).', 'Azolla bio-fertilizer.'],
        Flowering: ['Foliar 13:0:45 (1%) at boot leaf stage.', 'Jeevamrutham in canal water.'],
        Fruiting: ['Foliar 0:52:34 for dense, filled panicles.', 'Neem oil spray.'],
        Harvest: ['No fertilizer.', 'Straw incorporation with decomposer.']
      },
      pests: ['Yellow stem borer (Scirpophaga)', 'Brown planthopper (Nilaparvata)', 'Leaf folder'],
      diseases: ['Blast (Magnaporthe)', 'Bacterial leaf blight (Xanthomonas)', 'Sheath blight']
    },

    wheat: {
      id: 'wheat',
      category: 'other',
      names: {
        en: 'Wheat',
        kn: 'ಗೋಧಿ',
        ta: 'கோதுமை',
        te: 'గోధుమ',
        hi: 'गेहूं'
      },
      kc: 0.85,
      end: [20, 50, 75, 110, 135],
      rootDepth: [15, 40, 70, 90, 90],
      tasks: {
        Seedling: 'Crown Root Initiation (CRI) at 21 days is the most crucial irrigation window.',
        Vegetative: 'Jointing stage: inter-row weeding and second irrigation.',
        Flowering: 'Booting and heading stage: protect from sudden temperature rise (terminal heat).',
        Fruiting: 'Milking/dough stage: light irrigation to prevent grain shriveling in hot dry winds.',
        Harvest: 'Harvest when straw turns golden yellow and grain cracks sharply between teeth.'
      },
      fert: {
        Seedling: ['Basal 50kg DAP + 30kg MOP + 10kg Zinc Sulphate per acre.', 'FYM 4 tonnes/acre.'],
        Vegetative: ['Top dress Urea at 1st irrigation (CRI stage) and 2nd irrigation.', 'Vermicompost + Azotobacter.'],
        Flowering: ['Foliar spray of 1% Potassium Nitrate (13:0:45) to combat heat stress.', 'Panchagavya.'],
        Fruiting: ['No chemical nitrogen. Micronutrient spray (Boron 0.2%) if grain set is poor.', 'Bio-potash.'],
        Harvest: ['Stop fertilizing.', 'Straw residue management.']
      },
      pests: ['Aphids (Macrosiphum)', 'Termites'],
      diseases: ['Yellow rust (Puccinia striiformis)', 'Brown rust', 'Karnal bunt']
    },

    maize: {
      id: 'maize',
      category: 'other',
      names: {
        en: 'Maize (Corn)',
        kn: 'ಮೆಕ್ಕೆಜೋಳ',
        ta: 'மக்காச்சோளம்',
        te: 'మొక్కజొన్న',
        hi: 'मक्का'
      },
      kc: 0.7,
      end: [15, 45, 65, 100, 120],
      rootDepth: [20, 50, 80, 100, 100],
      tasks: {
        Seedling: 'Check seed emergence. Scout immediately for Fall Armyworm (FAW) whorl damage.',
        Vegetative: 'Knee-high stage: apply second split of nitrogen, earth up rows to brace roots.',
        Flowering: 'Tasseling and silking: CRITICAL water stress stage. Never let soil dry out.',
        Fruiting: 'Grain filling / milk stage: maintain consistent soil moisture for plump kernels.',
        Harvest: 'Cob sheath turns pale brown/dry. Harvest at 15-20% grain moisture.'
      },
      fert: {
        Seedling: ['Basal 50% N, 100% P and K at sowing (NPK 12:32:16).', 'Compost 4 tonnes/acre + Azospirillum.'],
        Vegetative: ['Top-dress 25% Nitrogen at knee-high stage (30-35 days).', 'Jeevamrutham soil drench.'],
        Flowering: ['Remaining 25% Nitrogen at tasseling stage.', 'Vermiwash (5%) foliar spray.'],
        Fruiting: ['Potash top-dress if soils are sandy/deficient.', 'Neem cake band.'],
        Harvest: ['Stop fertilization.', 'Chop stalks into field.']
      },
      pests: ['Fall Armyworm (Spodoptera frugiperda)', 'Stem borer (Chilo partellus)'],
      diseases: ['Maydis leaf blight', 'Turcicum leaf blight', 'Banded leaf and sheath blight']
    },

    ragi: {
      id: 'ragi',
      category: 'other',
      names: {
        en: 'Ragi (Finger Millet)',
        kn: 'ರಾಗಿ',
        ta: 'கேழ்வரகு / ராகி',
        te: 'రాగులు',
        hi: 'रागी / मडुआ'
      },
      kc: 0.5,
      end: [20, 50, 70, 100, 120],
      rootDepth: [15, 30, 50, 70, 70],
      tasks: {
        Seedling: 'Gap filling and thinning at 10-14 days. Weeding is critical early.',
        Vegetative: 'Tillering stage: loosen soil with rotary weeder; ensure good soil aeration.',
        Flowering: 'Earhead emergence: ensure light irrigation if dry spell exceeds 10 days.',
        Fruiting: 'Dough stage: monitor for blast disease on neck and finger.',
        Harvest: 'Harvest when earheads turn brown. Dry thoroughly on threshing floor.'
      },
      fert: {
        Seedling: ['Basal DAP 40kg + MOP 20kg per acre.', 'FYM 3-4 tonnes/acre.'],
        Vegetative: ['Urea top dressing 25kg/acre at 25-30 days.', 'Jeevamrutham spray.'],
        Flowering: ['Micronutrient mixture if leaves show chlorosis.', 'Panchagavya (3%).'],
        Fruiting: ['No chemical fertilizer required.', 'Compost dust around roots.'],
        Harvest: ['Cease all nutrient inputs.', 'Incorporate stubble.']
      },
      pests: ['Stem borer', 'Earhead caterpillar'],
      diseases: ['Finger & neck blast (Pyricularia)', 'Foot rot']
    },

    cotton: {
      id: 'cotton',
      category: 'other',
      names: {
        en: 'Cotton',
        kn: 'ಹತ್ತಿ',
        ta: 'பருத்தி',
        te: 'పత్తి',
        hi: 'कपास'
      },
      kc: 0.95,
      end: [25, 60, 95, 140, 175],
      rootDepth: [20, 50, 90, 120, 120],
      tasks: {
        Seedling: 'Thin to 1 plant per hill at 15 days. Watch for sucking pests (jassids/aphids).',
        Vegetative: 'Square formation: hoeing and earthing up to prevent lodging.',
        Flowering: 'Peak bloom: avoid moisture stress which triggers shed of squares and flowers.',
        Fruiting: 'Boll development: maintain uniform moisture. Scout for pink bollworm.',
        Harvest: 'Pick mature open bolls in clean dry weather; avoid trash and bracts.'
      },
      fert: {
        Seedling: ['Basal NPK 20:20:0:13 (Sulphur) + Magnesium Sulphate.', 'Sheep/goat manure 3 tonnes/acre.'],
        Vegetative: ['Nitrogen top dressing in 3 splits at 30, 60, and 90 days.', 'Jeevamrutham with drip.'],
        Flowering: ['Foliar 2% DAP or 1% 13:0:45 + Boron to prevent square shedding.', 'Fermented sour buttermilk.'],
        Fruiting: ['SOP (0:0:50) foliar spray for boll weight and fiber strength.', 'Vermiwash at boll setting.'],
        Harvest: ['Stop watering before final pickings.', 'Stalk shredding.']
      },
      pests: ['Pink bollworm (Pectinophora)', 'Whitefly', 'Jassids'],
      diseases: ['Bacterial blight (Xanthomonas)', 'Fusarium wilt', 'Leaf curl virus']
    }
  },

  // Retrieve crop definition by ID (handles standard crops + custom crops gracefully)
  getCrop(cropId, customCropName = '') {
    const key = String(cropId || '').toLowerCase().trim();
    if (CROPS_DATA.crops[key]) {
      return CROPS_DATA.crops[key];
    }

    // Custom Crop Fallback Template (e.g. Cucumber, Mustard, Sunflower)
    const displayName = customCropName || cropId || 'Custom Crop';
    return {
      id: key || 'custom',
      category: 'other',
      isCustomCrop: true,
      names: {
        en: displayName,
        kn: displayName,
        ta: displayName,
        te: displayName,
        hi: displayName
      },
      kc: 0.8,
      end: [20, 45, 70, 105, 130],
      rootDepth: [15, 30, 50, 70, 70],
      tasks: {
        Seedling: 'Light, frequent watering; keep nursery or seed bed moist and weed-free.',
        Vegetative: 'Intercultivate and weed. Provide structural support if climbing or tall.',
        Flowering: 'Maintain uniform soil moisture. Avoid water stress during pollination.',
        Fruiting: 'Regular balanced irrigation; apply potassium support for fruit development.',
        Harvest: 'Harvest at peak maturity in cool early morning hours.'
      },
      fert: {
        Seedling: ['Basal balanced NPK (e.g. 19:19:19 or DAP) guided by soil test.', 'Well-rotted farmyard manure 3 tonnes/acre.'],
        Vegetative: ['Split nitrogen application during active vegetative growth.', 'Jeevamrutham or vermicompost top dressing.'],
        Flowering: ['Balanced NPK with micronutrients (Boron and Zinc).', 'Panchagavya (3%) foliar spray.'],
        Fruiting: ['Potash-rich fertilizer for produce sizing and weight.', 'Wood ash side-dressing.'],
        Harvest: ['Cease fertilizer application prior to final picking.', 'Post-harvest organic incorporation.']
      },
      pests: ['Sucking pests (aphids, thrips)', 'Caterpillars'],
      diseases: ['Leaf spots', 'Powdery mildew', 'Root rot']
    };
  },

  // Get crops by category
  getByCategory(catId) {
    return Object.values(CROPS_DATA.crops).filter(c => c.category === catId);
  },

  // Get localized display name for a crop
  getDisplayName(cropObj, lang = 'en') {
    if (!cropObj) return 'Crop';
    if (cropObj.names && cropObj.names[lang]) {
      return cropObj.names[lang];
    }
    if (cropObj.names && cropObj.names.en) {
      return cropObj.names.en;
    }
    return cropObj.cropName || cropObj.id || 'Crop';
  }
};
