import React from 'react';
import { BoardItem, BoardColumn } from '../../types';
import { DocumentIcon } from '@heroicons/react/24/outline';

interface BoardTableProps {
  items: BoardItem[];
  columns: BoardColumn[];
  onRowClick?: (item: BoardItem) => void;
  renderCell?: (column: BoardColumn, item: BoardItem, index: number) => React.ReactNode;
}

const BoardTable: React.FC<BoardTableProps> = ({ items, columns, onRowClick, renderCell }) => {
  // 빈 데이터일 경우 처리
  if (items.length === 0) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    px-4 py-4 text-lg font-bold text-gray-900 text-center border-b border-gray-300
                    ${column.width ? `w-${column.width}` : ''}
                  `}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td 
                colSpan={columns.length}
                className="px-4 py-20 text-center text-xl text-gray-500"
              >
                작성된 게시글이 없습니다.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`
                  px-4 py-4 text-lg font-bold text-gray-900 text-center border-b border-gray-300
                  ${column.width ? `w-${column.width}` : ''}
                `}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className="hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-b-0"
            >
              {columns.map((column) => {
                // 커스텀 렌더러가 있으면 사용
                if (renderCell) {
                  const customContent = renderCell(column, item, index);
                  if (customContent !== undefined) {
                    return (
                      <td
                        key={`${item.id}-${column.key}`}
                        className={`
                          px-4 py-4 text-lg font-medium text-gray-900
                          ${column.key === 'title' ? 'text-left' : 'text-center'}
                        `}
                        onClick={(e) => {
                          // 액션 버튼 클릭 시 행 클릭 이벤트 방지
                          if (column.key === 'status') {
                            e.stopPropagation();
                          }
                        }}
                      >
                        {customContent}
                      </td>
                    );
                  }
                }
                
                return (
                  <td
                    key={`${item.id}-${column.key}`}
                    className={`
                      px-4 py-4 text-lg font-medium text-gray-900
                      ${column.key === 'title' ? 'text-left' : 'text-center'}
                    `}
                  >
                    {column.key === 'attachment' && item[column.key] ? (
                      <div className="flex justify-center">
                        <DocumentIcon className="w-5 h-5 text-gray-600" />
                      </div>
                    ) : column.key === 'number' ? (
                      index + 1
                    ) : (
                      item[column.key as keyof BoardItem]
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BoardTable;
