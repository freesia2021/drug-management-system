import React from 'react';

export interface ResearchDetail {
  id: string;
  title: string;
  author: string;
  date: string;
  views: number;
  content: string;
  // 기본 정보
  projectName?: string;
  // 서명 정보
  recorder?: string;
  recordDate?: string;
  recorderSignature?: string;
  inspector?: string;
  inspectionDate?: string;
  inspectorSignature?: string;
  // 상태 정보
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  // 첨부파일
  attachments?: Array<{
    id: string;
    filename: string;
    size: string;
    url: string;
    targetType?: string; // 파일 다운로드용
  }>;
  // 이전글/다음글
  prevArticle?: {
    id: string;
    title: string;
  };
  nextArticle?: {
    id: string;
    title: string;
  };
}

interface ResearchDetailViewProps {
  research: ResearchDetail;
  onGoBack: () => void;
  onNavigate?: (id: string) => void;
  onApprove?: () => void;
}

const ResearchDetailView: React.FC<ResearchDetailViewProps> = ({ 
  research, 
  onGoBack,
  onNavigate,
  onApprove
}) => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 기본 정보 섹션 - panel */}
      <div className="max-w-[971px] mx-auto border border-[#dedede] mb-8">
        {/* 과제명 */}
        <div className="grid grid-cols-[142px_1fr]">
          <div className="bg-[#f3f3f3] border-r border-b border-[#dedede] h-[45px] flex items-center justify-center text-[18px] font-normal text-black">
            과제명
          </div>
          <div className="border-b border-[#dedede] h-[45px] flex items-center px-3 text-black">
            {research.projectName || '-'}
          </div>
        </div>
        {/* 제목 */}
        <div className="grid grid-cols-[142px_1fr]">
          <div className="bg-[#f3f3f3] border-r border-b border-[#dedede] h-[45px] flex items-center justify-center text-[18px] font-normal text-black">
            제목
          </div>
          <div className="border-b border-[#dedede] h-[45px] flex items-center px-3 text-black font-medium">
            {research.title}
          </div>
        </div>
      </div>

      {/* 게시글 내용 */}
      <div className="max-w-[971px] mx-auto my-8">
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: research.content }}
        />
      </div>

      {/* 서명 테이블 섹션 - signature-table */}
      <div className="max-w-[971px] mx-auto mb-6">
        {/* 기록자 행 */}
        <div className="grid grid-cols-[142px_1fr_142px_1fr_142px_1fr] border-t border-[#dedede]">
          <div className="bg-[#f3f3f3] border-r border-b border-[#dedede] h-[45px] flex items-center justify-center text-[18px] font-normal text-black">
            기록자
          </div>
          <div className="border-r border-b border-[#dedede] h-[45px] flex items-center px-3 text-black">
            {research.recorder || '-'}
          </div>
          <div className="bg-[#f3f3f3] border-r border-b border-[#dedede] h-[45px] flex items-center justify-center text-[18px] font-normal text-black">
            작성일
          </div>
          <div className="border-r border-b border-[#dedede] h-[45px] flex items-center px-3 text-black">
            {research.recordDate || '-'}
          </div>
          <div className="bg-[#f3f3f3] border-r border-b border-[#dedede] h-[45px] flex items-center justify-center text-[18px] font-normal text-black">
            서명
          </div>
          <div className="border-b border-[#dedede] h-[45px] flex items-center px-3 text-black">
            {research.recorderSignature || '-'}
          </div>
        </div>

        {/* 점검자 행 */}
        <div className="grid grid-cols-[142px_1fr_142px_1fr_142px_1fr]">
          <div className="bg-[#f3f3f3] border-r border-b border-[#dedede] h-[45px] flex items-center justify-center text-[18px] font-normal text-black">
            점검자
          </div>
          <div className="border-r border-b border-[#dedede] h-[45px] flex items-center px-3 text-black">
            {research.inspector || '-'}
          </div>
          <div className="bg-[#f3f3f3] border-r border-b border-[#dedede] h-[45px] flex items-center justify-center text-[18px] font-normal text-black">
            점검일
          </div>
          <div className="border-r border-b border-[#dedede] h-[45px] flex items-center px-3 text-black">
            {research.inspectionDate || '-'}
          </div>
          <div className="bg-[#f3f3f3] border-r border-b border-[#dedede] h-[45px] flex items-center justify-center text-[18px] font-normal text-black">
            서명
          </div>
          <div className="border-b border-[#dedede] h-[45px] flex items-center px-3 text-black">
            {research.inspectorSignature ? (
              <span>{research.inspectorSignature}</span>
            ) : research.status === 'APPROVED' ? (
              <span>승인완료</span>
            ) : (
              onApprove && (
                <button
                  onClick={onApprove}
                  className="px-4 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
                >
                  승인
                </button>
              )
            )}
            {!research.inspectorSignature && research.status !== 'APPROVED' && !onApprove && '-'}
          </div>
        </div>
      </div>

      {/* 첨부파일 및 버튼 */}
      {research.attachments && research.attachments.length > 0 && (
        <div className="max-w-[971px] mx-auto flex justify-end gap-3 mb-6">
          <button
            onClick={() => window.print()}
            className="h-[26px] bg-white border border-[#ededed] px-3 text-[12px] hover:bg-gray-50 transition-colors"
          >
            인쇄
          </button>
          <button
            onClick={() => handleDownload(research.attachments![0])}
            className="h-[26px] bg-white border border-[#ededed] px-3 text-[12px] hover:bg-gray-50 transition-colors"
          >
            자료다운로드
          </button>
        </div>
      )}

      {/* 이전글/다음글 네비게이션 */}
      <div className="max-w-[971px] mx-auto mb-10">
        {research.prevArticle && (
          <div className="flex items-center gap-5 py-3 border-b border-[#dedede]">
            <span className="text-[18px] text-black min-w-[60px]">이전글</span>
            <button 
              onClick={() => handleNavigateClick(research.prevArticle!.id)}
              className="text-[18px] font-normal text-black hover:text-blue-600 transition-colors text-left flex-1"
            >
              {research.prevArticle.title}
            </button>
          </div>
        )}

        {research.nextArticle && (
          <div className="flex items-center gap-5 py-3 border-b border-[#dedede]">
            <span className="text-[18px] text-black min-w-[60px]">다음글</span>
            <button 
              onClick={() => handleNavigateClick(research.nextArticle!.id)}
              className="text-[18px] font-normal text-black hover:text-blue-600 transition-colors text-left flex-1"
            >
              {research.nextArticle.title}
            </button>
          </div>
        )}
      </div>

      {/* 목록 버튼 */}
      <div className="text-center">
        <button
          onClick={onGoBack}
          className="h-[26px] bg-white border border-[#ededed] px-4 text-[12px] hover:bg-gray-50 transition-colors"
        >
          목록
        </button>
      </div>
    </div>
  );
};

export default ResearchDetailView;

