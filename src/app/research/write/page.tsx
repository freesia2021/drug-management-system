'use client';

import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import Header from '../../../components/header/Header';
import Navigation from '../../../components/navigation/Navigation';
import Footer from '../../../components/footer/Footer';
import { RichTextEditor } from '../../../components/rich-text-editor';
import { filesService } from '../../../services/files';
import { useCreateArticle } from '../../../hooks/queries/articles';
import { 
  navItemsAtom, 
  footerLinksAtom, 
  footerButtonsAtom,
  siteConfigAtom 
} from '../../../store';

const ResearchWritePage: React.FC = () => {
  const router = useRouter();
  const [navItems] = useAtom(navItemsAtom);
  const [footerLinks] = useAtom(footerLinksAtom);
  const [footerButtons] = useAtom(footerButtonsAtom);
  const [siteConfig] = useAtom(siteConfigAtom);
  const createArticleMutation = useCreateArticle();

  const [formData, setFormData] = useState({
    projectName: '',
    title: '',
    recorder: '',
    recordDate: '',
    recorderSignature: '',
    inspector: '',
    inspectionDate: '',
    inspectorSignature: '',
    content: '',
  });

  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNavClick = () => {};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content,
    }));
  };

  const handleFilesChange = (files: File[]) => {
    setAttachedFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!formData.projectName.trim()) {
      alert('과제명을 입력해주세요.');
      return;
    }
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!formData.content || formData.content === '<p></p>') {
      alert('상세 내용을 입력해주세요.');
      return;
    }

    if (createArticleMutation.isPending) return;
    
    setIsSubmitting(true);

    try {
      // 메타데이터 객체 생성
      const metadata = {
        projectName: formData.projectName,
        title: formData.title,
        recorder: formData.recorder,
        recordDate: formData.recordDate,
        recorderSignature: formData.recorderSignature,
        inspector: formData.inspector,
        inspectionDate: formData.inspectionDate,
        inspectorSignature: formData.inspectorSignature,
      };

      // content에 메타데이터 + 본문 합치기
      const fullContent = `<div class="research-metadata" style="display:none;" data-metadata='${JSON.stringify(metadata)}'></div><div class="research-content">${formData.content}</div>`;

      // 1. 첨부파일이 있으면 먼저 업로드
      let fileIds: number[] = [];
      if (attachedFiles.length > 0) {
        const uploadedFiles = await filesService.uploadFiles('article', attachedFiles);
        fileIds = uploadedFiles.map(file => file.id);
      }

      // 2. 게시글 작성 API 호출
      const BOARD_ID = 3; // 연구승인 boardId
      await createArticleMutation.mutateAsync({
        boardId: BOARD_ID,
        data: {
          title: formData.title,
          content: fullContent,
          fileIds: fileIds.length > 0 ? fileIds : undefined,
        },
      });

      // 3. 성공 시 목록으로 이동 (캐시 무효화로 자동 refetch됨)
      alert('연구승인이 성공적으로 저장되었습니다.');
      router.replace('/research');
    } catch (error) {
      console.error('연구승인 저장 실패:', error);
      alert('연구승인 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm('작성을 취소하시겠습니까? 작성 중인 내용은 저장되지 않습니다.')) {
      router.push('/research');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      <Header title={siteConfig.title} />
      <Navigation items={navItems} onItemClick={handleNavClick} />
      
      <main className="flex-1 py-12 md:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">연구승인 작성</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-0">
            {/* 기본 정보 섹션 - panel */}
            <div className="max-w-[971px] mx-auto border border-[#dedede]">
              {/* 과제명 */}
              <div className="grid grid-cols-[142px_1fr]">
                <div className="bg-[#f3f3f3] border-r border-b border-[#dedede] h-[45px] flex items-center justify-center text-[18px] font-normal text-black">
                  과제명
                </div>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  className="border-b border-[#dedede] h-[45px] px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder=""
                />
              </div>
              {/* 제목 */}
              <div className="grid grid-cols-[142px_1fr]">
                <div className="bg-[#f3f3f3] border-r border-b border-[#dedede] h-[45px] flex items-center justify-center text-[18px] font-normal text-black">
                  제목
                </div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="border-b border-[#dedede] h-[45px] px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder=""
                />
              </div>
            </div>

            {/* Rich Text Editor 섹션 */}
            <div className="max-w-[971px] mx-auto my-8">
              <RichTextEditor
                content={formData.content}
                onChange={handleContentChange}
                onFilesChange={handleFilesChange}
                placeholder="연구과제에 대한 상세한 내용을 입력하세요"
              />
            </div>

            {/* 서명 테이블 섹션 - signature-table */}
            <div className="max-w-[971px] mx-auto">
              {/* 기록자 행 */}
              <div className="grid grid-cols-[142px_1fr_142px_1fr_142px_1fr] border-t border-[#dedede]">
                <div className="bg-[#f3f3f3] border-r border-b border-[#dedede] h-[45px] flex items-center justify-center text-[18px] font-normal text-black">
                  기록자
                </div>
                <input
                  type="text"
                  name="recorder"
                  value={formData.recorder}
                  onChange={handleInputChange}
                  className="border-r border-b border-[#dedede] h-[45px] px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder=""
                />
                <div className="bg-[#f3f3f3] border-r border-b border-[#dedede] h-[45px] flex items-center justify-center text-[18px] font-normal text-black">
                  작성일
                </div>
                <input
                  type="date"
                  name="recordDate"
                  value={formData.recordDate}
                  onChange={handleInputChange}
                  className="border-r border-b border-[#dedede] h-[45px] px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="bg-[#f3f3f3] border-r border-b border-[#dedede] h-[45px] flex items-center justify-center text-[18px] font-normal text-black">
                  서명
                </div>
                <input
                  type="text"
                  name="recorderSignature"
                  value={formData.recorderSignature}
                  onChange={handleInputChange}
                  className="border-b border-[#dedede] h-[45px] px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder=""
                />
              </div>

              {/* 점검자 행 */}
              <div className="grid grid-cols-[142px_1fr_142px_1fr_142px_1fr]">
                <div className="bg-[#f3f3f3] border-r border-b border-[#dedede] h-[45px] flex items-center justify-center text-[18px] font-normal text-black">
                  점검자
                </div>
                <input
                  type="text"
                  name="inspector"
                  value={formData.inspector}
                  onChange={handleInputChange}
                  className="border-r border-b border-[#dedede] h-[45px] px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder=""
                />
                <div className="bg-[#f3f3f3] border-r border-b border-[#dedede] h-[45px] flex items-center justify-center text-[18px] font-normal text-black">
                  점검일
                </div>
                <input
                  type="date"
                  name="inspectionDate"
                  value={formData.inspectionDate}
                  onChange={handleInputChange}
                  className="border-r border-b border-[#dedede] h-[45px] px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="bg-[#f3f3f3] border-r border-b border-[#dedede] h-[45px] flex items-center justify-center text-[18px] font-normal text-black">
                  서명
                </div>
                <input
                  type="text"
                  name="inspectorSignature"
                  value={formData.inspectorSignature}
                  onChange={handleInputChange}
                  className="border-b border-[#dedede] h-[45px] px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder=""
                />
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="flex justify-center gap-4 p-6 bg-gray-50 mt-8">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '등록 중...' : '등록'}
              </button>
            </div>
          </form>
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
};

export default ResearchWritePage;

