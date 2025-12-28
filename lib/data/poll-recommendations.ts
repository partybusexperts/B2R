export interface CategoryRecommendation {
  category: string;
  title: string;
  description: string;
  relatedCategories: string[];
}

export const CATEGORY_RECOMMENDATIONS: Record<string, CategoryRecommendation> = {
  "prom": {
    category: "prom",
    title: "Prom Night Transportation",
    description: "Making prom unforgettable with the perfect ride",
    relatedCategories: ["weddings", "graduation", "homecoming", "bachelor-parties", "bachelorette-parties", "party-bus"],
  },
  "weddings": {
    category: "weddings",
    title: "Wedding Transportation",
    description: "Elegant transport for your special day",
    relatedCategories: ["bachelor-parties", "bachelorette-parties", "prom", "stretch-limo", "party-bus", "coach-bus"],
  },
  "bachelor-parties": {
    category: "bachelor-parties",
    title: "Bachelor Party Transportation",
    description: "Epic rides for legendary celebrations",
    relatedCategories: ["bachelorette-parties", "weddings", "brewery-tours", "sporting-events", "concerts", "party-bus"],
  },
  "bachelorette-parties": {
    category: "bachelorette-parties",
    title: "Bachelorette Party Transportation",
    description: "Stylish transport for the bride tribe",
    relatedCategories: ["bachelor-parties", "weddings", "wine-tours", "concerts", "after-parties", "stretch-limo"],
  },
  "graduation": {
    category: "graduation",
    title: "Graduation Transportation",
    description: "Celebrate your achievement in style",
    relatedCategories: ["prom", "homecoming", "party-bus", "stretch-limo", "after-parties", "entertainment-tours"],
  },
  "homecoming": {
    category: "homecoming",
    title: "Homecoming Transportation",
    description: "Make homecoming night special",
    relatedCategories: ["prom", "graduation", "party-bus", "stretch-limo", "sporting-events", "after-parties"],
  },
  "corporate-discounts": {
    category: "corporate-discounts",
    title: "Corporate Transportation",
    description: "Professional transport for business events",
    relatedCategories: ["coach-bus", "stretch-limo", "entertainment-tours", "sporting-events", "pricing", "booking-lead-times"],
  },
  "party-bus": {
    category: "party-bus",
    title: "Party Bus Rentals",
    description: "The ultimate party on wheels",
    relatedCategories: ["stretch-limo", "bachelor-parties", "bachelorette-parties", "prom", "concerts", "after-parties"],
  },
  "stretch-limo": {
    category: "stretch-limo",
    title: "Limousine Services",
    description: "Luxury transportation for any occasion",
    relatedCategories: ["party-bus", "weddings", "prom", "corporate-discounts", "graduation", "homecoming"],
  },
  "limo": {
    category: "limo",
    title: "Limousine Services",
    description: "Luxury transportation for any occasion",
    relatedCategories: ["stretch-limo", "party-bus", "weddings", "prom", "corporate-discounts", "graduation"],
  },
  "coach-bus": {
    category: "coach-bus",
    title: "Coach Bus Rentals",
    description: "Comfortable group travel",
    relatedCategories: ["corporate-discounts", "sporting-events", "entertainment-tours", "party-bus", "weddings", "concerts"],
  },
  "concerts": {
    category: "concerts",
    title: "Concert Transportation",
    description: "Get to the show in style",
    relatedCategories: ["party-bus", "stretch-limo", "after-parties", "sporting-events", "entertainment-tours", "bachelor-parties"],
  },
  "sporting-events": {
    category: "sporting-events",
    title: "Sports Event Transportation",
    description: "Tailgate and travel with your crew",
    relatedCategories: ["party-bus", "coach-bus", "concerts", "bachelor-parties", "corporate-discounts", "entertainment-tours"],
  },
  "wine-tours": {
    category: "wine-tours",
    title: "Wine Tour Transportation",
    description: "Sip and travel safely",
    relatedCategories: ["brewery-tours", "bachelorette-parties", "stretch-limo", "party-bus", "weddings", "entertainment-tours"],
  },
  "brewery-tours": {
    category: "brewery-tours",
    title: "Brewery Tour Transportation",
    description: "Craft beer adventures await",
    relatedCategories: ["wine-tours", "bachelor-parties", "party-bus", "sporting-events", "entertainment-tours", "after-parties"],
  },
  "after-parties": {
    category: "after-parties",
    title: "After Party Transportation",
    description: "Keep the celebration going",
    relatedCategories: ["party-bus", "concerts", "prom", "graduation", "homecoming", "bachelor-parties"],
  },
  "entertainment-tours": {
    category: "entertainment-tours",
    title: "Entertainment Tours",
    description: "Experience the best attractions",
    relatedCategories: ["wine-tours", "brewery-tours", "concerts", "sporting-events", "party-bus", "coach-bus"],
  },
  "pricing": {
    category: "pricing",
    title: "Pricing & Costs",
    description: "Understanding transportation costs",
    relatedCategories: ["booking-lead-times", "corporate-discounts", "party-bus", "stretch-limo", "coach-bus", "weddings"],
  },
  "booking-lead-times": {
    category: "booking-lead-times",
    title: "Booking Lead Times",
    description: "When to book your transportation",
    relatedCategories: ["pricing", "corporate-discounts", "weddings", "prom", "party-bus", "stretch-limo"],
  },
};

export const STATE_CITY_MAPPING: Record<string, string[]> = {
  "alaska": ["anchorage", "fairbanks", "juneau", "sitka", "ketchikan", "wasilla"],
  "alabama": ["birmingham", "montgomery", "huntsville", "mobile", "tuscaloosa", "hoover"],
  "arizona": ["phoenix", "tucson", "mesa", "chandler", "scottsdale", "glendale"],
  "arkansas": ["little-rock", "fort-smith", "fayetteville", "springdale", "jonesboro", "rogers"],
  "california": ["los-angeles", "san-francisco", "san-diego", "sacramento", "san-jose", "oakland"],
  "colorado": ["denver", "colorado-springs", "aurora", "fort-collins", "lakewood", "boulder"],
  "connecticut": ["bridgeport", "new-haven", "hartford", "stamford", "waterbury", "norwalk"],
  "delaware": ["wilmington", "dover", "newark", "middletown", "smyrna", "milford"],
  "florida": ["miami", "orlando", "tampa", "jacksonville", "fort-lauderdale", "west-palm-beach"],
  "georgia": ["atlanta", "savannah", "augusta", "columbus", "macon", "athens"],
  "hawaii": ["honolulu", "pearl-city", "hilo", "kailua", "waipahu", "kaneohe"],
  "idaho": ["boise", "meridian", "nampa", "idaho-falls", "pocatello", "caldwell"],
  "illinois": ["chicago", "aurora", "rockford", "joliet", "naperville", "springfield"],
  "indiana": ["indianapolis", "fort-wayne", "evansville", "south-bend", "carmel", "bloomington"],
  "iowa": ["des-moines", "cedar-rapids", "davenport", "sioux-city", "iowa-city", "waterloo"],
  "kansas": ["wichita", "overland-park", "kansas-city", "olathe", "topeka", "lawrence"],
  "kentucky": ["louisville", "lexington", "bowling-green", "owensboro", "covington", "richmond"],
  "louisiana": ["new-orleans", "baton-rouge", "shreveport", "lafayette", "lake-charles", "kenner"],
  "maine": ["portland", "lewiston", "bangor", "south-portland", "auburn", "biddeford"],
  "maryland": ["baltimore", "columbia", "germantown", "silver-spring", "waldorf", "annapolis"],
  "massachusetts": ["boston", "worcester", "springfield", "cambridge", "lowell", "brockton"],
  "michigan": ["detroit", "grand-rapids", "warren", "sterling-heights", "ann-arbor", "lansing"],
  "minnesota": ["minneapolis", "saint-paul", "rochester", "duluth", "bloomington", "brooklyn-park"],
  "mississippi": ["jackson", "gulfport", "southaven", "hattiesburg", "biloxi", "meridian"],
  "missouri": ["kansas-city", "saint-louis", "springfield", "columbia", "independence", "lees-summit"],
  "montana": ["billings", "missoula", "great-falls", "bozeman", "butte", "helena"],
  "nebraska": ["omaha", "lincoln", "bellevue", "grand-island", "kearney", "fremont"],
  "nevada": ["las-vegas", "henderson", "reno", "north-las-vegas", "sparks", "carson-city"],
  "new-hampshire": ["manchester", "nashua", "concord", "dover", "rochester", "keene"],
  "new-jersey": ["newark", "jersey-city", "paterson", "elizabeth", "edison", "trenton"],
  "new-mexico": ["albuquerque", "las-cruces", "rio-rancho", "santa-fe", "roswell", "farmington"],
  "new-york": ["new-york-city", "buffalo", "rochester", "yonkers", "syracuse", "albany"],
  "north-carolina": ["charlotte", "raleigh", "greensboro", "durham", "winston-salem", "fayetteville"],
  "north-dakota": ["fargo", "bismarck", "grand-forks", "minot", "west-fargo", "williston"],
  "ohio": ["columbus", "cleveland", "cincinnati", "toledo", "akron", "dayton"],
  "oklahoma": ["oklahoma-city", "tulsa", "norman", "broken-arrow", "lawton", "edmond"],
  "oregon": ["portland", "salem", "eugene", "gresham", "hillsboro", "bend"],
  "pennsylvania": ["philadelphia", "pittsburgh", "allentown", "reading", "erie", "scranton"],
  "rhode-island": ["providence", "warwick", "cranston", "pawtucket", "east-providence", "woonsocket"],
  "south-carolina": ["charleston", "columbia", "north-charleston", "mount-pleasant", "rock-hill", "greenville"],
  "south-dakota": ["sioux-falls", "rapid-city", "aberdeen", "brookings", "watertown", "mitchell"],
  "tennessee": ["nashville", "memphis", "knoxville", "chattanooga", "clarksville", "murfreesboro"],
  "texas": ["houston", "dallas", "austin", "san-antonio", "fort-worth", "el-paso"],
  "utah": ["salt-lake-city", "west-valley-city", "provo", "west-jordan", "orem", "sandy"],
  "vermont": ["burlington", "south-burlington", "rutland", "barre", "montpelier", "winooski"],
  "virginia": ["virginia-beach", "norfolk", "chesapeake", "richmond", "newport-news", "alexandria"],
  "washington": ["seattle", "spokane", "tacoma", "vancouver", "bellevue", "kent"],
  "west-virginia": ["charleston", "huntington", "morgantown", "parkersburg", "wheeling", "weirton"],
  "wisconsin": ["milwaukee", "madison", "green-bay", "kenosha", "racine", "appleton"],
  "wyoming": ["cheyenne", "casper", "laramie", "gillette", "rock-springs", "sheridan"],
};

export const PRIORITY_CATEGORIES = [
  "prom",
  "weddings",
  "bachelor-parties",
  "bachelorette-parties",
  "graduation",
  "homecoming",
  "corporate-discounts",
  "party-bus",
  "stretch-limo",
  "coach-bus",
  "concerts",
  "sporting-events",
] as const;

export function getRelatedCategories(category: string): string[] {
  const normalized = category.toLowerCase().trim();
  
  if (CATEGORY_RECOMMENDATIONS[normalized]) {
    return CATEGORY_RECOMMENDATIONS[normalized].relatedCategories;
  }
  
  if (STATE_CITY_MAPPING[normalized]) {
    return STATE_CITY_MAPPING[normalized];
  }
  
  for (const [state, cities] of Object.entries(STATE_CITY_MAPPING)) {
    if (cities.includes(normalized)) {
      return [state, ...cities.filter(c => c !== normalized).slice(0, 5)];
    }
  }
  
  return PRIORITY_CATEGORIES.slice(0, 6) as string[];
}

export function getCategoryTitle(category: string): string {
  const normalized = category.toLowerCase().trim();
  
  if (CATEGORY_RECOMMENDATIONS[normalized]) {
    return CATEGORY_RECOMMENDATIONS[normalized].title;
  }
  
  return category
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") + " Polls";
}

export function getCategoryDescription(category: string): string {
  const normalized = category.toLowerCase().trim();
  
  if (CATEGORY_RECOMMENDATIONS[normalized]) {
    return CATEGORY_RECOMMENDATIONS[normalized].description;
  }
  
  return `Explore community polls about ${category.replace(/-/g, " ")}`;
}
