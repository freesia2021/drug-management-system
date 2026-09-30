import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className={`flex justify-center items-center gap-5 mt-8 ${className}`}>
      {/* 이전 버튼 */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`
          text-lg font-medium transition-colors cursor-pointer
          ${currentPage === 1 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-400 hover:text-gray-900'
          }
        `}
      >
        이전
      </button>

      {/* 페이지 번호들 */}
      <div className="flex items-center gap-2">
        {getPageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`
              w-7 h-7 rounded flex items-center justify-center text-lg font-medium transition-colors
              ${pageNumber === currentPage
                ? 'bg-blue-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      {/* 다음 버튼 */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`
          text-lg font-medium transition-colors cursor-pointer
          ${currentPage === totalPages 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-400 hover:text-gray-900'
          }
        `}
      >
        다음
      </button>
    </div>
  );
};

export default Pagination;
