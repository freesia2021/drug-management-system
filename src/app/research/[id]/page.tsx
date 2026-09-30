'use client';

import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { useRouter, useParams } from 'next/navigation';
import Header from '../../../components/header/Header';
import Navigation from '../../../components/navigation/Navigation';
import Footer from '../../../components/footer/Footer';
import { ResearchDetailView, ResearchDetail } from '../../../components/article-detail';
import { useArticle, useArticleNeighbor } from '../../../hooks/queries/articles';
import { usersService, articlesService } from '../../../services';
import { 
  navItemsAtom, 
  footerLinksAtom, 
  footerButtonsAtom,
  siteConfigAtom 
} from '../../../store';

const BOARD_ID = 2; // 연구일지 boardId (research-journal과 동일)

const ResearchDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const articleId = parseInt(params?.id as string);
  const [isApproving, setIsApproving] = useState(false);
  const [usernames, setUsernames] = useState<Record<string, string>>({});

  const [navItems] = useAtom(navItemsAtom);
  const [footerLinks] = useAtom(footerLinksAtom);
  const [footerButtons] = useAtom(footerButtonsAtom);
  const [siteConfig] = useAtom(siteConfigAtom);

  // API에서 게시글 상세 정보 가져오기
  const { data: articleData, isLoading, error, refetch } = useArticle(BOARD_ID, articleId);
  const { data: neighborData } = useArticleNeighbor(BOARD_ID, articleId);

  // 사용자 이름 가져오기
  useEffect(() => {
    if (!articleData) return;

    const fetchUsernames = async () => {
      const { metadata } = extractMetadata(articleData.content);
      
      // 기록자와 점검자의 userId 수집
      const userIds: string[] = [articleData.authorId];
      if (metadata.inspector) {
        userIds.push(metadata.inspector);
      }
      // status가 APPROVED일 때 statusChangedBy도 추가
      if (articleData.status === 'APPROVED' && articleData.statusChangedBy) {
        userIds.push(articleData.statusChangedBy);
      }
      
      // 고유한 userId들만 필터링
      const uniqueUserIds = Array.from(new Set(userIds));
      
      // 각 사용자 정보 가져오기
      const usernamePromises = uniqueUserIds.map(async (userId) => {
        try {
          const response = await usersService.getMyAccount(userId);
          return { userId, username: response.data.username };
        } catch (error) {
          console.error(`Failed to fetch username for ${userId}:`, error);
          return { userId, username: userId };
        }
      });

      const usernameResults = await Promise.all(usernamePromises);
      const usernameMap = usernameResults.reduce((acc, { userId, username }) => {
        acc[userId] = username;
        return acc;
      }, {} as Record<string, string>);

      setUsernames(usernameMap);
    };

    fetchUsernames();
  }, [articleData]);

  // content에서 메타데이터와 본문 추출하는 함수
  const extractMetadata = (content: string) => {
    try {
      // DOMParser로 HTML 파싱
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      
      // 메타데이터 추출
      const metadataEl = doc.querySelector('.research-metadata');
      const metadata = metadataEl 
        ? JSON.parse(metadataEl.getAttribute('data-metadata') || '{}')
        : {};
      
      // 실제 본문 내용 추출
      const contentEl = doc.querySelector('.research-content');
      const actualContent = contentEl?.innerHTML || content;
      
      return { metadata, actualContent };
    } catch (error) {
      console.error('메타데이터 추출 실패:', error);
      return { metadata: {}, actualContent: content };
    }
  };

  const handleNavClick = () => {};
  const handleGoBack = () => router.push('/research');
  const handleNavigate = (id: string) => router.push(`/research/${id}`);

  // 승인 처리 함수
  const handleApprove = async () => {
    if (!articleData) return;

    const confirmed = window.confirm('이 연구일지를 승인하시겠습니까?');
    if (!confirmed) return;

    setIsApproving(true);

    try {
      // 상태 변경 API 호출
      await articlesService.updateArticleStatus(BOARD_ID, articleId, 'APPROVED');

      alert('승인이 완료되었습니다.');
      
      // 데이터 새로고침
      refetch();
    } catch (error) {
      console.error('승인 처리 오류:', error);
      alert('승인 처리 중 오류가 발생했습니다.');
    } finally {
      setIsApproving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-white opacity-60 -z-10" />
        <Header title={siteConfig.title} />
        <Navigation items={navItems} onItemClick={handleNavClick} />
        <main className="flex-1 py-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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

  if (error || !articleData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-white opacity-60 -z-10" />
        <Header title={siteConfig.title} />
        <Navigation items={navItems} onItemClick={handleNavClick} />
        <main className="flex-1 py-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <p className="text-xl text-red-600">게시글을 불러오는 중 오류가 발생했습니다.</p>
              <button
                onClick={handleGoBack}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                목록으로 돌아가기
              </button>
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

  const { metadata, actualContent } = extractMetadata(articleData.content);

  // createdAt을 YYYY-MM-DD HH:mm:ss 포맷으로 변환
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // API 데이터를 ResearchDetail 형식으로 변환
  const research: ResearchDetail = {
    id: String(articleData.id),
    title: articleData.title,
    author: usernames[articleData.authorId] || articleData.authorId,
    date: articleData.createdAt.split('T')[0],
    views: articleData.viewCount,
    content: actualContent,
    // 메타데이터
    projectName: metadata.projectName,
    // 기록자 정보는 API 데이터 사용, username으로 표시
    recorder: usernames[articleData.authorId] || articleData.authorId,
    recordDate: formatDateTime(articleData.createdAt),
    recorderSignature: usernames[articleData.authorId] || articleData.authorId,
    // 점검자 정보: status가 APPROVED일 때는 API의 statusChangedBy/statusChangedAt 사용, 그 외에는 메타데이터 사용
    inspector: articleData.status === 'APPROVED' && articleData.statusChangedBy
      ? (usernames[articleData.statusChangedBy] || articleData.statusChangedBy)
      : metadata.inspector ? (usernames[metadata.inspector] || metadata.inspector) : undefined,
    inspectionDate: articleData.status === 'APPROVED' && articleData.statusChangedAt
      ? formatDateTime(articleData.statusChangedAt)
      : metadata.inspectionDate,
    inspectorSignature: articleData.status === 'APPROVED' && articleData.statusChangedBy
      ? (usernames[articleData.statusChangedBy] || articleData.statusChangedBy)
      : metadata.inspectorSignature ? (usernames[metadata.inspectorSignature] || metadata.inspectorSignature) : undefined,
    // 상태 정보
    status: articleData.status,
    attachments: articleData.files?.map(file => ({
      id: String(file.id),
      filename: file.originalFilename,
      size: `${(file.fileSize / 1024 / 1024).toFixed(2)}MB`,
      url: file.filePath,
      targetType: file.targetType, // 파일 다운로드용 (ARTICLE, COMMENT 등)
    })),
    prevArticle: neighborData?.prev ? {
      id: String(neighborData.prev.id),
      title: neighborData.prev.title,
    } : undefined,
    nextArticle: neighborData?.next ? {
      id: String(neighborData.next.id),
      title: neighborData.next.title,
    } : undefined,
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-white opacity-60 -z-10" />
      <Header title={siteConfig.title} />
      <Navigation items={navItems} onItemClick={handleNavClick} />
      <main className="flex-1 py-10">
        <ResearchDetailView 
          research={research} 
          onGoBack={handleGoBack}
          onNavigate={handleNavigate}
          onApprove={handleApprove}
        />
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
};

export default ResearchDetailPage;

