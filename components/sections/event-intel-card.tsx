import { cn } from "@/lib/utils";

interface EventIntelCardProps {
  type: "quick-facts" | "trivia" | "pro-tips";
  title: string;
  subtitle: string;
  items: {
    question?: string;
    answer?: string;
    text?: string;
  }[];
  className?: string;
}

const CARD_STYLES = {
  "quick-facts": {
    border: "border-blue-700/60",
    bg: "bg-[#07132b]",
    labelColor: "text-blue-300/80",
    bulletColor: "bg-emerald-400",
    itemColor: "text-blue-100/90",
  },
  "trivia": {
    border: "border-violet-700/60",
    bg: "bg-[#0b1030]",
    labelColor: "text-violet-300/80",
    bulletColor: "bg-violet-400",
    itemColor: "text-blue-100/90",
  },
  "pro-tips": {
    border: "border-emerald-600/60",
    bg: "bg-[#051a19]",
    labelColor: "text-emerald-300/80",
    bulletColor: "bg-emerald-400",
    itemColor: "text-emerald-100/90",
  },
};

const CARD_LABELS = {
  "quick-facts": "QUICK FACTS",
  "trivia": "TRIVIA CORNER",
  "pro-tips": "PRO TIPS & SAFETY",
};

export function EventIntelCard({ type, title, subtitle, items, className }: EventIntelCardProps) {
  const styles = CARD_STYLES[type];
  const label = CARD_LABELS[type];

  return (
    <div
      className={cn(
        "rounded-3xl border p-6 md:p-8 shadow-[0_20px_60px_rgba(3,7,18,0.45)]",
        styles.border,
        styles.bg,
        className
      )}
    >
      <p className={cn("text-xs uppercase tracking-[0.25em] mb-2", styles.labelColor)}>
        {label}
      </p>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-blue-200/60 mb-4">{subtitle}</p>

      {type === "trivia" ? (
        <div className="space-y-4 text-sm">
          {items.map((item, index) => (
            <div key={index}>
              <p className="font-semibold text-white/95 mb-1">{item.question}</p>
              <p className="text-blue-200/85">{item.answer}</p>
            </div>
          ))}
        </div>
      ) : (
        <ul className={cn("space-y-3 text-sm", styles.itemColor)}>
          {items.map((item, index) => (
            <li key={index} className="flex gap-3">
              <span
                className={cn(
                  "mt-1.5 h-[7px] w-[7px] flex-shrink-0",
                  type === "pro-tips" ? "rounded-sm" : "rounded-full",
                  styles.bulletColor
                )}
              />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
