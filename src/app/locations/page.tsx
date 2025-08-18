

"use client";


import React, { useState } from "react";
import Link from "next/link";
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";

// All states and cities as a data structure
const locations = [
  { state: 'Alaska', cities: ['Anchorage'] },
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
  const [search, setSearch] = useState("");

  // Filter logic: show states/cities matching search
  const filtered = locations
    .map(({ state, cities }) => {
      if (!search.trim()) return { state, cities };
      if (state.toLowerCase().includes(search.toLowerCase())) return { state, cities };
      const matchedCities = cities.filter((city) => city.toLowerCase().includes(search.toLowerCase()));
      return matchedCities.length > 0 ? { state, cities: matchedCities } : null;
    })
    .filter(Boolean);

  return (
    <PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
      {/* Hero Section */}
      <Section className="flex flex-col items-center justify-center text-center !p-0 !py-0 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700/30 via-blue-900/10 to-black" />
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg tracking-tight font-serif bg-gradient-to-r from-blue-400 via-blue-300 to-green-400 bg-clip-text text-transparent">
          Find Your City
        </h1>
        <p className="text-2xl md:text-3xl max-w-3xl mx-auto mb-10 text-blue-100 font-medium">
          We serve cities and towns across the U.S. Use the search or browse below to find service in your area.
        </p>
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[120vw] h-40 bg-gradient-to-r from-blue-500/30 via-blue-500/20 to-green-500/10 blur-2xl opacity-60" />
      </Section>

      {/* Search Bar Section */}
      <Section className="max-w-2xl mx-auto flex flex-col items-center justify-center bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10">
        <label htmlFor="location-search" className="sr-only">Search for your city or state</label>
        <input
          id="location-search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for your city or state..."
          className="w-full max-w-md px-6 py-4 rounded-full border-2 border-blue-400 bg-blue-950/80 text-lg text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xl placeholder:text-blue-400 font-sans"
          autoComplete="off"
        />
      </Section>

      {/* State Quick Links */}
      {!search.trim() && (
        <Section className="max-w-6xl mx-auto mb-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl py-10">
          {locations.map(({ state }) => (
            <Link
              key={state}
              href={state === "Alaska" ? "#alaska" : "#"}
              className={
                state === "Alaska"
                  ? "block text-blue-100 font-bold bg-blue-700/80 border-2 border-blue-400 rounded-xl px-4 py-3 text-center hover:bg-blue-800 transition text-lg shadow"
                  : "block text-blue-200 font-semibold bg-blue-950/70 rounded-xl px-4 py-3 text-center hover:bg-blue-900 transition text-lg shadow"
              }
            >
              {state}
            </Link>
          ))}
        </Section>
      )}

      {/* State and City Lists */}
      <Section className="max-w-6xl mx-auto space-y-10 bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl py-10">
        {filtered.length === 0 ? (
          <div className="text-center text-blue-300 text-xl py-10">No locations found.</div>
        ) : (
          filtered.map(({ state, cities }) => (
            <div key={state} id={state === "Alaska" ? "alaska" : undefined}>
              <h2 className="text-3xl font-bold mb-3 text-blue-200 font-serif tracking-tight">
                {state === "Alaska" ? (
                  <Link href="#alaska" className="text-blue-300 underline font-bold">{state}</Link>
                ) : (
                  <Link href="#" className="text-blue-200 hover:underline">{state}</Link>
                )}
              </h2>
              {cities.length > 0 ? (
                <ul className="flex flex-wrap gap-3">
                  {cities.map((city) => (
                    <li key={city}>
                      {state === "Alaska" && city === "Anchorage" ? (
                        <Link
                          href="/locations/anchorage-alaska"
                          className="inline-block text-white bg-blue-700 border-2 border-blue-400 rounded-full px-4 py-2 hover:bg-blue-800 hover:text-white transition font-bold shadow"
                        >
                          {city}
                        </Link>
                      ) : (
                        <span className="inline-block text-blue-100 bg-blue-950/70 rounded-full px-4 py-2 border border-blue-700/20 shadow">
                          {city}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-blue-400 italic">Coming soon</p>
              )}
            </div>
          ))
        )}
      </Section>
    </PageLayout>
  );
}
