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
  {/* Removed phone button below hero/header */}

      {/* Why Rent With Us */}
    <section className="max-w-6xl mx-auto px-4 py-16 bg-gradient-to-r from-white via-blue-50 to-white rounded-3xl shadow-xl flex flex-col md:grid md:grid-cols-2 gap-10 items-center">
  <div>
    <h2
      className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-900 tracking-tight font-serif drop-shadow-sm"
      style={{ letterSpacing: "0.01em" }}
    >
      Why Rent With <span className="text-blue-700">Bus2Ride?</span>
    </h2>
    <ul className="space-y-4 text-blue-900 text-lg">
      {[
        "Experienced, friendly reservation team",
        "Easy online quotes & booking",
        "Huge selection of vehicles for any group size",
        "1,000,000+ passengers served nationwide",
        "365-day customer support",
      ].map((feature, idx) => (
        <li
          key={idx}
          className="flex items-center bg-white rounded-lg shadow px-4 py-3 hover:bg-blue-50 transition border border-blue-200"
        >
          <span className="text-blue-500 text-xl mr-2">★</span>
          <span className="flex-1">{feature}</span>
        </li>
      ))}
    </ul>
  </div>
  <div className="flex justify-center">
    <img
      src="/images/18 Passenger White Party Bus Exterior.png"
      alt="Party Bus Exterior"
      className="w-[420px] h-64 md:w-[480px] md:h-80 object-cover rounded-3xl border-4 border-blue-100 shadow-2xl"
    />
  </div>
</section>


      {/* CTA after Blog & Resources */}


      {/* Party Buses Section */}
   <section className="max-w-6xl mx-auto px-4 py-16">
  <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 text-center mb-8 tracking-tight">
    Party Buses
  </h2>

  {/* 3 Image Boxes (unchanged button style) */}
  <div className="grid md:grid-cols-3 gap-6 mb-10">
    {getRandomImages(partyBusImages, 3).map((img, idx) => (
      <div
        key={img}
        className="bg-white rounded-2xl shadow-xl p-5 flex flex-col items-center"
      >
        <img
          src={img}
          alt="Party Bus"
          className="w-full h-72 object-cover rounded-2xl mb-5"
        />
        <h4 className="text-lg font-bold mb-2">Party Bus {idx + 1}</h4>
        <div className="flex flex-col gap-2 w-full">
          <a
            href="tel:8885352566"
            className="flex justify-between items-center w-full bg-blue-700 text-white font-bold py-1.5 rounded-lg hover:bg-blue-800 transition text-center text-sm px-3"
          >
            Call 888-535-2566 <span>→</span>
          </a>
          <a
            href="mailto:info@bus2ride.com"
            className="flex justify-between items-center w-full bg-blue-600 text-white font-bold py-1.5 rounded-lg hover:bg-blue-700 transition text-center text-sm px-3"
          >
            Email info@bus2ride.com <span>→</span>
          </a>
          <a
            href="/quote"
            className="flex justify-between items-center w-full bg-green-500 text-white font-bold py-1.5 rounded-lg hover:bg-green-600 transition text-center text-sm px-3"
          >
            Instant Live Quote <span>→</span>
          </a>
        </div>
      </div>
    ))}
  </div>

  {/* Features BELOW the 3 boxes — EXACT same format as "Why Rent With" buttons */}
  {/* Features BELOW the 3 boxes — EXACT same format as "Why Rent With" buttons */}
  <div className="max-w-6xl mx-auto px-4">
  <div className="flex flex-col md:flex-row md:items-center gap-6">
    <h2 className="text-2xl font-bold text-blue-900 md:w-1/4">
      Popular Party Bus Features
    </h2>
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-blue-900 flex-1">
      {[
        { text: "Lots of space to move & socialize", href: "/features/lots-of-space" },
        { text: "Ability to dance onboard", href: "/features/dance-onboard" },
        { text: "Removable dance pole", href: "/features/removable-dance-pole" },
        { text: "Wet bars with ice & bottled water", href: "/features/wet-bars" },
        { text: "Wrap-around leather seating", href: "/features/wrap-around-leather-seating" },
        { text: "Premium sound & LED lighting", href: "/features/premium-sound-lighting" },
        { text: "Pro driver included", href: "/features/pro-driver" },
      ].map((feature, idx) => (
        <li
          key={idx}
          className="flex items-center bg-white rounded-lg shadow px-4 py-3 hover:bg-blue-50 transition border border-blue-200"
        >
          <span className="text-blue-500 text-xl mr-2">★</span>
          <a href={feature.href} className="flex-1 text-blue-900 text-lg">
            {feature.text}
          </a>
          <span className="text-blue-500 text-lg ml-2">→</span>
        </li>
      ))}
    </ul>
  </div>
</div>
</section>


      {/* Limos Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
  <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 text-center mb-8 tracking-tight">
    Limousines
  </h2>

  {/* 3 Image Boxes (unchanged button style) */}
  <div className="grid md:grid-cols-3 gap-6 mb-10">
    {getRandomImages(limoImages, 3).map((img, idx) => (
      <div
        key={img}
        className="bg-white rounded-2xl shadow-xl p-5 flex flex-col items-center"
      >
        <img
          src={img}
          alt="Limousine"
          className="w-full h-72 object-cover rounded-2xl mb-5"
        />
        <h4 className="text-lg font-bold mb-2">Limousine {idx + 1}</h4>
        <div className="flex flex-col gap-2 w-full">
          <a
            href="tel:8885352566"
            className="flex justify-between items-center w-full bg-blue-700 text-white font-bold py-1.5 rounded-lg hover:bg-blue-800 transition text-center text-sm px-3"
          >
            Call 888-535-2566 <span>→</span>
          </a>
          <a
            href="mailto:info@bus2ride.com"
            className="flex justify-between items-center w-full bg-blue-600 text-white font-bold py-1.5 rounded-lg hover:bg-blue-700 transition text-center text-sm px-3"
          >
            Email info@bus2ride.com <span>→</span>
          </a>
          <a
            href="/quote"
            className="flex justify-between items-center w-full bg-green-500 text-white font-bold py-1.5 rounded-lg hover:bg-green-600 transition text-center text-sm px-3"
          >
            Instant Live Quote <span>→</span>
          </a>
        </div>
      </div>
    ))}
  </div>

  {/* Features BELOW the 3 boxes, styled like "Why Rent With" buttons */}
  <div className="max-w-6xl mx-auto px-4">
  <div className="flex flex-col md:flex-row md:items-center gap-6">
    <h2 className="text-2xl font-bold text-blue-900 md:w-1/4">
      Popular Limo Features
    </h2>
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-blue-900 flex-1">
      {[
        { text: "Luxurious interiors with leather seating", href: "/features/leather-seating" },
        { text: "Complimentary champagne & ice", href: "/features/champagne" },
        { text: "Premium sound system", href: "/features/premium-sound" },
        { text: "Mood lighting for any occasion", href: "/features/mood-lighting" },
        { text: "Professional chauffeur included", href: "/features/chauffeur" },
        { text: "Perfect for weddings, proms & events", href: "/features/weddings-proms" },
      ].map((feature, idx) => (
        <li
          key={idx}
          className="flex items-center bg-white rounded-lg shadow px-4 py-3 hover:bg-blue-50 transition border border-blue-200"
        >
          <span className="text-blue-500 text-xl mr-2">★</span>
          <a href={feature.href} className="flex-1 text-blue-900 text-lg">
            {feature.text}
          </a>
          <span className="text-blue-500 text-lg ml-2">→</span>
        </li>
      ))}
    </ul>
  </div>
</div>
</section>


      {/* Coach Buses Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
  <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 text-center mb-8 tracking-tight">
    Coach Buses
  </h2>

  {/* 3 Image Boxes (unchanged button style) */}
  <div className="grid md:grid-cols-3 gap-6 mb-10">
    {getRandomImages(coachBusImages, 3).map((img, idx) => (
      <div
        key={img}
        className="bg-white rounded-2xl shadow-xl p-5 flex flex-col items-center"
      >
        <img
          src={img}
          alt="Coach Bus"
          className="w-full h-72 object-cover rounded-2xl mb-5"
        />
        <h4 className="text-lg font-bold mb-2">Coach Bus {idx + 1}</h4>
        <div className="flex flex-col gap-2 w-full">
          <a
            href="tel:8885352566"
            className="flex justify-between items-center w-full bg-blue-700 text-white font-bold py-1.5 rounded-lg hover:bg-blue-800 transition text-center text-sm px-3"
          >
            Call 888-535-2566 <span>→</span>
          </a>
          <a
            href="mailto:info@bus2ride.com"
            className="flex justify-between items-center w-full bg-blue-600 text-white font-bold py-1.5 rounded-lg hover:bg-blue-700 transition text-center text-sm px-3"
          >
            Email info@bus2ride.com <span>→</span>
          </a>
          <a
            href="/quote"
            className="flex justify-between items-center w-full bg-green-500 text-white font-bold py-1.5 rounded-lg hover:bg-green-600 transition text-center text-sm px-3"
          >
            Instant Live Quote <span>→</span>
          </a>
        </div>
      </div>
    ))}
  </div>

  {/* Features BELOW the 3 boxes, styled like "Why Rent With" buttons */}
  <div className="max-w-6xl mx-auto px-4">
  <div className="flex flex-col md:flex-row md:items-center gap-6">
    <h2 className="text-2xl font-bold text-blue-900 md:w-1/4">
      Popular Coach Bus Features
    </h2>
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-blue-900 flex-1">
      {[
        { text: "Comfortable reclining seats", href: "/features/reclining-seats" },
        { text: "Wi-Fi & charging ports", href: "/features/wifi" },
        { text: "Large luggage compartments", href: "/features/luggage" },
        { text: "Onboard restroom", href: "/features/restroom" },
        { text: "TVs & entertainment system", href: "/features/tvs" },
        { text: "Experienced driver included", href: "/features/driver" },
      ].map((feature, idx) => (
        <li
          key={idx}
          className="flex items-center bg-white rounded-lg shadow px-4 py-3 hover:bg-blue-50 transition border border-blue-200"
        >
          <span className="text-blue-500 text-xl mr-2">★</span>
          <a href={feature.href} className="flex-1 text-blue-900 text-lg">
            {feature.text}
          </a>
          <span className="text-blue-500 text-lg ml-2">→</span>
        </li>
      ))}
    </ul>
  </div>
</div>
</section>


      {/* Trust & Reputation */}
      <section className="bg-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-blue-900">
            The Most Trusted Limo & Bus Rental Company
          </h2>
          <p className="text-xl text-gray-700 mb-6">
            Trusted by thousands, booked in minutes, driven by a passion for
            making every ride unforgettable.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/free-instant-estimates"
              className="bg-white rounded-lg px-6 py-3 font-bold text-blue-700 shadow border-2 border-blue-200 hover:bg-blue-50 transition"
            >
              Free Instant Estimates
            </a>
            <a
              href="/massive-luxury-fleet"
              className="bg-white rounded-lg px-6 py-3 font-bold text-blue-700 shadow border-2 border-blue-200 hover:bg-blue-50 transition"
            >
              Massive Luxury Fleet
            </a>
            <a
              href="/low-hourly-minimums"
              className="bg-white rounded-lg px-6 py-3 font-bold text-blue-700 shadow border-2 border-blue-200 hover:bg-blue-50 transition"
            >
              Low Hourly Minimums
            </a>
            <a
              href="/professional-drivers"
              className="bg-white rounded-lg px-6 py-3 font-bold text-blue-700 shadow border-2 border-blue-200 hover:bg-blue-50 transition"
            >
              Profesional Drivers
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <a
            href="/enter-info"
            className="flex flex-col items-center group hover:bg-blue-100 rounded-xl p-4 transition"
          >
            <span className="text-3xl mb-2">📝</span>
            <h4 className="font-semibold mb-1 group-hover:text-blue-700">
              1. Enter Info
            </h4>
            <p className="text-gray-600 text-sm">Tell us about your trip.</p>
          </a>
          <a
            href="/compare-options"
            className="flex flex-col items-center group hover:bg-blue-100 rounded-xl p-4 transition"
          >
            <span className="text-3xl mb-2">📸</span>
            <h4 className="font-semibold mb-1 group-hover:text-blue-700">
              2. Compare Options
            </h4>
            <p className="text-gray-600 text-sm">See vehicles & prices.</p>
          </a>
          <a
            href="/book-online"
            className="flex flex-col items-center group hover:bg-blue-100 rounded-xl p-4 transition"
          >
            <span className="text-3xl mb-2">🛒</span>
            <h4 className="font-semibold mb-1 group-hover:text-blue-700">
              3. Book Online
            </h4>
            <p className="text-gray-600 text-sm">Reserve your ride.</p>
          </a>
          <a
            href="/enjoy"
            className="flex flex-col items-center group hover:bg-blue-100 rounded-xl p-4 transition"
          >
            <span className="text-3xl mb-2">🎉</span>
            <h4 className="font-semibold mb-1 group-hover:text-blue-700">4. Enjoy</h4>
            <p className="text-gray-600 text-sm">Have a great trip!</p>
          </a>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-blue-900 tracking-tight">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10 max-w-4xl mx-auto">
          {/* First row of 4 reviews */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between min-h-[220px]">
            <p className="text-gray-700 italic mb-4 text-lg">
              “Absolutely excellent! Great customer service! We changed drop off
              points several times and they were so accommodating. Gail in the
              office is top notch and on top of everything! The price was very
              good. The driver was so nice and professional. The limo looked
              pristine, inside and out. Use them, you wont regret it!! Used for
              my son's wedding on August 11.”
            </p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-700">— Paul P.</span>
              <span className="text-yellow-400">★★★★★</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between min-h-[220px]">
            <p className="text-gray-700 italic mb-4 text-lg">
              “The limo company that you need to call when u have an event.
              Prices and limos and party bus are like no other limo company.”
            </p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-700">— Jessie A.</span>
              <span className="text-yellow-400">★★★★★</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between min-h-[220px]">
            <p className="text-gray-700 italic mb-4 text-lg">
              “Definitely lives up to their name! We used them for our
              bachelorette/bachelor parties and our wedding and will be using
              them again. They were absolutely great! Even let me extend an hour
              when I decided my bachelorette party was too much fun and I wasn't
              ready to go yet!! :) I would absolutely recommend them and do to
              everyone!!”
            </p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-700">— Dee C.</span>
              <span className="text-yellow-400">★★★★★</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between min-h-[220px]">
            <p className="text-gray-700 italic mb-4 text-lg">
              “The price is great, inside is very clean, driver was very friendly
              and accommodating! Will never use another company besides this
              one!”
            </p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-700">— Halee H.</span>
              <span className="text-yellow-400">★★★★★</span>
            </div>
          </div>
        </div>
        {/* MORE REVIEWS button after first 4 reviews */}
        <div className="flex justify-center my-8">
          <Link href="/reviews" legacyBehavior>
            <a className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-2xl shadow-lg text-lg">MORE REVIEWS</a>
          </Link>
        </div>
        {/* CTA between rows */}
        <div className="text-center my-8">
          <h3 className="text-2xl font-bold text-blue-900 mb-2">
            Ready to Ride in Style?
          </h3>
          <p className="text-lg text-gray-700 mb-4">
            Call 1-800-123-4567 or Text 1-800-123-4567 to Book Your Bus or
            Limo!
          </p>
          <a
            href="/quote"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg shadow transition"
          >
            Get a Quote
          </a>
        </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10 max-w-4xl mx-auto">
          {/* Second row of 4 reviews */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between min-h-[220px]">
            <p className="text-gray-700 italic mb-4 text-lg">
              “We had the best time ever!! Darrius was our driver and he was so
              fun and amazing!! It was for our bachelor/bachelorette weekend and
              he made it so much fun!!! I would recommend them 100%!!!”
            </p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-700">— Rachel L.</span>
              <span className="text-yellow-400">★★★★★</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between min-h-[220px]">
            <p className="text-gray-700 italic mb-4 text-lg">
              “Sonny can take your event to the next level with his beautiful
              limos and sedans making you feel like a movie star! Highly
              recommend his service!”
            </p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-700">— Becky B.</span>
              <span className="text-yellow-400">★★★★★</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between min-h-[220px]">
            <p className="text-gray-700 italic mb-4 text-lg">
              “Top of the line chauffer and limo service.”
            </p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-700">— George S.</span>
              <span className="text-yellow-400">★★★★★</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between min-h-[220px]">
            <p className="text-gray-700 italic mb-4 text-lg">
              “What a memorable night for our students at Faith Christian School
              prom. Rick was an excellent and safe driver, providing top notch
              customer service, and was prompt with timing. The owner was great
              to work with and has the best prices and customer service. We will
              definitely choose them for next year's prom. Amazing experience!”
            </p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-700">— Teresa S.</span>
              <span className="text-yellow-400">★★★★★</span>
            </div>
          </div>
        </div>
        <div className="flex justify-center mb-12">
          <Link href="/reviews" legacyBehavior>
            <a className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-2xl shadow-lg text-lg">MORE REVIEWS</a>
          </Link>
        </div>
      </section>

      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto px-4 py-12">
        {/* Review Submission */}
        <div className="flex-1 min-w-[260px]">
          <h3 className="text-xl font-bold text-blue-900 mb-2">
            Leave a Review & Get Featured Above!
          </h3>
          <p className="text-gray-700 mb-4">
            Want to see your review in the main section above? Share your Bus2Ride experience below! Submit your review, add photos, or even upload a video. The best reviews will be featured at the top of this page for everyone to see.
          </p>
          <p className="text-green-700 font-semibold mb-2">
            Featured reviews may appear on our homepage and social media.
          </p>
          <form className="flex flex-col gap-4 w-full max-w-md">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
            <textarea
              name="review"
              placeholder="Your Review"
              rows={3}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            ></textarea>
            <input
              type="text"
              name="content"
              placeholder="Add a headline or content for your featured review (optional)"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-gray-700 mb-1">Add Photo</label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  className="block w-full text-gray-600"
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 mb-1">Add Video</label>
                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  className="block w-full text-gray-600"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-xl">★★★★★</span>
              <input
                type="number"
                name="rating"
                min="1"
                max="5"
                defaultValue="5"
                className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-center"
                required
              />
              <span className="text-gray-500">(1-5)</span>
            </div>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-2 rounded-lg shadow transition"
            >
              Submit Review
            </button>
            <p className="text-xs text-gray-400 mt-2">
              By submitting, you agree to let us feature your review, photos, and
              video on our site and social media.
            </p>
          </form>
        </div>

        {/* Slideshow Maker */}
        <div className="flex-1 min-w-[260px] border-l border-gray-200 pl-0 md:pl-8 flex flex-col items-center md:items-start">
          <h3 className="text-xl font-bold text-blue-900 mb-2">
            Make a Slideshow Video
          </h3>
          <p className="text-gray-700 mb-4">
            Upload your favorite party or limo photos and instantly create a fun
            slideshow video to share with friends! (Coming soon)
          </p>
          <form className="flex flex-col gap-4 w-full max-w-md">
            <label className="block text-gray-700">Upload Photos</label>
            <input
              type="file"
              name="slideshow-photos"
              accept="image/*"
              multiple
              className="block w-full text-gray-600"
            />
            <button
              type="button"
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-2 rounded-lg shadow transition mt-2"
              disabled
            >
              Make My Slideshow
            </button>
          </form>
          <div className="mt-6 w-full flex flex-col items-center">
            <span className="text-gray-500 text-sm mb-2">Sample Slideshow Video</span>
            <div className="w-full max-w-md aspect-video rounded-lg overflow-hidden shadow-lg">
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/2Vv-BfVoq4g"
                title="Sample Slideshow"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Group Transportation Services */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-blue-900 tracking-tight">Events & Occasions</h2>
        {/* Render events in rows of 5, only once */}
        {Array.from({ length: Math.ceil(eventNames.length / 5) }).map((_, rowIdx) => (
        <>
            <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
              {eventNames.slice(rowIdx * 5, rowIdx * 5 + 5).map((event, i) => (
                <div key={event} className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                  <img src={eventImages[rowIdx * 5 + i]} alt="Party Bus" className="w-full h-32 object-cover rounded-lg mb-4" />
                  <h4 className="font-semibold mb-2 text-center">{event}</h4>
                  <a href="#" className="text-blue-700 font-bold hover:underline mb-2">Learn More</a>
                  <a href="tel:8885352566" className="block w-full bg-blue-700 text-white font-bold py-2 rounded-lg hover:bg-blue-800 transition text-center mb-1">Call 888-535-2566</a>
                  <a href="mailto:info@bus2ride.com" className="block w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition text-center">Email info@bus2ride.com</a>
                </div>
              ))}
            </div>
            {(rowIdx + 1) % 2 === 0 && rowIdx !== Array.from({ length: Math.ceil(eventNames.length / 5) }).length - 1 && (
              <div className="flex justify-center mb-8">
                <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-2xl shadow-xl px-10 py-8 flex flex-col items-center w-full max-w-3xl border-2 border-blue-400">
                  <div className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">Ready to Book or Have Questions?</div>
                  <div className="mb-4 text-lg">Call <a href="tel:8885352566" className="underline font-bold">888-535-2566</a> or email <a href="mailto:info@bus2ride.com" className="underline font-bold">info@bus2ride.com</a></div>
                  <a href="/quote" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition">Get a Free Quote</a>
                </div>
              </div>
            )}
          </>
        ))}
      </section>

      {/* Blog & Resources */}
      {/* Blog & Resources (Simple Blocks) */}
      <section className="max-w-6xl mx-auto px-4 py-16 space-y-14">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-blue-900 tracking-tight drop-shadow-lg">Blog & Resources</h2>
        {/* Tools (Staggered, Large Blocks) */}
  <div className="space-y-12">
          {/* Capacity Finder */}
          <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8">
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-200 rounded-2xl shadow-xl p-10 border-2 border-blue-400 order-2 md:order-1">
              <h3 className="text-3xl font-extrabold mb-3 text-blue-900 tracking-tight drop-shadow">Capacity Finder</h3>
              <p className="text-lg text-blue-900 mb-4">Enter your group size to see recommended vehicles and get a quote instantly.</p>
              <a href="/quote" className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition">Try It</a>
            </div>
            <div className="flex-1 order-1 md:order-2 flex items-center justify-center">
              <div className="w-40 h-40 bg-blue-100 rounded-full flex items-center justify-center text-5xl text-blue-700 font-extrabold shadow-inner">🚌</div>
            </div>
          </div>
          {/* Budget Estimator */}
          <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8">
            <div className="flex-1 flex items-center justify-center">
              <div className="w-40 h-40 bg-blue-100 rounded-full flex items-center justify-center text-5xl text-blue-700 font-extrabold shadow-inner">💸</div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-200 rounded-2xl shadow-xl p-10 border-2 border-blue-400">
              <h3 className="text-3xl font-extrabold mb-3 text-blue-900 tracking-tight drop-shadow">Budget Estimator</h3>
              <p className="text-lg text-blue-900 mb-4">Estimate your trip cost by hours, typical rates, and surcharges. Get a ballpark range and book with confidence.</p>
              <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition">Estimate Now</button>
            </div>
          </div>
          {/* Pickup Timing Planner */}
          <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8">
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-200 rounded-2xl shadow-xl p-10 border-2 border-blue-400 order-2 md:order-1">
              <h3 className="text-3xl font-extrabold mb-3 text-blue-900 tracking-tight drop-shadow">Pickup Timing Planner</h3>
              <p className="text-lg text-blue-900 mb-4">Enter your event start time and venue distance to get optimal pickup and return times, with built-in buffer.</p>
              <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition">Plan My Pickup</button>
            </div>
            <div className="flex-1 order-1 md:order-2 flex items-center justify-center">
              <div className="w-40 h-40 bg-blue-100 rounded-full flex items-center justify-center text-5xl text-blue-700 font-extrabold shadow-inner">⏰</div>
            </div>
          </div>
          {/* Tailgate Checklist */}
          <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8">
            <div className="flex-1 flex items-center justify-center">
              <div className="w-40 h-40 bg-blue-100 rounded-full flex items-center justify-center text-5xl text-blue-700 font-extrabold shadow-inner">🎉</div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-200 rounded-2xl shadow-xl p-10 border-2 border-blue-400">
              <h3 className="text-3xl font-extrabold mb-3 text-blue-900 tracking-tight drop-shadow">Tailgate Checklist</h3>
              <p className="text-lg text-blue-900 mb-4">Cooler, ice, chargers, playlist, permission rules—everything you need for the ultimate tailgate.</p>
              <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition">View Checklist</button>
            </div>
          </div>
          {/* Playlist Starter */}
          <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8">
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-200 rounded-2xl shadow-xl p-10 border-2 border-blue-400 order-2 md:order-1">
              <h3 className="text-3xl font-extrabold mb-3 text-blue-900 tracking-tight drop-shadow">Playlist Starter</h3>
              <p className="text-lg text-blue-900 mb-4">One-click Spotify links for Bachelorette, Gameday, and Prom. Get the party started instantly!</p>
              <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition">Get Playlists</button>
            </div>
            <div className="flex-1 order-1 md:order-2 flex items-center justify-center">
              <div className="w-40 h-40 bg-blue-100 rounded-full flex items-center justify-center text-5xl text-blue-700 font-extrabold shadow-inner">🎵</div>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-xl transition">More Tools</button>
          </div>
          {/* CTA after Tools */}
        </div>
        {/* Polls */}
        {/* Polls (Grid of 12) */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-200 rounded-2xl shadow-xl p-8 border border-blue-400">
          <h3 className="text-2xl md:text-3xl font-extrabold mb-8 text-blue-900 tracking-tight">Polls</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Row 1 */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start border-l-4 border-blue-400">
              <div className="font-bold mb-2">Party Bus vs Limo — which would you pick?</div>
              <div className="flex gap-2">
                <button className="px-2 py-1 text-sm bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 transition flex items-center">
                  Party Bus <span className="ml-1 text-blue-500">→</span>
                </button>
                <button className="px-2 py-1 text-sm bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 transition flex items-center">
                  Limo <span className="ml-1 text-blue-500">→</span>
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
              <div className="font-bold mb-2">What’s your event?</div>
              <div className="flex gap-2 flex-wrap">
                {['Prom','Wedding','Gameday','Birthday','Corporate'].map((label) => (
                  <button key={label} className="px-2 py-1 text-sm bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 transition flex items-center mb-1">
                    {label} <span className="ml-1 text-blue-500">→</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
              <div className="font-bold mb-2">What matters most?</div>
              <div className="flex gap-2 flex-wrap">
                {['Price','Space','Lighting','Sound','Luggage'].map((label) => (
                  <button key={label} className="px-2 py-1 text-sm bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 transition flex items-center mb-1">
                    {label} <span className="ml-1 text-blue-500">→</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
              <div className="font-bold mb-2">True or False: Party buses are safer than limos.</div>
              <div className="flex gap-2">
                <button className="px-2 py-1 text-sm bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 transition flex items-center">
                  True <span className="ml-1 text-blue-500">→</span>
                </button>
                <button className="px-2 py-1 text-sm bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 transition flex items-center">
                  False <span className="ml-1 text-blue-500">→</span>
                </button>
              </div>
            </div>
            {/* Row 2 */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
              <div className="font-bold mb-2">Would you rent a party bus for a birthday?</div>
              <div className="flex gap-2">
                <button className="px-2 py-1 text-sm bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 transition flex items-center">
                  Yes <span className="ml-1 text-blue-500">→</span>
                </button>
                <button className="px-2 py-1 text-sm bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 transition flex items-center">
                  No <span className="ml-1 text-blue-500">→</span>
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
              <div className="font-bold mb-2">Which party bus feature is most important?</div>
              <div className="flex gap-2 flex-wrap">
                {['Sound System','Lighting','Bar','TV Screens'].map((label) => (
                  <button key={label} className="px-2 py-1 text-sm bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 transition flex items-center mb-1">
                    {label} <span className="ml-1 text-blue-500">→</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
              <div className="font-bold mb-2">Would you rent a limousine for a birthday?</div>
              <div className="flex gap-2">
                <button className="px-2 py-1 text-sm bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 transition flex items-center">
                  Yes <span className="ml-1 text-blue-500">→</span>
                </button>
                <button className="px-2 py-1 text-sm bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 transition flex items-center">
                  No <span className="ml-1 text-blue-500">→</span>
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
              <div className="font-bold mb-2">What’s your favorite limo color?</div>
              <div className="flex gap-2 flex-wrap">
                {['Black','White','Pink','Silver'].map((label) => (
                  <button key={label} className="px-2 py-1 text-sm bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 transition flex items-center mb-1">
                    {label} <span className="ml-1 text-blue-500">→</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Row 3 */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
              <div className="font-bold mb-2">True or False: Limousines are best for weddings.</div>
              <div className="flex gap-2"><button className="px-4 py-1 bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 transition">True</button><button className="px-4 py-1 bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 transition">False</button></div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
              <div className="font-bold mb-2">Do you prefer SUVs or sedans for airport transfers?</div>
              <div className="flex gap-2"><button className="px-4 py-1 bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 transition">SUV</button><button className="px-4 py-1 bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 transition">Sedan</button></div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
              <div className="font-bold mb-2">Which feature matters most on a coach bus?</div>
              <div className="flex gap-2 flex-wrap"><button className="px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 transition">WiFi</button><button className="px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 transition">Reclining Seats</button><button className="px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 transition">Restroom</button><button className="px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 transition">Outlets</button></div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start">
              <div className="font-bold mb-2">Have you ever used a shuttle for a concert?</div>
              <div className="flex gap-2"><button className="px-4 py-1 bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 transition">Yes</button><button className="px-4 py-1 bg-blue-100 text-blue-800 font-semibold rounded hover:bg-blue-200 transition">No</button></div>
            </div>
          </div>
          <div className="text-gray-500 text-base mt-2 text-center">(Your vote is saved instantly. <a href="/polls" className="text-blue-700 hover:underline">See more polls</a>)</div>
          <div className="flex justify-center mt-8">
            <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-xl transition">More Polls</button>
          </div>
          {/* CTA after Polls */}
        </div>
        {/* Live Weather */}
        <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-2xl shadow-xl p-8 border border-sky-200">
          <h3 className="text-2xl md:text-3xl font-extrabold mb-4 text-sky-700 tracking-tight">Live Weather for Your Event</h3>
          <p className="text-gray-700 text-lg mb-3">Pick your city and date to see a 7-day forecast. (Or check back if out of range.)</p>
          <ul className="list-disc pl-8 text-lg text-gray-800 space-y-2">
            <li><b>Heads-Up Tips:</b> Hot day → extra water/ice; rain → covered pickup; cold → coats, blankets.</li>
            <li><b>CTA:</b> “Add cooler/ice (+$)” or “Add luggage trailer (+$)” if windy/rainy (just a CTA for now).</li>
          </ul>
        </div>
        {/* Did You Know Facts */}
        {/* Did You Know (Modern Scrollable Cards) */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-200 rounded-2xl shadow-xl p-8 border border-blue-400">
          <h3 className="text-2xl md:text-3xl font-extrabold mb-6 text-blue-900 tracking-tight">Did You Know?</h3>
          <div className="flex gap-6 overflow-x-auto pb-2 hide-scrollbar">
            <div className="min-w-[260px] bg-white rounded-xl shadow p-6 flex flex-col items-center border-2 border-blue-400">
              <div className="text-4xl mb-2">🛋️</div>
              <div className="font-semibold text-lg text-blue-900 mb-1 text-center">Book by comfort, not max headcount</div>
              <div className="text-blue-800 text-center text-base">Most buses seat more than their ‘comfortable’ number.</div>
            </div>
            <div className="min-w-[260px] bg-white rounded-xl shadow p-6 flex flex-col items-center border-2 border-blue-400">
              <div className="text-4xl mb-2">🎓</div>
              <div className="font-semibold text-lg text-blue-900 mb-1 text-center">Prom Saturdays sell out first</div>
              <div className="text-blue-800 text-center text-base">Book 3–6 weeks early (Mar–May) for best selection.</div>
            </div>
            <div className="min-w-[260px] bg-white rounded-xl shadow p-6 flex flex-col items-center border-2 border-blue-400">
              <div className="text-4xl mb-2">🚦</div>
              <div className="font-semibold text-lg text-blue-900 mb-1 text-center">Gameday traffic can double travel time</div>
              <div className="text-blue-800 text-center text-base">Add a 30–45 min buffer for big events.</div>
            </div>
            <div className="min-w-[260px] bg-white rounded-xl shadow p-6 flex flex-col items-center border-2 border-blue-400">
              <div className="text-4xl mb-2">💡</div>
              <div className="font-semibold text-lg text-blue-900 mb-1 text-center">LED party lighting uses almost no power</div>
              <div className="text-blue-800 text-center text-base">Run it the whole trip for max fun.</div>
            </div>
            <div className="min-w-[260px] bg-white rounded-xl shadow p-6 flex flex-col items-center border-2 border-blue-400">
              <div className="text-4xl mb-2">📍</div>
              <div className="font-semibold text-lg text-blue-900 mb-1 text-center">Most venues require a loading zone</div>
              <div className="text-blue-800 text-center text-base">Ask us for the exact pin to avoid delays.</div>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-xl transition">More Facts</button>
          </div>
        </div>
        {/* Blog Topics */}
        {/* Blog Topics (Cards with Image, Intro, Button) */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-200 rounded-2xl shadow-xl p-8 border border-blue-400">
          <h3 className="text-2xl md:text-3xl font-extrabold mb-8 text-blue-900 tracking-tight">Blog Topics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col border-2 border-blue-400">
              <div className="w-full h-32 bg-blue-100 rounded mb-4 flex items-center justify-center text-blue-400 text-4xl">💍</div>
              <div className="font-bold text-lg mb-2 text-blue-900">Wedding Shuttle Timeline: Exactly When to Book & How Many Runs</div>
              <div className="text-blue-800 mb-3">A step-by-step guide to planning your wedding shuttle, including timing and logistics for stress-free transport.</div>
              <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded-lg shadow transition self-start">Read More</button>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col border-2 border-blue-400">
              <div className="w-full h-32 bg-blue-100 rounded mb-4 flex items-center justify-center text-blue-400 text-4xl">🚌</div>
              <div className="font-bold text-lg mb-2 text-blue-900">Prom Bus Safety & Rules (Parents’ Quick Guide)</div>
              <div className="text-blue-800 mb-3">Everything parents need to know about prom bus safety, rules, and peace of mind for the big night.</div>
              <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded-lg shadow transition self-start">Read More</button>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col border-2 border-blue-400">
              <div className="w-full h-32 bg-blue-100 rounded mb-4 flex items-center justify-center text-blue-400 text-4xl">🏟️</div>
              <div className="font-bold text-lg mb-2 text-blue-900">College Gameday Bus: Tailgate Checklist + Stadium Drop-offs (DAL/AUS/HOU/DEN)</div>
              <div className="text-blue-800 mb-3">Your ultimate checklist for a winning tailgate and smooth stadium drop-off in major cities.</div>
              <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded-lg shadow transition self-start">Read More</button>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col border-2 border-blue-400">
              <div className="w-full h-32 bg-blue-100 rounded mb-4 flex items-center justify-center text-blue-400 text-4xl">💰</div>
              <div className="font-bold text-lg mb-2 text-blue-900">How Much Does a Party Bus Cost in [City]? (Real Ranges + Examples)</div>
              <div className="text-blue-800 mb-3">See real price ranges and examples for party bus rentals in your city, so you can budget with confidence.</div>
              <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded-lg shadow transition self-start">Read More</button>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col border-2 border-blue-400">
              <div className="w-full h-32 bg-blue-100 rounded mb-4 flex items-center justify-center text-blue-400 text-4xl">🤔</div>
              <div className="font-bold text-lg mb-2 text-blue-900">Charter Bus vs Party Bus vs Limo: What’s Right for Your Group?</div>
              <div className="text-blue-800 mb-3">Compare the pros and cons of each vehicle type to find the perfect fit for your group and occasion.</div>
              <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded-lg shadow transition self-start">Read More</button>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-xl transition">More Blog Posts</button>
          </div>
        </div>
      </section>

      {/* Contact & Booking CTA */}
      <section className="bg-blue-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Book Your Bus or Limo Today!</h2>
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <div className="bg-blue-700 rounded-lg px-6 py-3 font-bold text-lg">
              Call: 888-535-2566
            </div>
            <div className="bg-blue-700 rounded-lg px-6 py-3 font-bold text-lg">
              Email: info@bus2ride.com
            </div>
          </div>
          <div className="flex justify-center gap-4 mb-4">
            <a href="#" className="text-white text-2xl">[FB]</a>
            <a href="#" className="text-white text-2xl">[IG]</a>
            <a href="#" className="text-white text-2xl">[X]</a>
            <a href="#" className="text-white text-2xl">[LI]</a>
          </div>
          <a
            href="/contact"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg shadow transition"
          >
            Get a Quote
          </a>
        </div>
      </section>

      {/* Footer/Links */}
      <footer className="bg-gray-900 text-gray-200 py-8 mt-8">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold mb-2">Company</h4>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">About Us</a>
              </li>
            </ul>
          </div>

      {/* CTA after Blog & Resources */}
          <div>
            <h4 className="font-bold mb-2">Resources</h4>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:underline">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Terms
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">Locations</h4>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:underline">
                  All Locations
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Popular Cities
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Get a Quote
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 mt-8 text-sm text-gray-400">
          <div className="flex gap-4 justify-center mb-1">
            <a
              href="https://facebook.com/yourbus2ride" // TODO: Replace with actual FB page
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bus2Ride Facebook"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 hover:bg-blue-800 transition shadow-lg border-2 border-blue-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
              </svg>
            </a>
          </div>
          <span>© {new Date().getFullYear()} Bus2Ride. All rights reserved.</span>
        </div>
  </footer>
    </>
  );
}