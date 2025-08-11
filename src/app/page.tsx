// src/app/page.tsx
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import MainContent from '../components/MainContent';
import ContactForm from '../components/ContactForm';

export default function Home() {
  return (
    <>
      {/* Navigation */}
      <Navigation />

      {/* Hero */}
      <Header />

      {/* Main content + form */}
      <section className="mx-auto my-5 max-w-[1200px] flex">
        <MainContent />
        <ContactForm />
      </section>
    </>
  );
}
