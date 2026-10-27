'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { Bars3Icon, XMarkIcon, ChevronRightIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useLogout } from '../../hooks/queries/auth';
import { isAdmin } from '../../utils/auth';
import { SITE_MENU, filterMenuByRole, findActiveMenu } from '../../config/siteMenu';
import BrandLogo from '../brand/BrandLogo';

interface HeaderProps {
  title: string;
}

const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiry');
};

const Header: React.FC<HeaderProps> = ({ title }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  const [isAllMenuOpen, setIsAllMenuOpen] = useState(false);
  const logoutMutation = useLogout();

  useEffect(() => {
    // 로그인 상태 확인
    const checkAuth = () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const tokenExpiry = localStorage.getItem('tokenExpiry');

      // 토큰 만료 확인
      if (tokenExpiry && Date.now() >= parseInt(tokenExpiry, 10) * 1000) {
        clearTokens();
        setIsLoggedIn(false);
        setUserName('');
        setIsUserAdmin(false);
        return;
      }

      if (accessToken && refreshToken) {
        setIsLoggedIn(true);
        setIsUserAdmin(isAdmin());

        // Access Token에서 사용자 이름 추출
        try {
          const decoded = jwtDecode(accessToken) as any;
          setUserName(decoded.username || decoded.nickname || '사용자');
        } catch (error) {
          console.error('토큰 디코딩 실패:', error);
          setUserName('사용자');
        }
      } else {
        setIsLoggedIn(false);
        setUserName('');
        setIsUserAdmin(false);
      }
    };

    checkAuth();
    // 페이지가 다시 포커스될 때마다 체크
    window.addEventListener('focus', checkAuth);
    return () => window.removeEventListener('focus', checkAuth);
  }, []);

  // 페이지 이동 시 열린 메뉴 닫기
  useEffect(() => {
    setOpenGroupId(null);
    setIsAllMenuOpen(false);
  }, [pathname]);

  const menu = useMemo(() => filterMenuByRole(SITE_MENU, isUserAdmin), [isUserAdmin]);
  const activeGroupId = findActiveMenu(pathname)?.group.id;
  const openGroup = menu.find((group) => group.id === openGroupId);

  const handleLogout = async () => {
    if (!confirm('로그아웃 하시겠습니까?')) {
      return;
    }

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await logoutMutation.mutateAsync(refreshToken);
      } else {
        // 토큰이 없어도 로컬 스토리지 정리
        clearTokens();
      }
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 실패해도 로컬 정보 제거
      clearTokens();
    }
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <header className="relative z-50 bg-white" onMouseLeave={() => setOpenGroupId(null)}>
      {/* 상단 유틸리티 바 */}
      <div className="bg-navy-ink text-[13px] text-white/70">
        <div className="site-container flex items-center justify-between h-9">
          <span className="hidden sm:inline">법과학 기반 독성물질 연구·자료 통합관리</span>
          <div className="flex items-center gap-4 ml-auto">
            {isLoggedIn ? (
              <>
                <span className="flex items-center gap-1.5 text-white/90">
                  <UserCircleIcon className="w-4 h-4" />
                  <strong className="font-semibold text-white">{userName}</strong>님
                  {isUserAdmin && (
                    <span className="ml-1 px-1.5 py-px rounded-sm bg-royal text-[10px] font-semibold text-white">ADMIN</span>
                  )}
                </span>
                <span className="w-px h-3 bg-white/25" />
                <button onClick={handleLogout} className="hover:text-white transition-colors">
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-white transition-colors">로그인</Link>
                <span className="w-px h-3 bg-white/25" />
                <Link href="/register" className="hover:text-white transition-colors">회원가입</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 로고 + GNB */}
      <div className="border-b border-line">
        <div className="site-container flex items-center h-[84px] gap-8">
          <BrandLogo title={title} subtitle="법과학연구센터" />

          <nav className="hidden lg:flex flex-1 justify-center h-full" aria-label="주메뉴">
            <ul className="flex h-full">
              {menu.map((group) => {
                const highlighted = openGroupId === group.id || (!openGroupId && activeGroupId === group.id);
                return (
                  <li key={group.id} className="h-full" onMouseEnter={() => setOpenGroupId(group.id)}>
                    <Link
                      href={group.children[0].href}
                      onFocus={() => setOpenGroupId(group.id)}
                      className={`relative flex items-center h-full px-6 xl:px-8 text-[17px] font-semibold transition-colors ${
                        highlighted ? 'text-navy' : 'text-ink hover:text-navy'
                      }`}
                    >
                      {group.label}
                      <span
                        className={`absolute left-1/2 -translate-x-1/2 bottom-0 h-[3px] bg-royal transition-all duration-300 ${
                          highlighted ? 'w-[calc(100%-2.5rem)]' : 'w-0'
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            onClick={() => setIsAllMenuOpen(true)}
            className="ml-auto lg:ml-0 flex items-center gap-2 h-10 px-3 rounded border border-line text-sm font-medium text-gray-700 hover:border-navy hover:text-navy transition-colors"
            aria-label="전체메뉴 열기"
          >
            <Bars3Icon className="w-5 h-5" />
            <span className="hidden xl:inline">전체메뉴</span>
          </button>
        </div>
      </div>

      {/* 메가메뉴 */}
      <div
        className={`hidden lg:block absolute left-0 right-0 top-full bg-white border-b border-line shadow-mega transition-all duration-200 ${
          openGroup ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'
        }`}
      >
        {openGroup && (
          <div className="site-container flex py-9 gap-12">
            <div className="w-[300px] shrink-0 rounded-lg bg-gradient-to-br from-navy to-royal p-7 text-white relative overflow-hidden">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-200">{openGroup.englishLabel}</span>
              <h2 className="mt-2 text-2xl font-bold">{openGroup.label}</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/80 whitespace-pre-line">{openGroup.description}</p>
              <span className="absolute -right-8 -bottom-10 w-36 h-36 rounded-full border-[18px] border-white/10" />
            </div>
            <ul className="flex-1 grid grid-cols-3 gap-x-10 gap-y-1 content-start">
              {openGroup.children.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    className="group flex items-center justify-between py-3.5 border-b border-line text-[16px] font-semibold text-ink hover:text-royal transition-colors"
                  >
                    {child.label}
                    <ChevronRightIcon className="w-4 h-4 text-gray-300 group-hover:text-royal transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 전체메뉴 (모바일 겸용) */}
      {isAllMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50" onClick={() => setIsAllMenuOpen(false)}>
          <div
            className="absolute inset-x-0 top-0 max-h-full overflow-y-auto bg-white"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="전체메뉴"
          >
            <div className="site-container flex items-center justify-between h-[84px] border-b border-line">
              <BrandLogo title={title} subtitle="법과학연구센터" />
              <button
                onClick={() => setIsAllMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded border border-line hover:border-navy"
                aria-label="전체메뉴 닫기"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="site-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-8 py-10">
              {menu.map((group) => (
                <div key={group.id}>
                  <h3 className="pb-3 mb-2 border-b-2 border-navy text-lg font-bold text-navy">{group.label}</h3>
                  <ul>
                    {group.children.map((child) => (
                      <li key={child.href}>
                        <Link href={child.href} className="block py-2 text-[15px] text-gray-700 hover:text-royal">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
