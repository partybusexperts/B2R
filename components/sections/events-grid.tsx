import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EventCard } from "./events-card";
import { capitalize, shuffle } from "@/lib/utils";
import { getEvents } from "@/lib/data/events";
import { Calendar, ArrowRight, Zap, TrendingUp } from "lucide-react";

interface EventsGridProps {
  category?: string;
  excludeSlug?: string;
  title?: string;
  subtitle?: string;
}

export async function EventsGrid({ category, excludeSlug, title, subtitle }: EventsGridProps) {
  const events = await getEvents();

  if (!events) return null;

  const filteredEvents = excludeSlug 
    ? events.filter(e => e.slug !== excludeSlug)
    : events;
  const displayEvents = shuffle(filteredEvents).slice(0, 6);

  return (
    <section className="relative py-16 md:py-24 w-full overflow-hidden bg-[#0a1628]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08),transparent_60%)]" />
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-20 w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[120px] animate-float" />
        <div className="absolute bottom-20 -right-20 w-[350px] h-[350px] rounded-full bg-blue-600/10 blur-[100px] animate-float" style={{ animationDelay: "3s" }} />
      </div>
      
      <div className="relative w-full max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 mb-4">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                {category ? `${capitalize(category)} Events` : "Event Inspiration"}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {title || "Popular Events We Book"}
            </h2>
            <p className="mt-3 text-base text-white/60 max-w-xl">
              {subtitle || "From milestone celebrations to corporate gatherings, we've got the perfect ride"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs font-medium text-white/70">{events.length}+ event types</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-white/70">Trending picks</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayEvents.map((event, idx) => (
            <div 
              key={event.id}
              className="animate-fade-up"
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <EventCard event={event} index={idx} />
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            asChild
            className="group inline-flex items-center gap-2 rounded-full px-8 py-6 text-base font-bold
              bg-gradient-to-r from-purple-600 to-indigo-600 text-white
              shadow-[0_10px_40px_rgba(139,92,246,0.3)]
              hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(139,92,246,0.4)]
              transition-all duration-300"
          >
            <Link href="/events">
              Explore All Events
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
