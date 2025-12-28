import { Clock, Bell, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComingSoonPlaceholderProps {
  title?: string;
  description?: string;
  feature?: string;
  expectedDate?: string;
  variant?: "inline" | "card" | "banner";
  className?: string;
}

export function ComingSoonPlaceholder({
  title = "Coming Soon",
  description = "We're working on something special for you.",
  feature,
  expectedDate,
  variant = "card",
  className,
}: ComingSoonPlaceholderProps) {
  if (variant === "inline") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full",
          "bg-amber-500/10 border border-amber-500/30",
          className
        )}
      >
        <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
        <span className="text-sm font-medium text-amber-300">{title}</span>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl p-6",
          "bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10",
          "border border-amber-500/20",
          className
        )}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1MSwyMDcsNzQsMC4xKSIvPjwvc3ZnPg==')] opacity-50" />
        
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h4 className="font-bold text-white">{feature || title}</h4>
              <p className="text-sm text-amber-200/70">{description}</p>
            </div>
          </div>
          
          {expectedDate && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-300">
                Expected: {expectedDate}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl p-8 md:p-10",
        "bg-gradient-to-br from-[#0f1f45]/80 to-[#0a152d]/80",
        "border border-white/10 backdrop-blur-sm",
        "shadow-[0_25px_80px_rgba(0,0,0,0.3)]",
        className
      )}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center mb-6">
          <Bell className="w-10 h-10 text-amber-400" />
        </div>

        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
          {title}
        </h3>
        
        {feature && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-300">{feature}</span>
          </div>
        )}

        <p className="text-white/60 max-w-md leading-relaxed mb-6">
          {description}
        </p>

        {expectedDate && (
          <div className="flex items-center gap-2 text-sm text-white/40">
            <Clock className="w-4 h-4" />
            <span>Expected launch: {expectedDate}</span>
          </div>
        )}

        <div className="mt-8 flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-[#0a152d] flex items-center justify-center text-[10px] font-bold text-white"
              >
                {i}K
              </div>
            ))}
          </div>
          <span className="text-sm text-white/50">
            Join 3,000+ others waiting
          </span>
        </div>
      </div>
    </div>
  );
}
