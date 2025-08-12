

const pollCategories = [
  {
    title: 'Party Bus Polls',
    parent: 'Transportation Service Types',
    polls: [
      'Which party bus feature is most important? (A: Sound System, B: Lighting, C: Bar, D: TV Screens)',
      'Would you rent a party bus for a birthday? (Yes/No)',
      'True or False: Party buses are safer than limos.',
    ],
  },
  {
    title: 'Limousine Polls',
    parent: 'Transportation Service Types',
    polls: [
      'Would you rent a limousine for a birthday? (Yes/No)',
      'What’s your favorite limo color? (A: Black, B: White, C: Pink, D: Silver)',
      'True or False: Limousines are best for weddings.',
    ],
  },
  {
    title: 'Coach/Charter Bus Polls',
    parent: 'Transportation Service Types',
    polls: [
      'True or False: Charter buses are more comfortable than planes.',
      'Would you take a charter bus for a sports event? (Yes/No)',
      'Which feature matters most? (A: WiFi, B: Reclining Seats, C: Restroom, D: Outlets)',
    ],
  },
  {
    title: 'Black Car / Luxury Sedan Polls',
    parent: 'Transportation Service Types',
    polls: [
      'What’s your favorite luxury sedan brand? (A: Mercedes, B: BMW, C: Audi, D: Lexus)',
      'Do you prefer black or white sedans? (A: Black, B: White)',
      'True or False: Sedans are best for airport transfers.',
    ],
  },
  {
    title: 'SUV / Executive Transport Polls',
    parent: 'Transportation Service Types',
    polls: [
      'Do you prefer SUVs or sedans for airport transfers? (A: SUV, B: Sedan)',
      'Would you book an SUV for a night out? (Yes/No)',
      'True or False: SUVs are safer than sedans.',
    ],
  },
  {
    title: 'Shuttle / Minibus Polls',
    parent: 'Transportation Service Types',
    polls: [
      'Have you ever used a shuttle for a concert? (Yes/No)',
      'Which is better for groups? (A: Shuttle, B: Minibus)',
      'True or False: Minibuses are more fun than shuttles.',
    ],
  },
  {
    title: 'Prom Transportation Polls',
    parent: 'Event-Based Transportation',
    polls: [
      'Would you book a limo for prom? (Yes/No)',
      'Which ride is best for prom? (A: Limo, B: Party Bus, C: SUV, D: Shuttle)',
      'True or False: Prom is the most popular event for limos.',
    ],
  },
  {
    title: 'Wedding Transportation Polls',
    parent: 'Event-Based Transportation',
    polls: [
      'Would you book a party bus for a wedding? (Yes/No)',
      'What’s the best wedding getaway car? (A: Limo, B: Classic Car, C: SUV, D: Party Bus)',
      'True or False: Most couples use limos for weddings.',
    ],
  },
  {
    title: 'Sporting Event Transportation Polls',
    parent: 'Event-Based Transportation',
    polls: [
      'Would you take a charter bus to a game? (Yes/No)',
      'Which is best for tailgating? (A: Party Bus, B: Shuttle, C: Limo, D: SUV)',
      'True or False: Buses are the safest way to travel to games.',
    ],
  },
  {
    title: 'Concert & Festival Transportation Polls',
    parent: 'Event-Based Transportation',
    polls: [
      'Have you ever used a shuttle for a concert? (Yes/No)',
      'What’s your favorite way to get to a festival? (A: Party Bus, B: Shuttle, C: Limo, D: Carpool)',
      'True or False: Party buses are the most fun for concerts.',
    ],
  },
  {
    title: 'Airport Transfer Polls',
    parent: 'Event-Based Transportation',
    polls: [
      'Do you prefer SUVs or sedans for airport transfers? (A: SUV, B: Sedan)',
      'Would you pay extra for a meet & greet? (Yes/No)',
      'True or False: Airport transfers are less stressful with a professional driver.',
    ],
  },
  {
    title: 'Bachelor/Bachelorette Party Polls',
    parent: 'Event-Based Transportation',
    polls: [
      'Would you book a party bus for a bachelor/bachelorette party? (Yes/No)',
      'What’s the best party ride? (A: Limo, B: Party Bus, C: SUV, D: Shuttle)',
      'True or False: Party buses are the most popular for these events.',
    ],
  },
  {
    title: 'Birthday Party Transportation Polls',
    parent: 'Event-Based Transportation',
    polls: [
      'Would you rent a limo for a birthday? (Yes/No)',
      'What’s the best birthday ride? (A: Limo, B: Party Bus, C: SUV, D: Shuttle)',
      'True or False: Limos are the most popular for birthdays.',
    ],
  },
  {
    title: 'Casino Trip Transportation Polls',
    parent: 'Event-Based Transportation',
    polls: [
      'What’s your favorite casino trip destination? (A: Vegas, B: Atlantic City, C: Local, D: Other)',
      'Would you book a bus for a casino trip? (Yes/No)',
      'True or False: Casino trips are more fun with a group.',
    ],
  },
  {
    title: 'Wine & Brewery Tour Polls',
    parent: 'Event-Based Transportation',
    polls: [
      'Would you book a party bus for a wine tour? (Yes/No)',
      'What’s your favorite tour ride? (A: Limo, B: Party Bus, C: Shuttle, D: SUV)',
      'True or False: Wine tours are best with a group.',
    ],
  },
  {
    title: 'New Year’s Eve / Holiday Event Polls',
    parent: 'Event-Based Transportation',
    polls: [
      'Would you book a party bus for New Year’s Eve? (Yes/No)',
      'What’s the best holiday event ride? (A: Limo, B: Party Bus, C: Shuttle, D: SUV)',
      'True or False: Party buses are the most popular for NYE.',
    ],
  },
  {
    title: 'Corporate Event Transportation Polls',
    parent: 'Event-Based Transportation',
    polls: [
      'Would you book a shuttle for a corporate event? (Yes/No)',
      'What’s the best corporate ride? (A: Shuttle, B: Limo, C: SUV, D: Party Bus)',
      'True or False: Shuttles are the most popular for corporate events.',
    ],
  },
  {
    title: 'Best Local Party Bus Company Polls (per city)',
    parent: 'Regional & City-Based Transportation',
    polls: [
      'Would you recommend your city’s party bus service? (Yes/No)',
      'Which city has the best party bus options? (A: NYC, B: LA, C: Chicago, D: Miami)',
      'True or False: Local companies are better than national.',
    ],
  },
  {
    title: 'Best Limo Service Polls (per city)',
    parent: 'Regional & City-Based Transportation',
    polls: [
      'Best way to find a local limo company? (A: Google, B: Friends, C: Social Media, D: Other)',
      'Would you recommend your city’s limo service? (Yes/No)',
      'True or False: Limo services are always on time.',
    ],
  },
  {
    title: 'Best Shuttle / Coach Service Polls (per city)',
    parent: 'Regional & City-Based Transportation',
    polls: [
      'Would you recommend your city’s shuttle service? (Yes/No)',
      'Which city has the best shuttle options? (A: NYC, B: LA, C: Chicago, D: Miami)',
      'True or False: Shuttles are always on time.',
    ],
  },
  {
    title: 'Group Travel Comfort Polls',
    parent: 'Travel & Experience',
    polls: [
      'Is WiFi a must-have on group trips? (Yes/No)',
      'How do you rate your last group travel experience? (A: Excellent, B: Good, C: Fair, D: Poor)',
      'True or False: Comfort is more important than price.',
    ],
  },
  {
    title: 'Onboard Amenities Preference Polls',
    parent: 'Travel & Experience',
    polls: [
      'What’s your top onboard amenity? (A: Snacks, B: Drinks, C: Movies, D: Reclining Seats)',
      'Would you pay extra for WiFi? (Yes/No)',
      'True or False: Amenities make or break the trip.',
    ],
  },
  {
    title: 'Safety & Reliability Polls',
    parent: 'Travel & Experience',
    polls: [
      'Would you pay extra for a safer vehicle? (Yes/No)',
      'Is reliability more important than price? (Yes/No)',
      'True or False: Safety is the top priority.',
    ],
  },
  {
    title: 'Pricing & Value Polls',
    parent: 'Travel & Experience',
    polls: [
      'True or False: Price is more important than comfort.',
      'Do you look for deals when booking? (Yes/No)',
      'How do you rate value for money? (A: Excellent, B: Good, C: Fair, D: Poor)',
    ],
  },
];



const answerOptions = [
  ['Yes', 'No'],
  ['A', 'B', 'C', 'D'],
  ['True', 'False'],
];

function getAnswerType(poll: string) {
  if (/yes|no/i.test(poll)) return answerOptions[0];
  if (/true|false/i.test(poll)) return answerOptions[2];
  if (/preference|comfort|value|best|favorite|which|what|who|how/i.test(poll)) return answerOptions[1];
  return answerOptions[0];
}

export default function Page() {
  // Group by parent category for section headers
  const grouped = pollCategories.reduce((acc, cat) => {
    if (!acc[cat.parent]) acc[cat.parent] = [];
    acc[cat.parent].push(cat);
    return acc;
  }, {} as Record<string, typeof pollCategories>);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      <h1 className="text-5xl font-extrabold mb-6 text-blue-800 text-center drop-shadow-lg tracking-tight">Industry Polls & Data</h1>
      <p className="mb-14 text-center text-xl text-gray-700 max-w-3xl mx-auto font-medium">
        Bus2Ride.com offers the most comprehensive, up-to-date data and poll results in the global limo and group transportation industry.<br className="hidden md:block" />
        Explore real customer opinions, trends, and insights to make smarter travel decisions!
      </p>
      {Object.entries(grouped).map(([parent, cats]) => (
        <section key={parent} className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-blue-700 border-l-8 border-blue-400 pl-4 bg-blue-50/60 py-2 rounded-r-xl shadow-sm">
            {parent}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cats.map((cat) => (
              <div
                key={cat.title}
                className="relative group bg-white/90 rounded-2xl shadow-xl p-7 flex flex-col min-h-[340px] border border-blue-100 hover:scale-[1.025] hover:shadow-2xl transition-all duration-200 overflow-hidden"
              >
                <div className="absolute -top-4 -right-4 opacity-10 text-[7rem] pointer-events-none select-none">

                </div>
                <h3 className="text-xl font-bold mb-5 text-blue-700 tracking-wide flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2" />
                  {cat.title}
                </h3>
                <ul className="space-y-5 mb-4">
                  {cat.polls.map((poll, i) => (
                    <li
                      key={poll}
                      className="flex flex-col gap-2 bg-blue-50/60 rounded-lg px-4 py-3 border border-blue-100 hover:bg-blue-100/80 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 font-medium text-base leading-snug">{poll}</span>
                        {/* <button className="ml-2 text-blue-400 opacity-70 hover:opacity-100 transition" title="Copy link (coming soon)"><FaLink /></button> */}
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1">
                        {getAnswerType(poll).map(opt => (
                          <label
                            key={opt}
                            className="inline-flex items-center cursor-pointer bg-white border border-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-blue-700 shadow-sm hover:bg-blue-100/80 transition"
                          >
                            <input type="radio" name={`poll-${cat.title}-${i}`} className="accent-blue-600" disabled />
                            <span className="ml-2">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

