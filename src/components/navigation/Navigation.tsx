'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { NavItem } from '../../types';
import { isAdmin } from '../../utils/auth';
import { SITE_MENU, filterMenuByRole, findActiveMenu } from '../../config/siteMenu';

interface NavigationProps {
  items: NavItem[];
  onItemClick?: (item: NavItem) => void;
}

/**
 * 서브 페이지 상단 비주얼 + 위치(브레드크럼) + 같은 메뉴 그룹 탭
 * 메인 페이지에서는 표시하지 않음 (GNB는 Header가 담당)
 */
const Navigation: React.FC<NavigationProps> = () => {
  const pathname = usePathname();
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  // 클라이언트에서만 권한 확인 (hydration 에러 방지)
  useEffect(() => {
    setIsUserAdmin(isAdmin());
  }, []);

  const active = findActiveMenu(pathname);
  if (pathname === '/' || !active) {
    return null;
  }

  const { group, child } = active;
  const siblings = filterMenuByRole(SITE_MENU, isUserAdmin).find((g) => g.id === group.id)?.children ?? [];

  return (
    <section aria-label="페이지 위치">
      {/* 서브 비주얼 */}
      <div className="relative overflow-hidden bg-gradient-to-r from-navy-deep via-navy to-royal">
        <svg className="absolute right-0 top-0 h-full w-1/2 opacity-[0.12]" viewBox="0 0 400 200" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
          <g fill="none" stroke="#fff" strokeWidth="1.2">
            <path d="M300 20 340 43v46l-40 23-40-23V43l40-23Z" />
            <path d="M340 89l40 23v46l-40 23-40-23v-46" />
            <path d="M260 89l-40 23v46l40 23" />
            <path d="M220 20 260 43M180 66l40-23" />
          </g>
          <g fill="#fff">
            <circle cx="300" cy="20" r="4" /><circle cx="340" cy="89" r="4" /><circle cx="260" cy="89" r="4" />
            <circle cx="380" cy="158" r="4" /><circle cx="220" cy="158" r="4" />
          </g>
        </svg>
        <div className="site-container relative py-12 md:py-14">
          <p className="text-xs md:text-[13px] font-semibold tracking-[0.22em] uppercase text-blue-200">{group.englishLabel}</p>
          <h1 className="mt-2 text-3xl md:text-[38px] font-bold text-white tracking-tight">{group.label}</h1>
          <p className="mt-3 text-[15px] text-white/75">{group.description.replace('\n', ' ')}</p>
        </div>
      </div>

      {/* 위치 표시 바 */}
      <div className="bg-white border-b border-line">
        <div className="site-container flex flex-col md:flex-row md:items-stretch md:justify-between">
          <nav className="flex items-center gap-2 h-12 text-[13px] text-gray-500" aria-label="브레드크럼">
            <Link href="/" className="flex items-center hover:text-navy" aria-label="홈">
              <HomeIcon className="w-4 h-4" />
            </Link>
            <ChevronRightIcon className="w-3 h-3 text-gray-300" />
            <span>{group.label}</span>
            <ChevronRightIcon className="w-3 h-3 text-gray-300" />
            <span className="font-semibold text-ink">{child.label}</span>
          </nav>

          {siblings.length > 1 && (
            <ul className="flex -mb-px overflow-x-auto">
              {siblings.map((sibling) => {
                const current = sibling.href === child.href;
                return (
                  <li key={sibling.href}>
                    <Link
                      href={sibling.href}
                      aria-current={current ? 'page' : undefined}
                      className={`flex items-center h-12 px-5 text-[15px] whitespace-nowrap border-b-[3px] transition-colors ${
                        current
                          ? 'border-royal text-navy font-bold'
                          : 'border-transparent text-gray-600 hover:text-navy'
                      }`}
                    >
                      {sibling.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default Navigation;
