"use client";
import React, { Suspense, useState } from "react";
import ToolModalButton from "../../components/ToolModalButton";




// ToolCard: makes each legacy tool interactive and functional
function ToolCard({ tool }: { tool: Tool }) {
  const [shareCopied, setShareCopied] = useState(false);
  // For modal tool logic
  const [inputs, setInputs] = useState(() => tool.inputs ? tool.inputs.map(() => "") : []);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Helper: call API endpoints for real-data tools (same as before)
  async function handleAction() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      let res;
      if (tool.title === "Vehicle Capacity Finder") {
        const group_size = Number(inputs[0]);
        const r = await fetch("/api/vehicle-capacity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ group_size }),
        });
        res = await r.json();
        if (res.error) setError(res.error);
        else setResult(res);
      } else if (tool.title === "Budget Estimator") {
        const group_size = Number(inputs[0]);
        const hours = Number(inputs[1]) || 4;
        const r = await fetch("/api/budget-estimate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ group_size, hours }),
        });
        res = await r.json();
        if (res.error) setError(res.error);
        else setResult(res);
      } else if (tool.title === "Vehicle Comparison") {
        const vehicle1 = inputs[0] || "";
        const vehicle2 = inputs[1] || "";
        const r = await fetch("/api/vehicle-compare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vehicle1, vehicle2 }),
        });
        res = await r.json();
        setResult(res);
      } else if (tool.title === "Weather Checker") {
        const city = inputs[0] || "";
        const date = inputs[1] || "";
        const r = await fetch("/api/weather-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ city, date }),
        });
        res = await r.json();
        setResult(res);
      } else {
        let res = "";
        switch (tool.title) {
          case "Cost Split Calculator": {
            const total = parseFloat(inputs[0]);
            const people = parseInt(inputs[1]);
            if (!total || !people || people <= 0) res = "Please enter valid numbers.";
            else res = `Per-person cost: $${(total / people).toFixed(2)}`;
            break;
          }
          case "Bus Size Recommender": {
            const size = parseInt(inputs[0]);
            if (!size || size <= 0) res = "Enter a group size.";
            else if (size <= 10) res = "Recommended: 10-passenger van";
            else if (size <= 20) res = "Recommended: 20-passenger bus";
            else if (size <= 30) res = "Recommended: 30-passenger bus";
            else if (size <= 40) res = "Recommended: 40-passenger bus";
            else res = "Recommended: Charter bus";
            break;
          }
          default: {
            res = tool.response || "(Demo only)";
          }
        }
        setResult(res);
      }
    } catch (e) {
      setError("Server error");
    }
    setLoading(false);
  }

  // Share link logic
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/tools#${tool.title.toLowerCase().replace(/\s+/g, '-')}`
    : `https://yourdomain.com/tools#${tool.title.toLowerCase().replace(/\s+/g, '-')}`;

  function handleShare() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1500);
    }
  }

  return (
    <div className="flex flex-col bg-blue-950/90 rounded-2xl shadow-2xl border border-blue-500/20 p-8 hover:scale-105 transition-transform text-white min-h-[220px] items-center justify-between">
      <h3 className="text-2xl font-bold mb-2 text-blue-200 font-serif flex items-center gap-2 text-center">
        {tool.icon && <span className="text-2xl">{tool.icon}</span>}
        {tool.title}
      </h3>
      <p className="text-blue-100 mb-4 font-sans text-center">{tool.desc}</p>
      <ToolModalButton
        title={tool.title}
        desc={tool.desc}
        icon={tool.icon}
        buttonLabel="TRY ME"
      >
        {/* Modal content: tool UI only! */}
        {tool.title === "Vehicle Capacity Finder" && (
          <div className="flex flex-col gap-2 mb-4">
            <input
              type="number"
              placeholder="Enter group size"
              className="w-full rounded border border-blue-700/40 bg-blue-900/40 text-blue-900 px-3 py-2 placeholder:text-blue-400 focus:ring-2 focus:ring-blue-400"
              value={inputs[0] || ""}
              onChange={e => setInputs([e.target.value, inputs[1] || ""])}
              disabled={loading}
            />
          </div>
        )}
        {tool.title === "Budget Estimator" && (
          <div className="flex flex-col gap-2 mb-4">
            <input
              type="number"
              placeholder="Enter group size"
              className="w-full rounded border border-blue-700/40 bg-blue-900/40 text-blue-900 px-3 py-2 placeholder:text-blue-400 focus:ring-2 focus:ring-blue-400"
              value={inputs[0] || ""}
              onChange={e => setInputs([e.target.value, inputs[1] || ""])}
              disabled={loading}
            />
            <input
              type="number"
              placeholder="Enter hours (default 4)"
              className="w-full rounded border border-blue-700/40 bg-blue-900/40 text-blue-900 px-3 py-2 placeholder:text-blue-400 focus:ring-2 focus:ring-blue-400"
              value={inputs[1] || ""}
              onChange={e => setInputs([inputs[0] || "", e.target.value])}
              disabled={loading}
            />
          </div>
        )}
        {tool.title === "Vehicle Comparison" && (
          <div className="flex flex-col gap-2 mb-4">
            <input
              type="text"
              placeholder="Vehicle 1 name (e.g. Party Bus 20)"
              className="w-full rounded border border-blue-700/40 bg-blue-900/40 text-blue-900 px-3 py-2 placeholder:text-blue-400 focus:ring-2 focus:ring-blue-400"
              value={inputs[0] || ""}
              onChange={e => setInputs([e.target.value, inputs[1] || ""])}
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Vehicle 2 name (e.g. Party Bus 30)"
              className="w-full rounded border border-blue-700/40 bg-blue-900/40 text-blue-900 px-3 py-2 placeholder:text-blue-400 focus:ring-2 focus:ring-blue-400"
              value={inputs[1] || ""}
              onChange={e => setInputs([inputs[0] || "", e.target.value])}
              disabled={loading}
            />
          </div>
        )}
        {tool.title === "Weather Checker" && (
          <div className="flex flex-col gap-2 mb-4">
            <input
              type="text"
              placeholder="Enter city"
              className="w-full rounded border border-blue-700/40 bg-blue-900/40 text-blue-900 px-3 py-2 placeholder:text-blue-400 focus:ring-2 focus:ring-blue-400"
              value={inputs[0] || ""}
              onChange={e => setInputs([e.target.value, inputs[1] || ""])}
              disabled={loading}
            />
            <input
              type="date"
              placeholder="Enter date"
              className="w-full rounded border border-blue-700/40 bg-blue-900/40 text-blue-900 px-3 py-2 placeholder:text-blue-400 focus:ring-2 focus:ring-blue-400"
              value={inputs[1] || ""}
              onChange={e => setInputs([inputs[0] || "", e.target.value])}
              disabled={loading}
            />
          </div>
        )}
        {tool.inputs && !["Vehicle Capacity Finder","Budget Estimator","Vehicle Comparison","Weather Checker"].includes(tool.title) && (
          <div className="flex flex-col gap-2 mb-4">
            {tool.inputs.map((input: { placeholder: string }, j: number) => (
              <input
                key={j}
                type="text"
                placeholder={input.placeholder}
                className="w-full rounded border border-blue-700/40 bg-blue-900/40 text-blue-900 px-3 py-2 placeholder:text-blue-400 focus:ring-2 focus:ring-blue-400"
                value={inputs[j]}
                onChange={e => setInputs(inputs.map((v, idx) => idx === j ? e.target.value : v))}
                disabled={loading}
              />
            ))}
          </div>
        )}
        {/* Inline share link inside the modal (hyperlink but copies URL) */}
        <div className="w-full mb-2 flex items-center justify-center">
          <a
            href={shareUrl}
            onClick={e => { e.preventDefault(); handleShare(); }}
            className="text-sm text-blue-200 underline hover:text-blue-100 text-center"
          >
            Share This Tool On Your Website!
          </a>
          {shareCopied && <span className="text-green-400 text-sm ml-2">Copied!</span>}
        </div>

        <button
          className="w-full bg-gradient-to-r from-blue-700 to-blue-400 text-white p-2 rounded font-bold mb-2 hover:scale-105 transition-transform shadow-lg"
          onClick={handleAction}
          disabled={loading}
        >
          {loading ? "Working..." : tool.button || "Go"}
        </button>
        {error && (
          <div className="text-red-400 italic text-sm font-sans mb-2">{error}</div>
        )}
        {result && tool.title === "Vehicle Capacity Finder" && Array.isArray(result) && (
          <div className="text-blue-300 italic text-sm font-sans mb-2">
            {result.map((v: any, i: number) => (
              <div key={i} className="mb-2 p-2 bg-blue-900/60 rounded">
                <div className="font-bold">{v.name}</div>
                <div>Capacity: {v.capacity}</div>
                <div>Hourly: ${v.hourly}</div>
              </div>
            ))}
          </div>
        )}
        {result && tool.title === "Budget Estimator" && result.vehicle && (
          <div className="text-blue-300 italic text-sm font-sans mb-2">
            <div>Vehicle: <b>{result.vehicle}</b></div>
            <div>Hourly: ${result.hourly}</div>
            <div>Hours: {result.hours}</div>
            <div className="font-bold">Total: ${result.total}</div>
          </div>
        )}
        {result && tool.title === "Vehicle Comparison" && Array.isArray(result) && (
          <div className="text-blue-300 italic text-sm font-sans mb-2 grid grid-cols-2 gap-2">
            {result.map((v: any, i: number) => (
              <div key={i} className="p-2 bg-blue-900/60 rounded">
                <div className="font-bold">{v.name}</div>
                {v.error ? <div className="text-red-400">{v.error}</div> : (
                  <>
                    <div>Capacity: {v.capacity}</div>
                    <div>Hourly: ${v.hourly}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        {result && tool.title === "Weather Checker" && (
          <div className="text-blue-300 italic text-sm font-sans mb-2">
            <div>{result.city} on {result.date}:</div>
            <div className="font-bold">{result.summary}, {result.temp}&deg;F</div>
          </div>
        )}
        {result && !["Vehicle Capacity Finder","Budget Estimator","Vehicle Comparison","Weather Checker"].includes(tool.title) && (
          <div className="text-blue-300 italic text-sm font-sans mb-2">{result}</div>
        )}
      </ToolModalButton>
      <div className="w-full flex items-center justify-center mb-2">
        <a
          href={shareUrl}
          onClick={e => { e.preventDefault(); handleShare(); }}
          className="text-blue-300 underline text-sm hover:text-blue-100 text-center"
        >
          Share On Your Website
        </a>
      </div>
      {shareCopied && <div className="text-green-400 text-xs mt-1 text-center">Copied!</div>}
    </div>
  );
}
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";





type Tool = {
  title: string;
  desc: string;
  icon?: string;
  render?: () => React.ReactElement;
  inputs?: { placeholder: string }[];
  button?: string;
  response?: string;
};

const TOP_TOOLS: Tool[] = [
  { title: "Vehicle Capacity Finder", desc: "Enter your group size to see best-fit vehicles.", icon: "🚌", button: "Try Tool" },
  { title: "Vehicle Comparison", desc: "Pick two vehicle types and compare quickly.", icon: "⚖️", button: "Try Tool" },
  { title: "Budget Estimator", desc: "Get a fast ballpark price for your trip.", icon: "💰", button: "Try Tool" },
  { title: "Playlist Starter", desc: "One-click Spotify vibes for any occasion.", icon: "🎶", button: "Try Tool" },
  { title: "Tailgate Checklist", desc: "Everything you need for game day.", icon: "🏈", button: "Try Tool" },
  { title: "Route Planner", desc: "Map your trip and optimize stops easily.", icon: "🗺️", button: "Try Tool" },
  { title: "Weather Checker", desc: "Check the forecast for your trip dates.", icon: "🌤️", button: "Try Tool" },
  { title: "Accessibility Guide", desc: "Find accessible vehicles and trip tips.", icon: "♿", button: "Try Tool" },
  { title: "Event Sync", desc: "Sync your trip with calendars and events.", icon: "📅", button: "Try Tool" },
];

const LEGACY_TOOLS: Tool[] = [
  { title: "Cost Split Calculator", desc: "Know your per-person cost instantly by entering the total cost and number of people in your group.", inputs: [ { placeholder: "Enter total cost ($)" }, { placeholder: "Enter number of people" } ], button: "Calculate", response: "Per-person cost: $XX.XX" },
  { title: "Bus Size Recommender", desc: "Get the perfect vehicle for your group by specifying the number of passengers.", inputs: [ { placeholder: "Enter group size" } ], button: "Recommend", response: "Recommended: 20-passenger bus" },
  { title: "Custom Itinerary Builder", desc: "Receive a suggested timeline for your night based on your event details.", inputs: [ { placeholder: "Enter event details" } ], button: "Build Itinerary", response: "Suggested timeline: Pickup at 6 PM, arrive at venue by 7 PM..." },
  { title: "Drive Time Estimator", desc: "Auto-adds distance-based charges by calculating travel time between locations.", inputs: [ { placeholder: "Enter start and end locations" } ], button: "Estimate", response: "Estimated drive time: 45 minutes" },
  { title: "Deposit Split Tool", desc: "Share payment links with your friends to split the deposit easily.", inputs: [ { placeholder: "Enter deposit amount" }, { placeholder: "Enter number of friends" } ], button: "Generate Links", response: "Payment link generated for $XX.XX each" },
  { title: "Peak Pricing Detector", desc: "Warns you of high-demand dates to help you plan cost-effectively.", inputs: [ { placeholder: "Enter booking date" } ], button: "Check", response: "High-demand date detected" },
  { title: "Event Type Planner", desc: "Tailors quotes for weddings, proms, or other special events.", inputs: [ { placeholder: "Enter event type" } ], button: "Get Quote", response: "Tailored quote: $XXXX for wedding" },
  { title: "Special Request Matcher", desc: "Recommends buses with poles, lights, restrooms, or other features.", inputs: [ { placeholder: "Enter special requests" } ], button: "Find Match", response: "Recommended: Bus with party lights" },
  { title: "Budget Matcher", desc: "Find the best ride within your budget by entering your price range.", inputs: [ { placeholder: "Enter budget range" } ], button: "Find Ride", response: "Best ride: 15-passenger van" },
  { title: "Minimum Hour Detector", desc: "Ensures you meet booking minimums for your rental duration.", inputs: [ { placeholder: "Enter rental hours" } ], button: "Check", response: "Meets minimum: 4 hours" },
  { title: "Live Availability Checker", desc: "Tells you what vehicles are available right now for your date.", inputs: [ { placeholder: "Enter date" } ], button: "Check Availability", response: "Available: 3 buses" },
  { title: "Cancellation Policy Helper", desc: "Explains refund timelines clearly for your booking.", inputs: [ { placeholder: "Enter booking details" } ], button: "Check Policy", response: "Full refund if canceled 7 days prior" },
  { title: "Driver Tip Estimator", desc: "Helps you factor in gratuity for your driver based on service cost.", inputs: [ { placeholder: "Enter service cost" } ], button: "Estimate Tip", response: "Suggested tip: $XX.XX" },
  { title: "BYOB Rule Advisor", desc: "Know what's allowed before you book, including alcohol policies.", inputs: [ { placeholder: "Enter vehicle type" } ], button: "Check Rules", response: "BYOB allowed with restrictions" },
  { title: "Fuel Surcharge Calculator", desc: "Estimate additional fuel costs based on distance and current rates.", inputs: [ { placeholder: "Enter distance (miles)" } ], button: "Calculate", response: "Estimated surcharge: $XX.XX" },
  { title: "Route Optimizer", desc: "Find the most efficient path for multiple stops to save time and money.", inputs: [ { placeholder: "Enter locations (comma-separated)" } ], button: "Optimize", response: "Optimized route: A -> B -> C" },
  { title: "Vehicle Comparison Tool", desc: "Compare features and prices of different limo or bus options side-by-side.", inputs: [ { placeholder: "Enter vehicle types to compare" } ], button: "Compare", response: "Comparison: Bus A vs Bus B" },
  { title: "Insurance Coverage Checker", desc: "Verify what insurance is included and if you need extras for your event.", inputs: [ { placeholder: "Enter event type" } ], button: "Check", response: "Coverage: Full liability included" },
  { title: "Payment Plan Generator", desc: "Create a customized installment plan for larger bookings.", inputs: [ { placeholder: "Enter total cost" }, { placeholder: "Enter number of payments" } ], button: "Generate", response: "Plan: $XX.XX per month" },
  { title: "Review Aggregator", desc: "View compiled reviews and ratings for vehicles or drivers.", inputs: [ { placeholder: "Enter vehicle or driver" } ], button: "Aggregate", response: "Average rating: 4.5 stars" },
  { title: "Weather Impact Advisor", desc: "Get advice on how weather might affect your booking and alternatives.", inputs: [ { placeholder: "Enter date and location" } ], button: "Advise", response: "Rain expected: Suggest indoor options" },
  { title: "Traffic Alert System", desc: "Receive real-time alerts for potential delays on your route.", inputs: [ { placeholder: "Enter route details" } ], button: "Check Alerts", response: "Alert: Heavy traffic on Hwy 101" },
  { title: "Group Communication Hub", desc: "Set up a shared chat for your group to coordinate details.", inputs: [ { placeholder: "Enter group name" } ], button: "Create Hub", response: "Hub created: Invite link generated" },
  { title: "Photo Booth Locator", desc: "Find nearby photo booths or add-ons for your party bus event.", inputs: [ { placeholder: "Enter location" } ], button: "Locate", response: "Nearest booth: 2 miles away" },
  { title: "Music Playlist Suggester", desc: "Get curated playlists based on your event theme or preferences.", inputs: [ { placeholder: "Enter event theme" } ], button: "Suggest", response: "Playlist: Party Hits 2025" },
  { title: "Catering Partner Finder", desc: "Connect with catering services that pair well with your ride.", inputs: [ { placeholder: "Enter food preferences" } ], button: "Find", response: "Partner: Local BBQ Caterers" },
  { title: "Decoration Ideas Generator", desc: "Ideas for customizing your limo or bus interior for the event.", inputs: [ { placeholder: "Enter theme" } ], button: "Generate", response: "Ideas: Balloon arches and lights" },
  { title: "Safety Protocol Reviewer", desc: "Review safety measures and tips for your group travel.", inputs: [ { placeholder: "Enter group size" } ], button: "Review", response: "Protocols: Seatbelts required" },
  { title: "Accessibility Feature Checker", desc: "Ensure vehicles have ramps, lifts, or other accessibility options.", inputs: [ { placeholder: "Enter needs" } ], button: "Check", response: "Available: Wheelchair lift" },
  { title: "Eco-Friendly Option Selector", desc: "Choose hybrid or electric vehicles for sustainable travel.", inputs: [ { placeholder: "Enter preferences" } ], button: "Select", response: "Option: Electric bus available" },
  { title: "Loyalty Program Tracker", desc: "Track points and rewards from repeat bookings.", inputs: [ { placeholder: "Enter account ID" } ], button: "Track", response: "Points: 500 earned" },
  { title: "Referral Bonus Calculator", desc: "Calculate bonuses for referring friends to the service.", inputs: [ { placeholder: "Enter referrals" } ], button: "Calculate", response: "Bonus: $XX.XX" },
  { title: "Contract Template Builder", desc: "Generate a basic contract outline for your booking.", inputs: [ { placeholder: "Enter details" } ], button: "Build", response: "Template: Ready for review" },
  { title: "Dispute Resolution Guide", desc: "Step-by-step help for resolving any booking issues.", inputs: [ { placeholder: "Enter issue type" } ], button: "Guide", response: "Steps: Contact support first" },
  { title: "Upgrade Option Explorer", desc: "Explore and add upgrades like premium sound systems.", inputs: [ { placeholder: "Enter current booking" } ], button: "Explore", response: "Upgrade: Add LED lights for $XX" },
  { title: "Multi-Stop Planner", desc: "Plan itineraries with multiple pickup and drop-off points.", inputs: [ { placeholder: "Enter stops" } ], button: "Plan", response: "Plan: Stop 1 at 5 PM, Stop 2 at 6 PM" },
  { title: "Parking Fee Estimator", desc: "Estimate parking costs at venues or stops.", inputs: [ { placeholder: "Enter location and duration" } ], button: "Estimate", response: "Fee: $XX.XX" },
  { title: "Toll Charge Calculator", desc: "Calculate tolls along your planned route.", inputs: [ { placeholder: "Enter route" } ], button: "Calculate", response: "Tolls: $XX.XX total" },
  { title: "Driver Profile Viewer", desc: "View profiles and ratings of available drivers.", inputs: [ { placeholder: "Enter date" } ], button: "View", response: "Driver: John Doe, 4.8 stars" },
  { title: "Vehicle Maintenance Log", desc: "Check the maintenance history of your selected vehicle.", inputs: [ { placeholder: "Enter vehicle ID" } ], button: "Log", response: "Last service: 1 month ago" },
  { title: "Emergency Contact Setter", desc: "Set up emergency contacts for your group during the ride.", inputs: [ { placeholder: "Enter contacts" } ], button: "Set", response: "Contacts set: Notified in emergencies" },
  { title: "Feedback Form Creator", desc: "Create a quick form to gather feedback from your group post-event.", inputs: [ { placeholder: "Enter event ID" } ], button: "Create", response: "Form: Link generated" },
  { title: "Social Media Share Tool", desc: "Generate shareable posts about your booking or event.", inputs: [ { placeholder: "Enter details" } ], button: "Share", response: "Post: Ready to share on X" },
  { title: "Virtual Tour Viewer", desc: "Take a virtual tour of available vehicles before booking.", inputs: [ { placeholder: "Enter vehicle type" } ], button: "View", response: "Tour: 360 view loaded" },
  { title: "Customization Cost Adder", desc: "Add costs for custom wraps, interiors, or branding.", inputs: [ { placeholder: "Enter customizations" } ], button: "Add", response: "Added: $XX.XX for wrap" },
  { title: "Theme Party Planner", desc: "Plan themes with matching vehicle features and decor.", inputs: [ { placeholder: "Enter theme" } ], button: "Plan", response: "Plan: Neon lights for 80s theme" },
  { title: "Guest List Manager", desc: "Manage and update your guest list for the event.", inputs: [ { placeholder: "Enter guests" } ], button: "Manage", response: "List: 15 guests added" },
  { title: "RSVP Tracker", desc: "Track responses from invites for accurate group sizing.", inputs: [ { placeholder: "Enter invite link" } ], button: "Track", response: "RSVP: 10 yes, 5 no" },
  { title: "Timeline Adjuster", desc: "Adjust your event timeline based on new details or delays.", inputs: [ { placeholder: "Enter adjustments" } ], button: "Adjust", response: "Adjusted: Pickup at 7 PM" },
  { title: "Cost Breakdown Visualizer", desc: "Visualize a pie chart of all costs in your booking.", inputs: [ { placeholder: "Enter booking ID" } ], button: "Visualize", response: "Chart: 50% base, 20% fees" },
  { title: "Promo Code Applier", desc: "Apply promo codes and see instant discounts.", inputs: [ { placeholder: "Enter promo code" } ], button: "Apply", response: "Discount: 10% off" },
  { title: "Competitor Price Checker", desc: "Compare our prices with competitors for the same service.", inputs: [ { placeholder: "Enter service details" } ], button: "Check", response: "We’re 15% cheaper" },
  { title: "Service Area Verifier", desc: "Confirm if we service your pickup and drop-off locations.", inputs: [ { placeholder: "Enter locations" } ], button: "Verify", response: "Area: Covered" },
  { title: "Booking Confirmation Sender", desc: "Send confirmation emails or texts to your group.", inputs: [ { placeholder: "Enter contacts" } ], button: "Send", response: "Sent: To 10 recipients" },
  { title: "Wait Time Fee Calculator", desc: "Estimate fees for extra waiting time at stops.", inputs: [ { placeholder: "Enter wait time (minutes)" } ], button: "Calculate", response: "Fee: $XX.XX" },
  { title: "Pet Policy Checker", desc: "Check if pets are allowed and any restrictions.", inputs: [ { placeholder: "Enter pet details" } ], button: "Check", response: "Allowed: Small pets only" },
  { title: "Luggage Capacity Estimator", desc: "Estimate how much luggage fits in your chosen vehicle.", inputs: [ { placeholder: "Enter luggage count" } ], button: "Estimate", response: "Capacity: Fits 20 bags" },
  { title: "VIP Access Coordinator", desc: "Coordinate VIP entry at venues with your ride.", inputs: [ { placeholder: "Enter venue" } ], button: "Coordinate", response: "Access: Arranged" },
];

const ALL_TOOLS: Tool[] = [...TOP_TOOLS, ...LEGACY_TOOLS];

export default function LimoToolsPage() {
  const [search, setSearch] = useState("");
  const filteredTools = ALL_TOOLS.filter(
    t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.desc.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
      <div className="w-full bg-gradient-to-br from-blue-950 via-blue-900 to-black py-16 md:py-20 px-0 text-white">
        <div className="max-w-6xl mx-auto flex flex-col items-center px-4 md:px-0">
          <h1 className="text-5xl md:text-7xl font-extrabold text-center mb-4 font-serif tracking-tight bg-gradient-to-r from-blue-300 via-blue-200 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
            Limo & Party Bus Tools
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 text-center max-w-2xl font-medium mb-8">
            Instantly calculate, plan, and optimize your ride. Use our suite of tools for quotes, cost splits, routes, and more.
          </p>
          {/* Search Bar */}
          <div className="w-full flex justify-center mb-10">
            <input
              type="text"
              placeholder="Search tools..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-blue-950/80 border border-blue-700/40 text-white placeholder-blue-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              aria-label="Search tools"
            />
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 justify-center items-stretch">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.title} tool={tool} />
            ))}
            {filteredTools.length === 0 && (
              <div className="col-span-full text-center text-blue-200 text-xl py-12">No tools found.</div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}




