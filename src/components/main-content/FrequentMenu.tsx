import React, { useMemo } from 'react';
import Link from 'next/link';
import { MenuItem } from '../../types';
import { isAdmin } from '../../utils/auth';

interface FrequentMenuProps {
  menuItems: MenuItem[];
}

const FrequentMenu: React.FC<FrequentMenuProps> = ({ menuItems }) => {
  // ADMIN 권한이 있는 사용자만 연구승인 메뉴를 볼 수 있음
  const filteredMenuItems = useMemo(() => {
    if (isAdmin()) {
      return menuItems;
    }
    return menuItems.filter(item => item.id !== 'research');
  }, [menuItems]);
  
  return (
    <div className="bg-gray-200 rounded-lg p-6 w-full max-w-2xl">
      <div className="bg-blue-900 rounded px-4 py-3 mb-6">
        <h3 className="text-lg font-semibold text-white text-center">
          자주 찾는 메뉴
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        {filteredMenuItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="bg-white rounded-lg p-5 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <div 
              className="w-14 h-14 bg-cover bg-center bg-no-repeat mb-3 rounded"
              style={{ backgroundImage: `url(${item.icon})` }}
            />
            <span className="text-lg font-semibold text-gray-900 text-center">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FrequentMenu;
