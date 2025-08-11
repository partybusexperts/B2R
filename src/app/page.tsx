<!-- NEXTJS_PROJECT_START: Converted Next.js Project Structure -->

### app/page.js
```jsx
// PAGE_START: Homepage Entry Point
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import MainContent from '../components/MainContent';
import ContactForm from '../components/ContactForm';
// Add other components as needed for full structure (e.g., About, Fleet, etc.) based on truncated HTML

export default function Home() {
&nbsp;&nbsp;return (
&nbsp;&nbsp;&nbsp;&nbsp;<>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{/* NAVIGATION_SECTION_START: Site Navigation */}
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Navigation />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{/* NAVIGATION_SECTION_END */}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{/* HEADER_SECTION_START: Hero Header */}
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Header />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{/* HEADER_SECTION_END */}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{/* MAIN_SECTION_START: Content and Contact Form */}
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<section className="flex max-w-[1200px] mx-auto my-[20px]">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{/* LEFT_CONTENT_START: Descriptive Content */}
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<MainContent />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{/* LEFT_CONTENT_END */}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{/* RIGHT_FORM_START: Contact Form */}
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<ContactForm />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{/* RIGHT_FORM_END */}
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</section>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{/* MAIN_SECTION_END */}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{/* Additional sections like About, Fleet, Testimonials, Footer would go here if not truncated */}
&nbsp;&nbsp;&nbsp;&nbsp;</>
&nbsp;&nbsp;);
}
// PAGE_END
```

### components/Navigation.js
```jsx
// NAVIGATION_COMPONENT_START: Navigation Bar Component
export default function Navigation() {
&nbsp;&nbsp;return (
&nbsp;&nbsp;&nbsp;&nbsp;<nav className="bg-blue-700 text-white py-4">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div className="container mx-auto px-4 flex justify-between items-center">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h1 className="text-2xl font-bold">Bus2Ride</h1>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<ul className="flex space-x-6">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<li><a href="#home" className="hover:text-yellow-300">Home</a></li>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<li><a href="#about" className="hover:text-yellow-300">About</a></li>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<li><a href="#services" className="hover:text-yellow-300">Services</a></li>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<li><a href="#fleet" className="hover:text-yellow-300">Fleet</a></li>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<li><a href="#planning-guide" className="hover:text-yellow-300">Event Guide</a></li>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<li><a href="#testimonials" className="hover:text-yellow-300">Testimonials</a></li>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</ul>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
&nbsp;&nbsp;&nbsp;&nbsp;</nav>
&nbsp;&nbsp;);
}
// NAVIGATION_COMPONENT_END
```

### components/Header.js
```jsx
// HEADER_COMPONENT_START: Header Component
'use client'; // Mark as client component for any interactivity if needed

export default function Header() {
&nbsp;&nbsp;return (
&nbsp;&nbsp;&nbsp;&nbsp;<header id="home" className="relative h-[100vh] bg-cover bg-center text-white [text-shadow:1px_1px_3px_rgba(0,0,0,0.6)]" style={{backgroundImage: "url('https://media.istockphoto.com/id/1355169228/photo/shot-of-the-inside-of-an-empty-party-bus-at-night.jpg?s=1024x1024&w=is&k=20&c=1y0n4rPqbv4y0uP0C3uU8m5C6v8p9s5J7nJ6i2pT3A=')"}}>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.4)] to-[rgba(0,0,0,0.6)]"></div>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center max-w-[80%]">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h1 className="m-0 text-[4em] font-bold tracking-[1px]">Bus2Ride Party Bus Rentals</h1>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<p className="text-[1.8em] mb-[20px]">Your Premier Choice for Luxury Party Bus Rentals, Limos, and Coach Buses for Any Occasion. Call Us Today: (123) 456-7890</p>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#contact" className="inline-block px-[24px] py-[12px] rounded-[50px] font-bold transition-all duration-300 bg-[#FFD700] text-black hover:bg-[#FFC700]">FREE QUOTE</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="tel:1234567890" className="inline-block px-[24px] py-[12px] rounded-[50px] font-bold transition-all duration-300 bg-[#007BFF] text-white ml-[15px] hover:bg-[#0056b3]">Call Us Now</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
&nbsp;&nbsp;&nbsp;&nbsp;</header>
&nbsp;&nbsp;);
}
// HEADER_COMPONENT_END
```

### components/MainContent.js
```jsx
// MAIN_CONTENT_COMPONENT_START: Left Content Component
export default function MainContent() {
&nbsp;&nbsp;return (
&nbsp;&nbsp;&nbsp;&nbsp;<div className="p-[20px] box-border w-[60%]">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h2 className="text-[2em] font-bold mb-[10px]">Your Ultimate Party Bus Experience</h2>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<p className="mb-[10px]">Welcome to Bus2Ride, your premier choice for party bus rentals that elevate any event. Our party buses are equipped with vibrant neon lighting, state-of-the-art sound systems, and plush wrap-around leather seating, perfect for birthdays, bachelor/bachelorette parties, weddings, or a night out on the town. Searching for "party bus rental near me"? We’ve got you covered with safe, stylish, and unforgettable transportation.</p>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<p className="mb-[10px]">Beyond party buses, we offer limo rentals for sophisticated outings and coach bus rentals for group travel or corporate events. All our vehicles are maintained to the highest standards for comfort and reliability. Our focus on party bus rentals ensures a tailored experience with customizable options to match your event’s vibe.</p>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<p>Book with Bus2Ride for top-quality party bus, limo, and coach bus rentals. Contact us now to get a personalized quote and make your next event extraordinary!</p>
&nbsp;&nbsp;&nbsp;&nbsp;</div>
&nbsp;&nbsp;);
}
// MAIN_CONTENT_COMPONENT_END
```

### components/ContactForm.js
```jsx
// CONTACT_FORM_COMPONENT_START: Right Contact Form Component
export default function ContactForm() {
&nbsp;&nbsp;return (
&nbsp;&nbsp;&nbsp;&nbsp;<div className="p-[20px] box-border w-[40%] bg-[#f8f8f8] border-l border-[#ddd]" id="contact">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h2 className="text-[2em] font-bold mb-[10px]">Contact Us</h2>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<form action="#" method="post" className="flex flex-col">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label htmlFor="name" className="mt-[10px]">Name:</label>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" id="name" name="name" required className="mt-[5px] p-[10px] border border-[#ccc] rounded-[4px]" />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label htmlFor="email" className="mt-[10px]">Email:</label>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="email" id="email" name="email" required className="mt-[5px] p-[10px] border border-[#ccc] rounded-[4px]" />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label htmlFor="phone" className="mt-[10px]">Phone:</label>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="tel" id="phone" name="phone" required className="mt-[5px] p-[10px] border border-[#ccc] rounded-[4px]" />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label htmlFor="date" className="mt-[10px]">Event Date:</label>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="date" id="date" name="date" className="mt-[5px] p-[10px] border border-[#ccc] rounded-[4px]" />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label htmlFor="message" className="mt-[10px]">Message:</label>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<textarea id="message" name="message" rows="5" required className="mt-[5px] p-[10px] border border-[#ccc] rounded-[4px]"></textarea>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="submit" value="Submit" className="mt-[15px] bg-[#007BFF] text-white border-none cursor-pointer p-[10px] rounded-[4px] hover:bg-[#0056b3]" />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</form>
&nbsp;&nbsp;&nbsp;&nbsp;</div>
&nbsp;&nbsp;);
}
// CONTACT_FORM_COMPONENT_END
```

### app/globals.css
```css
/* GLOBAL_STYLES_START: Global CSS (Tailwind is already included via CDN in HTML, but in Next.js, configure tailwind.config.js accordingly) */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Additional custom styles from original HTML can be added here if not covered by Tailwind */
body {
&nbsp;&nbsp;font-family: Arial, sans-serif;
&nbsp;&nbsp;margin: 0;
&nbsp;&nbsp;padding: 0;
}
/* GLOBAL_STYLES_END */
```

### Notes on Conversion
- **Structure**: The HTML is broken into reusable React components for Next.js. The main page is `app/page.js` using Next.js 13+ App Router.
- **Tailwind CSS**: Kept via CDN for simplicity, but in a real project, install Tailwind and configure it.
- **Truncated Parts**: The provided HTML is truncated, so I focused on the visible sections. For full sections like Fleet, About, etc., add corresponding components as in previous conversions.
- **Scripts**: The original has JavaScript functions (e.g., estimateCost, recommendBus) and Cloudflare scripts. These can be moved to a client-side component or use Next.js Script tag. For now, omitted as truncated, but add a Scripts component if needed.
- **Phone Number**: Kept as (123) 456-7890 from the provided HTML; make clickable in multiple places if required.
- **Setup**: Create a Next.js project with `npx create-next-app@latest`, replace files accordingly, and run `npm run dev`.

<!-- NEXTJS_PROJECT_END -->