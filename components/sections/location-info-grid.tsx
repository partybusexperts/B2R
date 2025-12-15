import { ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { LocationInfoBlock } from "@/lib/data/locations";

function LocationInfoCard({ item }: { item: LocationInfoBlock }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          className="group relative cursor-pointer overflow-hidden
            border-border/50 bg-card p-6 transition-all duration-300
            hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
        >
          <div className="flex h-full flex-col">
            <div
              className="mb-5 flex h-14 w-14 items-center justify-center
                rounded-2xl bg-primary/10 text-primary transition-colors
                group-hover:bg-primary group-hover:text-primary-foreground"
            >
              <DynamicIcon
                name={(item.icon ?? "info") as IconName}
                className="h-7 w-7"
              />
            </div>

            <h3
              className="text-lg font-bold leading-tight text-foreground
                group-hover:text-primary transition-colors"
            >
              {item.title}
            </h3>

            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
              {item.short_desc}
            </p>

            <div
              className="mt-5 flex items-center gap-2 text-sm font-semibold
                text-primary"
            >
              Learn more <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center
              rounded-full bg-primary/10 text-primary"
          >
            <DynamicIcon
              name={(item.icon ?? "info") as IconName}
              className="h-7 w-7"
            />
          </div>
          <DialogTitle className="text-2xl font-bold">{item.title}</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            {item.short_desc}
          </DialogDescription>
        </DialogHeader>

        <div
          className="my-2 max-h-[60vh] overflow-y-auto rounded-xl bg-muted p-5
            text-sm leading-relaxed text-foreground"
        >
          <div dangerouslySetInnerHTML={{ __html: item.modal_content || "" }} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function LocationInfoGrid({
  title,
  items,
}: {
  title: string;
  items: LocationInfoBlock[];
}) {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-extrabold mb-8 text-center md:text-left">
          {title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <LocationInfoCard key={idx} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
