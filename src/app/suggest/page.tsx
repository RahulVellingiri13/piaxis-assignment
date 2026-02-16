'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, ArrowRight, ChevronDown } from 'lucide-react';
import { DetailCard } from '@/components/DetailCard';

const HOST_OPTIONS = ['External Wall', 'Internal Wall', 'Window'];
const ADJACENT_OPTIONS = ['Slab', 'Floor', 'External Wall'];
const EXPOSURE_OPTIONS = ['External', 'Internal'];

export default function SuggestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      host_element: formData.get('host_element'),
      adjacent_element: formData.get('adjacent_element'),
      exposure: formData.get('exposure'),
    };

    try {
      // Simulate network delay for effect
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch');
      setResult(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-start pt-32 p-6 selection:bg-black selection:text-white">
      <div className="w-full max-w-xl space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-semibold tracking-tighter text-foreground sm:text-6xl">
            Find your detail.
          </h1>
          <p className="text-lg text-muted-foreground">
            Describe the context to generate the perfect standard.
          </p>
        </div>

        {/* Minimal Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            
            {/* Host Element Select */}
            <div className="relative group">
              <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
                Host Element
              </label>
              <div className="relative">
                <select
                  name="host_element"
                  required
                  defaultValue=""
                  className="w-full appearance-none border-b border-border bg-transparent py-3 pr-8 text-xl text-foreground outline-none transition-colors focus:border-foreground cursor-pointer"
                >
                  <option value="" disabled>Select element...</option>
                  {HOST_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground opacity-50" />
              </div>
            </div>

            {/* Adjacent Element Select */}
            <div className="relative group">
              <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
                Adjacent Element
              </label>
              <div className="relative">
                <select
                  name="adjacent_element"
                  required
                  defaultValue=""
                  className="w-full appearance-none border-b border-border bg-transparent py-3 pr-8 text-xl text-foreground outline-none transition-colors focus:border-foreground cursor-pointer"
                >
                  <option value="" disabled>Select adjacent...</option>
                  {ADJACENT_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground opacity-50" />
              </div>
            </div>

            {/* Exposure Select */}
            <div className="relative group">
              <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
                Exposure Condition
              </label>
              <div className="relative">
                <select
                  name="exposure"
                  required
                  defaultValue=""
                  className="w-full appearance-none border-b border-border bg-transparent py-3 pr-8 text-xl text-foreground outline-none transition-colors focus:border-foreground cursor-pointer"
                >
                  <option value="" disabled>Select exposure...</option>
                  {EXPOSURE_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground opacity-50" />
              </div>
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-3 rounded-full bg-foreground py-4 text-lg font-medium text-background shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-zinc-800 hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 dark:hover:bg-zinc-200"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span>Generate Suggestion</span>
                <Sparkles className="h-5 w-5 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
              </>
            )}
          </button>
        </form>

        {/* Results Area */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center text-red-500"
            >
              {error}
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="pt-8 border-t border-border"
            >
               <div className="flex items-center justify-between mb-8">
                  <span className="text-sm font-medium text-muted-foreground">AI Recommendation</span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground/50 font-mono">CONFIDENCE: HIGH</span>
               </div>

               {result.detail ? (
                  <div className="mx-auto max-w-sm">
                    <DetailCard detail={result.detail} index={0} />
                  </div>
               ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    No matching standard details found for this specific context.
                  </div>
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
