"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export function PricingCalculator() {
  const [hours, setHours] = useState(4);
  const [guests, setGuests] = useState(20);

  // Fake logic for demo
  const estimatedPrice = hours * (guests > 30 ? 250 : 150);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="p-6 space-y-4">
        <h3 className="text-xl font-bold">Trip Details</h3>
        <div className="space-y-2">
          <Label>Duration (Hours)</Label>
          <Input
            type="number"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            min={3}
          />
        </div>
        <div className="space-y-2">
          <Label>Guest Count</Label>
          <Input
            type="number"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
          />
        </div>
      </Card>

      <Card
        className="p-6 bg-primary/5 border-primary/20 flex flex-col
          justify-center items-center text-center"
      >
        <h3 className="text-muted-foreground font-medium">Estimated Price</h3>
        <div className="text-5xl font-extrabold text-primary my-4">
          ${estimatedPrice}
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          *Estimates vary by date and vehicle availability.
        </p>
        <Button size="lg" className="w-full font-bold">
          Book This Price
        </Button>
      </Card>
    </div>
  );
}
