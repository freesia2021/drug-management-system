'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import Strike from '@tiptap/extension-strike';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { common, createLowlight } from 'lowlight';
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon as UnderlineIconOutline,
  ListBulletIcon,
  NumberedListIcon,
  LinkIcon,
  PhotoIcon,
  CodeBracketIcon,
  TableCellsIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline';

const lowlight = createLowlight(common);

// 컬러 팔레트 색상 정의
const COLOR_PALETTE = [
  '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF',
  '#980000', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF',
  '#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC',
  '#DD7E6B', '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#A4C2F4', '#9FC5E8', '#B4A7D6', '#D5A6BD',
  '#CC4125', '#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6D9EEB', '#6FA8DC', '#8E7CC3', '#C27BA0',
  '#A61C00', '#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3C78D8', '#3D85C6', '#674EA7', '#A64D79',
  '#85200C', '#990000', '#B45F06', '#BF9000', '#38761D', '#134F5C', '#1155CC', '#0B5394', '#351C75', '#741B47',
  '#5B0F00', '#660000', '#783F04', '#7F6000', '#274E13', '#0C343D', '#1C4587', '#073763', '#20124D', '#4C1130',
];

const HIGHLIGHT_COLORS = [
  'transparent', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#F44336',
  '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4',
  '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
];

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onFilesChange?: (files: File[]) => void;
}

interface AttachedFile {
  id: string;
  file: File;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = '연구에 대한 상세한 내용을 입력하세요',
  onFilesChange,
}) => {
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showHighlightColorPicker, setShowHighlightColorPicker] = useState(false);
  const [currentTextColor, setCurrentTextColor] = useState('#000000');
  const [currentHighlightColor, setCurrentHighlightColor] = useState('#FFFF00');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  
  const textColorRef = useRef<HTMLDivElement>(null);
  const highlightColorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (textColorRef.current && !textColorRef.current.contains(event.target as Node)) {
        setShowTextColorPicker(false);
      }
      if (highlightColorRef.current && !highlightColorRef.current.contains(event.target as Node)) {
        setShowHighlightColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false, // CodeBlockLowlight를 사용하기 위해 비활성화
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Strike,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[600px] max-w-none p-6',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const url = window.prompt('URL을 입력하세요');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('이미지 URL을 입력하세요');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const applyTextColor = (color: string) => {
    setCurrentTextColor(color);
    editor.chain().focus().setColor(color).run();
    setShowTextColorPicker(false);
  };

  const applyHighlightColor = (color: string) => {
    setCurrentHighlightColor(color);
    if (color === 'transparent') {
      editor.chain().focus().unsetHighlight().run();
    } else {
      editor.chain().focus().setHighlight({ color }).run();
    }
    setShowHighlightColorPicker(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles: AttachedFile[] = Array.from(files).map(file => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
      }));
      const updatedFiles = [...attachedFiles, ...newFiles];
      setAttachedFiles(updatedFiles);
      
      // 부모 컴포넌트에 파일 변경 알림
      if (onFilesChange) {
        onFilesChange(updatedFiles.map(f => f.file));
      }
      
      // input 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveFile = (id: string) => {
    const updatedFiles = attachedFiles.filter(f => f.id !== id);
    setAttachedFiles(updatedFiles);
    
    // 부모 컴포넌트에 파일 변경 알림
    if (onFilesChange) {
      onFilesChange(updatedFiles.map(f => f.file));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const MenuButton = ({ 
    onClick, 
    isActive, 
    icon: Icon, 
    label 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    // Using any to handle React version type mismatch with heroicons
    // @ts-ignore - React version type mismatch
    icon: any; 
    label: string;
  }) => {
    const IconComponent = Icon as React.ComponentType<{ className?: string }>;
    return (
      <button
        type="button"
        onClick={onClick}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          isActive ? 'bg-gray-300 text-blue-600' : 'text-gray-700'
        }`}
        title={label}
      >
        <IconComponent className="w-5 h-5" />
      </button>
    );
  };

  // 페인트통 아이콘 SVG 컴포넌트
  const PaintBucketIcon = ({ color }: { color: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.5 9L19.5 10L20.5 9L19.5 8L18.5 9ZM3 20C3 20.552 3.448 21 4 21H20C20.552 21 21 20.552 21 20C21 19.448 20.552 19 20 19H4C3.448 19 3 19.448 3 20Z" fill="currentColor"/>
      <path d="M17 8L16 7L3 2L2 3L7 16L8 17L17 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="3" y="18" width="18" height="3" rx="0.5" fill={color} opacity="0.8"/>
    </svg>
  );

  // 컬러 피커 컴포넌트
  const ColorPicker = ({ 
    colors, 
    onSelect, 
    currentColor 
  }: { 
    colors: string[]; 
    onSelect: (color: string) => void; 
    currentColor: string;
  }) => (
    <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
      <div className="grid grid-cols-10 gap-1" style={{ width: '240px' }}>
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onSelect(color)}
            className={`w-5 h-5 rounded border-2 hover:scale-110 transition-transform ${
              currentColor === color ? 'border-blue-500' : 'border-gray-300'
            }`}
            style={{ 
              backgroundColor: color === 'transparent' ? 'white' : color,
              backgroundImage: color === 'transparent' 
                ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)'
                : 'none',
              backgroundSize: color === 'transparent' ? '8px 8px' : 'auto',
              backgroundPosition: color === 'transparent' ? '0 0, 4px 4px' : '0 0',
            }}
            title={color}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* 에디터 툴바 */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-300 bg-gray-50">
        {/* 실행 취소/다시 실행 */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-1">
          <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            isActive={false}
            icon={ArrowUturnLeftIcon}
            label="실행 취소"
          />
          <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            isActive={false}
            icon={ArrowUturnRightIcon}
            label="다시 실행"
          />
        </div>

        {/* 텍스트 스타일 */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            icon={BoldIcon}
            label="굵게"
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            icon={ItalicIcon}
            label="기울임"
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            icon={UnderlineIconOutline}
            label="밑줄"
          />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('strike') ? 'bg-gray-300 text-blue-600' : 'text-gray-700'
            }`}
            title="취소선"
          >
            <span className="text-lg line-through">S</span>
          </button>
        </div>

        {/* 제목 스타일 */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-3 py-1 rounded hover:bg-gray-200 transition-colors font-bold ${
              editor.isActive('heading', { level: 1 }) ? 'bg-gray-300 text-blue-600' : 'text-gray-700'
            }`}
            title="제목 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1 rounded hover:bg-gray-200 transition-colors font-bold ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-300 text-blue-600' : 'text-gray-700'
            }`}
            title="제목 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-1 rounded hover:bg-gray-200 transition-colors font-bold ${
              editor.isActive('heading', { level: 3 }) ? 'bg-gray-300 text-blue-600' : 'text-gray-700'
            }`}
            title="제목 3"
          >
            H3
          </button>
        </div>

        {/* 리스트 */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            icon={ListBulletIcon}
            label="불릿 리스트"
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            icon={NumberedListIcon}
            label="숫자 리스트"
          />
        </div>

        {/* 정렬 */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`px-3 py-1 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300 text-blue-600' : 'text-gray-700'
            }`}
            title="왼쪽 정렬"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`px-3 py-1 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300 text-blue-600' : 'text-gray-700'
            }`}
            title="가운데 정렬"
          >
            ↔
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`px-3 py-1 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300 text-blue-600' : 'text-gray-700'
            }`}
            title="오른쪽 정렬"
          >
            →
          </button>
        </div>

        {/* 특수 요소 */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-1">
          <MenuButton
            onClick={setLink}
            isActive={editor.isActive('link')}
            icon={LinkIcon}
            label="링크 추가"
          />
          <MenuButton
            onClick={addImage}
            isActive={false}
            icon={PhotoIcon}
            label="이미지 추가"
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            icon={CodeBracketIcon}
            label="코드 블록"
          />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('blockquote') ? 'bg-gray-300 text-blue-600' : 'text-gray-700'
            }`}
            title="인용구"
          >
            <span className="text-lg font-bold">&quot;</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
            title="구분선"
          >
            <span className="text-lg">―</span>
          </button>
        </div>

        {/* 표 */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-1">
          <MenuButton
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}
            isActive={false}
            icon={TableCellsIcon}
            label="표 삽입 (3x3)"
          />
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="px-2 py-1 rounded hover:bg-gray-200 transition-colors text-gray-700 text-xs"
            title="표 삭제"
          >
            표삭제
          </button>
        </div>

        {/* 색상 */}
        <div className="flex gap-1">
          {/* 텍스트 색상 */}
          <div className="relative" ref={textColorRef}>
            <button
              type="button"
              onClick={() => setShowTextColorPicker(!showTextColorPicker)}
              className="flex flex-col items-center justify-center p-1 rounded hover:bg-gray-200 transition-colors text-gray-700"
              title="텍스트 색상"
            >
              <span className="text-base font-bold">A</span>
              <div 
                className="w-4 h-1 mt-0.5" 
                style={{ backgroundColor: currentTextColor }}
              />
            </button>
            {showTextColorPicker && (
              <ColorPicker
                colors={COLOR_PALETTE}
                onSelect={applyTextColor}
                currentColor={currentTextColor}
              />
            )}
          </div>

          {/* 배경 색상 (하이라이트) - 페인트통 */}
          <div className="relative" ref={highlightColorRef}>
            <button
              type="button"
              onClick={() => setShowHighlightColorPicker(!showHighlightColorPicker)}
              className="flex flex-col items-center justify-center p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
              title="배경 색상"
            >
              <PaintBucketIcon color={currentHighlightColor} />
            </button>
            {showHighlightColorPicker && (
              <ColorPicker
                colors={HIGHLIGHT_COLORS}
                onSelect={applyHighlightColor}
                currentColor={currentHighlightColor}
              />
            )}
          </div>

          {/* 색상 제거 */}
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().unsetColor().run();
              editor.chain().focus().unsetHighlight().run();
            }}
            className="px-2 py-1 rounded hover:bg-gray-200 transition-colors text-gray-700 text-xs"
            title="색상 제거"
          >
            색상제거
          </button>
        </div>
      </div>

      {/* 에디터 컨텐츠 */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* 파일 첨부 영역 */}
      <div className="border-t border-gray-300 p-3 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <PaperClipIcon className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">첨부 파일</span>
            {attachedFiles.length > 0 && (
              <span className="text-xs text-gray-500">({attachedFiles.length}개)</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors text-gray-700 font-medium"
          >
            파일 선택
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
        
        {/* 첨부된 파일 목록 */}
        {attachedFiles.length > 0 && (
          <div className="space-y-1.5">
            {attachedFiles.map((attachedFile) => (
              <div
                key={attachedFile.id}
                className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded text-sm"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <PaperClipIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate text-gray-700">{attachedFile.file.name}</span>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    ({formatFileSize(attachedFile.file.size)})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(attachedFile.id)}
                  className="ml-2 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
        
        {attachedFiles.length === 0 && (
          <p className="text-xs text-gray-500 mt-2">첨부된 파일이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;

