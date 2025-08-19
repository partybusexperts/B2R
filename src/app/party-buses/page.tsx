"use client";
import React, { useState } from "react";
import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import PollsSection from "@/components/PollsSection";
import StatsStrip from "@/components/StatsStrip";


const amenities = [
	{
		label: "Wrap-Around Leather Seating",
		icon: "�️",
		description:
			"Our plush wrap-around leather seating lets everyone face each other, making it perfect for socializing and keeping the party vibe going all night!",
	},
	{
		label: "Dance Pole (Optional)",
		icon: "🕺",
		description:
			"A removable dance pole for those who want to add a little extra fun and flair to the party. Always optional, always a crowd-pleaser!",
	},
	{
		label: "TVs (Usually DVD)",
		icon: "�",
		description:
			"Enjoy your favorite movies or music videos on our built-in TVs. Most buses include DVD players for group entertainment on the go.",
	},
	{
		label: "Wet Bars & Drink Holders",
		icon: "🍸",
		description:
			"Multiple wet bars and plenty of drink holders keep your beverages cold and close at hand. Cheers to a great night!",
	},
	{
		label: "Laser Light Show",
		icon: "�",
		description:
			"Dynamic laser and LED lighting effects create a true club atmosphere inside the bus. The party starts as soon as you step on board!",
	},
	{
		label: "Bluetooth Surround Sound Audio",
		icon: "🔊",
		description:
			"Connect your phone or device via Bluetooth and play your own playlists through our premium surround sound system.",
	},
	{
		label: "Professional Driver",
		icon: "🧑‍✈️",
		description:
			"All rentals include a courteous, professional, and fully licensed chauffeur so you can relax and enjoy the ride.",
	},
	{
		label: "Unlimited Stops (for smoke, bathroom, supplies, etc.)",
		icon: "�",
		description:
			"Need to make a pit stop? No problem! Unlimited stops for bathroom breaks, supplies, or just to stretch your legs.",
	},
	{
		label: "Ability to Dance & Stand Up",
		icon: "🩰",
		description:
			"Spacious interiors let you dance, mingle, and move around safely—no cramped seating here!",
	},
	{
		label: "Better for Socializing, Less Claustrophobic",
		icon: "🫂",
		description:
			"Open layouts and wrap-around seating make it easy to chat, laugh, and connect with everyone in your group.",
	},
	{
		label: "Easy to Get In and Out Of",
		icon: "�",
		description:
			"Wide doors and low steps make boarding and exiting the bus a breeze for all guests.",
	},
	{
		label: "BYOB Friendly",
		icon: "🍾",
		description:
			"Bring your own beverages and keep the party going your way. Just no glass bottles, please!",
	},
	{
		label: "Some Restrooms on Big Party Buses",
		icon: "�",
		description:
			"Select larger party buses include onboard restrooms for maximum comfort and convenience during your trip.",
	},
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
	const [openAmenityIdx, setOpenAmenityIdx] = useState<number | null>(null);
	return (
		<PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
							 <Section className="flex flex-col items-center justify-center text-center !p-0 !py-0 relative overflow-hidden min-h-[480px] md:min-h-[600px] py-24 md:py-36">
									<div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700/30 via-blue-900/10 to-black" />
									  <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg tracking-tight font-serif bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
										  Bus2Ride Party Bus Fleet
									  </h1>
									  <p className="text-2xl md:text-3xl max-w-3xl mx-auto mb-10 text-blue-100 font-medium">
										  Explore our full lineup of luxury party buses—perfect for any celebration, big or small. This page features only our party bus options. For limos or coach buses, see the links below.
									  </p>
												<div className="flex flex-col sm:flex-row gap-4 justify-center mb-4 z-10 w-full max-w-2xl">
													<a
														href="#book"
														className="rounded-full font-bold px-8 py-3 text-lg shadow-lg transition border flex items-center justify-center min-w-[220px] text-center bg-white text-blue-800 hover:bg-blue-50 hover:text-blue-900 border-blue-200"
														style={{ letterSpacing: "0.03em" }}
													>
														Get Instant Quote
													</a>
													<a
														href="/fleet"
														className="rounded-full font-bold px-8 py-3 text-lg shadow-lg transition border flex items-center justify-center min-w-[220px] text-center bg-blue-700 text-white hover:bg-blue-800 border-blue-800"
														style={{ letterSpacing: "0.03em" }}
													>
														View Fleet
													</a>
													<a
														href="/contact"
														className="rounded-full font-bold px-8 py-3 text-lg shadow-lg transition border flex items-center justify-center min-w-[220px] text-center bg-white text-blue-800 border-blue-200 hover:bg-blue-50 hover:text-blue-900"
														style={{ letterSpacing: "0.03em" }}
													>
														<span className="relative text-blue-500 text-xl phone-nudge mr-2">📞</span>
														<span className="relative">Contact Us</span>
													</a>
												</div>
												<style>{`
													@keyframes nudge {
														0%, 80%, 100% { transform: translateX(0); }
														85% { transform: translateX(-2px); }
														90% { transform: translateX(2px); }
														95% { transform: translateX(-1px); }
													}
													.phone-nudge {
														display: inline-block;
														animation: nudge 5s ease-in-out infinite;
													}
												`}</style>
									<div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[120vw] h-40 bg-gradient-to-r from-blue-500/30 via-blue-500/20 to-blue-800/10 blur-2xl opacity-60" />
							 </Section>
													 <Section className="max-w-6xl mx-auto my-12 py-10 bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl flex flex-col items-center">
														 <div className="w-full max-w-3xl">
															 <StatsStrip />
														 </div>
													 </Section>
							   <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10">
									   <h2 className="text-5xl md:text-6xl font-extrabold mb-8 text-center text-blue-200 font-serif tracking-tight">
											   All Our Party Buses!
									   </h2>
									   <p className="text-xl text-blue-100 text-center mb-10 font-medium">Browse our full party bus fleet—find your perfect ride for any occasion!</p>
									   <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
											   {Array.from({ length: 20 }).map((_, i) => (
												   <div key={i} className="flex flex-col items-center bg-blue-950/80 rounded-2xl shadow-xl p-6 border border-blue-700/20 hover:scale-105 transition-transform">
													   <img
														   src={`/images/Bus-${(i % 5) + 1}.png`}
														   alt={`Party Bus ${i + 1}`}
														   className="rounded-2xl shadow-xl w-full max-w-xl h-80 object-cover object-center mb-4 border-4 border-blue-700/30"
														   loading="lazy"
													   />
													   <h3 className="text-2xl font-bold text-blue-100 mb-2 font-serif">Party Bus {i + 1}</h3>
													   <p className="text-lg text-blue-200 text-center mb-4">Spacious, stylish, and ready for your next big event!</p>
													   <div className="flex flex-col md:flex-row gap-2 justify-center items-center w-full mt-2">
														   <a href="tel:8885352566" className="rounded-full font-bold px-4 py-2 text-sm shadow transition border flex items-center justify-center min-w-[110px] text-center bg-white text-blue-800 border-blue-200 hover:bg-blue-50 hover:text-blue-900" style={{ letterSpacing: "0.02em" }}>
															   <span className="relative text-blue-500 text-lg phone-nudge mr-1">📞</span>
															   <span className="relative">(888) 535-2566</span>
														   </a>
														   <a href="mailto:info@bus2ride.com" className="rounded-full font-bold px-4 py-2 text-sm shadow transition border flex items-center justify-center min-w-[110px] text-center bg-blue-700 text-white border-blue-800 hover:bg-blue-800" style={{ letterSpacing: "0.02em" }}>
															   <span className="relative text-white text-lg mr-1">✉️</span>
															   <span className="relative">Email</span>
														   </a>
														   <a href="/quote" className="rounded-full font-bold px-4 py-2 text-sm shadow transition border flex items-center justify-center min-w-[110px] text-center bg-white text-blue-800 border-blue-200 hover:bg-blue-50 hover:text-blue-900" style={{ letterSpacing: "0.02em" }}>
															   <span className="relative text-blue-500 text-lg mr-1">⚡</span>
															   <span className="relative">Quote</span>
														   </a>
													   </div>
												   </div>
											   ))}
									   </div>
									   <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-8">
										   <a href="tel:8885352566" className="rounded-full font-bold px-8 py-4 text-lg shadow-lg transition border flex items-center justify-center min-w-[220px] text-center bg-white text-blue-800 border-blue-200 hover:bg-blue-50 hover:text-blue-900" style={{ letterSpacing: "0.03em" }}>
											   <span className="relative text-blue-500 text-2xl phone-nudge mr-2">📞</span>
											   <span className="relative">(888) 535-2566</span>
										   </a>
										   <a href="mailto:info@bus2ride.com" className="rounded-full font-bold px-8 py-4 text-lg shadow-lg transition border flex items-center justify-center min-w-[220px] text-center bg-blue-700 text-white border-blue-800 hover:bg-blue-800" style={{ letterSpacing: "0.03em" }}>
											   <span className="relative text-white text-2xl mr-2">✉️</span>
											   <span className="relative">Email Now</span>
										   </a>
										   <a href="/quote" className="rounded-full font-bold px-8 py-4 text-lg shadow-lg transition border flex items-center justify-center min-w-[220px] text-center bg-white text-blue-800 border-blue-200 hover:bg-blue-50 hover:text-blue-900" style={{ letterSpacing: "0.03em" }}>
											   <span className="relative text-blue-500 text-2xl mr-2">⚡</span>
											   <span className="relative">Instant Live Quote</span>
										   </a>
									   </div>
									   <style>{`
										   @keyframes nudge {
											   0%, 80%, 100% { transform: translateX(0); }
											   85% { transform: translateX(-2px); }
											   90% { transform: translateX(2px); }
											   95% { transform: translateX(-1px); }
										   }
										   .phone-nudge {
											   display: inline-block;
											   animation: nudge 5s ease-in-out infinite;
										   }
									   `}</style>
							   </Section>

										<Section className="max-w-5xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10 text-white">
											<h2 className="text-4xl font-extrabold mb-8 text-center text-blue-200 font-serif tracking-tight">
												Amenities & Features
											</h2>
											<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
												{amenities.map((a, idx) => (
													<button
														key={a.label}
														type="button"
														className="flex items-center gap-3 text-lg md:text-xl text-white bg-blue-950/80 rounded-xl px-6 py-4 shadow border border-blue-700/20 hover:bg-blue-900/60 transition-colors font-sans font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
														tabIndex={0}
														onClick={() => setOpenAmenityIdx(idx)}
														aria-label={a.label}
													>
														<span className="text-blue-200 text-2xl">{a.icon}</span> {a.label}
													</button>
												))}
											</div>
											{/* Modal for amenities */}
											{openAmenityIdx !== null && (
												<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
													<div className="bg-white text-blue-900 rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fadeIn">
														<button
															onClick={() => setOpenAmenityIdx(null)}
															className="absolute top-3 right-3 text-2xl text-blue-700 hover:text-blue-900 font-bold focus:outline-none"
															aria-label="Close modal"
														>
															×
														</button>
														<div className="flex items-center gap-4 mb-4">
															<span className="text-3xl">{amenities[openAmenityIdx].icon}</span>
															<h3 className="text-2xl font-bold font-serif">{amenities[openAmenityIdx].label}</h3>
														</div>
														<p className="text-lg font-sans">{amenities[openAmenityIdx].description || "No additional details available for this amenity."}</p>
													</div>
												</div>
											)}
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
			  {/* What Our Riders Say section temporarily removed */}

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
						   <a href="/limos" className="mt-2 inline-block bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition hover:scale-105">LIMOUSINES</a>
					   </div>
					   <div className="flex flex-col items-center w-full md:w-1/2">
						   <img src="/images/Bus-1.png" alt="Coach Bus" className="rounded-2xl shadow-xl w-full max-w-md h-64 object-cover object-center mb-4 border-4 border-blue-700/30" />
						   <a href="/coach-buses" className="mt-2 inline-block bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition hover:scale-105">COACH BUSES</a>
					   </div>
				   </div>
			   </Section>

			   {/* Helpful Party Bus Tools Section */}
			   <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-14 text-white">
				   <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 font-serif tracking-tight text-blue-200">
					   Helpful Party Bus Tools
				   </h2>
				   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center items-stretch">
					   {/* Per Person Splitter */}
					   <div className="flex flex-col items-center bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl shadow-lg px-8 py-7 w-full max-w-xs hover:scale-105 transition">
						   <span className="text-4xl mb-2">🧮</span>
						   <span className="font-bold text-lg mb-1">Per Person Splitter</span>
						   <span className="text-blue-100 text-center text-base">Easily split the total cost among your group—no math headaches.</span>
					   </div>
					   {/* BYOB Pack & Ice Calculator */}
					   <div className="flex flex-col items-center bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl shadow-lg px-8 py-7 w-full max-w-xs hover:scale-105 transition">
						   <span className="text-4xl mb-2">🥤</span>
						   <span className="font-bold text-lg mb-1">BYOB Pack & Ice Calculator</span>
						   <span className="text-blue-100 text-center text-base">Figure out how much to bring so nobody runs dry (or warm) on the bus.</span>
					   </div>
					   {/* Seat Space Fit Advisor */}
					   <div className="flex flex-col items-center bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl shadow-lg px-8 py-7 w-full max-w-xs hover:scale-105 transition">
						   <span className="text-4xl mb-2">🪑</span>
						   <span className="font-bold text-lg mb-1">Seat Space Fit Advisor</span>
						   <span className="text-blue-100 text-center text-base">Check if your group will fit comfortably—no squishing, no surprises.</span>
					   </div>
					   {/* Bar Hop Route Builder */}
					   <div className="flex flex-col items-center bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl shadow-lg px-8 py-7 w-full max-w-xs hover:scale-105 transition">
						   <span className="text-4xl mb-2">🗺️</span>
						   <span className="font-bold text-lg mb-1">Bar Hop Route Builder</span>
						   <span className="text-blue-100 text-center text-base">Plan your stops and build the perfect party route for the night.</span>
					   </div>
					   {/* Vibe Selector */}
					   <div className="flex flex-col items-center bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl shadow-lg px-8 py-7 w-full max-w-xs hover:scale-105 transition">
						   <span className="text-4xl mb-2">🎶</span>
						   <span className="font-bold text-lg mb-1">Vibe Selector</span>
						   <span className="text-blue-100 text-center text-base">Pick your party mood—chill, club, throwback, or wild—and get playlist ideas.</span>
					   </div>
					   {/* Stop Timing Planner */}
					   <div className="flex flex-col items-center bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl shadow-lg px-8 py-7 w-full max-w-xs hover:scale-105 transition">
						   <span className="text-4xl mb-2">⏱️</span>
						   <span className="font-bold text-lg mb-1">Stop Timing Planner</span>
						   <span className="text-blue-100 text-center text-base">Map out how long to spend at each stop so you never feel rushed (or bored).</span>
					   </div>
				   </div>
				   <div className="flex justify-center mt-10">
					   <button
						   type="button"
						   className="rounded-full font-bold px-8 py-4 text-lg shadow-lg transition border flex items-center justify-center bg-gradient-to-r from-blue-700 to-blue-500 text-white border-blue-800 hover:bg-blue-800"
						   style={{ letterSpacing: "0.03em" }}
					   >
						   <span className="text-2xl mr-2">➕</span>
						   More Tools
					   </button>
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
					   className="inline-block px-12 py-5 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold text-2xl shadow-xl hover:scale-110 transition-transform"
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
