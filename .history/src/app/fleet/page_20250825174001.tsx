
import React from "react";
import Image from "next/image";


const randomImages = [
  "/images/18 Passenger White Party Bus Interior.png",
  "/images/18 Passenger White Party Bus Exterior.png",
  "/images/20 Passenger White Party Bus Exterior.png",
  "/images/36 Passenger Party Bus Exterior 4.png",
  "/images/10 Passenger Black Lincoln Stretch Limo Exterior Black.png",
  "/images/10 Passenger Chrysler 300 Limo Exterior.png",
  "/images/10 Passenger Lincoln Stretch Limo Interior.png",
  "/images/16_Passenger_Stretch_Excursion_Exterior_optimized.jpg",
  "/images/18 Passenger Hummer Limo Interior.png",
  "/images/Bus-1.png",
  "/images/Bus-2.png",
  "/images/Bus-3.png",
  "/images/Bus-4.png",
  "/images/Bus-5.png",
];

function getRandomImage() {
  return randomImages[Math.floor(Math.random() * randomImages.length)];
}

const vehicles = [
  {
    name: "Party Buses",
    capacity: 30,
    image: getRandomImage(),
    href: "/party-buses",
    description: "Rolling nightlife: perimeter seating, lighting, sound & open space to celebrate in motion."
  },
  {
    name: "Limousines",
    capacity: 10,
    image: getRandomImage(),
    href: "/limousines",
    description: "Classic stretch elegance for weddings, proms & VIP arrivals with privacy divider comfort."
  },
  {
    name: "Limo Style Sprinter Vans",
    capacity: 14,
    image: getRandomImage(),
    href: "/party-buses", // per instructions limo style sprinters -> party buses fleet page
    description: "Luxury van interiors with party lighting & lounge feel for versatile upscale nights out."
  },
  {
    name: "Executive Style Sprinter Vans",
    capacity: 14,
    image: getRandomImage(),
    href: "/coach-buses", // executive sprinters -> coach bus fleet page
    description: "Forward / captain seating, work-friendly environment, perfect for corporate transfers."
  },
  {
    name: "Shuttle Buses",
    capacity: 24,
    image: getRandomImage(),
    href: "/coach-buses", // shuttle buses -> coach bus fleet page
    description: "Efficient group movement for campuses, events, weddings & recurring employee routes."
  },
  {
    name: "Coach Buses",
    capacity: 50,
    image: getRandomImage(),
    href: "/coach-buses", // coach buses -> coach bus fleet page
    description: "Long-haul comfort with reclining seats, undercarriage luggage & smooth highway ride."
  }
];

export default function FleetPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-black pb-16">
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">Our Fleet</h1>
        <p className="text-center text-lg text-blue-100 mb-2 max-w-2xl mx-auto font-medium">
          Discover the perfect ride for your next event! Our diverse fleet offers something for every group size and occasion. All vehicles are maintained to the highest standards for safety and comfort.
        </p>
        <p className="text-center text-base text-blue-200 mb-10 max-w-2xl mx-auto font-semibold">
          <span className="inline-block bg-blue-900/60 px-4 py-2 rounded-xl">Click any vehicle below to see more details and all vehicles of that type.</span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-4">
      {vehicles.map((vehicle) => (
            <a
              key={vehicle.name}
        href={vehicle.href || `/fleet/${vehicle.name.toLowerCase().replace(/ /g, '-')}`}
              className="bg-[#232f6b] rounded-[32px] shadow-xl flex flex-col items-center p-8 border-4 border-[#2e3d85] hover:shadow-2xl transition-shadow min-h-[480px] max-w-xl mx-auto cursor-pointer group focus:outline-none focus:ring-4 focus:ring-blue-400"
              style={{ boxShadow: '0 8px 32px 0 rgba(30,40,120,0.25), 0 1.5px 0 0 #2e3d85 inset' }}
              aria-label={`View details and all vehicles for ${vehicle.name}`}
            >
              <div className="w-full h-64 relative mb-6 flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center rounded-2xl bg-white" style={{ boxShadow: '0 0 0 6px #2e3d85' }}>
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    className="object-cover rounded-2xl"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-2 text-center drop-shadow-lg tracking-wide group-hover:underline" style={{ fontFamily: 'serif' }}>{vehicle.name}</h2>
              <p className="text-lg text-blue-100 mb-4 text-center font-medium" style={{ fontFamily: 'serif' }}>{vehicle.description}</p>
              <div className="flex flex-row gap-3 w-full mt-auto justify-center">
                <a
                  href="tel:888-535-2566"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 font-bold py-1.5 px-4 rounded-full shadow hover:bg-blue-100 transition text-sm border-2 border-white whitespace-nowrap text-center"
                  aria-label="Call to book this vehicle"
                  tabIndex={-1}
                >
                  <span className="inline-block text-pink-600 text-lg">📞</span>
                  (888) 535-2566
                </a>
                <a
                  href="mailto:info@bus2ride.com"
                  className="inline-flex items-center justify-center gap-2 bg-[#2e3d85] text-white font-bold py-1.5 px-4 rounded-full shadow hover:bg-blue-800 transition text-sm border-2 border-[#2e3d85] whitespace-nowrap text-center"
                  aria-label="Email to book this vehicle"
                  tabIndex={-1}
                >
                  <span className="inline-block text-white text-lg">✉️</span>
                  Email
                </a>
                <a
                  href="/quote"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 font-bold py-1.5 px-4 rounded-full shadow hover:bg-blue-100 transition text-sm border-2 border-white whitespace-nowrap text-center"
                  aria-label="Get a quote for this vehicle"
                  tabIndex={-1}
                >
                  <span className="inline-block text-yellow-500 text-lg">⚡</span>
                  Quote
                </a>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold mb-2 text-blue-100 drop-shadow">Not sure which vehicle is right for you?</h3>
          <p className="text-blue-200 mb-4 font-medium">Contact our team and we’ll help you find the perfect fit for your group and occasion.</p>
          <a href="/contact" className="inline-block bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition text-lg shadow">Contact Us</a>
        </div>
      </section>
    </main>
  );
}