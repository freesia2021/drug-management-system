import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
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
    <div className="bg-white rounded-lg p-6 w-full max-w-lg">
      {/* 탭 메뉴 */}
      <div className="flex mb-6">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              flex-1 h-12 border border-gray-300 flex items-center justify-center
              font-semibold text-lg transition-colors duration-200
              ${activeTab === tab 
                ? 'bg-white border-b-0 text-gray-900' 
                : 'bg-gray-100 text-gray-900 hover:bg-white'
              }
              ${index === 0 ? 'rounded-l' : ''}
              ${index === tabs.length - 1 ? 'rounded-r' : ''}
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 공지사항 목록 */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">불러오는 중...</p>
          </div>
        ) : recentArticles.length > 0 ? (
          recentArticles.map((article) => (
            <Link
              key={article.id}
              href={`${linkMap[activeTab]}/${article.id}`}
              className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
            >
              <span className="text-lg font-semibold text-gray-900 flex-1 truncate">
                {article.title}
              </span>
              <span className="text-sm font-semibold text-gray-900 ml-4">
                {article.date}
              </span>
            </Link>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">게시글이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeSection;
