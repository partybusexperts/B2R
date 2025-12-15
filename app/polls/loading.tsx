import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main>
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <Skeleton className="h-12 w-72 mx-auto" />
            <Skeleton className="h-6 w-[520px] max-w-full mx-auto" />
          </div>

          <div className="mx-auto max-w-3xl mb-10">
            <Skeleton className="h-[92px] w-full rounded-2xl" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, idx) => (
              <Skeleton key={idx} className="h-[340px] w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
