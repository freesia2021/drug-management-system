'use client'

import React, { useEffect, useMemo, useState } from 'react';
import { useAtom } from 'jotai';
import { jwtDecode } from 'jwt-decode';
import { Header } from '../components/header';
import { Navigation } from '../components/navigation';
import { MainImageSection, FrequentMenu, NoticeSection } from '../components/main-content';
import { Footer } from '../components/footer';
import { NavItem, NewsItem } from '../types';
import { isAdmin } from '../utils/auth';
import { 
  navItemsAtom, 
  menuItemsAtom, 
  footerLinksAtom, 
  footerButtonsAtom,
  siteConfigAtom 
} from '../store';

export default function Home() {
  // Jotai atoms에서 공용 데이터 가져오기
  const [navItems] = useAtom(navItemsAtom);
  const [menuItems] = useAtom(menuItemsAtom);
  const [footerLinks] = useAtom(footerLinksAtom);
  const [footerButtons] = useAtom(footerButtonsAtom);
  const [siteConfig] = useAtom(siteConfigAtom);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // 클라이언트에서만 권한 확인 (hydration 에러 방지)
  useEffect(() => {
    setIsMounted(true);
    setIsUserAdmin(isAdmin());
  }, []);
  
  // ADMIN 권한이 있는 사용자만 연구승인 메뉴를 볼 수 있음
  const filteredNavItems = useMemo(() => {
    // 서버 렌더링 시에는 항상 연구승인을 제외 (hydration 에러 방지)
    if (!isMounted || !isUserAdmin) {
      return navItems.filter(item => item.id !== 'research');
    }
    return navItems;
  }, [navItems, isMounted, isUserAdmin]);
  
  const filteredMenuItems = useMemo(() => {
    // 서버 렌더링 시에는 항상 연구승인을 제외 (hydration 에러 방지)
    if (!isMounted || !isUserAdmin) {
      return menuItems.filter(item => item.id !== 'research');
    }
    return menuItems;
  }, [menuItems, isMounted, isUserAdmin]);

  // 메인 화면 접근 시 accessToken의 roles 정보 확인
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      
      if (accessToken) {
        try {
          const decodedToken: any = jwtDecode(accessToken);
          
          console.log('=== 메인 화면 - Access Token 정보 ===');
          console.log('전체 토큰 내용:', decodedToken);
          
          // roles 정보 확인
          if (decodedToken.roles) {
            console.log('✅ Roles 정보 (배열):', decodedToken.roles);
            console.log('Roles 타입:', Array.isArray(decodedToken.roles) ? '배열' : typeof decodedToken.roles);
          } else if (decodedToken.role) {
            console.log('✅ Role 정보 (단일):', decodedToken.role);
          } else {
            console.log('⚠️ Roles 정보가 토큰에 포함되어 있지 않습니다.');
            console.log('토큰에 포함된 모든 키:', Object.keys(decodedToken));
          }
          
          // 토큰의 다른 주요 정보도 출력
          if (decodedToken.sub) console.log('User ID (sub):', decodedToken.sub);
          if (decodedToken.username) console.log('Username:', decodedToken.username);
          if (decodedToken.email) console.log('Email:', decodedToken.email);
          if (decodedToken.exp) {
            const expiryDate = new Date(decodedToken.exp * 1000);
            console.log('토큰 만료 시간:', expiryDate.toLocaleString('ko-KR'));
          }
          
          console.log('====================================');
        } catch (error) {
          console.error('토큰 디코딩 실패:', error);
        }
      } else {
        console.log('⚠️ Access Token이 없습니다. 로그인이 필요합니다.');
      }
    }
  }, []);

  // 뉴스 데이터
  const mainNews: NewsItem = {
    id: '1',
    title: '법과학연구센터 KOLAS 질량분석실 전경',
    date: '2025-12-03',
    imageUrl: '/images/배너1.png',
    isMain: true
  };

  const sideNews: NewsItem = {
    id: '2',
    title: '사이드 뉴스',
    date: '2025-12-03',
    imageUrl: '/images/배너2.png'
  };

  // 이벤트 핸들러들
  const handleNavClick = (clickedItem: NavItem) => {
    console.log('Navigation clicked:', clickedItem.label);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <Header title={siteConfig.title} />
      
      {/* 네비게이션 */}
      <Navigation items={filteredNavItems} onItemClick={handleNavClick} />
      
      {/* 메인 콘텐츠 */}
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 메인 이미지 섹션 */}
          <MainImageSection mainNews={mainNews} sideNews={sideNews} />
          
          {/* 하단 섹션 */}
          <div className="flex flex-col lg:flex-row gap-6 justify-center">
            <FrequentMenu menuItems={filteredMenuItems} />
            <NoticeSection />
          </div>
        </div>
      </main>
      
      {/* 푸터 */}
      <Footer
        title={siteConfig.title}
        links={footerLinks}
        buttons={footerButtons}
        address={siteConfig.address}
        contact={siteConfig.contact}
        copyright={siteConfig.copyright}
      />
    </div>
  );
}
