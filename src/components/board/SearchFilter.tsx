import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSearch = () => {
    onSearch(searchType, query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`flex justify-between items-center mb-8 px-5 ${className}`}>
      {/* 게시물 정보 */}
      <div className="flex gap-5 items-center">
        <span className="text-lg font-medium text-gray-900">
          총 게시물 <strong className="font-bold">{totalCount}</strong>
        </span>
        <span className="text-lg font-medium text-gray-900">
          페이지 <strong className="font-bold">{currentPage} / {totalPages}</strong>
        </span>
      </div>

      {/* 검색 컨트롤 */}
      <div className="flex gap-3 items-center">
        {/* 검색 타입 드롭다운 */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-[150px] h-12 border border-gray-400 rounded bg-white flex items-center justify-between px-4 text-lg font-medium text-gray-400"
          >
            <span>{searchType}</span>
            <ChevronDownIcon className="w-3 h-3" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 w-[150px] bg-white border border-gray-400 rounded mt-1 shadow-lg z-10">
              {searchOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSearchType(option);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-lg font-medium text-gray-900 hover:bg-gray-50"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 검색 입력 */}
        <div className="w-90 h-12 border border-gray-400 rounded bg-white">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="검색어를 입력하세요"
            className="w-full h-full px-4 text-lg font-medium text-gray-900 placeholder-gray-400 border-none outline-none rounded"
          />
        </div>

        {/* 검색 버튼 */}
        <button
          onClick={handleSearch}
          className="w-20 h-12 bg-blue-900 border border-gray-400 rounded text-white text-lg font-medium hover:bg-blue-800 transition-colors"
        >
          검색
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;
