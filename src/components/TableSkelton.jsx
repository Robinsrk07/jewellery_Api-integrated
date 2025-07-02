import React from 'react';

const TableSkelton = ({ rows = 5, columns = 10 }) => {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr key={rowIdx}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <td key={colIdx} style={{ padding: '12px 8px' }}>
              <div
                className="animate-pulse bg-gray-200 rounded h-4 w-full"
                style={{ minWidth: 200, maxWidth: 600 }}
                aria-label="Loading..."
              ></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default TableSkelton;