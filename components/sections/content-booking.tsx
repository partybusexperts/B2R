"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Phone,
  MessageSquareQuote,
  CalendarCheck,
  PartyPopper,
  ArrowRight,
} from "lucide-react";

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
    icon: <Phone className="h-8 w-8" />,
    shortDescription: "Click to continue",
    modalContent: (
      <div className="space-y-4 text-foreground/90">
        <p>
          Getting started is easy! Reach out to our team via phone, email, or
          our online contact form. We are available 24/7 to answer your
          questions and discuss your event needs.
        </p>
        <h4 className="font-semibold">Ways to reach us:</h4>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li>
            Call us at: <strong>(888) 535-2566</strong>
          </li>
          <li>
            Email: <strong>bookings@bus2ride.com</strong>
          </li>
          <li>Fill out our quick quote form on the website.</li>
        </ul>
      </div>
    ),
  },
  {
    id: "quote",
    title: "2. Get a Quote",
    icon: <MessageSquareQuote className="h-8 w-8" />,
    shortDescription: "Click to continue",
    modalContent: (
      <div className="space-y-4 text-foreground/90">
        <p>
          Based on your event details (date, time, group size, and vehicle
          preference), we will provide you with a transparent, no-obligation
          price quote.
        </p>
        <p>
          Our quotes include all fees, so there are no surprises later. We can
          also help you choose the perfect vehicle that fits your group and
          budget.
        </p>
      </div>
    ),
  },
  {
    id: "reserve",
    title: "3. Reserve Your Ride",
    icon: <CalendarCheck className="h-8 w-8" />,
    shortDescription: "Click to continue",
    modalContent: (
      <div className="space-y-4 text-foreground/90">
        <p>
          Ready to move forward? Secure your vehicle with a small deposit. This
          secures your reservation for your chosen date and time.
        </p>
        <p>
          We&apos;ll send you a confirmation email with all the booking details
          and a contract to review and sign electronically. The remaining
          balance will be due closer to your event date.
        </p>
      </div>
    ),
  },
  {
    id: "finalize",
    title: "4. Finalize & Ride",
    icon: <PartyPopper className="h-8 w-8" />,
    shortDescription: "Click to continue",
    modalContent: (
      <div className="space-y-4 text-foreground/90">
        <p>
          As your event approaches, we&apos;ll touch base to finalize any
          remaining details, such as specific pick-up/drop-off locations and
          your itinerary.
        </p>
        <p>
          On the day of your event, your professional chauffeur will arrive on
          time in a spotless vehicle, ready to provide a safe and fun experience
          for you and your group!
        </p>
      </div>
    ),
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
        `bg-primary/95 text-primary-foreground py-8 md:py-12 m-16
        rounded-[3rem]`,
        className,
      )}
    >
      <div className="container mx-auto px-4 md:px-12 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12">
          How the Bus2Ride Booking Process Works
        </h2>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
            lg:gap-8"
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
                className="sm:max-w-[500px] bg-card text-card-foreground
                  rounded-2xl"
              >
                <DialogHeader>
                  <DialogTitle
                    className="flex items-center gap-3 text-2xl text-primary"
                  >
                    <span
                      className="p-3 rounded-full bg-primary/10 text-primary"
                    >
                      {step.icon}
                    </span>
                    {step.title.substring(3)}{" "}
                    {/* Remove "1. " from title in modal */}
                  </DialogTitle>
                  <DialogDescription>
                    Details for step {step.title.charAt(0)} of the booking
                    process.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">{step.modalContent}</div>
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
    <button
      ref={ref}
      className={cn(
        "group flex flex-col items-center justify-center p-8 rounded-3xl",
        // Lighter, semi-transparent blue background for the cards
        "bg-primary-foreground/10 border border-white/5",
        // Hover effects: slightly lighter background, lift up, and shadow
        `transition-all duration-300 hover:bg-primary-foreground/15
        hover:-translate-y-1 hover:shadow-xl`,
        `text-center cursor-pointer outline-none focus-visible:ring-2
        focus-visible:ring-white/50`,
        className,
      )}
      {...props}
    >
      {/* Icon Container */}
      <div
        className="mb-6 p-4 rounded-full bg-white/10 text-white
          group-hover:bg-white/20 group-hover:scale-110 transition-all
          duration-300"
      >
        {step.icon}
      </div>
      {/* Title */}
      <h3 className="text-xl font-bold mb-3">{step.title}</h3>
      {/* "Click to continue" text with arrow */}
      <p
        className="text-sm text-primary-foreground/70 flex items-center
          justify-center gap-1 group-hover:text-white transition-colors"
      >
        {step.shortDescription}
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
        />
      </p>
    </button>
  );
});
BookingStepCard.displayName = "BookingStepCard";
