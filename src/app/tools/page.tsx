


import React from "react";
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";
import PickupTimingPlanner from "../../components/PickupTimingPlanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Limo Tools',
  viewport: 'width=device-width, initial-scale=1.0',
};

// ...existing code...


// Existing tools array and other code below
const tools = [
  {
    title: 'Cost Split Calculator',
    desc: 'Know your per-person cost instantly by entering the total cost and number of people in your group.',
    inputs: [
      { placeholder: 'Enter total cost ($)' },
      { placeholder: 'Enter number of people' },
    ],
    button: 'Calculate',
    response: 'Per-person cost: $XX.XX',
  },
  {
    title: 'Bus Size Recommender',
    desc: 'Get the perfect vehicle for your group by specifying the number of passengers.',
    inputs: [
      { placeholder: 'Enter group size' },
    ],
    button: 'Recommend',
    response: 'Recommended: 20-passenger bus',
  },
  {
    title: 'Custom Itinerary Builder',
    desc: 'Receive a suggested timeline for your night based on your event details.',
    inputs: [
      { placeholder: 'Enter event details' },
    ],
    button: 'Build Itinerary',
    response: 'Suggested timeline: Pickup at 6 PM, arrive at venue by 7 PM...'
  },
  {
    title: 'Drive Time Estimator',
    desc: 'Auto-adds distance-based charges by calculating travel time between locations.',
    inputs: [
      { placeholder: 'Enter start and end locations' },
    ],
    button: 'Estimate',
    response: 'Estimated drive time: 45 minutes',
  },
  {
    title: 'Deposit Split Tool',
    desc: 'Share payment links with your friends to split the deposit easily.',
    inputs: [
      { placeholder: 'Enter deposit amount' },
      { placeholder: 'Enter number of friends' },
    ],
    button: 'Generate Links',
    response: 'Payment link generated for $XX.XX each',
  },
  {
    title: 'Peak Pricing Detector',
    desc: 'Warns you of high-demand dates to help you plan cost-effectively.',
    inputs: [
      { placeholder: 'Enter booking date' },
    ],
    button: 'Check',
    response: 'High-demand date detected',
  },
  {
    title: 'Event Type Planner',
    desc: 'Tailors quotes for weddings, proms, or other special events.',
    inputs: [
      { placeholder: 'Enter event type' },
    ],
    button: 'Get Quote',
    response: 'Tailored quote: $XXXX for wedding',
  },
  {
    title: 'Special Request Matcher',
    desc: 'Recommends buses with poles, lights, restrooms, or other features.',
    inputs: [
      { placeholder: 'Enter special requests' },
    ],
    button: 'Find Match',
    response: 'Recommended: Bus with party lights',
  },
  {
    title: 'Budget Matcher',
    desc: 'Find the best ride within your budget by entering your price range.',
    inputs: [
      { placeholder: 'Enter budget range' },
    ],
    button: 'Find Ride',
    response: 'Best ride: 15-passenger van',
  },
  {
    title: 'Minimum Hour Detector',
    desc: 'Ensures you meet booking minimums for your rental duration.',
    inputs: [
      { placeholder: 'Enter rental hours' },
    ],
    button: 'Check',
    response: 'Meets minimum: 4 hours',
  },
  {
    title: 'Live Availability Checker',
    desc: 'Tells you what vehicles are available right now for your date.',
    inputs: [
      { placeholder: 'Enter date' },
    ],
    button: 'Check Availability',
    response: 'Available: 3 buses',
  },
  {
    title: 'Cancellation Policy Helper',
    desc: 'Explains refund timelines clearly for your booking.',
    inputs: [
      { placeholder: 'Enter booking details' },
    ],
    button: 'Check Policy',
    response: 'Full refund if canceled 7 days prior',
  },
  {
    title: 'Driver Tip Estimator',
    desc: 'Helps you factor in gratuity for your driver based on service cost.',
    inputs: [
      { placeholder: 'Enter service cost' },
    ],
    button: 'Estimate Tip',
    response: 'Suggested tip: $XX.XX',
  },
  {
    title: 'BYOB Rule Advisor',
    desc: 'Know what\'s allowed before you book, including alcohol policies.',
    inputs: [
      { placeholder: 'Enter vehicle type' },
    ],
    button: 'Check Rules',
    response: 'BYOB allowed with restrictions',
  },
  {
    title: 'Fuel Surcharge Calculator',
    desc: 'Estimate additional fuel costs based on distance and current rates.',
    inputs: [
      { placeholder: 'Enter distance (miles)' },
    ],
    button: 'Calculate',
    response: 'Estimated surcharge: $XX.XX',
  },
  {
    title: 'Route Optimizer',
    desc: 'Find the most efficient path for multiple stops to save time and money.',
    inputs: [
      { placeholder: 'Enter locations (comma-separated)' },
    ],
    button: 'Optimize',
    response: 'Optimized route: A -> B -> C',
  },
  {
    title: 'Vehicle Comparison Tool',
    desc: 'Compare features and prices of different limo or bus options side-by-side.',
    inputs: [
      { placeholder: 'Enter vehicle types to compare' },
    ],
    button: 'Compare',
    response: 'Comparison: Bus A vs Bus B',
  },
  {
    title: 'Insurance Coverage Checker',
    desc: 'Verify what insurance is included and if you need extras for your event.',
    inputs: [
      { placeholder: 'Enter event type' },
    ],
    button: 'Check',
    response: 'Coverage: Full liability included',
  },
  {
    title: 'Payment Plan Generator',
    desc: 'Create a customized installment plan for larger bookings.',
    inputs: [
      { placeholder: 'Enter total cost' }, { placeholder: 'Enter number of payments' }],
    button: 'Generate',
    response: 'Plan: $XX.XX per month',
  },
  {
    title: 'Review Aggregator',
    desc: 'View compiled reviews and ratings for vehicles or drivers.',
    inputs: [
      { placeholder: 'Enter vehicle or driver' },
    ],
    button: 'Aggregate',
    response: 'Average rating: 4.5 stars',
  },
  {
    title: 'Weather Impact Advisor',
    desc: 'Get advice on how weather might affect your booking and alternatives.',
    inputs: [
      { placeholder: 'Enter date and location' },
    ],
    button: 'Advise',
    response: 'Rain expected: Suggest indoor options',
  },
  {
    title: 'Traffic Alert System',
    desc: 'Receive real-time alerts for potential delays on your route.',
    inputs: [
      { placeholder: 'Enter route details' },
    ],
    button: 'Check Alerts',
    response: 'Alert: Heavy traffic on Hwy 101',
  },
  {
    title: 'Group Communication Hub',
    desc: 'Set up a shared chat for your group to coordinate details.',
    inputs: [
      { placeholder: 'Enter group name' },
    ],
    button: 'Create Hub',
    response: 'Hub created: Invite link generated',
  },
  {
    title: 'Photo Booth Locator',
    desc: 'Find nearby photo booths or add-ons for your party bus event.',
    inputs: [
      { placeholder: 'Enter location' },
    ],
    button: 'Locate',
    response: 'Nearest booth: 2 miles away',
  },
  {
    title: 'Music Playlist Suggester',
    desc: 'Get curated playlists based on your event theme or preferences.',
    inputs: [
      { placeholder: 'Enter event theme' },
    ],
    button: 'Suggest',
    response: 'Playlist: Party Hits 2025',
  },
  {
    title: 'Catering Partner Finder',
    desc: 'Connect with catering services that pair well with your ride.',
    inputs: [
      { placeholder: 'Enter food preferences' },
    ],
    button: 'Find',
    response: 'Partner: Local BBQ Caterers',
  },
  {
    title: 'Decoration Ideas Generator',
    desc: 'Ideas for customizing your limo or bus interior for the event.',
    inputs: [
      { placeholder: 'Enter theme' },
    ],
    button: 'Generate',
    response: 'Ideas: Balloon arches and lights',
  },
  {
    title: 'Safety Protocol Reviewer',
    desc: 'Review safety measures and tips for your group travel.',
    inputs: [
      { placeholder: 'Enter group size' },
    ],
    button: 'Review',
    response: 'Protocols: Seatbelts required',
  },
  {
    title: 'Accessibility Feature Checker',
    desc: 'Ensure vehicles have ramps, lifts, or other accessibility options.',
    inputs: [
      { placeholder: 'Enter needs' },
    ],
    button: 'Check',
    response: 'Available: Wheelchair lift',
  },
  {
    title: 'Eco-Friendly Option Selector',
    desc: 'Choose hybrid or electric vehicles for sustainable travel.',
    inputs: [
      { placeholder: 'Enter preferences' },
    ],
    button: 'Select',
    response: 'Option: Electric bus available',
  },
  {
    title: 'Loyalty Program Tracker',
    desc: 'Track points and rewards from repeat bookings.',
    inputs: [
      { placeholder: 'Enter account ID' },
    ],
    button: 'Track',
    response: 'Points: 500 earned',
  },
  {
    title: 'Referral Bonus Calculator',
    desc: 'Calculate bonuses for referring friends to the service.',
    inputs: [
      { placeholder: 'Enter referrals' },
    ],
    button: 'Calculate',
    response: 'Bonus: $XX.XX',
  },
  {
    title: 'Contract Template Builder',
    desc: 'Generate a basic contract outline for your booking.',
    inputs: [
      { placeholder: 'Enter details' },
    ],
    button: 'Build',
    response: 'Template: Ready for review',
  },
  {
    title: 'Dispute Resolution Guide',
    desc: 'Step-by-step help for resolving any booking issues.',
    inputs: [
      { placeholder: 'Enter issue type' },
    ],
    button: 'Guide',
    response: 'Steps: Contact support first',
  },
  {
    title: 'Upgrade Option Explorer',
    desc: 'Explore and add upgrades like premium sound systems.',
    inputs: [
      { placeholder: 'Enter current booking' },
    ],
    button: 'Explore',
    response: 'Upgrade: Add LED lights for $XX',
  },
  {
    title: 'Multi-Stop Planner',
    desc: 'Plan itineraries with multiple pickup and drop-off points.',
    inputs: [
      { placeholder: 'Enter stops' },
    ],
    button: 'Plan',
    response: 'Plan: Stop 1 at 5 PM, Stop 2 at 6 PM',
  },
  {
    title: 'Parking Fee Estimator',
    desc: 'Estimate parking costs at venues or stops.',
    inputs: [
      { placeholder: 'Enter location and duration' },
    ],
    button: 'Estimate',
    response: 'Fee: $XX.XX',
  },
  {
    title: 'Toll Charge Calculator',
    desc: 'Calculate tolls along your planned route.',
    inputs: [
      { placeholder: 'Enter route' },
    ],
    button: 'Calculate',
    response: 'Tolls: $XX.XX total',
  },
  {
    title: 'Driver Profile Viewer',
    desc: 'View profiles and ratings of available drivers.',
    inputs: [
      { placeholder: 'Enter date' },
    ],
    button: 'View',
    response: 'Driver: John Doe, 4.8 stars',
  },
  {
    title: 'Vehicle Maintenance Log',
    desc: 'Check the maintenance history of your selected vehicle.',
    inputs: [
      { placeholder: 'Enter vehicle ID' },
    ],
    button: 'Log',
    response: 'Last service: 1 month ago',
  },
  {
    title: 'Emergency Contact Setter',
    desc: 'Set up emergency contacts for your group during the ride.',
    inputs: [
      { placeholder: 'Enter contacts' },
    ],
    button: 'Set',
    response: 'Contacts set: Notified in emergencies',
  },
  {
    title: 'Feedback Form Creator',
    desc: 'Create a quick form to gather feedback from your group post-event.',
    inputs: [
      { placeholder: 'Enter event ID' },
    ],
    button: 'Create',
    response: 'Form: Link generated',
  },
  {
    title: 'Social Media Share Tool',
    desc: 'Generate shareable posts about your booking or event.',
    inputs: [
      { placeholder: 'Enter details' },
    ],
    button: 'Share',
    response: 'Post: Ready to share on X',
  },
  {
    title: 'Virtual Tour Viewer',
    desc: 'Take a virtual tour of available vehicles before booking.',
    inputs: [
      { placeholder: 'Enter vehicle type' },
    ],
    button: 'View',
    response: 'Tour: 360 view loaded',
  },
  {
    title: 'Customization Cost Adder',
    desc: 'Add costs for custom wraps, interiors, or branding.',
    inputs: [
      { placeholder: 'Enter customizations' },
    ],
    button: 'Add',
    response: 'Added: $XX.XX for wrap',
  },
  {
    title: 'Theme Party Planner',
    desc: 'Plan themes with matching vehicle features and decor.',
    inputs: [
      { placeholder: 'Enter theme' },
    ],
    button: 'Plan',
    response: 'Plan: Neon lights for 80s theme',
  },
  {
    title: 'Guest List Manager',
    desc: 'Manage and update your guest list for the event.',
    inputs: [
      { placeholder: 'Enter guests' },
    ],
    button: 'Manage',
    response: 'List: 15 guests added',
  },
  {
    title: 'RSVP Tracker',
    desc: 'Track responses from invites for accurate group sizing.',
    inputs: [
      { placeholder: 'Enter invite link' },
    ],
    button: 'Track',
    response: 'RSVP: 10 yes, 5 no',
  },
  {
    title: 'Timeline Adjuster',
    desc: 'Adjust your event timeline based on new details or delays.',
    inputs: [
      { placeholder: 'Enter adjustments' },
    ],
    button: 'Adjust',
    response: 'Adjusted: Pickup at 7 PM',
  },
  {
    title: 'Cost Breakdown Visualizer',
    desc: 'Visualize a pie chart of all costs in your booking.',
    inputs: [
      { placeholder: 'Enter booking ID' },
    ],
    button: 'Visualize',
    response: 'Chart: 50% base, 20% fees',
  },
  {
    title: 'Promo Code Applier',
    desc: 'Apply promo codes and see instant discounts.',
    inputs: [
      { placeholder: 'Enter promo code' },
    ],
    button: 'Apply',
    response: 'Discount: 10% off',
  },
  {
    title: 'Competitor Price Checker',
    desc: 'Compare our prices with competitors for the same service.',
    inputs: [
      { placeholder: 'Enter service details' },
    ],
    button: 'Check',
    response: 'We’re 15% cheaper',
  },
  {
    title: 'Service Area Verifier',
    desc: 'Confirm if we service your pickup and drop-off locations.',
    inputs: [
      { placeholder: 'Enter locations' },
    ],
    button: 'Verify',
    response: 'Area: Covered',
  },
  {
    title: 'Booking Confirmation Sender',
    desc: 'Send confirmation emails or texts to your group.',
    inputs: [
      { placeholder: 'Enter contacts' },
    ],
    button: 'Send',
    response: 'Sent: To 10 recipients',
  },
  {
    title: 'Wait Time Fee Calculator',
    desc: 'Estimate fees for extra waiting time at stops.',
    inputs: [
      { placeholder: 'Enter wait time (minutes)' },
    ],
    button: 'Calculate',
    response: 'Fee: $XX.XX',
  },
  {
    title: 'Pet Policy Checker',
    desc: 'Check if pets are allowed and any restrictions.',
    inputs: [
      { placeholder: 'Enter pet details' },
    ],
    button: 'Check',
    response: 'Allowed: Small pets only',
  },
  {
    title: 'Luggage Capacity Estimator',
    desc: 'Estimate how much luggage fits in your chosen vehicle.',
    inputs: [
      { placeholder: 'Enter luggage count' },
    ],
    button: 'Estimate',
    response: 'Capacity: Fits 20 bags',
  },
  {
    title: 'VIP Access Coordinator',
    desc: 'Coordinate VIP entry at venues with your ride.',
    inputs: [
      { placeholder: 'Enter venue' },
    ],
    button: 'Coordinate',
    response: 'Access: Arranged',
  },
];


export default function LimoToolsPage() {
  return (
    <PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
      <Section className="flex flex-col items-center justify-center text-center !p-0 !py-0 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700/30 via-blue-900/10 to-black" />
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg tracking-tight font-serif bg-gradient-to-r from-blue-400 via-blue-300 to-green-400 bg-clip-text text-transparent">
          Limo & Party Bus Tools
        </h1>
        <p className="text-2xl md:text-3xl max-w-3xl mx-auto mb-10 text-blue-100 font-medium">
          Instantly calculate, plan, and optimize your ride. Use our suite of tools for quotes, cost splits, routes, and more.
        </p>
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[120vw] h-40 bg-gradient-to-r from-blue-500/30 via-blue-500/20 to-green-500/10 blur-2xl opacity-60" />
      </Section>
      <Section className="max-w-5xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10">
        <div className="mb-16">
          <PickupTimingPlanner />
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          {tools.map((tool, idx) => (
            <div
              key={tool.title}
              className="flex flex-col bg-blue-950/90 rounded-2xl shadow-2xl p-8 border border-blue-700/20 hover:scale-105 hover:shadow-2xl transition-all duration-200 overflow-hidden text-white"
            >
              <h2 className="text-2xl font-bold mb-3 text-blue-100 font-serif tracking-wide flex items-center gap-2">
                {tool.title}
              </h2>
              <p className="mb-5 text-blue-200 flex-1 text-lg font-sans">{tool.desc}</p>
              <div className="flex flex-col gap-2 mb-3">
                {tool.inputs.map((input, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={input.placeholder}
                    className="w-full px-4 py-3 rounded-full border-2 border-blue-400 bg-blue-950/80 text-lg text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow placeholder:text-blue-400 font-sans"
                  />
                ))}
              </div>
              <button className="w-full bg-gradient-to-r from-blue-700 to-green-500 text-white font-bold px-6 py-3 rounded-full shadow-lg text-lg transition hover:scale-105 mb-2">
                {tool.button}
              </button>
              <div className="text-blue-300 italic text-sm font-sans">{tool.response}</div>
            </div>
          ))}
        </div>
      </Section>
    </PageLayout>
  );
}
