import React from 'react';
import Link from 'next/link';
import {
  ClipboardDocumentCheckIcon,
  PencilSquareIcon,
  BookOpenIcon,
  MegaphoneIcon,
  BeakerIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { MenuItem } from '../../types';

interface FrequentMenuProps {
  menuItems: MenuItem[];
}

const MENU_META: Record<string, { Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; description: string }> = {
  research: { Icon: ClipboardDocumentCheckIcon, description: '연구계획 승인 요청 검토' },
  'research-journal': { Icon: PencilSquareIcon, description: '연구 수행 내용 기록·조회' },
  materials: { Icon: BeakerIcon, description: '시료·분석자료 등록 및 관리' },
  publications: { Icon: BookOpenIcon, description: '연구성과 및 발간자료' },
  news: { Icon: MegaphoneIcon, description: '공지사항과 센터 소식' },
};

// 권한 필터링은 상위(page)에서 처리된 목록을 그대로 사용
const FrequentMenu: React.FC<FrequentMenuProps> = ({ menuItems }) => {
  return (
    <div className="w-full rounded-xl bg-white shadow-card-hover overflow-hidden">
      <div className="flex items-baseline justify-between px-6 pt-6 pb-4">
        <h3 className="text-lg font-bold text-ink">
          QUICK <span className="text-royal">MENU</span>
        </h3>
        <span className="text-xs text-gray-400">자주 찾는 메뉴</span>
      </div>
      <ul className="px-3 pb-3">
        {menuItems.map((item) => {
          const meta = MENU_META[item.id];
          const Icon = meta?.Icon ?? ClipboardDocumentCheckIcon;
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className="group flex items-center gap-4 px-3 py-3.5 rounded-lg hover:bg-surface transition-colors"
              >
                <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-blue-50 text-navy group-hover:bg-navy group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[15px] font-bold text-ink">{item.label}</span>
                  {meta && <span className="block text-[13px] text-gray-500 truncate">{meta.description}</span>}
                </span>
                <ChevronRightIcon className="w-4 h-4 text-gray-300 group-hover:text-royal transition-colors" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FrequentMenu;
