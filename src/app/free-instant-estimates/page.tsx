export default function FreeInstantEstimatesPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <h1 className="text-4xl font-extrabold text-blue-900 mb-6">Free Instant Estimates</h1>
      <p className="text-lg text-gray-700 max-w-xl text-center mb-8">Get a quote for your next luxury ride in seconds. Our online system makes it easy to see pricing and options instantly—no waiting, no hassle.</p>
      <a href="/quote" className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg shadow transition">Get Your Free Estimate</a>
    </main>
  );
}
