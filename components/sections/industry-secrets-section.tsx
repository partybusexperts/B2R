import {
  IndustrySecretsExplorer,
  type IndustrySecret,
} from "@/components/sections/industry-secrets-explorer.client";

const SECRETS: IndustrySecret[] = [
  {
    id: "off-peak-savings",
    category: "pricing",
    title: "Off-peak = real savings",
    summary:
      "Weekdays and daytime slots can be meaningfully cheaper than peak Saturdays.",
    bodyHtml:
      "<p><strong>What to ask:</strong> request pricing for Sun–Thu and daytime windows.</p><ul><li>Ask for a true <em>all-in</em> quote.</li><li>Compare minimum hours by day.</li><li>If your date is flexible, ask about standby inventory.</li></ul>",
  },
  {
    id: "garage-to-garage",
    category: "billing",
    title: "Billing starts ‘garage to garage’",
    summary:
      "Many operators start the clock before pickup and end after drop-off.",
    bodyHtml:
      "<p>Confirm how they count time. Some companies bill from dispatch departure and include deadhead miles.</p><ul><li>Ask when billing starts (dispatch vs pickup).</li><li>Ask when billing ends (drop-off vs return).</li><li>Ask if tolls/fuel are included.</li></ul>",
  },
  {
    id: "minimum-hours",
    category: "booking",
    title: "Minimum hour rules",
    summary:
      "Common minimums: 3–5 hours, often higher on weekends and school dance season.",
    bodyHtml:
      "<p>Minimums change by day, season, and vehicle class.</p><ul><li>Ask: minimum hours for your exact date.</li><li>Ask: does a shorter <em>transfer</em> rate exist?</li><li>Ask: what triggers overtime?</li></ul>",
  },
  {
    id: "split-transfer",
    category: "booking",
    title: "Split transfer vs. charter",
    summary:
      "Two shorter rides can cost less than one long continuous booking.",
    bodyHtml:
      "<p>For events with a big gap (dinner → show → afterparty), compare options.</p><ul><li>One-way + one-way later</li><li>Wait-and-return</li><li>Continuous charter</li></ul>",
  },
  {
    id: "prom-blackouts",
    category: "seasonal",
    title: "Prom & homecoming blackouts",
    summary: "Rates spike and policies tighten during school dance weekends.",
    bodyHtml:
      "<p>Expect stricter contracts and higher minimum hours.</p><ul><li>Book early for best vehicles.</li><li>Ask about under-21 rules.</li><li>Clarify chaperone requirements.</li></ul>",
  },
  {
    id: "real-photos",
    category: "quality",
    title: "Insist on real vehicle photos",
    summary: "Stock photos hide age, layout, and wear.",
    bodyHtml:
      "<p>Ask for the exact vehicle’s interior/exterior photos (or a live video walkthrough).</p><ul><li>Verify seating layout.</li><li>Verify feature list (Bluetooth, restroom, outlets).</li><li>Confirm the year/make if possible.</li></ul>",
  },
  {
    id: "gratuity-included",
    category: "billing",
    title: "Gratuity: included or not?",
    summary: "Automatic 15–20% service fees are common—verify what’s included.",
    bodyHtml:
      "<p>Ask where gratuity appears (line item vs included).</p><ul><li>Is it mandatory?</li><li>Is it taxed?</li><li>Does it change with edits?</li></ul>",
  },
  {
    id: "cleanup-fees",
    category: "fees",
    title: "Clean-up & damage fees",
    summary: "Confetti, glitter, or spills can trigger $100–$500+ fees.",
    bodyHtml:
      "<p>Ask for the cleaning policy before you book.</p><ul><li>What counts as a deep clean?</li><li>Are bags provided?</li><li>Are food/drink allowed?</li></ul>",
  },
  {
    id: "overtime-rounding",
    category: "billing",
    title: "Overtime rounds up",
    summary: "Many companies round to the next 30 or 60 minutes.",
    bodyHtml:
      "<p>Overtime terms vary. Clarify how they bill partial time.</p><ul><li>30-min increments?</li><li>60-min increments?</li><li>Any grace period?</li></ul>",
  },
  {
    id: "traffic-buffer",
    category: "routing",
    title: "Event-day traffic buffer",
    summary: "Arenas and stadiums can double travel time—pad your schedule.",
    bodyHtml:
      "<p>Build buffer around venue arrival and pickup zones.</p><ul><li>Share exact addresses.</li><li>Pre-choose staging spots.</li><li>Plan pickup instructions for the group.</li></ul>",
  },
  {
    id: "permits-fees",
    category: "fees",
    title: "Venue permits & staging fees",
    summary:
      "Some venues require permits or charge staging fees for buses/limos.",
    bodyHtml:
      "<p>Ask the venue and the operator about staging rules.</p><ul><li>Permits required?</li><li>Staging fee passed through?</li><li>Where is pickup allowed?</li></ul>",
  },
  {
    id: "proof-of-insurance",
    category: "safety",
    title: "Ask for proof of insurance",
    summary: "A proper certificate plus DOT/MC info protects you.",
    bodyHtml:
      "<p>Legit operators can provide proof quickly.</p><ul><li>Request a COI (certificate of insurance).</li><li>Confirm commercial coverage.</li><li>Verify DOT/MC numbers when applicable.</li></ul>",
  },
  {
    id: "alcohol-rules",
    category: "policy",
    title: "Alcohol rules vary by state",
    summary: "Age limits and open-container rules depend on your location.",
    bodyHtml:
      "<p>Ask the operator what’s allowed for your state and your event type.</p><ul><li>21+ requirements</li><li>Any permit requirements</li><li>Glass restrictions</li></ul>",
  },
  {
    id: "no-smoking",
    category: "policy",
    title: "No smoking means no smoking",
    summary: "Violations can trigger deep-clean fees and may end the trip.",
    bodyHtml:
      "<p>Don’t assume vaping is allowed—ask first.</p><ul><li>What’s the fee?</li><li>Does the trip end immediately?</li><li>How is it enforced?</li></ul>",
  },
  {
    id: "extra-stops",
    category: "routing",
    title: "Extra stops cost time",
    summary: "Each added stop can affect overtime and routing fees.",
    bodyHtml:
      "<p>Stops are the #1 reason trips run long.</p><ul><li>Confirm the route up front.</li><li>Keep stops tight.</li><li>Ask how stop changes are billed.</li></ul>",
  },

  {
    id: "airport-surge",
    category: "pricing",
    title: "Airport runs can be premium-priced",
    summary:
      "Wait time, staging rules, and pickup logistics often raise airport quotes.",
    bodyHtml:
      "<p>Airports add friction: staging, permits, and unpredictable curb access.</p><ul><li>Ask if wait time is included.</li><li>Confirm meeting point details.</li><li>Ask about tolls/airport fees.</li></ul>",
  },
  {
    id: "contract-cancellation",
    category: "policy",
    title: "Cancellation windows matter",
    summary: "Refundability often changes at 30/14/7 days.",
    bodyHtml:
      "<p>Cancellation terms vary widely and can be strict around peak dates.</p><ul><li>Ask for the exact cancellation schedule.</li><li>Confirm if deposits are refundable.</li><li>Ask what happens if weather cancels an event.</li></ul>",
  },
  {
    id: "change-fees",
    category: "fees",
    title: "Change fees for edits",
    summary:
      "Some operators charge to change pickup times, routes, or billing info.",
    bodyHtml:
      "<p>Even small edits can trigger admin fees.</p><ul><li>Ask if changes are free up to a cutoff.</li><li>Ask which changes are billable.</li><li>Get changes confirmed in writing.</li></ul>",
  },
  {
    id: "driver-breaks",
    category: "policy",
    title: "Driver breaks on long trips",
    summary: "Long charters may require breaks or a second driver.",
    bodyHtml:
      "<p>On long-distance trips, safety rules can require breaks or relief drivers.</p><ul><li>Ask if a second driver is needed.</li><li>Ask how breaks affect billing.</li><li>Confirm lodging rules for overnight trips.</li></ul>",
  },
  {
    id: "deposit-size",
    category: "billing",
    title: "Deposit size varies by season",
    summary: "Peak weekends often require larger deposits and stricter terms.",
    bodyHtml:
      "<p>Deposits can jump during prom/weddings/holidays.</p><ul><li>Ask deposit amount and due date.</li><li>Ask when remaining balance is due.</li><li>Ask acceptable payment methods.</li></ul>",
  },
  {
    id: "payment-method-fees",
    category: "fees",
    title: "Card processing fees",
    summary: "Some companies add a fee for credit cards—ask upfront.",
    bodyHtml:
      "<p>Processing fees are common in some markets.</p><ul><li>Ask if the quote includes card fees.</li><li>Ask if ACH/check discounts exist.</li><li>Confirm the final total in writing.</li></ul>",
  },
  {
    id: "staging-limits",
    category: "routing",
    title: "Venue pickup zones are limited",
    summary: "Stadiums and arenas often restrict where buses can wait.",
    bodyHtml:
      "<p>Pickup logistics matter as much as arrival.</p><ul><li>Ask where the driver will stage.</li><li>Share a group contact number.</li><li>Plan a clear pickup pin.</li></ul>",
  },
  {
    id: "late-night-minimums",
    category: "pricing",
    title: "Late-night minimums",
    summary: "After-midnight service can have higher minimums or premiums.",
    bodyHtml:
      "<p>Night service may have staffing premiums.</p><ul><li>Ask about after-midnight surcharges.</li><li>Ask if minimum hours change.</li><li>Confirm overtime increments.</li></ul>",
  },
  {
    id: "vehicle-substitution",
    category: "policy",
    title: "Vehicle substitution clauses",
    summary: "Contracts may allow substitutions—know your protections.",
    bodyHtml:
      "<p>Most contracts allow some substitution, but quality should be comparable.</p><ul><li>Ask what happens if your vehicle breaks down.</li><li>Ask how they define “equivalent”.</li><li>Ask if refunds apply for downgrades.</li></ul>",
  },
  {
    id: "age-restrictions",
    category: "policy",
    title: "Age restrictions and chaperones",
    summary: "Under-21 policies vary and can impact booking eligibility.",
    bodyHtml:
      "<p>Many operators require a 21+ signer and sometimes a chaperone onboard.</p><ul><li>Ask about minimum age rules.</li><li>Ask if a parent must ride.</li><li>Confirm ID checks.</li></ul>",
  },
  {
    id: "seatbelt-expectations",
    category: "safety",
    title: "Seatbelts: ask, don’t assume",
    summary: "Availability differs by vehicle type and build.",
    bodyHtml:
      "<p>Seatbelt presence depends on the vehicle class and configuration.</p><ul><li>Ask if seatbelts are installed.</li><li>Ask for the seating chart.</li><li>Confirm passenger capacity rules.</li></ul>",
  },
  {
    id: "sound-system-reality",
    category: "quality",
    title: "Sound systems vary wildly",
    summary: "“Premium audio” can mean anything—verify Bluetooth/AUX/volume.",
    bodyHtml:
      "<p>Entertainment quality is a common disappointment.</p><ul><li>Ask which inputs are supported.</li><li>Ask if the driver controls volume.</li><li>Ask about microphone/karaoke support.</li></ul>",
  },
  {
    id: "restroom-usage",
    category: "policy",
    title: "Restroom policy on coaches",
    summary: "Some companies restrict restroom use (or charge for cleaning).",
    bodyHtml:
      "<p>Restrooms are great—but policies can be strict.</p><ul><li>Ask if restroom is available.</li><li>Ask if use is allowed during the trip.</li><li>Ask about cleaning fees.</li></ul>",
  },
  {
    id: "damage-deposit",
    category: "billing",
    title: "Damage deposits/holds",
    summary: "A refundable hold may be placed on your card.",
    bodyHtml:
      "<p>Some operators place a temporary authorization hold.</p><ul><li>Ask the hold amount.</li><li>Ask when it’s released.</li><li>Ask what triggers a charge.</li></ul>",
  },
  {
    id: "itinerary-in-writing",
    category: "booking",
    title: "Get the itinerary in writing",
    summary: "Verbal changes cause disputes—confirm times and addresses.",
    bodyHtml:
      "<p>Written itineraries prevent day-of confusion.</p><ul><li>Confirm pickup/drop-off addresses.</li><li>Confirm stop order.</li><li>Confirm contact numbers.</li></ul>",
  },
  {
    id: "tip-double-dip",
    category: "billing",
    title: "Avoid tip double-dipping",
    summary: "If gratuity is included, you shouldn’t be pressured to add more.",
    bodyHtml:
      "<p>Some invoices include gratuity but still prompt for an extra tip.</p><ul><li>Ask if gratuity is included.</li><li>Ask if additional tips are optional.</li><li>Keep your invoice handy.</li></ul>",
  },
  {
    id: "peak-holiday-pricing",
    category: "seasonal",
    title: "Holiday pricing premiums",
    summary: "New Year’s Eve and big holidays often have special minimums.",
    bodyHtml:
      "<p>Holidays can have unique policies.</p><ul><li>Ask about holiday minimum hours.</li><li>Ask about special cancellation terms.</li><li>Ask about driver availability windows.</li></ul>",
  },
  {
    id: "inspection-logs",
    category: "safety",
    title: "Ask about maintenance & inspections",
    summary: "A reputable operator can talk you through maintenance routines.",
    bodyHtml:
      "<p>You don’t need to be a mechanic—just ask good questions.</p><ul><li>How often are vehicles inspected?</li><li>Any recent safety issues?</li><li>Do they have backup vehicles?</li></ul>",
  },
  {
    id: "backup-vehicle-plan",
    category: "booking",
    title: "Confirm the backup vehicle plan",
    summary: "Breakdowns happen—ask how they handle it.",
    bodyHtml:
      "<p>Professional fleets have contingency plans.</p><ul><li>Do they have spare vehicles?</li><li>How fast can they swap?</li><li>Refund policy if delayed?</li></ul>",
  },
  {
    id: "route-change-charges",
    category: "fees",
    title: "Route changes can add fees",
    summary:
      "Changing the route mid-trip can trigger overtime or reroute fees.",
    bodyHtml:
      "<p>Drivers follow the dispatch plan; changes can affect billing.</p><ul><li>Ask how reroutes are billed.</li><li>Ask if stops need approval.</li><li>Confirm how they track time.</li></ul>",
  },
  {
    id: "capacity-vs-comfort",
    category: "quality",
    title: "Capacity vs comfort",
    summary: "Max capacity can feel cramped—size up for comfort.",
    bodyHtml:
      "<p>Manufacturers list maximum seating, not comfort seating.</p><ul><li>Ask recommended capacity.</li><li>Ask seating layout.</li><li>Plan for bags/coolers.</li></ul>",
  },
  {
    id: "pickup-grace-period",
    category: "billing",
    title: "Grace periods are rare",
    summary: "Don’t count on free extra time—overtime rules usually apply.",
    bodyHtml:
      "<p>Some companies bill overtime immediately once time is exceeded.</p><ul><li>Ask if a grace period exists.</li><li>Ask billing increments.</li><li>Plan pickup buffers.</li></ul>",
  },
  {
    id: "policy-on-food",
    category: "policy",
    title: "Food policies differ",
    summary: "Food may be allowed, but cleanup rules can be strict.",
    bodyHtml:
      "<p>Food is often allowed with conditions.</p><ul><li>Ask what’s permitted.</li><li>Ask if trash bags are provided.</li><li>Ask about cleanup fees.</li></ul>",
  },
  {
    id: "wifi-assumptions",
    category: "quality",
    title: "Wi‑Fi is not guaranteed",
    summary: "If Wi‑Fi matters, confirm it explicitly and test it.",
    bodyHtml:
      "<p>Some vehicles advertise Wi‑Fi, but coverage and speed vary.</p><ul><li>Ask if Wi‑Fi is onboard.</li><li>Ask if it’s included in price.</li><li>Have a backup hotspot plan.</li></ul>",
  },
  {
    id: "weather-contingency",
    category: "policy",
    title: "Weather contingency plans",
    summary: "Know what happens if your event changes due to weather.",
    bodyHtml:
      "<p>Weather can shift schedules quickly.</p><ul><li>Ask reschedule options.</li><li>Ask cancellation exceptions.</li><li>Ask if credit applies.</li></ul>",
  },
  {
    id: "split-payments",
    category: "billing",
    title: "Split payments can be a headache",
    summary: "Multiple cards/people paying may add admin friction or fees.",
    bodyHtml:
      "<p>If the group is paying, clarify how payments are handled.</p><ul><li>Ask if split payments are allowed.</li><li>Ask if it adds fees.</li><li>Ask if one signer is required.</li></ul>",
  },
  {
    id: "quiet-hours",
    category: "policy",
    title: "Neighborhood quiet hours",
    summary: "Late-night pickups in residential areas can limit noise/music.",
    bodyHtml:
      "<p>Drivers may comply with local ordinances.</p><ul><li>Ask about quiet hour policies.</li><li>Plan pickup logistics accordingly.</li><li>Be respectful around neighbors.</li></ul>",
  },
  {
    id: "safety-driver-screening",
    category: "safety",
    title: "Driver screening & training",
    summary: "Ask how drivers are screened and trained.",
    bodyHtml:
      "<p>Professional operators invest in driver training.</p><ul><li>Background checks?</li><li>Drug testing program?</li><li>Experience requirements?</li></ul>",
  },
  {
    id: "seasonal-availability",
    category: "seasonal",
    title: "Availability beats price on peak nights",
    summary:
      "On the busiest nights, the ‘best deal’ is the vehicle you can actually secure.",
    bodyHtml:
      "<p>Inventory sells out fast on peak nights.</p><ul><li>Book earlier for top vehicles.</li><li>Be flexible on pickup times.</li><li>Consider off-peak alternatives.</li></ul>",
  },
  {
    id: "quote-comparison",
    category: "pricing",
    title: "Compare quotes the same way",
    summary: "Hourly rate alone is misleading—compare total all-in price.",
    bodyHtml:
      "<p>Two quotes can look different but end up the same—or vice versa.</p><ul><li>Ask for an all-in total.</li><li>Confirm included fees.</li><li>Confirm minimum hours.</li></ul>",
  },
];

export function IndustrySecretsSection() {
  return <IndustrySecretsExplorer secrets={SECRETS} />;
}
