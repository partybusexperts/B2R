import HeroSlideshow from "@/components/Hero";
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
  return (
    <>
      {/* Hero Slideshow (assuming it’s imported) */}
      <HeroSlideshow />

      {/* Why Rent With Us */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-blue-900">Why Rent With Bus2Ride?</h2>
          <ul className="space-y-3 text-gray-700 text-lg">
            <li>• Experienced, friendly reservation team</li>
            <li>• Easy online quotes & booking</li>
            <li>• Huge selection of vehicles for any group size</li>
            <li>• 1,000,000+ passengers served nationwide</li>
            <li>• 365-day customer support</li>
          </ul>
        </div>
        <div className="flex justify-center">
          <img
            src="/images/18 Passenger White Party Bus Exterior.png"
            alt="Party Bus Exterior"
            className="w-[420px] h-64 md:w-[480px] md:h-80 object-cover rounded-xl shadow-lg border-2 border-blue-200"
          />
        </div>
      </section>

      {/* Party Buses Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-5xl md:text-6xl font-extrabold text-blue-900 text-center mb-8 tracking-tight">
          Party Buses
        </h2>
        <div className="max-w-3xl mx-auto mb-10">
          <ul className="grid md:grid-cols-3 gap-6 text-lg text-blue-900 font-semibold bg-blue-50 rounded-2xl p-6 shadow">
            <li>
              <a href="/features/lots-of-space" className="hover:underline">
                🕺 Lots of space to move & socialize
              </a>
            </li>
            <li>
              <a href="/features/dance-onboard" className="hover:underline">
                💃 Ability to dance onboard
              </a>
            </li>
            <li>
              <a href="/features/removable-dance-pole" className="hover:underline">
                🪩 Removable dance pole
              </a>
            </li>
            <li>
              <a href="/features/wet-bars" className="hover:underline">
                🍾 Wet bars with ice & bottled water
              </a>
            </li>
            <li>
              <a href="/features/wrap-around-leather-seating" className="hover:underline">
                🛋️ Wrap-around leather seating
              </a>
            </li>
            <li>
              <a href="/features/premium-sound-lighting" className="hover:underline">
                🎵 Premium sound & LED lighting
              </a>
            </li>
            <li>
              <a href="/features/pro-driver" className="hover:underline">
                🧑‍✈️ Pro driver included
              </a>
            </li>
          </ul>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {getRandomImages(partyBusImages, 3).map((img, idx) => (
            <div
              key={img}
              className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center"
            >
              <img
                src={img}
                alt="Party Bus"
                className="w-full h-96 md:h-[420px] object-cover rounded-2xl mb-6"
              />
              <h4 className="text-xl font-bold mb-2">Party Bus {idx + 1}</h4>
              <div className="flex flex-col gap-2 w-full">
                <a
                  href="tel:1234567890"
                  className="block w-full bg-blue-700 text-white font-bold py-2 rounded-lg hover:bg-blue-800 transition text-center"
                >
                  Call (123) 456-7890
                </a>
                <a
                  href="/quote"
                  className="block w-full bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600 transition text-center"
                >
                  Instant Live Quote
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Limos Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-5xl md:text-6xl font-extrabold text-blue-900 text-center mb-8 tracking-tight">
          Limousines
        </h2>
        <div className="max-w-3xl mx-auto mb-10">
          <ul className="grid md:grid-cols-3 gap-6 text-lg text-blue-900 font-semibold bg-blue-50 rounded-2xl p-6 shadow">
            <li>
              <a href="/features/plush-leather-seating" className="hover:underline">
                🛋️ Plush leather seating
              </a>
            </li>
            <li>
              <a href="/features/wet-bar-glassware" className="hover:underline">
                🍾 Wet bar with glassware
              </a>
            </li>
            <li>
              <a href="/features/premium-sound-system" className="hover:underline">
                🎶 Premium sound system
              </a>
            </li>
            <li>
              <a href="/features/fiber-optic-led-lighting" className="hover:underline">
                🌟 Fiber optic & LED lighting
              </a>
            </li>
            <li>
              <a href="/features/professional-chauffeur" className="hover:underline">
                🧑‍✈️ Professional chauffeur
              </a>
            </li>
            <li>
              <a href="/features/privacy-divider" className="hover:underline">
                🕶️ Privacy divider
              </a>
            </li>
            <li>
              <a href="/features/flat-screen-tvs" className="hover:underline">
                📺 Flat screen TVs (select models)
              </a>
            </li>
          </ul>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {getRandomImages(limoImages, 3).map((img, idx) => (
            <div
              key={img}
              className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center"
            >
              <img
                src={img}
                alt="Limousine"
                className="w-full h-96 md:h-[420px] object-cover rounded-2xl mb-6"
              />
              <h4 className="text-xl font-bold mb-2">Limo {idx + 1}</h4>
              <div className="flex flex-col gap-2 w-full">
                <a
                  href="tel:1234567890"
                  className="block w-full bg-blue-700 text-white font-bold py-2 rounded-lg hover:bg-blue-800 transition text-center"
                >
                  Call (123) 456-7890
                </a>
                <a
                  href="/quote"
                  className="block w-full bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600 transition text-center"
                >
                  Instant Live Quote
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coach Buses Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-5xl md:text-6xl font-extrabold text-blue-900 text-center mb-8 tracking-tight">
          Coach Buses
        </h2>
        <div className="max-w-3xl mx-auto mb-10">
          <ul className="grid md:grid-cols-3 gap-6 text-lg text-blue-900 font-semibold bg-blue-50 rounded-2xl p-6 shadow">
            <li>
              <a href="/features/reclining-seats-footrests" className="hover:underline">
                🪑 Reclining seats & footrests
              </a>
            </li>
            <li>
              <a href="/features/underbody-luggage-bays" className="hover:underline">
                🧳 Underbody luggage bays
              </a>
            </li>
            <li>
              <a href="/features/flat-screen-tvs-dvd" className="hover:underline">
                📺 Flat screen TVs & DVD
              </a>
            </li>
            <li>
              <a href="/features/pa-sound-system" className="hover:underline">
                🔊 PA & sound system
              </a>
            </li>
            <li>
              <a href="/features/restroom" className="hover:underline">
                🚻 Restroom (select models)
              </a>
            </li>
            <li>
              <a href="/features/climate-control" className="hover:underline">
                ❄️ Climate control
              </a>
            </li>
            <li>
              <a href="/features/coach-pro-driver" className="hover:underline">
                🧑‍✈️ Pro driver included
              </a>
            </li>
          </ul>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {getRandomImages(coachBusImages, 3).map((img, idx) => (
            <div
              key={img}
              className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center"
            >
              <img
                src={img}
                alt="Coach Bus"
                className="w-full h-96 md:h-[420px] object-cover rounded-2xl mb-6"
              />
              <h4 className="text-xl font-bold mb-2">Coach Bus {idx + 1}</h4>
              <div className="flex flex-col gap-2 w-full">
                <a
                  href="tel:1234567890"
                  className="block w-full bg-blue-700 text-white font-bold py-2 rounded-lg hover:bg-blue-800 transition text-center"
                >
                  Call (123) 456-7890
                </a>
                <a
                  href="/quote"
                  className="block w-full bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600 transition text-center"
                >
                  Instant Live Quote
                </a>
              </div>
            </div>
          ))}
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
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
          Group Transportation Services
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🎂</span>
            <h4 className="font-semibold mb-1">Birthdays</h4>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">💍</span>
            <h4 className="font-semibold mb-1">Weddings</h4>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🏈</span>
            <h4 className="font-semibold mb-1">Sports</h4>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🏢</span>
            <h4 className="font-semibold mb-1">Corporate</h4>
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-8 mt-8">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🎓</span>
            <h4 className="font-semibold mb-1">Prom & Homecoming</h4>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🚌</span>
            <h4 className="font-semibold mb-1">Field Trips</h4>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🎤</span>
            <h4 className="font-semibold mb-1">Conventions</h4>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🕊️</span>
            <h4 className="font-semibold mb-1">Funerals</h4>
          </div>
        </div>
      </section>

      {/* Blog & Resources */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
          Blog & Resources
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col">
            <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-400">
              [Blog Image]
            </div>
            <h4 className="font-semibold mb-1">How to Book a Charter Bus</h4>
            <p className="text-gray-600 text-sm mb-2">
              A complete guide to booking group transportation.
            </p>
            <a href="#" className="text-blue-700 hover:underline">
              Read More
            </a>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col">
            <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-400">
              [Blog Image]
            </div>
            <h4 className="font-semibold mb-1">Party Bus Rental Tips</h4>
            <p className="text-gray-600 text-sm mb-2">
              Everything you need to know for your next big event.
            </p>
            <a href="#" className="text-blue-700 hover:underline">
              Read More
            </a>
          </div>
        </div>
      </section>

      {/* Contact & Booking CTA */}
      <section className="bg-blue-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Book Your Bus or Limo Today!</h2>
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <div className="bg-blue-700 rounded-lg px-6 py-3 font-bold text-lg">
              Call: (555) 123-4567
            </div>
            <div className="bg-blue-700 rounded-lg px-6 py-3 font-bold text-lg">
              Text: (555) 987-6543
            </div>
            <div className="bg-blue-700 rounded-lg px-6 py-3 font-bold text-lg">
              Email: info@example.com
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
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Reviews
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">Fleet</h4>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:underline">
                  Limos
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Party Buses
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Charter Buses
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Sprinter Vans
                </a>
              </li>
            </ul>
          </div>
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
        <div className="text-center text-gray-400 mt-8 text-sm">
          © {new Date().getFullYear()} Bus2Ride. All rights reserved.
        </div>
      </footer>
    </>
  );
}