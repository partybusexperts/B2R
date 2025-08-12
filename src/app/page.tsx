import Navigation   from '../components/Navigation';
import Header       from '../components/Header';
import MainContent  from '../components/MainContent';
import ContactForm  from '../components/ContactForm';


export default function Home() {
  return (
    <>
      <Navigation />
      <Header />
      <section className="mx-auto my-10 max-w-4xl px-4">
        <div className="flex flex-col md:flex-row gap-8 bg-gray-50 rounded-3xl shadow-xl p-8">
          <MainContent />
          <ContactForm />
        </div>
      </section>
    </>
  );
}
