import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchFilterProps {
  totalCount: number;
  currentPage: number;
  totalPages: number;
  searchOptions: string[];
  onSearch: (searchType: string, query: string) => void;
  className?: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  totalCount,
  currentPage,
  totalPages,
  searchOptions,
  onSearch,
  className = ''
}) => {
  const [searchType, setSearchType] = useState(searchOptions[0] || '제목');
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchType, query);
  };

  return (
    <div className={`mb-5 ${className}`}>
      {/* 검색 영역 */}
      <form
        onSubmit={handleSubmit}
        role="search"
        className="flex flex-col sm:flex-row justify-center gap-2 px-5 py-6 mb-8 rounded-lg bg-surface border border-line"
      >
        <label className="sr-only" htmlFor="board-search-type">검색 조건</label>
        <select
          id="board-search-type"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="h-12 sm:w-[140px] px-4 rounded border border-[#c3ccd9] bg-white text-[15px] text-gray-700 focus:outline-none focus:border-royal"
        >
          {searchOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="board-search-query">검색어</label>
        <input
          id="board-search-query"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="h-12 sm:w-[420px] px-4 rounded border border-[#c3ccd9] bg-white text-[15px] text-ink placeholder-gray-400 focus:outline-none focus:border-royal"
        />
        <button
          type="submit"
          className="h-12 px-7 flex items-center justify-center gap-2 rounded bg-navy text-[15px] font-semibold text-white hover:bg-blue-800 transition-colors"
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
          검색
        </button>
      </form>

      {/* 게시물 정보 */}
      <p className="text-[15px] text-gray-600">
        전체 <strong className="font-bold text-royal">{totalCount}</strong>건
        <span className="mx-2 text-gray-300">|</span>
        현재 페이지 <strong className="font-semibold text-ink">{currentPage}</strong>/{Math.max(totalPages, 1)}
      </p>
    </div>
  );
};

export default SearchFilter;
