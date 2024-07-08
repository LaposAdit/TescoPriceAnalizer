"use client";
import React, { useState, useEffect } from "react";
import axios from 'axios';
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

interface AnalyticsData {
    id: number;
    productId: string;
    priceDrop: number;
    priceIncrease: number;
    percentageChange: number;
    isBuyRecommended: string;
    isOnSale: boolean;
    previousPrice: number;
    priceChangeStatus: string;
    averagePrice: number;
    medianPrice: number;
    priceStdDev: number;
    promotionImpact: number | null;
    lastCalculated: string;
    createdAt: string;
    updatedAt: string;
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
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

    useEffect(() => {
        const fetchProductDetail = async () => {
            setLoading(true);
            setError(null);
            console.log('Fetching product details for:', params.productId, 'with category:', searchParams.category);

            try {
                const productResponse = await axios.get<ProductDetail[]>(`http://localhost:3000/products/${searchParams.category}/${params.productId}`, {
                    headers: {
                        accept: 'application/json',
                    },
                });
                console.log('Product details fetched:', productResponse.data);
                if (productResponse.data.length > 0) {
                    const sortedData = productResponse.data.sort((a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime());
                    setProduct(sortedData[sortedData.length - 1]);
                    setHistory(sortedData);

                    const analyticsResponse = await axios.get<AnalyticsData>(`http://localhost:3000/products/analytics/${params.productId}`, {
                        headers: {
                            accept: 'application/json',
                        },
                    });
                    console.log('Analytics data fetched:', analyticsResponse.data);
                    setAnalytics(analyticsResponse.data);
                } else {
                    setProduct(null);
                    setAnalytics(null);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching product details or analytics:', err);
                setError('Failed to fetch product details or analytics');
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
                <div className="flex flex-col xl:flex-row gap-8">
                    <div className="w-full xl:w-1/3">
                        
                        <div className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-4">
                            <img className="w-40 h-40 object-contain rounded-md" src={product.imageUrl} alt={product.title} />
                            <div className="flex flex-col space-y-1">
                                <h1 className="text-xl font-bold text-gray-800">{product.title}</h1>
                                <p className="text-lg text-gray-700">Price: <span className="font-semibold text-blue-600">€{product.price?.toFixed(2) ?? 'N/A'}</span></p>
                                <p className="text-sm text-gray-600">Unit Price: €{product.unitPrice?.toFixed(2) ?? 'N/A'} per {product.unitOfMeasure ?? ''}</p>
                                <div className="flex items-center space-x-2">
                                    <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">Sale: {product.hasPromotions ? 'Yes' : 'No'}</span>
                                </div>
                            </div>
                        </div>


                        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                            {analytics && (
                                <div className="">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Price Analysis</h2>
                                    <div className="p-4 bg-blue-100 rounded-lg flex flex-col items-center mb-4">
                                        <p className="text-xl font-semibold text-gray-700">Actual Price</p>
                                        <p className="text-2xl font-bold text-blue-600">€{(product.promotions.length > 0 && product.promotions[0].promotionPrice !== null ? product.promotions[0].promotionPrice : product.price).toFixed(2)}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className={`p-4 rounded-lg ${analytics.priceChangeStatus === 'decreased' ? 'bg-green-100' : 'bg-red-100'} flex flex-col items-center`}>
                                            <p className="text-xl font-semibold text-gray-700">Price {analytics.priceChangeStatus === 'decreased' ? 'Drop' : 'Increase'}</p>
                                            <p className="text-2xl font-bold">{analytics.priceChangeStatus === 'decreased' ? '-' : '+'}€{(analytics.priceChangeStatus === 'decreased' ? analytics.priceDrop : analytics.priceIncrease).toFixed(2)}</p>
                                        </div>
                                        <div className={`p-4 rounded-lg ${analytics.priceChangeStatus === 'decreased' ? 'bg-green-100' : 'bg-red-100'} flex flex-col items-center`}>
                                            <p className="text-xl font-semibold text-gray-700">Percentage {analytics.priceChangeStatus === 'decreased' ? 'Drop' : 'Increase'}</p>
                                            <p className="text-2xl font-bold">{analytics.priceChangeStatus === 'decreased' ? '-' : '+'}{Math.abs(analytics.percentageChange).toFixed(2)}%</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
                                            <p className="text-md font-semibold text-gray-700">Is Buy Recommended</p>
                                            <p className="text-lg font-bold text-blue-600">{analytics.isBuyRecommended === 'yes' ? 'Yes' : 'No'}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
                                            <p className="text-md font-semibold text-gray-700">Average Price</p>
                                            <p className="text-lg font-bold text-yellow-600">€{analytics.averagePrice?.toFixed(2) ?? 'N/A'}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
                                            <p className="text-md font-semibold text-gray-700">Median Price</p>
                                            <p className="text-lg font-bold text-yellow-600">€{analytics.medianPrice?.toFixed(2) ?? 'N/A'}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
                                            <p className="text-md font-semibold text-gray-700">Price Standard Deviation</p>
                                            <p className="text-lg font-bold text-yellow-600">€{analytics.priceStdDev?.toFixed(2) ?? 'N/A'}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
                                            <p className="text-md font-semibold text-gray-700">Promotion Impact</p>
                                            <p className="text-lg font-bold text-green-600">€{analytics.promotionImpact?.toFixed(2) ?? 'N/A'}</p>
                                        </div>
                                        <div className={`bg-white p-4 rounded-lg shadow flex flex-col items-center ${analytics.priceChangeStatus === 'decreased' ? 'text-green-600' : 'text-red-600'}`}>
                                            <p className="text-md font-semibold text-gray-700">Price Change Status</p>
                                            <p className="text-lg font-bold">{analytics.priceChangeStatus === 'decreased' ? 'Decreased' : 'Increased'}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
                                            <p className="text-md font-semibold text-gray-700">Last Calculated</p>
                                            <p className="text-sm text-gray-500">{new Date(analytics.lastCalculated).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 space-y-6">
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
