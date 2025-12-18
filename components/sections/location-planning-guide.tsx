import { LocationsData } from "@/lib/data/locations";

export default function LocationPlanningGuide({
  location,
}: {
  location: LocationsData;
}) {
  const guides = [
    location.state_planning_guide?.box1,
    location.state_planning_guide?.box2,
    location.state_planning_guide?.box3,
    location.state_planning_guide?.box4,
    location.state_planning_guide?.box5,
    location.state_planning_guide?.box6,
    location.state_planning_guide?.box7,
    location.state_planning_guide?.box8,
  ];

  return (
    <section
      className="relative max-w-7xl mx-auto bg-gradient-to-br rounded-3xl
        shadow-xl border border-blue-500/30 py-12 px-6 mb-16 from-blue-900/90
        to-black"
    >
      <h2
        className="text-4xl md:text-5xl font-extrabold text-center mb-12
          bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text
          text-transparent drop-shadow-lg font-serif tracking-tight"
        id={`${location.state_slug}-planning-guide-3`}
      >
        {location.state_name} Planning Guide
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Col 1 */}
        <div className="space-y-8">
          {guides.slice(0, 4).map((guide, index) => (
            <div
              key={index}
              className="bg-[#122a56] border border-blue-800/40 rounded-3xl p-6
                shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-3 font-serif text-white">
                {guide?.title}
              </h3>
              <p className="text-blue-100/90 leading-relaxed">
                {guide?.description}
              </p>
            </div>
          ))}
        </div>

        {/* Col 2 */}
        <div className="space-y-8">
          {guides.slice(4, 8).map((guide, index) => (
            <div
              key={index}
              className="bg-[#122a56] border border-blue-800/40 rounded-3xl p-6
                shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-3 font-serif text-white">
                {guide?.title}
              </h3>
              <p className="text-blue-100/90 leading-relaxed">
                {guide?.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
