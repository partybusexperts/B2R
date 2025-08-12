import { FaBus, FaUserTie, FaClock, FaDollarSign, FaMapMarkedAlt, FaBirthdayCake, FaCar } from 'react-icons/fa';

const pricingSections = [
  {
    icon: FaBus,
    title: 'How Much Is A Luxury Party Bus Rental?',
    desc: `Party bus rentals range from $500 to $5,000 per day depending on location, bus size, amenities, and rental length. We offer competitive pricing and excellent service for weddings, proms, corporate events, and more. Contact us for a custom quote!`,
    img: 'https://bus2ride.com/wp-content/uploads/2024/01/pb4.png.webp',
  },
  {
    icon: FaUserTie,
    title: 'Why Does It Cost More On Prom?',
    desc: `Prom season means higher demand, longer hours, and premium services like red carpet entrances. Operational costs, maintenance, and seasonal factors also increase pricing. Book early for the best rates!`,
    img: null,
  },
  {
    icon: FaClock,
    title: 'Why Does Bus2Ride Have A Minimum Hour Rental?',
    desc: `A four-hour minimum rental helps cover overhead costs like fuel, maintenance, and insurance. Exceptions may be made for off-peak or short trips. Most customers enjoy maximizing their time with a longer rental!`,
    img: null,
  },
  {
    icon: FaCar,
    title: 'How Much Does A Limousine Rental Cost?',
    desc: `Limousine rentals average $100–$400 per hour with a 3–4 hour minimum. Pricing depends on location, limo type, duration, and amenities. We offer flexible options and competitive rates—contact us for a quote!`,
    img: null,
  },
  {
    icon: FaMapMarkedAlt,
    title: 'How Do I Get Pricing For Multi-State Trips?',
    desc: `Multi-state trip pricing depends on distance, duration, and group size. Contact us for a custom travel plan and competitive quote tailored to your adventure!`,
    img: 'https://bus2ride.com/wp-content/uploads/2024/01/PB2.png.webp',
  },
  {
    icon: FaBirthdayCake,
    title: 'What Does It Cost For A Quinceañera?',
    desc: `Quinceañera bus rentals range from $500 to $5,000 with a four-hour minimum. Shorter rentals may be available for early events. Contact us for options and to make your celebration unforgettable!`,
    img: null,
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      <h1 className="text-5xl font-extrabold mb-8 text-blue-800 text-center drop-shadow-lg tracking-tight flex items-center justify-center gap-4">
        <FaDollarSign className="inline-block text-blue-400 text-4xl mb-1" />
        Pricing
      </h1>
      <p className="mb-14 text-center text-lg text-gray-700 max-w-2xl mx-auto font-medium">
        Get transparent, competitive pricing for party buses, limos, and group travel. Every event is unique—see what goes into your quote below!
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {pricingSections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="relative group bg-white/90 rounded-2xl shadow-xl p-7 flex flex-col border border-blue-100 hover:scale-[1.025] hover:shadow-2xl transition-all duration-200 overflow-hidden min-h-[340px]"
            >
              <div className="absolute -top-4 -right-4 opacity-10 text-[7rem] pointer-events-none select-none">
                <Icon />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Icon className="text-blue-400 text-2xl" />
                <h2 className="text-xl font-bold text-blue-700 tracking-wide">{section.title}</h2>
              </div>
              <p className="text-gray-700 mb-5 font-medium flex-1">{section.desc}</p>
              {section.img && (
                <img src={section.img} alt={section.title} className="rounded-lg shadow w-full object-cover max-h-40 mt-2" />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-16 text-center text-blue-700 text-lg font-semibold">
        <span>Ready for a quote? </span>
        <a href="/contact" className="underline hover:text-blue-500 transition">Contact us today!</a>
      </div>
    </div>
  );
}
