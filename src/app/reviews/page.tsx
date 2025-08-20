"use client";
import React from "react";

const reviews = [
  {
    name: "Paul P.",
    text: "Absolutely excellent! Great customer service! We changed drop off points several times and they were so accommodating. Gail in the office is top notch and on top of everything! The price was very good. The driver was so nice and professional. The limo looked pristine, inside and out. Use them, you wont regret it!! Used for my son's wedding on August 11."
  },
  {
    name: "Jessie A.",
    text: "The limo company that you need to call when u have an event .Prices and limos and party bus are like no other limo company ."
  },
  {
    name: "Dee C.",
    text: "Definitely lives up to their name! We used them for our bachelorette/bachelor parties and our wedding and will be using them again. They were absolutely great! Even let me extend an hour when I decided my bachelorette party was too much fun and I wasn't ready to go yet!! :) I would absolutely recommend them and do to everyone!!"
  },
  {
    name: "Halee H.",
    text: "The price is great, inside is very clean, driver was very friendly and accommodating! Will never use another company besides this one!"
  },
  {
    name: "Rachel L.",
    text: "We had the best time ever!! Darrius was our driver and he was so fun and amazing!! It was for our bachelor/bachelorette weekend and he made it so much fun!!! I would recommend them 100%!!!"
  },
  {
    name: "Becky B.",
    text: "Sonny can take your event to the next level with his beautiful limos and sedans making you feel like a movie star! Highly recommend his service!"
  },
  {
    name: "George S.",
    text: "Top of the line chauffer and limo service."
  },
  {
    name: "Teresa S.",
    text: "What a memorable night for our students at Faith Christian School prom. Rick was an excellent and safe driver, providing top notch customer service, and was prompt with timing. The owner was great to work with and has the best prices and customer service. We will definitely choose them for next year's prom. Amazing experience!"
  },
  {
    name: "Carleigh S.",
    text: "We have used them twice. One for a 16 year old birthday party and once just for transportation for a large group. Always on time. Drivers were wonderful. Will be using again in the future."
  },
  {
    name: "Lindsay J.",
    text: "Used for a wedding and very satisfied! Drivers were very communicative. Jerry was friendly and easy to work with. Would recommend."
  },
  {
    name: "Leah K.",
    text: "We rented a party bus for my daughter’s 10th birthday and I cannot say enough good things about our experience! Communicating with Jerry and our driver Jim was easy and direct. They kept me informed with arrival time and were prompt when I asked a last minute question. They accommodated all of our requests - made the party the BEST experience and party EVER! Our driver, Jim, was laid back, polite, and happily took the girls whenever they wanted to ride! This is THE BEST service ever and I would HIGHLY recommend using them. You talk directly to the owner and the price can not be beat!!! Thank you Accent for making all our 10th birthday dreams come true!!! You guys are the BEST!"
  },
  {
    name: "Angela F.",
    text: "We booked the party bus for prom. The driver was on time and friendly. The bus was clean and comfortable. The kids had a wonderful time and made great memories! I highly recommend them and will use them for future events."
  },
  {
    name: "Kaley H.",
    text: "We had the best evening last Saturday! Our driver was on time and courteous, delivered us to our destination both ways, and even got the things we left on the bus back to us."
  },
  {
    name: "Amanda P.",
    text: "Best limo company around ! Worth every dime ! Our driver, Mike, was sweet, easy going and a great driver! The limo was clean and updated ! Will use them from now on !!"
  },
  {
    name: "Chad M.",
    text: "Booked a party bus several months in advance and I was very impressed with the service we received! Jerry made the booking process very simple and fast!"
  }
];


export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-black text-white p-0 m-0">
      {/* Header Section (matches Events page) */}
      <div className="relative flex flex-col items-center justify-center text-center !p-0 !py-0 overflow-hidden w-full bg-gradient-to-br from-blue-900/80 via-blue-950/80 to-black/90">
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700/30 via-blue-900/10 to-black" />
        <div className="pt-16" />
        <h1 className="text-6xl md:text-8xl font-extrabold mb-10 drop-shadow-lg tracking-tight font-serif bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
          Customer Reviews
        </h1>
        <p className="text-3xl md:text-4xl max-w-4xl mx-auto mb-14 text-blue-100 font-medium">
          See what real customers say about their Bus2Ride experience. We pride ourselves on top-notch service, clean vehicles, and unforgettable events. Read our latest reviews below!
        </p>
        <div className="flex flex-row flex-wrap gap-4 justify-center items-center mb-14">
          <a
            href="/quote"
            className="rounded-full font-bold px-7 py-3 text-lg tracking-tight shadow-md transition border-2 flex items-center justify-center min-w-[170px] max-w-full text-center bg-white text-blue-900 border-blue-200 hover:bg-blue-100 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap overflow-hidden"
            style={{wordBreak: 'keep-all'}}
          >
            <span className="flex items-center gap-2 min-w-0">
              <span className="text-blue-700 text-xl">⚡</span>
              <span className="leading-tight text-blue-900 font-semibold truncate">Get Instant Quote</span>
            </span>
          </a>
          <a
            href="/fleet"
            className="rounded-full font-bold px-7 py-3 text-lg tracking-tight shadow-md transition border-2 flex items-center justify-center min-w-[170px] max-w-full text-center bg-blue-700 text-white border-blue-700 hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap overflow-hidden"
            style={{wordBreak: 'keep-all'}}
          >
            <span className="flex items-center gap-2 min-w-0">
              <span className="text-white text-xl">🚌</span>
              <span className="leading-tight text-white font-semibold truncate">View Fleet</span>
            </span>
          </a>
          <a
            href="mailto:info@bus2ride.com"
            className="rounded-full font-bold px-7 py-3 text-lg tracking-tight shadow-md transition border-2 flex items-center justify-center min-w-[170px] max-w-full text-center bg-white text-blue-900 border-blue-200 hover:bg-blue-100 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap overflow-hidden"
            style={{wordBreak: 'keep-all'}}
          >
            <span className="flex items-center gap-2 min-w-0">
              <span className="text-pink-500 text-xl">📞</span>
              <span className="leading-tight text-blue-900 font-semibold truncate">Contact Us</span>
            </span>
          </a>
        </div>
        <div className="pb-10" />
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[120vw] h-40 bg-gradient-to-r from-blue-500/30 via-blue-500/20 to-blue-900/10 blur-2xl opacity-60" />
      </div>

      {/* Reviews Grid Section */}
      <div className="w-full max-w-4xl mx-auto py-16 px-4">
        <div className="grid gap-8 md:grid-cols-2">
          {reviews.map((review, i) => (
            <div key={i} className="bg-white/10 border-2 border-blue-700/40 rounded-2xl shadow-xl p-6 flex flex-col gap-3 hover:scale-[1.025] transition-transform">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                  {review.name[0]}
                </div>
                <span className="font-bold text-blue-100 text-lg">{review.name}</span>
              </div>
              <div className="text-blue-50 text-base leading-relaxed">{review.text}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
