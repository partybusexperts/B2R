"use client";


import React, { useState } from "react";


const features = [
  { text: "Experienced, friendly reservation team", id: "reservation-team" },
  { text: "Easy online quotes & booking", id: "online-quotes" },
  { text: "Huge selection of vehicles for any group size", id: "vehicle-selection" },
  { text: "1,000,000+ passengers served nationwide", id: "passengers-served" },
  { text: "365-day customer support", id: "customer-support" },
];

const featureContent: Record<string, string> = {
  "reservation-team": `Our reservation team is the backbone of Bus2Ride’s commitment to customer satisfaction. With years of experience in the group transportation industry, our friendly staff is trained to handle every detail of your booking, from the first quote to the final drop-off. We understand that every trip is unique, and our team takes the time to listen to your needs, answer your questions, and offer expert advice on the best vehicle and itinerary for your group. Whether you’re planning a wedding, corporate event, or a night out, our reservation specialists are available to guide you through the process, ensuring a seamless and stress-free experience. We pride ourselves on our responsiveness, attention to detail, and genuine care for our customers. Our team is not just here to take your order—they’re here to make your event a success. With Bus2Ride, you’ll always have a knowledgeable, friendly professional ready to help, making sure your journey starts and ends with a smile.`,
  "online-quotes": `Booking your group transportation has never been easier thanks to Bus2Ride’s streamlined online quote and booking system. In just a few clicks, you can enter your trip details, compare vehicle options, and receive an instant, transparent quote—no hidden fees or surprises. Our user-friendly platform is designed to save you time and eliminate guesswork, allowing you to customize your trip, select amenities, and even reserve your vehicle online. Need to make changes or have special requests? Our system makes it simple to update your booking or connect with a reservation expert for personalized assistance. Whether you’re planning months in advance or need a last-minute ride, our online tools put you in control. Experience the convenience of modern booking with Bus2Ride and see why thousands of customers trust us for their transportation needs.`,
  "vehicle-selection": `At Bus2Ride, we offer one of the largest and most diverse fleets in the industry, ensuring you’ll find the perfect vehicle for any group size or occasion. From sleek limousines and party buses to spacious coach buses and executive vans, our selection is unmatched. Each vehicle is meticulously maintained, cleaned, and inspected for safety and comfort. Whether you’re transporting a small group for a night out or a large party for a wedding or corporate event, we have options to fit your needs and budget. Our reservation team will help you choose the right vehicle, taking into account your group size, preferences, and any special requirements. With Bus2Ride, you never have to compromise on style, comfort, or amenities. Enjoy features like plush seating, premium sound systems, lighting, and more—all designed to make your ride memorable.`,
  "passengers-served": `With over 1,000,000 passengers served nationwide, Bus2Ride has earned a reputation for reliability, safety, and exceptional service. Our experience spans countless events, from weddings and proms to corporate outings and sporting events. Each trip is an opportunity to deliver a five-star experience, and our team is dedicated to exceeding your expectations. We’ve built lasting relationships with customers across the country, many of whom return year after year for their transportation needs. Our extensive network allows us to serve groups in cities large and small, always with the same commitment to quality. When you choose Bus2Ride, you’re joining a community of satisfied riders who trust us to deliver on our promises.`,
  "customer-support": `Our commitment to you doesn’t end when you book your ride. Bus2Ride offers 365-day customer support, so you’re never alone if questions or issues arise. Our support team is available by phone, email, or chat to assist with anything you need—before, during, or after your trip. Whether you need to update your reservation, request special accommodations, or get help on the day of your event, we’re here for you. Our goal is to provide peace of mind and ensure your experience is smooth from start to finish. With Bus2Ride, help is always just a call or click away, every day of the year.`,
};


export default function WhyRentWithUs() {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleOpen = (id: string) => setOpenId(id);
  const handleClose = () => setOpenId(null);

  return (
    <>
      <ul className="space-y-4 text-blue-900 text-lg">
        {features.map((feature, idx) => (
          <li
            key={idx}
            className="flex items-center bg-white rounded-lg shadow px-4 py-3 hover:bg-blue-50 transition border border-blue-200 cursor-pointer"
          >
            <span className="text-blue-500 text-xl mr-2">★</span>
            <button
              type="button"
              className="flex-1 text-left hover:underline focus:underline outline-none bg-transparent border-none p-0 m-0 cursor-pointer"
              tabIndex={0}
              onClick={() => handleOpen(feature.id)}
              onKeyPress={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleOpen(feature.id);
                }
              }}
              aria-label={feature.text}
            >
              {feature.text}
            </button>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {openId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-blue-700 text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-4 text-blue-900">{features.find(f => f.id === openId)?.text}</h3>
            <div className="text-gray-800 text-base leading-relaxed whitespace-pre-line" style={{ maxHeight: 400, overflowY: 'auto' }}>
              {featureContent[openId]}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
