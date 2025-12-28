import Hero from "@/components/layout/hero";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { getReviews } from "@/lib/data/reviews";
import { getBlogPosts } from "@/lib/data/blog";
import { BlogGridClient } from "@/components/sections/blog-grid.client";
import FleetSection from "@/components/sections/fleet-section";
import { TriviaBookingSection, type TriviaItem } from "@/components/sections/trivia-booking-section";
import { ContentExpansion, type ContentBlock } from "@/components/sections/content-expansion";
import { LinkConstellation, type InternalLink, type ExternalLink } from "@/components/sections/link-constellation";
import { SectionDivider, PremiumDivider } from "@/components/layout/section-dividers";
import { BookingProcessSection } from "@/components/sections/content-booking";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Blog",
  description:
    "Planning tips, pricing breakdowns, and booking advice for party buses, limos, and coach buses — written for real group trips.",
  path: "/blog",
});

const BLOG_TRIVIA: TriviaItem[] = [
  {
    id: "1",
    question: "What's the most common mistake first-time party bus renters make?",
    answer: "Underestimating travel time between stops! Traffic, pickup delays, and bathroom breaks can eat 20-30% of your rental time. Build buffer time into your itinerary.",
    category: "Planning Tip",
    source: "Driver Feedback Survey 2024",
  },
  {
    id: "2",
    question: "What percentage of wedding parties book transportation?",
    answer: "About 72% of wedding parties now book professional transportation. The number has grown 15% in the last 5 years as couples prioritize guest experience and safety.",
    category: "Industry Stat",
    source: "Wedding Industry Report",
  },
  {
    id: "3",
    question: "What day has the highest demand for party buses?",
    answer: "Saturday nights account for 45% of all party bus bookings. Prom season Saturdays in April-May see 3x normal demand!",
    category: "Booking Insight",
    source: "Booking Data Analysis",
  },
  {
    id: "4",
    question: "How far in advance should you book for popular dates?",
    answer: "For peak dates (prom, NYE, major holidays), book 6-8 weeks ahead. Regular weekends typically need 2-3 weeks. Last-minute bookings often have limited vehicle choices.",
    category: "Pro Tip",
    source: "Fleet Manager Survey",
  },
  {
    id: "5",
    question: "What's the ideal group size for a party bus?",
    answer: "Fill your bus to 75-80% capacity for the best experience. This allows room to move, dance, and ensures everyone has comfortable seating.",
    category: "Planning Tip",
    source: "Customer Satisfaction Survey",
  },
];

const INTERNAL_LINKS: InternalLink[] = [
  { href: "/events", label: "Event Guides", description: "Detailed playbooks for every occasion", category: "events" },
  { href: "/pricing", label: "Pricing Guide", description: "Understand transportation costs", category: "resources" },
  { href: "/tools", label: "Planning Tools", description: "Calculators and checklists", category: "tools" },
  { href: "/fleet", label: "Browse Fleet", description: "Explore our vehicle options", category: "fleet" },
  { href: "/locations", label: "Service Areas", description: "Find coverage in your city", category: "locations" },
  { href: "/reviews", label: "Customer Stories", description: "Real experiences from real groups", category: "resources" },
];

const EXTERNAL_LINKS: ExternalLink[] = [
  { href: "https://www.theknot.com/", label: "Wedding Planning", source: "The Knot" },
  { href: "https://www.brides.com/", label: "Bridal Resources", source: "Brides" },
  { href: "https://www.weddingwire.com/", label: "Vendor Reviews", source: "WeddingWire" },
];

const CONTENT_BLOCKS: ContentBlock[] = [
  {
    id: "transportation-planning-basics",
    title: "Group Transportation Planning Basics",
    content: `
      <p>Planning transportation for a group event requires balancing logistics, budget, and guest experience. Whether you're organizing a wedding, corporate outing, or celebration, understanding the fundamentals ensures a smooth ride for everyone.</p>
      
      <h4>Start with Your Numbers</h4>
      <p>Begin by counting your guests accurately. Consider who needs transportation (the full group vs. VIPs only), pickup/dropoff locations, and whether you need round-trip service. A 10% buffer for last-minute additions is wise.</p>
      
      <h4>Map Your Timeline</h4>
      <p>Transportation isn't just about the ride—it's about the timing. Account for pickup time (allow 15 minutes per stop), travel time (add 20% for traffic), event duration, and return logistics. Most rentals have minimum hours, so plan accordingly.</p>
      
      <h4>Choose the Right Vehicle</h4>
      <p>Match vehicle to occasion: party buses for celebrations and nightlife, limousines for intimate groups and formal events, coach buses for large groups and longer distances. Consider amenities, accessibility needs, and the vibe you want to create.</p>
    `,
  },
  {
    id: "booking-best-practices",
    title: "Booking Best Practices",
    content: `
      <p>Smart booking decisions save money and prevent headaches. Follow these practices to secure the best vehicle at the best price.</p>
      
      <h4>Book Early, Book Smart</h4>
      <p>Peak dates sell out quickly. For proms, weddings, and holidays, book 6-8 weeks ahead. Standard events need 2-3 weeks minimum. Early booking often comes with better rates and vehicle selection.</p>
      
      <h4>Get Everything in Writing</h4>
      <p>Your contract should clearly state: vehicle type and size, pickup/dropoff times and locations, total cost including gratuity and fees, cancellation policy, and what happens if they need to substitute a vehicle.</p>
      
      <h4>Verify Insurance and Licensing</h4>
      <p>Legitimate companies carry commercial insurance and proper licensing. Ask to see certificates of insurance and DOT numbers. This protects you if anything goes wrong.</p>
      
      <h4>Communicate Your Itinerary</h4>
      <p>Share your full schedule with the company, including stops, estimated times at each location, and any special requirements. Clear communication prevents day-of confusion.</p>
    `,
  },
  {
    id: "event-specific-tips",
    title: "Event-Specific Transportation Tips",
    content: `
      <p>Different events have unique transportation needs. Here's what to consider for common occasions.</p>
      
      <h4>Weddings</h4>
      <p>Coordinate with your venue about arrival times and parking. Consider separate vehicles for the bridal party and guests. Plan for photos—your driver can help with scenic stops. Don't forget the getaway car!</p>
      
      <h4>Proms and Formals</h4>
      <p>Book extra early—prom season is the busiest time. Confirm all passengers have signed waivers if required. Establish clear pickup times with parents. No alcohol policies are strictly enforced.</p>
      
      <h4>Bachelor/Bachelorette Parties</h4>
      <p>Choose party buses with entertainment systems. Plan bar-hopping routes efficiently. Designate a point person to communicate with the driver. Set clear expectations about what's allowed on the bus.</p>
      
      <h4>Corporate Events</h4>
      <p>Prioritize punctuality and professionalism. Consider WiFi-equipped vehicles for working travelers. Arrange for signage at pickup points. Have a backup plan for VIPs.</p>
    `,
  },
  {
    id: "maximizing-your-rental",
    title: "Maximizing Your Rental Experience",
    content: `
      <p>Get the most value from your transportation booking with these expert tips.</p>
      
      <h4>Plan Your Playlist</h4>
      <p>Most party buses have Bluetooth connectivity. Create your playlist in advance and designate a DJ. Have a backup playlist saved on a phone in case of connectivity issues.</p>
      
      <h4>Coordinate Decorations</h4>
      <p>Ask about decoration policies before your event. Many companies allow tasteful decorations (banners, balloons) but prohibit confetti, glitter, or anything that could stain. Get approval in writing.</p>
      
      <h4>Know the Rules</h4>
      <p>Understand policies on food, beverages, and smoking before you board. Most vehicles prohibit smoking but allow food and drinks. BYOB policies vary—always ask first.</p>
      
      <h4>Tip Appropriately</h4>
      <p>Standard gratuity is 15-20% of the total rental cost. If service exceeds expectations, tip accordingly. Some companies include gratuity in pricing—check your contract.</p>
    `,
  },
  {
    id: "troubleshooting-common-issues",
    title: "Handling Common Issues",
    content: `
      <p>Even well-planned events can hit snags. Here's how to handle common transportation challenges.</p>
      
      <h4>Running Late</h4>
      <p>Communicate immediately with your driver or company. Most are flexible within reason, but overtime charges may apply. Build buffer time into your schedule to avoid this.</p>
      
      <h4>Vehicle Issues</h4>
      <p>Reputable companies have backup vehicles available. If there's a problem, stay calm and let them solve it. Document any issues for potential compensation.</p>
      
      <h4>Group Members Missing Pickup</h4>
      <p>Establish clear departure times and stick to them. Have a backup plan for stragglers (rideshare numbers, meeting point). Don't let one person delay the entire group.</p>
      
      <h4>Weather Concerns</h4>
      <p>Professional drivers handle weather safely. In severe conditions, communicate with your company about rescheduling options. Most have flexible policies for weather-related changes.</p>
    `,
  },
  {
    id: "after-the-ride",
    title: "After Your Event",
    content: `
      <p>Your relationship with the transportation company doesn't end when you arrive at your destination.</p>
      
      <h4>Leave a Review</h4>
      <p>Share your experience to help others make informed decisions. Mention specific details: driver professionalism, vehicle cleanliness, punctuality, and overall experience.</p>
      
      <h4>Check for Lost Items</h4>
      <p>Do a quick sweep before exiting. If you discover something missing later, contact the company immediately. Most have lost-and-found procedures.</p>
      
      <h4>Handle Disputes Professionally</h4>
      <p>If something went wrong, document it with photos and reach out to management. Give them a chance to make it right before escalating. Most reputable companies value customer satisfaction.</p>
      
      <h4>Book Again</h4>
      <p>Found a great company? Save their information for future events. Repeat customers often receive loyalty discounts and priority booking.</p>
    `,
  },
];

export default async function BlogPage() {
  const blogs = (await getBlogPosts()) ?? [];
  const reviews = (await getReviews()) ?? [];

  return (
    <main className="bg-[#0a1628]">
      <Hero slug="blog" />

      <SectionDivider variant="glow" />

      <BlogGridClient posts={blogs} />

      <PremiumDivider />

      <FleetSection />

      <SectionDivider variant="gradient" />

      <TriviaBookingSection
        triviaItems={BLOG_TRIVIA}
        title="Transportation Trivia & How to Book"
        subtitle="Insider knowledge and step-by-step booking guide"
        bookingTitle="How to Book with Bus2Ride"
      />

      <SectionDivider variant="dots" />

      <ContentExpansion
        blocks={CONTENT_BLOCKS}
        title="The Complete Transportation Planning Guide"
        subtitle="Everything you need to know about booking and managing group transportation"
        readTime="12 min"
        wordCount={2500}
      />

      <PremiumDivider />

      <ReviewsSection reviews={reviews} />

      <SectionDivider variant="gradient" />

      <PollsGrid
        columnCategories={["wine-tours", "brewery-tours", "entertainment-tours"]}
        hideCities
        title="Blog Polls"
      />

      <SectionDivider variant="dots" />

      <BookingProcessSection />

      <PremiumDivider />

      <ToolsGrid category="blog" />

      <SectionDivider variant="glow" />

      <EventsGrid />

      <SectionDivider variant="gradient" />

      <LinkConstellation
        internalLinks={INTERNAL_LINKS}
        externalLinks={EXTERNAL_LINKS}
        title="Explore More Resources"
      />

      <SectionDivider variant="dots" />

      <FaqSection category="blog" title="Blog & Resources FAQ" />
    </main>
  );
}
