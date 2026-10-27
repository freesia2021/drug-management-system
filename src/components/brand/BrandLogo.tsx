import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  title: string;
  subtitle?: string;
  variant?: 'dark' | 'light';
  href?: string;
}

// 방패 + 분자 구조 형태의 엠블럼
export const BrandEmblem: React.FC<{ className?: string; light?: boolean }> = ({ className = 'w-10 h-10', light }) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
    <defs>
      <linearGradient id={light ? 'emblem-light' : 'emblem-dark'} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={light ? '#9fb3e0' : '#4169e1'} />
        <stop offset="100%" stopColor={light ? '#ffffff' : '#1d3994'} />
      </linearGradient>
    </defs>
    <path
      d="M20 2.5 34.5 8v11.2c0 9.1-6.1 15.6-14.5 18.3C11.6 34.8 5.5 28.3 5.5 19.2V8L20 2.5Z"
      fill={`url(#${light ? 'emblem-light' : 'emblem-dark'})`}
    />
    <g stroke={light ? '#1d3994' : '#ffffff'} strokeWidth="1.6" fill="none" strokeLinejoin="round">
      <path d="M20 11.5 26 15v7l-6 3.5-6-3.5v-7l6-3.5Z" />
      <path d="M20 18.5v7M20 18.5l6-3.5M20 18.5l-6-3.5" opacity="0.55" />
    </g>
    <circle cx="20" cy="18.5" r="1.9" fill={light ? '#1d3994' : '#ffffff'} />
  </svg>
);

const BrandLogo: React.FC<BrandLogoProps> = ({ title, subtitle, variant = 'dark', href = '/' }) => {
  const light = variant === 'light';
  return (
    <Link href={href} className="flex items-center gap-3 shrink-0" aria-label={`${title} 홈으로`}>
      <BrandEmblem className="w-10 h-10 md:w-11 md:h-11" light={light} />
      <span className="flex flex-col leading-tight">
        {subtitle && (
          <span className={`text-[11px] md:text-xs font-medium tracking-wide ${light ? 'text-blue-200' : 'text-gray-500'}`}>
            {subtitle}
          </span>
        )}
        <span className={`text-lg md:text-[21px] font-bold tracking-tight ${light ? 'text-white' : 'text-navy'}`}>
          {title}
        </span>
      </span>
    </Link>
  );
};

export default BrandLogo;
