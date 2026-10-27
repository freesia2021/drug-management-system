'use client';

import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { PencilIcon } from '@heroicons/react/24/outline';
import Header from '../../components/header/Header';
import Navigation from '../../components/navigation/Navigation';
import Footer from '../../components/footer/Footer';
import { BoardTable, SearchFilter, Pagination } from '../../components/board';
import { Publication, BoardColumn, BoardItem } from '../../types';
import { useArticles } from '../../hooks/queries/articles';
import { 
  navItemsAtom, 
  footerLinksAtom, 
  footerButtonsAtom,
  siteConfigAtom 
} from '../../store';

const BOARD_ID = 4; // 연구성과 boardId

const PublicationsPage: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0); // API는 0부터 시작
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('제목');

  // Jotai atoms에서 공용 데이터 가져오기
  const [navItems] = useAtom(navItemsAtom);
  const [footerLinks] = useAtom(footerLinksAtom);
  const [footerButtons] = useAtom(footerButtonsAtom);
  const [siteConfig] = useAtom(siteConfigAtom);

  // API에서 게시글 목록 가져오기
  const { data, isLoading, error } = useArticles(BOARD_ID, {
    page: currentPage,
    size: 10,
  });

  // API 데이터를 BoardItem 형태로 변환
  const publications: BoardItem[] = data?.content.map(article => ({
    id: String(article.id),
    title: article.title,
    author: article.authorId,
    date: article.createdAt.split('T')[0],
    views: article.viewCount,
    attachment: article.files && article.files.length > 0,
  })) || [];


  // 테이블 컬럼 설정
  const columns: BoardColumn[] = [
    { key: 'number', title: '번호', width: '20' },
    { key: 'title', title: '제목' },
    { key: 'author', title: '작성자', width: '28' },
    { key: 'date', title: '발간일', width: '36' },
    { key: 'views', title: '다운로드', width: '25' },
    { key: 'attachment', title: '첨부파일', width: '27' },
  ];

  const searchOptions = ['제목', '작성자', '내용'];
  const itemsPerPage = 10;
  const totalPages = data?.totalPages || 1;
  const totalCount = data?.totalElements || 0;

  const handleNavClick = () => {
    // 네비게이션 클릭 핸들러
  };

  const handleBoardSearch = (type: string, query: string) => {
    setSearchType(type);
    setSearchQuery(query);
    setCurrentPage(0);
  };

  const handleRowClick = (item: BoardItem) => {
    router.push(`/publications/${item.id}`);
  };

  const handleWriteClick = () => {
    router.push('/publications/write');
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header title={siteConfig.title} />
        <Navigation items={navItems} onItemClick={handleNavClick} />
        <main className="flex-1 py-12 md:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">게시글을 불러오는 중...</p>
            </div>
          </div>
        </main>
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

  // 에러 발생
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header title={siteConfig.title} />
        <Navigation items={navItems} onItemClick={handleNavClick} />
        <main className="flex-1 py-12 md:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <p className="text-xl text-red-600">게시글을 불러오는 중 오류가 발생했습니다.</p>
            </div>
          </div>
        </main>
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 헤더 */}
      <Header title={siteConfig.title} />
      
      {/* 네비게이션 */}
      <Navigation items={navItems} onItemClick={handleNavClick} />
      
      {/* 메인 콘텐츠 */}
      <main className="flex-1 py-12 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-10">
            <h2 className="text-[28px] md:text-[32px] font-bold text-ink tracking-tight mb-2">연구성과</h2>
            <p className="text-[16px] text-gray-500 leading-relaxed">
              독성물질 자료관리 시스템에서 발간한 연구보고서, 논문, 정책자료 등을 
              다운로드하실 수 있습니다. 모든 자료는 PDF 형태로 제공됩니다.
            </p>
          </div>

          {/* 검색 및 필터 */}
          <SearchFilter
            totalCount={totalCount}
            currentPage={currentPage + 1}
            totalPages={totalPages}
            searchOptions={searchOptions}
            onSearch={handleBoardSearch}
          />

          {/* 게시판 테이블 */}
          <BoardTable
            items={publications}
            columns={columns}
            onRowClick={handleRowClick}
          />

          {/* 페이지네이션 - 데이터가 있을 때만 표시 */}
          {publications.length > 0 && (
            <Pagination
              currentPage={currentPage + 1}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page - 1)}
            />
          )}

          {/* 작성 버튼 */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleWriteClick}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
            >
              <PencilIcon className="w-5 h-5" />
              작성하기
            </button>
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
};

export default PublicationsPage;
