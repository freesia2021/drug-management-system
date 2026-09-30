'use client';

import React from 'react';
import { useAtom } from 'jotai';
import { useRouter, useParams } from 'next/navigation';
import Header from '../../../components/header/Header';
import Navigation from '../../../components/navigation/Navigation';
import Footer from '../../../components/footer/Footer';
import { ArticleDetailView } from '../../../components/article-detail';
import { ArticleDetail } from '../../../types';
import { useArticle, useArticleNeighbor } from '../../../hooks/queries/articles';
import { 
  navItemsAtom, 
  footerLinksAtom, 
  footerButtonsAtom,
  siteConfigAtom 
} from '../../../store';

const BOARD_ID = 2; // 연구일지 boardId

const ResearchJournalDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const articleId = parseInt(params?.id as string);

  const [navItems] = useAtom(navItemsAtom);
  const [footerLinks] = useAtom(footerLinksAtom);
  const [footerButtons] = useAtom(footerButtonsAtom);
  const [siteConfig] = useAtom(siteConfigAtom);

  // API에서 게시글 상세 정보 가져오기
  const { data: articleData, isLoading, error } = useArticle(BOARD_ID, articleId);
  const { data: neighborData } = useArticleNeighbor(BOARD_ID, articleId);

  const handleNavClick = () => {};
  const handleGoBack = () => router.push('/research-journal');
  const handleNavigate = (id: string) => router.push(`/research-journal/${id}`);

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

  // content에서 메타데이터와 본문 추출
  const extractMetadata = (content: string) => {
    try {
      // DOMParser로 HTML 파싱
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      
      // 메타데이터 추출
      const metadataEl = doc.querySelector('.research-journal-metadata');
      const metadata = metadataEl 
        ? JSON.parse(metadataEl.getAttribute('data-metadata') || '{}')
        : {};
      
      // 실제 본문 내용 추출
      const contentEl = doc.querySelector('.research-journal-content');
      const actualContent = contentEl?.innerHTML || content;
      
      return { metadata, actualContent };
    } catch (error) {
      console.error('메타데이터 추출 실패:', error);
      return { metadata: {}, actualContent: content };
    }
  };

  const { metadata, actualContent } = extractMetadata(articleData.content);

  // API 데이터를 ArticleDetail 형식으로 변환
  const article: ArticleDetail = {
    id: String(articleData.id),
    title: articleData.title,
    author: articleData.authorId,
    date: articleData.createdAt.split('T')[0],
    views: articleData.viewCount,
    content: actualContent,
    // 메타데이터 추가
    organization: metadata.organization,
    projectName: metadata.projectName,
    period: metadata.period,
    project: metadata.project,
    equipment: metadata.equipment,
    department: metadata.department,
    researcher: metadata.researcher,
    attachments: articleData.files?.map(file => ({
      id: String(file.id),
      filename: file.originalFilename,
      size: `${(file.fileSize / 1024 / 1024).toFixed(2)}MB`,
      url: file.filePath,
      targetType: file.targetType, // 파일 다운로드용
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
        <ArticleDetailView article={article} onGoBack={handleGoBack} onNavigate={handleNavigate} />
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

export default ResearchJournalDetailPage;

