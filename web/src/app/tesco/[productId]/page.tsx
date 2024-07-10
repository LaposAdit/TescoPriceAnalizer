"use client";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import ProductPriceChart from "../utils/ProductPriceChart";
import HistoryTable from "../utils/HistoryTable";
import { useUser } from '@clerk/clerk-react';
import Header from "@/app/compoments/navbar";
import { Heart, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Tag, Percent} from 'lucide-react';

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

export default function Page({ params, searchParams }: PageProps) {
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [history, setHistory] = useState<ProductDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const { user } = useUser();

    const fetchFavoriteStatus = async () => {
        if (!user || !product) return;

        try {
            const response = await axios.get<boolean>(`http://localhost:3000/favorites/isFavorite?userId=${user.id}&productId=${product.productId}`, {
                headers: {
                    'accept': '*/*'
                }
            });
            setIsFavorite(response.data);
        } catch (err) {
            console.error('Error checking favorite status:', err);
        }
    };

    const addToFavorites = async () => {
        if (!user) {
            console.error("User not logged in");
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/favorites', {
                userId: user.id,
                productId: product?.productId,
                category: product?.category
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Added to favorites:', response.data);
            setIsFavorite(true);
        } catch (err) {
            console.error('Error adding to favorites:', err);
        }
    };

    const removeFromFavorites = async () => {
        if (!user || !product) {
            console.error("User not logged in or product not loaded");
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:3000/favorites?userId=${user.id}&productId=${product.productId}`, {
                headers: {
                    'accept': '*/*'
                }
            });

            console.log('Removed from favorites:', response.data);
            setIsFavorite(false);
        } catch (err) {
            console.error('Error removing from favorites:', err);
        }
    };

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

    useEffect(() => {
        fetchFavoriteStatus();
    }, [product]);

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
        <>
            <div className="min-h-screen rounded-3xl bg-gray-100  py-12 px-4 sm:px-6 lg:px-8">
                {loading ? (
                    <div role="status" className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <div className="text-red-500 text-xl font-semibold">{error}</div>
                    </div>
                ) : product ? (
                    <div className="max-w-7xl mx-auto">

                        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
                            <div className="p-8">
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-1/3 flex justify-center items-start mb-6 md:mb-0">
                                        <div className="w-[250px] h-[250px] flex items-center justify-center bg-white rounded-lg overflow-hidden shadow-inner">
                                            <img
                                                src={product.imageUrl}
                                                alt={product.title}
                                                className="w-[500px] h-[500px] object-contain"
                                                style={{ mixBlendMode: 'multiply' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="md:w-2/3 md:pl-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex space-x-2">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                    <Tag size={16} className="mr-1" />
                                                    {categoryMap[product.category] || product.category}
                                                </span>
                                                {product.hasPromotions ? (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                        <Percent size={16} className="mr-1" />
                                                        On Sale
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                                        <DollarSign size={16} className="mr-1" />
                                                        Regular Price
                                                    </span>
                                                )}
                                            </div>
                                            {isFavorite ? (
                                                <button
                                                    onClick={removeFromFavorites}
                                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-full text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                >
                                                    <Heart size={16} className="mr-1" />
                                                    Remove from Favorites
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={addToFavorites}
                                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    <Heart size={16} className="mr-1" />
                                                    Add to Favorites
                                                </button>
                                            )}
                                        </div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
                                        <div className="mb-6">
                                            {product.hasPromotions && product.promotions.length > 0 && product.promotions[0].promotionPrice !== null ? (
                                                <>
                                                    <div className="flex items-center">
                                                        <span className="text-4xl font-bold text-green-600">€{product.promotions[0].promotionPrice.toFixed(2)}</span>
                                                        <span className="ml-2 text-lg text-gray-600">per {product.unitOfMeasure}</span>
                                                    </div>
                                                    <div className="mt-2 flex items-center">
                                                        <span className="text-xl text-gray-500 line-through">€{product.price.toFixed(2)}</span>
                                                        <span className="ml-2 text-sm text-green-600 font-semibold">
                                                            Save €{(product.price - product.promotions[0].promotionPrice).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </>
                                            ) : analytics && analytics.priceChangeStatus === 'increased' ? (
                                                <>
                                                    <div className="flex items-center">
                                                        <span className="text-4xl font-bold text-indigo-600">€{product.price.toFixed(2)}</span>
                                                        <span className="ml-2 text-lg text-gray-600">per {product.unitOfMeasure}</span>
                                                    </div>
                                                    <div className="mt-2 flex items-center">
                                                        <span className="text-xl text-gray-500 line-through">€{analytics.previousPrice.toFixed(2)}</span>
                                                        <span className="ml-2 text-sm text-red-600 font-semibold">
                                                            Increased by €{(product.price - analytics.previousPrice).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex items-center">
                                                    <span className="text-4xl font-bold text-indigo-600">€{product.price?.toFixed(2) ?? 'N/A'}</span>
                                                    <span className="ml-2 text-lg text-gray-600">per {product.unitOfMeasure}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-sm text-gray-500 mb-1">Unit Price</p>
                                                <p className="text-lg font-semibold">€{product.unitPrice?.toFixed(2) ?? 'N/A'} per {product.unitOfMeasure}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-sm text-gray-500 mb-1">Promotion Status</p>
                                                {product.hasPromotions ? (
                                                    <p className="text-lg font-semibold text-green-600 flex items-center">
                                                        <ShoppingCart size={20} className="mr-2" />
                                                        On Sale
                                                    </p>
                                                ) : (
                                                    <p className="text-lg font-semibold text-gray-600 flex items-center">
                                                        <DollarSign size={20} className="mr-2" />
                                                        Regular Price
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {analytics && (
                            <div className="mt-12 bg-white shadow-xl rounded-lg overflow-hidden">
                                <div className="px-8 py-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Price Analysis</h2>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        <div className="bg-blue-50 rounded-lg p-6">
                                            <div className="text-blue-500 text-sm font-medium uppercase">Current Price</div>
                                            <div className="mt-2 flex items-baseline">
                                                <span className="text-3xl font-semibold text-blue-600">
                                                    €{(product.promotions.length > 0 && product.promotions[0].promotionPrice !== null ? product.promotions[0].promotionPrice : product.price).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`rounded-lg p-6 ${analytics.priceChangeStatus === 'decreased' ? 'bg-green-50' : 'bg-red-50'}`}>
                                            <div className={`${analytics.priceChangeStatus === 'decreased' ? 'text-green-500' : 'text-red-500'} text-sm font-medium uppercase`}>
                                                Price {analytics.priceChangeStatus === 'decreased' ? 'Drop' : 'Increase'}
                                            </div>
                                            <div className="mt-2 flex items-baseline">
                                                <span className={`text-3xl font-semibold ${analytics.priceChangeStatus === 'decreased' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {analytics.priceChangeStatus === 'decreased' ? '-' : '+'}€{(analytics.priceChangeStatus === 'decreased' ? analytics.priceDrop : analytics.priceIncrease).toFixed(2)}
                                                </span>
                                                <span className="ml-2 text-sm text-gray-500">
                                                    ({Math.abs(analytics.percentageChange).toFixed(2)}%)
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <div className="text-gray-500 text-sm font-medium uppercase">Buy Recommendation</div>
                                            <div className="mt-2 flex items-center">
                                                <span className={`text-2xl font-semibold ${analytics.isBuyRecommended === 'yes' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {analytics.isBuyRecommended === 'yes' ? 'Recommended' : 'Not Recommended'}
                                                </span>
                                                {analytics.isBuyRecommended === 'yes' ? (
                                                    <TrendingUp size={24} className="ml-2 text-green-500" />
                                                ) : (
                                                    <TrendingDown size={24} className="ml-2 text-red-500" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <div className="text-gray-500 text-sm font-medium uppercase">Average Price</div>
                                            <div className="mt-2 text-2xl font-semibold text-gray-900">€{analytics.averagePrice?.toFixed(2) ?? 'N/A'}</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <div className="text-gray-500 text-sm font-medium uppercase">Median Price</div>
                                            <div className="mt-2 text-2xl font-semibold text-gray-900">€{analytics.medianPrice?.toFixed(2) ?? 'N/A'}</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <div className="text-gray-500 text-sm font-medium uppercase">Price Standard Deviation</div>
                                            <div className="mt-2 text-2xl font-semibold text-gray-900">€{analytics.priceStdDev?.toFixed(2) ?? 'N/A'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-12 space-y-12">
                            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                                <div className="px-8 py-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Price History</h2>
                                    <HistoryTable history={history} />
                                </div>
                            </div>
                            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                                <div className="px-8 py-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Price History Chart</h2>
                                    <ProductPriceChart data={combinedData} categories={chartCategories} />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-xl font-semibold">Product not found</div>
                    </div>
                )}
            </div>
        </>
    );
}
