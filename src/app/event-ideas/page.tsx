import { FaGlassCheers, FaMusic, FaSkiing, FaBirthdayCake, FaGraduationCap, FaHeart, FaUserFriends, FaBeer, FaPlane, FaGift, FaStar, FaBus, FaCocktail, FaGuitar, FaBriefcase, FaChild, FaUmbrellaBeach, FaCalendarAlt } from 'react-icons/fa';
import Link from 'next/link';

const eventIdeas = [
  { icon: FaGlassCheers, title: 'Haunted House Tours', link: '#', desc: 'Spooky fun for all ages—let us drive you to the best haunted houses in style.' },
  { icon: FaGift, title: 'Thanksgiving Parties', link: '#', desc: 'Gather your friends and family for a memorable Thanksgiving celebration on wheels.' },
  { icon: FaStar, title: 'Christmas Parties', link: '#', desc: 'Holiday lights, music, and cheer—make your Christmas party unforgettable.' },
  { icon: FaSkiing, title: 'Ski Resort Tours', link: '#', desc: 'Hit the slopes with your group and leave the driving to us.' },
  { icon: FaMusic, title: 'New Year’s Eve', link: '#', desc: 'Ring in the new year with a safe, festive ride to your celebration.' },
  { icon: FaUserFriends, title: 'Sporting Events', link: '#', desc: 'Tailgate in style and avoid parking hassles at your favorite games.' },
  { icon: FaHeart, title: 'Weddings', link: '#', desc: 'Arrive in luxury and keep your wedding party together all day.' },
  { icon: FaGraduationCap, title: 'Prom', link: '#', desc: 'Make prom night magical and safe for everyone.' },
  { icon: FaGraduationCap, title: 'Graduation Celebrations', link: '#', desc: 'Celebrate your achievement with a group ride to your party.' },
  { icon: FaMusic, title: 'Concerts / Events', link: '#', desc: 'No need to worry about parking or traffic—just enjoy the show.' },
  { icon: FaUserFriends, title: 'Bachelor Parties', link: '#', desc: 'The ultimate night out for the groom and friends.' },
  { icon: FaUserFriends, title: 'Bachelorette Parties', link: '#', desc: 'Celebrate the bride-to-be with a fun, safe group ride.' },
  { icon: FaBeer, title: 'Brewery Tours', link: '#', desc: 'Sample the best local brews without a designated driver.' },
  { icon: FaGuitar, title: 'Red Rocks Concerts', link: '#', desc: 'Experience legendary shows with group transport to Red Rocks.' },
  { icon: FaCocktail, title: 'Girl’s Night Out', link: '#', desc: 'Plan a glamorous night out with your best friends.' },
  { icon: FaUserFriends, title: 'Guys Night Out', link: '#', desc: 'Hit the town with the crew and leave the driving to us.' },
  { icon: FaUmbrellaBeach, title: 'Retirement Celebrations', link: '#', desc: 'Celebrate new beginnings with a group adventure.' },
  { icon: FaStar, title: 'Blackhawk Casinos', link: '#', desc: 'Try your luck and travel in comfort to the casino.' },
  { icon: FaBriefcase, title: 'Corporate Parties', link: '#', desc: 'Impress your team and clients with luxury group transport.' },
  { icon: FaBirthdayCake, title: 'Birthday Parties', link: '#', desc: 'Make your birthday extra special with a party bus or limo.' },
  { icon: FaChild, title: 'Kid’s Parties', link: '#', desc: 'Safe, fun, and memorable rides for children’s celebrations.' },
  { icon: FaBus, title: 'Entertainment Tours', link: '#', desc: 'See the sights and enjoy the ride with your group.' },
  { icon: FaBus, title: 'Charter Services', link: '#', desc: 'Custom group travel for any occasion.' },
  { icon: FaPlane, title: 'Airport Shuttle', link: '#', desc: 'Stress-free airport transfers for your group.' },
  { icon: FaBirthdayCake, title: 'Quinceañera Parties', link: '#', desc: 'Celebrate this milestone with a luxury ride.' },
  { icon: FaHeart, title: 'Anniversary Celebrations', link: '#', desc: 'Mark your special day with a memorable group outing.' },
  { icon: FaStar, title: 'Special Dinners Out', link: '#', desc: 'Arrive in style for your next big dinner or celebration.' },
];

const ctas = [
  {
    title: 'Ready to Get Started?',
    desc: 'Call us at 888-535-2566 or text to book your party bus or limo! We can accommodate any event idea you have.',
    button: { text: 'Book Now', href: '/contact' },
  },
  {
    title: 'Need Inspiration?',
    desc: 'Not seeing your event? We can help you plan a custom experience for any occasion—just ask!',
    button: { text: 'Get a Custom Quote', href: '/contact' },
  },
  {
    title: 'Why Choose Bus2Ride?',
    desc: 'We offer safe, reliable, and fun group transportation for every event. Our team is here to make your experience unforgettable!',
    button: { text: 'See Our Reviews', href: '/reviews' },
  },
];

export default function EventIdeasPage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      <h1 className="text-5xl font-extrabold mb-8 text-blue-800 text-center drop-shadow-lg tracking-tight flex items-center justify-center gap-4">
        <FaCalendarAlt className="inline-block text-blue-400 text-4xl mb-1" />
        Event Ideas
      </h1>
      <p className="mb-14 text-center text-lg text-gray-700 max-w-2xl mx-auto font-medium">
        Explore creative event ideas for your next party bus or limo adventure. We handle the driving—so you can focus on the fun!
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {eventIdeas.map((event, idx) => {
          const Icon = event.icon;
          // Insert a CTA after every 6 events
          const ctaIdx = Math.floor(idx / 6);
          return (
            <>
              <div
                key={event.title}
                className="relative group bg-white/90 rounded-2xl shadow-xl p-7 flex flex-col border border-blue-100 hover:scale-[1.025] hover:shadow-2xl transition-all duration-200 overflow-hidden min-h-[280px]"
              >
                <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" alt="Event" className="rounded-lg shadow mb-4 w-full h-32 object-cover" />
                <div className="absolute -top-4 -right-4 opacity-10 text-[6rem] pointer-events-none select-none">
                  <Icon />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="text-blue-400 text-2xl" />
                  <h2 className="text-lg font-bold text-blue-700 tracking-wide">{event.title}</h2>
                </div>
                <p className="text-gray-700 mb-3 font-medium flex-1">{event.desc}</p>
                <Link href={event.link} className="text-blue-600 underline hover:text-blue-800 text-sm font-semibold mt-auto">Learn More</Link>
              </div>
              {/* Insert CTA after every 6 events */}
              {(idx + 1) % 6 === 0 && ctas[ctaIdx] && (
                <div className="col-span-full bg-blue-100/80 rounded-xl shadow-lg p-8 flex flex-col items-center my-4 border border-blue-200">
                  <h3 className="text-2xl font-bold text-blue-800 mb-2">{ctas[ctaIdx].title}</h3>
                  <p className="text-gray-700 mb-4 text-center max-w-xl">{ctas[ctaIdx].desc}</p>
                  <Link href={ctas[ctaIdx].button.href} className="bg-blue-600 text-white px-6 py-2 rounded font-semibold shadow hover:bg-blue-700 transition">{ctas[ctaIdx].button.text}</Link>
                </div>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
}
