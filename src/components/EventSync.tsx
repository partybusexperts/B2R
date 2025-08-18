import React, { useState } from "react";

function pad(n: number) { return n < 10 ? `0${n}` : n; }
function toDateTimeLocal(dt: Date) {
  return `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}

function toICS({ title, description, location, start, end }: any) {
  // start/end: ISO string
  return `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${title}\nDESCRIPTION:${description}\nLOCATION:${location}\nDTSTART:${start.replace(/[-:]/g,"").slice(0,15)}Z\nDTEND:${end.replace(/[-:]/g,"").slice(0,15)}Z\nEND:VEVENT\nEND:VCALENDAR`;
}

export default function EventSync() {
  const [title, setTitle] = useState("Bus2Ride Trip");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState(toDateTimeLocal(new Date(Date.now() + 86400000)));
  const [end, setEnd] = useState(toDateTimeLocal(new Date(Date.now() + 90000000)));
  const [showLinks, setShowLinks] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowLinks(true);
  }

  function getICSBlob() {
    const ics = toICS({ title, description, location, start: new Date(start).toISOString(), end: new Date(end).toISOString() });
    return new Blob([ics.replace(/\\n/g, "\r\n")], { type: "text/calendar" });
  }

  function googleCalUrl() {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      details: description,
      location,
      dates: `${new Date(start).toISOString().replace(/[-:]/g,"").slice(0,15)}Z/${new Date(end).toISOString().replace(/[-:]/g,"").slice(0,15)}Z`,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow p-4 border border-blue-200 text-[15px]">
      <h2 className="text-lg md:text-xl font-bold mb-2 text-blue-900">Event Sync: Add to Calendar</h2>
      <form className="flex flex-col gap-2 mb-3" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1">
            <label className="block text-xs font-bold text-blue-800 mb-1">Event Title</label>
            <input className="input text-sm px-2 py-1 w-full" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-blue-800 mb-1">Location</label>
            <input className="input text-sm px-2 py-1 w-full" value={location} onChange={e => setLocation(e.target.value)} placeholder="Pickup/dropoff address" />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1">
            <label className="block text-xs font-bold text-blue-800 mb-1">Start</label>
            <input className="input text-sm px-2 py-1 w-full" type="datetime-local" value={start} onChange={e => setStart(e.target.value)} required />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-blue-800 mb-1">End</label>
            <input className="input text-sm px-2 py-1 w-full" type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} required />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-blue-800 mb-1">Notes</label>
          <textarea className="input text-sm px-2 py-1 w-full" value={description} onChange={e => setDescription(e.target.value)} placeholder="Driver name, vehicle, special instructions, etc." rows={2} />
        </div>
        <button type="submit" className="btn bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded shadow text-sm mt-2">Generate Calendar Links</button>
      </form>
      {showLinks && (
        <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-3">
          <div className="font-bold text-blue-900 mb-2">Add to your calendar:</div>
          <div className="flex flex-col md:flex-row gap-2">
            <a href={googleCalUrl()} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded shadow text-center">Google Calendar</a>
            <a href={URL.createObjectURL(getICSBlob())} download="bus2ride-event.ics" className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded shadow text-center">Download .ics (Apple/Outlook)</a>
          </div>
          <div className="text-xs text-blue-700 mt-2">Works with Google, Apple, Outlook, and most calendar apps.</div>
        </div>
      )}
    </div>
  );
}
