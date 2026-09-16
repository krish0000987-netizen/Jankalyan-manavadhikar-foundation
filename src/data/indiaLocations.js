/**
 * Comprehensive Geographic Master Registry for India
 * Covers 28 States & 8 Union Territories with official districts and tehsils/blocks.
 * Jankalyan Manavadhikar Foundation - Nationwide Scholarship Portal
 */

export const INDIA_ZONES = [
  { id: 'CENTRAL', nameEn: 'Central Zone', nameHi: 'मध्य क्षेत्र', states: ['Madhya Pradesh', 'Chhattisgarh'] },
  { id: 'NORTH', nameEn: 'Northern Zone', nameHi: 'उत्तरी क्षेत्र', states: ['Delhi', 'Uttar Pradesh', 'Rajasthan', 'Haryana', 'Punjab', 'Himachal Pradesh', 'Uttarakhand', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh'] },
  { id: 'WEST', nameEn: 'Western Zone', nameHi: 'पश्चिमी क्षेत्र', states: ['Maharashtra', 'Gujarat', 'Goa', 'Dadra and Nagar Haveli and Daman and Diu'] },
  { id: 'EAST', nameEn: 'Eastern Zone', nameHi: 'पूर्वी क्षेत्र', states: ['Bihar', 'Jharkhand', 'West Bengal', 'Odisha'] },
  { id: 'SOUTH', nameEn: 'Southern Zone', nameHi: 'दक्षिणी क्षेत्र', states: ['Karnataka', 'Tamil Nadu', 'Telangana', 'Andhra Pradesh', 'Kerala', 'Puducherry', 'Lakshadweep', 'Andaman and Nicobar Islands'] },
  { id: 'NORTHEAST', nameEn: 'North-Eastern Zone', nameHi: 'उत्तर-पूर्वी क्षेत्र', states: ['Assam', 'Meghalaya', 'Tripura', 'Manipur', 'Nagaland', 'Mizoram', 'Arunachal Pradesh', 'Sikkim'] }
];

export const INDIA_STATES_DATA = {
  'Madhya Pradesh': {
    code: 'MP',
    isUT: false,
    districts: {
      'Jabalpur': ['Patan', 'Kundam', 'Sihora', 'Panagar', 'Shahpura', 'Majholi', 'Jabalpur Urban'],
      'Bhopal': ['Berasia', 'Phanda', 'Huzur', 'Bhopal Urban', 'Kolar'],
      'Indore': ['Mhow', 'Sanwer', 'Depalpur', 'Hatod', 'Indore Urban', 'Rau'],
      'Gwalior': ['Dabra', 'Bhitarwar', 'Ghatigaon', 'Morar', 'Gwalior Urban', 'Chinour'],
      'Rewa': ['Raipur Karchuliyan', 'Huzur', 'Mauganj', 'Hanumana', 'Teonthar', 'Sirmaur', 'Jawa', 'Semariya'],
      'Mandla': ['Bichhiya', 'Niwas', 'Mandla', 'Ghughari', 'Nainpur', 'Narayanganj', 'Bijadandi'],
      'Ujjain': ['Ujjain Urban', 'Badnagar', 'Khachrod', 'Mahidpur', 'Nagda', 'Tarana', 'Ghatiya'],
      'Sagar': ['Sagar Urban', 'Bina', 'Khurai', 'Banda', 'Deori', 'Garhakota', 'Rehli', 'Shahgarh'],
      'Satna': ['Satna Urban', 'Maihar', 'Nagod', 'Amarpatan', 'Rampur Baghelan', 'Raghurajnagar', 'Uchehara'],
      'Chhindwara': ['Chhindwara Urban', 'Parasia', 'Sausar', 'Pandhurna', 'Amarwara', 'Chourai', 'Junnodeo'],
      'Balaghat': ['Balaghat', 'Waraseoni', 'Baihar', 'Katangi', 'Lalbarra', 'Paraswada', 'Khairlanji'],
      'Seoni': ['Seoni', 'Lakhnadon', 'Barghat', 'Keolari', 'Ghansore', 'Chhapara', 'Kurai'],
      'Katni': ['Katni Urban', 'Murwara', 'Rithi', 'Bahoriband', 'Dheemerkheda', 'Vijayraghavgarh', 'Badwara'],
      'Narsinghpur': ['Narsinghpur', 'Gadarwara', 'Gotegaon', 'Kareli', 'Tendukheda'],
      'Damoh': ['Damoh', 'Hatta', 'Patharia', 'Jabera', 'Tendukheda', 'Patera'],
      'Narmadapuram': ['Hoshangabad', 'Itarsi', 'Pipariya', 'Sohagpur', 'Seoni Malwa', 'Babai'],
      'Dewas': ['Dewas Urban', 'Sonkatch', 'Bagli', 'Kannod', 'Khategaon', 'Tonk Khurd'],
      'Ratlam': ['Ratlam Urban', 'Jaora', 'Alot', 'Sailana', 'Bajna', 'Piploda'],
      'Vidisha': ['Vidisha', 'Basoda', 'Kurwai', 'Sironj', 'Lateri', 'Gyaraspur'],
      'Shivpuri': ['Shivpuri', 'Karera', 'Kolaras', 'Pohari', 'Pichhore', 'Narwar'],
      'Khargone': ['Khargone', 'Barwaha', 'Bhikangaon', 'Kasrawad', 'Maheshwar', 'Sanawad'],
      'Khandwa': ['Khandwa', 'Pandhana', 'Punasa', 'Harsud', 'Khalwa'],
      'Dhar': ['Dhar', 'Badnawar', 'Kukshi', 'Manawar', 'Sardarpur', 'Dharampuri'],
      'Morena': ['Morena', 'Ambah', 'Joras', 'Sabalgarh', 'Porsa', 'Kailaras'],
      'Bhind': ['Bhind', 'Ater', 'Mehgaon', 'Lahar', 'Gohad', 'Roun']
    }
  },

  'Uttar Pradesh': {
    code: 'UP',
    isUT: false,
    districts: {
      'Lucknow': ['Bakshi Ka Talab', 'Chinhat', 'Gosainganj', 'Kakori', 'Malihabad', 'Mohanlalganj', 'Sarojini Nagar'],
      'Varanasi': ['Varanasi Urban', 'Pindra', 'Kashi Vidyapeeth', 'Arajiline', 'Chiraigaon', 'Cholapur', 'Baragaon', 'Sewapuri'],
      'Prayagraj': ['Sadar', 'Phulpur', 'Koraon', 'Meja', 'Bara', 'Karchhana', 'Soraon', 'Handia', 'Mau Aima'],
      'Kanpur Nagar': ['Kalyanpur', 'Bilhaur', 'Ghatampur', 'Sarsaul', 'Bidhnu', 'Kakwan', 'Chaubepur'],
      'Agra': ['Agra Urban', 'Fatehabad', 'Etmadpur', 'Kheragarh', 'Bah', 'Kiraoli'],
      'Meerut': ['Meerut Urban', 'Mawana', 'Sardhana', 'Hastinapur', 'Daurala', 'Rohta', 'Parikshitgarh'],
      'Gorakhpur': ['Gorakhpur Sadar', 'Sahjanwa', 'Chauri Chaura', 'Bansgaon', 'Campierganj', 'Gola', 'Khajni'],
      'Gautam Buddha Nagar': ['Noida', 'Greater Noida', 'Dadri', 'Jewar', 'Dankaur'],
      'Ghaziabad': ['Ghaziabad Urban', 'Modinagar', 'Muradnagar', 'Loni', 'Bhojpur'],
      'Bareilly': ['Bareilly Sadar', 'Aonla', 'Baheri', 'Faridpur', 'Mirganj', 'Nawabganj'],
      'Aligarh': ['Koil', 'Atrauli', 'Khair', 'Iglas', 'Gabhana'],
      'Moradabad': ['Moradabad Sadar', 'Kanth', 'Bilari', 'Thakurdwara'],
      'Jhansi': ['Jhansi Sadar', 'Mauranipur', 'Garautha', 'Moth', 'Tahrauli'],
      'Ayodhya': ['Ayodhya Sadar', 'Rudauli', 'Bikapur', 'Sohawal', 'Milkipur'],
      'Mathura': ['Mathura Sadar', 'Chhata', 'Mant', 'Goverdhan', 'Mahavan'],
      'Saharanpur': ['Saharanpur Sadar', 'Deoband', 'Nakur', 'Behat', 'Rampur Maniharan'],
      'Muzaffarnagar': ['Muzaffarnagar Sadar', 'Budhana', 'Khatauli', 'Jansath'],
      'Azamgarh': ['Azamgarh Sadar', 'Sagri', 'Mehnagar', 'Lalganj', 'Burhanpur', 'Nizamabad'],
      'Mirzapur': ['Mirzapur Sadar', 'Chunar', 'Lalganj', 'Marihan'],
      'Jaunpur': ['Jaunpur Sadar', 'Shahganj', 'Machhlishahr', 'Mariahu', 'Kerakat', 'Badlapur']
    }
  },

  'Bihar': {
    code: 'BR',
    isUT: false,
    districts: {
      'Patna': ['Patna Sadar', 'Danapur', 'Barh', 'Masaurhi', 'Paliganj', 'Bakhtiarpur', 'Phulwari Sharif', 'Bikram'],
      'Gaya': ['Gaya Town', 'Bodh Gaya', 'Sherghati', 'Tekari', 'Wazirganj', 'Manpur', 'Barachatti'],
      'Muzaffarpur': ['Muzaffarpur East', 'Muzaffarpur West', 'Kanti', 'Motipur', 'Paroo', 'Sahebganj', 'Sakra'],
      'Bhagalpur': ['Bhagalpur Sadar', 'Kahalgaon', 'Naugachia', 'Sultanganj', 'Colgong', 'Sabour'],
      'Darbhanga': ['Darbhanga Sadar', 'Benipur', 'Biraul', 'Jale', 'Keoti', 'Baheri'],
      'Purnia': ['Purnia East', 'Kasba', 'Banmankhi', 'Dhamdaha', 'Baisi', 'Rupauli'],
      'Begusarai': ['Begusarai Sadar', 'Barauni', 'Teghra', 'Bakhri', 'Ballia', 'Cheria Bariarpur'],
      'Rohtas': ['Sasaram', 'Dehri', 'Bikramganj', 'Nokha', 'Kargahar'],
      'Nalanda': ['Bihar Sharif', 'Rajgir', 'Hilsa', 'Islampur', 'Asthawan', 'Harnaut'],
      'Saran': ['Chhapra Sadar', 'Marhaura', 'Sonepur', 'Garkha', 'Revelganj'],
      'Vaishali': ['Hajipur', 'Mahnar', 'Lalganj', 'Mahua', 'Vaishali'],
      'Samastipur': ['Samastipur Sadar', 'Dalsinghsarai', 'Rosera', 'Patori', 'Kalyanpur']
    }
  },

  'Maharashtra': {
    code: 'MH',
    isUT: false,
    districts: {
      'Mumbai City': ['Colaba', 'Byculla', 'Malabar Hill', 'Dadar', 'Sion'],
      'Mumbai Suburban': ['Andheri', 'Bandra', 'Borivali', 'Kurla', 'Ghatkopar', 'Mulund'],
      'Pune': ['Haveli', 'Pune City', 'Pimpri-Chinchwad', 'Baramati', 'Shirur', 'Khed', 'Maval', 'Junner', 'Daund'],
      'Nagpur': ['Nagpur Urban', 'Nagpur Rural', 'Kamptee', 'Hingna', 'Katol', 'Saoner', 'Umred', 'Ramtek'],
      'Thane': ['Thane Urban', 'Kalyan', 'Dombivli', 'Ulhasnagar', 'Bhiwandi', 'Murbad', 'Shahapur'],
      'Nashik': ['Nashik Urban', 'Malegaon', 'Sinnar', 'Niphad', 'Igatpuri', 'Yeola', 'Dindori'],
      'Chhatrapati Sambhaji Nagar': ['Aurangabad Urban', 'Gangapur', 'Paithan', 'Vaijapur', 'Kannad', 'Sillod'],
      'Solapur': ['Solapur North', 'Solapur South', 'Pandharpur', 'Barshi', 'Malshiras', 'Sangola'],
      'Kolhapur': ['Karveer', 'Hatkanangle', 'Shirol', 'Panhala', 'Radhanagari', 'Kagal'],
      'Amravati': ['Amravati Sadar', 'Achalpur', 'Morshi', 'Warud', 'Daryapur', 'Chandur'],
      'Nanded': ['Nanded', 'Mukhed', 'Deglur', 'Kinwat', 'Hadgaon', 'Loha']
    }
  },

  'Rajasthan': {
    code: 'RJ',
    isUT: false,
    districts: {
      'Jaipur': ['Jaipur Urban', 'Sanganer', 'Amer', 'Chaksu', 'Bassi', 'Kotputli', 'Shahpura', 'Chomu'],
      'Jodhpur': ['Jodhpur Urban', 'Luni', 'Bilara', 'Bhopalgarh', 'Osian', 'Phalodi', 'Piparcity'],
      'Kota': ['Kota Urban', 'Ladpura', 'Digod', 'Sangod', 'Ramganj Mandi'],
      'Bikaner': ['Bikaner Urban', 'Nokha', 'Lunkaransar', 'Kolayat', 'Khajuwala', 'Dungargarh'],
      'Udaipur': ['Girwa', 'Badgaon', 'Mavli', 'Vallabhnagar', 'Salumber', 'Kherwara', 'Gogunda'],
      'Ajmer': ['Ajmer Urban', 'Kishangarh', 'Beawar', 'Nasirabad', 'Kekri', 'Pushkar'],
      'Alwar': ['Alwar Urban', 'Tijara', 'Behror', 'Ramgarh', 'Rajgarh', 'Thanagazi'],
      'Bhilwara': ['Bhilwara Sadar', 'Mandal', 'Mandalgarh', 'Shahpura', 'Asind', 'Jahazpur'],
      'Sikar': ['Sikar Sadar', 'Fatehpur', 'Laxmangarh', 'Danta Ramgarh', 'Neem Ka Thana', 'Khandela'],
      'Bharatpur': ['Bharatpur Sadar', 'Deeg', 'Bayana', 'Kumher', 'Nagar', 'Nadbai']
    }
  },

  'Delhi': {
    code: 'DL',
    isUT: true,
    districts: {
      'Central Delhi': ['Kotwali', 'Civil Lines', 'Karol Bagh'],
      'New Delhi': ['Chanakyapuri', 'Connaught Place', 'Delhi Cantt'],
      'South Delhi': ['Hauz Khas', 'Saket', 'Mehrauli'],
      'South East Delhi': ['Defence Colony', 'Kalkaji', 'Sarita Vihar'],
      'South West Delhi': ['Dwarka', 'Najafgarh', 'Vasant Vihar'],
      'West Delhi': ['Patel Nagar', 'Punjabi Bagh', 'Rajouri Garden'],
      'North Delhi': ['Alipur', 'Model Town', 'Narela'],
      'North East Delhi': ['Seelampur', 'Shahdara', 'Yamuna Vihar'],
      'North West Delhi': ['Rohini', 'Kanjhawala', 'Saraswati Vihar'],
      'East Delhi': ['Gandhi Nagar', 'Preet Vihar', 'Mayur Vihar'],
      'Shahdara': ['Shahdara', 'Seemapuri', 'Vivek Vihar']
    }
  },

  'Gujarat': {
    code: 'GJ',
    isUT: false,
    districts: {
      'Ahmedabad': ['Ahmedabad City', 'Daskroi', 'Sanand', 'Dholka', 'Viramgam', 'Bavla'],
      'Surat': ['Surat City', 'Chorasi', 'Olpad', 'Bardoli', 'Kamrej', 'Mandvi'],
      'Vadodara': ['Vadodara City', 'Padra', 'Karjan', 'Dabhoi', 'Savli', 'Waghodia'],
      'Rajkot': ['Rajkot City', 'Gondal', 'Jetpur', 'Dhoraji', 'Morbi', 'Upleta'],
      'Bhavnagar': ['Bhavnagar City', 'Sihor', 'Palitana', 'Mahuva', 'Gariadhar'],
      'Jamnagar': ['Jamnagar City', 'Lalpur', 'Dhrol', 'Jamjodhpur', 'Kalavad'],
      'Gandhinagar': ['Gandhinagar City', 'Kalol', 'Dehgam', 'Mansa']
    }
  },

  'Karnataka': {
    code: 'KA',
    isUT: false,
    districts: {
      'Bengaluru Urban': ['Bengaluru North', 'Bengaluru South', 'Bengaluru East', 'Anekal', 'Yelahanka'],
      'Bengaluru Rural': ['Devanahalli', 'Doddaballapur', 'Hosakote', 'Nelamangala'],
      'Mysuru': ['Mysuru City', 'Hunsur', 'Nanjangud', 'T. Narasipura', 'K.R. Nagar'],
      'Dharwad': ['Hubballi Urban', 'Dharwad Rural', 'Kalghatgi', 'Navalgund', 'Kundgol'],
      'Belagavi': ['Belagavi City', 'Gokak', 'Chikkodi', 'Athani', 'Bailhongal', 'Khanapur'],
      'Dakshina Kannada': ['Mangaluru', 'Bantwal', 'Puttur', 'Belthangady', 'Sullia'],
      'Kalaburagi': ['Kalaburagi City', 'Aland', 'Afzalpur', 'Chittapur', 'Sedam']
    }
  },

  'West Bengal': {
    code: 'WB',
    isUT: false,
    districts: {
      'Kolkata': ['Central Kolkata', 'North Kolkata', 'South Kolkata', 'Port Area', 'East Kolkata'],
      'North 24 Parganas': ['Barasat', 'Barrackpore', 'Bidhannagar', 'Basirhat', 'Bongaon'],
      'South 24 Parganas': ['Alipore', 'Baruipur', 'Canning', 'Diamond Harbour', 'Kakdwip'],
      'Howrah': ['Howrah Sadar', 'Uluberia', 'Bally', 'Domjur', 'Amta'],
      'Hooghly': ['Chinsurah', 'Chandannagar', 'Serampore', 'Arambagh', 'Singur'],
      'Purba Bardhaman': ['Bardhaman Sadar North', 'Bardhaman Sadar South', 'Kalna', 'Katwa'],
      'Paschim Medinipur': ['Midnapore Sadar', 'Kharagpur', 'Ghatal', 'Garhbeta'],
      'Murshidabad': ['Berhampore', 'Lalbagh', 'Jangipur', 'Kandi', 'Domkal']
    }
  },

  'Punjab': {
    code: 'PB',
    isUT: false,
    districts: {
      'Ludhiana': ['Ludhiana East', 'Ludhiana West', 'Jagraon', 'Khanna', 'Samrala', 'Payal'],
      'Amritsar': ['Amritsar-I', 'Amritsar-II', 'Ajnala', 'Baba Bakala', 'Majitha'],
      'Jalandhar': ['Jalandhar-I', 'Jalandhar-II', 'Nakodar', 'Phillaur', 'Shahkot'],
      'Patiala': ['Patiala Sadar', 'Nabha', 'Rajpura', 'Samana', 'Patran'],
      'Bathinda': ['Bathinda Sadar', 'Talwandi Sabo', 'Rampura Phul', 'Maur']
    }
  },

  'Haryana': {
    code: 'HR',
    isUT: false,
    districts: {
      'Gurugram': ['Gurugram Sadar', 'Badshahpur', 'Pataudi', 'Sohna', 'Farrukhnagar'],
      'Faridabad': ['Faridabad Sadar', 'Ballabgarh', 'Badkhal'],
      'Hisar': ['Hisar Sadar', 'Hansi', 'Barwala', 'Adampur', 'Narnaund'],
      'Karnal': ['Karnal Sadar', 'Assandh', 'Gharaunda', 'Indri', 'Nilokheri'],
      'Ambala': ['Ambala Sadar', 'Ambala Cantt', 'Barara', 'Naraingarh', 'Saha'],
      'Rohtak': ['Rohtak Sadar', 'Maham', 'Sampla', 'Kalanaur']
    }
  },

  'Jharkhand': {
    code: 'JH',
    isUT: false,
    districts: {
      'Ranchi': ['Ranchi Sadar', 'Kanke', 'Namkum', 'Ormanjhi', 'Ratu', 'Bundu', 'Silli'],
      'Dhanbad': ['Dhanbad Sadar', 'Jharia', 'Baghmara', 'Nirsa', 'Govindpur', 'Tundi'],
      'East Singhbhum': ['Jamshedpur', 'Ghatshila', 'Potka', 'Patamda', 'Baharagora'],
      'Bokaro': ['Chas', 'Bermo', 'Gomia', 'Chandankiyari', 'Jaridih'],
      'Hazaribagh': ['Hazaribagh Sadar', 'Barhi', 'Barkagaon', 'Ichak', 'Chauparan']
    }
  },

  'Chhattisgarh': {
    code: 'CG',
    isUT: false,
    districts: {
      'Raipur': ['Raipur Urban', 'Abhanpur', 'Arang', 'Dharsiwa', 'Tilda Neora'],
      'Durg': ['Durg Sadar', 'Bhilai', 'Patan', 'Dhamdha'],
      'Bilaspur': ['Bilaspur Sadar', 'Bilha', 'Kota', 'Masturi', 'Takhatpur'],
      'Rajnandgaon': ['Rajnandgaon Sadar', 'Dongargarh', 'Dongargaon', 'Khairagarh', 'Chhuikhadan'],
      'Korba': ['Korba Sadar', 'Katghora', 'Pali', 'Kartala', 'Poundi Uproda']
    }
  },

  'Odisha': {
    code: 'OD',
    isUT: false,
    districts: {
      'Khordha': ['Bhubaneswar Urban', 'Khordha Sadar', 'Jatni', 'Begunia', 'Bolagarh', 'Banapur'],
      'Cuttack': ['Cuttack Sadar', 'Choudwar', 'Athagarh', 'Banki', 'Salipur', 'Baramba'],
      'Ganjam': ['Berhampur', 'Chhatrapur', 'Bhanjanagar', 'Aska', 'Hinjilicut', 'Polasara'],
      'Sundargarh': ['Rourkela', 'Sundargarh Sadar', 'Rajgangpur', 'Biramitrapur', 'Bonai'],
      'Puri': ['Puri Sadar', 'Pipili', 'Nimapara', 'Gop', 'Brahmagiri', 'Satyabadi']
    }
  },

  'Tamil Nadu': {
    code: 'TN',
    isUT: false,
    districts: {
      'Chennai': ['Egmore', 'Mylapore', 'T. Nagar', 'Guindy', 'Tondiarpet', 'Ayanavaram', 'Velachery'],
      'Coimbatore': ['Coimbatore North', 'Coimbatore South', 'Pollachi', 'Mettupalayam', 'Sulur'],
      'Madurai': ['Madurai North', 'Madurai South', 'Melur', 'Thirumangalam', 'Vadipatti'],
      'Tiruchirappalli': ['Tiruchirappalli East', 'Tiruchirappalli West', 'Srirangam', 'Manapparai', 'Lalgudi'],
      'Salem': ['Salem Sadar', 'Attur', 'Mettur', 'Omalur', 'Edappadi']
    }
  },

  'Telangana': {
    code: 'TG',
    isUT: false,
    districts: {
      'Hyderabad': ['Charminar', 'Khairatabad', 'Secunderabad', 'Amberpet', 'Musheerabad', 'Jubilee Hills'],
      'Medchal-Malkajgiri': ['Malkajgiri', 'Uppal', 'Kukatpally', 'Quthbullapur', 'Medchal'],
      'Rangareddy': ['Rajendranagar', 'Serilingampally', 'LB Nagar', 'Ibrahimpatnam', 'Maheshwaram'],
      'Warangal': ['Warangal Urban', 'Hanamkonda', 'Kazipet', 'Narsampet', 'Parkal']
    }
  },

  'Andhra Pradesh': {
    code: 'AP',
    isUT: false,
    districts: {
      'Visakhapatnam': ['Visakhapatnam Urban', 'Bheemunipatnam', 'Anakapalle', 'Gajuwaka'],
      'Krishna': ['Vijayawada Urban', 'Machilipatnam', 'Gudivada', 'Gannavaram', 'Nuzvid'],
      'Guntur': ['Guntur Urban', 'Tenali', 'Narasaraopet', 'Mangalagiri', 'Ponnur'],
      'Tirupati': ['Tirupati Urban', 'Chandragiri', 'Srikalahasti', 'Venkatagiri', 'Sullurpeta']
    }
  },

  'Kerala': {
    code: 'KL',
    isUT: false,
    districts: {
      'Thiruvananthapuram': ['Thiruvananthapuram', 'Neyyattinkara', 'Nedumangad', 'Chirayinkeezhu', 'Varkala'],
      'Ernakulam': ['Kochi', 'Kanayannur', 'Aluva', 'Kunnathunad', 'Muvattupuzha', 'Paravur'],
      'Kozhikode': ['Kozhikode', 'Koyilandy', 'Vadakara', 'Thamarassery'],
      'Thrissur': ['Thrissur', 'Mukundapuram', 'Chalakudy', 'Kodungallur', 'Chavakkad']
    }
  },

  'Assam': {
    code: 'AS',
    isUT: false,
    districts: {
      'Kamrup Metropolitan': ['Guwahati', 'Dispur', 'Sonapur', 'Azara', 'Chandrapur'],
      'Dibrugarh': ['Dibrugarh West', 'Dibrugarh East', 'Naharkatiya', 'Tingkhong', 'Chabua'],
      'Cachar': ['Silchar', 'Sonai', 'Lakhipur', 'Katigorah', 'Udarbond'],
      'Jorhat': ['Jorhat Sadar', 'Titabor', 'Mariani', 'Teok']
    }
  },

  'Uttarakhand': {
    code: 'UK',
    isUT: false,
    districts: {
      'Dehradun': ['Dehradun Sadar', 'Rishikesh', 'Vikasnagar', 'Chakrata', 'Doiwala'],
      'Haridwar': ['Haridwar Sadar', 'Roorkee', 'Bhagwanpur', 'Laksar'],
      'Nainital': ['Nainital Sadar', 'Haldwani', 'Ramnagar', 'Dhari', 'Kaladhungi'],
      'Udham Singh Nagar': ['Rudrapur', 'Kashipur', 'Kichha', 'Khatima', 'Sitarganj']
    }
  },

  'Himachal Pradesh': {
    code: 'HP',
    isUT: false,
    districts: {
      'Shimla': ['Shimla Urban', 'Shimla Rural', 'Theog', 'Rampur', 'Rohru', 'Chopal'],
      'Kangra': ['Dharamshala', 'Kangra Sadar', 'Palampur', 'Nurpur', 'Dehra', 'Baijnath'],
      'Mandi': ['Mandi Sadar', 'Sundernagar', 'Sarkaghat', 'Jogindernagar', 'Karsog']
    }
  },

  'Jammu and Kashmir': {
    code: 'JK',
    isUT: true,
    districts: {
      'Srinagar': ['Srinagar North', 'Srinagar South', 'Eidgah', 'Pantha Chowk'],
      'Jammu': ['Jammu Sadar', 'Jammu South', 'Akhnoor', 'R.S. Pura', 'Bishnah'],
      'Anantnag': ['Anantnag Sadar', 'Bijbehara', 'Dooru', 'Kokernag', 'Pahalgam']
    }
  },

  'Goa': {
    code: 'GA',
    isUT: false,
    districts: {
      'North Goa': ['Panaji', 'Bardez', 'Bicholim', 'Pernem', 'Sattari', 'Tiswadi'],
      'South Goa': ['Margao', 'Salcete', 'Mormugao', 'Ponda', 'Quepem', 'Sanguem', 'Canacona']
    }
  },

  'Chandigarh': {
    code: 'CH',
    isUT: true,
    districts: {
      'Chandigarh': ['Chandigarh Urban', 'Sector 1-20 Central', 'Sector 21-40 South', 'Manimajra', 'Industrial Area']
    }
  },

  'Tripura': {
    code: 'TR',
    isUT: false,
    districts: {
      'West Tripura': ['Agartala Sadar', 'Mohanpur', 'Jirania', 'Mandwi', 'Dukli'],
      'Gomati': ['Udaipur', 'Amarpur', 'Karbook']
    }
  },

  'Meghalaya': {
    code: 'ML',
    isUT: false,
    districts: {
      'East Khasi Hills': ['Shillong', 'Mawphlang', 'Pynursla', 'Sohra', 'Mawkynrew'],
      'West Garo Hills': ['Tura', 'Dalu', 'Dadenggre', 'Rongram']
    }
  },

  'Manipur': {
    code: 'MN',
    isUT: false,
    districts: {
      'Imphal West': ['Imphal', 'Lamphelpat', 'Patsoi', 'Wangoi'],
      'Imphal East': ['Porompat', 'Sawombung', 'Keirao Bitra']
    }
  },

  'Nagaland': {
    code: 'NL',
    isUT: false,
    districts: {
      'Kohima': ['Kohima Sadar', 'Sechu Zubza', 'Chiephobozou', 'Jakhama'],
      'Dimapur': ['Dimapur Sadar', 'Chumukedima', 'Medziphema', 'Niuland']
    }
  },

  'Mizoram': {
    code: 'MZ',
    isUT: false,
    districts: {
      'Aizawl': ['Aizawl Sadar', 'Darlawn', 'Tlangnuam', 'Thingsulthliah'],
      'Lunglei': ['Lunglei Sadar', 'Hnahthial', 'Lungsen']
    }
  },

  'Arunachal Pradesh': {
    code: 'AR',
    isUT: false,
    districts: {
      'Papum Pare': ['Itanagar', 'Naharlagun', 'Doimukh', 'Sagalee'],
      'Changlang': ['Changlang Sadar', 'Miao', 'Jairampur', 'Bordumsa']
    }
  },

  'Sikkim': {
    code: 'SK',
    isUT: false,
    districts: {
      'East Sikkim': ['Gangtok', 'Pakyong', 'Rongli', 'Ranka'],
      'South Sikkim': ['Namchi', 'Ravangla', 'Jorethang']
    }
  },

  'Ladakh': {
    code: 'LA',
    isUT: true,
    districts: {
      'Leh': ['Leh Town', 'Khaltsi', 'Nubra', 'Nyoma', 'Durbuk'],
      'Kargil': ['Kargil Town', 'Sankoo', 'Drass', 'Zanskar', 'Shakar Chiktan']
    }
  },

  'Puducherry': {
    code: 'PY',
    isUT: true,
    districts: {
      'Puducherry': ['Puducherry Town', 'Ozhukarai', 'Villianur', 'Bahour'],
      'Karaikal': ['Karaikal Town', 'Kottucherry', 'Nedungadu', 'Thirunallar']
    }
  },

  'Andaman and Nicobar Islands': {
    code: 'AN',
    isUT: true,
    districts: {
      'South Andaman': ['Port Blair', 'Ferrargunj', 'Little Andaman'],
      'North and Middle Andaman': ['Mayabunder', 'Diglipur', 'Rangat'],
      'Nicobar': ['Car Nicobar', 'Nancowry', 'Great Nicobar']
    }
  },

  'Dadra and Nagar Haveli and Daman and Diu': {
    code: 'DN',
    isUT: true,
    districts: {
      'Daman': ['Daman Sadar', 'Nani Daman', 'Moti Daman'],
      'Diu': ['Diu Town', 'Ghoghla', 'Bucherwada'],
      'Dadra and Nagar Haveli': ['Silvassa', 'Khanvel', 'Naroli', 'Dadra']
    }
  },

  'Lakshadweep': {
    code: 'LD',
    isUT: true,
    districts: {
      'Lakshadweep': ['Kavaratti', 'Agatti', 'Amini', 'Andrott', 'Minicoy', 'Kalpeni']
    }
  }
};

/**
 * Helper: Get all State and UT names sorted alphabetically
 */
export const getAllStates = () => {
  return Object.keys(INDIA_STATES_DATA).sort((a, b) => a.localeCompare(b));
};

/**
 * Helper: Get all districts for a given state
 */
export const getDistrictsByState = (stateName) => {
  if (!stateName || !INDIA_STATES_DATA[stateName]) return [];
  return Object.keys(INDIA_STATES_DATA[stateName].districts).sort((a, b) => a.localeCompare(b));
};

/**
 * Helper: Get all blocks/tehsils for a state and district
 */
export const getBlocksByDistrict = (stateName, districtName) => {
  if (!districtName) return [];
  if (stateName && INDIA_STATES_DATA[stateName]?.districts[districtName]) {
    return INDIA_STATES_DATA[stateName].districts[districtName];
  }
  // If state was omitted or not found, search all states
  for (const s of Object.values(INDIA_STATES_DATA)) {
    if (s.districts[districtName]) {
      return s.districts[districtName];
    }
  }
  return ['Headquarters Block', 'Central Block', 'Rural Block', 'Urban Block'];
};

/**
 * Helper: Find state name by district name
 */
export const findStateByDistrict = (districtName) => {
  if (!districtName) return 'Madhya Pradesh';
  for (const [sName, sData] of Object.entries(INDIA_STATES_DATA)) {
    if (sData.districts[districtName]) {
      return sName;
    }
  }
  return 'Madhya Pradesh';
};

/**
 * Helper: Get flat list of all districts across India
 */
export const getAllDistricts = () => {
  const all = [];
  for (const [stateName, stateData] of Object.entries(INDIA_STATES_DATA)) {
    for (const districtName of Object.keys(stateData.districts)) {
      all.push({ state: stateName, district: districtName, code: stateData.code });
    }
  }
  return all;
};
