import React from 'react';

export default function Badge({ variant = 'default', children, className = '' }) {
  const variantStyles = {
    forest: 'bg-[#1F3D2B]/80 text-[#A3E635] border-[#2D5A3C]',
    sand: 'bg-[#18291E] text-[#E8DCC4] border-[#243D2D]',
    purple: 'bg-[#8B5CF6]/20 text-[#C4B5FD] border-[#8B5CF6]/40 font-semibold',
    success: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    warning: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
    danger: 'bg-rose-950/60 text-rose-300 border-rose-800/60',
    neutral: 'bg-[#18291E] text-[#9EAEA3] border-[#243D2D]',
    default: 'bg-[#142319] text-[#E8DCC4] border-[#243D2D]'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant] || variantStyles.default} ${className}`}>
      {children}
    </span>
  );
}
