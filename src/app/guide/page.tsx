'use client';

import { motion } from 'framer-motion';
import { Library, Sparkles, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    id: 'library',
    icon: Library,
    title: 'Library',
    description: 'A curated collection of architectural standards. Search and browse through a vast database of construction details, filtered by category and tags.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    cta: 'Browse Library',
    href: '/library'
  },
  {
    id: 'suggest',
    icon: Sparkles,
    title: 'Suggest',
    description: 'AI-powered detail recommender. Selecting host and adjacent elements triggers an intelligent suggestion engine to find the perfect connection detail.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    cta: 'Get Suggestions',
    href: '/suggest'
  },
  {
    id: 'pro',
    icon: Lock,
    title: 'Pro Vault',
    description: 'Simulated Row Level Security (RLS). Demonstrates secure data access where Architects see only their relevant projects, while Admins have full oversight.',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    cta: 'Enter Vault',
    href: '/secure'
  }
];

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-background px-6 pt-32 pb-20 selection:bg-black selection:text-white">
      <div className="mx-auto max-w-5xl">
        
        <div className="mb-20 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-5xl font-semibold tracking-tighter text-foreground sm:text-6xl"
          >
            How it works.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground leading-relaxed"
          >
            PiAxis organizes architectural knowledge into three distinct layers, from public standards to secure project data.
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className="group relative flex flex-col justify-between rounded-3xl bg-card p-8 shadow-subtle transition-all duration-300 hover:shadow-float hover:-translate-y-1"
            >
              <div>
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bg} ${feature.color}`}>
                  <feature.icon className="h-7 w-7" />
                </div>
                
                <h2 className="mb-4 text-2xl font-semibold text-foreground">
                  {feature.title}
                </h2>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-border/50">
                <Link 
                  href={feature.href}
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary"
                >
                  <span>{feature.cta}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 border-t border-border/40 pt-16">
          <h3 className="mb-8 text-3xl font-semibold tracking-tight text-foreground">Demo Access Credentials</h3>
          <p className="mb-10 text-muted-foreground">
            Use these accounts to test the Row Level Security (RLS) simulation in the Pro Vault. 
            Each role sees a different set of data.
          </p>
          
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { email: 'admin@example.com', role: 'SUPER_ADMIN', desc: 'Sees ALL records + System data' },
              { email: 'alice@example.com', role: 'ARCHITECT', desc: 'Sees public + own private projects' },
              { email: 'bob@example.com', role: 'INTERN', desc: 'Sees only public records' },
            ].map((user, i) => (
              <div key={user.email} className="rounded-2xl bg-secondary/30 p-6 border border-border/50">
                <div className="mb-2 flex items-center justify-between">
                   <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{user.role}</span>
                   <div className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-red-500' : i === 1 ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                </div>
                <div className="mb-2 font-mono text-sm font-medium text-foreground">
                  {user.email}
                </div>
                <div className="text-xs text-muted-foreground/80">
                  {user.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
