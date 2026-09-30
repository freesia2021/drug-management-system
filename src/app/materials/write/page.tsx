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

const BOARD_ID = 1; // 자료관리 boardId

const MaterialWritePage: React.FC = () => {
  const router = useRouter();
  const [navItems] = useAtom(navItemsAtom);
  const [footerLinks] = useAtom(footerLinksAtom);
  const [footerButtons] = useAtom(footerButtonsAtom);
  const [siteConfig] = useAtom(siteConfigAtom);
  const createArticleMutation = useCreateArticle();

  const [formData, setFormData] = useState({
    title: '',
    project: '',
    equipment: '',
    researchDate: '',
    content: '',
  });

  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNavClick = () => {};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!formData.project.trim()) {
      alert('프로젝트를 입력해주세요.');
      return;
    }
    if (!formData.equipment.trim()) {
      alert('장비명을 입력해주세요.');
      return;
    }
    if (!formData.researchDate) {
      alert('연구수행일자를 선택해주세요.');
      return;
    }

    if (createArticleMutation.isPending) return;
    
    setIsSubmitting(true);

    try {
      // 메타데이터 객체 생성
      const metadata = {
        project: formData.project,
        equipment: formData.equipment,
        researchDate: formData.researchDate,
      };

      // content에 메타데이터 + 본문 합치기
      const fullContent = `<div class="material-metadata" style="display:none;" data-metadata='${JSON.stringify(metadata)}'></div><div class="material-content">${formData.content || ''}</div>`;

      // 1. 첨부파일이 있으면 먼저 업로드
      let fileIds: number[] = [];
      if (attachedFiles.length > 0) {
        const uploadedFiles = await filesService.uploadFiles('article', attachedFiles);
        fileIds = uploadedFiles.map(file => file.id);
      }

      // 2. 게시글 작성 API 호출 (제목에 [자료관리] prefix 추가)
      const titleWithPrefix = formData.title.startsWith('[자료관리]') 
        ? formData.title 
        : `[자료관리] ${formData.title}`;
      
      await createArticleMutation.mutateAsync({
        boardId: BOARD_ID,
        data: {
          title: titleWithPrefix,
          content: fullContent,
          fileIds: fileIds.length > 0 ? fileIds : undefined,
        },
      });

      // 3. 성공 시 목록으로 이동 (캐시 무효화로 자동 refetch됨)
      alert('자료가 성공적으로 저장되었습니다.');
      router.replace('/materials');
    } catch (error) {
      console.error('자료 저장 실패:', error);
      alert('자료 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm('작성을 취소하시겠습니까? 작성 중인 내용은 저장되지 않습니다.')) {
      router.push('/materials');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-white opacity-60 -z-10" />
      
      <Header title={siteConfig.title} />
      <Navigation items={navItems} onItemClick={handleNavClick} />
      
      <main className="flex-1 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">자료관리 작성</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 기본 정보 섹션 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-slate-600 px-6 py-3 border-b border-gray-200">
                <h3 className="text-lg font-bold text-white">기본 정보</h3>
              </div>
              
              <div className="p-6 space-y-4">
                {/* 제목 */}
                <div className="flex flex-col gap-2">
                  <label className="flex items-center min-h-[45px] border border-gray-200 rounded">
                    <span className="w-36 bg-gray-100 h-full flex items-center justify-center border-r border-gray-200 font-medium text-gray-700">
                      제목 *
                    </span>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="제목을 입력하세요"
                    />
                  </label>
                </div>

                {/* 프로젝트 */}
                <div className="flex flex-col gap-2">
                  <label className="flex items-center min-h-[45px] border border-gray-200 rounded">
                    <span className="w-36 bg-gray-100 h-full flex items-center justify-center border-r border-gray-200 font-medium text-gray-700">
                      프로젝트 *
                    </span>
                    <input
                      type="text"
                      name="project"
                      value={formData.project}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="프로젝트명을 입력하세요"
                    />
                  </label>
                </div>

                {/* 장비명 */}
                <div className="flex flex-col gap-2">
                  <label className="flex items-center min-h-[45px] border border-gray-200 rounded">
                    <span className="w-36 bg-gray-100 h-full flex items-center justify-center border-r border-gray-200 font-medium text-gray-700">
                      장비명 *
                    </span>
                    <input
                      type="text"
                      name="equipment"
                      value={formData.equipment}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="장비명을 입력하세요"
                    />
                  </label>
                </div>

                {/* 연구수행일자 */}
                <div className="flex flex-col gap-2">
                  <label className="flex items-center min-h-[45px] border border-gray-200 rounded">
                    <span className="w-36 bg-gray-100 h-full flex items-center justify-center border-r border-gray-200 font-medium text-gray-700">
                      연구수행일자 *
                    </span>
                    <input
                      type="date"
                      name="researchDate"
                      value={formData.researchDate}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* 상세 내용 섹션 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-6">
              <div className="bg-slate-600 px-6 py-3 border-b border-gray-200">
                <h3 className="text-lg font-bold text-white">상세 내용</h3>
              </div>
              
              <div className="p-6">
                <RichTextEditor
                  content={formData.content}
                  onChange={handleContentChange}
                  onFilesChange={handleFilesChange}
                  placeholder="자료에 대한 상세한 내용을 입력하세요"
                />
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="flex justify-center gap-4">
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

export default MaterialWritePage;

