'use client';

import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { PencilIcon } from '@heroicons/react/24/outline';
import Header from '../../../components/header/Header';
import Navigation from '../../../components/navigation/Navigation';
import Footer from '../../../components/footer/Footer';
import { BoardTable, SearchFilter, Pagination } from '../../../components/board';
import { AcademicSeminar, BoardColumn, BoardItem } from '../../../types';
import { useArticles } from '../../../hooks/queries/articles';
import { 
  navItemsAtom, 
  footerLinksAtom, 
  footerButtonsAtom,
  siteConfigAtom 
} from '../../../store';

const BOARD_ID = 1; // 학술세미나 boardId

const ResearchSeminarPage: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('제목');

  // Jotai atoms에서 공용 데이터 가져오기
  const [navItems] = useAtom(navItemsAtom);
  const [footerLinks] = useAtom(footerLinksAtom);
  const [footerButtons] = useAtom(footerButtonsAtom);
  const [siteConfig] = useAtom(siteConfigAtom);

  // API에서 게시글 목록 가져오기
  const { data, isLoading } = useArticles(BOARD_ID, {
    page: currentPage,
    size: 10,
  });

  // API 데이터를 BoardItem으로 변환
  const seminars: BoardItem[] = data?.content.map(article => ({
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
    { key: 'date', title: '작성일', width: '36' },
    { key: 'views', title: '조회수', width: '22' },
    { key: 'attachment', title: '첨부파일', width: '27' },
  ];

  const searchOptions = ['제목', '작성자', '내용'];
  const itemsPerPage = 10;
  const totalPages = data?.totalPages || 1;
  const totalCount = data?.totalElements || 0;

  const handleNavClick = () => {};
  
  const handleBoardSearch = (type: string, query: string) => {
    setSearchType(type);
    setSearchQuery(query);
    setCurrentPage(0);
  };

  const handleRowClick = (item: BoardItem) => {
    router.push(`/research/seminar/${item.id}`);
  };

  const handleWriteClick = () => {
    router.push('/research/seminar/write');
  };

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
            <h2 className="text-[28px] md:text-[32px] font-bold text-ink tracking-tight mb-2">학술세미나</h2>
            <p className="text-[16px] text-gray-500 leading-relaxed">
              당면한 치안현안에 대해 각계 전문가와 시민들의 다양한 의견을 청취하여 
              경찰의 치안정책에 반영하고자 매년 1~2회 학술세미나를 개최하고 있습니다.
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
            items={seminars}
            columns={columns}
            onRowClick={handleRowClick}
          />

          {/* 페이지네이션 - 데이터가 있을 때만 표시 */}
          {seminars.length > 0 && (
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

export default ResearchSeminarPage;
