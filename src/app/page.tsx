import HeroSlideshow from "../components/Hero";
import { useMemo } from "react";
import Link from "next/link";

// List of images for each vehicle type
const partyBusImages = [
  "/images/18 Passenger White Party Bus Exterior.png",
  "/images/18 Passenger White Party Bus Interior.png",
  "/images/20 Passenger White Party Bus Exterior.png",
  "/images/36 Passenger Party Bus Exterior 4.png",
  "/images/Bus-1.png",
  "/images/Bus-2.png",
  "/images/Bus-3.png",
  "/images/Bus-4.png",
  "/images/Bus-5.png",
  "/images/17 Passenger Black Party Bus Exterior.png",
];

const limoImages = [
  "/images/10 Passenger Black Lincoln Stretch Limo Exterior Black.png",
  "/images/10 Passenger Chrysler 300 Limo Exterior.png",
  "/images/10 Passenger Lincoln Stretch Limo Exterior 2.png",
  "/images/10 Passenger Lincoln Stretch Limo Exterior 3.png",
  "/images/10 Passenger Lincoln Stretch Limo Interior.png",
  "/images/10 Passenger Lincoln Stretch Limo Interior Clean.png",
  "/images/10 Passenger Lincoln Stretch Limo Interior Very Clean.png",
  "/images/10 Passenger Lincoln Stretch Limo Inside.png",
  "/images/16 Passenger Ford Excursion Limousine Interior.png",
  "/images/16 Passenger Ford Excursion Stretch Limo Interior.png",
  "/images/16_Passenger_Stretch_Excursion_Exterior_optimized.jpg",
  "/images/18 Passenger Cadillac Escalade Limo Exterior.png",
  "/images/18 Passenger Ford Excursion Limo Exterior 2.png",
  "/images/18 Passenger Ford Excursion Limo Inside.png",
  "/images/18 Passenger Hummer Limo Exterior.png",
  "/images/18 Passenger Hummer Limo Inside.png",
  "/images/18 Passenger Hummer Limo Interior.png",
  "/images/10 Passenger Sprinter Van Limo Style Interior 1.png",
  "/images/12 Passenger Executive Style Sprinter Van Exterior.png",
  "/images/14 Passenger Sprinter Van Limo Style Exterior Door Open.png",
  "/images/14 Passenger Sprinter Van Limo Style Interior Again.png",
];

const coachBusImages = [
  "/images/Bus-1.png",
  "/images/Bus-2.png",
  "/images/Bus-3.png",
  "/images/Bus-4.png",
  "/images/Bus-5.png",
];

function getRandomImages(arr: string[], count: number) {
  // Shuffle and pick first N
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function Home() {
  // For demo: assign a random party bus image to each event card
  const partyBusImagesList = [
    "/images/18 Passenger White Party Bus Exterior.png",
    "/images/18 Passenger White Party Bus Interior.png",
    "/images/20 Passenger White Party Bus Exterior.png",
    "/images/36 Passenger Party Bus Exterior 4.png",
    "/images/Bus-1.png",
    "/images/Bus-2.png",
    "/images/Bus-3.png",
    "/images/Bus-4.png",
    "/images/Bus-5.png",
    "/images/17 Passenger Black Party Bus Exterior.png",
  ];
  const eventNames = [
    "Haunted House Tours", "Thanksgiving Parties", "Christmas Parties", "Ski Resort Tours", "New Year’s Eve",
    "Sporting Events", "Weddings", "Prom", "Graduation Celebration", "Concerts / Events",
    "Bachelor Parties", "Bachelorette Parties", "Brewery Tours", "Red Rocks Concerts", "Girl’s Night Out",
    "Guys Night Out", "Retirement Celebrations", "Blackhawk Casinos", "Corporate Parties", "Birthday Parties",
    "Kid’s Parties", "Entertainment Tours", "Charter Services", "Airport Shuttle", "Quinceanera Parties",
    "Anniversary Celebrations", "Special Dinners Out"
  ];
  const eventImages = useMemo(() => {
    // Assign a random party bus image to each event
    return eventNames.map((_, i) => partyBusImagesList[i % partyBusImagesList.length]);
  }, []);
  return (
      <>
        {/* Hero Slideshow (assuming it’s imported) */}
        <HeroSlideshow />
        {/* Why Rent With Us */}
        <section className="max-w-6xl mx-auto px-4 py-16 bg-gradient-to-r from-white via-blue-50 to-white rounded-3xl shadow-xl flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-900 tracking-tight font-serif drop-shadow-sm" style={{ letterSpacing: '0.01em' }}>
              Why Rent With <span className="text-blue-700">Bus2Ride?</span>
            </h2>
            <ul className="grid gap-4 text-blue-900 text-lg bg-white/60 rounded-xl shadow p-6">
              {[
                {
                  label: 'Experienced, friendly reservation team',
                  icon: '★',
                  href: '/why/experienced'
                },
                {
                  label: 'Easy online quotes & booking',
                  icon: '★',
                  href: '/why/easy'
                },
                {
                  label: 'Huge selection of vehicles for any group size',
                  icon: '★',
                  href: '/why/huge'
                },
                {
                  label: '1,000,000+ passengers served nationwide',
                  icon: '★',
                  href: '/why/1000000'
                },
                {
                  label: '365-day customer support',
                  icon: '★',
                  href: '/why/365'
                },
              ].map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-center bg-white rounded-lg shadow px-4 py-3 border border-blue-200"
                >
                  <span className="text-blue-500 text-xl mr-2">{feature.icon}</span>
                  <Link href={feature.href} className="flex-1 hover:underline text-blue-900">
                    {feature.label}
                  </Link>
                  <span className="ml-2 text-blue-600 text-lg">→</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 flex justify-center items-center h-full min-h-[18rem]">
            <img
              src="/images/18 Passenger White Party Bus Exterior.png"
              alt="18 Passenger White Party Bus Exterior"
              className="w-full max-w-[420px] h-64 md:w-[480px] md:h-80 object-contain rounded-3xl border-4 border-blue-100 shadow-2xl bg-white"
              style={{ objectPosition: 'center' }}
            />
          </div>
        </section>
        {/* ...existing code for the rest of the homepage sections... */}
      </>
    );
  }