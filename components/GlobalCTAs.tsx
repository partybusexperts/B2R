"use client";

import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InstantQuoteButton } from "./InstantQuoteButton";
import { cn } from "@/lib/utils";

interface GlobalCTAsProps {
  source?: string;
  className?: string;
  variant?: "default" | "compact" | "banner";
}

export function GlobalCTAs({ 
  source = "Website", 
  className,
  variant = "default"
}: GlobalCTAsProps) {
  if (variant === "banner") {
    return (
      <section className={cn(
        "relative py-8 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600",
        className
      )}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]" />
        <div className="relative max-w-5xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold text-white mb-1">Ready to Book Your Ride?</h3>
              <p className="text-white/80 text-sm">Get a free quote in seconds</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <InstantQuoteButton source={source} variant="pulse" />
              <Button
                variant="outline"
                className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20"
                asChild
              >
                <a href="tel:8885352566">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("flex flex-wrap items-center justify-center gap-3", className)}>
        <InstantQuoteButton source={source} size="sm" />
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10"
          asChild
        >
          <a href="tel:8885352566">
            <Phone className="w-3 h-3 mr-1.5" />
            Call
          </a>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10"
          asChild
        >
          <a href="mailto:info@bus2ride.com">
            <MessageCircle className="w-3 h-3 mr-1.5" />
            Email
          </a>
        </Button>
      </div>
    );
  }

  return (
    <section className={cn(
      "relative py-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
      "border-y border-white/10",
      className
    )}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Ready to Party on Wheels?
        </h3>
        <p className="text-white/60 mb-6 max-w-xl mx-auto">
          Get an instant quote for your event. Our team is available 24/7 to help plan your perfect ride.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <InstantQuoteButton source={source} size="lg" variant="pulse" />
          <Button
            variant="outline"
            size="lg"
            className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 px-8"
            asChild
          >
            <a href="tel:8885352566">
              <Phone className="w-5 h-5 mr-2" />
              Call 888-535-2566
            </a>
          </Button>
        </div>
        <p className="text-white/40 text-sm mt-4">
          Free quotes • No obligation • 24/7 support
        </p>
      </div>
    </section>
  );
}
