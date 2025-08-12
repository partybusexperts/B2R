
import Link from 'next/link';

// All states and cities as a data structure
const locations = [
  { state: 'Alabama', cities: ['Auburn','Birmingham','Decatur','Dothan','Hoover','Huntsville','Madison','Mobile','Montgomery','Tuscaloosa'] },
  { state: 'Arizona', cities: ['Avondale','Buckeye','Casa Grande','Catalina Foothills','Chandler','Flagstaff','Gilbert','Glendale','Goodyear','Lake Havasu City','Maricopa','Mesa','Peoria','Phoenix','Queen Creek','Scottsdale','Surprise','Tempe','Tucson','Yuma'] },
  { state: 'Arkansas', cities: ['Bentonville','Conway','Fayetteville','Fort Smith','Jonesboro','Little Rock','North Little Rock','Rogers','Springdale'] },
  { state: 'California', cities: ['Alameda','Aliso Viejo','Anaheim','Antioch','Apple Valley','Arcadia','Bakersfield','Baldwin Park','Bellflower','Berkeley','Brentwood','Buena Park','Burbank','Camarillo','Carlsbad','Carmichael','Carson','Castro Valley','Cathedral City','Chico','Chino','Chino Hills','Chula Vista','Citrus Heights','Clovis','Colton','Compton','Concord','Corona','Costa Mesa','Daly City','Davis','Delano','Diamond Bar','Downey','Dublin','East Los Angeles','Eastvale','El Cajon','El Monte','Elk Grove','Encinitas','Escondido','Fairfield','Folsom','Fontana','Fountain Valley','Fremont','Fresno','Fullerton','Garden Grove','Gardena','Gilroy','Glendale','Glendora','Hacienda Heights','Hanford','Hawthorne','Hayward','Hemet','Hesperia','Huntington Beach','Huntington Park','Indio','Inglewood','Irvine','Jurupa Valley','La Habra','Laguna Niguel','Lake Elsinore','Lakewood','Lancaster','Livermore','Lodi','Long Beach','Los Angeles','Lynwood','Madera','Manteca','Menifee','Merced','Mission Viejo','Modesto','Montebello','Moreno Valley','Mountain View','Murrieta','Napa','Newport Beach','Norwalk','Novato','Oakland','Oceanside','Ontario','Orange','Oxnard','Palm Desert','Palmdale','Palo Alto','Paramount','Pasadena','Perris','Petaluma','Pico Rivera','Pittsburg','Placentia','Pleasanton','Pomona','Porterville','Rancho Cordova','Rancho Cucamonga','Redding','Redlands','Redondo Beach','Redwood City','Rialto','Richmond','Riverside','Rocklin','Roseville','Sacramento','Salinas','San Bernardino','San Buenaventura Ventura','San Clemente','San Diego','San Francisco','San Jose','San Leandro','San Marcos','San Mateo','San Rafael','San Ramon','Santa Ana','Santa Barbara','Santa Clara','Santa Clarita','Santa Cruz','Santa Maria','Santa Monica','Santa Rosa','Simi Valley','South Gate','South San Francisco','South Whittier','Stockton','Sunnyvale','Temecula','Thousand Oaks','Torrance','Tracy','Tulare','Turlock','Tustin','Union City','Upland','Vacaville','Vallejo','Victorville','Visalia','Vista','Walnut Creek','Watsonville','West Covina','West Sacramento','Whittier','Woodland','Yorba Linda','Yuba City','Yucaipa'] },
  { state: 'Colorado', cities: ['Arvada','Aurora','Boulder','Broomfield','Castle Rock','Centennial','Colorado Springs','Commerce City','Denver','Fort Collins','Grand Junction','Greeley','Lakewood','Longmont','Loveland','Parker','Pueblo','Thornton','Westminster'] },
  { state: 'Connecticut', cities: ['Bridgeport','Bristol','Danbury','Hartford','Meriden','Milford','New Britain','New Haven','Norwalk','Stamford','Waterbury','West Haven'] },
  { state: 'Delaware', cities: ['Wilmington'] },
  { state: 'Florida', cities: ['Apopka','Boca Raton','Bonita Springs','Boynton Beach','Bradenton','Brandon','Cape Coral','Clearwater','Coconut Creek','Coral Springs','Davie','Daytona Beach','Deerfield Beach','Delray Beach','Deltona','Doral','Fort Lauderdale','Fort Myers','Fountainebleau','Gainesville','Hialeah','Hollywood','Homestead','Jacksonville','Jupiter','Kendale Lakes','Kendall','Kissimmee','Lakeland','Largo','Lauderhill','Lehigh Acres','Margate','Melbourne','Miami','Miami Beach','Miami Gardens','Miramar','North Miami','North Port','Ocala','Orlando','Palm Bay','Palm Beach Gardens','Palm Coast','Palm Harbor','Pembroke Pines','Pensacola','Pine Hills','Pinellas Park','Plantation','Poinciana','Pompano Beach','Port Charlotte','Port Orange','Port St. Lucie','Riverview','Sanford','Sarasota','Spring Hill','St. Cloud','St. Petersburg','Sunrise','Tallahassee','Tamarac','Tampa','The Villages','Wellington','Wesley Chapel','West Palm Beach','Weston'] },
  { state: 'Georgia', cities: ['Albany','Alpharetta','Athens','Atlanta','Augusta','Columbus','Johns Creek','Macon','Marietta','Roswell','Sandy Springs','Savannah','Smyrna','Valdosta','Warner Robins'] },
  { state: 'Hawaii', cities: ['Honolulu','Maui','Oahu'] },
  { state: 'Idaho', cities: ['Boise','Caldwell','Coeur dAlene','Idaho Falls','Meridian','Nampa','Pocatello'] },
  { state: 'Illinois', cities: ['Arlington Heights','Aurora','Berwyn','Bloomington','Bolingbrook','Capital','Champaign','Chicago','Cicero','Decatur','Des Plaines','Elgin','Evanston','Hoffman Estates','Joliet','Leyden','Maine','Mount Prospect','Naperville','New Trier','Oak Lawn','Orland','Orland Park','Palatine','Palos','Peoria','Proviso','Rockford','Schaumburg','Skokie','Springfield','St. Clair','Tinley Park','Waukegan','Wheaton'] },
  { state: 'Indiana', cities: ['Anderson','Bloomington','Calumet','Carmel','Concord','Delaware','Elkhart','Evansville','Fall Creek','Fishers','Fort Wayne','Gary','Greenwood','Hammond','Indianapolis','Knight','Kokomo','Lafayette','Muncie','Noblesville','North','Penn','South Bend','St. Joseph','Terre Haute','Wayne'] },
  { state: 'Iowa', cities: ['Ames','Ankeny','Cedar Rapids','Council Bluffs','Davenport','Des Moines','Dubuque','Iowa City','Sioux City','Waterloo','West Des Moines'] },
  { state: 'Kansas', cities: ['Kansas City','Lawrence','Lenexa','Manhattan','Olathe','Overland Park','Shawnee','Topeka','Wichita'] },
  { state: 'Kentucky', cities: ['Bowling Green','Lexington','Louisville','Owensboro'] },
  { state: 'Louisiana', cities: ['Baton Rouge','Bossier City','Kenner','Lafayette','Lake Charles','Metairie','New Orleans','Shreveport'] },
  { state: 'Maine', cities: ['Portland'] },
  { state: 'Maryland', cities: ['Baltimore','Bel Air South','Bethesda','Bowie','Columbia','Dundalk','Ellicott City','Frederick','Gaithersburg','Germantown','Glen Burnie','Rockville','Severn','Silver Spring','Towson','Waldorf'] },
  { state: 'Massachusetts', cities: ['Boston','Brockton','Cambridge','Chicopee','Fall River','Framingham','Haverhill','Lawrence','Lowell','Lynn','Medford','Methuen','New Bedford','Newton','Peabody','Plymouth','Quincy','Revere','Somerville','Springfield','Taunton','Waltham','Weymouth','Worcester'] },
  { state: 'Michigan', cities: ['Ann Arbor','Battle Creek','Canton','Dearborn','Dearborn Heights','Detroit','Farmington Hills','Grand Rapids','Kentwood','Lansing','Livonia','Macomb','Novi','Pontiac','Rochester Hills','Royal Oak','Southfield','St. Clair Shores','Sterling Heights','Taylor','Troy','Warren','Waterford','West Bloomfield','Westland','Wyoming'] },
  { state: 'Minnesota', cities: ['Apple Valley','Blaine','Bloomington','Brooklyn Park','Burnsville','Coon Rapids','Duluth','Eagan','Eden Prairie','Edina','Lakeville','Maple Grove','Minneapolis','Minnetonka','Plymouth','Rochester','St. Cloud','St. Paul','Woodbury'] },
  { state: 'Mississippi', cities: ['Gulfport','Jackson','Southaven'] },
  { state: 'Missouri', cities: ['Blue Springs','Columbia','Florissant','Independence','Joplin','Kansas City','Lees Summit','O Fallon','Springfield','St Louis','St. Charles','St. Joseph','St. Peters'] },
  { state: 'Montana', cities: ['Billings','Great Falls','Missoula'] },
  { state: 'Nebraska', cities: ['Bellevue','Grand Island','Lincoln','Omaha'] },
  { state: 'Nevada', cities: ['Carson City','Henderson','Las Vegas','North Las Vegas','Reno'] },
  { state: 'New Hampshire', cities: ['Manchester','Nashua'] },
  { state: 'New Jersey', cities: ['Bayonne','Brick','Camden','Cherry Hill','Clifton','East Orange','Edison','Elizabeth','Gloucester','Hoboken','Howell','Irvington','Jackson','Jersey City','Lakewood','Middletown','New Brunswick','Newark','North Bergen','Old Bridge','Parsippany-Troy Hills','Passaic','Paterson','Perth Amboy','Piscataway','Plainfield','Toms River','Trenton','Union City','Vineland','Wayne','West New York','Woodbridge'] },
  { state: 'New Mexico', cities: ['Albuquerque','Las Cruces','Rio Rancho','Santa Fe'] },
  { state: 'New York', cities: ['Albany','Amherst','Babylon','Brentwood','Brookhaven','Brooklyn','Buffalo','Cheektowaga','Clarkstown','Greece','Hempstead','Huntington','Islip','Levittown','Long Island NY','Manhattan','Mount Vernon','New Rochelle','New York City','Oyster Bay','Queens','Rochester','Schenectady','Smithtown','Southampton','Staten Island','Syracuse','The Bronx','Utica','White Plains','Yonkers'] },
  { state: 'North Carolina', cities: ['Apex','Asheville','Burlington','Cary','Chapel Hill','Charlotte','Concord','Durham','Fayetteville','Gastonia','Greensboro','Greenville','High Point','Huntersville','Jacksonville','Raleigh','Rocky Mount','Wilmington','Winston Salem'] },
  { state: 'North Dakota', cities: ['Bismarck','Fargo','Grand Forks'] },
  { state: 'Ohio', cities: ['Akron','Canton','Cincinnati','Cleveland','Columbus','Dayton','Elyria','Hamilton','Lake','Lakewood','Lawrence','Lorain','Parma','Springfield','Toledo','West Chester','Youngstown'] },
  { state: 'Oklahoma', cities: ['Broken Arrow','Edmond','Enid','Lawton','Moore','Norman','Oklahoma City','Stillwater','Tulsa'] },
  { state: 'Oregon', cities: ['Albany','Beaverton','Bend','Corvallis','Eugene','Gresham','Hillsboro','Medford','Portland','Salem','Springfield','Tigard'] },
  { state: 'Pennsylvania', cities: ['Abington','Allentown','Armstrong','Bensalem','Bethlehem','Erie','Lancaster','Philadelphia','Pittsburgh','Reading','Scranton'] },
  { state: 'Rhode Island', cities: ['Cranston','Pawtucket','Providence','Warwick'] },
  { state: 'South Carolina', cities: ['Charleston','Columbia','Greenville','Mount Pleasant','North Charleston','Rock Hill','Summerville'] },
  { state: 'South Dakota', cities: ['Rapid City','Sioux Falls'] },
  { state: 'Tennessee', cities: ['Bartlett','Chattanooga','Clarksville','Collierville','Franklin','Hendersonville','Jackson','Johnson City','Kingsport','Knoxville','Memphis','Murfreesboro','Nashville','Smyrna'] },
  { state: 'Texas', cities: ['Abilene','Allen','Amarillo','Arlington','Atascocita','Austin','Baytown','Beaumont','Brownsville','Bryan','Carrollton','Cedar Park','College Station','Conroe','Corpus Christi','Dallas','Denton','Desoto','Edinburg','El Paso','Euless','Flower Mound','Fort Worth','Frisco','Galveston','Garland','Georgetown','Grand Prairie','Grapevine','Harlingen','Houston','Irving','Killeen','Laredo','League City','Leander','Lewisville','Longview','Lubbock','Mansfield','McAllen','McKinney','Mesquite','Midland','Mission','Missouri City','New Braunfels','North Richland Hills','Odessa','Pasadena','Pearland','Pflugerville','Pharr','Plano','Port Arthur','Richardson','Round Rock','Rowlett','San Angelo','San Antonio','San Marcos','Spring','Sugar Land','Temple','The Woodlands','Tyler','Victoria','Waco','Wichita Falls','Wylie'] },
  { state: 'Utah', cities: ['Layton','Lehi','Logan','Ogden','Orem','Provo','Salt Lake City','Sandy','South Jordan','St George','Taylorsville','West Jordan','West Valley City'] },
  { state: 'Vermont', cities: [] },
  { state: 'Virginia', cities: ['Arlington','Alexandria','Centreville','Chesapeake','Dale City','Hampton','Harrisonburg','Leesburg','Lynchburg','Newport News','Norfolk','Portsmouth','Reston','Richmond','Roanoke','Suffolk','Virginia Beach'] },
  { state: 'Washington', cities: ['Auburn','Bellevue','Bellingham','Everett','Federal Way','Kennewick','Kent','Kirkland','Lacey','Lakewood','Marysville','Olympia','Pasco','Redmond','Renton','Richland','Sammamish','Seattle','Spokane','Spokane Valley','Tacoma','Vancouver','Yakima'] },
  { state: 'West Virginia', cities: [] },
  { state: 'Wisconsin', cities: ['Appleton','Eau Claire','Green Bay','Janesville','Kenosha','La Crosse','Madison','Milwaukee','Oshkosh','Racine','Waukesha','West Allis'] },
  { state: 'Wyoming', cities: ['Casper','Cheyenne'] },
];

export default function LocationsPage() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-blue-700 text-center">Service Locations</h1>
      {/* State quick links grid */}
      <div className="mb-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {locations.map(({ state }) => (
          <Link key={state} href="#" className="block text-blue-700 font-semibold bg-blue-50 rounded px-3 py-2 text-center hover:bg-blue-100 transition">
            {state}
          </Link>
        ))}
      </div>
      {/* State and city lists */}
      <div className="space-y-10">
        {locations.map(({ state, cities }) => (
          <div key={state}>
            <h2 className="text-2xl font-semibold mb-2">
              <Link href="#" className="text-blue-600 hover:underline">{state}</Link>
            </h2>
            {cities.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {cities.map(city => (
                  <li key={city}>
                    <Link href="#" className="inline-block text-gray-700 bg-gray-100 rounded px-3 py-1 hover:bg-blue-100 hover:text-blue-700 transition">{city}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">Coming soon</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
