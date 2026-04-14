import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/api-client";

type Medicine = {
  id: string;
  name: string;
};

export default async function Home() {
  const medicines = await fetcher<Medicine[]>("/api/medicines").catch(() => []);

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Welcome to MediStore
        </h1>
        <p className="text-xl text-muted-foreground text-center max-w-[700px]">
          Your trusted partner for over-the-counter medicines delivered to your doorstep.
        </p>
        <Button size="lg">Shop Now</Button>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Featured Medicines</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {medicines.length > 0 ? (
            medicines.map((m: Medicine) => (
              <div key={m.id} className="p-4 border rounded-lg shadow-sm bg-card">
                <p className="font-semibold">{m.name}</p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground italic">No medicines found at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
