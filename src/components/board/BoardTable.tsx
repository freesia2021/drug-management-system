
import React from 'react';
import { BoardItem, BoardColumn } from '../../types';
import { PaperClipIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface BoardTableProps {
  items: BoardItem[];
  columns: BoardColumn[];
  onRowClick?: (item: BoardItem) => void;
  renderCell?: (column: BoardColumn, item: BoardItem, index: number) => React.ReactNode;
}

// column.width는 Tailwind spacing 단위 (1 = 0.25rem)
const columnStyle = (column: BoardColumn): React.CSSProperties | undefined =>
  column.width ? { width: `${Number(column.width) * 0.25}rem` } : undefined;

const cellClass = (column: BoardColumn) =>
  `px-4 py-4 text-[15px] ${
    column.key === 'title' ? 'text-left font-medium text-ink' : 'text-center text-gray-600'
  }`;

const BoardTable: React.FC<BoardTableProps> = ({ items, columns, onRowClick, renderCell }) => {
  const renderDefault = (column: BoardColumn, item: BoardItem, index: number) => {
    if (column.key === 'attachment') {
      return item.attachment ? <PaperClipIcon className="w-4 h-4 mx-auto text-gray-500" aria-label="첨부파일 있음" /> : null;
    }
    if (column.key === 'number') {
      return index + 1;
    }
    if (column.key === 'title') {
      return (
        <span className="inline-flex items-center gap-2 max-w-full">
          <span className="truncate group-hover:text-royal group-hover:underline underline-offset-4">{item.title}</span>
          {item.attachment && !columns.some((c) => c.key === 'attachment') && (
            <PaperClipIcon className="w-4 h-4 shrink-0 text-gray-400" aria-label="첨부파일 있음" />
          )}
        </span>
      );
    }
    if (column.key === 'category' && item.category) {
      return <span className="inline-block px-2 py-0.5 rounded-sm bg-blue-50 text-[13px] font-semibold text-navy">{item.category}</span>;
    }
    return item[column.key as keyof BoardItem] as React.ReactNode;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] table-fixed border-t-2 border-navy-ink">
        <thead>
          <tr className="bg-[#f6f8fb] border-b border-[#c3ccd9]">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                style={columnStyle(column)}
                className="px-4 py-3.5 text-[15px] font-semibold text-gray-800 text-center"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr className="border-b border-line">
              <td colSpan={columns.length} className="px-4 py-20 text-center">
                <DocumentTextIcon className="w-10 h-10 mx-auto text-gray-300" />
                <p className="mt-3 text-[15px] text-gray-500">등록된 게시글이 없습니다.</p>
              </td>
            </tr>
          ) : (
            items.map((item, index) => (
              <tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className="group border-b border-line hover:bg-[#f8faff] cursor-pointer transition-colors"
              >
                {columns.map((column) => {
                  // 커스텀 렌더러가 있으면 사용
                  const customContent = renderCell?.(column, item, index);
                  return (
                    <td
                      key={`${item.id}-${column.key}`}
                      className={`${cellClass(column)} ${column.key === 'title' ? 'truncate' : ''}`}
                      onClick={(e) => {
                        // 액션 버튼 클릭 시 행 클릭 이벤트 방지
                        if (customContent !== undefined && column.key === 'status') {
                          e.stopPropagation();
                        }
                      }}
                    >
                      {customContent !== undefined ? customContent : renderDefault(column, item, index)}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BoardTable;
