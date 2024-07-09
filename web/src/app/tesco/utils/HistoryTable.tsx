import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';

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

interface ConsolidatedHistoryItem extends ProductDetail {
    consolidatedPrice: number;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ history }) => {
    const [sortConfig, setSortConfig] = useState<{ key: keyof ProductDetail | 'consolidatedPrice' | 'date'; direction: string }>({ key: 'date', direction: 'descending' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const requestSort = (key: keyof ProductDetail | 'consolidatedPrice' | 'date') => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Preprocess the history data to consolidate prices by date
    const consolidatedHistory = history.reduce((acc, item) => {
        const date = new Date(item.lastUpdated).toLocaleDateString();
        const consolidatedPrice = item.promotions.length > 0 && item.promotions[0].promotionPrice !== null
            ? item.promotions[0].promotionPrice
            : item.price;
        if (!acc[date]) {
            acc[date] = { ...item, consolidatedPrice };
        }
        return acc;
    }, {} as Record<string, ConsolidatedHistoryItem>);

    const sortedHistory = Object.keys(consolidatedHistory).sort((a, b) => {
        const direction = sortConfig.direction === 'ascending' ? 1 : -1;
        if (sortConfig.key === 'consolidatedPrice') {
            return (consolidatedHistory[a].consolidatedPrice - consolidatedHistory[b].consolidatedPrice) * direction;
        }
        return (new Date(a).getTime() - new Date(b).getTime()) * direction;
    });

    // Paginate the sorted history
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedHistory.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(sortedHistory.length / itemsPerPage);

    const nextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const prevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            {['Date', 'Price', 'Unit Price', 'Aisle', 'Department', 'Promotions'].map((header, index) => (
                                <th key={index} scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        {header}
                                        {['Date', 'Price', 'Unit Price'].includes(header) && (
                                            <button onClick={() => requestSort(header.toLowerCase().replace(' ', '') as any)} className="ml-1">
                                                {sortConfig.key === header.toLowerCase().replace(' ', '') ? (
                                                    sortConfig.direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                                                ) : (
                                                    <ChevronDown size={14} className="text-gray-400" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((date) => {
                            const item = consolidatedHistory[date];
                            return (
                                <tr key={date} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{date}</td>
                                    <td className="px-6 py-4">€{item.consolidatedPrice.toFixed(2)}</td>
                                    <td className="px-6 py-4">€{item.unitPrice.toFixed(2)} / {item.unitOfMeasure}</td>
                                    <td className="px-6 py-4">{item.aisleName}</td>
                                    <td className="px-6 py-4">{item.superDepartmentName}</td>
                                    <td className="px-6 py-4">
                                        {item.promotions.length > 0 ? (
                                            item.promotions.map(promo => (
                                                <div key={promo.promotionId} className="mb-2 p-2 bg-green-50 rounded-md">
                                                    <div className="font-semibold text-green-700">{promo.offerText}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                                                    </div>
                                                    {promo.promotionPrice && (
                                                        <div className="font-medium text-green-600">€{promo.promotionPrice.toFixed(2)}</div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-gray-400">No promotions</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-between px-6 py-3 bg-gray-50">
                <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                    <ChevronLeft size={16} className="mr-1" />
                    Previous
                </button>
                <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                    Next
                    <ChevronRight size={16} className="ml-1" />
                </button>
            </div>
        </div>
    );
};

export default HistoryTable;
