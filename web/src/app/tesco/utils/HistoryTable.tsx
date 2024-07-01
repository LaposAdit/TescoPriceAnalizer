import React, { useState } from 'react';

interface Promotion {
    promotionId: string;
    promotionType: string;
    startDate: string;
    endDate: string;
    offerText: string;
    attributes: string[];
    promotionPrice: number | null;
}

interface ProductDetail {
    productId: string;
    title: string;
    price: number;
    unitPrice: number;
    imageUrl: string;
    unitOfMeasure: string;
    aisleName: string;
    superDepartmentName: string;
    promotions: Promotion[];
    hasPromotions: boolean;
    lastUpdated: string;
}

interface HistoryTableProps {
    history: ProductDetail[];
}

const HistoryTable: React.FC<HistoryTableProps> = ({ history }) => {
    const [sortConfig, setSortConfig] = useState<{ key: keyof ProductDetail | 'promotionPrice'; direction: string } | null>(null);

    const requestSort = (key: keyof ProductDetail | 'promotionPrice') => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Preprocess the history data to consolidate prices by date
    const consolidatedHistory = history.reduce((acc, item) => {
        const date = new Date(item.lastUpdated).toLocaleDateString();
        const price = item.promotions.length > 0 && item.promotions[0].promotionPrice !== null
            ? item.promotions[0].promotionPrice
            : item.price;
        if (!acc[date]) {
            acc[date] = price;
        }
        return acc;
    }, {} as Record<string, number>);

    const sortedHistory = Object.keys(consolidatedHistory).sort((a, b) => {
        const direction = sortConfig?.direction === 'ascending' ? 1 : -1;
        if (sortConfig?.key === 'price' || sortConfig?.key === 'promotionPrice') {
            return (consolidatedHistory[a] - consolidatedHistory[b]) * direction;
        }
        return new Date(a).getTime() - new Date(b).getTime();
    });

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">
                            <div className="flex items-center">
                                Price
                                <button onClick={() => requestSort('price')}>
                                    <svg className="w-3 h-3 ml-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086" />
                                    </svg>
                                </button>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedHistory.map((date) => (
                        <tr key={date} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{date}</td>
                            <td className="px-6 py-4">€{consolidatedHistory[date].toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistoryTable;
