"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { GlobalAPI_IP } from '../compoments/global';
import React from 'react';
import { Star, TrendingUp, TrendingDown, BarChart2, Tag } from 'lucide-react';

interface Promotion {
    promotionId: string;
    promotionType: string;
    startDate: string;
    endDate: string;
    offerText: string;
    attributes: string[];
    promotionPrice: number;
}

interface Product {
    dbId: number;
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
    products: Product[];
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
    alkohol: 'Alkohol',
    starostlivostODomacnost: 'Starostlivosť o Domácnosť',
    zdravieAKrasa: 'Zdravie a Krása',
};

const HomePage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [availableCategories, setAvailableCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sale, setSale] = useState<boolean | null>(
        localStorage.getItem('sale') === 'true'
            ? true
            : localStorage.getItem('sale') === 'false'
                ? false
                : null
    );
    const [category, setCategory] = useState<string>(localStorage.getItem('category') || '');
    const [pageSize, setPageSize] = useState<number>(Number(localStorage.getItem('pageSize')) || 25);
    const [page, setPage] = useState<number>(Number(localStorage.getItem('page')) || 1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get<ProductResponse>(`http://localhost:3000/products`, {
                    params: {
                        category: category || undefined,
                        sale,
                        pageSize,
                        page,
                    },
                    headers: {
                        accept: 'application/json',
                    },
                });
                setProducts(response.data.products || []);
                setAvailableCategories(response.data.availableCategories || []);
                setTotalPages(response.data.totalPages);
                setTotalProducts(response.data.totalProducts);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch products');
                setLoading(false);
            }
        };

        const searchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get<ProductResponse>(`http://localhost:3000/products/search`, {
                    params: {
                        searchTerm,
                        category: category || undefined,
                        sale,
                        pageSize,
                        page,
                    },
                    headers: {
                        accept: 'application/json',
                    },
                });
                setProducts(response.data.products || []);
                setTotalPages(response.data.totalPages);
                setTotalProducts(response.data.totalProducts);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch products');
                setLoading(false);
            }
        };

        if (searchTerm === '') {
            fetchProducts();
        } else {
            const delayDebounceFn = setTimeout(() => {
                searchProducts();
            }, 500);

            return () => clearTimeout(delayDebounceFn);
        }
    }, [category, sale, pageSize, page, searchTerm]);

    useEffect(() => {
        // Save preferences
        localStorage.setItem('category', category);
        localStorage.setItem('sale', String(sale));
        localStorage.setItem('page', String(page));
        localStorage.setItem('pageSize', String(pageSize));
    }, [category, sale, page, pageSize]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCategoryChange = (newCategory: string) => {
        setCategory(newCategory);
        setPage(1);
    };

    const handleSaleChange = (newSale: boolean | null) => {
        setSale(newSale);
        setPage(1);
    };

    const getPageNumbers = (): (number | string)[] => {
        const maxPagesToShow = 10;
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

    return (
        <>
            <div className="container mx-auto px-4 py-8 ">
                <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Product Catalog</h1>

                <div className="mb-8">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search products..."
                        className="w-full md:w-2/3 mx-auto block border border-gray-300 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out shadow-sm"
                    />
                </div>

                <div className="flex flex-col md:flex-row md:justify-between mb-8 space-y-4 md:space-y-0">
                    <div className="flex flex-wrap gap-4">
                        <select
                            value={category}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out shadow-sm"
                        >
                            <option value="">All Categories</option>
                            {availableCategories.map((cat) => (
                                <option key={cat} value={cat}>{categoryMap[cat] || cat}</option>
                            ))}
                        </select>

                        <select
                            value={String(sale)}
                            onChange={(e) => handleSaleChange(e.target.value === 'null' ? null : e.target.value === 'true')}
                            className="border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out shadow-sm"
                        >
                            <option value="null">All Products</option>
                            <option value="true">On Sale</option>
                            <option value="false">Regular Price</option>
                        </select>

                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out shadow-sm"
                        >
                            <option value={25}>25 per page</option>
                            <option value={50}>50 per page</option>
                            <option value={100}>100 per page</option>
                        </select>
                    </div>

                    <div className="text-right text-sm text-gray-600">
                        <p>Total Products: <span className="font-semibold">{totalProducts}</span></p>
                        <p>Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span></p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center min-h-screen h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 ">
                        {products && products.length > 0 ? products.map((product) => {
                            const promotion = product.promotions[0];
                            return (
                                <Link key={product.dbId} href={`/tesco/${product.productId}?category=${product.category}`} className="group">
                                    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:scale-105" style={{ width: '270px', height: '350px' }}>
                                        <div className="flex items-center justify-center h-[200px]">
                                            <img src={product.imageUrl} alt={product.title} className="w-[180px] h-[180px] object-contain p-2" />
                                        </div>
                                        <div className="p-4 h-[150px] flex flex-col justify-between">
                                            <div>
                                                <h2 className="text-sm font-semibold mb-2 truncate text-gray-800">{product.title}</h2>
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <p className="text-gray-600 text-xs">€{product.price?.toFixed(2) ?? 'N/A'}</p>
                                                    <p className="text-gray-500 text-xs">{product.unitPrice?.toFixed(2) ?? 'N/A'}/{product.unitOfMeasure}</p>
                                                </div>
                                                {promotion && promotion.promotionPrice !== null && (
                                                    <p className="text-green-600 text-sm font-semibold mb-1">Sale: €{promotion.promotionPrice.toFixed(2)}</p>
                                                )}
                                                {promotion && (
                                                    <p className="text-green-600 text-xs mb-2 truncate">{promotion.offerText}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        }) : (
                            <p className="text-gray-500 col-span-full text-center">No products found</p>
                        )}
                    </div>
                )}


                <div className="mt-8 flex justify-center">
                    <nav className="inline-flex rounded-lg shadow-sm bg-white border border-gray-300">
                        <button
                            onClick={() => handlePageChange(Math.max(page - 1, 1))}
                            className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors duration-200 ${page === 1 ? 'text-gray-300 bg-gray-100 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50'
                                }`}
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        {getPageNumbers().map((pageNumber, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(pageNumber === '...' ? page + 1 : Number(pageNumber))}
                                disabled={pageNumber === '...'}
                                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${pageNumber === page ? 'text-white bg-blue-600' : pageNumber === '...' ? 'text-gray-700 bg-white cursor-default' : 'text-gray-700 bg-white hover:bg-gray-50'
                                    } ${pageNumber === page ? 'rounded-lg' : ''}`}
                            >
                                {pageNumber}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
                            className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors duration-200 ${page === totalPages ? 'text-gray-300 bg-gray-100 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50'
                                }`}
                            disabled={page === totalPages}
                        >
                            Next
                        </button>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default HomePage;
