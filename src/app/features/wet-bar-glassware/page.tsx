import Link from "next/link";

export default function WetBarGlassware() {
	return (
		<section className="max-w-6xl mx-auto px-4 py-16">
			<h1 className="text-4xl font-bold text-blue-900 text-center mb-8">
				Wet Bar & Glassware Features
			</h1>
			<p className="text-center text-gray-700 mb-6">
				Enjoy premium wet bar services with glassware on select limousines and
				party buses.
			</p>
			<div className="text-center">
				<Link
					href="/quote"
					className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-lg shadow transition"
				>
					Get a Quote
				</Link>
			</div>
		</section>
	);
}

