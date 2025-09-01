import React from 'react';
import Header from '../../../components/Header';
import PageLayout from '../../../components/PageLayout';
import OptimizedImage from '../../../components/OptimizedImage';

export const metadata = {
  title: '20 Passenger Party Bus | Bus2Ride',
  description: 'Explore our 20 passenger party bus — great for medium-sized groups, events, and celebrations.',
};

export default function Page() {
  return (
    <PageLayout gradientFrom="from-white" gradientVia="via-gray-100" gradientTo="to-white" textColor="text-black">
      <Header />
      <div className="max-w-6xl mx-auto py-12 px-4">
        <section className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl font-bold mb-3">20 Passenger Party Bus</h2>
            <p className="mb-4 text-gray-700">Perfect for birthdays, nights out, and medium group transportation. This 20-passenger party bus features premium sound, lighting, and comfortable seating.</p>
            <ul className="list-disc pl-5 mb-6 text-gray-700">
              <li>Seats up to 20 passengers</li>
              <li>Premium stereo & Bluetooth</li>
              <li>LED party lighting</li>
              <li>Onboard cooler / mini-bar area</li>
            </ul>
            <a className="inline-block bg-blue-600 text-white px-5 py-3 rounded-lg shadow" href="/contact">Request a Quote</a>
          </div>
          <div className="space-y-4">
            <OptimizedImage src="https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?q=80&w=1200&auto=format&fit=crop" alt="20 passenger party bus interior with lights" width={1200} height={800} className="rounded-lg shadow-lg" />
            <div className="grid grid-cols-2 gap-3">
              <OptimizedImage src="https://images.unsplash.com/photo-1542367597-46c5b2f0a8c1?q=80&w=800&auto=format&fit=crop" alt="party bus exterior" width={800} height={500} className="rounded-lg" />
              <OptimizedImage src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop" alt="party bus group photo" width={800} height={500} className="rounded-lg" />
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h3 className="text-xl font-semibold mb-3">Specs & Amenities</h3>
          <table className="w-full text-left border-collapse text-gray-800">
            <tbody>
              <tr className="border-t">
                <td className="py-2 font-medium">Capacity</td>
                <td className="py-2">20 passengers</td>
              </tr>
              <tr className="border-t">
                <td className="py-2 font-medium">Entertainment</td>
                <td className="py-2">Bluetooth stereo, aux input, LED lighting</td>
              </tr>
              <tr className="border-t">
                <td className="py-2 font-medium">Extras</td>
                <td className="py-2">Mini-bar cooler, privacy divider</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </PageLayout>
  );
}
