import React from "react";

export default function AccessibilityGuide() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow p-4 border border-blue-200 text-[15px]">
      <h2 className="text-lg md:text-xl font-bold mb-2 text-blue-900">Accessibility Guide</h2>
      <p className="text-blue-800 mb-3">Find the right vehicle and plan a comfortable, accessible trip for everyone in your group.</p>
      <ul className="list-disc pl-5 mb-3 text-blue-900">
        <li className="mb-1"><b>Wheelchair Accessible Vehicles:</b> <br />
          <span className="text-blue-700">• Executive style Sprinter vans (forward-facing seats)</span><br />
          <span className="text-blue-700">• Shuttle buses</span><br />
          <span className="text-blue-700">• Coach buses (with space for wheelchair storage)</span>
        </li>
        <li className="mb-1"><b>Party Buses:</b> Wheelchairs can sometimes be accommodated, but must go in the main cabin and will take up several seats. This can lead to crowding—plan your group size accordingly.</li>
        <li className="mb-1"><b>Limousines:</b> Most traditional stretch limos are <span className="text-red-700 font-bold">not</span> wheelchair accessible.</li>
        <li className="mb-1"><b>Booking Tips:</b> Always mention accessibility needs when booking. Ask about ramps, lifts, and securement options. Not all vehicles are equipped—advance notice is required.</li>
        <li className="mb-1"><b>Service Animals:</b> All service animals are welcome in any vehicle.</li>
        <li className="mb-1"><b>Questions?</b> Call <a href="tel:8885352566" className="text-blue-700 underline">888-535-2566</a> or <a href="mailto:info@bus2ride.com" className="text-blue-700 underline">email us</a> for personalized help.</li>
      </ul>
      <div className="text-xs text-blue-700 mt-2">For more information, see the <a href="https://www.ada.gov/resources/transportation/" target="_blank" rel="noopener noreferrer" className="underline">ADA transportation guidelines</a>.</div>
    </div>
  );
}
