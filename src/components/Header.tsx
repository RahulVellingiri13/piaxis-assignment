'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function Header() {
  const pathname = usePathname();

  const links = [
    { href: '/guide', label: 'Guide' },
    { href: '/library', label: 'Library' },
    { href: '/suggest', label: 'Suggest' },
    { href: '/secure', label: 'Pro' },
  ];

  return (
    <header className="fixed top-6 left-0 right-0 z-50 mx-auto flex w-full max-w-fit justify-center">
      <div className="flex items-center gap-1 rounded-full bg-card/75 p-1.5 shadow-medium backdrop-blur-xl ring-1 ring-black/5 transition-all hover:bg-card/90 hover:shadow-float">
        
        {/* Logo / Home */}
        <Link 
          href="/" 
          className={cn(
            "flex h-10 items-center rounded-full px-5 text-sm font-semibold transition-colors hover:bg-secondary/50",
            pathname === '/' ? "text-foreground bg-secondary/50" : "text-foreground"
          )}
        >
          PiAxis
        </Link>

        <div className="h-4 w-[1px] bg-border opacity-20"></div>

        {/* Navigation Pills */}
        <nav className="flex items-center gap-1 px-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-xs font-medium transition-all duration-300",
                  isActive 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 z-[-1] rounded-full bg-secondary shadow-sm"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>



      </div>
    </header>
  );
}

