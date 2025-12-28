import Link from "next/link";
import { 
  ArrowUpRight, 
  ArrowRight, 
  ExternalLink,
  BookOpen,
  FileText,
  MapPin,
  Calendar,
  HelpCircle,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

export type InternalLink = {
  href: string;
  label: string;
  description?: string;
  category?: "fleet" | "events" | "locations" | "resources" | "tools";
};

export type ExternalLink = {
  href: string;
  label: string;
  source?: string;
};

interface LinkConstellationProps {
  internalLinks?: InternalLink[];
  externalLinks?: ExternalLink[];
  title?: string;
  className?: string;
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  fleet: Sparkles,
  events: Calendar,
  locations: MapPin,
  resources: BookOpen,
  tools: FileText,
  default: HelpCircle,
};

export function LinkConstellation({
  internalLinks = [],
  externalLinks = [],
  title = "Explore More",
  className,
}: LinkConstellationProps) {
  if (!internalLinks.length && !externalLinks.length) return null;

  return (
    <section
      className={cn(
        "relative py-16 overflow-hidden",
        "bg-gradient-to-br from-[#0a1628]/50 to-[#060e23]/50",
        className
      )}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-white font-serif">
            {title}
          </h3>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {internalLinks.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <ArrowRight className="w-5 h-5 text-blue-400" />
                <h4 className="text-sm font-bold tracking-[0.15em] uppercase text-blue-300">
                  Related Pages
                </h4>
              </div>

              <div className="space-y-3">
                {internalLinks.map((link, idx) => {
                  const Icon = CATEGORY_ICONS[link.category || "default"];
                  return (
                    <Link
                      key={idx}
                      href={link.href}
                      className={cn(
                        "group flex items-center gap-4 p-4 rounded-xl",
                        "bg-white/5 border border-white/10",
                        "hover:bg-white/10 hover:border-blue-500/40 transition-all"
                      )}
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white group-hover:text-blue-300 transition">
                          {link.label}
                        </div>
                        {link.description && (
                          <div className="text-sm text-white/50 truncate">
                            {link.description}
                          </div>
                        )}
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-blue-400 transition" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {externalLinks.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <ExternalLink className="w-5 h-5 text-purple-400" />
                <h4 className="text-sm font-bold tracking-[0.15em] uppercase text-purple-300">
                  Trusted Resources
                </h4>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <ul className="space-y-3">
                  {externalLinks.map((link, idx) => (
                    <li key={idx}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 text-white/70 hover:text-purple-300 transition"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500/50 group-hover:bg-purple-400 transition" />
                        <span className="flex-1">{link.label}</span>
                        {link.source && (
                          <span className="text-xs text-white/40 hidden sm:inline">
                            {link.source}
                          </span>
                        )}
                        <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition" />
                      </a>
                    </li>
                  ))}
                </ul>

                <p className="mt-4 pt-4 border-t border-white/10 text-xs text-white/40">
                  External links open in a new tab. We are not responsible for third-party content.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
