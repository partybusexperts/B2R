"use client";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-16 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">America's Largest Limo, Party Bus & Charter Bus Rental Company</h1>
          <p className="text-lg md:text-xl mb-6 font-medium">Party Buses, Limos & Charter Buses for Every Occasion</p>
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <div className="bg-blue-700 rounded-lg px-6 py-3 font-bold text-lg">Founded 2011</div>
            <div className="bg-blue-700 rounded-lg px-6 py-3 font-bold text-lg">3,000+ 5-Star Reviews</div>
            <div className="bg-blue-700 rounded-lg px-6 py-3 font-bold text-lg">50,000+ Trips Booked</div>
            <div className="bg-blue-700 rounded-lg px-6 py-3 font-bold text-lg">12,000+ Vehicles</div>
          </div>
          <a href="/contact" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg shadow transition">Get a Quote</a>
        </div>
      </section>

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
          <div className="w-80 h-48 bg-gray-200 rounded-lg flex items-center justify-center text-2xl text-gray-400">[Banner Image]</div>
        </div>
      </section>

      {/* Fleet Overview */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-900">12,000+ Vehicles</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <div className="w-32 h-20 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-400">[Limo]</div>
            <h3 className="font-bold text-lg mb-1">Limo Rentals</h3>
            <a href="/fleet" className="text-blue-700 hover:underline">View Limos</a>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <div className="w-32 h-20 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-400">[Charter Bus]</div>
            <h3 className="font-bold text-lg mb-1">Charter Bus Rentals</h3>
            <a href="/fleet" className="text-blue-700 hover:underline">View Charter Buses</a>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <div className="w-32 h-20 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-400">[Party Bus]</div>
            <h3 className="font-bold text-lg mb-1">Party Bus Rentals</h3>
            <a href="/fleet" className="text-blue-700 hover:underline">View Party Buses</a>
          </div>
        </div>
      </section>

      {/* Trust & Reputation */}
      <section className="bg-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">America's Most Trusted Limo & Bus Rental Company</h2>
          <p className="text-lg text-gray-700 mb-4">Thousands of happy customers, flexible booking, and a relentless dedication to service.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white rounded-lg px-6 py-3 font-bold text-blue-700 shadow">Custom Itineraries</div>
            <div className="bg-white rounded-lg px-6 py-3 font-bold text-blue-700 shadow">Multiple Vehicles</div>
            <div className="bg-white rounded-lg px-6 py-3 font-bold text-blue-700 shadow">Hourly or One-Way</div>
            <div className="bg-white rounded-lg px-6 py-3 font-bold text-blue-700 shadow">Confirmation Calls</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <span className="text-3xl mb-2">📝</span>
            <h4 className="font-semibold mb-1">1. Enter Info</h4>
            <p className="text-gray-600 text-sm">Tell us about your trip.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl mb-2">📸</span>
            <h4 className="font-semibold mb-1">2. Compare Options</h4>
            <p className="text-gray-600 text-sm">See vehicles & prices.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl mb-2">🛒</span>
            <h4 className="font-semibold mb-1">3. Book Online</h4>
            <p className="text-gray-600 text-sm">Reserve your ride.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl mb-2">🎉</span>
            <h4 className="font-semibold mb-1">4. Enjoy</h4>
            <p className="text-gray-600 text-sm">Have a great trip!</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">What Our Customers Say</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-700 italic mb-2">“Booking was so easy and the bus was spotless! Our driver was friendly and made our night unforgettable.”</p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-700">— Jamie R.</span>
              <span className="text-yellow-400">★★★★★</span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-700 italic mb-2">“We had a blast on the Mega Party Bus for my birthday. Highly recommend for any big group!”</p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-700">— Alex P.</span>
              <span className="text-yellow-400">★★★★★</span>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate & Group Transportation */}
      <section className="bg-blue-50 py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">Trusted by Companies Big & Small</h2>
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <div className="w-32 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">[Logo]</div>
            <div className="w-32 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">[Logo]</div>
            <div className="w-32 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">[Logo]</div>
            <div className="w-32 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">[Logo]</div>
          </div>
          <p className="text-gray-700">We handle group travel for Fortune 500s, weddings, events, and more.</p>
        </div>
      </section>

      {/* Partnerships & Accolades */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">Partnerships & Accolades</h2>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">[Badge]</div>
          <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">[Badge]</div>
          <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">[Badge]</div>
          <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">[Badge]</div>
        </div>
      </section>

      {/* Group Transportation Services */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">Group Transportation Services</h2>
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
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">Blog & Resources</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col">
            <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-400">[Blog Image]</div>
            <h4 className="font-semibold mb-1">How to Book a Charter Bus</h4>
            <p className="text-gray-600 text-sm mb-2">A complete guide to booking group transportation.</p>
            <a href="#" className="text-blue-700 hover:underline">Read More</a>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col">
            <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-400">[Blog Image]</div>
            <h4 className="font-semibold mb-1">Party Bus Rental Tips</h4>
            <p className="text-gray-600 text-sm mb-2">Everything you need to know for your next big event.</p>
            <a href="#" className="text-blue-700 hover:underline">Read More</a>
          </div>
        </div>
      </section>

      {/* Contact & Booking CTA */}
      <section className="bg-blue-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Book Your Bus or Limo Today!</h2>
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <div className="bg-blue-700 rounded-lg px-6 py-3 font-bold text-lg">Call: (555) 123-4567</div>
            <div className="bg-blue-700 rounded-lg px-6 py-3 font-bold text-lg">Text: (555) 987-6543</div>
            <div className="bg-blue-700 rounded-lg px-6 py-3 font-bold text-lg">Email: info@example.com</div>
          </div>
          <div className="flex justify-center gap-4 mb-4">
            <a href="#" className="text-white text-2xl">[FB]</a>
            <a href="#" className="text-white text-2xl">[IG]</a>
            <a href="#" className="text-white text-2xl">[X]</a>
            <a href="#" className="text-white text-2xl">[LI]</a>
          </div>
          <a href="/contact" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg shadow transition">Get a Quote</a>
        </div>
      </section>

      {/* Footer/Links */}
      <footer className="bg-gray-900 text-gray-200 py-8 mt-8">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold mb-2">Company</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
              <li><a href="#" className="hover:underline">Services</a></li>
              <li><a href="#" className="hover:underline">Reviews</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">Fleet</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Limos</a></li>
              <li><a href="#" className="hover:underline">Party Buses</a></li>
              <li><a href="#" className="hover:underline">Charter Buses</a></li>
              <li><a href="#" className="hover:underline">Sprinter Vans</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">Resources</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">Blog</a></li>
              <li><a href="#" className="hover:underline">FAQ</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2">Locations</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">All Locations</a></li>
              <li><a href="#" className="hover:underline">Popular Cities</a></li>
              <li><a href="#" className="hover:underline">Get a Quote</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-400 mt-8 text-sm">© {new Date().getFullYear()} Bus2Ride. All rights reserved.</div>
      </footer>
    </main>
  );
}
