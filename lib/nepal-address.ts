export interface MunicipalityData {
  name: string;
  wardCount: number;
}

export interface DistrictData {
  name: string;
  municipalities: MunicipalityData[];
}

export interface ProvinceData {
  id: string;
  name: string;
  nameNepali: string;
  districts: DistrictData[];
}

export const STORE_ADDRESS = 'Rangeli-7, Morang, Nepal';
export const STORE_PHONE = '+9779811313666';
export const STORE_PHONE_DISPLAY = '+977 9811313666';
export const STORE_WHATSAPP_URL = 'https://wa.me/9779811313666?text=Namaste%20Puja%20Collection%2C%20I%20would%20like%20to%20inquire%20about%20your%20ethnic%20wear%20collection.';

export const NEPAL_PROVINCES: ProvinceData[] = [
  {
    id: 'KOSHI',
    name: 'Koshi Province',
    nameNepali: 'कोशी प्रदेश',
    districts: [
      {
        name: 'Morang',
        municipalities: [
          { name: 'Rangeli Municipality', wardCount: 9 },
          { name: 'Biratnagar Metropolitan City', wardCount: 19 },
          { name: 'SundarHaraicha Municipality', wardCount: 12 },
          { name: 'Belbari Municipality', wardCount: 11 },
          { name: 'Pathari Sanischare Municipality', wardCount: 10 },
          { name: 'Urlabari Municipality', wardCount: 9 },
          { name: 'Ratuwamai Municipality', wardCount: 10 },
          { name: 'Sunbarsi Municipality', wardCount: 9 },
          { name: 'Kanepokhari Rural Municipality', wardCount: 7 },
          { name: 'Gramthan Rural Municipality', wardCount: 7 },
          { name: 'Jahada Rural Municipality', wardCount: 7 },
          { name: 'Katahari Rural Municipality', wardCount: 7 },
          { name: 'Kerabari Rural Municipality', wardCount: 10 },
          { name: 'Miklajung Rural Municipality', wardCount: 9 },
          { name: 'Dhanpalthan Rural Municipality', wardCount: 7 },
          { name: 'Budhiganga Rural Municipality', wardCount: 7 },
        ],
      },
      {
        name: 'Sunsari',
        municipalities: [
          { name: 'Dharan Sub-Metropolitan', wardCount: 20 },
          { name: 'Itahari Sub-Metropolitan', wardCount: 20 },
          { name: 'Inaruwa Municipality', wardCount: 10 },
          { name: 'Duhabi Municipality', wardCount: 12 },
          { name: 'Barahachhetra Municipality', wardCount: 11 },
          { name: 'Ramdhuni Municipality', wardCount: 9 },
          { name: 'Koshi Rural Municipality', wardCount: 8 },
          { name: 'Gadhi Rural Municipality', wardCount: 6 },
          { name: 'Barju Rural Municipality', wardCount: 6 },
          { name: 'Bhokraha Narsing Rural Municipality', wardCount: 8 },
          { name: 'Harinagar Rural Municipality', wardCount: 7 },
          { name: 'Dewanganj Rural Municipality', wardCount: 7 },
        ],
      },
      {
        name: 'Jhapa',
        municipalities: [
          { name: 'Birtamod Municipality', wardCount: 10 },
          { name: 'Damak Municipality', wardCount: 10 },
          { name: 'Mechinagar Municipality', wardCount: 15 },
          { name: 'Bhadrapur Municipality', wardCount: 10 },
          { name: 'Arjundhara Municipality', wardCount: 11 },
          { name: 'Kankai Municipality', wardCount: 9 },
          { name: 'Shivasatakshi Municipality', wardCount: 11 },
          { name: 'Gauradaha Municipality', wardCount: 9 },
          { name: 'Buddhashanti Rural Municipality', wardCount: 7 },
          { name: 'Kamal Rural Municipality', wardCount: 7 },
          { name: 'Jhapa Rural Municipality', wardCount: 7 },
          { name: 'Barhadashi Rural Municipality', wardCount: 7 },
          { name: 'Gauriganj Rural Municipality', wardCount: 6 },
          { name: 'Haldibari Rural Municipality', wardCount: 5 },
          { name: 'Kachankawal Rural Municipality', wardCount: 7 },
        ],
      },
      {
        name: 'Ilam',
        municipalities: [
          { name: 'Ilam Municipality', wardCount: 12 },
          { name: 'Deumai Municipality', wardCount: 9 },
          { name: 'Mai Municipality', wardCount: 10 },
          { name: 'Suryodaya Municipality', wardCount: 14 },
          { name: 'Fakfokthum Rural Municipality', wardCount: 7 },
          { name: 'Chulachuli Rural Municipality', wardCount: 6 },
          { name: 'Maijogmai Rural Municipality', wardCount: 6 },
          { name: 'Mangsebung Rural Municipality', wardCount: 6 },
          { name: 'Rong Rural Municipality', wardCount: 6 },
          { name: 'Sandakpur Rural Municipality', wardCount: 5 },
        ],
      },
      {
        name: 'Udayapur',
        municipalities: [
          { name: 'Triyuga Municipality', wardCount: 16 },
          { name: 'Katari Municipality', wardCount: 14 },
          { name: 'Chaudandigadhi Municipality', wardCount: 10 },
          { name: 'Belaka Municipality', wardCount: 9 },
          { name: 'Udayapurgadhi Rural Municipality', wardCount: 8 },
          { name: 'Rautamai Rural Municipality', wardCount: 8 },
          { name: 'Tapli Rural Municipality', wardCount: 5 },
          { name: 'Limchungbung Rural Municipality', wardCount: 5 },
        ],
      },
      {
        name: 'Dhankuta',
        municipalities: [
          { name: 'Dhankuta Municipality', wardCount: 10 },
          { name: 'Pakhribas Municipality', wardCount: 10 },
          { name: 'Mahalaxmi Municipality', wardCount: 9 },
          { name: 'Sangurigadhi Rural Municipality', wardCount: 10 },
          { name: 'Khalsa Chhintang Sahidbhumi', wardCount: 7 },
          { name: 'Chhathar Jorpati Rural Municipality', wardCount: 6 },
          { name: 'Chaubise Rural Municipality', wardCount: 8 },
        ],
      },
    ],
  },
  {
    id: 'BAGMATI',
    name: 'Bagmati Province',
    nameNepali: 'बागमती प्रदेश',
    districts: [
      {
        name: 'Kathmandu',
        municipalities: [
          { name: 'Kathmandu Metropolitan City', wardCount: 32 },
          { name: 'Budhanilkantha Municipality', wardCount: 13 },
          { name: 'Chandragiri Municipality', wardCount: 15 },
          { name: 'Kageshwari-Manohara Municipality', wardCount: 9 },
          { name: 'Kirtipur Municipality', wardCount: 10 },
          { name: 'Gokarneshwar Municipality', wardCount: 9 },
          { name: 'Nagarjun Municipality', wardCount: 10 },
          { name: 'Tarakeshwar Municipality', wardCount: 11 },
          { name: 'Tokha Municipality', wardCount: 11 },
          { name: 'Shankharapur Municipality', wardCount: 9 },
          { name: 'Dakshinkali Municipality', wardCount: 9 },
        ],
      },
      {
        name: 'Lalitpur',
        municipalities: [
          { name: 'Lalitpur Metropolitan City', wardCount: 29 },
          { name: 'Mahalaxmi Municipality', wardCount: 10 },
          { name: 'Godawari Municipality', wardCount: 14 },
          { name: 'Konjyosom Rural Municipality', wardCount: 5 },
          { name: 'Bagmati Rural Municipality', wardCount: 7 },
          { name: 'Mahankal Rural Municipality', wardCount: 6 },
        ],
      },
      {
        name: 'Bhaktapur',
        municipalities: [
          { name: 'Bhaktapur Municipality', wardCount: 10 },
          { name: 'Madhyapur Thimi Municipality', wardCount: 9 },
          { name: 'Suryabinayak Municipality', wardCount: 10 },
          { name: 'Changunarayan Municipality', wardCount: 9 },
        ],
      },
      {
        name: 'Chitwan',
        municipalities: [
          { name: 'Bharatpur Metropolitan City', wardCount: 29 },
          { name: 'Ratnanagar Municipality', wardCount: 16 },
          { name: 'Khairhani Municipality', wardCount: 13 },
          { name: 'Rapti Municipality', wardCount: 13 },
          { name: 'Kalika Municipality', wardCount: 11 },
          { name: 'Madi Municipality', wardCount: 9 },
          { name: 'Ichhyakamana Rural Municipality', wardCount: 7 },
        ],
      },
      {
        name: 'Makwanpur',
        municipalities: [
          { name: 'Hetauda Sub-Metropolitan', wardCount: 19 },
          { name: 'Thaha Municipality', wardCount: 12 },
          { name: 'Bhimfedi Rural Municipality', wardCount: 9 },
          { name: 'Makawanpurgadhi Rural Municipality', wardCount: 8 },
          { name: 'Manahari Rural Municipality', wardCount: 9 },
          { name: 'Bakaiya Rural Municipality', wardCount: 12 },
        ],
      },
      {
        name: 'Kavrepalanchok',
        municipalities: [
          { name: 'Dhulikhel Municipality', wardCount: 12 },
          { name: 'Banepa Municipality', wardCount: 14 },
          { name: 'Panauti Municipality', wardCount: 12 },
          { name: 'Panchkhal Municipality', wardCount: 13 },
          { name: 'Namobuddha Municipality', wardCount: 11 },
          { name: 'Mandandeupur Municipality', wardCount: 12 },
        ],
      },
      {
        name: 'Sindhupalchok',
        municipalities: [
          { name: 'Chautara Sangachokgadhi Municipality', wardCount: 14 },
          { name: 'Melamchi Municipality', wardCount: 13 },
          { name: 'Barhabise Municipality', wardCount: 9 },
        ],
      },
      {
        name: 'Nuwakot',
        municipalities: [
          { name: 'Bidur Municipality', wardCount: 13 },
          { name: 'Belkotgadhi Municipality', wardCount: 13 },
        ],
      },
      {
        name: 'Dhading',
        municipalities: [
          { name: 'Nilkantha Municipality', wardCount: 14 },
          { name: 'Dhunibesi Municipality', wardCount: 9 },
        ],
      },
    ],
  },
  {
    id: 'MADHESH',
    name: 'Madhesh Province',
    nameNepali: 'मधेश प्रदेश',
    districts: [
      {
        name: 'Parsa',
        municipalities: [
          { name: 'Birgunj Metropolitan City', wardCount: 32 },
          { name: 'Pokhariya Municipality', wardCount: 10 },
          { name: 'Bahudarmai Municipality', wardCount: 9 },
          { name: 'Parsagadhi Municipality', wardCount: 9 },
        ],
      },
      {
        name: 'Dhanusha',
        municipalities: [
          { name: 'Janakpur Sub-Metropolitan', wardCount: 25 },
          { name: 'Mithila Municipality', wardCount: 11 },
          { name: 'Shahidnagar Municipality', wardCount: 9 },
          { name: 'Sabaila Municipality', wardCount: 13 },
          { name: 'Dhanusadham Municipality', wardCount: 9 },
          { name: 'Chhireshwarnath Municipality', wardCount: 10 },
        ],
      },
      {
        name: 'Siraha',
        municipalities: [
          { name: 'Lahan Municipality', wardCount: 24 },
          { name: 'Siraha Municipality', wardCount: 22 },
          { name: 'Golbazar Municipality', wardCount: 13 },
          { name: 'Mirchaiya Municipality', wardCount: 12 },
          { name: 'Kalyanpur Municipality', wardCount: 12 },
          { name: 'Sukhipur Municipality', wardCount: 10 },
        ],
      },
      {
        name: 'Sarlahi',
        municipalities: [
          { name: 'Malangwa Municipality', wardCount: 12 },
          { name: 'Hariwan Municipality', wardCount: 11 },
          { name: 'Lalbandi Municipality', wardCount: 17 },
          { name: 'Ishworpur Municipality', wardCount: 15 },
          { name: 'Barahathawa Municipality', wardCount: 18 },
          { name: 'Godaita Municipality', wardCount: 12 },
        ],
      },
      {
        name: 'Bara',
        municipalities: [
          { name: 'Kalaiya Sub-Metropolitan', wardCount: 27 },
          { name: 'Jeetpur-Simara Sub-Metropolitan', wardCount: 24 },
          { name: 'Kolhabi Municipality', wardCount: 11 },
          { name: 'Nijgadh Municipality', wardCount: 13 },
          { name: 'Mahagadhimai Municipality', wardCount: 11 },
        ],
      },
      {
        name: 'Rautahat',
        municipalities: [
          { name: 'Gaur Municipality', wardCount: 9 },
          { name: 'Chandrapur Municipality', wardCount: 10 },
          { name: 'Garuda Municipality', wardCount: 9 },
          { name: 'Brindaban Municipality', wardCount: 9 },
        ],
      },
      {
        name: 'Mahottari',
        municipalities: [
          { name: 'Jaleshwar Municipality', wardCount: 12 },
          { name: 'Bardibas Municipality', wardCount: 14 },
          { name: 'Gaushala Municipality', wardCount: 12 },
          { name: 'Bhangaha Municipality', wardCount: 9 },
        ],
      },
      {
        name: 'Saptari',
        municipalities: [
          { name: 'Rajbiraj Municipality', wardCount: 16 },
          { name: 'Kanchanrup Municipality', wardCount: 12 },
          { name: 'Dakneshwari Municipality', wardCount: 10 },
          { name: 'Bodebarsain Municipality', wardCount: 10 },
          { name: 'Hanumannagar Kankalini Municipality', wardCount: 14 },
          { name: 'Shambhunath Municipality', wardCount: 12 },
        ],
      },
    ],
  },
  {
    id: 'GANDAKI',
    name: 'Gandaki Province',
    nameNepali: 'गण्डकी प्रदेश',
    districts: [
      {
        name: 'Kaski',
        municipalities: [
          { name: 'Pokhara Metropolitan City', wardCount: 33 },
          { name: 'Annapurna Rural Municipality', wardCount: 11 },
          { name: 'Machhapuchhre Rural Municipality', wardCount: 9 },
          { name: 'Madi Rural Municipality', wardCount: 12 },
          { name: 'Rupa Rural Municipality', wardCount: 7 },
        ],
      },
      {
        name: 'Tanahun',
        municipalities: [
          { name: 'Byas Municipality', wardCount: 14 },
          { name: 'Shuklagandaki Municipality', wardCount: 12 },
          { name: 'Bhimad Municipality', wardCount: 9 },
          { name: 'Bhanu Municipality', wardCount: 13 },
        ],
      },
      {
        name: 'Gorkha',
        municipalities: [
          { name: 'Gorkha Municipality', wardCount: 14 },
          { name: 'Palungtar Municipality', wardCount: 10 },
        ],
      },
      {
        name: 'Syangja',
        municipalities: [
          { name: 'Putalibazar Municipality', wardCount: 14 },
          { name: 'Waling Municipality', wardCount: 14 },
          { name: 'Chapakot Municipality', wardCount: 10 },
          { name: 'Galyang Municipality', wardCount: 11 },
          { name: 'Bhirkot Municipality', wardCount: 9 },
        ],
      },
      {
        name: 'Nawalpur (Nawalparasi East)',
        municipalities: [
          { name: 'Kawasoti Municipality', wardCount: 17 },
          { name: 'Gaindakot Municipality', wardCount: 18 },
          { name: 'Devchuli Municipality', wardCount: 17 },
          { name: 'Madhyabindu Municipality', wardCount: 15 },
        ],
      },
      {
        name: 'Baglung',
        municipalities: [
          { name: 'Baglung Municipality', wardCount: 14 },
          { name: 'Galkot Municipality', wardCount: 11 },
          { name: 'Jaimuni Municipality', wardCount: 10 },
          { name: 'Dhorpatan Municipality', wardCount: 9 },
        ],
      },
      {
        name: 'Lamjung',
        municipalities: [
          { name: 'Besishahar Municipality', wardCount: 11 },
          { name: 'Sundarbazar Municipality', wardCount: 11 },
          { name: 'Rainas Municipality', wardCount: 10 },
          { name: 'MadhyaNepal Municipality', wardCount: 10 },
        ],
      },
    ],
  },
  {
    id: 'LUMBINI',
    name: 'Lumbini Province',
    nameNepali: 'लुम्बिनी प्रदेश',
    districts: [
      {
        name: 'Rupandehi',
        municipalities: [
          { name: 'Butwal Sub-Metropolitan', wardCount: 19 },
          { name: 'Siddharthanagar (Bhairahawa)', wardCount: 13 },
          { name: 'Tilottama Municipality', wardCount: 17 },
          { name: 'Sainamaina Municipality', wardCount: 11 },
          { name: 'Devdaha Municipality', wardCount: 12 },
          { name: 'Lumbini Sanskritik Municipality', wardCount: 13 },
        ],
      },
      {
        name: 'Dang',
        municipalities: [
          { name: 'Ghorahi Sub-Metropolitan', wardCount: 19 },
          { name: 'Tulsipur Sub-Metropolitan', wardCount: 19 },
          { name: 'Lamahi Municipality', wardCount: 9 },
        ],
      },
      {
        name: 'Banke',
        municipalities: [
          { name: 'Nepalgunj Sub-Metropolitan', wardCount: 23 },
          { name: 'Kohalpur Municipality', wardCount: 15 },
        ],
      },
      {
        name: 'Palpa',
        municipalities: [
          { name: 'Tansen Municipality', wardCount: 14 },
          { name: 'Rampur Municipality', wardCount: 10 },
        ],
      },
      {
        name: 'Kapilvastu',
        municipalities: [
          { name: 'Kapilvastu Municipality', wardCount: 12 },
          { name: 'Banganga Municipality', wardCount: 11 },
          { name: 'Buddhabhumi Municipality', wardCount: 10 },
          { name: 'Shivaraj Municipality', wardCount: 11 },
          { name: 'Krishnanagar Municipality', wardCount: 12 },
          { name: 'Maharajgunj Municipality', wardCount: 11 },
        ],
      },
      {
        name: 'Bardiya',
        municipalities: [
          { name: 'Gulariya Municipality', wardCount: 12 },
          { name: 'Bansgadhi Municipality', wardCount: 9 },
          { name: 'Barbardiya Municipality', wardCount: 11 },
          { name: 'Madhuwan Municipality', wardCount: 9 },
          { name: 'Rajapur Municipality', wardCount: 10 },
          { name: 'Thakurbaba Municipality', wardCount: 9 },
        ],
      },
      {
        name: 'Parasi (Nawalparasi West)',
        municipalities: [
          { name: 'Ramgram Municipality', wardCount: 18 },
          { name: 'Sunwal Municipality', wardCount: 13 },
          { name: 'Bardaghat Municipality', wardCount: 16 },
        ],
      },
    ],
  },
  {
    id: 'KARNALI',
    name: 'Karnali Province',
    nameNepali: 'कर्णाली प्रदेश',
    districts: [
      {
        name: 'Surkhet',
        municipalities: [
          { name: 'Birendranagar Municipality', wardCount: 16 },
          { name: 'Gurbhakot Municipality', wardCount: 14 },
          { name: 'Bheriganga Municipality', wardCount: 13 },
          { name: 'Panchapuri Municipality', wardCount: 11 },
          { name: 'Lekbeshi Municipality', wardCount: 10 },
        ],
      },
      {
        name: 'Dailekh',
        municipalities: [
          { name: 'Narayan Municipality', wardCount: 11 },
          { name: 'Dullu Municipality', wardCount: 13 },
          { name: 'Chamunda Bindrasaini Municipality', wardCount: 9 },
          { name: 'Aathbis Municipality', wardCount: 9 },
        ],
      },
      {
        name: 'Jumla',
        municipalities: [
          { name: 'Chandannath Municipality', wardCount: 10 },
          { name: 'Tatopani Rural Municipality', wardCount: 8 },
          { name: 'Patarasi Rural Municipality', wardCount: 7 },
          { name: 'Kankasundari Rural Municipality', wardCount: 8 },
        ],
      },
      {
        name: 'Salyan',
        municipalities: [
          { name: 'Sharada Municipality', wardCount: 15 },
          { name: 'Bagchaur Municipality', wardCount: 12 },
          { name: 'Bangad Kupinde Municipality', wardCount: 12 },
        ],
      },
    ],
  },
  {
    id: 'SUDURPASHCHIM',
    name: 'Sudurpashchim Province',
    nameNepali: 'सुदूरपश्चिम प्रदेश',
    districts: [
      {
        name: 'Kailali',
        municipalities: [
          { name: 'Dhangadhi Sub-Metropolitan', wardCount: 19 },
          { name: 'Tikapur Municipality', wardCount: 9 },
          { name: 'Godawari Municipality', wardCount: 12 },
          { name: 'Lamki Chuha Municipality', wardCount: 10 },
          { name: 'Ghodaghodi Municipality', wardCount: 12 },
          { name: 'Bhajani Municipality', wardCount: 9 },
          { name: 'Gauriganga Municipality', wardCount: 11 },
        ],
      },
      {
        name: 'Kanchanpur',
        municipalities: [
          { name: 'Bhimdatta (Mahendranagar)', wardCount: 19 },
          { name: 'Bedkot Municipality', wardCount: 10 },
          { name: 'Shuklaphanta Municipality', wardCount: 12 },
          { name: 'Krishnapur Municipality', wardCount: 9 },
          { name: 'Punarbas Municipality', wardCount: 11 },
          { name: 'Belauri Municipality', wardCount: 10 },
          { name: 'Mahakali Municipality', wardCount: 10 },
        ],
      },
      {
        name: 'Doti',
        municipalities: [
          { name: 'Dipayal Silgadhi Municipality', wardCount: 9 },
          { name: 'Shikhar Municipality', wardCount: 11 },
        ],
      },
      {
        name: 'Dadeldhura',
        municipalities: [
          { name: 'Amargadhi Municipality', wardCount: 11 },
          { name: 'Parshuram Municipality', wardCount: 12 },
        ],
      },
      {
        name: 'Baitadi',
        municipalities: [
          { name: 'Dasharathchand Municipality', wardCount: 11 },
          { name: 'Patan Municipality', wardCount: 10 },
          { name: 'Melauli Municipality', wardCount: 9 },
          { name: 'Purchaudi Municipality', wardCount: 10 },
        ],
      },
    ],
  },
];

// Delivery fee is always FREE (रू 0) all over Nepal
export const calculateDeliveryFee = (_provinceId?: string): number => {
  return 0; // Free delivery across all of Nepal
};

// Nepali 10-digit phone validator (98XXXXXXXX, 97XXXXXXXX, 96XXXXXXXX)
export const isValidNepaliPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s-+]/g, '');
  const regex = /^(98|97|96)\d{8}$/;
  return regex.test(cleaned);
};
