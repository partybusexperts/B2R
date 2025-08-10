import Head from 'next/head';
import Script from 'next/script';
import { useEffect, useRef } from 'react';

export default function Home() {
  const countdownRef = useRef(null);

  const estimateCost = () => {
    const hours = parseInt(document.getElementById('hours').value) || 0;
    const group = parseInt(document.getElementById('group').value) || 0;
    if (hours < 1 || group < 1) {
      document.getElementById('estimate-result').innerText = 'Please enter valid hours and group size.';
      return;
    }
    const baseLow = 150;
    const baseHigh = 250;
    const perHourLow = 80;
    const perHourHigh = 120;
    const perPersonLow = 5;
    const perPersonHigh = 15;
    const lowEstimate = baseLow + (hours * perHourLow) + (group * perPersonLow);
    const highEstimate = baseHigh + (hours * perHourHigh) + (group * perPersonHigh);
    document.getElementById('estimate-result').innerText = `Estimated bus rental cost: $${lowEstimate} - $${highEstimate} (contact for exact quote)`;
  };

  const recommendBus = () => {
    const group = parseInt(document.getElementById('group-size').value) || 0;
    let recommendation = '';
    if (group < 1) {
      recommendation = 'Please enter a valid group size.';
    } else if (group <= 10) {
      recommendation = 'We recommend a small bus (up to 10 passengers) for your group.';
    } else if (group <= 20) {
      recommendation = 'We recommend a medium bus (10-20 passengers) for your group.';
    } else if (group <= 40) {
      recommendation = 'We recommend a large bus (20-40 passengers) for your group.';
    } else {
      recommendation = 'For groups larger than 40, contact us for custom options!';
    }
    document.getElementById('bus-recommendation').innerText = recommendation;
  };

  const smartQuote = () => {
    const capacity = parseInt(document.getElementById('capacity').value) || 0;
    const city = document.getElementById('city').value;
    const hours = parseInt(document.getElementById('smart-hours').value) || 0;
    const eventType = document.getElementById('event-type').value;
    const date = new Date(document.getElementById('date').value);
    if (capacity < 1 || hours < 1) {
      document.getElementById('smart-quote-result').innerText = 'Please enter valid capacity and hours.';
      return;
    }
    let base = 200;
    if (eventType === 'prom') base += 100;
    if (date.getDay() === 6) base += 50;
    if (hours < 4 && date.getDay() === 6) hours = 4;
    const estimate = base + (hours * 100) + (capacity * 10);
    document.getElementById('smart-quote-result').innerText = `Estimated cost for ${eventType} in ${city}: $${estimate} (adjusted for details)`;
  };

  const checkAvailability = () => {
    const date = document.getElementById('avail-date').value;
    const time = document.getElementById('avail-time').value;
    const randomAvail = Math.random() > 0.5 ? 'Available' : 'Low Availability - Book Soon!';
    document.getElementById('avail-result').innerText = `For ${date} at ${time}: ${randomAvail}`;
  };

  const planTheme = () => {
    const vibe = document.getElementById('vibe').value;
    let suggestion = '';
    switch (vibe) {
      case 'glam':
        suggestion = 'Recommend luxury limo with LED themes in gold, playlist of pop hits, local upscale stops.';
        break;
      case 'bachelor':
        suggestion = 'Recommend party bus with club lighting, playlist of hip-hop, bar stops.';
        break;
      case 'club':
        suggestion = 'Recommend large party bus with dance floor, EDM playlist, night club routes.';
        break;
      case 'teen':
        suggestion = 'Recommend fun bus with colorful lights, teen pop playlist, safe fun spots.';
        break;
      default:
        suggestion = '';
    }
    document.getElementById('theme-result').innerText = suggestion;
  };

  const exportQuote = () => {
    const quote = 'Your custom quote: $500 - Email sent, PDF generated, ID: QUOTE123';
    document.getElementById('export-result').innerText = quote;
  };

  const generateSplitLinks = () => {
    const total = parseInt(document.getElementById('total-cost').value) || 0;
    const num = parseInt(document.getElementById('num-people').value) || 1;
    if (total < 1 || num < 1) {
      document.getElementById('split-result').innerText = 'Please enter valid total cost and number of people.';
      return;
    }
    const perPerson = (total / num).toFixed(2);
    document.getElementById('split-result').innerText = `Each pays $${perPerson}. Links generated (simulated): link1, link2, ... (via Stripe)`;
  };

  const vote = (pollId) => {
    alert(`Thank you for voting in the ${pollId} poll! Results will be updated soon.`);
  };

  useEffect(() => {
    const elements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    elements.forEach(element => observer.observe(element));

    new Swiper('.swiper-container', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    });

    const promDate = new Date('May 1, 2026 00:00:00').getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = promDate - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      if (countdownRef.current) {
        countdownRef.current.innerText = `${days} days until prom season starts!`;
      }
    };
    updateCountdown();
    setInterval(updateCountdown, 86400000);
  }, []);

  return (
    <>
      <Head>
        <title>Prom Party Bus Rental Chester, SC | Bus2Ride</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Rent a luxury party bus for your prom in Chester, SC with Bus2Ride. Affordable rates, 24/7 service, and premium amenities for an unforgettable prom night." />
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
        <style jsx>{`
          .fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
          .fade-in.visible { opacity: 1; transform: translateY(0); }
          .swiper-container { width: 100%; max-width: 800px; margin: 0 auto; }
          .swiper-slide { display: flex; justify-content: center; }
        `}</style>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "When is prom season in Chester, SC?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Proms typically occur in mid-to-late May, before graduations on May 29, 2026, for schools like Chester High School."
              }
            },
            {
              "@type": "Question",
              "name": "What's the weather like for prom in Chester, SC?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "In April, expect highs of 74°F and lows of 51°F. In May, highs reach 82°F with lows around 60°F—perfect for evening events."
              }
            },
            {
              "@type": "Question",
              "name": "What are popular prom venues in Chester, SC?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Top spots include Lakeview Hall at Chester State Park, Chester Event Center, Gateway Conference Center, and The Venue at Knot Hill."
              }
            },
            {
              "@type": "Question",
              "name": "What are the top prom trends for 2026?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Trends include romantic styles with corset bodices and lace-up backs, bold colors like hot pinks and turquoise, asymmetrical designs, dramatic sleeves, and butter yellow dresses."
              }
            }
          ]
        }) }} />
      </Head>
      <Script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" strategy="afterInteractive" />
      <div className="bg-gray-50 font-sans antialiased">
        <header className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white py-4 sticky top-0 z-50 shadow-lg">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Bus2Ride</h1>
            <nav>
              <ul className="flex space-x-6">
                <li><a href="#home" className="hover:text-yellow-300 transition">Home</a></li>
                <li><a href="#about" className="hover:text-yellow-300 transition">About</a></li>
                <li><a href="#services" className="hover:text-yellow-300 transition">Services</a></li>
                <li><a href="#planning-guide" className="hover:text-yellow-300 transition">Prom Guide</a></li>
                <li><a href="#fun-ideas" className="hover:text-yellow-300 transition">Fun Ideas</a></li>
                <li><a href="#testimonials" className="hover:text-yellow-300 transition">Testimonials</a></li>
              </ul>
            </nav>
          </div>
        </header>
        <section id="home" className="relative bg-cover bg-center h-screen" style={{ backgroundImage: "url('https://via.placeholder.com/1920x1080?text=Chester+SC+Party+Bus')" }}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="container mx-auto px-4 h-full flex items-center justify-center text-center text-white">
            <div className="fade-in">
              <h2 className="text-5xl font-extrabold mb-4">Prom Party Bus Rental in Chester, SC</h2>
              <p className="text-xl mb-6">Make your prom night unforgettable with Bus2Ride's luxury party buses in Chester, SC. Arrive in style at local venues like the Chester County Community Center or nearby Rock Hill hotspots. 24/7 service, rapid response.</p>
              <a href="#planning-guide" className="bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition">Plan Your Prom</a>
            </div>
          </div>
        </section>
        <section id="about" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Why Choose Bus2Ride for Your Chester Prom</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <img src="https://via.placeholder.com/600x400?text=Party+Bus+Interior" alt="Luxury Party Bus Interior" className="w-full md:w-1/2 rounded-lg shadow-lg fade-in" />
              <div className="w-full md:w-1/2 fade-in">
                <p className="text-lg text-gray-700 mb-4">Bus2Ride brings top-tier party bus rentals to Chester, SC, with a focus on luxury, safety, and rapid response. Our experienced team ensures your prom night is seamless and memorable.</p>
                <p className="text-lg text-gray-700 mb-4">Our buses feature premium amenities like LED lighting, surround sound, and seating for 10-40. We provide 24/7 service across Chester County and nearby areas like Rock Hill and Lancaster.</p>
                <p className="text-lg text-gray-700">Whether you're heading to a prom venue in Chester or a larger event in nearby Columbia, our professional chauffeurs and fully insured vehicles get you there safely and in style.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Check Out Our Fleet</h2>
            <h3 className="text-3xl font-bold text-center mb-8">Party Buses</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                <img src="https://www.wrightpartybus.com/wp-content/uploads/2018/07/party-bus-interior-1.jpg" alt="Party Bus 1" className="w-full h-48 object-cover rounded mb-4" />
                <h4 className="text-xl font-semibold mb-2">Party Bus 1</h4>
                <p className="text-gray-600">Luxury party bus with LED lights and sound system, seats up to 20.</p>
              </div>
              {/* Add the other party buses similarly */}
            </div>
            {/* Limousines and Coach Buses sections similarly */}
          </div>
        </section>
        <section id="services" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Our Prom Party Bus Features</h2>
            <div className="swiper-container">
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition w-full max-w-sm">
                    <img src="https://via.placeholder.com/300x200?text=Luxury+Seating" alt="Luxury Seating" className="w-full h-48 object-cover rounded mb-4" />
                    <h3 className="text-2xl font-semibold mb-2">Spacious & Comfortable</h3>
                    <p className="text-gray-600">Accommodate 10-40 passengers with plush leather seats and ample room to dance and mingle.</p>
                  </div>
                </div>
                {/* Add other slides */}
              </div>
              <div className="swiper-pagination"></div>
              <div className="swiper-button-prev"></div>
              <div className="swiper-button-next"></div>
            </div>
          </div>
        </section>
        <section id="planning-guide" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Your Chester, SC Prom Planning Guide for 2026</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg shadow-lg fade-in">
                <h3 className="text-2xl font-semibold mb-4">Prom Dates & Season</h3>
                <p className="text-gray-600 mb-4">In Chester, SC, prom season typically runs from mid-April to late May, aligning with the end of the school year. For 2026, expect proms around mid-May, before graduations on May 29 for schools like Chester High School.</p>
                <p className="text-gray-600">Tip: Check your school's calendar for exact dates—last full day of school is May 21, 2026.</p>
                <div className="mt-4">
                  <h4 className="text-xl font-semibold mb-2">Countdown to Prom Season</h4>
                  <p className="text-center text-lg font-bold" ref={countdownRef}></p>
                </div>
              </div>
              {/* Add other grid items similarly */}
            </div>
            {/* Continue with tips, tools, etc. */}
            <section className="py-16 bg-white">
              <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12">Helpful Planning Tools</h2>
                <div className="space-y-12">
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="md:w-1/2">
                      <p className="text-lg text-gray-700">Get a smart quote tailored to your needs, adjusting for capacity, location, hours, event type, and more.</p>
                    </div>
                    <div className="md:w-1/2 bg-gray-50 p-6 rounded-lg shadow-lg">
                      <h3 className="text-2xl font-semibold mb-4 text-center">Smart Price Quoter</h3>
                      <form className="flex flex-col items-center">
                        <label className="mb-2">Capacity: <input type="number" id="capacity" min="1" className="border p-1" /></label>
                        <label className="mb-2">City: <input type="text" id="city" className="border p-1" defaultValue="Chester, SC" /></label>
                        <label className="mb-2">Hours: <input type="number" id="smart-hours" min="1" className="border p-1" /></label>
                        <label className="mb-2">Event Type: <select id="event-type" className="border p-1">
                          <option value="prom">Prom</option>
                          <option value="wedding">Wedding</option>
                          <option value="birthday">Birthday</option>
                        </select></label>
                        <label className="mb-2">Date: <input type="date" id="date" className="border p-1" /></label>
                        <button type="button" onClick={smartQuote} className="bg-blue-600 text-white px-4 py-2 rounded mt-2">Get Quote</button>
                      </form>
                      <p id="smart-quote-result" className="text-center mt-4"></p>
                    </div>
                  </div>
                  {/* Add other tools similarly, with onClick={correspondingFunction} */}
                </div>
              </div>
            </section>
        </section>
        {/* Add Tailored Services, Prom Polls, Testimonials, and Footer sections similarly, using onClick={vote('pollId')} for polls */}
        <section id="prom-polls" className="py-16 bg-white">
          {/* ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition fade-in">
              <h3 className="text-2xl font-semibold mb-4">Should the prom have a live band?</h3>
              <form className="flex flex-col items-start">
                <label className="mb-2"><input type="radio" name="live-band" value="yes" /> Yes</label>
                <label className="mb-2"><input type="radio" name="live-band" value="no" /> No</label>
                <button type="button" onClick={() => vote('live-band')} className="bg-blue-600 text-white px-4 py-2 rounded mt-2">Vote</button>
              </form>
              <p className="text-gray-600 mt-4">Results: Yes: 0 votes | No: 0 votes</p>
            </div>
            {/* Other polls */}
          </div>
          {/* ... */}
        </section>
        {/* Testimonials and Footer */}
      </div>
    </>
  );
}S