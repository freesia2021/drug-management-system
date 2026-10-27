'use client';

import React, { useState, useMemo } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { PencilIcon } from '@heroicons/react/24/outline';
import Header from '../../components/header/Header';
import Navigation from '../../components/navigation/Navigation';
import Footer from '../../components/footer/Footer';
import { BoardTable, SearchFilter, Pagination } from '../../components/board';
import { BoardItem, BoardColumn } from '../../types';
import { useArticles } from '../../hooks/queries/articles';
import { 
  navItemsAtom, 
  footerLinksAtom, 
  footerButtonsAtom,
  siteConfigAtom 
} from '../../store';

const BOARD_ID = 1; // 센터소식 boardId

const NewsPage: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('제목');
  const [selectedCategory, setSelectedCategory] = useState('전체');

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

  // 제목에서 [자료관리] prefix 제거하는 함수
  const removePrefix = (title: string): string => {
    return title.startsWith('[자료관리]') 
      ? title.replace(/^\[자료관리\]\s*/, '')
      : title;
  };

  // content에서 메타데이터 추출하는 함수
  const extractMetadata = (content: string) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      
      const metadataEl = doc.querySelector('.news-metadata');
      const metadata = metadataEl 
        ? JSON.parse(metadataEl.getAttribute('data-metadata') || '{}')
        : {};
      
      return metadata;
    } catch (error) {
      console.error('메타데이터 추출 실패:', error);
      return {};
    }
  };

  // API 데이터를 BoardItem으로 변환 ([자료관리] prefix가 없는 게시글만 필터링)
  const newsItems: BoardItem[] = useMemo(() => {
    if (!data?.content) return [];
    
    return data.content
      .filter(article => !article.title.startsWith('[자료관리]'))
      .map(article => {
        const metadata = extractMetadata(article.content);
        const category = metadata.category || '공지사항'; // 기본값은 '공지사항'
        
        return {
          id: String(article.id),
          title: removePrefix(article.title), // 혹시 있을 경우 prefix 제거
          author: article.authorId,
          date: article.createdAt.split('T')[0],
          views: article.viewCount,
          attachment: article.files && article.files.length > 0,
          category,
        };
      });
  }, [data]);

  // 카테고리 및 검색 필터링된 데이터
  const filteredItems = useMemo(() => {
    let items = newsItems;
    
    // 카테고리 필터링
    if (selectedCategory !== '전체') {
      items = items.filter(item => item.category === selectedCategory);
    }
    
    // 검색 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => {
        switch (searchType) {
          case '제목':
            return item.title.toLowerCase().includes(query);
          case '작성자':
            return item.author.toLowerCase().includes(query);
          case '내용':
            // 내용 검색은 원본 article 데이터가 필요하므로 일단 제목으로 대체
            return item.title.toLowerCase().includes(query);
          default:
            return true;
        }
      });
    }
    
    return items;
  }, [newsItems, selectedCategory, searchQuery, searchType]);


  // 테이블 컬럼 설정
  const columns: BoardColumn[] = [
    { key: 'number', title: '번호', width: '15' },
    { key: 'category', title: '분류', width: '25' },
    { key: 'title', title: '제목' },
    { key: 'author', title: '작성자', width: '25' },
    { key: 'date', title: '작성일', width: '34' },
    { key: 'views', title: '조회수', width: '20' },
  ];

  const searchOptions = ['제목', '작성자', '내용'];
  const categories = ['전체', '공지사항', '행사안내', '채용공고', '보도자료'];
  
  // 필터링된 데이터의 페이지네이션
  const itemsPerPage = 10;
  const totalFilteredItems = filteredItems.length;
  const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
  const totalCount = totalFilteredItems;
  
  // 페이지네이션을 위한 데이터 슬라이싱
  const paginatedItems = useMemo(() => {
    return filteredItems.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    );
  }, [filteredItems, currentPage, itemsPerPage]);

  const handleNavClick = () => {};
  
  const handleBoardSearch = (type: string, query: string) => {
    setSearchType(type);
    setSearchQuery(query);
    setCurrentPage(0);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(0); // 카테고리 변경 시 첫 페이지로 이동
  };

  const handleRowClick = (item: BoardItem) => {
    router.push(`/news/${item.id}`);
  };

  const handleWriteClick = () => {
    router.push('/news/write');
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
            <h2 className="text-[28px] md:text-[32px] font-bold text-ink tracking-tight mb-2">센터소식</h2>
            <p className="text-[16px] text-gray-500 leading-relaxed">
              독성물질 자료관리 시스템의 주요 소식과 공지사항을 확인하실 수 있습니다.
            </p>
          </div>

          {/* 카테고리 필터 */}
          <div className="mb-6 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
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

export default NewsPage;

