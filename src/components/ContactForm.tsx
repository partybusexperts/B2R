// src/components/ContactForm.tsx

export default function ContactForm() {
  return (
    <div id="contact" className="flex-1 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Request a Free Quote</h2>
      <form className="flex flex-col gap-4">
        <input placeholder="Name" className="border p-3 rounded" />
        <input placeholder="Email" className="border p-3 rounded" />
        <input placeholder="Event Type" className="border p-3 rounded" />
        <button className="bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 transition">Submit</button>
      </form>
    </div>
  );
}
