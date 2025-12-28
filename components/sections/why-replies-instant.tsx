"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Zap,
  Route,
  Car,
  FileText,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  Shield,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const WORKFLOW_CARDS = [
  {
    id: "route",
    badge: "LIVE ROUTE INTELLIGENCE",
    title: "Smart Route Planning",
    description: "We sanity-check pickup/drop routes for traffic patterns and staging constraints.",
    icon: Route,
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    iconColor: "bg-blue-500/20 text-blue-400",
    modalContent: {
      title: "Live Route Intelligence",
      description: "Our dispatch team uses real-time data to ensure your itinerary works in real life.",
      details: [
        { icon: MapPin, label: "Traffic Pattern Analysis", text: "We factor in time of day, events, and construction to plan realistic routes." },
        { icon: Clock, label: "Staging Constraints", text: "Venue pickup zones, parking restrictions, and timing are all considered upfront." },
        { icon: Route, label: "Multi-Stop Optimization", text: "Complex routes with multiple pickups are optimized for efficiency and timing." },
        { icon: CheckCircle2, label: "Real-Time Adjustments", text: "Drivers receive live updates if conditions change on event day." },
      ],
    },
  },
  {
    id: "vehicle",
    badge: "VEHICLE READINESS",
    title: "Perfect Match Guarantee",
    description: "We match the right vehicle class for your headcount and event expectations.",
    icon: Car,
    color: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
    iconColor: "bg-purple-500/20 text-purple-400",
    modalContent: {
      title: "Vehicle Readiness System",
      description: "We confirm availability and match the perfect vehicle before sending your quote.",
      details: [
        { icon: Users, label: "Capacity Matching", text: "Your group size determines the perfect vehicle class for comfort and safety." },
        { icon: Car, label: "Availability Confirmed", text: "We only quote vehicles that are actually available for your date and time." },
        { icon: Shield, label: "Inspection Verified", text: "All vehicles pass our 50-point inspection before your event." },
        { icon: CheckCircle2, label: "Backup Planning", text: "We maintain backup vehicles to handle any last-minute issues." },
      ],
    },
  },
  {
    id: "docs",
    badge: "DOCS + DETAILS",
    title: "Centralized Updates",
    description: "Route changes, venue notes, and timing tweaks stay consistent in one place.",
    icon: FileText,
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
    iconColor: "bg-amber-500/20 text-amber-400",
    modalContent: {
      title: "Documentation & Details",
      description: "Once your plan is set, everything stays organized and accessible.",
      details: [
        { icon: FileText, label: "Single Source of Truth", text: "All booking details, changes, and notes live in one centralized system." },
        { icon: Clock, label: "Real-Time Sync", text: "Updates you make are instantly visible to your driver and our dispatch team." },
        { icon: Shield, label: "Confirmation Records", text: "You receive written confirmation of all details before your event." },
        { icon: CheckCircle2, label: "Post-Event Support", text: "Receipts and records are available immediately after your trip." },
      ],
    },
  },
];

export function WhyRepliesInstantSection() {
  const [selectedCard, setSelectedCard] = useState<typeof WORKFLOW_CARDS[0] | null>(null);

  return (
    <>
      <section className="py-16 md:py-20 bg-gradient-to-b from-[#0d1d3a] to-[#0a1628]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-10 max-w-3xl space-y-4 text-center">
            <Badge
              variant="outline"
              className="mx-auto border-blue-500/30 bg-blue-500/10 text-blue-300"
            >
              WORKFLOW
            </Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Why our replies feel instant
            </h2>
            <p className="text-lg text-white/70">
              Dispatch + concierge share the same context, so your quote doesn&apos;t bounce between inboxes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {WORKFLOW_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <Card
                  key={card.id}
                  onClick={() => setSelectedCard(card)}
                  className={cn(
                    "group cursor-pointer rounded-2xl p-6 border transition-all duration-300",
                    "bg-gradient-to-br backdrop-blur-sm",
                    card.color,
                    "hover:scale-[1.03] hover:shadow-[0_25px_80px_rgba(0,0,0,0.4)]"
                  )}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", card.iconColor)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-white/60 text-sm mb-4">{card.description}</p>
                  <div className="flex items-center gap-1 text-sm font-medium text-blue-300 group-hover:text-blue-200 transition-colors">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30">
              <Zap className="w-5 h-5 text-green-400" />
              <span className="text-green-300 font-medium">Average quote turnaround: Under 3 minutes</span>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        {selectedCard && (
          <DialogContent className="max-w-lg bg-gradient-to-b from-[#0d1d3a] to-[#0a1628] border-white/10 text-white">
            <DialogHeader>
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4", selectedCard.iconColor)}>
                <selectedCard.icon className="w-7 h-7" />
              </div>
              <DialogTitle className="text-2xl font-extrabold text-white">
                {selectedCard.modalContent.title}
              </DialogTitle>
              <DialogDescription className="text-white/70 text-base">
                {selectedCard.modalContent.description}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              {selectedCard.modalContent.details.map((detail, idx) => {
                const DetailIcon = detail.icon;
                return (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                      <DetailIcon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">{detail.label}</div>
                      <div className="text-white/60 text-sm mt-0.5">{detail.text}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6">
              <Button
                onClick={() => setSelectedCard(null)}
                className="w-full font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
              >
                Got It
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
