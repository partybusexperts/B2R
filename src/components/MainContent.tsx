// src/components/MainContent.tsx

export default function MainContent() {
  const options = [
    'Luxury party buses, limos, and coaches for any group size',
    'Professional, friendly drivers',
    'Easy online booking and transparent pricing',
    'Perfect for weddings, proms, corporate events, and more',
  ];

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Why Choose Bus2Ride?</h2>
      <div className="overflow-x-auto">
        <ul className="flex space-x-4 text-gray-700">
          {options.map((option, idx) => (
            <li
              key={idx}
              className="flex items-center min-w-[260px] bg-white rounded-lg shadow px-4 py-3 cursor-pointer hover:bg-blue-50 transition border border-gray-200"
            >
              <span className="flex-1">{option}</span>
              <span className="ml-2 text-blue-600 text-lg">→</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
