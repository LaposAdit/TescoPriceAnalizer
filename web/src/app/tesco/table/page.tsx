"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

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
    category: string;
    promotions: Promotion[];
    hasPromotions: boolean;
    lastUpdated: string;
}

interface ProductResponse {
    totalPages: number;
    totalProducts: number;
    products: ProductDetail[];
    availableCategories: string[];
}




const categoryMap: { [key: string]: string } = {
    trvanlivePotraviny: 'Trvanlivé Potraviny',
    specialnaAZdravaVyziva: 'Špeciálna a Zdravá Výživa',
    pecivo: 'Pečivo',
    ovocieAZeleniny: 'Ovocie a Zeleniny',
    napoje: 'Nápoje',
    mrazenePotraviny: 'Mrazené Potraviny',
    mliecneVyrobkyAVajcia: 'Mliečne Výrobky a Vajcia',
    masoRybyALahodky: 'Mäso, Ryby a Lahôdky',
    grilovanie: 'Grilovanie',
    alkohol: 'Alkohol'
};

const columns = [
    { key: 'indicator', label: 'Indicator' },
    { key: 'product', label: 'Product' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price' },
    { key: 'unitPrice', label: 'Unit Price' },
    { key: 'promotionPrice', label: 'Promotion Price' },
    { key: 'lastUpdated', label: 'Last Updated' },
    { key: 'priceDrop', label: 'Price Drop' },
    { key: 'percentageDrop', label: 'Percentage Drop' }
];

export default function ProductPage() {
    const [products, setProducts] = useState<ProductDetail[]>([]);
    const [availableCategories, setAvailableCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [category, setCategory] = useState<string>('');
    const [sale, setSale] = useState<boolean | null>(null);
    const [pageSize, setPageSize] = useState<number>(25);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [tableSettingsVisible, setTableSettingsVisible] = useState<boolean>(false);
    const [selectedColumns, setSelectedColumns] = useState<string[]>(columns.map(col => col.key));

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const endpoint = searchTerm ? 'http://localhost:3000/products/search' : 'http://localhost:3000/products';

                const response = await axios.get<ProductResponse>(endpoint, {
                    params: {
                        searchTerm: searchTerm || undefined,
                        category: category || undefined,
                        sale,
                        pageSize,
                        page,
                    },
                    headers: {
                        accept: 'application/json',
                    },
                });

                console.log('API Request:', { endpoint, params: response.config.params });
                console.log('API Response:', response.data);

                setProducts(response.data.products || []);
                if (!searchTerm) {
                    setAvailableCategories(response.data.availableCategories || []);
                }
                setTotalPages(response.data.totalPages);
                setTotalProducts(response.data.totalProducts);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchProducts();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [category, sale, pageSize, page, searchTerm]);



    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleCategoryChange = (newCategory: string) => {
        setCategory(newCategory);
        setPage(1);
    };

    const handleSaleChange = (newSale: boolean | null) => {
        setSale(newSale);
        setPage(1);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setPage(1);
    };

    const getPageNumbers = (): (number | string)[] => {
        const maxPagesToShow = 5;
        const currentSet = Math.floor((page - 1) / maxPagesToShow);
        const startPage = currentSet * maxPagesToShow + 1;
        const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

        const pages: (number | string)[] = [];
        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) {
                pages.push('...');
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push('...');
            }
            pages.push(totalPages);
        }

        return pages;
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset to the first page on search
    };

    const calculatePriceIndicator = (product: ProductDetail) => {
        const promotionPrice = product.promotions.length > 0 ? product.promotions[0].promotionPrice : null;
        const currentPrice = promotionPrice ?? product.price;
        const initialPrice = product.price;

        if (promotionPrice !== null && promotionPrice < initialPrice) {
            return 'good';
        } else if (promotionPrice !== null && promotionPrice > initialPrice) {
            return 'bad';
        }

        return 'neutral';
    };

    const calculatePriceAnalysis = (product: ProductDetail) => {
        const initialPrice = product.price;
        const promotionPrice = product.promotions.length > 0 ? product.promotions[0].promotionPrice : null;
        const currentPrice = promotionPrice ?? product.price;

        const priceDrop = initialPrice - currentPrice;
        const percentageDrop = (priceDrop / initialPrice) * 100;

        let priceDropClass = '';
        let percentageDropClass = '';

        if (priceDrop > 0) {
            priceDropClass = 'text-green-500';
            percentageDropClass = 'text-green-500';
        } else if (priceDrop < 0) {
            priceDropClass = 'text-red-500';
            percentageDropClass = 'text-red-500';
        } else {
            priceDropClass = 'text-gray-500';
            percentageDropClass = 'text-gray-500';
        }

        return {
            priceDrop,
            percentageDrop,
            priceDropClass,
            percentageDropClass
        };
    };

    const handleColumnToggle = (columnKey: string) => {
        if (selectedColumns.includes(columnKey)) {
            setSelectedColumns(selectedColumns.filter(col => col !== columnKey));
        } else {
            setSelectedColumns([...selectedColumns, columnKey]);
        }
    };



    return (
        <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased">
            <div className="mx-auto max-w-screen-2xl px-4 lg:px-12">
                <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                        <div className="flex-1 flex items-center space-x-2">
                            <h5>
                                <span className="text-gray-500">All Products:</span>
                                <span className="dark:text-white">{totalProducts}</span>
                            </h5>
                            <h5 className="text-gray-500 dark:text-gray-400 ml-1">
                                {page}-{pageSize} ({totalProducts})
                            </h5>
                        </div>
                        <div className="flex-shrink-0 flex flex-col items-start md:flex-row md:items-center lg:justify-end space-y-3 md:space-y-0 md:space-x-3">
                            <button
                                type="button"
                                className="flex-shrink-0 inline-flex items-center justify-center py-2 px-3 text-xs font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                onClick={() => setTableSettingsVisible(!tableSettingsVisible)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="mr-2 w-4 h-4"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 01-.517.608 7.45 7.45 0 00-.478.198.798.798 0 01-.796-.064l-.453-.324a1.875 1.875 0 00-2.416.2l-.243.243a1.875 1.875 0 00-.2 2.416l.324.453a.798.798 0 01.064.796 7.448 7.448 0 00-.198.478.798.798 0 01-.608.517l-.55.092a1.875 1.875 0 00-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 01-.064.796l-.324.453a1.875 1.875 0 00.2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 01.796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 01.517-.608 7.52 7.52 0 00.478-.198.798.798 0 01.796.064l.453.324a1.875 1.875 0 002.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 01-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 001.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 01-.608-.517 7.507 7.507 0 00-.198-.478.798.798 0 01.064-.796l.324-.453a1.875 1.875 0 00-.2-2.416l-.243-.243a1.875 1.875 0 00-2.416-.2l-.453.324a.798.798 0 01-.796.064 7.462 7.462 0 00-.478-.198.798.798 0 01-.517-.608l-.091-.55a1.875 1.875 0 00-1.85-1.566h-.344zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                                    />
                                </svg>
                                Table settings
                            </button>
                        </div>
                    </div>
                    {tableSettingsVisible && (
                        <div className="flex flex-wrap space-x-3 p-4 border-t dark:border-gray-700">
                            {columns.map(column => (
                                <label key={column.key} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedColumns.includes(column.key)}
                                        onChange={() => handleColumnToggle(column.key)}
                                    />
                                    <span className="text-gray-700 dark:text-gray-400">{column.label}</span>
                                </label>
                            ))}
                        </div>
                    )}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
                        <div className="w-full md:w-1/2">
                            <form className="flex items-center">
                                <label htmlFor="simple-search" className="sr-only">Search</label>
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg
                                            aria-hidden="true"
                                            className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="simple-search"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        placeholder="Search for products"
                                        required
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                            <select
                                value={category}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="border p-2 rounded-md bg-white"
                            >
                                <option value="">All Categories</option>
                                {availableCategories.map((cat) => (
                                    <option key={cat} value={cat}>{categoryMap[cat] || cat}</option>
                                ))}
                            </select>
                            <select
                                value={String(sale)}
                                onChange={(e) => handleSaleChange(e.target.value === 'null' ? null : e.target.value === 'true')}
                                className="border p-2 rounded-md bg-white"
                            >
                                <option value="null">All</option>
                                <option value="true">Sale</option>
                                <option value="false">Not Sale</option>
                            </select>
                            <select
                                value={pageSize}
                                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                className="border p-2 rounded-md bg-white"
                            >
                                <option value={25}>25 per page</option>
                                <option value={50}>50 per page</option>
                                <option value={100}>100 per page</option>
                            </select>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    {selectedColumns.includes('indicator') && <th scope="col" className="p-4">Indicator</th>}
                                    {selectedColumns.includes('product') && <th scope="col" className="p-4">Product</th>}
                                    {selectedColumns.includes('category') && <th scope="col" className="p-4">Category</th>}
                                    {selectedColumns.includes('price') && <th scope="col" className="p-4">Price</th>}
                                    {selectedColumns.includes('unitPrice') && <th scope="col" className="p-4">Unit Price</th>}
                                    {selectedColumns.includes('promotionPrice') && <th scope="col" className="p-4">Promotion Price</th>}
                                    {selectedColumns.includes('lastUpdated') && <th scope="col" className="p-4">Last Updated</th>}
                                    {selectedColumns.includes('priceDrop') && <th scope="col" className="p-4">Price Drop</th>}
                                    {selectedColumns.includes('percentageDrop') && <th scope="col" className="p-4">Percentage Drop</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={9} className="text-center p-4">Loading...</td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan={9} className="text-center p-4 text-red-500">{error}</td>
                                    </tr>
                                ) : products.length > 0 ? (
                                    products.map((product) => {
                                        const indicator = calculatePriceIndicator(product);
                                        const indicatorClass = indicator === 'good' ? 'text-green-500' : indicator === 'bad' ? 'text-red-500' : 'text-gray-500';
                                        const indicatorText = indicator === 'good' ? 'Good to Buy' : indicator === 'bad' ? 'Wait for Better Price' : 'Neutral';
                                        const { priceDrop, percentageDrop, priceDropClass, percentageDropClass } = calculatePriceAnalysis(product);

                                        return (
                                            <tr key={product.productId} className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                {selectedColumns.includes('indicator') && <td className={`p-4 font-semibold ${indicatorClass}`}>{indicatorText}</td>}
                                                {selectedColumns.includes('product') && <td className="p-4">{product.title}</td>}
                                                {selectedColumns.includes('category') && <td className="p-4">{product.category}</td>}
                                                {selectedColumns.includes('price') && <td className="p-4">€{product.price?.toFixed(2) ?? 'N/A'}</td>}
                                                {selectedColumns.includes('unitPrice') && <td className="p-4">€{product.unitPrice?.toFixed(2) ?? 'N/A'} per {product.unitOfMeasure}</td>}
                                                {selectedColumns.includes('promotionPrice') && <td className="p-4">{product.promotions.length > 0 && product.promotions[0].promotionPrice !== null ? `€${product.promotions[0].promotionPrice?.toFixed(2) ?? 'N/A'}` : 'N/A'}</td>}
                                                {selectedColumns.includes('lastUpdated') && <td className="p-4">{product.lastUpdated ? new Date(product.lastUpdated).toLocaleDateString() : 'N/A'}</td>}
                                                {selectedColumns.includes('priceDrop') && <td className={`p-4 ${priceDropClass}`}>€{priceDrop.toFixed(2)}</td>}
                                                {selectedColumns.includes('percentageDrop') && <td className={`p-4 ${percentageDropClass}`}>{percentageDrop.toFixed(2)}%</td>}
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="text-center p-4">No products found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6 flex justify-center">
                        <nav className="inline-flex -space-x-px">
                            <button
                                onClick={() => handlePageChange(Math.max(page - 1, 1))}
                                className={`px-3 py-2 ml-0 leading-tight border rounded-l-lg ${page === 1 ? 'text-gray-300 bg-gray-100 cursor-not-allowed' : 'text-blue-600 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'}`}
                                disabled={page === 1}
                            >
                                Previous
                            </button>
                            {getPageNumbers().map((pageNumber, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(pageNumber === '...' ? page + 1 : Number(pageNumber))}
                                    disabled={pageNumber === '...'}
                                    className={`px-3 py-2 leading-tight border ${pageNumber === page ? 'text-blue-600 bg-blue-50 border-blue-300' : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'}`}
                                >
                                    {pageNumber}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
                                className={`px-3 py-2 leading-tight border rounded-r-lg ${page === totalPages ? 'text-gray-300 bg-gray-100 cursor-not-allowed' : 'text-blue-600 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'}`}
                                disabled={page === totalPages}
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </section>
    );
}
