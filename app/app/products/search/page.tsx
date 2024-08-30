import { SearchForm } from "@/components/search-form";
import { Separator } from "@/components/ui/separator";

export default function SearchPage() {
  return (
    <main className="container py-10 lg:px-80">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Search</h2>
        <p className="text-muted-foreground">
          Find an Amazon product and buy it with crypto
        </p>
      </div>
      <Separator className="my-6" />
      <SearchForm />
    </main>
  );
}
