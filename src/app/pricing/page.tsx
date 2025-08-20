
"use client";


import React, { useMemo, useState } from "react";
import Section from "../../components/Section";

// ------------------------------- FAQ content -------------------------------
const faqData = [
	{
		title: "How much does a party bus cost?",
		answer: "Prices vary by city, date, and vehicle size. Use our Instant Quote Tool for real-time pricing!",
		image: "/globe.svg",
	},
	{
		title: "Are there hidden fees?",
		answer: "No hidden fees. All taxes and fees are included in your quote.",
		image: "/vercel.svg",
	},
	{
		title: "How do I split the cost with friends?",
		answer: "Use our Cost Split Calculator in the Tools section below!",
		image: "/window.svg",
	},
	{
		title: "What is the minimum booking time?",
		answer: "Most rentals require a 3-4 hour minimum to ensure value and availability.",
		image: "/clock.svg",
	},
	{
		title: "What payment methods are accepted?",
		answer: "We accept all major credit/debit cards, Zelle, CashApp, and more.",
		image: "/globe.svg",
	},
	{
		title: "Can I bring my own drinks?",
		answer: "Yes! Most party buses allow BYOB for guests 21+ (local laws apply).",
		image: "/vercel.svg",
	},
	{
		title: "Is gratuity included?",
		answer: "Standard driver gratuity is included in your quote. Extra tips are optional.",
		image: "/window.svg",
	},
	{
		title: "How far in advance should I book?",
		answer: "Book 2-6 weeks ahead for best selection, especially during peak seasons.",
		image: "/clock.svg",
	},
	{
		title: "Can I see the bus before booking?",
		answer: "Yes, we can provide photos or schedule a viewing upon request.",
		image: "/globe.svg",
	},
	{
		title: "What if my group is larger than expected?",
		answer: "Contact us ASAP. We’ll help you upgrade to a larger vehicle if available.",
		image: "/vercel.svg",
	},
	{
		title: "Are there cancellation fees?",
		answer: "Deposits are non-refundable, but we’ll work with you to reschedule if needed.",
		image: "/window.svg",
	},
	{
		title: "Can I decorate the bus?",
		answer: "Yes, simple decorations are allowed. Please ask for guidelines before your trip.",
		image: "/clock.svg",
	},
	{
		title: "Is smoking allowed?",
		answer: "No smoking or vaping is allowed on any vehicle.",
		image: "/globe.svg",
	},
	{
		title: "What happens if we go over time?",
		answer: "Overtime is billed in 15- or 30-minute increments at your quoted rate.",
		image: "/vercel.svg",
	},
	{
		title: "Can I change my pickup/dropoff location?",
		answer: "Yes, just let us know in advance so we can update your reservation.",
		image: "/window.svg",
	},
	{
		title: "Are party buses safe?",
		answer: "All vehicles are DOT-inspected and driven by licensed, professional chauffeurs.",
		image: "/clock.svg",
	},
	{
		title: "Do you offer one-way trips?",
		answer: "Yes, one-way and round-trip bookings are available. Ask for details!",
		image: "/globe.svg",
	},
	{
		title: "How do I get a quote?",
		answer: "Use our Instant Quote Tool or call us for a custom quote in minutes.",
		image: "/vercel.svg",
	},
];

// ------------------------------ Stats + Modals -----------------------------
const statsData = [
	{
		icon: "⏰",
		title: "3–4 Hours",
		subtitle: "Minimum Booking",
		modalTitle: "Minimum Booking Time",
		modalContent:
			"Most party bus rentals require a 3–4 hour minimum. This ensures you get the best value and covers travel, setup, and cleanup time.",
	},
	{
		icon: "💵",
		title: "No Hidden Fees",
		subtitle: "Transparent Quotes",
		modalTitle: "No Hidden Fees",
		modalContent:
			"Quotes include taxes and standard fees. What you see is what you pay—no surprises at checkout.",
	},
	{
		icon: "🧾",
		title: "All-Inclusive",
		subtitle: "Taxes & Fees",
		modalTitle: "All-Inclusive Pricing",
		modalContent:
			"Your price covers all mandatory charges (taxes, standard fees, and service). Tipping extra is optional.",
	},
	{
		icon: "💳",
		title: "Flexible Pay",
		subtitle: "Cards, Zelle, CashApp",
		modalTitle: "Flexible Payment Methods",
		modalContent:
			"We accept all major credit/debit cards, Zelle, and CashApp. (No ACH or crypto.)",
	},
];

function Modal({
	open,
	onClose,
	title,
	children,
}: {
	open: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
}) {
	if (!open) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
			<div className="bg-gradient-to-br from-blue-900 to-black rounded-2xl shadow-2xl p-8 max-w-md w-full relative border-2 border-blue-400/30">
				<button
					onClick={onClose}
					className="absolute top-3 right-3 text-blue-200 hover:text-white text-2xl font-bold focus:outline-none"
					aria-label="Close"
				>
					×
				</button>
				<h3 className="text-2xl font-extrabold mb-4 text-blue-100 font-serif tracking-tight">
					{title}
				</h3>
				<div className="text-blue-100 text-lg font-sans">{children}</div>
			</div>
		</div>
	);
}

export default function PricingPage() {

		const [search, setSearch] = useState("");
		const [modalIdx, setModalIdx] = useState<number | null>(null);
				// Modal state for all 9 tools
				const [activeTool, setActiveTool] = useState<null | number>(null);

				// Reset logic for each tool modal
				function openToolModal(idx: number) {
					setActiveTool(idx);
					if (idx === 0) { resetQuoteModal(); }
					if (idx === 1) { setVcfPassengers(10); setVcfResult(null); }
					if (idx === 2) { setSplitTotal(1000); setSplitPeople(10); setSplitResult(null); }
					if (idx === 3) { setDate(""); setDateResult(null); }
					if (idx === 4) { setZip(""); setZipResult(null); }
					if (idx === 5) { setHvfHours(4); setHvfFlat(700); setHvfResult(null); }
					if (idx === 6) { setVcType("party"); setVcResult(null); }
					if (idx === 7) { setFeeBase(1000); setFeeResult(null); }
					if (idx === 8) { setAskMsg(""); setAskResult(null); }
				}

			// Demo forms/results for each tool
			// 0: Instant Quote Tool
			const [quoteForm, setQuoteForm] = useState({ city: "", zip: "", hours: 4, passengers: 10 });
			const [quoteResult, setQuoteResult] = useState<string | null>(null);
			function handleQuoteChange(e: React.ChangeEvent<HTMLInputElement>) {
				const { name, value } = e.target;
				setQuoteForm((prev) => ({ ...prev, [name]: value }));
			}
			function handleQuoteSubmit(e: React.FormEvent) {
				e.preventDefault();
				const base = 150;
				const price = base + Number(quoteForm.hours) * 100 + Number(quoteForm.passengers) * 5;
				setQuoteResult(`$${price} (est.)`);
			}
			function resetQuoteModal() {
				setQuoteForm({ city: "", zip: "", hours: 4, passengers: 10 });
				setQuoteResult(null);
			}

			// 1: Vehicle Capacity Finder
			const [vcfPassengers, setVcfPassengers] = useState(10);
			const [vcfResult, setVcfResult] = useState<string | null>(null);
			function handleVcfSubmit(e: React.FormEvent) {
				e.preventDefault();
				if (vcfPassengers <= 14) setVcfResult("Try a Sprinter or Limo (up to 14)");
				else if (vcfPassengers <= 24) setVcfResult("Mini Bus or Small Party Bus (15-24)");
				else if (vcfPassengers <= 40) setVcfResult("Large Party Bus or Coach (25-40)");
				else setVcfResult("Multiple vehicles or Coach Bus (40+)");
			}

			// 2: Cost Split Calculator
			const [splitTotal, setSplitTotal] = useState(1000);
			const [splitPeople, setSplitPeople] = useState(10);
			const [splitResult, setSplitResult] = useState<string | null>(null);
			function handleSplitSubmit(e: React.FormEvent) {
				e.preventDefault();
				if (splitPeople > 0) setSplitResult(`$${(splitTotal / splitPeople).toFixed(2)} per person`);
				else setSplitResult(null);
			}

			// 3: Date Price Checker
			const [date, setDate] = useState("");
			const [dateResult, setDateResult] = useState<string | null>(null);
			function handleDateSubmit(e: React.FormEvent) {
				e.preventDefault();
				if (date.match(/12-25|01-01/)) setDateResult("Holiday pricing: +20% (est.)");
				else setDateResult("Standard pricing applies");
			}

			// 4: Zip Code Price Lookup
			const [zip, setZip] = useState("");
			const [zipResult, setZipResult] = useState<string | null>(null);
			function handleZipSubmit(e: React.FormEvent) {
				e.preventDefault();
				if (zip.startsWith("9")) setZipResult("CA/West Coast pricing: $200/hr (est.)");
				else setZipResult("$150/hr (est.)");
			}

			// 5: Hourly vs. Flat Rate Tool
			const [hvfHours, setHvfHours] = useState(4);
			const [hvfFlat, setHvfFlat] = useState(700);
			const [hvfResult, setHvfResult] = useState<string | null>(null);
			function handleHvfSubmit(e: React.FormEvent) {
				e.preventDefault();
				const hourly = hvfHours * 180;
				setHvfResult(hourly < hvfFlat ? `Hourly ($${hourly}) is cheaper` : `Flat rate ($${hvfFlat}) is cheaper`);
			}

			// 6: Vehicle Comparison Tool
			const [vcType, setVcType] = useState("party");
			const [vcResult, setVcResult] = useState<string | null>(null);
			function handleVcSubmit(e: React.FormEvent) {
				e.preventDefault();
				if (vcType === "party") setVcResult("Party Bus: $200/hr, 20-40ppl");
				else if (vcType === "limo") setVcResult("Limo: $150/hr, 8-14ppl");
				else setVcResult("Coach: $250/hr, 40+ppl");
			}

			// 7: Fee & Tax Estimator
			const [feeBase, setFeeBase] = useState(1000);
			const [feeResult, setFeeResult] = useState<string | null>(null);
			function handleFeeSubmit(e: React.FormEvent) {
				e.preventDefault();
				setFeeResult(`Est. taxes/fees: $${(feeBase * 0.18).toFixed(2)}`);
			}

			// 8: Ask a Pricing Expert
			const [askMsg, setAskMsg] = useState("");
			const [askResult, setAskResult] = useState<string | null>(null);
			function handleAskSubmit(e: React.FormEvent) {
				e.preventDefault();
				setAskResult("Thank you! Our team will reply soon.");
			}

	const filteredFaq = useMemo(() => {
		const q = search.toLowerCase();
		return faqData.filter(
			(item) =>
				item.title.toLowerCase().includes(q) ||
				item.answer.toLowerCase().includes(q)
		);
	}, [search]);

	return (
		<>
			{/* ---------------------------- Hero / Header ---------------------------- */}
			<Section className="relative text-center !p-0 !py-0">
				<div className="relative flex flex-col items-center justify-center overflow-hidden w-full">
					<div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700/30 via-blue-900/10 to-black" />
					<div className="pt-16" />
					<h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif">
						Transparent Pricing
					</h1>
					<p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-blue-100 font-semibold">
						No hidden fees. No surprises. Just clear, all-inclusive rates for every trip.
					</p>
					<div className="flex flex-wrap gap-4 justify-center mb-14">
						<a
							href="/quote"
							className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition"
						>
							⚡ Get Instant Quote
						</a>
						<a
							href="/fleet"
							className="inline-block bg-white hover:bg-blue-50 text-blue-900 font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border-2 border-blue-100"
						>
							🚌 View Fleet
						</a>
						<a
							href="mailto:info@bus2ride.com"
							className="inline-block bg-white hover:bg-blue-50 text-blue-900 font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border-2 border-blue-100"
						>
							✉️ Contact Us
						</a>
					</div>
					<div className="pb-6" />
					<div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[120vw] h-40 bg-gradient-to-r from-blue-500/30 via-blue-500/20 to-blue-900/10 blur-2xl opacity-60" />
				</div>
			</Section>

			{/* ---------------------------- Stats (cards) ---------------------------- */}
			<Section className="max-w-6xl mx-auto bg-gradient-to-r from-white/5 via-blue-900/30 to-black/40 rounded-3xl shadow-xl my-12 py-10 px-6 border border-blue-500/30">
				<h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
					What Affects Your Price
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{statsData.map((stat, idx) => (
						<button
							key={stat.title}
							type="button"
							onClick={() => setModalIdx(idx)}
							className="text-left bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100 hover:shadow-2xl hover:-translate-y-1 transition"
						>
							<div className="text-4xl mb-2">{stat.icon}</div>
							<div className="text-blue-900 font-extrabold text-xl leading-tight">
								{stat.title}
							</div>
							<div className="text-blue-700 font-medium">{stat.subtitle}</div>
							<div className="mt-3 text-blue-600 font-semibold">Learn more →</div>
						</button>
					))}
				</div>
				<Modal
					open={modalIdx !== null}
					onClose={() => setModalIdx(null)}
					title={modalIdx !== null ? statsData[modalIdx].modalTitle : ""}
				>
					{modalIdx !== null ? statsData[modalIdx].modalContent : null}
				</Modal>
			</Section>

			{/* -------------------------- Pricing FAQ + Search ----------------------- */}
			<Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-500/30">
				<h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
					Pricing FAQ
				</h2>
				<div className="flex justify-center mb-8">
					<input
						type="text"
						placeholder="Search pricing questions…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full max-w-xl rounded-2xl px-4 py-3 bg-white text-blue-900 border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
					/>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-h-[640px] overflow-y-auto pr-1">
					{filteredFaq.map((item) => (
						<div
							key={item.title}
							className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100 hover:shadow-2xl transition"
						>
							<div className="flex items-center gap-4 mb-3">
								<img src={item.image} alt="" className="w-10 h-10" />
								<h3 className="text-blue-900 font-extrabold text-lg">{item.title}</h3>
							</div>
							<p className="text-blue-800">{item.answer}</p>
						</div>
					))}
				</div>
			</Section>

			{/* -------------------------------- Fun Polls ---------------------------- */}
			<Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-500/30">
				<h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
					Fun Polls
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
					{[
						{
							question: "What’s the most important factor in party bus pricing?",
							options: ["Group size", "Date/season", "Trip length", "Vehicle type"],
						},
						{ question: "Would you pay more for a newer party bus?", options: ["Yes", "No"] },
						{
							question: "How much extra would you pay for a party bus with a restroom?",
							options: ["$0", "$50", "$100", "$200+"],
						},
						{
							question: "What’s a fair hourly rate for a 20-passenger limo?",
							options: ["$100", "$150", "$200", "$250+"],
						},
						{
							question: "Would you split the cost of a party bus with friends?",
							options: ["Always", "Sometimes", "Never"],
						},
						{
							question: "Do you prefer all-inclusive pricing or itemized fees?",
							options: ["All-inclusive", "Itemized", "No preference"],
						},
						{
							question: "What’s the biggest pricing surprise you’ve seen?",
							options: ["Taxes/fees", "Gratuity", "Fuel surcharge", "Damage deposit"],
						},
						{ question: "Would you pay more for a party bus with a dance pole?", options: ["Yes", "No"] },
						{
							question: "How far in advance do you book to get the best price?",
							options: ["<1 week", "1-2 weeks", "3-4 weeks", "1+ month"],
						},
						{
							question: "What’s the best way to save on limo pricing?",
							options: ["Book early", "Go off-peak", "Share with friends", "Smaller vehicle"],
						},
						{
							question: "Would you pay extra for a party bus with a premium sound system?",
							options: ["Yes", "No"],
						},
						{
							question: "What’s a reasonable tip for a party bus driver?",
							options: ["10%", "15%", "20%", "Other"],
						},
						{ question: "Do you prefer to pay by the hour or by the trip?", options: ["Hour", "Trip", "Depends"] },
						{ question: "Would you pay more for a coach bus with Wi-Fi?", options: ["Yes", "No"] },
						{
							question: "What’s the most you’d pay for a 4-hour party bus rental?",
							options: ["$400", "$600", "$800", "$1000+"],
						},
						{ question: "Do you expect taxes/fees to be included in your quote?", options: ["Yes", "No"] },
						{ question: "Would you pay more for a limo with a stocked bar?", options: ["Yes", "No"] },
						{
							question: "What’s the best value: party bus, limo, or coach bus?",
							options: ["Party bus", "Limo", "Coach bus", "Depends"],
						},
					].map((poll, idx) => (
						<div key={idx} className="bg-blue-950/90 rounded-2xl shadow-xl border border-blue-500/20 p-6 flex flex-col items-center">
							<h3 className="text-xl font-bold text-blue-100 mb-2 text-center">{poll.question}</h3>
							<ul className="text-blue-200 mb-2 text-center">
								{poll.options.map((opt, i) => (
									<li key={i}>{opt}</li>
								))}
							</ul>
							<span className="text-blue-400 text-sm">
								Vote on our <a href="/polls" className="underline hover:text-blue-200">polls page</a>!
							</span>
						</div>
					))}
				</div>
				<div className="flex justify-center mt-10">
					<a
						href="/polls"
						className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition"
					>
						More Polls
					</a>
				</div>
			</Section>

			{/* --------------------------------- Tools -------------------------------- */}
					<Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-500/30">
						<h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
							Helpful Tools
						</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
									{/* Tool Cards */}
									{[
										{
											title: "⚡ Instant Quote Tool",
											desc: "Get a real-time quote for your trip in seconds. No obligation, no hidden fees.",
										},
										{
											title: "🚌 Vehicle Capacity Finder",
											desc: "Enter your group size and see which vehicles fit best.",
										},
										{
											title: "💸 Cost Split Calculator",
											desc: "Know your per-person cost instantly by entering the total and group size.",
										},
										{
											title: "📅 Date Price Checker",
											desc: "See how prices change by date, season, or holiday.",
										},
										{
											title: "📍 Zip Code Price Lookup",
											desc: "Find pricing for your city or zip code instantly.",
										},
										{
											title: "🕒 Hourly vs. Flat Rate Tool",
											desc: "Compare hourly and flat-rate pricing for your trip.",
										},
										{
											title: "🚐 Vehicle Comparison Tool",
											desc: "Compare prices and features for all vehicle types.",
										},
										{
											title: "🧾 Fee & Tax Estimator",
											desc: "Estimate taxes, fees, and gratuity for your booking.",
										},
										{
											title: "💬 Ask a Pricing Expert",
											desc: "Get personalized pricing help from our team.",
										},
																].map((tool, idx) => (
																	<button
																		key={tool.title}
																		type="button"
																		className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100 text-left hover:shadow-2xl hover:-translate-y-1 transition focus:outline-none"
																		onClick={() => openToolModal(idx)}
																		aria-label={`Open ${tool.title}`}
																	>
																		<h3 className="text-blue-900 font-extrabold text-lg mb-2 flex items-center gap-2">{tool.title}</h3>
																		<p className="text-blue-800 mb-3">{tool.desc}</p>
																		<span className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded-2xl shadow transition mt-2">Try Now</span>
																	</button>
																))}
						</div>
								<div className="flex justify-center">
									<a
										href="/tools"
										className="inline-block bg-white hover:bg-blue-50 text-blue-900 font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border-2 border-blue-100"
									>
										See All Tools
									</a>
								</div>

										{/* Tool Modals */}
										{activeTool === 0 && (
											<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
												<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative border-2 border-blue-400/30">
													<button onClick={() => setActiveTool(null)} className="absolute top-3 right-3 text-blue-900 hover:text-blue-700 text-2xl font-bold focus:outline-none" aria-label="Close">×</button>
													<h3 className="text-2xl font-extrabold mb-4 text-blue-900 font-serif tracking-tight">Instant Quote Tool</h3>
													<form onSubmit={handleQuoteSubmit} className="space-y-4">
														<div><label className="block text-blue-900 font-bold mb-1">City</label><input type="text" name="city" value={quoteForm.city} onChange={handleQuoteChange} className="w-full rounded-lg border border-blue-300 px-3 py-2" placeholder="Enter city" /></div>
														<div><label className="block text-blue-900 font-bold mb-1">Zip Code</label><input type="text" name="zip" value={quoteForm.zip} onChange={handleQuoteChange} className="w-full rounded-lg border border-blue-300 px-3 py-2" placeholder="Enter zip code" /></div>
														<div><label className="block text-blue-900 font-bold mb-1">Hours</label><input type="number" name="hours" min="1" max="24" value={quoteForm.hours} onChange={handleQuoteChange} className="w-full rounded-lg border border-blue-300 px-3 py-2" /></div>
														<div><label className="block text-blue-900 font-bold mb-1">Passengers</label><input type="number" name="passengers" min="1" max="100" value={quoteForm.passengers} onChange={handleQuoteChange} className="w-full rounded-lg border border-blue-300 px-3 py-2" /></div>
														<button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow transition mt-2">Get Quote</button>
													</form>
													{quoteResult && (<div className="mt-6 text-center"><div className="text-2xl font-bold text-blue-900">Estimated Price: {quoteResult}</div><div className="text-blue-700 mt-2">(This is a demo. For a real quote, use our full tool!)</div></div>)}
												</div>
											</div>
										)}
										{activeTool === 1 && (
											<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
												<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative border-2 border-blue-400/30">
													<button onClick={() => setActiveTool(null)} className="absolute top-3 right-3 text-blue-900 hover:text-blue-700 text-2xl font-bold focus:outline-none" aria-label="Close">×</button>
													<h3 className="text-2xl font-extrabold mb-4 text-blue-900 font-serif tracking-tight">Vehicle Capacity Finder</h3>
													<form onSubmit={handleVcfSubmit} className="space-y-4">
														<div><label className="block text-blue-900 font-bold mb-1">Passengers</label><input type="number" min="1" max="100" value={vcfPassengers} onChange={e => setVcfPassengers(Number(e.target.value))} className="w-full rounded-lg border border-blue-300 px-3 py-2" /></div>
														<button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow transition mt-2">Find Vehicle</button>
													</form>
													{vcfResult && (<div className="mt-6 text-center text-blue-900 font-bold">{vcfResult}</div>)}
												</div>
											</div>
										)}
										{activeTool === 2 && (
											<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
												<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative border-2 border-blue-400/30">
													<button onClick={() => setActiveTool(null)} className="absolute top-3 right-3 text-blue-900 hover:text-blue-700 text-2xl font-bold focus:outline-none" aria-label="Close">×</button>
													<h3 className="text-2xl font-extrabold mb-4 text-blue-900 font-serif tracking-tight">Cost Split Calculator</h3>
													<form onSubmit={handleSplitSubmit} className="space-y-4">
														<div><label className="block text-blue-900 font-bold mb-1">Total Price</label><input type="number" min="1" value={splitTotal} onChange={e => setSplitTotal(Number(e.target.value))} className="w-full rounded-lg border border-blue-300 px-3 py-2" /></div>
														<div><label className="block text-blue-900 font-bold mb-1">People</label><input type="number" min="1" value={splitPeople} onChange={e => setSplitPeople(Number(e.target.value))} className="w-full rounded-lg border border-blue-300 px-3 py-2" /></div>
														<button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow transition mt-2">Calculate</button>
													</form>
													{splitResult && (<div className="mt-6 text-center text-blue-900 font-bold">{splitResult}</div>)}
												</div>
											</div>
										)}
										{activeTool === 3 && (
											<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
												<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative border-2 border-blue-400/30">
													<button onClick={() => setActiveTool(null)} className="absolute top-3 right-3 text-blue-900 hover:text-blue-700 text-2xl font-bold focus:outline-none" aria-label="Close">×</button>
													<h3 className="text-2xl font-extrabold mb-4 text-blue-900 font-serif tracking-tight">Date Price Checker</h3>
													<form onSubmit={handleDateSubmit} className="space-y-4">
														<div><label className="block text-blue-900 font-bold mb-1">Date (MM-DD)</label><input type="text" value={date} onChange={e => setDate(e.target.value)} className="w-full rounded-lg border border-blue-300 px-3 py-2" placeholder="e.g. 12-25" /></div>
														<button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow transition mt-2">Check</button>
													</form>
													{dateResult && (<div className="mt-6 text-center text-blue-900 font-bold">{dateResult}</div>)}
												</div>
											</div>
										)}
										{activeTool === 4 && (
											<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
												<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative border-2 border-blue-400/30">
													<button onClick={() => setActiveTool(null)} className="absolute top-3 right-3 text-blue-900 hover:text-blue-700 text-2xl font-bold focus:outline-none" aria-label="Close">×</button>
													<h3 className="text-2xl font-extrabold mb-4 text-blue-900 font-serif tracking-tight">Zip Code Price Lookup</h3>
													<form onSubmit={handleZipSubmit} className="space-y-4">
														<div><label className="block text-blue-900 font-bold mb-1">Zip Code</label><input type="text" value={zip} onChange={e => setZip(e.target.value)} className="w-full rounded-lg border border-blue-300 px-3 py-2" /></div>
														<button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow transition mt-2">Lookup</button>
													</form>
													{zipResult && (<div className="mt-6 text-center text-blue-900 font-bold">{zipResult}</div>)}
												</div>
											</div>
										)}
										{activeTool === 5 && (
											<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
												<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative border-2 border-blue-400/30">
													<button onClick={() => setActiveTool(null)} className="absolute top-3 right-3 text-blue-900 hover:text-blue-700 text-2xl font-bold focus:outline-none" aria-label="Close">×</button>
													<h3 className="text-2xl font-extrabold mb-4 text-blue-900 font-serif tracking-tight">Hourly vs. Flat Rate Tool</h3>
													<form onSubmit={handleHvfSubmit} className="space-y-4">
														<div><label className="block text-blue-900 font-bold mb-1">Hours</label><input type="number" min="1" max="24" value={hvfHours} onChange={e => setHvfHours(Number(e.target.value))} className="w-full rounded-lg border border-blue-300 px-3 py-2" /></div>
														<div><label className="block text-blue-900 font-bold mb-1">Flat Rate ($)</label><input type="number" min="1" value={hvfFlat} onChange={e => setHvfFlat(Number(e.target.value))} className="w-full rounded-lg border border-blue-300 px-3 py-2" /></div>
														<button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow transition mt-2">Compare</button>
													</form>
													{hvfResult && (<div className="mt-6 text-center text-blue-900 font-bold">{hvfResult}</div>)}
												</div>
											</div>
										)}
										{activeTool === 6 && (
											<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
												<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative border-2 border-blue-400/30">
													<button onClick={() => setActiveTool(null)} className="absolute top-3 right-3 text-blue-900 hover:text-blue-700 text-2xl font-bold focus:outline-none" aria-label="Close">×</button>
													<h3 className="text-2xl font-extrabold mb-4 text-blue-900 font-serif tracking-tight">Vehicle Comparison Tool</h3>
													<form onSubmit={handleVcSubmit} className="space-y-4">
														<div><label className="block text-blue-900 font-bold mb-1">Type</label><select value={vcType} onChange={e => setVcType(e.target.value)} className="w-full rounded-lg border border-blue-300 px-3 py-2"><option value="party">Party Bus</option><option value="limo">Limo</option><option value="coach">Coach Bus</option></select></div>
														<button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow transition mt-2">Compare</button>
													</form>
													{vcResult && (<div className="mt-6 text-center text-blue-900 font-bold">{vcResult}</div>)}
												</div>
											</div>
										)}
										{activeTool === 7 && (
											<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
												<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative border-2 border-blue-400/30">
													<button onClick={() => setActiveTool(null)} className="absolute top-3 right-3 text-blue-900 hover:text-blue-700 text-2xl font-bold focus:outline-none" aria-label="Close">×</button>
													<h3 className="text-2xl font-extrabold mb-4 text-blue-900 font-serif tracking-tight">Fee & Tax Estimator</h3>
													<form onSubmit={handleFeeSubmit} className="space-y-4">
														<div><label className="block text-blue-900 font-bold mb-1">Base Price</label><input type="number" min="1" value={feeBase} onChange={e => setFeeBase(Number(e.target.value))} className="w-full rounded-lg border border-blue-300 px-3 py-2" /></div>
														<button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow transition mt-2">Estimate</button>
													</form>
													{feeResult && (<div className="mt-6 text-center text-blue-900 font-bold">{feeResult}</div>)}
												</div>
											</div>
										)}
										{activeTool === 8 && (
											<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
												<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative border-2 border-blue-400/30">
													<button onClick={() => setActiveTool(null)} className="absolute top-3 right-3 text-blue-900 hover:text-blue-700 text-2xl font-bold focus:outline-none" aria-label="Close">×</button>
													<h3 className="text-2xl font-extrabold mb-4 text-blue-900 font-serif tracking-tight">Ask a Pricing Expert</h3>
													<form onSubmit={handleAskSubmit} className="space-y-4">
														<div><label className="block text-blue-900 font-bold mb-1">Your Question</label><textarea value={askMsg} onChange={e => setAskMsg(e.target.value)} className="w-full rounded-lg border border-blue-300 px-3 py-2" rows={3} placeholder="Type your question..." /></div>
														<button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow transition mt-2">Send</button>
													</form>
													{askResult && (<div className="mt-6 text-center text-blue-900 font-bold">{askResult}</div>)}
												</div>
											</div>
										)}
			</Section>

			{/* ------------------------------- Reviews ------------------------------- */}
			<Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-500/30">
				<h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
					Customer Reviews
				</h2>
				<div className="text-center text-blue-100 text-lg">
					{/* TODO: Insert reviews component or static reviews here */}
					<p>⭐⭐⭐⭐⭐ “Best party bus experience ever! Transparent pricing and amazing service.”</p>
					<p>⭐⭐⭐⭐⭐ “Super easy to book, and the quote was exactly what we paid.”</p>
					<p>⭐⭐⭐⭐⭐ “Driver was professional, bus was spotless, and the price was right.”</p>
				</div>
				<div className="flex justify-center mt-8">
					<a
						href="/reviews"
						className="inline-block bg-white hover:bg-blue-50 text-blue-900 font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border-2 border-blue-100"
					>
						More Reviews
					</a>
				</div>
			</Section>
		</>
	);
}
