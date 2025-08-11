// src/components/ContactForm.tsx
export default function ContactForm() {
  return (
    <div className="w-2/5 p-4 bg-gray-50 border">
      <form className="flex flex-col gap-2">
        <input placeholder="Name" className="border p-2" />
        <button className="bg-blue-600 text-white p-2 rounded">Submit</button>
      </form>
    </div>
  );
}
