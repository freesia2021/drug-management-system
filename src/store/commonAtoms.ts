import { atom } from 'jotai';
import { NavItem, MenuItem, FooterLink, FooterButton } from '../types';

// 사이트 기본 정보
export const siteConfigAtom = atom({
  title: '독성물질 자료관리 시스템',
  address: '[31539] 충청남도 아산시 신창면 황산길 100-50 경찰대학',
  contact: 'ARS 041-968-2114 민원전화 : 182',
  copyright: 'Copyright© 2015.BY K.N.P.U All Right Reserved.',
});

// 네비게이션 아이템
export const navItemsAtom = atom<NavItem[]>([
  { id: 'home', label: '홈', href: '/' },
  { id: 'intro', label: '센터소개', href: '/intro' },
  { id: 'research', label: '연구승인', href: '/research' },
  { id: 'journal', label: '연구일지', href: '/research-journal' },
  { id: 'publications', label: '연구성과', href: '/publications' },
  { id: 'materials', label: '자료관리', href: '/materials' },
  { id: 'news', label: '센터소식', href: '/news' },
]);

// 메인 페이지 메뉴 아이템 (홈페이지 퀵메뉴)
export const menuItemsAtom = atom<MenuItem[]>([
  {
    id: 'research',
    label: '연구승인',
    icon: '/images/센터소개_ico.png',
    href: '/research'
  },
  {
    id: 'research-journal',
    label: '연구일지',
    icon: '/images/재료관리_ico.png',
    href: '/research-journal'
  },
  {
    id: 'materials',
    label: '자료관리',
    icon: '/images/재료관리_ico.png',
    href: '/materials'
  },
  {
    id: 'publications',
    label: '연구성과',
    icon: '/images/발간자료_ico.png',
    href: '/publications'
  },
  {
    id: 'news',
    label: '센터소식',
    icon: '/images/조직도_ico.png',
    href: '/news'
  }
]);

// 푸터 링크
export const footerLinksAtom = atom<FooterLink[]>([
  { label: '개인정보처리방침', href: '#' },
  { label: '저작권정책', href: '#' },
  { label: '개인정보침해신고', href: '#' },
  { label: '뷰어다운로드', href: '#' },
  { label: '이메일집단수집거부', href: '#' }
]);

// 푸터 버튼
export const footerButtonsAtom = atom<FooterButton[]>([
  {
    label: '인쇄하기',
    onClick: () => window.print()
  },
  {
    label: '관련기관바로가기',
    arrow: true,
    onClick: () => console.log('관련기관바로가기')
  },
  {
    label: '경찰관련사이트',
    arrow: true,
    onClick: () => console.log('경찰관련사이트')
  }
]);

