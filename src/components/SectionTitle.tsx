
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

const SectionTitle = ({ title, subtitle, center = false, className }: SectionTitleProps) => {
  return (
    <div className={cn(
      "mb-8",
      center && "text-center",
      className
    )}>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{title}</h2>
      {subtitle && <p className="text-gray-500">{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;
