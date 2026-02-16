'use client';

import { motion } from 'framer-motion';

interface Detail {
  id: number;
  title: string;
  category: string;
  tags: string | string[];
  description: string;
}

interface DetailCardProps {
  detail: Detail;
  index: number;
}

export function DetailCard({ detail, index }: DetailCardProps) {
  const tagsArray = Array.isArray(detail.tags)
    ? detail.tags
    : detail.tags
    ? detail.tags.split(',').map((t) => t.trim())
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group flex h-full flex-col justify-between rounded-3xl bg-card p-8 shadow-subtle transition-shadow duration-300 hover:shadow-float"
    >
      <div>
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-[11px] font-medium text-secondary-foreground">
            {detail.category}
          </span>
        </div>
        
        <h3 className="mb-3 text-xl font-semibold leading-tight text-foreground">
          {detail.title}
        </h3>
        
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground opacity-90">
          {detail.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tagsArray.map((tag, i) => (
          <span
            key={i}
            className="text-[11px] font-medium text-muted-foreground/60"
          >
            #{tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}



