// Static, rule-based crop suitability lookup table — no ML/model involved.
// Ranges are approximate agronomic guidelines for common Indian field
// crops (N/P/K in kg/ha, temperature in °C, humidity in %, rainfall in mm
// for the growing season). Yield/profit figures are static per-acre
// estimates for guidance only, not a market forecast.
const CROPS = [
  { name: 'Rice', season: 'Kharif', n: [80, 120], p: [40, 60], k: [40, 60], temperature: [20, 35], humidity: [70, 90], ph: [5.5, 7.5], rainfall: [150, 300], waterRequirement: 'High', expectedYieldPerAcre: '10-12 quintals', expectedProfitPerAcreInr: 22000 },
  { name: 'Wheat', season: 'Rabi', n: [100, 140], p: [50, 70], k: [30, 50], temperature: [10, 25], humidity: [50, 70], ph: [6.0, 7.5], rainfall: [75, 150], waterRequirement: 'Medium', expectedYieldPerAcre: '15-18 quintals', expectedProfitPerAcreInr: 20000 },
  { name: 'Maize', season: 'Kharif', n: [80, 120], p: [40, 60], k: [40, 60], temperature: [18, 32], humidity: [55, 75], ph: [5.5, 7.0], rainfall: [100, 200], waterRequirement: 'Medium', expectedYieldPerAcre: '20-24 quintals', expectedProfitPerAcreInr: 18000 },
  { name: 'Chickpea (Chana)', season: 'Rabi', n: [20, 40], p: [40, 60], k: [15, 25], temperature: [15, 28], humidity: [40, 60], ph: [6.0, 7.5], rainfall: [60, 100], waterRequirement: 'Low', expectedYieldPerAcre: '6-8 quintals', expectedProfitPerAcreInr: 24000 },
  { name: 'Pigeon Pea (Arhar)', season: 'Kharif', n: [15, 30], p: [40, 60], k: [15, 25], temperature: [20, 32], humidity: [50, 70], ph: [5.5, 7.5], rainfall: [90, 150], waterRequirement: 'Low', expectedYieldPerAcre: '5-7 quintals', expectedProfitPerAcreInr: 26000 },
  { name: 'Mung Bean (Moong)', season: 'Kharif/Zaid', n: [15, 25], p: [30, 50], k: [15, 25], temperature: [25, 35], humidity: [50, 70], ph: [6.0, 7.5], rainfall: [60, 100], waterRequirement: 'Low', expectedYieldPerAcre: '3-4 quintals', expectedProfitPerAcreInr: 18000 },
  { name: 'Black Gram (Urad)', season: 'Kharif', n: [15, 25], p: [40, 60], k: [15, 25], temperature: [25, 35], humidity: [55, 75], ph: [6.0, 7.5], rainfall: [70, 110], waterRequirement: 'Low', expectedYieldPerAcre: '3-4 quintals', expectedProfitPerAcreInr: 18000 },
  { name: 'Lentil (Masoor)', season: 'Rabi', n: [20, 35], p: [40, 60], k: [15, 25], temperature: [12, 25], humidity: [40, 60], ph: [6.0, 7.5], rainfall: [50, 90], waterRequirement: 'Low', expectedYieldPerAcre: '5-6 quintals', expectedProfitPerAcreInr: 19000 },
  { name: 'Cotton', season: 'Kharif', n: [100, 140], p: [40, 60], k: [40, 60], temperature: [21, 35], humidity: [50, 70], ph: [5.5, 8.0], rainfall: [60, 120], waterRequirement: 'Medium', expectedYieldPerAcre: '6-8 quintals', expectedProfitPerAcreInr: 30000 },
  { name: 'Sugarcane', season: 'Annual', n: [140, 180], p: [60, 80], k: [60, 100], temperature: [21, 35], humidity: [65, 85], ph: [6.0, 7.5], rainfall: [150, 250], waterRequirement: 'High', expectedYieldPerAcre: '350-400 quintals', expectedProfitPerAcreInr: 45000 },
  { name: 'Groundnut', season: 'Kharif', n: [15, 30], p: [40, 60], k: [30, 50], temperature: [22, 32], humidity: [50, 70], ph: [6.0, 7.0], rainfall: [75, 125], waterRequirement: 'Low', expectedYieldPerAcre: '8-10 quintals', expectedProfitPerAcreInr: 28000 },
  { name: 'Mustard', season: 'Rabi', n: [50, 80], p: [30, 50], k: [20, 40], temperature: [10, 25], humidity: [35, 55], ph: [6.0, 7.5], rainfall: [30, 60], waterRequirement: 'Low', expectedYieldPerAcre: '5-7 quintals', expectedProfitPerAcreInr: 21000 },
  { name: 'Soybean', season: 'Kharif', n: [20, 40], p: [50, 70], k: [30, 50], temperature: [20, 30], humidity: [60, 80], ph: [6.0, 7.5], rainfall: [90, 150], waterRequirement: 'Medium', expectedYieldPerAcre: '8-10 quintals', expectedProfitPerAcreInr: 22000 },
  { name: 'Potato', season: 'Rabi', n: [100, 140], p: [60, 80], k: [100, 140], temperature: [15, 25], humidity: [60, 80], ph: [5.0, 6.5], rainfall: [50, 100], waterRequirement: 'Medium', expectedYieldPerAcre: '80-100 quintals', expectedProfitPerAcreInr: 35000 },
  { name: 'Tomato', season: 'Rabi/Zaid', n: [80, 120], p: [50, 70], k: [80, 120], temperature: [18, 30], humidity: [50, 70], ph: [6.0, 7.0], rainfall: [40, 80], waterRequirement: 'Medium', expectedYieldPerAcre: '150-200 quintals', expectedProfitPerAcreInr: 40000 },
  { name: 'Onion', season: 'Rabi', n: [60, 100], p: [40, 60], k: [40, 60], temperature: [13, 28], humidity: [50, 70], ph: [6.0, 7.5], rainfall: [35, 65], waterRequirement: 'Medium', expectedYieldPerAcre: '100-120 quintals', expectedProfitPerAcreInr: 38000 },
];

module.exports = CROPS;
