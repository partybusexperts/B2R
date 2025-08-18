"use client";
import React from "react";
import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import PollsSection from "@/components/PollsSection";

const partyBusStats = [
	{ label: "Fleet Size", value: "20+ Buses", icon: "🚍" },
	{ label: "Max Capacity", value: "40 Passengers", icon: "👥" },
	{ label: "Avg. Rating", value: "4.9/5", icon: "⭐" },
	{ label: "Cities Served", value: "50+", icon: "🌆" },
];

const amenities = [
	{ label: "LED Party Lighting", icon: "💡" },
	{ label: "Premium Sound System", icon: "🔊" },
	{ label: "Dance Poles", icon: "🕺" },
	{ label: "Leather Seating", icon: "🛋️" },
	{ label: "BYOB Friendly", icon: "🍾" },
	{ label: "Flat Screen TVs", icon: "📺" },
	{ label: "Onboard Restroom (select buses)", icon: "🚻" },
	{ label: "WiFi (select buses)", icon: "📶" },
];

const buses = [
	{
		name: "40 Passenger Party Bus",
		image: "/review_uploads/40 Passenger Party Bus With Pole.jpg",
		description:
			"Our flagship party bus with wraparound seating, club lighting, and a booming sound system. Perfect for big nights out.",
		features: ["Dance Pole", "BYOB", "Bluetooth Audio", "Restroom"],
	},
	{
		name: "30 Passenger Party Bus",
		image: "/public/images/partybus30.jpg",
		description:
			"Sleek, stylish, and loaded with amenities. Ideal for birthdays, proms, and bachelor/bachelorette parties.",
		features: ["LED Lights", "TVs", "Cooler Storage"],
	},
	{
		name: "20 Passenger Party Bus",
		image: "/public/images/partybus20.jpg",
		description:
			"Compact luxury for smaller groups. Enjoy the same party experience in a more intimate setting.",
		features: ["Leather Seats", "Premium Audio"],
	},
];

const testimonials = [
	{
		name: "Jessica R.",
		text: "The party bus made our bachelorette night unforgettable! The lights, music, and vibe were next level.",
		image: "/public/images/testimonial1.jpg",
	},
	{
		name: "Mike D.",
		text: "We booked for prom and it was the best decision ever. The driver was awesome and the bus was spotless.",
		image: "/public/images/testimonial2.jpg",
	},
	{
		name: "Samantha K.",
		text: "Our group loved the sound system and the dance pole! Will book again for sure.",
		image: "/public/images/testimonial3.jpg",
	},
];

const faqs = [
	{
		q: "Can we bring our own drinks?",
		a: "Absolutely! All our party buses are BYOB friendly. Just no glass bottles, please.",
	},
	{
		q: "Is there a minimum rental time?",
		a: "Most rentals have a 4-hour minimum, but we can accommodate special requests.",
	},
	{
		q: "Do you provide a driver?",
		a: "Yes, all rentals include a professional, licensed chauffeur.",
	},
	{
		q: "Can we play our own music?",
		a: "Of course! All buses have Bluetooth and AUX connections.",
	},
];

const gallery = [
	"/review_uploads/40 Passenger Party Bus With Pole.jpg",
	"/public/images/partybus30.jpg",
	"/public/images/partybus20.jpg",
	"/public/images/partybus-night.jpg",
	"/public/images/partybus-interior.jpg",
	"/public/images/partybus-led.jpg",
];

export default function PartyBusesPage() {
	return (
		<PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
			   <Section className="flex flex-col items-center justify-center text-center !p-0 !py-0 relative overflow-hidden">
				   <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700/30 via-blue-900/10 to-black" />
				   <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg tracking-tight font-serif bg-gradient-to-r from-blue-400 via-blue-300 to-green-400 bg-clip-text text-transparent">
					   Chicago Party Buses
				   </h1>
				   <p className="text-2xl md:text-3xl max-w-3xl mx-auto mb-10 text-blue-100 font-medium">
					   The ultimate way to celebrate, travel, and make memories. Our luxury party buses are ready for your next big event.
				   </p>
				   <a
					   href="#book"
					   className="inline-block px-10 py-5 rounded-full bg-gradient-to-r from-blue-700 to-green-500 text-white font-bold text-2xl shadow-xl hover:scale-110 transition-transform"
				   >
					   Get Instant Quote
				   </a>
				   <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[120vw] h-40 bg-gradient-to-r from-blue-500/30 via-blue-500/20 to-green-500/10 blur-2xl opacity-60" />
			   </Section>
			   <Section className="max-w-6xl mx-auto flex flex-wrap justify-center gap-10 bg-gradient-to-r from-blue-900/80 via-blue-950/80 to-black/90 rounded-3xl shadow-xl my-12 py-10">
				   {partyBusStats.map((stat) => (
					   <div
						   key={stat.label}
						   className="flex flex-col items-center px-10 py-8 rounded-2xl bg-gradient-to-br from-blue-800 to-blue-950 shadow-2xl min-w-[200px] border border-blue-500/30 hover:scale-105 transition-transform"
					   >
						   <span className="text-5xl mb-2">{stat.icon}</span>
						   <span className="text-3xl font-bold text-blue-300 mb-1 font-serif">
							   {stat.value}
						   </span>
						   <span className="text-lg text-blue-100 font-sans">{stat.label}</span>
					   </div>
				   ))}
			   </Section>
			   <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10">
				   <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-blue-200 font-serif tracking-tight">
					   Party Bus Gallery
				   </h2>
				   <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-blue-500/40 scrollbar-track-transparent">
					   <a
						   href="/fleet/20-passenger-party-bus"
						   className="block focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-2xl"
					   >
						   <img
							   key="main-party-bus"
							   src="/images/18 Passenger White Party Bus Exterior.png"
							   alt="20 Passenger Party Bus"
							   className="rounded-2xl shadow-xl w-80 h-56 object-cover object-center hover:scale-105 transition-transform border-4 border-blue-700/30"
							   loading="lazy"
						   />
					   </a>
					   {gallery.slice(1).map((img, i) => (
						   <img
							   key={img}
							   src={img}
							   alt={`Party Bus ${i + 2}`}
							   className="rounded-2xl shadow-xl w-80 h-56 object-cover object-center hover:scale-105 transition-transform border-4 border-blue-700/30"
							   loading="lazy"
						   />
					   ))}
				   </div>
			   </Section>
			   <Section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10 text-white">
				   <h2 className="text-5xl font-extrabold mb-12 text-center text-blue-200 font-serif tracking-tight">
					   Our Most Popular Party Buses
				   </h2>
				   <div className="grid md:grid-cols-3 gap-12">
					   {buses.map((bus) => (
						   <div
							   key={bus.name}
							   className="bg-blue-950/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col hover:scale-105 transition-transform border border-blue-500/20 text-white"
						   >
							   <img
								   src={bus.image}
								   alt={bus.name}
								   className="w-full h-64 object-cover object-center"
								   loading="lazy"
							   />
							   <div className="p-8 flex-1 flex flex-col">
								   <h3 className="text-3xl font-bold mb-3 text-white font-serif">
									   {bus.name}
								   </h3>
								   <p className="mb-5 text-white flex-1 text-lg font-sans">
									   {bus.description}
								   </p>
								   <ul className="flex flex-wrap gap-3 mb-2">
									   {bus.features.map((f) => (
										   <li
											   key={f}
											   className="px-4 py-1 rounded-full bg-blue-800 text-white text-sm font-semibold border border-blue-400/20"
										   >
											   {f}
										   </li>
									   ))}
								   </ul>
							   </div>
						   </div>
					   ))}
				   </div>
			   </Section>
			   <Section className="max-w-5xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10 text-white">
				   <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-200 font-serif tracking-tight">
					   Amenities & Features
				   </h2>
				   <ul className="grid grid-cols-2 md:grid-cols-4 gap-8">
					   {amenities.map((a) => (
						   <li
							   key={a.label}
							   className="flex items-center gap-3 text-xl text-white bg-blue-950/70 rounded-xl px-6 py-4 shadow border border-blue-700/20 hover:bg-blue-900/60 transition-colors font-sans"
						   >
							   <span className="text-blue-200 text-2xl">{a.icon}</span> {a.label}
						   </li>
					   ))}
				   </ul>
			   </Section>
			   <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10 text-white">
				   <h2 className="text-4xl font-extrabold mb-10 text-center text-blue-200 font-serif tracking-tight">
					   What Our Riders Say
				   </h2>
				   <div className="grid md:grid-cols-3 gap-10">
					   {testimonials.map((t) => (
						   <div
							   key={t.name}
							   className="bg-blue-950/90 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center border border-blue-500/10 hover:scale-105 transition-transform text-white"
						   >
							   <img
								   src={t.image}
								   alt={t.name}
								   className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-blue-400/30"
								   loading="lazy"
							   />
							   <p className="text-lg text-white mb-3 font-sans">“{t.text}”</p>
							   <span className="font-bold text-white font-serif">{t.name}</span>
						   </div>
					   ))}
				   </div>
			   </Section>

			   {/* Limousine & Charter Bus Rentals Section */}
			   <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-14 text-white">
				   <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6 font-serif tracking-tight text-blue-200">
					   We Also Offer Limousine & Charter Bus Rentals
				   </h2>
				   <p className="text-lg md:text-xl text-center mb-10 max-w-3xl mx-auto text-blue-100 font-sans">
					   We not only have party buses, we also have limousines and coach buses. Limousines can sometimes be less expensive and coach buses are forward facing more corporate types of vehicles. Check them out below.
				   </p>
				   <div className="flex flex-col md:flex-row gap-10 justify-center items-center">
					   <div className="flex flex-col items-center w-full md:w-1/2">
						   <img src="/images/10 Passenger Black Lincoln Stretch Limo Exterior Black.png" alt="Limousine" className="rounded-2xl shadow-xl w-full max-w-md h-64 object-cover object-center mb-4 border-4 border-blue-700/30" />
						   <a href="/limos" className="mt-2 inline-block bg-gradient-to-r from-blue-700 to-green-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition hover:scale-105">LIMOUSINES</a>
					   </div>
					   <div className="flex flex-col items-center w-full md:w-1/2">
						   <img src="/images/Bus-1.png" alt="Coach Bus" className="rounded-2xl shadow-xl w-full max-w-md h-64 object-cover object-center mb-4 border-4 border-blue-700/30" />
						   <a href="/coach-buses" className="mt-2 inline-block bg-gradient-to-r from-blue-700 to-green-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition hover:scale-105">COACH BUSES</a>
					   </div>
				   </div>
			   </Section>
			   <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black">
				   <div className="max-w-6xl mx-auto px-4 mt-12 mb-2">
					   <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-10 mt-8 tracking-tight">Party Bus Polls</h2>
					   <p className="text-lg text-center text-blue-100 mb-6 max-w-2xl mx-auto">
						   See what real party bus riders and industry pros are saying! Our live polls help you compare trends, get honest opinions, and make smarter choices for your next trip. Vote, view results, and join the conversation.
					   </p>
				   </div>
				   <PollsSection pollType="partybus" />
			   </Section>
			   <Section className="max-w-4xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10 text-white">
				   <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-200 font-serif tracking-tight">
					   Frequently Asked Questions
				   </h2>
				   <div className="space-y-6">
					   {faqs.map((faq, i) => (
						   <details
							   key={faq.q}
							   className="group border border-blue-700/30 rounded-xl bg-blue-950/70 p-6 hover:bg-blue-900/40 transition-colors text-white"
						   >
							   <summary className="cursor-pointer text-lg font-semibold text-white group-open:text-white flex items-center gap-2 font-sans">
								   <span className="text-2xl">
									   {i % 2 === 0 ? "❓" : "💬"}
								   </span>{" "}
								   {faq.q}
							   </summary>
							   <p className="mt-3 text-white text-base font-sans">{faq.a}</p>
						   </details>
					   ))}
				   </div>
			   </Section>
			   <Section id="book" className="max-w-2xl mx-auto text-center bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10">
				   <h2 className="text-5xl font-extrabold mb-6 text-blue-200 font-serif tracking-tight">
					   Transparent Pricing
				   </h2>
				   <p className="mb-8 text-xl text-blue-100 font-sans">
					   Get a real-time quote in seconds. No hidden fees, no surprises. Just awesome rides.
				   </p>
				   <a
					   href="/quote"
					   className="inline-block px-12 py-5 rounded-full bg-gradient-to-r from-blue-700 to-green-500 text-white font-bold text-2xl shadow-xl hover:scale-110 transition-transform"
				   >
					   Book Your Party Bus
				   </a>
			   </Section>
			   <footer className="py-10 text-center text-blue-200 bg-black/80 mt-10 border-t border-blue-900/30">
				   <p className="text-lg font-sans">
					   Ready to roll?{" "}
					   <a
						   href="/quote"
						   className="text-blue-400 underline hover:text-blue-300"
					   >
						   Get your instant quote
					   </a>{" "}
					   or call{" "}
					   <a
						   href="tel:3125551234"
						   className="text-blue-400 underline hover:text-blue-300"
					   >
						   (312) 555-1234
					   </a>
				   </p>
				   <p className="mt-2 text-sm font-sans">
					   &copy; {new Date().getFullYear()} Bus2Ride. All rights reserved.
				   </p>
			   </footer>
		</PageLayout>
	);
}
