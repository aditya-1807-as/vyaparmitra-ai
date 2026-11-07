import React from 'react';

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendType = 'up', // 'up' | 'down' | 'neutral'
  accent = 'forest', // 'forest' | 'purple' | 'amber' | 'rose'
  onClick 
}) {
  const accentBorderStyles = {
    forest: 'border-l-4 border-l-[#34D399]',
    purple: 'border-l-4 border-l-[#8B5CF6] shadow-purple-glow/10',
    amber: 'border-l-4 border-l-amber-500',
    rose: 'border-l-4 border-l-rose-500'
  };

  const iconBgStyles = {
    forest: 'bg-[#18291E] text-[#34D399]',
    purple: 'bg-[#8B5CF6]/20 text-[#A78BFA]',
    amber: 'bg-amber-950/50 text-amber-400',
    rose: 'bg-rose-950/50 text-rose-400'
  };

  return (
    <div 
      onClick={onClick}
      className={`rounded-3xl p-5 border border-[#243D2D] bg-[#142319] shadow-soft transition-all duration-200 ${accentBorderStyles[accent]} ${onClick ? 'cursor-pointer hover:border-[#2D4B38] hover:bg-[#18291E] hover:-translate-y-0.5' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#9EAEA3]">{title}</p>
          <h4 className="text-2xl font-black text-[#F5EFE6] mt-1 tracking-tight font-mono">{value}</h4>
          {subtitle && <p className="text-xs text-[#E8DCC4] mt-1 font-medium">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-2xl ${iconBgStyles[accent]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-[#243D2D] flex items-center text-xs">
          <span className={`font-semibold mr-1.5 ${
            trendType === 'up' ? 'text-emerald-400' : 
            trendType === 'down' ? 'text-rose-400' : 'text-[#9EAEA3]'
          }`}>
            {trend}
          </span>
          <span className="text-[#6E7F74]">vs last period</span>
        </div>
      )}
    </div>
  );
}
