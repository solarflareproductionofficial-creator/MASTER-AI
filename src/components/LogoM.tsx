import React from 'react';

interface LogoMProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  accentColor?: string;
  animate?: boolean;
  className?: string;
}

export const LogoM: React.FC<LogoMProps> = ({
  size = 'md',
  accentColor = '#06b6d4',
  animate = false,
  className = '',
}) => {
  const sizeMap = {
    xs: { box: 'w-5 h-5 rounded-md text-[11px]', glow: '0 0 8px' },
    sm: { box: 'w-7 h-7 rounded-lg text-xs', glow: '0 0 10px' },
    md: { box: 'w-9 h-9 rounded-xl text-sm font-black', glow: '0 0 16px' },
    lg: { box: 'w-12 h-12 rounded-xl text-lg font-black', glow: '0 0 22px' },
    xl: { box: 'w-16 h-16 rounded-2xl text-2xl font-black', glow: '0 0 28px' },
  };

  const currentSize = sizeMap[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center p-[1.5px] select-none transition-all ${currentSize.box} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${accentColor}, #6366f1 50%, #d946ef 100%)`,
        boxShadow: `${currentSize.glow} ${accentColor}40`,
      }}
    >
      <div className="w-full h-full bg-zinc-950 rounded-[inherit] flex items-center justify-center font-black tracking-tighter leading-none relative overflow-hidden">
        {/* Subtle radial grid inside */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at center, ${accentColor} 1.5px, transparent 1.5px)`,
            backgroundSize: '5px 5px',
          }}
        />

        {/* Futuristic Bold Capital M */}
        <span
          className={`font-black z-10 transition-transform ${animate ? 'animate-pulse' : ''}`}
          style={{
            background: `linear-gradient(180deg, #ffffff 10%, ${accentColor} 95%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: `drop-shadow(0 0 6px ${accentColor}80)`,
            fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          M
        </span>
      </div>
    </div>
  );
};
