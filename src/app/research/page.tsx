'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import Header from '../../components/header/Header';
import Navigation from '../../components/navigation/Navigation';
import Footer from '../../components/footer/Footer';
import { BoardTable, SearchFilter, Pagination } from '../../components/board';
import { BoardColumn, BoardItem } from '../../types';
import { useArticles, useUpdateArticleStatus } from '../../hooks/queries/articles';
import { usersService } from '../../services';
import { isAdmin, getRolesFromToken } from '../../utils/auth';
import { 
  navItemsAtom, 
  footerLinksAtom, 
  footerButtonsAtom,
  siteConfigAtom 
} from '../../store';

const BOARD_ID = 2; // 연구일지 boardId 동일하게 사용

const ResearchPage: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('제목');
  const [usernames, setUsernames] = useState<Record<string, string>>({});

  // Jotai atoms에서 공용 데이터 가져오기
  const [navItems] = useAtom(navItemsAtom);
  const [footerLinks] = useAtom(footerLinksAtom);
  const [footerButtons] = useAtom(footerButtonsAtom);
  const [siteConfig] = useAtom(siteConfigAtom);
  
  // ADMIN 권한 체크 - ADMIN이 아니면 메인 페이지로 리다이렉트
  useEffect(() => {
    if (typeof window !== 'undefined' && !isAdmin()) {
      alert('연구승인 메뉴는 관리자만 접근할 수 있습니다.');
      router.replace('/');
    }
  }, [router]);
  
  // ADMIN 권한이 있는 사용자만 연구승인 메뉴를 볼 수 있음
  const filteredNavItems = useMemo(() => {
    if (isAdmin()) {
      return navItems;
    }
    return navItems.filter(item => item.id !== 'research');
  }, [navItems]);

  // API에서 게시글 목록 가져오기
  const { data, isLoading, refetch } = useArticles(BOARD_ID, {
    page: currentPage,
    size: 10,
  });
  
  // 게시글 상태 변경 mutation
  const updateStatusMutation = useUpdateArticleStatus();

  // 사용자 이름 가져오기
  useEffect(() => {
    if (!data?.content) return;

    const fetchUsernames = async () => {
      // 고유한 authorId들 수집
      const uniqueAuthorIds = Array.from(new Set(data.content.map(article => article.authorId)));
      
      // 각 사용자 정보 가져오기
      const usernamePromises = uniqueAuthorIds.map(async (authorId) => {
        try {
          const response = await usersService.getMyAccount(authorId);
          return { authorId, username: response.data.username };
        } catch (error) {
          console.error(`Failed to fetch username for ${authorId}:`, error);
          return { authorId, username: authorId }; // 실패 시 authorId 그대로 사용
        }
      });

      const usernameResults = await Promise.all(usernamePromises);
      const usernameMap = usernameResults.reduce((acc, { authorId, username }) => {
        acc[authorId] = username;
        return acc;
      }, {} as Record<string, string>);

      setUsernames(usernameMap);
    };

    fetchUsernames();
  }, [data]);


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

  // 테이블 컬럼 설정
  const columns: BoardColumn[] = [
    { key: 'title', title: '연구과제명' },
    { key: 'type', title: '구분', width: '25' },
    { key: 'project', title: '프로젝트', width: '30' },
    { key: 'equipment', title: '장비명', width: '30' },
    { key: 'researcher', title: '연구책임자', width: '28' },
    { key: 'organization', title: '연구기관', width: '35' },
    { key: 'status', title: '진행상태', width: '22' },
  ];

  const searchOptions = ['제목', '연구자', '연구기관', '프로젝트', '장비'];

  const handleNavClick = () => {};
  
  const handleBoardSearch = (type: string, query: string) => {
    setSearchType(type);
    setSearchQuery(query);
    setCurrentPage(0);
  };

  const handleRowClick = (item: BoardItem) => {
    router.push(`/research/${item.id}`);
  };

  // status 값을 한글로 변환하는 함수
  const getStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
      'PENDING': '미승인',
      'APPROVED': '승인완료',
      'REJECTED': '반려',
    };
    return statusMap[status] || status;
  };
  
  // 승인 버튼 클릭 핸들러
  const handleApprove = async (e: React.MouseEvent, articleId: number) => {
    e.stopPropagation(); // 행 클릭 이벤트 방지
    
    // ADMIN 권한 재확인
    if (!isAdmin()) {
      alert('승인 권한이 없습니다. 관리자만 승인할 수 있습니다.');
      return;
    }
    
    // 현재 사용자의 roles 정보 확인 (디버깅용)
    const roles = getRolesFromToken();
    console.log('현재 사용자 roles:', roles);
    console.log('isAdmin() 결과:', isAdmin());
    
    const confirmed = window.confirm('이 연구일지를 승인하시겠습니까?');
    if (!confirmed) return;
    
    try {
      await updateStatusMutation.mutateAsync({
        boardId: BOARD_ID,
        articleId,
        status: 'APPROVED',
      });
      
      alert('승인이 완료되었습니다.');
      // 목록 새로고침
      refetch();
    } catch (error: any) {
      console.error('승인 처리 오류:', error);
      console.error('에러 상세:', {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        message: error?.message,
      });
      
      // 에러 메시지 추출
      let errorMessage = '승인 처리 중 오류가 발생했습니다.';
      if (error?.response?.status === 403) {
        errorMessage = '승인 권한이 없습니다. 관리자 권한이 필요합니다.\n\n현재 사용자의 roles를 확인해주세요.';
      } else if (error?.response?.status === 401) {
        errorMessage = '로그인이 만료되었습니다. 다시 로그인해주세요.';
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      alert(errorMessage);
    }
  };

  // API 데이터를 BoardItem으로 변환 (원본 article 데이터도 함께 저장)
  const boardItems: (BoardItem & { originalArticle?: any })[] = useMemo(() => {
    if (!data?.content) return [];
    
    let items = data.content.map(article => {
      const metadata = extractMetadata(article.content);
      return {
        id: String(article.id),
        title: article.title,
        type: '연구일지',
        project: metadata.project || '-',
        equipment: metadata.equipment || '-',
        researcher: usernames[article.authorId] || article.authorId,
        organization: '-',
        status: getStatusText(article.status),
        author: usernames[article.authorId] || article.authorId,
        date: article.createdAt.split('T')[0],
        views: article.viewCount,
        attachment: article.files && article.files.length > 0,
        originalArticle: article, // 원본 article 데이터 저장
      };
    });
    
    // 검색 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => {
        switch (searchType) {
          case '제목':
            return item.title.toLowerCase().includes(query);
          case '연구자':
            return item.researcher.toLowerCase().includes(query);
          case '연구기관':
            return item.organization.toLowerCase().includes(query);
          case '프로젝트':
            return item.project.toLowerCase().includes(query);
          case '장비':
            return item.equipment.toLowerCase().includes(query);
          default:
            return true;
        }
      });
    }
    
    return items;
  }, [data, usernames, searchQuery, searchType]);
  
  // 검색 필터링된 데이터의 페이지네이션
  const itemsPerPage = 10;
  const totalFilteredItems = boardItems.length;
  const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
  const totalCount = totalFilteredItems;
  
  // 페이지네이션을 위한 데이터 슬라이싱
  const paginatedItems = useMemo(() => {
    return boardItems.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    );
  }, [boardItems, currentPage, itemsPerPage]);
  
  // status 컬럼 커스텀 렌더링 함수
  const renderStatusCell = (column: BoardColumn, item: BoardItem & { originalArticle?: any }, index: number) => {
    if (column.key !== 'status') return undefined;
    
    const article = item.originalArticle;
    const currentStatus = article?.status;
    
    return (
      <div className="flex items-center justify-center gap-2">
        <span className={`
          ${currentStatus === 'APPROVED' ? 'text-green-600 font-bold' : ''}
          ${currentStatus === 'REJECTED' ? 'text-red-600 font-bold' : ''}
          ${currentStatus === 'PENDING' ? 'text-yellow-600 font-bold' : ''}
        `}>
          {item.status}
        </span>
        {currentStatus === 'PENDING' && (
          <button
            onClick={(e) => handleApprove(e, article.id)}
            disabled={updateStatusMutation.isPending}
            className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateStatusMutation.isPending ? '처리중...' : '승인'}
          </button>
        )}
      </div>
    );
  };

  // ADMIN이 아니면 아무것도 렌더링하지 않음 (리다이렉트 중)
  if (!isAdmin()) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 배경 */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-white opacity-60 -z-10" />
      
      {/* 헤더 */}
      <Header title={siteConfig.title} />
      
      {/* 네비게이션 */}
      <Navigation items={filteredNavItems} onItemClick={handleNavClick} />
      
      {/* 메인 콘텐츠 */}
      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">연구승인 (관리자)</h2>
            <p className="text-xl font-medium text-gray-700 leading-relaxed">
              독성물질 자료관리 시스템에서 수행 중인 모든 연구일지를 확인하고 관리할 수 있습니다.
              각 연구자가 작성한 연구일지를 검토하고 승인할 수 있습니다.
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
            renderCell={renderStatusCell}
          />

          {/* 페이지네이션 - 데이터가 있을 때만 표시 */}
          {paginatedItems.length > 0 && (
            <Pagination
              currentPage={currentPage + 1}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page - 1)}
            />
          )}

          {/* 작성 버튼은 관리자 페이지이므로 제거 */}
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

export default ResearchPage;
