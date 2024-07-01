"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { GlobalAPI_IP } from '../compoments/global';
import React from 'react';

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
    alkohol: 'Alkohol'
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
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Products</h1>

            <div className="mb-6 flex justify-center">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search products..."
                    className="border p-2 rounded-md bg-white w-2/3"
                />
            </div>

            <div className="flex flex-col md:flex-row md:justify-between mb-6">
                <div className="flex space-x-4">
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
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="border p-2 rounded-md bg-white"
                    >
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>

                <div className="mt-4 md:mt-0">
                    <p className="text-gray-700">Total Products: {totalProducts}</p>
                    <p className="text-gray-700">Page {page} of {totalPages}</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64 min-h-screen">
                    <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                </div>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products && products.length > 0 ? products.map((product) => {
                        const promotion = product.promotions[0];
                        return (
                            <div key={product.dbId} className="bg-white border rounded-lg shadow-md p-4 flex flex-col">
                                <img src={product.imageUrl} alt={product.title} className="object-contain h-40 mb-4 rounded-lg" />
                                <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
                                <p className="text-gray-700 mb-1">Price: €{product.price?.toFixed(2) ?? 'N/A'}</p>
                                {promotion && promotion.promotionPrice !== null && (
                                    <p className="text-green-500 mb-1">Sale Price: €{promotion.promotionPrice.toFixed(2)}</p>
                                )}
                                <p className="text-gray-700 mb-1">Unit Price: €{product.unitPrice?.toFixed(2) ?? 'N/A'} per {product.unitOfMeasure}</p>
                                <p className="text-gray-700 mb-1">Sale: {product.hasPromotions ? 'Yes' : 'No'}</p>
                                <p className="text-gray-700 mb-1">Aisle: {product.aisleName}</p>
                                <p className="text-gray-700 mb-1">Department: {product.superDepartmentName}</p>
                                <p className="text-gray-700 mb-1">Department: {product.lastUpdated}</p>
                                {promotion && (
                                    <p className="text-green-500 mb-2">{promotion.offerText}</p>
                                )}
                                <Link className="text-blue-500 hover:underline mt-auto" href={`/tesco/${product.productId}?category=${product.category}`}>
                                    View Details
                                </Link>
                            </div>
                        );
                    }) : (
                        <p className="text-gray-500">No products found</p>
                    )}
                </div>
            )}

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
    );
};

export default HomePage;
