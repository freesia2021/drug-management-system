import React from 'react';
import { ArticleDetail } from '../../types';
import { filesService } from '../../services/files';

interface ArticleDetailViewProps {
  article: ArticleDetail;
  onGoBack: () => void;
  onNavigate?: (id: string) => void;
}

const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({ article, onGoBack, onNavigate }) => {
  const handleDownload = async (attachment: { id: string; filename: string; targetType?: string }) => {
    try {
      // /files/{type}/{id} 형식으로 다운로드 URL 생성
      const type = attachment.targetType || 'ARTICLE';
      const downloadUrl = `/api/orbit/files/${type}/${attachment.id}`;
      
      // Authorization 토큰 가져오기
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        alert('로그인이 필요합니다.');
        return;
      }

      // fetch로 파일 다운로드
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'accept': '*/*',
        },
      });

      if (!response.ok) {
        throw new Error('파일 다운로드 실패');
      }

      // Blob으로 변환
      const blob = await response.blob();
      
      // 다운로드 링크 생성
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.filename;
      document.body.appendChild(link);
      link.click();
      
      // 정리
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('파일 다운로드 오류:', error);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  const handleNavigateClick = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    }
  };

  // 연구일지 메타데이터 확인
  const hasMetadata = article.organization || article.projectName || article.period || article.project || article.equipment || article.department || article.researcher;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 게시글 제목 */}
      <h2 className="text-[26px] md:text-[30px] font-bold text-ink tracking-tight text-center pt-2 mb-8">
        {article.title}
      </h2>

      {/* 연구일지 메타데이터 (있는 경우만 표시) */}
      {hasMetadata && (
        <div className="bg-white border-t-2 border-navy-ink border-b border-[#c3ccd9] overflow-hidden mb-10">
          <div className="bg-[#f6f8fb] text-navy py-3 px-6 border-b border-[#c3ccd9]">
            <h3 className="text-lg font-bold text-center">
              The Laboratory Research Notebook
            </h3>
          </div>
          
          {article.organization && (
            <div className="flex border-b border-line">
              <div className="w-36 flex-shrink-0 bg-[#f6f8fb] border-r border-line flex items-center justify-center px-4 py-3">
                <span className="text-base font-medium text-gray-900">연구기관</span>
              </div>
              <div className="flex-1 px-4 py-3 text-base text-gray-900">
                {article.organization}
              </div>
            </div>
          )}

          {article.projectName && (
            <div className="flex border-b border-line">
              <div className="w-36 flex-shrink-0 bg-[#f6f8fb] border-r border-line flex items-center justify-center px-4 py-3">
                <span className="text-base font-medium text-gray-900">연구과제명</span>
              </div>
              <div className="flex-1 px-4 py-3 text-base text-gray-900">
                {article.projectName}
              </div>
            </div>
          )}

          {article.period && (
            <div className="flex border-b border-line">
              <div className="w-36 flex-shrink-0 bg-[#f6f8fb] border-r border-line flex items-center justify-center px-4 py-3">
                <span className="text-base font-medium text-gray-900">연구기간</span>
              </div>
              <div className="flex-1 px-4 py-3 text-base text-gray-900">
                {article.period}
              </div>
            </div>
          )}

          {article.project && (
            <div className="flex border-b border-line">
              <div className="w-36 flex-shrink-0 bg-[#f6f8fb] border-r border-line flex items-center justify-center px-4 py-3">
                <span className="text-base font-medium text-gray-900">프로젝트</span>
              </div>
              <div className="flex-1 px-4 py-3 text-base text-gray-900">
                {article.project}
              </div>
            </div>
          )}

          {article.equipment && (
            <div className="flex border-b border-line">
              <div className="w-36 flex-shrink-0 bg-[#f6f8fb] border-r border-line flex items-center justify-center px-4 py-3">
                <span className="text-base font-medium text-gray-900">장비명</span>
              </div>
              <div className="flex-1 px-4 py-3 text-base text-gray-900">
                {article.equipment}
              </div>
            </div>
          )}

          {article.department && (
            <div className="flex border-b border-line">
              <div className="w-36 flex-shrink-0 bg-[#f6f8fb] border-r border-line flex items-center justify-center px-4 py-3">
                <span className="text-base font-medium text-gray-900">부서명</span>
              </div>
              <div className="flex-1 px-4 py-3 text-base text-gray-900">
                {article.department}
              </div>
            </div>
          )}

          {article.researcher && (
            <div className="flex">
              <div className="w-36 flex-shrink-0 bg-[#f6f8fb] border-r border-line flex items-center justify-center px-4 py-3">
                <span className="text-base font-medium text-gray-900">연구자명</span>
              </div>
              <div className="flex-1 px-4 py-3 text-base text-gray-900">
                {article.researcher}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 게시글 정보 */}
      <div className="bg-[#f6f8fb] border-t-2 border-navy-ink border-b border-[#c3ccd9] mb-10">
        {/* 첫 번째 줄: 작성일 | 작성자 | 조회수 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-4 md:gap-0 p-4 md:p-0 md:h-12">
          {/* 작성일 */}
          <div className="flex items-center justify-center gap-2 flex-1">
            <span className="text-[15px] font-semibold text-gray-500">작성일</span>
            <span className="text-[15px] text-ink">{article.date}</span>
          </div>

          <div className="hidden md:block w-px h-3 bg-gray-300" />

          {/* 작성자 */}
          <div className="flex items-center justify-center gap-2 flex-1">
            <span className="text-[15px] font-semibold text-gray-500">작성자</span>
            <span className="text-[15px] text-ink">{article.author}</span>
          </div>

          <div className="hidden md:block w-px h-3 bg-gray-300" />

          {/* 조회수 */}
          <div className="flex items-center justify-center gap-2 flex-1">
            <span className="text-[15px] font-semibold text-gray-500">조회수</span>
            <span className="text-[15px] text-ink">{article.views}</span>
          </div>
        </div>

        {/* 두 번째 줄: 첨부파일 */}
        {article.attachments && article.attachments.length > 0 && (
          <div className="border-t border-gray-300 p-4 md:p-0 md:h-12 md:flex md:items-center md:justify-start md:pl-5">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold text-gray-500">첨부파일</span>
              <span 
                className="text-[15px] text-ink truncate max-w-xs"
                title={article.attachments[0].filename}
              >
                {article.attachments[0].filename}
              </span>
              <button
                onClick={() => handleDownload(article.attachments![0])}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-1 rounded text-sm font-medium flex items-center gap-1 transition-colors duration-200 ml-5"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 10.5L3.5 7L4.5 6L6.5 8V0H7.5V8L9.5 6L10.5 7L7 10.5Z" fill="currentColor"/>
                  <path d="M1 12V13H13V12H1Z" fill="currentColor"/>
                </svg>
                <span>다운로드</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 게시글 내용 */}
      <div className="mb-10 py-5">
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>

      {/* 이전글/다음글 네비게이션 */}
      <div className="mb-10">
        {article.prevArticle && (
          <div className="flex items-center gap-5 py-2 border-b border-gray-300">
            <span className="text-[15px] text-ink min-w-[60px]">이전글</span>
            <button 
              onClick={() => handleNavigateClick(article.prevArticle!.id)}
              className="text-[15px] font-semibold text-gray-500 hover:text-blue-600 transition-colors duration-200 text-left"
            >
              {article.prevArticle.title}
            </button>
          </div>
        )}

        {article.nextArticle && (
          <div className="flex items-center gap-5 py-2 border-b border-gray-300">
            <span className="text-[15px] text-ink min-w-[60px]">다음글</span>
            <button 
              onClick={() => handleNavigateClick(article.nextArticle!.id)}
              className="text-[15px] font-semibold text-gray-500 hover:text-blue-600 transition-colors duration-200 text-left"
            >
              {article.nextArticle.title}
            </button>
          </div>
        )}
      </div>

      {/* 목록 버튼 */}
      <div className="text-center">
        <button
          onClick={onGoBack}
          className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-900 px-5 py-2 rounded text-lg font-medium transition-all duration-200"
        >
          목록
        </button>
      </div>
    </div>
  );
};

export default ArticleDetailView;

