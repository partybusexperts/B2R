import FleetFaqSection from "@/components/fleet/FleetFaqSection";

export default function BlogFaqSection() {
  return (
    <FleetFaqSection
      pageSlug="blog"
      eyebrow="Got questions?"
      heading="Blog FAQ"
      description="Search the same concierge-backed answers we surface on the homepage—tailored for readers planning their next ride."
      searchInputId="blog-faq-search"
      searchLabel="Search any blog FAQ"
      searchPlaceholder='Try "party bus", "pricing", "booking"…'
    />
  );
}
