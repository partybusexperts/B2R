export default function EnterInfoPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-blue-50 px-4 py-16">
      <h1 className="text-4xl font-extrabold text-blue-900 mb-6">1. Enter Info</h1>
      <p className="text-lg text-gray-700 max-w-2xl mb-8">
        Planning your next group trip with Bus2Ride starts with a simple step: telling us about your journey. Our streamlined online form is designed to capture all the essential details we need to provide you with the best possible service. Whether you’re organizing a wedding, corporate event, night out, or a cross-country adventure, we want to know your group size, preferred vehicle type, pickup and drop-off locations, travel dates, and any special requests you may have. The more information you provide, the more tailored and accurate your quote will be. Our system is secure and user-friendly, ensuring your privacy and making the process as smooth as possible. If you’re unsure about any details, our expert reservation team is just a call or message away, ready to assist and answer your questions. We believe that every trip is unique, and we’re committed to making yours unforgettable from the very first step. Start by entering your info today and experience the Bus2Ride difference—where luxury, convenience, and customer care come together for a seamless booking experience.
      </p>
      <a href="/quote" className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg shadow transition">Start Your Quote</a>
    </main>
  );
}
