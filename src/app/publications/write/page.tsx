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

const PublicationWritePage: React.FC = () => {
  const router = useRouter();
  const [navItems] = useAtom(navItemsAtom);
  const [footerLinks] = useAtom(footerLinksAtom);
  const [footerButtons] = useAtom(footerButtonsAtom);
  const [siteConfig] = useAtom(siteConfigAtom);
  const createArticleMutation = useCreateArticle();

  const [formData, setFormData] = useState({
    title: '',
    projectName: '',
    laboratory: '',
    researcher: '',
    name: '',
    inspector: '',
    address: '',
    storageLocation: '',
    phone: '',
    storagePeriod: '',
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
    if (!formData.projectName.trim()) {
      alert('과제명을 입력해주세요.');
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
        laboratory: formData.laboratory,
        researcher: formData.researcher,
        name: formData.name,
        inspector: formData.inspector,
        address: formData.address,
        storageLocation: formData.storageLocation,
        phone: formData.phone,
        storagePeriod: formData.storagePeriod,
      };

      // content에 메타데이터 + 본문 합치기
      const fullContent = `<div class="publication-metadata" style="display:none;" data-metadata='${JSON.stringify(metadata)}'></div><div class="publication-content">${formData.content}</div>`;

      // 1. 첨부파일이 있으면 먼저 업로드
      let fileIds: number[] = [];
      if (attachedFiles.length > 0) {
        const uploadedFiles = await filesService.uploadFiles('article', attachedFiles);
        fileIds = uploadedFiles.map(file => file.id);
      }

      // 2. 게시글 작성 API 호출
      const BOARD_ID = 4; // 연구성과 boardId
      await createArticleMutation.mutateAsync({
        boardId: BOARD_ID,
        data: {
          title: formData.title,
          content: fullContent,
          fileIds: fileIds.length > 0 ? fileIds : undefined,
        },
      });

      // 3. 성공 시 목록으로 이동 (캐시 무효화로 자동 refetch됨)
      alert('연구성과가 성공적으로 저장되었습니다.');
      router.replace('/publications');
    } catch (error) {
      console.error('연구성과 저장 실패:', error);
      alert('연구성과 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm('작성을 취소하시겠습니까? 작성 중인 내용은 저장되지 않습니다.')) {
      router.push('/publications');
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
            <h2 className="text-3xl font-bold text-gray-900">연구성과 작성</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-0">
            {/* 관리정보 섹션 */}
            <div className="max-w-[971px] mx-auto">
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
                    <input
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleInputChange}
                      className="flex-1 h-[45px] bg-white border border-[#dedede] px-3 text-[16px] font-normal text-black focus:outline-none"
                      placeholder=""
                    />
                  </div>

                  {/* 연구실 / 연구책임자 행 */}
                  <div className="flex h-[45px] gap-px">
                    <div className="flex flex-1 h-[45px]">
                      <div className="w-[142px] h-[45px] bg-[#f3f3f3] border border-[#dedede] border-r-0 flex items-center justify-center text-[18px] font-normal text-black flex-shrink-0">
                        연구실
                      </div>
                      <input
                        type="text"
                        name="laboratory"
                        value={formData.laboratory}
                        onChange={handleInputChange}
                        className="flex-1 h-[45px] bg-white border border-[#dedede] px-3 text-[16px] font-normal text-black focus:outline-none"
                        placeholder=""
                      />
                    </div>
                    <div className="flex flex-1 h-[45px]">
                      <div className="w-[142px] h-[45px] bg-[#f3f3f3] border border-[#dedede] border-r-0 flex items-center justify-center text-[18px] font-normal text-black flex-shrink-0">
                        연구책임자
                      </div>
                      <input
                        type="text"
                        name="researcher"
                        value={formData.researcher}
                        onChange={handleInputChange}
                        className="flex-1 h-[45px] bg-white border border-[#dedede] px-3 text-[16px] font-normal text-black focus:outline-none"
                        placeholder=""
                      />
                    </div>
                  </div>

                  {/* 이름 / 점검자 행 */}
                  <div className="flex h-[45px] gap-px">
                    <div className="flex flex-1 h-[45px]">
                      <div className="w-[142px] h-[45px] bg-[#f3f3f3] border border-[#dedede] border-r-0 flex items-center justify-center text-[18px] font-normal text-black flex-shrink-0">
                        이름
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="flex-1 h-[45px] bg-white border border-[#dedede] px-3 text-[16px] font-normal text-black focus:outline-none"
                        placeholder=""
                      />
                    </div>
                    <div className="flex flex-1 h-[45px]">
                      <div className="w-[142px] h-[45px] bg-[#f3f3f3] border border-[#dedede] border-r-0 flex items-center justify-center text-[18px] font-normal text-black flex-shrink-0">
                        점검자
                      </div>
                      <input
                        type="text"
                        name="inspector"
                        value={formData.inspector}
                        onChange={handleInputChange}
                        className="flex-1 h-[45px] bg-white border border-[#dedede] px-3 text-[16px] font-normal text-black focus:outline-none"
                        placeholder=""
                      />
                    </div>
                  </div>

                  {/* 주소 / 보관장소 행 */}
                  <div className="flex h-[45px] gap-px">
                    <div className="flex flex-1 h-[45px]">
                      <div className="w-[142px] h-[45px] bg-[#f3f3f3] border border-[#dedede] border-r-0 flex items-center justify-center text-[18px] font-normal text-black flex-shrink-0">
                        주소
                      </div>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="flex-1 h-[45px] bg-white border border-[#dedede] px-3 text-[16px] font-normal text-black focus:outline-none"
                        placeholder=""
                      />
                    </div>
                    <div className="flex flex-1 h-[45px]">
                      <div className="w-[142px] h-[45px] bg-[#f3f3f3] border border-[#dedede] border-r-0 flex items-center justify-center text-[18px] font-normal text-black flex-shrink-0">
                        보관장소
                      </div>
                      <input
                        type="text"
                        name="storageLocation"
                        value={formData.storageLocation}
                        onChange={handleInputChange}
                        className="flex-1 h-[45px] bg-white border border-[#dedede] px-3 text-[16px] font-normal text-black focus:outline-none"
                        placeholder=""
                      />
                    </div>
                  </div>

                  {/* 전화 / 보관기간 행 */}
                  <div className="flex h-[45px] gap-px">
                    <div className="flex flex-1 h-[45px]">
                      <div className="w-[142px] h-[45px] bg-[#f3f3f3] border border-[#dedede] border-r-0 flex items-center justify-center text-[18px] font-normal text-black flex-shrink-0">
                        전화
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="flex-1 h-[45px] bg-white border border-[#dedede] px-3 text-[16px] font-normal text-black focus:outline-none"
                        placeholder=""
                      />
                    </div>
                    <div className="flex flex-1 h-[45px]">
                      <div className="w-[142px] h-[45px] bg-[#f3f3f3] border border-[#dedede] border-r-0 flex items-center justify-center text-[18px] font-normal text-black flex-shrink-0">
                        보관기간
                      </div>
                      <input
                        type="text"
                        name="storagePeriod"
                        value={formData.storagePeriod}
                        onChange={handleInputChange}
                        className="flex-1 h-[45px] bg-white border border-[#dedede] px-3 text-[16px] font-normal text-black focus:outline-none"
                        placeholder=""
                      />
                    </div>
                  </div>

                  {/* 제목 행 */}
                  <div className="flex h-[45px]">
                    <div className="w-[142px] h-[45px] bg-[#f3f3f3] border border-[#dedede] border-r-0 flex items-center justify-center text-[18px] font-normal text-black flex-shrink-0">
                      제목
                    </div>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="flex-1 h-[45px] bg-white border border-[#dedede] px-3 text-[16px] font-normal text-black focus:outline-none"
                      placeholder="제목을 입력하세요"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 상세 내용 섹션 */}
            <div className="max-w-[971px] mx-auto mt-6">
              <div className="w-full h-[50px] bg-[#466483] border border-[#dedede] flex items-center justify-center text-[18px] font-bold text-white">
                상세 내용
              </div>
              <div className="w-full border border-[#dedede] border-t-0 bg-white">
                <RichTextEditor
                  content={formData.content}
                  onChange={handleContentChange}
                  onFilesChange={handleFilesChange}
                  placeholder="연구성과에 대한 상세한 내용을 입력하세요"
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

export default PublicationWritePage;

