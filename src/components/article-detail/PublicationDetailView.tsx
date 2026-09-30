import React from 'react';

export interface PublicationDetail {
  id: string;
  title: string;
  author: string;
  date: string;
  views: number;
  content: string;
  // 관리 정보
  projectName?: string;
  laboratory?: string;
  researcher?: string;
  name?: string;
  inspector?: string;
  address?: string;
  storageLocation?: string;
  phone?: string;
  storagePeriod?: string;
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

interface PublicationDetailViewProps {
  publication: PublicationDetail;
  onGoBack: () => void;
  onNavigate?: (id: string) => void;
}

const PublicationDetailView: React.FC<PublicationDetailViewProps> = ({ 
  publication, 
  onGoBack,
  onNavigate 
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
      {/* 관리정보 섹션 */}
      <div className="max-w-[971px] mx-auto mb-6">
        {/* 헤더 */}
        <div className="w-full h-[50px] bg-[#466483] border border-[#dedede] flex items-center justify-center text-[18px] font-bold text-white">
          관리정보
        </div>
        
        {/* 폼 컨텐츠 */}
        <div className="w-full border border-[#dedede] border-t-0">
          <div className="flex flex-col gap-px">
            {/* 과제명 행 */}
            <div className="flex h-[45px]">
              <div className="w-[142px] h-[45px] bg-[#f3f3f3] border border-[#dedede] border-r-0 flex items-center justify-center text-[18px] font-normal text-black flex-shrink-0">
                과제명
              </div>
              <div className="flex-1 h-[45px] bg-white border border-[#dedede] px-3 flex items-center text-[16px] font-normal text-black">
                {publication.projectName || '-'}
              </div>
            </div>

            {/* 연구실 / 연구책임자 행 */}
            <div className="flex h-[45px] gap-px">
              <div className="flex flex-1 h-[45px]">
                <div className="w-[142px] h-[45px] bg-[#f3f3f3] border border-[#dedede] border-r-0 flex items-center justify-center text-[18px] font-normal text-black flex-shrink-0">
                  연구실
                </div>
                <div className="flex-1 h-[45px] bg-white border border-[#dedede] px-3 flex items-center text-[16px] font-normal text-black">
                  {publication.laboratory || '-'}
                </div>
              </div>
              <div className="flex flex-1 h-[45px]">
                <div className="w-[142px] h-[45px] bg-[#f3f3f3] border border-[#dedede] border-r-0 flex items-center justify-center text-[18px] font-normal text-black flex-shrink-0">
                  연구책임자
                </div>
                <div className="flex-1 h-[45px] bg-white border border-[#dedede] px-3 flex items-center text-[16px] font-normal text-black">
                  {publication.researcher || '-'}
                </div>
              </div>
            </div>

            {/* 이름 / 점검자 행 */}
            <div className="flex h-[45px] gap-px">
              <div className="flex flex-1 h-[45px]">
                <div className="w-[142px] h-[45px] bg-[#f3f3f3] border border-[#dedede] border-r-0 flex items-center justify-center text-[18px] font-normal text-black flex-shrink-0">
                  이름
                </div>
                <div className="flex-1 h-[45px] bg-white border border-[#dedede] px-3 flex items-center text-[16px] font-normal text-black">
                  {publication.name || '-'}
                </div>
              </div>
              <div className="flex flex-1 h-[45px]">
                <div className="w-[142px] h-[45px] bg-[#f3f3f3] border border-[#dedede] border-r-0 flex items-center justify-center text-[18px] font-normal text-black flex-shrink-0">
                  점검자
                </div>
                <div className="flex-1 h-[45px] bg-white border border-[#dedede] px-3 flex items-center text-[16px] font-normal text-black">
                  {publication.inspector || '-'}
                </div>
              </div>
            </div>

            {/* 주소 / 보관장소 행 */}
            <div className="flex h-[45px] gap-px">
              <div className="flex flex-1 h-[45px]">
                <div className="w-[142px] h-[45px] bg-[#f3f3f3] border border-[#dedede] border-r-0 flex items-center justify-center text-[18px] font-normal text-black flex-shrink-0">
                  주소
                </div>
                <div className="flex-1 h-[45px] bg-white border border-[#dedede] px-3 flex items-center text-[16px] font-normal text-black">
                  {publication.address || '-'}
                </div>
              </div>
              <div className="flex flex-1 h-[45px]">
                <div className="w-[142px] h-[45px] bg-[#f3f3f3] border border-[#dedede] border-r-0 flex items-center justify-center text-[18px] font-normal text-black flex-shrink-0">
                  보관장소
                </div>
                <div className="flex-1 h-[45px] bg-white border border-[#dedede] px-3 flex items-center text-[16px] font-normal text-black">
                  {publication.storageLocation || '-'}
                </div>
              </div>
            </div>

            {/* 전화 / 보관기간 행 */}
            <div className="flex h-[45px] gap-px">
              <div className="flex flex-1 h-[45px]">
                <div className="w-[142px] h-[45px] bg-[#f3f3f3] border border-[#dedede] border-r-0 flex items-center justify-center text-[18px] font-normal text-black flex-shrink-0">
                  전화
                </div>
                <div className="flex-1 h-[45px] bg-white border border-[#dedede] px-3 flex items-center text-[16px] font-normal text-black">
                  {publication.phone || '-'}
                </div>
              </div>
              <div className="flex flex-1 h-[45px]">
                <div className="w-[142px] h-[45px] bg-[#f3f3f3] border border-[#dedede] border-r-0 flex items-center justify-center text-[18px] font-normal text-black flex-shrink-0">
                  보관기간
                </div>
                <div className="flex-1 h-[45px] bg-white border border-[#dedede] px-3 flex items-center text-[16px] font-normal text-black">
                  {publication.storagePeriod || '-'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 상세 내용 섹션 */}
      <div className="max-w-[971px] mx-auto mb-6">
        <div className="w-full h-[50px] bg-[#466483] border border-[#dedede] flex items-center justify-center text-[18px] font-bold text-white">
          상세 내용
        </div>
        <div className="w-full border border-[#dedede] border-t-0 bg-white p-6">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: publication.content }}
          />
        </div>
      </div>

      {/* 첨부파일 및 버튼 */}
      {publication.attachments && publication.attachments.length > 0 && (
        <div className="max-w-[971px] mx-auto flex justify-end gap-3 mb-6">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
          >
            인쇄
          </button>
          <button
            onClick={() => handleDownload(publication.attachments![0])}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
          >
            원문열람
          </button>
          <button
            onClick={() => handleDownload(publication.attachments![0])}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
          >
            자료다운로드
          </button>
        </div>
      )}

      {/* 이전글/다음글 네비게이션 */}
      <div className="max-w-[971px] mx-auto mb-10">
        {publication.prevArticle && (
          <div className="flex items-center gap-5 py-2 border-b border-gray-300">
            <span className="text-lg text-gray-900 min-w-[60px]">이전글</span>
            <button 
              onClick={() => handleNavigateClick(publication.prevArticle!.id)}
              className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200 text-left"
            >
              {publication.prevArticle.title}
            </button>
          </div>
        )}

        {publication.nextArticle && (
          <div className="flex items-center gap-5 py-2 border-b border-gray-300">
            <span className="text-lg text-gray-900 min-w-[60px]">다음글</span>
            <button 
              onClick={() => handleNavigateClick(publication.nextArticle!.id)}
              className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200 text-left"
            >
              {publication.nextArticle.title}
            </button>
          </div>
        )}
      </div>

      {/* 목록 버튼 */}
      <div className="text-center max-w-[971px] mx-auto">
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

export default PublicationDetailView;

