'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Lock, ShieldCheck, ShieldAlert, ChevronRight, LogOut } from 'lucide-react';

export default function SecurePage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  async function handleFetch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setData(null);
    setError('');

    try {
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 600));

      const res = await fetch('/api/secure/details', {
        headers: {
          'x-user-email': email,
        },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch');
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-10">
        
        <AnimatePresence mode="wait">
          {!data && (
            <motion.div
              key="auth-screen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              <div className="text-center">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary shadow-subtle"
                >
                  <Lock className="h-8 w-8 text-foreground" />
                </motion.div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground">Secure Vault</h1>
                <p className="mt-3 text-lg text-muted-foreground">
                  Enter authorized credentials to access Simulation RLS data.
                </p>
              </div>

              <motion.div  
                className="mx-auto max-w-md rounded-3xl bg-card p-2 shadow-float ring-1 ring-black/5"
              >
                <form onSubmit={handleFetch} className="relative flex items-center">
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl bg-transparent px-6 py-4 text-base outline-none placeholder:text-muted-foreground/50"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-2 top-2 bottom-2 rounded-2xl bg-foreground px-6 py-2 text-sm font-bold text-background shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Unlock'}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mx-auto max-w-md rounded-2xl bg-destructive/5 p-6 text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="mb-1 font-semibold text-destructive">Access Denied</h3>
              <p className="text-sm text-destructive/80">{error}</p>
            </motion.div>
          )}

          {data && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                
                {/* User Identity */}
                <div className="flex items-center gap-3 rounded-full border border-border bg-card/50 px-5 py-2 backdrop-blur-md">
                   <div className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                   </div>
                   <div className="flex flex-col leading-none">
                      <span className="text-sm font-semibold text-foreground">{data.as_user?.email}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{data.as_user?.role}</span>
                   </div>
                </div>

                {/* Controls */}
                <button 
                  onClick={() => { setData(null); setEmail(''); }}
                  className="group flex items-center gap-2 rounded-full border border-border bg-card/50 px-5 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                >
                  <span>End Session</span>
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted group-hover:bg-destructive/20">
                    <LogOut className="h-3 w-3" />
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {data.rows?.map((row: any, i: number) => (
                    <motion.div 
                        key={row.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        className="group flex h-full flex-col justify-between rounded-3xl bg-card p-8 shadow-subtle transition-shadow duration-300 hover:shadow-float"
                    >
                        <div>
                             {/* Meta Header */}
                             <div className="mb-4 flex items-center justify-between">
                                <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-[11px] font-medium text-secondary-foreground">
                                    {row.category}
                                </span>
                                {row.source === 'user_project' && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                                        <ShieldCheck className="h-3 w-3" />
                                        Private
                                    </span>
                                )}
                             </div>

                             {/* Content */}
                             <h3 className="mb-3 text-xl font-semibold leading-tight text-foreground">
                                {row.title}
                             </h3>
                             <p className="mb-6 text-sm leading-relaxed text-muted-foreground opacity-90 line-clamp-3">
                                {row.description}
                             </p>
                        </div>
                        
                        {/* Footer: Tags & ID */}
                        <div className="flex items-center justify-between border-t border-border/40 pt-4">
                            <div className="flex gap-2">
                                {(row.tags ? row.tags.split(',') : []).slice(0, 2).map((tag: string, idx: number) => (
                                    <span key={idx} className="text-[11px] font-medium text-muted-foreground/60">
                                        #{tag.trim()}
                                    </span>
                                ))}
                            </div>
                            <span className="font-mono text-[10px] text-muted-foreground/40">
                                ID-{row.id}
                            </span>
                        </div>
                    </motion.div>
                ))}
              </div>
              
               {data.rows?.length === 0 && (
                    <div className="text-center text-muted-foreground py-12">
                        No secure records found for your hierarchy.
                    </div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

