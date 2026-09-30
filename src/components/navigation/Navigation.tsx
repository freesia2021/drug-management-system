import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem } from '../../types';
import { isAdmin } from '../../utils/auth';

interface NavigationProps {
  items: NavItem[];
  onItemClick?: (item: NavItem) => void;
}

const Navigation: React.FC<NavigationProps> = ({ items, onItemClick }) => {
  const pathname = usePathname();
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // 클라이언트에서만 권한 확인 (hydration 에러 방지)
  useEffect(() => {
    setIsMounted(true);
    setIsUserAdmin(isAdmin());
  }, []);
  
  // ADMIN 권한이 있는 사용자만 연구승인 메뉴를 볼 수 있음
  const filteredItems = useMemo(() => {
    // 서버 렌더링 시에는 항상 연구승인을 제외 (hydration 에러 방지)
    if (!isMounted || !isUserAdmin) {
      return items.filter(item => item.id !== 'research');
    }
    return items;
  }, [items, isMounted, isUserAdmin]);

  // 경로별 활성 상태 확인
  const isActive = (item: NavItem): boolean => {
    if (!item.href) return false;
    
    // 홈 페이지는 정확히 일치해야 함
    if (item.href === '/' && pathname === '/') {
      return true;
    }
    
    // 정확히 일치하는 경우
    if (pathname === item.href) {
      return true;
    }
    
    // 하위 경로인 경우 (예: /research는 /research/seminar에서 active)
    // 단, 다른 경로의 접두사가 아닌 경우에만 (예: /research는 /research-journal에서 active 안됨)
    if (item.href !== '/' && pathname.startsWith(item.href + '/')) {
      return true;
    }
    
    return false;
  };

  const handleClick = (item: NavItem) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  return (
    <nav className="bg-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          {filteredItems.map((item) => {
            const active = isActive(item);
            
            return (
              <Link
                key={item.id}
                href={item.href || '#'}
                onClick={() => handleClick(item)}
                className={`
                  flex flex-col items-center justify-center w-48 h-14 px-4 py-2
                  transition-colors duration-200
                  ${active 
                    ? 'bg-gray-300 text-blue-900' 
                    : 'text-white hover:bg-blue-800'
                  }
                  relative
                `}
              >
                <span className="text-lg font-bold text-center whitespace-nowrap">
                  {item.label}
                </span>
                {active && (
                  <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-300" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
