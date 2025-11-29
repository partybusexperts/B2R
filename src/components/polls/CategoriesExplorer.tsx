'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Bus,
  CalendarRange,
  Sparkles,
  ShieldCheck,
  ClipboardList,
  HeartHandshake,
  Info,
} from 'lucide-react';

// ---------- Types ----------

type Accent = 'purple' | 'blue' | 'green' | 'amber';

type CategoryItem = {
  slug: string;
  label: string;
  description?: string;
};

type CategorySection = {
  id: string;
  label: string;
  accent: Accent;
  items: CategoryItem[];
};

type CategoryGroup = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  sections: CategorySection[];
};

// ---------- Helpers ----------

const accentToClasses: Record<Accent, { badge: string; border: string; glow: string }> = {
  purple: {
    badge: 'bg-purple-100 text-purple-700',
    border: 'border-purple-200',
    glow: 'shadow-[0_0_30px_rgba(168,85,247,0.25)]',
  },
  blue: {
    badge: 'bg-blue-100 text-blue-700',
    border: 'border-blue-200',
    glow: 'shadow-[0_0_30px_rgba(59,130,246,0.25)]',
  },
  green: {
    badge: 'bg-emerald-100 text-emerald-700',
    border: 'border-emerald-200',
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.25)]',
  },
  amber: {
    badge: 'bg-amber-100 text-amber-700',
    border: 'border-amber-200',
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.25)]',
  },
};

function slugify(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/['’.]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ---------- LOCATION DATA (states + cities) ----------

type RegionId = 'northeast' | 'midwest' | 'south' | 'west';

type StateAbbr =
  | 'al'
  | 'ak'
  | 'az'
  | 'ar'
  | 'ca'
  | 'co'
  | 'ct'
  | 'de'
  | 'fl'
  | 'ga'
  | 'hi'
  | 'id'
  | 'il'
  | 'in'
  | 'ia'
  | 'ks'
  | 'ky'
  | 'la'
  | 'me'
  | 'md'
  | 'ma'
  | 'mi'
  | 'mn'
  | 'ms'
  | 'mo'
  | 'mt'
  | 'ne'
  | 'nv'
  | 'nh'
  | 'nj'
  | 'nm'
  | 'ny'
  | 'nc'
  | 'nd'
  | 'oh'
  | 'ok'
  | 'or'
  | 'pa'
  | 'ri'
  | 'sc'
  | 'sd'
  | 'tn'
  | 'tx'
  | 'ut'
  | 'vt'
  | 'va'
  | 'wa'
  | 'wv'
  | 'wi'
  | 'wy';

type StateConfig = {
  name: string;
  abbr: StateAbbr;
  region: RegionId;
  cities: string[];
};

const LOCATION_STATES: StateConfig[] = [
  // --- SOUTH ---
  {
    name: 'Alabama',
    abbr: 'al',
    region: 'south',
    cities: ['Auburn', 'Birmingham', 'Decatur', 'Dothan', 'Hoover', 'Huntsville', 'Madison', 'Mobile', 'Montgomery', 'Tuscaloosa'],
  },
  {
    name: 'Arkansas',
    abbr: 'ar',
    region: 'south',
    cities: [
      'Bentonville',
      'Conway',
      'Fayetteville',
      'Fort Smith',
      'Jonesboro',
      'Little Rock',
      'North Little Rock',
      'Rogers',
      'Springdale',
    ],
  },
  {
    name: 'Delaware',
    abbr: 'de',
    region: 'northeast',
    cities: ['Wilmington'],
  },
  {
    name: 'Florida',
    abbr: 'fl',
    region: 'south',
    cities: [
      'Apopka',
      'Boca Raton',
      'Bonita Springs',
      'Boynton Beach',
      'Bradenton',
      'Brandon',
      'Cape Coral',
      'Clearwater',
      'Coconut Creek',
      'Coral Springs',
      'Davie',
      'Daytona Beach',
      'Deerfield Beach',
      'Delray Beach',
      'Deltona',
      'Doral',
      'Fort Lauderdale',
      'Fort Myers',
      'Fountainebleau',
      'Gainesville',
      'Hialeah',
      'Hollywood',
      'Homestead',
      'Jacksonville',
      'Jupiter',
      'Kendale Lakes',
      'Kendall',
      'Kissimmee',
      'Lakeland',
      'Largo',
      'Lauderhill',
      'Lehigh Acres',
      'Margate',
      'Melbourne',
      'Miami',
      'Miami Beach',
      'Miami Gardens',
      'Miramar',
      'North Miami',
      'North Port',
      'Ocala',
      'Orlando',
      'Palm Bay',
      'Palm Beach Gardens',
      'Palm Coast',
      'Palm Harbor',
      'Pembroke Pines',
      'Pensacola',
      'Pine Hills',
      'Pinellas Park',
      'Plantation',
      'Poinciana',
      'Pompano Beach',
      'Port Charlotte',
      'Port Orange',
      'Port St. Lucie',
      'Riverview',
      'Sanford',
      'Sarasota',
      'Spring Hill',
      'St. Cloud',
      'St. Petersburg',
      'Sunrise',
      'Tallahassee',
      'Tamarac',
      'Tampa',
      'The Villages',
      'Wellington',
      'Wesley Chapel',
      'West Palm Beach',
      'Weston',
    ],
  },
  {
    name: 'Georgia',
    abbr: 'ga',
    region: 'south',
    cities: [
      'Albany',
      'Alpharetta',
      'Athens',
      'Atlanta',
      'Augusta',
      'Columbus',
      'Johns Creek',
      'Macon',
      'Marietta',
      'Roswell',
      'Sandy Springs',
      'Savannah',
      'Smyrna',
      'Valdosta',
      'Warner Robins',
    ],
  },
  {
    name: 'Kentucky',
    abbr: 'ky',
    region: 'south',
    cities: ['Bowling Green', 'Lexington', 'Louisville', 'Owensboro'],
  },
  {
    name: 'Louisiana',
    abbr: 'la',
    region: 'south',
    cities: ['Baton Rouge', 'Bossier City', 'Kenner', 'Lafayette', 'Lake Charles', 'Metairie', 'New Orleans', 'Shreveport'],
  },
  {
    name: 'Maryland',
    abbr: 'md',
    region: 'south',
    cities: [
      'Baltimore',
      'Bel Air South',
      'Bethesda',
      'Bowie',
      'Columbia',
      'Dundalk',
      'Ellicott City',
      'Frederick',
      'Gaithersburg',
      'Germantown',
      'Glen Burnie',
      'Rockville',
      'Severn',
      'Silver Spring',
      'Towson',
      'Waldorf',
    ],
  },
  {
    name: 'Mississippi',
    abbr: 'ms',
    region: 'south',
    cities: ['Gulfport', 'Jackson', 'Southaven'],
  },
  {
    name: 'North Carolina',
    abbr: 'nc',
    region: 'south',
    cities: [
      'Apex',
      'Asheville',
      'Burlington',
      'Cary',
      'Chapel Hill',
      'Charlotte',
      'Concord',
      'Durham',
      'Fayetteville',
      'Gastonia',
      'Greensboro',
      'Greenville',
      'High Point',
      'Huntersville',
      'Jacksonville',
      'Raleigh',
      'Rocky Mount',
      'Wilmington',
      'Winston Salem',
    ],
  },
  {
    name: 'Oklahoma',
    abbr: 'ok',
    region: 'south',
    cities: ['Broken Arrow', 'Edmond', 'Enid', 'Lawton', 'Moore', 'Norman', 'Oklahoma City', 'Stillwater', 'Tulsa'],
  },
  {
    name: 'South Carolina',
    abbr: 'sc',
    region: 'south',
    cities: ['Charleston', 'Columbia', 'Greenville', 'Mount Pleasant', 'North Charleston', 'Rock Hill', 'Summerville'],
  },
  {
    name: 'Tennessee',
    abbr: 'tn',
    region: 'south',
    cities: [
      'Bartlett',
      'Chattanooga',
      'Clarksville',
      'Collierville',
      'Franklin',
      'Hendersonville',
      'Jackson',
      'Johnson City',
      'Kingsport',
      'Knoxville',
      'Memphis',
      'Murfreesboro',
      'Nashville',
      'Smyrna',
    ],
  },
  {
    name: 'Texas',
    abbr: 'tx',
    region: 'south',
    cities: [
      'Abilene',
      'Allen',
      'Amarillo',
      'Arlington',
      'Atascocita',
      'Austin',
      'Baytown',
      'Beaumont',
      'Brownsville',
      'Bryan',
      'Carrollton',
      'Cedar Park',
      'College Station',
      'Conroe',
      'Corpus Christi',
      'Dallas',
      'Denton',
      'Desoto',
      'Edinburg',
      'El Paso',
      'Euless',
      'Flower Mound',
      'Fort Worth',
      'Frisco',
      'Galveston',
      'Garland',
      'Georgetown',
      'Grand Prairie',
      'Grapevine',
      'Harlingen',
      'Houston',
      'Irving',
      'Killeen',
      'Laredo',
      'League City',
      'Leander',
      'Lewisville',
      'Longview',
      'Lubbock',
      'Mansfield',
      'McAllen',
      'McKinney',
      'Mesquite',
      'Midland',
      'Mission',
      'Missouri City',
      'New Braunfels',
      'North Richland Hills',
      'Odessa',
      'Pasadena',
      'Pearland',
      'Pflugerville',
      'Pharr',
      'Plano',
      'Port Arthur',
      'Richardson',
      'Round Rock',
      'Rowlett',
      'San Angelo',
      'San Antonio',
      'San Marcos',
      'Spring',
      'Sugar Land',
      'Temple',
      'The Woodlands',
      'Tyler',
      'Victoria',
      'Waco',
      'Wichita Falls',
      'Wylie',
    ],
  },
  {
    name: 'Virginia',
    abbr: 'va',
    region: 'south',
    cities: [
      'Arlington',
      'Alexandria',
      'Centreville',
      'Chesapeake',
      'Dale City',
      'Hampton',
      'Harrisonburg',
      'Leesburg',
      'Lynchburg',
      'Newport News',
      'Norfolk',
      'Portsmouth',
      'Reston',
      'Richmond',
      'Roanoke',
      'Suffolk',
      'Virginia Beach',
    ],
  },
  {
    name: 'West Virginia',
    abbr: 'wv',
    region: 'south',
    cities: [],
  },

  // --- WEST ---
  {
    name: 'Alaska',
    abbr: 'ak',
    region: 'west',
    cities: ['Anchorage'],
  },
  {
    name: 'Arizona',
    abbr: 'az',
    region: 'west',
    cities: [
      'Avondale',
      'Buckeye',
      'Casa Grande',
      'Catalina Foothills',
      'Chandler',
      'Flagstaff',
      'Gilbert',
      'Glendale',
      'Goodyear',
      'Lake Havasu City',
      'Maricopa',
      'Mesa',
      'Peoria',
      'Phoenix',
      'Queen Creek',
      'Scottsdale',
      'Surprise',
      'Tempe',
      'Tucson',
      'Yuma',
    ],
  },
  {
    name: 'California',
    abbr: 'ca',
    region: 'west',
    cities: [
      'Alameda',
      'Aliso Viejo',
      'Anaheim',
      'Antioch',
      'Apple Valley',
      'Arcadia',
      'Bakersfield',
      'Baldwin Park',
      'Bellflower',
      'Berkeley',
      'Brentwood',
      'Buena Park',
      'Burbank',
      'Camarillo',
      'Carlsbad',
      'Carmichael',
      'Carson',
      'Castro Valley',
      'Cathedral City',
      'Chico',
      'Chino',
      'Chino Hills',
      'Chula Vista',
      'Citrus Heights',
      'Clovis',
      'Colton',
      'Compton',
      'Concord',
      'Corona',
      'Costa Mesa',
      'Daly City',
      'Davis',
      'Delano',
      'Diamond Bar',
      'Downey',
      'Dublin',
      'East Los Angeles',
      'Eastvale',
      'El Cajon',
      'El Monte',
      'Elk Grove',
      'Encinitas',
      'Escondido',
      'Fairfield',
      'Folsom',
      'Fontana',
      'Fountain Valley',
      'Fremont',
      'Fresno',
      'Fullerton',
      'Garden Grove',
      'Gardena',
      'Gilroy',
      'Glendale',
      'Glendora',
      'Hacienda Heights',
      'Hanford',
      'Hawthorne',
      'Hayward',
      'Hemet',
      'Hesperia',
      'Huntington Beach',
      'Huntington Park',
      'Indio',
      'Inglewood',
      'Irvine',
      'Jurupa Valley',
      'La Habra',
      'Laguna Niguel',
      'Lake Elsinore',
      'Lakewood',
      'Lancaster',
      'Livermore',
      'Lodi',
      'Long Beach',
      'Los Angeles',
      'Lynwood',
      'Madera',
      'Manteca',
      'Menifee',
      'Merced',
      'Mission Viejo',
      'Modesto',
      'Montebello',
      'Moreno Valley',
      'Mountain View',
      'Murrieta',
      'Napa',
      'Newport Beach',
      'Norwalk',
      'Novato',
      'Oakland',
      'Oceanside',
      'Ontario',
      'Orange',
      'Oxnard',
      'Palm Desert',
      'Palmdale',
      'Palo Alto',
      'Paramount',
      'Pasadena',
      'Perris',
      'Petaluma',
      'Pico Rivera',
      'Pittsburg',
      'Placentia',
      'Pleasanton',
      'Pomona',
      'Porterville',
      'Rancho Cordova',
      'Rancho Cucamonga',
      'Redding',
      'Redlands',
      'Redondo Beach',
      'Redwood City',
      'Rialto',
      'Richmond',
      'Riverside',
      'Rocklin',
      'Roseville',
      'Sacramento',
      'Salinas',
      'San Bernardino',
      'San Buenaventura Ventura',
      'San Clemente',
      'San Diego',
      'San Francisco',
      'San Jose',
      'San Leandro',
      'San Marcos',
      'San Mateo',
      'San Rafael',
      'San Ramon',
      'Santa Ana',
      'Santa Barbara',
      'Santa Clara',
      'Santa Clarita',
      'Santa Cruz',
      'Santa Maria',
      'Santa Monica',
      'Santa Rosa',
      'Simi Valley',
      'South Gate',
      'South San Francisco',
      'South Whittier',
      'Stockton',
      'Sunnyvale',
      'Temecula',
      'Thousand Oaks',
      'Torrance',
      'Tracy',
      'Tulare',
      'Turlock',
      'Tustin',
      'Union City',
      'Upland',
      'Vacaville',
      'Vallejo',
      'Victorville',
      'Visalia',
      'Vista',
      'Walnut Creek',
      'Watsonville',
      'West Covina',
      'West Sacramento',
      'Whittier',
      'Woodland',
      'Yorba Linda',
      'Yuba City',
      'Yucaipa',
    ],
  },
  {
    name: 'Colorado',
    abbr: 'co',
    region: 'west',
    cities: [
      'Arvada',
      'Aurora',
      'Boulder',
      'Broomfield',
      'Castle Rock',
      'Centennial',
      'Colorado Springs',
      'Commerce City',
      'Denver',
      'Fort Collins',
      'Grand Junction',
      'Greeley',
      'Lakewood',
      'Longmont',
      'Loveland',
      'Parker',
      'Pueblo',
      'Thornton',
      'Westminster',
    ],
  },
  {
    name: 'Hawaii',
    abbr: 'hi',
    region: 'west',
    cities: ['Honolulu', 'Maui', 'Oahu'],
  },
  {
    name: 'Idaho',
    abbr: 'id',
    region: 'west',
    cities: ['Boise', 'Caldwell', 'Coeur dAlene', 'Idaho Falls', 'Meridian', 'Nampa', 'Pocatello'],
  },
  {
    name: 'Montana',
    abbr: 'mt',
    region: 'west',
    cities: ['Billings', 'Great Falls', 'Missoula'],
  },
  {
    name: 'Nevada',
    abbr: 'nv',
    region: 'west',
    cities: ['Carson City', 'Henderson', 'Las Vegas', 'North Las Vegas', 'Reno'],
  },
  {
    name: 'New Mexico',
    abbr: 'nm',
    region: 'west',
    cities: ['Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe'],
  },
  {
    name: 'Oregon',
    abbr: 'or',
    region: 'west',
    cities: ['Albany', 'Beaverton', 'Bend', 'Corvallis', 'Eugene', 'Gresham', 'Hillsboro', 'Medford', 'Portland', 'Salem', 'Springfield', 'Tigard'],
  },
  {
    name: 'Utah',
    abbr: 'ut',
    region: 'west',
    cities: ['Layton', 'Lehi', 'Logan', 'Ogden', 'Orem', 'Provo', 'Salt Lake City', 'Sandy', 'South Jordan', 'St George', 'Taylorsville', 'West Jordan', 'West Valley City'],
  },
  {
    name: 'Washington',
    abbr: 'wa',
    region: 'west',
    cities: [
      'Auburn',
      'Bellevue',
      'Bellingham',
      'Everett',
      'Federal Way',
      'Kennewick',
      'Kent',
      'Kirkland',
      'Lacey',
      'Lakewood',
      'Marysville',
      'Olympia',
      'Pasco',
      'Redmond',
      'Renton',
      'Richland',
      'Sammamish',
      'Seattle',
      'Spokane',
      'Spokane Valley',
      'Tacoma',
      'Vancouver',
      'Yakima',
    ],
  },
  {
    name: 'Wyoming',
    abbr: 'wy',
    region: 'west',
    cities: ['Casper', 'Cheyenne'],
  },

  // --- NORTHEAST ---
  {
    name: 'Connecticut',
    abbr: 'ct',
    region: 'northeast',
    cities: ['Bridgeport', 'Bristol', 'Danbury', 'Hartford', 'Meriden', 'Milford', 'New Britain', 'New Haven', 'Norwalk', 'Stamford', 'Waterbury', 'West Haven'],
  },
  {
    name: 'Maine',
    abbr: 'me',
    region: 'northeast',
    cities: ['Portland'],
  },
  {
    name: 'Massachusetts',
    abbr: 'ma',
    region: 'northeast',
    cities: [
      'Boston',
      'Brockton',
      'Cambridge',
      'Chicopee',
      'Fall River',
      'Framingham',
      'Haverhill',
      'Lawrence',
      'Lowell',
      'Lynn',
      'Medford',
      'Methuen',
      'New Bedford',
      'Newton',
      'Peabody',
      'Plymouth',
      'Quincy',
      'Revere',
      'Somerville',
      'Springfield',
      'Taunton',
      'Waltham',
      'Weymouth',
      'Worcester',
    ],
  },
  {
    name: 'New Hampshire',
    abbr: 'nh',
    region: 'northeast',
    cities: ['Manchester', 'Nashua'],
  },
  {
    name: 'New Jersey',
    abbr: 'nj',
    region: 'northeast',
    cities: [
      'Bayonne',
      'Brick',
      'Camden',
      'Cherry Hill',
      'Clifton',
      'East Orange',
      'Edison',
      'Elizabeth',
      'Gloucester',
      'Hoboken',
      'Howell',
      'Irvington',
      'Jackson',
      'Jersey City',
      'Lakewood',
      'Middletown',
      'New Brunswick',
      'Newark',
      'North Bergen',
      'Old Bridge',
      'Parsippany-Troy Hills',
      'Passaic',
      'Paterson',
      'Perth Amboy',
      'Piscataway',
      'Plainfield',
      'Toms River',
      'Trenton',
      'Union City',
      'Vineland',
      'Wayne',
      'West New York',
      'Woodbridge',
    ],
  },
  {
    name: 'New York',
    abbr: 'ny',
    region: 'northeast',
    cities: [
      'Albany',
      'Amherst',
      'Babylon',
      'Brentwood',
      'Brookhaven',
      'Brooklyn',
      'Buffalo',
      'Cheektowaga',
      'Clarkstown',
      'Greece',
      'Hempstead',
      'Huntington',
      'Islip',
      'Levittown',
      'Long Island NY',
      'Manhattan',
      'Mount Vernon',
      'New Rochelle',
      'New York City',
      'Oyster Bay',
      'Queens',
      'Rochester',
      'Schenectady',
      'Smithtown',
      'Southampton',
      'Staten Island',
      'Syracuse',
      'The Bronx',
      'Utica',
      'White Plains',
      'Yonkers',
    ],
  },
  {
    name: 'Pennsylvania',
    abbr: 'pa',
    region: 'northeast',
    cities: ['Abington', 'Allentown', 'Armstrong', 'Bensalem', 'Bethlehem', 'Erie', 'Lancaster', 'Philadelphia', 'Pittsburgh', 'Reading', 'Scranton'],
  },
  {
    name: 'Rhode Island',
    abbr: 'ri',
    region: 'northeast',
    cities: ['Cranston', 'Pawtucket', 'Providence', 'Warwick'],
  },
  {
    name: 'Vermont',
    abbr: 'vt',
    region: 'northeast',
    cities: [],
  },

  // --- MIDWEST ---
  {
    name: 'Illinois',
    abbr: 'il',
    region: 'midwest',
    cities: [
      'Arlington Heights',
      'Aurora',
      'Berwyn',
      'Bloomington',
      'Bolingbrook',
      'Capital',
      'Champaign',
      'Chicago',
      'Cicero',
      'Decatur',
      'Des Plaines',
      'Elgin',
      'Evanston',
      'Hoffman Estates',
      'Joliet',
      'Leyden',
      'Mount Prospect',
      'Naperville',
      'New Trier',
      'Oak Lawn',
      'Orland',
      'Orland Park',
      'Palatine',
      'Palos',
      'Peoria',
      'Proviso',
      'Rockford',
      'Schaumburg',
      'Skokie',
      'Springfield',
      'St. Clair',
      'Tinley Park',
      'Waukegan',
      'Wheaton',
    ],
  },
  {
    name: 'Indiana',
    abbr: 'in',
    region: 'midwest',
    cities: [
      'Anderson',
      'Bloomington',
      'Calumet',
      'Carmel',
      'Concord',
      'Delaware',
      'Elkhart',
      'Evansville',
      'Fall Creek',
      'Fishers',
      'Fort Wayne',
      'Gary',
      'Greenwood',
      'Hammond',
      'Indianapolis',
      'Knight',
      'Kokomo',
      'Lafayette',
      'Muncie',
      'Noblesville',
      'North',
      'Penn',
      'South Bend',
      'St. Joseph',
      'Terre Haute',
      'Wayne',
    ],
  },
  {
    name: 'Iowa',
    abbr: 'ia',
    region: 'midwest',
    cities: ['Ames', 'Ankeny', 'Cedar Rapids', 'Council Bluffs', 'Davenport', 'Des Moines', 'Dubuque', 'Iowa City', 'Sioux City', 'Waterloo', 'West Des Moines'],
  },
  {
    name: 'Kansas',
    abbr: 'ks',
    region: 'midwest',
    cities: ['Kansas City', 'Lawrence', 'Lenexa', 'Manhattan', 'Olathe', 'Overland Park', 'Shawnee', 'Topeka', 'Wichita'],
  },
  {
    name: 'Michigan',
    abbr: 'mi',
    region: 'midwest',
    cities: [
      'Ann Arbor',
      'Battle Creek',
      'Canton',
      'Dearborn',
      'Dearborn Heights',
      'Detroit',
      'Farmington Hills',
      'Grand Rapids',
      'Kentwood',
      'Lansing',
      'Livonia',
      'Macomb',
      'Novi',
      'Pontiac',
      'Rochester Hills',
      'Royal Oak',
      'Southfield',
      'St. Clair Shores',
      'Sterling Heights',
      'Taylor',
      'Troy',
      'Warren',
      'Waterford',
      'West Bloomfield',
      'Westland',
    ],
  },
  {
    name: 'Minnesota',
    abbr: 'mn',
    region: 'midwest',
    cities: [
      'Apple Valley',
      'Blaine',
      'Bloomington',
      'Brooklyn Park',
      'Burnsville',
      'Coon Rapids',
      'Duluth',
      'Eagan',
      'Eden Prairie',
      'Edina',
      'Lakeville',
      'Maple Grove',
      'Minneapolis',
      'Minnetonka',
      'Plymouth',
      'Rochester',
      'St. Cloud',
      'St. Paul',
      'Woodbury',
    ],
  },
  {
    name: 'Missouri',
    abbr: 'mo',
    region: 'midwest',
    cities: ['Blue Springs', 'Columbia', 'Florissant', 'Independence', 'Joplin', 'Kansas City', 'Lees Summit', 'O Fallon', 'Springfield', 'St Louis', 'St. Charles', 'St. Joseph', 'St. Peters'],
  },
  {
    name: 'Nebraska',
    abbr: 'ne',
    region: 'midwest',
    cities: ['Bellevue', 'Grand Island', 'Lincoln', 'Omaha'],
  },
  {
    name: 'North Dakota',
    abbr: 'nd',
    region: 'midwest',
    cities: ['Bismarck', 'Fargo', 'Grand Forks'],
  },
  {
    name: 'Ohio',
    abbr: 'oh',
    region: 'midwest',
    cities: [
      'Akron',
      'Canton',
      'Cincinnati',
      'Cleveland',
      'Columbus',
      'Dayton',
      'Elyria',
      'Hamilton',
      'Lake',
      'Lakewood',
      'Lawrence',
      'Lorain',
      'Parma',
      'Springfield',
      'Toledo',
      'West Chester',
      'Youngstown',
    ],
  },
  {
    name: 'South Dakota',
    abbr: 'sd',
    region: 'midwest',
    cities: ['Rapid City', 'Sioux Falls'],
  },
  {
    name: 'Wisconsin',
    abbr: 'wi',
    region: 'midwest',
    cities: ['Appleton', 'Eau Claire', 'Green Bay', 'Janesville', 'Kenosha', 'La Crosse', 'Madison', 'Milwaukee', 'Oshkosh', 'Racine', 'Waukesha', 'West Allis'],
  },
];

// region accents
const REGION_ACCENT: Record<RegionId, Accent> = {
  northeast: 'purple',
  midwest: 'blue',
  south: 'green',
  west: 'amber',
};

// ---------- Build LOCATION groups from state data ----------

function buildLocationGroups(): CategoryGroup[] {
  const regionBuckets: Record<RegionId, CategorySection[]> = {
    northeast: [],
    midwest: [],
    south: [],
    west: [],
  };

  for (const state of LOCATION_STATES) {
    const accent = REGION_ACCENT[state.region];
    const sectionId = slugify(state.name);

    const uniqueCities = Array.from(new Set(state.cities));

    const items: CategoryItem[] = [];

    // State-level item
    items.push({
      slug: slugify(state.name),
      label: state.name,
      description: `All polls for ${state.name}`,
    });

    // City items
    uniqueCities
      .slice()
      .sort((a, b) => a.localeCompare(b))
      .forEach((city) => {
        items.push({
          slug: `${slugify(city)}-${state.abbr}`,
          label: city,
          description: `${city}, ${state.name} polls`,
        });
      });

    regionBuckets[state.region].push({
      id: sectionId,
      label: state.name,
      accent,
      items,
    });
  }

  // sort states within each region
  (Object.keys(regionBuckets) as RegionId[]).forEach((region) => {
    regionBuckets[region].sort((a, b) => a.label.localeCompare(b.label));
  });

  const groups: CategoryGroup[] = [
    {
      id: 'locations-northeast',
      label: 'Northeast Locations',
      icon: MapPin,
      sections: regionBuckets.northeast,
    },
    {
      id: 'locations-midwest',
      label: 'Midwest Locations',
      icon: MapPin,
      sections: regionBuckets.midwest,
    },
    {
      id: 'locations-south',
      label: 'South Locations',
      icon: MapPin,
      sections: regionBuckets.south,
    },
    {
      id: 'locations-west',
      label: 'West Locations',
      icon: MapPin,
      sections: regionBuckets.west,
    },
  ].filter((g) => g.sections.length > 0);

  return groups;
}

// ---------- OTHER CATEGORY GROUPS (vehicles, events, etc.) ----------

const FLEET_GROUP: CategoryGroup = {
  id: 'fleet',
  label: 'Vehicles & Fleet',
  icon: Bus,
  sections: [
    {
      id: 'buses-shuttles',
      label: 'Buses & Shuttles',
      accent: 'blue',
      items: [
        { slug: 'coach-bus', label: 'Coach Bus' },
        { slug: 'minibus', label: 'Minibus' },
        { slug: 'party-bus', label: 'Party Bus' },
        { slug: 'party-van', label: 'Party Van' },
        { slug: 'shuttle-bus', label: 'Shuttle Bus' },
      ],
    },
    {
      id: 'limousines',
      label: 'Limousines',
      accent: 'purple',
      items: [
        { slug: 'stretch-limo', label: 'Stretch Limo' },
        { slug: 'suv-limo', label: 'SUV Limo' },
      ],
    },
    {
      id: 'sedans-suvs',
      label: 'Sedans & SUVs',
      accent: 'green',
      items: [
        { slug: 'black-car-sedan', label: 'Black Car Sedan' },
        { slug: 'luxury-suv', label: 'Luxury SUV' },
        { slug: 'sedan', label: 'Sedan' },
      ],
    },
    {
      id: 'specialty-vehicles',
      label: 'Specialty Vehicles',
      accent: 'amber',
      items: [
        { slug: 'classic-car', label: 'Classic Car' },
        { slug: 'executive-sprinter', label: 'Executive Sprinter' },
        { slug: 'trolley', label: 'Trolley' },
      ],
    },
  ],
};

const EVENTS_GROUP: CategoryGroup = {
  id: 'events',
  label: 'Events & Occasions',
  icon: CalendarRange,
  sections: [
    {
      id: 'parties-celebrations',
      label: 'Parties & Celebrations',
      accent: 'purple',
      items: [
        { slug: 'after-parties', label: 'After Parties' },
        { slug: 'anniversary-parties', label: 'Anniversary Parties' },
        { slug: 'bachelor-parties', label: 'Bachelor Parties' },
        { slug: 'bachelorette-parties', label: 'Bachelorette Parties' },
        { slug: 'bar-bat-mitzvahs', label: 'Bar/Bat Mitzvahs' },
        { slug: 'birthday-parties', label: 'Birthday Parties' },
        { slug: 'corporate-parties', label: 'Corporate Parties' },
        { slug: 'girls-nights-out', label: 'Girls Nights Out' },
        { slug: 'guys-nights-out', label: 'Guys Nights Out' },
        { slug: 'kids-parties', label: 'Kids Parties' },
        { slug: 'quinceanera-parties', label: 'Quinceañera Parties' },
        { slug: 'retirement-parties', label: 'Retirement Parties' },
        { slug: 'sweet-sixteen', label: 'Sweet Sixteen' },
      ],
    },
    {
      id: 'school-youth',
      label: 'School & Youth',
      accent: 'blue',
      items: [
        { slug: 'graduation', label: 'Graduation' },
        { slug: 'homecoming', label: 'Homecoming' },
        { slug: 'prom', label: 'Prom' },
        { slug: 'school-field-trips', label: 'School Field Trips' },
        { slug: 'winter-formals', label: 'Winter Formals' },
      ],
    },
    {
      id: 'tours-outings',
      label: 'Tours & Outings',
      accent: 'green',
      items: [
        { slug: 'bar-crawls', label: 'Bar Crawls' },
        { slug: 'brewery-tours', label: 'Brewery Tours' },
        { slug: 'casino-tours', label: 'Casino Tours' },
        { slug: 'church-outings', label: 'Church Outings' },
        { slug: 'concerts', label: 'Concerts' },
        { slug: 'dinners-out', label: 'Dinners Out' },
        { slug: 'festivals', label: 'Festivals' },
        { slug: 'haunted-houses', label: 'Haunted Houses' },
        { slug: 'holiday-lights-tours', label: 'Holiday Lights Tours' },
        { slug: 'parades', label: 'Parades' },
        { slug: 'sporting-events', label: 'Sporting Events' },
        { slug: 'wine-tours', label: 'Wine Tours' },
      ],
    },
    {
      id: 'corporate-professional',
      label: 'Corporate & Professional',
      accent: 'amber',
      items: [
        { slug: 'corporate-services', label: 'Corporate Services' },
        { slug: 'employee-shuttles', label: 'Employee Shuttles' },
        { slug: 'rehearsal-dinners', label: 'Rehearsal Dinners' },
        { slug: 'team-building', label: 'Team Building' },
      ],
    },
    {
      id: 'weddings-special',
      label: 'Weddings & Special Days',
      accent: 'purple',
      items: [{ slug: 'weddings', label: 'Weddings' }],
    },
    {
      id: 'holidays-seasonal',
      label: 'Holidays & Seasonal',
      accent: 'green',
      items: [
        { slug: 'christmas', label: 'Christmas' },
        { slug: 'new-years-eve', label: 'New Years Eve' },
        { slug: 'thanksgiving', label: 'Thanksgiving' },
      ],
    },
  ],
};

const AMENITIES_GROUP: CategoryGroup = {
  id: 'amenities',
  label: 'Amenities & Features',
  icon: Sparkles,
  sections: [
    {
      id: 'seating-comfort',
      label: 'Seating & Comfort',
      accent: 'green',
      items: [
        { slug: 'armrests', label: 'Armrests' },
        { slug: 'cushioned-seats', label: 'Cushioned Seats' },
        { slug: 'footrests', label: 'Footrests' },
        { slug: 'headrests', label: 'Headrests' },
        { slug: 'heated-seats', label: 'Heated Seats' },
        { slug: 'leather-seating', label: 'Leather Seating' },
        { slug: 'leg-rests', label: 'Leg Rests' },
        { slug: 'massage-seats', label: 'Massage Seats' },
        { slug: 'plush-reclining-seats', label: 'Plush Reclining Seats' },
        { slug: 'reclining-seats', label: 'Reclining Seats' },
        { slug: 'seating', label: 'General Seating' },
        { slug: 'ventilated-seats', label: 'Ventilated Seats' },
        { slug: 'wrap-around-seating', label: 'Wrap-Around Seating' },
      ],
    },
    {
      id: 'entertainment-media',
      label: 'Entertainment & Media',
      accent: 'purple',
      items: [
        { slug: 'audio', label: 'Audio' },
        { slug: 'bluetooth-connectivity', label: 'Bluetooth Connectivity' },
        { slug: 'bluetooth-sound', label: 'Bluetooth Sound' },
        { slug: 'built-in-screens', label: 'Built-In Screens' },
        { slug: 'dance-pole', label: 'Dance Pole' },
        { slug: 'dropdown-screens', label: 'Dropdown Screens' },
        { slug: 'dvd-player', label: 'DVD Player' },
        { slug: 'entertainment', label: 'General Entertainment' },
        { slug: 'flat-screen-tvs', label: 'Flat-Screen TVs' },
        { slug: 'karaoke-system', label: 'Karaoke System' },
        { slug: 'led-light-show', label: 'LED Light Show' },
        { slug: 'laser-lights', label: 'Laser Lights' },
        { slug: 'mood-lighting', label: 'Mood Lighting' },
        { slug: 'neon-accents', label: 'Neon Accents' },
        { slug: 'satellite-radio', label: 'Satellite Radio' },
        { slug: 'strobe-lights', label: 'Strobe Lights' },
        { slug: 'surround-sound-system', label: 'Surround Sound System' },
        { slug: 'surround-sound-speakers', label: 'Surround Sound Speakers' },
        { slug: 'tv-screens', label: 'TV Screens' },
        { slug: 'video-game-console', label: 'Video Game Console' },
      ],
    },
    {
      id: 'bar-refreshments',
      label: 'Bar & Refreshments',
      accent: 'amber',
      items: [
        { slug: 'bar-area', label: 'Bar Area' },
        { slug: 'bottle-holders', label: 'Bottle Holders' },
        { slug: 'champagne-glasses', label: 'Champagne Glasses' },
        { slug: 'coolers', label: 'Coolers' },
        { slug: 'coolers-ice', label: 'Coolers & Ice' },
        { slug: 'ice-buckets', label: 'Ice Buckets' },
        { slug: 'mini-bar', label: 'Mini Bar' },
        { slug: 'refrigerator', label: 'Refrigerator' },
      ],
    },
    {
      id: 'storage-convenience',
      label: 'Storage & Convenience',
      accent: 'blue',
      items: [
        { slug: 'coat-hooks', label: 'Coat Hooks' },
        { slug: 'cup-holders', label: 'Cup Holders' },
        { slug: 'luggage-storage', label: 'Luggage Storage' },
        { slug: 'overhead-bins', label: 'Overhead Bins' },
        { slug: 'overhead-compartments', label: 'Overhead Compartments' },
        { slug: 'overhead-storage', label: 'Overhead Storage' },
        { slug: 'tray-tables', label: 'Tray Tables' },
        { slug: 'under-bus-luggage-bays', label: 'Under-Bus Luggage Bays' },
        { slug: 'undercarriage-luggage-space', label: 'Undercarriage Luggage Space' },
      ],
    },
    {
      id: 'climate-environment',
      label: 'Climate & Environment',
      accent: 'green',
      items: [
        { slug: 'air-conditioning', label: 'Air Conditioning' },
        { slug: 'air-purifier', label: 'Air Purifier' },
        { slug: 'climate-control', label: 'Climate Control' },
        { slug: 'heating', label: 'Heating' },
        { slug: 'individual-airflow-controls', label: 'Individual Airflow Controls' },
        { slug: 'individual-overhead-vents', label: 'Individual Overhead Vents' },
      ],
    },
    {
      id: 'power-connectivity',
      label: 'Power & Connectivity',
      accent: 'blue',
      items: [
        { slug: 'power-charging', label: 'Power & Charging' },
        { slug: 'power-outlets', label: 'Power Outlets' },
        { slug: 'usb-charging', label: 'USB Charging' },
        { slug: 'usb-ports', label: 'USB Ports' },
        { slug: 'wi-fi', label: 'Wi-Fi' },
        { slug: 'wifi-connectivity', label: 'WiFi Connectivity' },
        { slug: 'wifi-hotspot', label: 'WiFi Hotspot' },
      ],
    },
    {
      id: 'restroom-hygiene',
      label: 'Restroom & Hygiene',
      accent: 'amber',
      items: [
        { slug: 'compact-bathroom', label: 'Compact Bathroom' },
        { slug: 'hand-sanitizer-dispenser', label: 'Hand Sanitizer Dispenser' },
        { slug: 'hand-soap-in-restroom', label: 'Hand Soap in Restroom' },
        { slug: 'onboard-restrooms', label: 'Onboard Restrooms' },
        { slug: 'paper-towels-in-restroom', label: 'Paper Towels in Restroom' },
        { slug: 'restroom', label: 'Restroom' },
        { slug: 'trash-receptacle', label: 'Trash Receptacle' },
        { slug: 'uv-sanitizer', label: 'UV Sanitizer' },
        { slug: 'wastebasket', label: 'Wastebasket' },
        { slug: 'wipes-container', label: 'Wipes Container' },
      ],
    },
    {
      id: 'safety-emergency',
      label: 'Safety & Emergency',
      accent: 'red' as Accent, // tailwind-wise it's fine; styling will still work
      items: [
        { slug: 'emergency-exits', label: 'Emergency Exits' },
        { slug: 'emergency-kit', label: 'Emergency Kit' },
        { slug: 'first-aid-kits', label: 'First Aid Kits' },
        { slug: 'first-aid-supplies', label: 'First Aid Supplies' },
        { slug: 'seat-belts', label: 'Seat Belts' },
        { slug: 'tire-pressure-monitoring', label: 'Tire Pressure Monitoring' },
        { slug: 'vehicle-tracking', label: 'Vehicle Tracking' },
      ],
    },
    {
      id: 'exterior-design',
      label: 'Exterior & Design',
      accent: 'purple',
      items: [
        { slug: 'alloy-wheels', label: 'Alloy Wheels' },
        { slug: 'backup-camera', label: 'Backup Camera' },
        { slug: 'chrome-accents', label: 'Chrome Accents' },
        { slug: 'custom-interiors', label: 'Custom Interiors' },
        { slug: 'custom-paint-job', label: 'Custom Paint Job' },
        { slug: 'extended-wheelbase', label: 'Extended Wheelbase' },
        { slug: 'fiber-optic-roof', label: 'Fiber Optic Roof' },
        { slug: 'parking-sensors', label: 'Parking Sensors' },
        { slug: 'plush-carpeting', label: 'Plush Carpeting' },
        { slug: 'privacy-shades', label: 'Privacy Shades' },
        { slug: 'starlight-ceiling', label: 'Starlight Ceiling' },
        { slug: 'stretch-design', label: 'Stretch Design' },
        { slug: 'sunroof', label: 'Sunroof' },
        { slug: 'tinted-windows', label: 'Tinted Windows' },
      ],
    },
    {
      id: 'other-amenities',
      label: 'Other Amenities',
      accent: 'green',
      items: [
        { slug: 'bottle-openers', label: 'Bottle Openers' },
        { slug: 'fog-machine', label: 'Fog Machine' },
        { slug: 'gps-navigation', label: 'GPS Navigation' },
        { slug: 'intercom-system', label: 'Intercom System' },
        { slug: 'mint-dispenser', label: 'Mint Dispenser' },
        { slug: 'photo-booth-setup', label: 'Photo Booth Setup' },
        { slug: 'privacy-divider', label: 'Privacy Divider' },
        { slug: 'reading-lights', label: 'Reading Lights' },
        { slug: 'smoke-machine', label: 'Smoke Machine' },
        { slug: 'tissue-box', label: 'Tissue Box' },
        { slug: 'touchscreen-controls', label: 'Touchscreen Controls' },
        { slug: 'trash-receptacles', label: 'Trash Receptacles' },
        { slug: 'waste-receptacle', label: 'Waste Receptacle' },
      ],
    },
  ],
};

// Accessibility, experiences, booking/planning, etc.
const ACCESSIBILITY_GROUP: CategoryGroup = {
  id: 'accessibility',
  label: 'Accessibility & Handicap',
  icon: ShieldCheck,
  sections: [
    {
      id: 'accessibility-core',
      label: 'Accessibility',
      accent: 'blue',
      items: [
        { slug: 'accessibility-experience', label: 'Accessibility Experience' },
        { slug: 'booster-seats', label: 'Booster Seats' },
        { slug: 'child-seats', label: 'Child Seats' },
        { slug: 'handicap-seating', label: 'Handicap Seating' },
        { slug: 'pet-friendly-options', label: 'Pet-Friendly Options' },
        { slug: 'ramp-access', label: 'Ramp Access' },
        { slug: 'seatbelts-child-seats', label: 'Seatbelts & Child Seats' },
        { slug: 'wheelchair', label: 'Wheelchair' },
        { slug: 'wheelchair-lift', label: 'Wheelchair Lift' },
      ],
    },
  ],
};

const EXPERIENCE_GROUP: CategoryGroup = {
  id: 'experiences',
  label: 'Customer Experiences',
  icon: HeartHandshake,
  sections: [
    {
      id: 'positive-experiences',
      label: 'Positive Experiences',
      accent: 'green',
      items: [
        { slug: 'best-driver-moments', label: 'Best Driver Moments' },
        { slug: 'overall-satisfaction', label: 'Overall Satisfaction' },
      ],
    },
    {
      id: 'negative-experiences',
      label: 'Negative Experiences & Issues',
      accent: 'amber',
      items: [
        { slug: 'damage-cleanup-stories', label: 'Damage/Cleanup Stories' },
        { slug: 'double-booked-snafus', label: 'Double-Booked Snafus' },
        { slug: 'equipment-failures', label: 'Equipment Failures' },
        { slug: 'found-items-stories', label: 'Found Items Stories' },
        { slug: 'issue-resolution', label: 'Issue Resolution' },
        { slug: 'nightmare-traffic', label: 'Nightmare Traffic' },
        { slug: 'overcapacity-problems', label: 'Overcapacity Problems' },
        { slug: 'payment-issues', label: 'Payment Issues' },
        { slug: 'weather-disaster-stories', label: 'Weather Disaster Stories' },
        { slug: 'worst-pickup-experience', label: 'Worst Pickup Experience' },
        { slug: 'wrong-destination', label: 'Wrong Destination' },
      ],
    },
    {
      id: 'comfort-safety',
      label: 'Comfort & Safety',
      accent: 'blue',
      items: [
        { slug: 'comfort-cleanliness', label: 'Comfort & Cleanliness' },
        { slug: 'driver-professionalism', label: 'Driver Professionalism' },
        { slug: 'reliability-punctuality', label: 'Reliability & Punctuality' },
      ],
    },
    {
      id: 'other-experiences',
      label: 'Other Experiences & Logistics',
      accent: 'purple',
      items: [
        { slug: 'airport-procedures', label: 'Airport Procedures' },
        { slug: 'cross-border-travel', label: 'Cross-State/Border Travel' },
        { slug: 'event-staging-parking', label: 'Event Staging & Parking' },
        { slug: 'luggage-handling', label: 'Luggage Handling' },
        { slug: 'music-preferences', label: 'Music Preferences' },
        { slug: 'operations-logistics', label: 'Operations & Logistics' },
        { slug: 'pickup-dropoff-zones', label: 'Pickup/Dropoff Zones' },
        { slug: 'seasonality-trends', label: 'Seasonality Trends' },
      ],
    },
  ],
};

const POLICY_GROUP: CategoryGroup = {
  id: 'policies',
  label: 'Policies & Procedures',
  icon: ClipboardList,
  sections: [
    {
      id: 'core-policies',
      label: 'Policies',
      accent: 'amber',
      items: [
        { slug: 'alcohol-policy', label: 'Alcohol Policy' },
        { slug: 'cancellations', label: 'Cancellations' },
        { slug: 'deposits', label: 'Deposits' },
        { slug: 'driver-hours-regs', label: 'Driver Hours & Regulations' },
        { slug: 'emergency-procedures', label: 'Emergency Procedures' },
        { slug: 'gratuity', label: 'Gratuity/Tips' },
        { slug: 'incident-reporting', label: 'Incident Reporting' },
        { slug: 'lost-and-found', label: 'Lost & Found' },
        { slug: 'minimum-hours', label: 'Minimum Hours' },
        { slug: 'overtime', label: 'Overtime' },
        { slug: 'smoking-policy', label: 'Smoking Policy' },
      ],
    },
  ],
};

const BOOKING_GROUP: CategoryGroup = {
  id: 'booking-planning',
  label: 'Booking & Planning',
  icon: Info,
  sections: [
    {
      id: 'booking-planning-core',
      label: 'Booking & Planning',
      accent: 'blue',
      items: [
        { slug: 'booking-experience', label: 'Booking Experience' },
        { slug: 'booking-lead-times', label: 'Booking Lead Times' },
        { slug: 'communication-preferences', label: 'Communication Preferences' },
        { slug: 'corporate-discounts', label: 'Corporate Discounts' },
        { slug: 'multi-stop-itineraries', label: 'Multi-Stop Itineraries' },
        { slug: 'peak-days-times', label: 'Peak Days & Times' },
        { slug: 'payment-methods', label: 'Payment Methods' },
        { slug: 'pickup-window', label: 'Pickup Window' },
        { slug: 'route-planning', label: 'Route Planning' },
        { slug: 'traffic-weather-mitigation', label: 'Traffic & Weather Mitigation' },
        { slug: 'travel-distance', label: 'Travel Distance' },
        { slug: 'vip-protocol', label: 'VIP Protocol' },
        { slug: 'wait-time-windows', label: 'Wait-Time Windows' },
        { slug: 'pricing', label: 'Pricing' }, // moved here from "Other"
      ],
    },
  ],
};

const STATS_GROUP: CategoryGroup = {
  id: 'stats-facts',
  label: 'Stats & Myths',
  icon: Info,
  sections: [
    {
      id: 'stats-facts-core',
      label: 'Statistics & Facts',
      accent: 'purple',
      items: [
        { slug: 'fleet-size-stats', label: 'Fleet Size Statistics' },
        { slug: 'myths-vs-facts', label: 'Myths vs Facts' },
      ],
    },
  ],
};

// ---------- BUILD ALL GROUPS ----------

const ALL_GROUPS: CategoryGroup[] = [
  FLEET_GROUP,
  EVENTS_GROUP,
  AMENITIES_GROUP,
  ACCESSIBILITY_GROUP,
  EXPERIENCE_GROUP,
  POLICY_GROUP,
  BOOKING_GROUP,
  STATS_GROUP,
  ...buildLocationGroups(),
];

// ---------- UI COMPONENT ----------

export default function CategoriesExplorer() {
  const [activeGroupId, setActiveGroupId] = useState<string>(ALL_GROUPS[0]?.id ?? '');

  const activeGroup = ALL_GROUPS.find((g) => g.id === activeGroupId) ?? ALL_GROUPS[0];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Poll Categories
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Browse all {ALL_GROUPS.length} category families — vehicles, events, amenities,
            customer stories, and every major US city we serve.
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[260px,minmax(0,1fr)]">
        {/* Left: group selector */}
        <aside className="rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Category Families
          </div>
          <div className="flex flex-col gap-1">
            {ALL_GROUPS.map((group) => {
              const Icon = group.icon;
              const isActive = group.id === activeGroupId;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setActiveGroupId(group.id)}
                  className={
                    'flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm transition ' +
                    (isActive
                      ? 'bg-slate-900 text-white shadow'
                      : 'text-slate-700 hover:bg-slate-100')
                  }
                >
                  <span
                    className={
                      'flex h-7 w-7 items-center justify-center rounded-full border text-[0.7rem] ' +
                      (isActive ? 'border-slate-700 bg-slate-800/90' : 'border-slate-200 bg-white')
                    }
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex-1 text-left">{group.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right: active group content */}
        <main className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              {activeGroup.label}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Click any tile to jump into polls for that vehicle, amenity, policy, or location.
            </p>
          </div>

          <div className="space-y-8">
            {activeGroup.sections.map((section) => {
              const styles = accentToClasses[section.accent] || accentToClasses.blue;

              return (
                <section key={section.id} className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={
                          'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ' +
                          styles.badge
                        }
                      >
                        {section.label}
                      </div>
                      <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        {section.items.length} options
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {section.items.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/polls?category=${encodeURIComponent(item.slug)}`}
                        className={
                          'group relative overflow-hidden rounded-2xl border bg-white/90 p-3 text-left text-sm shadow-sm transition ' +
                          styles.border +
                          ' hover:-translate-y-0.5 hover:bg-white hover:' +
                          styles.glow
                        }
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-medium text-slate-900 group-hover:text-slate-950">
                              {item.label}
                            </div>
                            <span className="text-[10px] uppercase tracking-wide text-slate-400">
                              View polls
                            </span>
                          </div>
                          {item.description && (
                            <p className="line-clamp-2 text-[11px] text-slate-500">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 opacity-0 transition group-hover:opacity-100 bg-gradient-to-r from-slate-900/80 via-slate-700/80 to-slate-900/80" />
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
