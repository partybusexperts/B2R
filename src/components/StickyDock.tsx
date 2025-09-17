"use client";
import { useEffect, useState } from "react";

export default function StickyDock() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className={`fixed inset-x-0 bottom-4 z-40 transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="mx-auto max-w-3xl flex gap-2 rounded-full bg-[#0f1f46]/90 backdrop-blur border border-blue-800/40 p-2 shadow-xl">
        <a
          href="/quote#instant"
          className="flex-1 rounded-full h-10 px-5 font-bold bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 inline-flex items-center justify-center active:translate-y-[1px]"
        >
          Instant Quote
        </a>
        <a
          href="tel:8885352566"
          className="flex-1 rounded-full h-10 px-5 font-bold bg-white text-blue-900 border border-blue-200 hover:bg-blue-50 inline-flex items-center justify-center active:translate-y-[1px]"
        >
          📞 (888) 535-2566
        </a>
        <a
          href="mailto:info@bus2ride.com"
          className="flex-1 rounded-full h-10 px-5 font-bold bg-blue-700 text-white border border-blue-700 hover:bg-blue-800 inline-flex items-center justify-center active:translate-y-[1px]"
        >
          Email
        </a>
      </div>
    </div>
  );
}
