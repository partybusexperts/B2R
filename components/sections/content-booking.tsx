"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
// import {
//   Phone,
//   MessageSquareQuote,
//   CalendarCheck,
//   PartyPopper,
//   ArrowRight,
// } from "lucide-react";

// Assuming you have a Dialog component, like from Shadcn UI.
// If you use a different library, adjust these imports.
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// --- Types ---
type BookingStep = {
  id: string;
  title: string;
  icon: React.ReactNode;
  shortDescription: string;
  modalContent: React.ReactNode;
};

// --- Data for the 4 Steps ---
const bookingSteps: BookingStep[] = [
  {
    id: "contact",
    title: "1. Contact Us",
    // icon: <Phone className="h-8 w-8" />,
    icon: "📞",
    shortDescription: "Click to continue →",
    modalContent:
      "Call or email our bookings team — we’re ready to help you plan the perfect trip.",
  },
  {
    id: "quote",
    title: "2. Get a Quote",
    // icon: <MessageSquareQuote className="h-8 w-8" />,
    icon: "💬",
    shortDescription: "Click to continue →",
    modalContent:
      "Request a written quote — our team reviews your trip details and replies with a confirmed price and available vehicles.",
  },
  {
    id: "reserve",
    title: "3. Reserve Your Ride",
    // icon: <CalendarCheck className="h-8 w-8" />,
    icon: "📝",
    shortDescription: "Click to continue →",
    modalContent:
      "Reserve a vehicle once you’ve chosen a quote — a small deposit secures the booking.",
  },
  {
    id: "finalize",
    title: "4. Finalize & Ride",
    // icon: <PartyPopper className="h-8 w-8" />,
    icon: "🎉",
    shortDescription: "Click to continue →",
    modalContent:
      "Final checks and day-of instructions so your trip goes smoothly.",
  },
];

// --- Main Component ---
export function BookingProcessSection({ className }: { className?: string }) {
  // State to track which modal is currently open
  const [openModalId, setOpenModalId] = React.useState<string | null>(null);

  return (
    <section
      className={cn(
        // Match the dark blue, highly rounded container from the image
        "max-w-7xl mx-auto px-4 md:px-6 my-12",
        className,
      )}
    >
      <div
        className="bg-[#122a56] border border-blue-800/30 rounded-3xl shadow-xl
          px-5 md:px-8 py-8"
      >
        <h2
          className="text-4xl md:text-5xl font-extrabold text-center text-white
            font-serif tracking-tight"
        >
          How the Bus2Ride Booking Process Works
        </h2>

        <div
          className="mt-8 flex flex-col md:flex-row gap-4 md:gap-6
            justify-between"
        >
          {bookingSteps.map((step) => (
            <Dialog
              key={step.id}
              open={openModalId === step.id}
              onOpenChange={(isOpen) => setOpenModalId(isOpen ? step.id : null)}
            >
              <DialogTrigger asChild>
                <BookingStepCard step={step} />
              </DialogTrigger>

              {/* Modal Content Structure */}
              <DialogContent
                className="bg-gradient-to-br from-[#13306a] to-[#0e2250] border
                  border-blue-800/40 rounded-2xl shadow-2xl"
              >
                <div
                  className="mx-auto w-14 h-14 rounded-full bg-blue-900/20
                    border border-blue-700/40 flex items-center justify-center
                    text-3xl mb-4"
                >
                  {step.icon}
                </div>
                <DialogHeader>
                  <DialogTitle
                    className="text-2xl font-extrabold text-white mb-2
                      font-serif tracking-tight"
                  >
                    ⭐️{step.title}
                  </DialogTitle>
                  <DialogDescription className="text-blue-100/90 text-md">
                    <p className="mb-3">{step.modalContent}</p>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Child Card Component ---
interface BookingStepCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  step: BookingStep;
}

// Using forwardRef is necessary for the component to work correctly as a DialogTrigger child
const BookingStepCard = React.forwardRef<
  HTMLButtonElement,
  BookingStepCardProps
>(({ step, className, ...props }, ref) => {
  return (
    <div className="relative flex-1">
      <button
        ref={ref}
        className={cn(
          `block cursor-pointer group bg-[#173264] border border-blue-800/40
          rounded-2xl px-5 py-6 text-center hover:border-blue-400/60
          hover:shadow-[0_0_0_2px_rgba(96,165,250,.25)] transition w-full
          items-center`,
          className,
        )}
        {...props}
      >
        {/* Icon Container */}
        <div className="text-2xl text-center">{step.icon}</div>
        {/* Title */}
        <h3 className="font-extrabold text-white mt-1">★{step.title}</h3>
        {/* "Click to continue" text with arrow */}
        <p
          className="mt-1 text-blue-200 text-sm opacity-90
            group-hover:opacity-100"
        >
          {step.shortDescription}
        </p>
      </button>
    </div>
  );
});
BookingStepCard.displayName = "BookingStepCard";
