'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { PencilIcon } from '@heroicons/react/24/outline';
import Header from '../../components/header/Header';
import Navigation from '../../components/navigation/Navigation';
import Footer from '../../components/footer/Footer';
import { BoardTable, SearchFilter, Pagination } from '../../components/board';
import { ResearchJournal, BoardColumn, BoardItem } from '../../types';
import { useArticles } from '../../hooks/queries/articles';
import { usersService } from '../../services';
import { 
  navItemsAtom, 
  footerLinksAtom, 
  footerButtonsAtom,
  siteConfigAtom 
} from '../../store';

const BOARD_ID = 2; // 연구일지 boardId

const ResearchJournalPage: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('제목');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [currentUsername, setCurrentUsername] = useState<string>('');

  // Jotai atoms에서 공용 데이터 가져오기
  const [navItems] = useAtom(navItemsAtom);
  const [footerLinks] = useAtom(footerLinksAtom);
  const [footerButtons] = useAtom(footerButtonsAtom);
  const [siteConfig] = useAtom(siteConfigAtom);

  // 현재 로그인한 사용자 ID 가져오기
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setCurrentUserId(userId);
      // 사용자 이름 가져오기
      usersService.getMyAccount(userId).then(response => {
        setCurrentUsername(response.data.username);
      }).catch(error => {
        console.error('Failed to fetch username:', error);
        setCurrentUsername(userId); // 실패 시 userId 사용
      });
    } else {
      // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
      router.push('/login');
    }
  }, [router]);

  // API에서 게시글 목록 가져오기
  const { data, isLoading, error } = useArticles(BOARD_ID, {
    page: 0,
    size: 1000, // 전체 데이터를 가져와서 클라이언트에서 필터링
  });

  // content에서 메타데이터 추출 함수
  const extractMetadata = (content: string) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const metadataEl = doc.querySelector('.research-journal-metadata');
      return metadataEl 
        ? JSON.parse(metadataEl.getAttribute('data-metadata') || '{}')
        : {};
    } catch (error) {
      return {};
    }
  };

  // API 데이터를 필터링 (자신이 작성한 글만) 및 검색 필터링
  const filteredJournals = useMemo(() => {
    if (!data?.content || !currentUserId) return [];
    
    let filtered = data.content
      .filter(article => article.authorId === currentUserId)
      .map(article => {
        const metadata = extractMetadata(article.content);
        return {
          id: String(article.id),
          title: article.title,
          author: currentUsername || article.authorId,
          date: article.createdAt.split('T')[0],
          views: article.viewCount,
          attachment: article.files && article.files.length > 0,
          project: metadata.project || '-',
          equipment: metadata.equipment || '-',
          originalArticle: article, // 검색을 위해 원본 저장
        };
      });
    
    // 검색 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        switch (searchType) {
          case '제목':
            return item.title.toLowerCase().includes(query);
          case '연구자':
            return item.author.toLowerCase().includes(query);
          case '연구기관':
            return true; // 연구기관 정보가 없으므로 일단 true
          case '프로젝트':
            return item.project.toLowerCase().includes(query);
          case '장비':
            return item.equipment.toLowerCase().includes(query);
          default:
            return true;
        }
      });
    }
    
    return filtered;
  }, [data, currentUserId, currentUsername, searchQuery, searchType]);

  // 페이지네이션을 위한 데이터 슬라이싱
  const itemsPerPage = 10;
  const totalFilteredItems = filteredJournals.length;
  const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
  
  const journals: BoardItem[] = filteredJournals.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );


  // 테이블 컬럼 설정
  const columns: BoardColumn[] = [
    { key: 'number', title: '번호', width: '20' },
    { key: 'title', title: '연구제목' },
    { key: 'project', title: '프로젝트', width: '30' },
    { key: 'equipment', title: '장비명', width: '30' },
    { key: 'author', title: '연구자', width: '25' },
    { key: 'date', title: '작성일', width: '34' },
    { key: 'views', title: '조회수', width: '22' },
    { key: 'attachment', title: '첨부파일', width: '25' },
  ];

  const searchOptions = ['제목', '연구자', '연구기관', '프로젝트', '장비'];

  const handleNavClick = () => {};
  
  const handleBoardSearch = (type: string, query: string) => {
    setSearchType(type);
    setSearchQuery(query);
    setCurrentPage(0);
  };

  const handleRowClick = (item: BoardItem) => {
    router.push(`/research-journal/${item.id}`);
  };

  const handleWriteClick = () => {
    router.push('/research-journal/write');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header title={siteConfig.title} />
        <Navigation items={navItems} onItemClick={handleNavClick} />
        <main className="flex-1 py-12 md:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">연구일지를 불러오는 중...</p>
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

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header title={siteConfig.title} />
        <Navigation items={navItems} onItemClick={handleNavClick} />
        <main className="flex-1 py-12 md:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <p className="text-xl text-red-600">연구일지를 불러오는 중 오류가 발생했습니다.</p>
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
            <h2 className="text-[28px] md:text-[32px] font-bold text-ink tracking-tight mb-2">내 연구일지</h2>
            <p className="text-[16px] text-gray-500 leading-relaxed">
              내가 작성한 연구일지를 확인하고 관리할 수 있습니다. 
              연구의 진행 상황과 중간 결과물을 기록하고 공유하세요.
            </p>
          </div>

          {/* 검색 및 필터 */}
          <SearchFilter
            totalCount={totalFilteredItems}
            currentPage={currentPage + 1}
            totalPages={totalPages}
            searchOptions={searchOptions}
            onSearch={handleBoardSearch}
          />

          {/* 게시판 테이블 */}
          <BoardTable
            items={journals}
            columns={columns}
            onRowClick={handleRowClick}
          />

          {/* 페이지네이션 - 데이터가 있을 때만 표시 */}
          {journals.length > 0 && (
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

export default ResearchJournalPage;
