'use client';

import React, { useState, useMemo } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { PencilIcon } from '@heroicons/react/24/outline';
import Header from '../../components/header/Header';
import Navigation from '../../components/navigation/Navigation';
import Footer from '../../components/footer/Footer';
import { BoardTable, SearchFilter, Pagination } from '../../components/board';
import { BoardColumn, BoardItem } from '../../types';
import { useArticles } from '../../hooks/queries/articles';
import { 
  navItemsAtom, 
  footerLinksAtom, 
  footerButtonsAtom,
  siteConfigAtom 
} from '../../store';

const BOARD_ID = 1; // 자료관리 boardId

const MaterialsPage: React.FC = () => {
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

  // content에서 메타데이터 추출 함수
  const extractMetadata = (content: string) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const metadataEl = doc.querySelector('.material-metadata');
      return metadataEl 
        ? JSON.parse(metadataEl.getAttribute('data-metadata') || '{}')
        : {};
    } catch (error) {
      return {};
    }
  };

  // 제목에서 [자료관리] prefix 제거하는 함수
  const removePrefix = (title: string): string => {
    return title.startsWith('[자료관리]') 
      ? title.replace(/^\[자료관리\]\s*/, '')
      : title;
  };

  // API 데이터를 BoardItem으로 변환 및 검색 필터링
  const boardItems: BoardItem[] = useMemo(() => {
    if (!data?.content) return [];
    
    // [자료관리] prefix가 있는 게시글만 필터링
    let items = data.content
      .filter(article => article.title.startsWith('[자료관리]'))
      .map(article => {
        const metadata = extractMetadata(article.content);
        return {
          id: String(article.id),
          title: removePrefix(article.title), // prefix 제거하여 표시
          project: metadata.project || '-',
          equipment: metadata.equipment || '-',
          researchDate: metadata.researchDate || '-',
          author: article.authorId,
          date: article.createdAt.split('T')[0],
          views: article.viewCount,
          attachment: article.files && article.files.length > 0,
        };
      });
    
    // 검색 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => {
        switch (searchType) {
          case '제목':
            return item.title.toLowerCase().includes(query);
          case '프로젝트':
            return item.project.toLowerCase().includes(query);
          case '장비명':
            return item.equipment.toLowerCase().includes(query);
          default:
            return true;
        }
      });
    }
    
    return items;
  }, [data, searchQuery, searchType]);

  // 페이지네이션
  const itemsPerPage = 10;
  const totalFilteredItems = boardItems.length;
  const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
  const totalCount = totalFilteredItems;
  
  const paginatedItems = useMemo(() => {
    return boardItems.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    );
  }, [boardItems, currentPage, itemsPerPage]);

  // 테이블 컬럼 설정
  const columns: BoardColumn[] = [
    { key: 'number', title: '번호', width: '15' },
    { key: 'title', title: '제목' },
    { key: 'project', title: '프로젝트', width: '30' },
    { key: 'equipment', title: '장비명', width: '30' },
    { key: 'researchDate', title: '연구수행일자', width: '30' },
    { key: 'author', title: '작성자', width: '25' },
    { key: 'date', title: '작성일', width: '34' },
    { key: 'views', title: '조회수', width: '20' },
  ];

  const searchOptions = ['제목', '프로젝트', '장비명'];

  const handleNavClick = () => {};
  
  const handleBoardSearch = (type: string, query: string) => {
    setSearchType(type);
    setSearchQuery(query);
    setCurrentPage(0);
  };

  const handleRowClick = (item: BoardItem) => {
    router.push(`/materials/${item.id}`);
  };

  const handleWriteClick = () => {
    router.push('/materials/write');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header title={siteConfig.title} />
        <Navigation items={navItems} onItemClick={handleNavClick} />
        <main className="flex-1 py-12 md:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">자료를 불러오는 중...</p>
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
            <h2 className="text-[28px] md:text-[32px] font-bold text-ink tracking-tight mb-2">자료관리</h2>
            <p className="text-[16px] text-gray-500 leading-relaxed">
              프로젝트와 장비명을 관리할 수 있습니다. 연구에 필요한 자료를 체계적으로 관리하세요.
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
            items={paginatedItems}
            columns={columns}
            onRowClick={handleRowClick}
          />

          {/* 페이지네이션 - 데이터가 있을 때만 표시 */}
          {paginatedItems.length > 0 && (
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

export default MaterialsPage;

