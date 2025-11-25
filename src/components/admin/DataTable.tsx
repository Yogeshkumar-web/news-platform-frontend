"use client";

import React from 'react';

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string;
    isLoading?: boolean;
    onRowClick?: (item: T) => void;
}

export function DataTable<T>({ data, columns, keyExtractor, isLoading, onRowClick }: DataTableProps<T>) {
    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading...</div>;
    }

    if (data.length === 0) {
        return <div className="p-8 text-center text-gray-500">No data available</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                scope="col"
                                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item) => (
                        <tr 
                            key={keyExtractor(item)} 
                            onClick={() => onRowClick && onRowClick(item)}
                            className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
                        >
                            {columns.map((column, index) => (
                                <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {typeof column.accessor === 'function'
                                        ? column.accessor(item)
                                        : (item[column.accessor] as React.ReactNode)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
