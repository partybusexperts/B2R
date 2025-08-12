// src/components/Navigation.tsx

export default function Navigation() {
  return (
    <nav className="bg-blue-700 text-white py-4 shadow">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <span className="font-bold text-lg tracking-wide">Bus2Ride</span>
        <ul className="flex gap-6 text-sm md:text-base font-medium">
          <li><a href="/" className="hover:text-blue-200 transition">Home</a></li>
          <li><a href="#" className="hover:text-blue-200 transition">Fleet</a></li>
          <li><a href="#" className="hover:text-blue-200 transition">Services</a></li>
          <li><a href="#" className="hover:text-blue-200 transition">Pricing</a></li>
          <li><a href="/locations" className="hover:text-blue-200 transition">Locations</a></li>
          <li><a href="/polls" className="hover:text-blue-200 transition">Polls and Data</a></li>
          <li><a href="/tools" className="hover:text-blue-200 transition">Tools</a></li>
          <li><a href="/contact" className="hover:text-blue-200 transition">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}
