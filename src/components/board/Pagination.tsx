import React from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';

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
  const lastPage = Math.max(totalPages, 1);

  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(lastPage, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const go = (page: number) => {
    if (page >= 1 && page <= lastPage && page !== currentPage) {
      onPageChange(page);
    }
  };

  const arrowClass =
    'w-9 h-9 flex items-center justify-center rounded border border-line text-gray-500 hover:border-navy hover:text-navy transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-line disabled:hover:text-gray-500';

  return (
    <nav className={`flex justify-center items-center gap-1.5 mt-10 ${className}`} aria-label="페이지 이동">
      <button onClick={() => go(1)} disabled={currentPage <= 1} className={arrowClass} aria-label="처음 페이지">
        <ChevronDoubleLeftIcon className="w-4 h-4" />
      </button>
      <button onClick={() => go(currentPage - 1)} disabled={currentPage <= 1} className={arrowClass} aria-label="이전 페이지">
        <ChevronLeftIcon className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-1.5 mx-2">
        {getPageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => go(pageNumber)}
            aria-current={pageNumber === currentPage ? 'page' : undefined}
            className={`min-w-[2.25rem] h-9 px-2 rounded text-[15px] tabular-nums transition-colors ${
              pageNumber === currentPage
                ? 'bg-navy text-white font-bold'
                : 'text-gray-600 hover:bg-surface hover:text-navy'
            }`}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      <button onClick={() => go(currentPage + 1)} disabled={currentPage >= lastPage} className={arrowClass} aria-label="다음 페이지">
        <ChevronRightIcon className="w-4 h-4" />
      </button>
      <button onClick={() => go(lastPage)} disabled={currentPage >= lastPage} className={arrowClass} aria-label="마지막 페이지">
        <ChevronDoubleRightIcon className="w-4 h-4" />
      </button>
    </nav>
  );
};

export default Pagination;
