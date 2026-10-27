// 사이트 메뉴 구조 (GNB 메가메뉴, 서브 비주얼, 전체메뉴에서 공통 사용)

export interface SiteMenuChild {
  label: string;
  href: string;
  adminOnly?: boolean;
}

export interface SiteMenuGroup {
  id: string;
  label: string;
  englishLabel: string;
  href: string;
  description: string;
  children: SiteMenuChild[];
}

export const SITE_MENU: SiteMenuGroup[] = [
  {
    id: 'intro',
    label: '센터소개',
    englishLabel: 'About',
    href: '/intro',
    description: '법과학 기반 독성물질 연구를\n선도하는 연구센터입니다.',
    children: [{ label: '센터소개', href: '/intro' }],
  },
  {
    id: 'research',
    label: '연구관리',
    englishLabel: 'Research',
    href: '/research-journal',
    description: '연구 승인부터 연구일지까지\n연구 전 과정을 관리합니다.',
    children: [
      { label: '연구승인', href: '/research', adminOnly: true },
      { label: '연구일지', href: '/research-journal' },
      { label: '학술세미나', href: '/research/seminar' },
    ],
  },
  {
    id: 'publications',
    label: '연구성과',
    englishLabel: 'Publications',
    href: '/publications',
    description: '센터의 연구성과와\n발간자료를 확인하세요.',
    children: [{ label: '발간자료', href: '/publications' }],
  },
  {
    id: 'materials',
    label: '자료관리',
    englishLabel: 'Materials',
    href: '/materials',
    description: '독성물질 시료와 분석자료를\n안전하게 관리합니다.',
    children: [{ label: '자료관리', href: '/materials' }],
  },
  {
    id: 'news',
    label: '알림·소식',
    englishLabel: 'News',
    href: '/news',
    description: '센터의 새로운 소식을\n확인해 보세요.',
    children: [{ label: '센터소식', href: '/news' }],
  },
];

// 권한에 따라 노출할 메뉴만 남김 (하위 메뉴가 모두 숨겨진 그룹은 제외)
export const filterMenuByRole = (menu: SiteMenuGroup[], isAdmin: boolean): SiteMenuGroup[] =>
  menu
    .map((group) => ({
      ...group,
      children: group.children.filter((child) => isAdmin || !child.adminOnly),
    }))
    .filter((group) => group.children.length > 0);

const matchesPath = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(href + '/');

// 현재 경로에 해당하는 그룹/하위 메뉴를 찾음 (가장 길게 일치하는 href 우선)
export const findActiveMenu = (pathname: string) => {
  let best: { group: SiteMenuGroup; child: SiteMenuChild } | null = null;
  for (const group of SITE_MENU) {
    for (const child of group.children) {
      if (matchesPath(pathname, child.href) && (!best || child.href.length > best.child.href.length)) {
        best = { group, child };
      }
    }
  }
  return best;
};
