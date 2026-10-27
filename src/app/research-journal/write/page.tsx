'use client';

import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
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

interface DecodedToken {
  userId: number;
  username: string;
  name: string;
  email: string;
  roleId: number;
  iat: number;
  exp: number;
}

const ResearchJournalWritePage: React.FC = () => {
  const router = useRouter();
  const [navItems] = useAtom(navItemsAtom);
  const [footerLinks] = useAtom(footerLinksAtom);
  const [footerButtons] = useAtom(footerButtonsAtom);
  const [siteConfig] = useAtom(siteConfigAtom);
  const createArticleMutation = useCreateArticle();

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    projectName: '',
    period: '',
    project: '',
    equipment: '',
    department: '',
    researcher: '',
    content: '',
  });
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 로그인한 사용자 정보로 연구자명 자동 채우기
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(accessToken);
        setFormData(prev => ({
          ...prev,
          researcher: decoded.name || decoded.username || '',
        }));
      } catch (error) {
        console.error('토큰 디코딩 실패:', error);
      }
    }
  }, []);

  const handleNavClick = () => {};

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
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
    
    // 유효성 검사
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!formData.organization) {
      alert('연구기관을 입력해주세요.');
      return;
    }
    if (!formData.projectName) {
      alert('연구과제명을 입력해주세요.');
      return;
    }
    if (!formData.researcher) {
      alert('연구자명을 입력해주세요.');
      return;
    }
    if (!formData.content || formData.content === '<p></p>') {
      alert('상세 내용을 입력해주세요.');
      return;
    }

    if (createArticleMutation.isPending) return;
    
    setIsSubmitting(true);

    try {
      // 디버깅: 토큰 확인
      const token = localStorage.getItem('accessToken');
      console.log('🔑 accessToken 존재 여부:', !!token);
      if (token) {
        console.log('🔑 Token 길이:', token.length);
        console.log('🔑 Token 시작:', token.substring(0, 20) + '...');
      }

      // 메타데이터 객체 생성
      const metadata = {
        organization: formData.organization,
        projectName: formData.projectName,
        period: formData.period,
        project: formData.project,
        equipment: formData.equipment,
        department: formData.department,
        researcher: formData.researcher,
      };

      // content에 메타데이터 + 본문 합치기
      const fullContent = `<div class="research-journal-metadata" style="display:none;" data-metadata='${JSON.stringify(metadata)}'></div><div class="research-journal-content">${formData.content}</div>`;

      // 1. 첨부파일이 있으면 먼저 업로드
      let fileIds: number[] = [];
      if (attachedFiles.length > 0) {
        const uploadedFiles = await filesService.uploadFiles('article', attachedFiles);
        fileIds = uploadedFiles.map(file => file.id);
      }

      // 2. 게시글 작성 API 호출
      const BOARD_ID = 2; // 연구일지 boardId
      await createArticleMutation.mutateAsync({
        boardId: BOARD_ID,
        data: {
          title: formData.title,
          content: fullContent,
          fileIds: fileIds.length > 0 ? fileIds : undefined,
        },
      });

      // 3. 성공 시 목록으로 이동 (캐시 무효화로 자동 refetch됨)
      alert('연구일지가 성공적으로 저장되었습니다.');
      router.replace('/research-journal');
    } catch (error) {
      console.error('연구일지 저장 실패:', error);
      alert('연구일지 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm('작성을 취소하시겠습니까? 작성한 내용은 저장되지 않습니다.')) {
      router.push('/research-journal');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 헤더 */}
      <Header title={siteConfig.title} />
      
      {/* 네비게이션 */}
      <Navigation items={navItems} onItemClick={handleNavClick} />
      
      
      {/* 메인 콘텐츠 */}
      <main className="flex-1 py-12 md:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-8">
            <div className="bg-blue-700 text-white py-3 px-6 rounded-t-lg">
              <h2 className="text-lg font-bold text-center">
                The Laboratory Research Notebook
              </h2>
            </div>
          </div>

          {/* 연구일지 작성 폼 */}
          <form onSubmit={handleSubmit} className="bg-white border border-gray-300 rounded-b-lg overflow-hidden">
            {/* 연구기관 */}
            <div className="flex border-b border-gray-300">
              <div className="w-36 flex-shrink-0 bg-gray-100 border-r border-gray-300 flex items-center justify-center px-4 py-3">
                <label className="text-base font-medium text-gray-900">
                  연구기관
                </label>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                  className="w-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  placeholder="연구기관명을 입력하세요"
                />
              </div>
            </div>

            {/* 연구과제명 */}
            <div className="flex border-b border-gray-300">
              <div className="w-36 flex-shrink-0 bg-gray-100 border-r border-gray-300 flex items-center justify-center px-4 py-3">
                <label className="text-base font-medium text-gray-900">
                  연구과제명
                </label>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  className="w-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  placeholder="연구과제명을 입력하세요"
                />
              </div>
            </div>

            {/* 연구기간 */}
            <div className="flex border-b border-gray-300">
              <div className="w-36 flex-shrink-0 bg-gray-100 border-r border-gray-300 flex items-center justify-center px-4 py-3">
                <label className="text-base font-medium text-gray-900">
                  연구기간
                </label>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.period}
                  onChange={(e) => handleInputChange('period', e.target.value)}
                  className="w-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  placeholder="예: 2025.01.01 ~ 2025.12.31"
                />
              </div>
            </div>

            {/* 프로젝트 */}
            <div className="flex border-b border-gray-300">
              <div className="w-36 flex-shrink-0 bg-gray-100 border-r border-gray-300 flex items-center justify-center px-4 py-3">
                <label className="text-base font-medium text-gray-900">
                  프로젝트
                </label>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.project}
                  onChange={(e) => handleInputChange('project', e.target.value)}
                  className="w-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  placeholder="프로젝트명을 입력하세요"
                />
              </div>
            </div>

            {/* 장비명 */}
            <div className="flex border-b border-gray-300">
              <div className="w-36 flex-shrink-0 bg-gray-100 border-r border-gray-300 flex items-center justify-center px-4 py-3">
                <label className="text-base font-medium text-gray-900">
                  장비명
                </label>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.equipment}
                  onChange={(e) => handleInputChange('equipment', e.target.value)}
                  className="w-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  placeholder="장비명을 입력하세요"
                />
              </div>
            </div>

            {/* 부서명 */}
            <div className="flex border-b border-gray-300">
              <div className="w-36 flex-shrink-0 bg-gray-100 border-r border-gray-300 flex items-center justify-center px-4 py-3">
                <label className="text-base font-medium text-gray-900">
                  부서명
                </label>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  placeholder="부서명을 입력하세요"
                />
              </div>
            </div>

            {/* 연구자명 */}
            <div className="flex border-b border-gray-300">
              <div className="w-36 flex-shrink-0 bg-gray-100 border-r border-gray-300 flex items-center justify-center px-4 py-3">
                <label className="text-base font-medium text-gray-900">
                  연구자명
                </label>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.researcher}
                  onChange={(e) => handleInputChange('researcher', e.target.value)}
                  className="w-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  placeholder="연구자명을 입력하세요"
                />
              </div>
            </div>

            {/* 제목 */}
            <div className="flex border-b border-gray-300">
              <div className="w-36 flex-shrink-0 bg-gray-100 border-r border-gray-300 flex items-center justify-center px-4 py-3">
                <label className="text-base font-medium text-gray-900">
                  제목
                </label>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  placeholder="제목을 입력하세요"
                />
              </div>
            </div>

            {/* 상세 내용 입력 영역 - Rich Text Editor */}
            <div className="p-4">
              <RichTextEditor
                content={formData.content}
                onChange={handleContentChange}
                onFilesChange={handleFilesChange}
                placeholder="연구에 대한 상세한 내용을 입력하세요"
              />
            </div>

            {/* 버튼 영역 */}
            <div className="flex justify-center gap-4 p-6 bg-gray-50">
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
                {isSubmitting ? '저장 중...' : '저장'}
              </button>
            </div>
          </form>
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

export default ResearchJournalWritePage;

