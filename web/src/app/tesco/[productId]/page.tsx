"use client";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { GlobalAPI_IP } from "../../compoments/global";
import ProductPriceChart from "../utils/ProductPriceChart";
import HistoryTable from "../utils/HistoryTable";



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

interface PageProps {
    params: {
        productId: string;
    };
    searchParams: {
        category: string;
    };
}

export default function Page({ params, searchParams }: PageProps) {
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [history, setHistory] = useState<ProductDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [priceDrop, setPriceDrop] = useState<number | null>(null);
    const [percentageDrop, setPercentageDrop] = useState<number | null>(null);
    const [priceStatus, setPriceStatus] = useState<'increase' | 'decrease' | null>(null);

    useEffect(() => {
        const fetchProductDetail = async () => {
            setLoading(true);
            setError(null);
            console.log('Fetching product details for:', params.productId, 'with category:', searchParams.category);

            try {
                const response = await axios.get<ProductDetail[]>(`${GlobalAPI_IP}/products/${searchParams.category}/${params.productId}`, {
                    headers: {
                        accept: 'application/json',
                    },
                });
                console.log('Product details fetched:', response.data);
                if (response.data.length > 0) {
                    const sortedData = response.data.sort((a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime());
                    setProduct(sortedData[sortedData.length - 1]);
                    setHistory(sortedData);

                    const initialPrice = sortedData[0].promotions.length > 0 && sortedData[0].promotions[0].promotionPrice !== null
                        ? sortedData[0].promotions[0].promotionPrice
                        : sortedData[0].price;

                    const latestPrice = sortedData[sortedData.length - 1].promotions.length > 0 && sortedData[sortedData.length - 1].promotions[0].promotionPrice !== null
                        ? sortedData[sortedData.length - 1].promotions[0].promotionPrice
                        : sortedData[sortedData.length - 1].price;

                    if (initialPrice !== null && latestPrice !== null) {
                        const priceDifference = initialPrice - latestPrice;
                        const percentageDifference = (priceDifference / initialPrice) * 100;

                        setPriceDrop(priceDifference);
                        setPercentageDrop(percentageDifference);
                        setPriceStatus(priceDifference > 0 ? 'decrease' : 'increase');
                    }
                } else {
                    setProduct(null);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching product details:', err);
                setError('Failed to fetch product details');
                setLoading(false);
            }
        };

        fetchProductDetail();
    }, [params.productId, searchParams.category]);

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

    // Extract the dates and prices
    const chartCategories = Object.keys(consolidatedHistory);
    const combinedData = Object.values(consolidatedHistory);

    return (
        <div className="min-h-screen py-10 px-4 lg:px-20 bg-gray-100">
            {loading ? (
                <div role="status" className="flex justify-center items-center h-64">
                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : product ? (
                <div className="grid gap-8 grid-cols-1 xl:grid-cols-3">
                    <div className="col-span-1 bg-white rounded-lg shadow-lg p-6">
                        <img className="w-full h-60 object-contain rounded-md mb-6" src={product.imageUrl} alt={product.title} />
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.title}</h1>
                        <div className="space-y-2">
                            <p className="text-xl text-gray-700">Price: <span className="font-semibold text-blue-600">€{product.price?.toFixed(2) ?? 'N/A'}</span></p>
                            <p className="text-md text-gray-600">Unit Price: €{product.unitPrice?.toFixed(2) ?? 'N/A'} per {product.unitOfMeasure ?? ''}</p>
                            <p className="text-md text-gray-600">Aisle: {product.aisleName ?? 'N/A'}</p>
                            <p className="text-md text-gray-600">Department: {product.superDepartmentName ?? 'N/A'}</p>
                            <p className="text-md text-gray-600">Sale: {product.hasPromotions ? 'Yes' : 'No'}</p>
                            {product.hasPromotions && product.promotions.length > 0 && (
                                <p className="text-md text-green-600 font-semibold">Promotion Price: €{product.promotions[0].promotionPrice?.toFixed(2) ?? 'N/A'} - {product.promotions[0].offerText}</p>
                            )}
                            <p className="text-sm text-gray-500">Last Updated: {product.lastUpdated ? new Date(product.lastUpdated).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        {priceDrop !== null && percentageDrop !== null && (
                            <div className="mt-6 p-4">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Price Analysis</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={`p-4  rounded-lg ${priceStatus === 'decrease' ? 'text-green-600' : 'text-red-600'}`}>
                                        <p className="text-xl font-semibold text-gray-700">Price {priceStatus === 'decrease' ? 'Drop' : 'Increase'}</p>
                                        <p className="text-2xl font-bold">€{Math.abs(priceDrop).toFixed(2)}</p>
                                    </div>
                                    <div className={`p-4  rounded-lg ${priceStatus === 'decrease' ? 'text-green-600' : 'text-red-600'}`}>
                                        <p className="text-xl font-semibold text-gray-700">Percentage {priceStatus === 'decrease' ? 'Drop' : 'Increase'}</p>
                                        <p className="text-2xl font-bold">{Math.abs(percentageDrop).toFixed(2)}%</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="col-span-2 space-y-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Price History</h2>
                            <HistoryTable history={history} />
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Price History Chart</h2>
                            <ProductPriceChart data={combinedData} categories={chartCategories} />
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 text-center">Product not found</p>
            )}
        </div>
    );
}
