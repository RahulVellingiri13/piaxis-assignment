import { Suspense } from 'react';
import pool from '@/lib/db';
import { DetailCard } from '@/components/DetailCard';
import { Search, AlertCircle } from 'lucide-react'; 
import Form from 'next/form';

// Force dynamic because we are reading from DB
export const dynamic = 'force-dynamic';

async function getDetails(query?: string) {
  try {
    const client = await pool.connect();
    try {
      let text = 'SELECT id, title, category, tags, description FROM details';
      const values: any[] = [];

      if (query) {
        text += ` WHERE title ILIKE $1 OR tags ILIKE $1 OR description ILIKE $1`;
        values.push(`%${query}%`);
      }

      text += ' ORDER BY id';

      const res = await client.query(text, values);
      return res.rows;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Database connection failed:', err);
    return null; // Return null to signal error state
  }
}

export default async function LibraryPage(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || '';
  const details = await getDetails(query);


  if (!details) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center text-foreground">
        <div className="max-w-md space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
             <AlertCircle className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
          <h1 className="text-3xl font-medium tracking-tight">System Unavailable</h1>
          <p className="text-muted-foreground">
            We are currently facing an issue establishing a connection to the archive. 
            Please check back later.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-black selection:text-white">
      
      <section className="mx-auto max-w-5xl px-6 pt-32 pb-10 sm:pt-40">
        <div className="space-y-8">
             <h1 className="text-4xl font-semibold tracking-tighter text-foreground sm:text-5xl">
               Library.
             </h1>

             <div className="max-w-xl">
                <Form action="/library">
                  <div className="relative group">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-0">
                      <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="q"
                      defaultValue={query}
                      placeholder="Search for details..."
                      autoFocus
                      className="block w-full border-b border-border bg-transparent py-4 pl-8 pr-4 text-xl text-foreground placeholder:text-muted-foreground/40 focus:border-foreground focus:outline-none transition-colors"
                    />
                  </div>
                </Form>
             </div>
        </div>
      </section>

      <section className="mx-auto max-w-screen-xl px-6 pb-32">
        {details.length === 0 ? (
          <div className="border-t border-border pt-12">
            <p className="text-lg text-muted-foreground">No matches found for "{query}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {details.map((detail: any, index: number) => (
              <DetailCard key={detail.id} detail={detail} index={index} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
