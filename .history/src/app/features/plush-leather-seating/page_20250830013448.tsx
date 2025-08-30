import React from "react";
import { getFirst } from "../../../utils/optimizedImages";
import OptimizedImage from "../../../components/OptimizedImage";
import { SmartImage } from "../../../components/SmartImage";

export default function PlushLeatherSeatingPage() {
	const limoImg = getFirst("limousines");
	return (
		<main className="max-w-4xl mx-auto px-4 py-16">
			<h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-900">Plush Leather Seating</h1>
			<p className="text-lg text-gray-800 mb-4">Experience the ultimate in comfort and style with our plush leather seating. Perfect for any occasion, our luxury vehicles feature premium leather seats that make every ride memorable.</p>
			<ul className="list-disc pl-6 text-lg text-blue-900 space-y-2 mb-6">
				<li>Premium, soft-touch leather</li>
				<li>Easy to clean and maintain</li>
				<li>Spacious, ergonomic design</li>
				<li>Perfect for weddings, parties, and corporate events</li>
			</ul>
			{limoImg ? (
				<OptimizedImage entry={limoImg} alt="Plush Leather Seating" className="rounded-xl shadow-lg w-full max-w-xl mx-auto" />
				) : (
					<SmartImage src="/images/limousines/10 Passenger Lincoln Stretch Limo Interior.png" alt="Plush Leather Seating" className="rounded-xl shadow-lg w-full max-w-xl mx-auto" />
				)}
		</main>
	);
}
