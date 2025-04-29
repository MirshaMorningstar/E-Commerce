
import React from 'react';
import { cn } from '@/lib/utils';
import { Leaf } from 'lucide-react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

const SectionTitle = ({ title, subtitle, center = false, className }: SectionTitleProps) => {
  return (
    <div className={cn(
      "mb-8 relative",
      center && "text-center",
      className
    )}>
      {center && (
        <div className="flex justify-center mb-2">
          <div className="h-10 w-10 rounded-full bg-sage-100 flex items-center justify-center">
            <Leaf className="h-5 w-5 text-sage-600" />
          </div>
        </div>
      )}
      
      <h2 className="text-2xl md:text-3xl font-bold text-sage-800 mb-2 font-serif">{title}</h2>
      
      {subtitle && (
        <p className="text-sage-600">{subtitle}</p>
      )}
      
      {!center && (
        <div className="absolute top-0 -left-3 h-full w-1 bg-sage-300 rounded-full" />
      )}
      
      {center && (
        <div className="w-20 h-1 bg-sage-300 rounded-full mx-auto mt-3" />
      )}
    </div>
  );
};

export default SectionTitle;
