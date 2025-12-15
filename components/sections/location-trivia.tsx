import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { LocationTrivia } from "@/lib/data/locations";

export function LocationTriviaSection({
  trivia,
  city,
}: {
  trivia: LocationTrivia[];
  city: string;
}) {
  if (!trivia?.length) return null;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2
            className="text-3xl md:text-4xl font-extrabold tracking-tight
              text-foreground"
          >
            Did You Know? <span className="text-primary">{city} Edition</span>
          </h2>
          <p className="text-lg text-muted-foreground mt-4">
            Fun facts to drop while you roll through town.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trivia.map((item, idx) => (
            <Card
              key={idx}
              className="border-2 border-border/50 hover:border-primary/50
                transition-all duration-300 hover:-translate-y-1 bg-card"
            >
              <CardHeader
                className="pb-2 flex flex-row items-center gap-4 space-y-0"
              >
                <div
                  className="h-12 w-12 rounded-full bg-primary/10 text-primary
                    flex items-center justify-center shrink-0"
                >
                  <DynamicIcon
                    name={(item.icon ?? "info") as IconName}
                    className="h-6 w-6"
                  />
                </div>
                <CardTitle className="text-lg font-bold leading-tight">
                  {item.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className="text-muted-foreground font-medium text-base
                    md:text-lg"
                >
                  {item.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* <div
          className="mt-12 rounded-3xl border border-border/60 bg-muted/20 p-8"
        >
          <h3 className="text-2xl font-extrabold mb-2">Ideas to steal</h3>
          <p className="text-muted-foreground mb-6">
            Little moves that make the night smoother (and more fun).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border/60 bg-card p-6 shadow-sm">
              <h4 className="font-bold text-lg">Pre-game checklist</h4>
              <p className="text-muted-foreground mt-2">
                Confirm pickup order, last stop, and headcount before you roll.
              </p>
            </Card>
            <Card className="border-border/60 bg-card p-6 shadow-sm">
              <h4 className="font-bold text-lg">Route hack</h4>
              <p className="text-muted-foreground mt-2">
                Add one “buffer” stop near downtown to absorb traffic and lines.
              </p>
            </Card>
            <Card className="border-border/60 bg-card p-6 shadow-sm">
              <h4 className="font-bold text-lg">Photo stop</h4>
              <p className="text-muted-foreground mt-2">
                Pick a quick scenic pull-off so photos don&apos;t derail the
                schedule.
              </p>
            </Card>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Want a custom {city} run-of-show? We can build it around your event.
          </p>
        </div> */}
      </div>
    </section>
  );
}
