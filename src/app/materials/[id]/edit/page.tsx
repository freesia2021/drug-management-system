'use client';

import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { useRouter, useParams } from 'next/navigation';
import Header from '../../../../components/header/Header';
import Navigation from '../../../../components/navigation/Navigation';
import Footer from '../../../../components/footer/Footer';
import { articlesService } from '../../../../services/articles';
import { useArticle } from '../../../../hooks/queries/articles';
import { 
  navItemsAtom, 
  footerLinksAtom, 
  footerButtonsAtom,
  siteConfigAtom 
} from '../../../../store';

const BOARD_ID = 1; // 자료관리 boardId

const MaterialEditPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const articleId = parseInt(params?.id as string);

  const [navItems] = useAtom(navItemsAtom);
  const [footerLinks] = useAtom(footerLinksAtom);
  const [footerButtons] = useAtom(footerButtonsAtom);
  const [siteConfig] = useAtom(siteConfigAtom);

  const [formData, setFormData] = useState({
    title: '',
    project: '',
    equipment: '',
    researchDate: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 기존 게시글 데이터 가져오기
  const { data: articleData, isLoading } = useArticle(BOARD_ID, articleId);

  useEffect(() => {
    if (articleData) {
      // content에서 메타데이터와 본문 추출
      const extractMetadata = (content: string) => {
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(content, 'text/html');
          
          const metadataEl = doc.querySelector('.material-metadata');
          const metadata = metadataEl 
            ? JSON.parse(metadataEl.getAttribute('data-metadata') || '{}')
            : {};
          
          return { metadata };
        } catch (error) {
          return { metadata: {} };
        }
      };

      const { metadata } = extractMetadata(articleData.content);
      
      // 제목에서 [자료관리] prefix 제거하여 표시
      const removePrefix = (title: string): string => {
        return title.startsWith('[자료관리]') 
          ? title.replace(/^\[자료관리\]\s*/, '')
          : title;
      };
      
      setFormData({
        title: removePrefix(articleData.title), // prefix 제거하여 표시
        project: metadata.project || '',
        equipment: metadata.equipment || '',
        researchDate: metadata.researchDate || '',
      });
    }
  }, [articleData]);

  const handleNavClick = () => {};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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

    setIsSubmitting(true);

    try {
      // 메타데이터 객체 생성
      const metadata = {
        project: formData.project,
        equipment: formData.equipment,
        researchDate: formData.researchDate,
      };

      // content에 메타데이터만 저장 (상세 내용 없음)
      const fullContent = `<div class="material-metadata" style="display:none;" data-metadata='${JSON.stringify(metadata)}'></div>`;

      // 게시글 수정 API 호출 (제목에 [자료관리] prefix 추가)
      const titleWithPrefix = formData.title.startsWith('[자료관리]') 
        ? formData.title 
        : `[자료관리] ${formData.title}`;
      
      await articlesService.updateArticle(BOARD_ID, articleId, {
        title: titleWithPrefix,
        content: fullContent,
      });

      // 3. 성공 시 상세 페이지로 이동
      alert('자료가 성공적으로 수정되었습니다.');
      router.push(`/materials/${articleId}`);
    } catch (error) {
      console.error('자료 수정 실패:', error);
      alert('자료 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm('수정을 취소하시겠습니까? 변경된 내용은 저장되지 않습니다.')) {
      router.push(`/materials/${articleId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header title={siteConfig.title} />
        <Navigation items={navItems} onItemClick={handleNavClick} />
        <main className="flex-1 py-12 md:py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      <Header title={siteConfig.title} />
      <Navigation items={navItems} onItemClick={handleNavClick} />
      
      <main className="flex-1 py-12 md:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">자료관리 수정</h2>
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
                {isSubmitting ? '수정 중...' : '수정'}
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

export default MaterialEditPage;

