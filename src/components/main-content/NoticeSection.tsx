import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { NoticeCategory } from '../../types';
import { useArticles } from '../../hooks/queries/articles';
import { isAdmin } from '../../utils/auth';

// 모든 탭 목록 (컴포넌트 외부에 정의하여 매 렌더링마다 재생성되지 않도록)
const ALL_TABS: NoticeCategory[] = ['연구승인', '연구일지', '연구성과', '센터소식'];

const NoticeSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NoticeCategory>('연구일지');
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // 클라이언트에서만 권한 확인 (hydration 에러 방지)
  useEffect(() => {
    setIsMounted(true);
    setIsUserAdmin(isAdmin());
  }, []);
  
  // ADMIN 권한이 있는 사용자만 연구승인 탭을 볼 수 있음
  const tabs = useMemo(() => {
    // 서버 렌더링 시에는 항상 연구승인을 제외 (hydration 에러 방지)
    if (!isMounted || !isUserAdmin) {
      return ALL_TABS.filter(tab => tab !== '연구승인');
    }
    return ALL_TABS;
  }, [isMounted, isUserAdmin]);
  
  // ADMIN이 아닌 경우 연구승인 탭이 선택되어 있으면 연구일지로 변경
  useEffect(() => {
    if (isMounted && !isUserAdmin && activeTab === '연구승인') {
      setActiveTab('연구일지');
    }
  }, [isMounted, isUserAdmin, activeTab]);
  
  // 탭별 boardId 매핑
  const boardIdMap: Record<NoticeCategory, number> = {
    '연구승인': 2,  // 연구일지와 동일
    '연구일지': 2,
    '연구성과': 4,
    '센터소식': 1,
  };

  // 탭별 링크 경로 매핑
  const linkMap: Record<NoticeCategory, string> = {
    '연구승인': '/research',
    '연구일지': '/research-journal',
    '연구성과': '/publications',
    '센터소식': '/news',
  };

  // 현재 탭의 boardId로 데이터 가져오기
  const { data, isLoading } = useArticles(boardIdMap[activeTab], {
    page: 0,
    size: 4,
  });

  // 최근 4개 게시글
  const recentArticles = useMemo(() => {
    if (!data?.content) return [];
    return data.content.slice(0, 4).map(article => ({
      id: String(article.id),
      title: article.title,
      date: article.createdAt.split('T')[0],
    }));
  }, [data]);

  return (
    <div className="h-full rounded-xl bg-white border border-line shadow-card p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-eyebrow">Notice</p>
          <h3 className="mt-1 text-2xl font-bold text-ink tracking-tight">알림·소식</h3>
        </div>
        <Link
          href={linkMap[activeTab]}
          className="flex items-center gap-1 mt-1 text-sm font-medium text-gray-500 hover:text-royal transition-colors"
          aria-label={`${activeTab} 더보기`}
        >
          더보기
          <PlusIcon className="w-4 h-4" />
        </Link>
      </div>

      {/* 탭 메뉴 */}
      <div className="mt-5 flex gap-1 overflow-x-auto border-b border-line" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`-mb-px px-4 h-11 shrink-0 whitespace-nowrap text-[15px] border-b-[3px] transition-colors ${
              activeTab === tab
                ? 'border-royal text-navy font-bold'
                : 'border-transparent text-gray-500 font-medium hover:text-navy'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 공지사항 목록 */}
      <ul className="mt-2">
        {isLoading ? (
          <li className="py-14 text-center text-sm text-gray-400">불러오는 중...</li>
        ) : recentArticles.length > 0 ? (
          recentArticles.map((article) => (
            <li key={article.id}>
              <Link
                href={`${linkMap[activeTab]}/${article.id}`}
                className="group flex items-center gap-4 py-4 border-b border-dashed border-line last:border-b-0"
              >
                <span className="shrink-0 px-2 py-0.5 rounded-sm bg-blue-50 text-xs font-semibold text-navy">{activeTab}</span>
                <span className="flex-1 truncate text-[15px] font-medium text-ink group-hover:text-royal group-hover:underline underline-offset-4">
                  {article.title}
                </span>
                <time className="shrink-0 text-[13px] text-gray-400 tabular-nums">{article.date}</time>
              </Link>
            </li>
          ))
        ) : (
          <li className="py-14 text-center text-sm text-gray-400">등록된 게시글이 없습니다.</li>
        )}
      </ul>
    </div>
  );
};

export default NoticeSection;
