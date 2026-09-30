'use client';

import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import Header from '../../../../components/header/Header';
import Navigation from '../../../../components/navigation/Navigation';
import Footer from '../../../../components/footer/Footer';
import { RichTextEditor } from '../../../../components/rich-text-editor';
import { 
  navItemsAtom, 
  footerLinksAtom, 
  footerButtonsAtom,
  siteConfigAtom 
} from '../../../../store';

const SeminarWritePage: React.FC = () => {
  const router = useRouter();
  const [navItems] = useAtom(navItemsAtom);
  const [footerLinks] = useAtom(footerLinksAtom);
  const [footerButtons] = useAtom(footerButtonsAtom);
  const [siteConfig] = useAtom(siteConfigAtom);

  const [formData, setFormData] = useState({
    title: '',
    seminarDate: '',
    location: '',
    speaker: '',
    topic: '',
    content: '',
  });

  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

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
    
    // TODO: API 호출하여 게시글 작성
    console.log('학술세미나 작성:', formData);
    console.log('첨부 파일:', attachedFiles);
    
    // 작성 완료 후 목록으로 이동
    // router.push('/research/seminar');
  };

  const handleCancel = () => {
    if (confirm('작성을 취소하시겠습니까? 작성 중인 내용은 저장되지 않습니다.')) {
      router.push('/research/seminar');
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
            <h2 className="text-3xl font-bold text-gray-900">학술세미나 작성</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 세미나 정보 섹션 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-slate-600 px-6 py-3 border-b border-gray-200">
                <h3 className="text-lg font-bold text-white">세미나 정보</h3>
              </div>
              
              <div className="p-6 space-y-4">
                {/* 제목 */}
                <div className="flex flex-col gap-2">
                  <label className="flex items-center min-h-[45px] border border-gray-200 rounded">
                    <span className="w-36 bg-gray-100 h-full flex items-center justify-center border-r border-gray-200 font-medium text-gray-700">
                      제목
                    </span>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="세미나 제목을 입력하세요"
                    />
                  </label>
                </div>

                {/* 세미나 일시 / 장소 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center min-h-[45px] border border-gray-200 rounded">
                    <span className="w-36 bg-gray-100 h-full flex items-center justify-center border-r border-gray-200 font-medium text-gray-700">
                      세미나 일시
                    </span>
                    <input
                      type="datetime-local"
                      name="seminarDate"
                      value={formData.seminarDate}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex items-center min-h-[45px] border border-gray-200 rounded">
                    <span className="w-36 bg-gray-100 h-full flex items-center justify-center border-r border-gray-200 font-medium text-gray-700">
                      장소
                    </span>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="세미나 장소를 입력하세요"
                    />
                  </label>
                </div>

                {/* 발표자 / 주제 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center min-h-[45px] border border-gray-200 rounded">
                    <span className="w-36 bg-gray-100 h-full flex items-center justify-center border-r border-gray-200 font-medium text-gray-700">
                      발표자
                    </span>
                    <input
                      type="text"
                      name="speaker"
                      value={formData.speaker}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="발표자를 입력하세요"
                    />
                  </label>
                  <label className="flex items-center min-h-[45px] border border-gray-200 rounded">
                    <span className="w-36 bg-gray-100 h-full flex items-center justify-center border-r border-gray-200 font-medium text-gray-700">
                      주제
                    </span>
                    <input
                      type="text"
                      name="topic"
                      value={formData.topic}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="세미나 주제를 입력하세요"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* 상세 내용 섹션 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-slate-600 px-6 py-3 border-b border-gray-200">
                <h3 className="text-lg font-bold text-white">상세 내용</h3>
              </div>
              
              <div className="p-6">
                <RichTextEditor
                  content={formData.content}
                  onChange={handleContentChange}
                  onFilesChange={handleFilesChange}
                  placeholder="세미나에 대한 상세한 내용을 입력하세요"
                />
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-3 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                등록
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

export default SeminarWritePage;

