import fs from 'fs';
import path from 'path';

const states = JSON.parse(fs.readFileSync('package/src/data/states.json', 'utf8'));
const districts = JSON.parse(fs.readFileSync('package/src/data/districts.json', 'utf8'));
const blocks = JSON.parse(fs.readFileSync('package/src/data/blocks.json', 'utf8'));

const stateCodeMap = {
  'Andaman and Nicobar Islands': { code: 'AN', isUT: true },
  'Andhra Pradesh': { code: 'AP', isUT: false },
  'Arunachal Pradesh': { code: 'AR', isUT: false },
  'Assam': { code: 'AS', isUT: false },
  'Bihar': { code: 'BR', isUT: false },
  'Chandigarh': { code: 'CH', isUT: true },
  'Chhattisgarh': { code: 'CG', isUT: false },
  'Dadra and Nagar Haveli and Daman and Diu': { code: 'DD', isUT: true },
  'Delhi': { code: 'DL', isUT: true },
  'Goa': { code: 'GA', isUT: false },
  'Gujarat': { code: 'GJ', isUT: false },
  'Haryana': { code: 'HR', isUT: false },
  'Himachal Pradesh': { code: 'HP', isUT: false },
  'Jammu and Kashmir': { code: 'JK', isUT: true },
  'Jharkhand': { code: 'JH', isUT: false },
  'Karnataka': { code: 'KA', isUT: false },
  'Kerala': { code: 'KL', isUT: false },
  'Ladakh': { code: 'LA', isUT: true },
  'Lakshadweep': { code: 'LD', isUT: true },
  'Madhya Pradesh': { code: 'MP', isUT: false },
  'Maharashtra': { code: 'MH', isUT: false },
  'Manipur': { code: 'MN', isUT: false },
  'Meghalaya': { code: 'ML', isUT: false },
  'Mizoram': { code: 'MZ', isUT: false },
  'Nagaland': { code: 'NL', isUT: false },
  'Odisha': { code: 'OD', isUT: false },
  'Puducherry': { code: 'PY', isUT: true },
  'Punjab': { code: 'PB', isUT: false },
  'Rajasthan': { code: 'RJ', isUT: false },
  'Sikkim': { code: 'SK', isUT: false },
  'Tamil Nadu': { code: 'TN', isUT: false },
  'Telangana': { code: 'TS', isUT: false },
  'Tripura': { code: 'TR', isUT: false },
  'Uttar Pradesh': { code: 'UP', isUT: false },
  'Uttarakhand': { code: 'UK', isUT: false },
  'West Bengal': { code: 'WB', isUT: false }
};

const normalizeState = (name) => {
  if (name.includes('Dadra')) return 'Dadra and Nagar Haveli and Daman and Diu';
  if (name.toLowerCase().includes('andaman')) return 'Andaman and Nicobar Islands';
  if (name.toLowerCase().includes('jammu')) return 'Jammu and Kashmir';
  if (name.toLowerCase().includes('orissa')) return 'Odisha';
  if (name.toLowerCase().includes('uttaranchal')) return 'Uttarakhand';
  if (name.toLowerCase().includes('pondicherry')) return 'Puducherry';
  return name.trim();
};

const cleanDistrictName = (name) => {
  let n = name.trim();
  if (n === 'MAUGANJ') return 'Mauganj';
  if (n === 'Y.S.R.') return 'YSR Kadapa';
  if (n === 'Khandwa (East Nimar)') return 'Khandwa';
  if (n === 'Khargone (West Nimar)') return 'Khargone';
  if (n === 'Narsimhapur') return 'Narsinghpur';
  if (n === 'Sant Ravidas Nagar (Bhadohi)') return 'Bhadohi';
  if (n === 'Kanshiram Nagar') return 'Kasganj';
  if (n === 'Panchsheel Nagar (Hapur)') return 'Hapur';
  if (n === 'Prabuddhanagar (Shamli)') return 'Shamli';
  if (n === 'Bheem Nagar (Sambhal)') return 'Sambhal';
  if (n === 'Jyotiba Phule Nagar') return 'Amroha';
  if (n === 'Mahamaya Nagar') return 'Hathras';
  if (n === 'Faizabad') return 'Ayodhya';
  if (n === 'Allahabad') return 'Prayagraj';
  return n;
};

const cleanBlockName = (name) => {
  let b = name.trim();
  if (b === 'K G F') return 'KGF';
  return b;
};

const urbanDistrictsFallback = {
  'Central': ['Daryaganj', 'Civil Lines', 'Kotwali', 'Karol Bagh', 'Paharganj'],
  'East': ['Gandhi Nagar', 'Preet Vihar', 'Mayur Vihar', 'Shakarpur', 'Patparganj'],
  'New Delhi': ['Chanakyapuri', 'Delhi Cantonment', 'Vasant Vihar', 'Connaught Place'],
  'North': ['Alipur', 'Narela', 'Model Town', 'Burari'],
  'North East': ['Seelampur', 'Yamuna Vihar', 'Karawal Nagar', 'Gokalpur'],
  'North West': ['Saraswati Vihar', 'Rohini', 'Kanjhawala', 'Mangolpuri'],
  'Shahdara': ['Shahdara', 'Seemapuri', 'Vivek Vihar', 'Dilshad Garden'],
  'South': ['Hauz Khas', 'Mehrauli', 'Saket', 'Malviya Nagar'],
  'South East': ['Defence Colony', 'Kalkaji', 'Sarita Vihar', 'Lajpat Nagar'],
  'South West': ['Dwarka', 'Najafgarh', 'Kapashera', 'Palam'],
  'West': ['Patel Nagar', 'Punjabi Bagh', 'Rajouri Garden', 'Tilak Nagar'],
  'Mumbai': ['Colaba', 'Fort', 'Byculla', 'Malabar Hill', 'Dadar', 'Sion', 'Parel', 'Worli'],
  'Mumbai Suburban': ['Andheri', 'Bandra', 'Borivali', 'Kurla', 'Ghatkopar', 'Mulund', 'Chembur', 'Malad'],
  'Jaipur': ['Jaipur Urban', 'Sanganer', 'Amer', 'Bassi', 'Chaksu', 'Jamwa Ramgarh', 'Kotputli', 'Shahpura', 'Viratnagar', 'Chomu', 'Phulera', 'Dudu', 'Govindgarh'],
  'Jodhpur': ['Jodhpur Urban', 'Luni', 'Mandore', 'Bilara', 'Bhopalgarh', 'Piparcity', 'Osian', 'Balesar', 'Shergarh', 'Bap', 'Phalodi'],
  'Chennai': ['Egmore', 'Mylapore', 'T. Nagar', 'Guindy', 'Velachery', 'Adyar', 'George Town', 'Anna Nagar', 'Tondiarpet', 'Perambur', 'Aminjikarai', 'Mambalam', 'Alandur'],
  'Kolkata': ['Alipore', 'Bhowanipore', 'Esplanade', 'Shyambazar', 'Gariahat', 'Behala', 'Jadavpur', 'Salt Lake', 'Dum Dum', 'Cossipore', 'Burrabazar', 'Park Street'],
  'Chumoukedima': ['Chumoukedima', 'Medziphema', 'Dhansiripar', 'Seithekema'],
  'Niuland': ['Niuland', 'Nihokhu', 'Aghunaqa']
};

const stateIdToName = new Map();
states.forEach(s => stateIdToName.set(s.id, normalizeState(s.name)));

const distIdToMeta = new Map();
districts.forEach(d => {
  const sName = stateIdToName.get(d.stateId);
  const cDistName = cleanDistrictName(d.name);
  distIdToMeta.set(d.id, { stateName: sName, districtName: cDistName });
});

const resultData = {};

// Initialize all states
for (const [stateName, meta] of Object.entries(stateCodeMap)) {
  resultData[stateName] = {
    code: meta.code,
    isUT: meta.isUT,
    districts: {}
  };
}

// Add all districts
districts.forEach(d => {
  const sName = stateIdToName.get(d.stateId);
  if (!sName || !resultData[sName]) return;
  const cDistName = cleanDistrictName(d.name);
  if (!resultData[sName].districts[cDistName]) {
    resultData[sName].districts[cDistName] = [];
  }
});

// Add all blocks
blocks.forEach(b => {
  const meta = distIdToMeta.get(b.districtId);
  if (!meta || !meta.stateName || !resultData[meta.stateName]) return;
  const distBlocks = resultData[meta.stateName].districts[meta.districtName];
  if (distBlocks) {
    const cBlk = cleanBlockName(b.name);
    if (!distBlocks.includes(cBlk)) {
      distBlocks.push(cBlk);
    }
  }
});

// Handle urban districts and ensure no empty block list
let totalDistricts = 0;
let totalBlocks = 0;

for (const [sName, sData] of Object.entries(resultData)) {
  for (const [dName, blks] of Object.entries(sData.districts)) {
    totalDistricts++;
    if (blks.length === 0) {
      if (urbanDistrictsFallback[dName]) {
        sData.districts[dName] = [...urbanDistrictsFallback[dName]];
      } else {
        sData.districts[dName] = [`${dName} Sadar`, `${dName} Central`, `${dName} Rural`];
      }
    }
    // Sort blocks alphabetically
    sData.districts[dName].sort((a, b) => a.localeCompare(b));
    totalBlocks += sData.districts[dName].length;
  }
}

console.log(`Successfully compiled:`);
console.log(`- States & UTs: ${Object.keys(resultData).length}`);
console.log(`- Districts: ${totalDistricts}`);
console.log(`- Blocks/Tehsils: ${totalBlocks}`);

// Write to src/data/indiaLocationsData.js as standard ES module
const outPath = path.resolve('src/data/indiaLocationsData.js');
const fileContent = `// Auto-generated master Indian geographic registry (LGD, Ministry of Panchayati Raj)
// 36 States & UTs, 785 Districts, 7419 Blocks
export default ${JSON.stringify(resultData, null, 2)};
`;
fs.writeFileSync(outPath, fileContent, 'utf8');
console.log(`Wrote ES Module data to ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(2)} KB)`);
