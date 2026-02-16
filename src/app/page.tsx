import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-foreground selection:bg-black selection:text-white">
      
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-8 text-7xl font-semibold tracking-tighter text-foreground sm:text-9xl sm:leading-[0.9]">
          PiAxis.
        </h1>
        
        <p className="mx-auto mb-12 max-w-2xl text-2xl font-medium leading-relaxed text-muted-foreground sm:text-3xl">
          A curated collection of <span className="text-foreground">architectural standards</span> for modern construction.
        </p>

        <Link 
          href="/library"
          className="group inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-4 text-lg font-medium text-background transition-all hover:scale-105 hover:bg-foreground/90 active:scale-95"
        >
          <span>Browse Library</span>
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

    </main>
  );
}
