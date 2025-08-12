"use client";

import Image from "next/image";

const pricingFaq = [
  {
    title: "How Much Is A Luxury Party Bus Rental?",
    answer: "Our party bus rentals range from $500 to $5,000 per day depending on location, bus size, amenities, and rental length. We offer competitive pricing and top-notch service for any event.",
    image: "/globe.svg"
  },
  {
    title: "Why Does It Cost More On Prom?",
    answer: "Prom season means higher demand, longer hours, and premium amenities. This, plus seasonal costs, can increase rates. Booking early helps secure the best price!",
    image: "/vercel.svg"
  },
  {
    title: "Why Does Bus2Ride Have A Minimum Hour Rental?",
    answer: "A minimum rental period helps us cover overhead and ensures you get the most value. Most rentals require at least four hours, but we offer flexibility for off-peak or short trips.",
    image: "/window.svg"
  },
  {
    title: "How Much Does A Limousine Rental Cost?",
    answer: "Limousine rentals typically range from $100 to $400 per hour, with a 3-4 hour minimum. Pricing depends on location, vehicle type, and amenities. Contact us for a custom quote!",
    image: "/next.svg"
  },
  {
    title: "How Do I Get Pricing For Multi-State Trips?",
    answer: "Multi-state trips are quoted based on distance, group size, and duration. Contact our team for a custom travel plan and competitive quote for your adventure.",
    image: "/globe.svg"
  },
  {
    title: "What Does It Cost For A Quinceañera?",
    answer: "Quinceañera bus rentals range from $500 to $5,000, with a four-hour minimum. We offer exceptions for shorter rentals ending before 4pm on Saturdays. Get in touch for details!",
    image: "/vercel.svg"
  },
  // Custom FAQ rows below
  {
    title: "Are There Extra Fees for Additional Stops?",
    answer: "Additional stops may incur a small fee depending on distance and time. Let us know your itinerary for an exact quote—transparency is our priority!",
    image: "/window.svg"
  },
  {
    title: "Do Prices Change for Holidays or Special Events?",
    answer: "Yes, peak dates like holidays and major events may have higher rates due to demand. Book early to lock in the best price!",
    image: "/next.svg"
  },
  {
    title: "Is Gratuity Included in the Price?",
    answer: "Gratuity is not always included. We recommend 15-20% for excellent service. Your quote will specify if gratuity is added.",
    image: "/globe.svg"
  },
  {
    title: "Can I Get a Discount for Large Groups?",
    answer: "We offer special rates and discounts for large groups and multi-vehicle bookings. Ask our team for current promotions!",
    image: "/vercel.svg"
  },
  {
    title: "What Payment Methods Are Accepted?",
    answer: "We accept all major credit cards, ACH, and select digital wallets. Payment details will be provided with your quote.",
    image: "/window.svg"
  },
  {
    title: "Is a Deposit Required to Reserve?",
    answer: "A deposit is typically required to secure your booking. The amount and terms will be outlined in your quote and agreement.",
    image: "/next.svg"
  },
];

import { FaDollarSign, FaBusAlt, FaQuestionCircle, FaPhoneAlt } from "react-icons/fa";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-14 mb-10 shadow-lg rounded-b-3xl">
        <div className="max-w-3xl mx-auto px-4 text-center flex flex-col items-center">
          <span className="bg-white/20 rounded-full p-4 mb-4"><FaDollarSign size={40} /></span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-lg">Transparent Pricing</h1>
          <p className="text-lg md:text-xl mb-6 font-medium">Know what to expect—no surprises, just great value for your luxury ride.</p>
          <a href="/contact" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg shadow transition">Get a Custom Quote</a>
        </div>
      </section>

      {/* FAQ Cards in 3 rows, 4 per row */}
      <section className="max-w-6xl mx-auto px-4 grid gap-10">
        {[0, 1, 2].map((row) => (
          <div key={row} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {pricingFaq.slice(row * 4, row * 4 + 4).map((item) => (
              <div
                key={item.title}
                className="relative bg-white rounded-2xl shadow-lg flex flex-col items-center gap-6 p-8 border-l-8 border-blue-200 hover:border-blue-500 hover:shadow-2xl transition-all group"
                style={{ background: "linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)" }}
              >
                <div className="w-full h-32 relative flex-shrink-0 mb-2 flex items-center justify-center">
                  <span className="absolute left-2 top-2 text-blue-400 group-hover:text-blue-600 transition-all"><FaBusAlt size={28} /></span>
                  <Image src={item.image} alt={item.title} fill className="object-contain rounded-xl" />
                </div>
                <h2 className="text-xl font-bold text-blue-800 mb-2 flex items-center gap-2"><FaQuestionCircle className="text-blue-400" />{item.title}</h2>
                <p className="text-gray-700 text-base text-center">{item.answer}</p>
              </div>
            ))}
          </div>
        ))}
      </section>

      {/* CTA Card */}
      <section className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-xl p-8 text-center flex flex-col items-center">
          <FaPhoneAlt size={36} className="text-white mb-2" />
          <h2 className="text-2xl font-bold mb-2 text-white">Ready to get your custom quote?</h2>
          <p className="text-white mb-4">Contact our team and we’ll help you find the perfect vehicle and price for your event.</p>
          <a href="/contact" className="inline-block bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-100 transition">Contact Us</a>
        </div>
      </section>
    </main>
  );
}
