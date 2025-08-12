
import { eventDetails } from './eventDetails';
import Image from 'next/image';

const phone = '1-800-123-4567';
const sms = '1-800-123-4567';
const ctaIndices = [3, 8, 13, 18, 23, 27];
const placeholderImg = '/globe.svg';

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-blue-900 drop-shadow-lg">Event Ideas & Services</h1>
        <p className="text-center text-lg text-gray-700 mb-10">Explore our most popular events and services. Call or text us to book your ride for any occasion!</p>
        <div className="flex flex-col gap-8">
          {eventDetails.map((event, idx) => (
            <>
              <div key={event.name} className="bg-white rounded-xl shadow flex flex-col md:flex-row items-center gap-6 px-6 py-7 border border-blue-100">
                <div className="w-full md:w-40 flex-shrink-0 flex items-center justify-center mb-4 md:mb-0">
                  <Image src={placeholderImg} alt="Event" width={120} height={120} className="rounded-lg object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-800 mb-1">{event.name}</h3>
                  <p className="text-gray-700 mb-2">{event.description}</p>
                  <a href="/contact" className="inline-block bg-blue-600 text-white font-bold px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition">Learn More</a>
                </div>
              </div>
              {ctaIndices.includes(idx) && (
                <div key={`cta-${idx}`} className="bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-xl shadow-lg px-6 py-8 flex flex-col items-center justify-center">
                  <h2 className="text-2xl font-bold mb-2">Ready to Get Started?</h2>
                  <p className="mb-3 text-lg">Call <a href={`tel:${phone}`} className="underline font-semibold">{phone}</a> or Text <a href={`sms:${sms}`} className="underline font-semibold">{sms}</a> to Book Your Bus or Limo!</p>
                  <a href="/contact" className="inline-block bg-white text-blue-700 font-bold px-6 py-2 rounded-lg shadow hover:bg-blue-50 transition">Get a Quote</a>
                </div>
              )}
            </>
          ))}
        </div>
      </section>
    </main>
  );
}
